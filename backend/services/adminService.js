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
}

module.exports = new AdminService();
