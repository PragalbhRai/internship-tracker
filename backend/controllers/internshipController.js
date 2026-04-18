const db = require('../config/db');

exports.getInternships = async (req, res) => {
    try {
        if (req.user.role === 'STUDENT') {
            const [studentRes] = await db.query('SELECT cgpa, active_backlogs, year_of_study, department FROM students WHERE student_id = ?', [req.user.user_id]);
            if (!studentRes.length) return res.status(404).json({ error: 'Student profile not found.' });
            
            const student = studentRes[0];
            const [internships] = await db.query(`
                SELECT i.*, c.name as company_name 
                FROM internships i
                JOIN companies c ON i.company_id = c.company_id
                WHERE (i.min_cgpa IS NULL OR ? >= i.min_cgpa)
                  AND (i.max_active_backlogs IS NULL OR ? <= i.max_active_backlogs)
                  AND (i.allowed_years IS NULL OR FIND_IN_SET(?, i.allowed_years) > 0)
                  AND (i.allowed_department IS NULL OR FIND_IN_SET(?, i.allowed_department) > 0)
            `, [student.cgpa, student.active_backlogs, student.year_of_study, student.department]);
            
            return res.json(internships);
        } else if (req.user.role === 'COMPANY_POC') {
            const [internships] = await db.query('SELECT * FROM internships WHERE company_id = ?', [req.user.user_id]);
            return res.json(internships);
        } else {
            // ADMIN
            const [internships] = await db.query('SELECT i.*, c.name as company_name FROM internships i JOIN companies c ON i.company_id = c.company_id');
            return res.json(internships);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch internships.' });
    }
};

exports.createInternship = async (req, res) => {
    try {
        const { title, description, type, stipend, location, deadline, min_cgpa, max_active_backlogs, allowed_years, allowed_department, company_id } = req.body;
        
        let cid = req.user.role === 'COMPANY_POC' ? req.user.user_id : company_id;
        if (!cid) return res.status(400).json({ error: 'Company ID is required.' });

        const [result] = await db.query(
            `INSERT INTO internships 
             (company_id, title, description, type, stipend, location, deadline, min_cgpa, max_active_backlogs, allowed_years, allowed_department) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [cid, title, description, type, stipend, location, deadline, min_cgpa || 0, max_active_backlogs || 0, allowed_years || null, allowed_department || null]
        );
        res.status(201).json({ message: 'Internship created', internship_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create internship.', details: error.message });
    }
};

exports.updateInternship = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        // Ensure COMPANY_POC only updates their own internship (Admin can update any)
        if (req.user.role === 'COMPANY_POC') {
            const [check] = await db.query('SELECT * FROM internships WHERE internship_id = ? AND company_id = ?', [id, req.user.user_id]);
            if (!check.length) return res.status(403).json({ error: 'Permission denied.' });
        }

        // Construct dynamic update query
        const keys = Object.keys(updates);
        if (keys.length === 0) return res.status(400).json({ error: 'No data to update.' });

        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(id);

        await db.query(`UPDATE internships SET ${setClause} WHERE internship_id = ?`, values);
        res.status(200).json({ message: 'Internship updated successfully.' });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update internship.' });
    }
};

exports.deleteInternship = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM internships WHERE internship_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found.' });
        res.status(200).json({ message: 'Internship deleted.' });
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete internship.' });
    }
};
