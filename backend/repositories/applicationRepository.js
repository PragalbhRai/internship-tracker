const db = require('../config/db');

class ApplicationRepository {
    async checkEligibility(studentId, internshipId) {
        const connection = await db.getConnection();
        try {
            await connection.query('CALL check_eligibility(?, ?, @is_eligible)', [studentId, internshipId]);
            const [rows] = await connection.query('SELECT @is_eligible AS is_eligible');
            return rows[0].is_eligible;
        } finally {
            connection.release();
        }
    }

    async applyToInternship(studentId, internshipId) {
        await db.query('CALL apply_to_internship(?, ?)', [studentId, internshipId]);
    }

    async getApplicationForCompanyCheck(applicationId, companyId) {
        const [check] = await db.query(`
            SELECT a.application_id FROM applications a 
            JOIN internships i ON a.internship_id = i.internship_id 
            WHERE a.application_id = ? AND i.company_id = ?`, 
            [applicationId, companyId]
        );
        return check;
    }

    async updateStatus(applicationId, status, currentUserId) {
        const connection = await db.getConnection();
        try {
            await connection.query('SET @current_user_id = ?', [currentUserId]);
            const [result] = await connection.query('UPDATE applications SET status = ? WHERE application_id = ?', [status, applicationId]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    async getStudentApplications(studentId) {
        const [applications] = await db.query(`
            SELECT a.*, i.title, i.company_id, c.name as company_name 
            FROM applications a
            JOIN internships i ON a.internship_id = i.internship_id
            JOIN companies c ON i.company_id = c.company_id
            WHERE a.student_id = ?
        `, [studentId]);
        return applications;
    }

    async getAllApplicationsAdmin() {
        const [rows] = await db.query(`SELECT a.*, s.first_name, s.last_name, s.cgpa, s.department, i.title, i.company_id FROM applications a JOIN students s ON a.student_id = s.student_id JOIN internships i ON a.internship_id = i.internship_id`);
        return rows;
    }

    async getAllApplicationsCompany(companyId) {
        const [rows] = await db.query(`
            SELECT a.*, s.first_name, s.last_name, s.cgpa, s.department, s.resume_url, u.email AS student_email, i.title
            FROM applications a
            JOIN students s ON a.student_id = s.student_id
            JOIN users u ON s.student_id = u.user_id
            JOIN internships i ON a.internship_id = i.internship_id
            WHERE i.company_id = ?
        `, [companyId]);
        return rows;
    }
}

module.exports = new ApplicationRepository();
