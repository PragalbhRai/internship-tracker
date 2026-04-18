const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    const { email, password, role, ...details } = req.body;
    let connection;
    try {
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required.' });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User
        const [userResult] = await connection.query(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, role]
        );
        const userId = userResult.insertId;

        // Insert into specific role table
        if (role === 'STUDENT') {
            const { roll_number, first_name, last_name, department, year_of_study, cgpa } = details;
            await connection.query(
                `INSERT INTO students (student_id, roll_number, first_name, last_name, department, year_of_study, cgpa) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, roll_number, first_name, last_name, department, year_of_study, cgpa]
            );
        } else if (role === 'COMPANY_POC') {
            const { name, industry, website, description } = details;
            await connection.query(
                `INSERT INTO companies (company_id, name, industry, website, description) 
                 VALUES (?, ?, ?, ?, ?)`,
                [userId, name, industry, website, description]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Registration successful', userId, role });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Account with this email or roll number already exists.' });
        }
        res.status(500).json({ error: 'Registration failed.', details: error.message });
    } finally {
        if (connection) connection.release();
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials.' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

        const payload = { user_id: user.user_id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secret', { expiresIn: '1d' });

        res.json({ message: 'Login successful', token, user: { user_id: user.user_id, role: user.role, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed.', details: error.message });
    }
};
