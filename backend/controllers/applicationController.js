const db = require('../config/db');

exports.apply = async (req, res) => {
    try {
        const { internship_id } = req.body;
        const student_id = req.user.user_id;

        // Using stored procedure for transaction-wrapped atomic insert
        await db.query('CALL apply_to_internship(?, ?)', [student_id, internship_id]);
        
        res.status(201).json({ message: 'Application submitted successfully.' });
    } catch (error) {
        console.error("DB Error: ", error);
        if (error.sqlState === '45000') {
            return res.status(400).json({ error: error.message });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'You have already applied for this internship.' });
        }
        res.status(500).json({ error: 'Failed to apply.', details: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application_id = req.params.id;
        const user_id = req.user.user_id;

        if (req.user.role === 'COMPANY_POC') {
             const [check] = await db.query(`
                SELECT a.application_id FROM applications a 
                JOIN internships i ON a.internship_id = i.internship_id 
                WHERE a.application_id = ? AND i.company_id = ?`, 
                [application_id, user_id]
             );
             if (!check.length) return res.status(403).json({ error: 'Permission denied.' });
        }

        // Must run in the same connection to preserve session variable @current_user_id for Trigger
        const connection = await db.getConnection();
        try {
            await connection.query('SET @current_user_id = ?', [user_id]);
            const [result] = await connection.query('UPDATE applications SET status = ? WHERE application_id = ?', [status, application_id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Application not found.' });
            
            res.status(200).json({ message: 'Status updated successfully.' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update status.', details: error.message });
    }
};

exports.myApplications = async (req, res) => {
    try {
        const student_id = req.user.user_id;
        const [applications] = await db.query(`
            SELECT a.*, i.title, i.company_id, c.name as company_name 
            FROM applications a
            JOIN internships i ON a.internship_id = i.internship_id
            JOIN companies c ON i.company_id = c.company_id
            WHERE a.student_id = ?
        `, [student_id]);
        
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch applications.' });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        let applications = [];
        if (req.user.role === 'ADMIN') {
            const [rows] = await db.query(`SELECT a.*, s.first_name, s.last_name, s.cgpa, s.department, i.title, i.company_id FROM applications a JOIN students s ON a.student_id = s.student_id JOIN internships i ON a.internship_id = i.internship_id`);
            applications = rows;
        } else if (req.user.role === 'COMPANY_POC') {
            const [rows] = await db.query(`SELECT a.*, s.first_name, s.last_name, s.cgpa, s.department, i.title FROM applications a JOIN students s ON a.student_id = s.student_id JOIN internships i ON a.internship_id = i.internship_id WHERE i.company_id = ?`, [req.user.user_id]);
            applications = rows;
        } else {
            return res.status(403).json({error: 'Forbidden'});
        }
        res.status(200).json(applications);
    } catch(e) { res.status(500).json({error: 'Failed'}) }
};
