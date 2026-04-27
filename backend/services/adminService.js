const adminRepository = require('../repositories/adminRepository');

class AdminService {
    async getDashboardStats() {
        const [total_placed, avg_stipend, applications_per_internship] = await Promise.all([
            adminRepository.getPlacementStats(),
            adminRepository.getAvgStipend(),
            adminRepository.getApplicationsPerInternship()
        ]);

        return {
            total_placed,
            avg_stipend,
            applications_per_internship
        };
    }

    async getStudents() {
        return await adminRepository.getStudentsWithPlacementStatus();
    }

    async updateStudent(studentId, cgpa, activeBacklogs) {
        const affectedRows = await adminRepository.updateStudent(studentId, cgpa, activeBacklogs);
        if (affectedRows === 0) throw new Error('Student not found or no changes made.');
        return affectedRows;
    }

    async getAllApplications(filters) {
        return await adminRepository.getAllApplicationsAdmin(filters);
    }

    async getDepartmentStats() {
        return await adminRepository.getDepartmentStats();
    }
}

module.exports = new AdminService();
