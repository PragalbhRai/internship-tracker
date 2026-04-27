const db = require('../config/db');
const AppError = require('../utils/AppError');

class StudentService {
    async getProfile(studentId) {
        const [rows] = await db.query(`
            SELECT s.*, u.email 
            FROM students s 
            JOIN users u ON s.student_id = u.user_id 
            WHERE s.student_id = ?
        `, [studentId]);

        if (rows.length === 0) {
            throw new AppError('Student profile not found.', 404);
        }

        return rows[0];
    }

    async updateProfile(studentId, resumeUrl) {
        await db.query('UPDATE students SET resume_url = ? WHERE student_id = ?', [resumeUrl || null, studentId]);
        return this.getProfile(studentId);
    }
}

module.exports = new StudentService();
