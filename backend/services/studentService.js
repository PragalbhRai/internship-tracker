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
}

module.exports = new StudentService();
