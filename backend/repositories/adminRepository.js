const db = require('../config/db');

class AdminRepository {
    async getPlacementStats() {
        const [rows] = await db.query(`
            SELECT COUNT(DISTINCT student_id) as total_placed 
            FROM applications 
            WHERE status = 'SELECTED'
        `);
        return rows[0].total_placed;
    }

    async getAvgStipend() {
        const [rows] = await db.query(`
            SELECT AVG(i.stipend) as avg_stipend 
            FROM applications a
            JOIN internships i ON a.internship_id = i.internship_id
            WHERE a.status = 'SELECTED' AND i.stipend > 0
        `);
        return rows[0].avg_stipend || 0;
    }

    async getApplicationsPerInternship() {
        const [rows] = await db.query(`
            SELECT i.title, i.company_id, COUNT(a.application_id) as application_count
            FROM internships i
            LEFT JOIN applications a ON i.internship_id = a.internship_id
            GROUP BY i.internship_id
        `);
        return rows;
    }

    async getStudentsWithPlacementStatus() {
        const [students] = await db.query(`
            SELECT s.*, u.email,
            (SELECT COUNT(*) FROM applications WHERE student_id = s.student_id AND status = 'SELECTED') > 0 as is_placed
            FROM students s
            JOIN users u ON s.student_id = u.user_id
        `);
        return students;
    }
}

module.exports = new AdminRepository();
