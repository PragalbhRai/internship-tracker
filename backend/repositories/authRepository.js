const db = require('../config/db');

class AuthRepository {
    async findUserByEmail(email) {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return users[0];
    }

    async beginTransaction() {
        const connection = await db.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    async insertUser(connection, email, passwordHash, role) {
        const [result] = await connection.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, role]
        );
        return result.insertId;
    }

    async insertStudent(connection, userId, details) {
        const { roll_number, first_name, last_name, department, year_of_study, cgpa } = details;
        await connection.query(
            `INSERT INTO students (student_id, roll_number, first_name, last_name, department, year_of_study, cgpa) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, roll_number, first_name, last_name, department, year_of_study, cgpa]
        );
    }

    async insertCompany(connection, userId, details) {
        const { name, industry, website, description } = details;
        await connection.query(
            `INSERT INTO companies (company_id, name, industry, website, description) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, name, industry, website, description]
        );
    }
}

module.exports = new AuthRepository();
