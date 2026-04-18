const internshipRepository = require('../repositories/internshipRepository');
const AppError = require('../utils/AppError');

class InternshipService {
    async getInternships(user) {
        if (user.role === 'STUDENT') {
            const student = await internshipRepository.getStudentProfile(user.user_id);
            if (!student) throw new AppError('Student profile not found.', 404);
            return await internshipRepository.getEligibleInternships(student);
        } else if (user.role === 'COMPANY_POC') {
            return await internshipRepository.getInternshipsByCompany(user.user_id);
        } else {
            return await internshipRepository.getAllInternships();
        }
    }

    async createInternship(internshipData, user) {
        // Enforce role and derive company from user session strictly
        if (user.role !== 'COMPANY_POC') {
            throw new AppError('Only companies can create internships.', 403);
        }
        
        const company_id = user.user_id;

        const data = { ...internshipData, company_id };
        const internship_id = await internshipRepository.createInternship(data);
        return internship_id;
    }

    async updateInternship(id, updates, user) {
        if (user.role === 'COMPANY_POC') {
            const check = await internshipRepository.getInternshipByIdAndCompany(id, user.user_id);
            if (!check.length) throw new AppError('Permission denied. You do not own this internship.', 403);
        } else if (user.role !== 'ADMIN') {
             throw new AppError('Permission denied.', 403);
        }

        const affectedRows = await internshipRepository.updateInternship(id, updates);
        if (!affectedRows) throw new AppError('No data to update or internship not found.', 400);
    }

    async deleteInternship(id) {
        const affectedRows = await internshipRepository.deleteInternship(id);
        if (affectedRows === 0) throw new AppError('Not found.', 404);
    }
}

module.exports = new InternshipService();
