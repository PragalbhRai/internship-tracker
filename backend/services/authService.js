const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const AppError = require('../utils/AppError');

class AuthService {
    async register(userData) {
        const { email, password, role, ...details } = userData;

        if (!email || !password || !role) {
            throw new AppError('Email, password, and role are required.', 400);
        }

        let connection;
        try {
            connection = await authRepository.beginTransaction();

            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await authRepository.insertUser(connection, email, hashedPassword, role);

            if (role === 'STUDENT') {
                await authRepository.insertStudent(connection, userId, details);
            } else if (role === 'COMPANY_POC') {
                await authRepository.insertCompany(connection, userId, details);
            }

            await connection.commit();
            return { userId, role };
        } catch (error) {
            if (connection) await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new AppError('Account with this email or roll number already exists.', 409);
            }
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async login(email, password) {
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            throw new AppError('Invalid credentials.', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new AppError('Invalid credentials.', 401);
        }

        const payload = { user_id: user.user_id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secret', { expiresIn: '1d' });

        return {
            token,
            user: { user_id: user.user_id, role: user.role, email: user.email }
        };
    }
}

module.exports = new AuthService();
