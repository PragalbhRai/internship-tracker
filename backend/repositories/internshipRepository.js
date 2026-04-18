const db = require('../config/db');

class InternshipRepository {
    async getStudentProfile(studentId) {
        const [rows] = await db.query(
            'SELECT cgpa, active_backlogs, year_of_study, department FROM students WHERE student_id = ?', 
            [studentId]
        );
        return rows[0];
    }

    async getEligibleInternships(student) {
        const [internships] = await db.query(`
            SELECT i.*, c.name as company_name 
            FROM internships i
            JOIN companies c ON i.company_id = c.company_id
            WHERE (i.min_cgpa IS NULL OR ? >= i.min_cgpa)
              AND (i.max_active_backlogs IS NULL OR ? <= i.max_active_backlogs)
              AND (i.allowed_years IS NULL OR FIND_IN_SET(?, i.allowed_years) > 0)
              AND (i.allowed_department IS NULL OR FIND_IN_SET(?, i.allowed_department) > 0)
        `, [
            student.cgpa, 
            student.active_backlogs, 
            student.year_of_study, 
            student.department
        ]);

        return internships;
    }

    async getInternshipsByCompany(companyId) {
        const [internships] = await db.query(
            'SELECT * FROM internships WHERE company_id = ?', 
            [companyId]
        );
        return internships;
    }

    async getAllInternships() {
        const [internships] = await db.query(`
            SELECT i.*, c.name as company_name 
            FROM internships i 
            JOIN companies c ON i.company_id = c.company_id
        `);
        return internships;
    }

    async createInternship(internshipData) {
        const {
            company_id,
            title,
            description,
            type,
            stipend,
            location,
            deadline,
            min_cgpa,
            max_active_backlogs,
            allowed_years,
            allowed_department
        } = internshipData;

        const [result] = await db.query(`
            INSERT INTO internships 
            (company_id, title, description, type, stipend, location, deadline, min_cgpa, max_active_backlogs, allowed_years, allowed_department) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            company_id,
            title,
            description,
            type,
            stipend,
            location,
            deadline,
            min_cgpa || 0,
            max_active_backlogs || 0,
            allowed_years || null,
            allowed_department || null
        ]);

        return result.insertId;
    }

    async getInternshipByIdAndCompany(internshipId, companyId) {
        const [rows] = await db.query(
            'SELECT * FROM internships WHERE internship_id = ? AND company_id = ?', 
            [internshipId, companyId]
        );
        return rows;
    }

    async updateInternship(id, updates) {
        const keys = Object.keys(updates);
        if (keys.length === 0) return null;

        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(id);

        const [result] = await db.query(
            `UPDATE internships SET ${setClause} WHERE internship_id = ?`,
            values
        );

        return result.affectedRows;
    }

    async deleteInternship(id) {
        const [result] = await db.query(
            'DELETE FROM internships WHERE internship_id = ?', 
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = new InternshipRepository();