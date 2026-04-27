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

    async updateStudent(studentId, cgpa, activeBacklogs) {
        const [result] = await db.query(
            'UPDATE students SET cgpa = ?, active_backlogs = ? WHERE student_id = ?',
            [cgpa, activeBacklogs, studentId]
        );
        return result.affectedRows;
    }

    async getAllApplicationsAdmin(filters = {}) {
        let query = `
            SELECT a.application_id, a.status, a.applied_at,
                   s.first_name, s.last_name, s.roll_number, s.department, s.cgpa,
                   i.title, c.name as company_name
            FROM applications a
            JOIN students s ON a.student_id = s.student_id
            JOIN internships i ON a.internship_id = i.internship_id
            LEFT JOIN companies c ON i.company_id = c.company_id
            WHERE 1=1
        `;
        const params = [];

        if (filters.status) {
            query += ' AND a.status = ?';
            params.push(filters.status);
        }

        if (filters.department) {
            query += ' AND s.department = ?';
            params.push(filters.department);
        }

        query += ' ORDER BY a.applied_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    }

    async getDepartmentStats() {
        const [rows] = await db.query(`
            SELECT 
                s.department,
                COUNT(DISTINCT s.student_id) as total_students,
                COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.student_id END) as placed_students,
                ROUND(
                    (COUNT(DISTINCT CASE WHEN a.status = 'SELECTED' THEN s.student_id END) / COUNT(DISTINCT s.student_id)) * 100,
                    2
                ) as placement_percentage
            FROM students s
            LEFT JOIN applications a ON s.student_id = a.student_id
            GROUP BY s.department
            ORDER BY placement_percentage DESC
        `);
        return rows;
    }
}

module.exports = new AdminRepository();
