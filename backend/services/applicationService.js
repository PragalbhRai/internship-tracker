const applicationRepository = require('../repositories/applicationRepository');
const AppError = require('../utils/AppError');

class ApplicationService {
    async apply(internshipId, user) {
        const studentId = user.user_id;

        // 1. Enforce eligibility checks in Node layer via Stored Procedure
        const isEligible = await applicationRepository.checkEligibility(studentId, internshipId);
        if (!isEligible) {
            throw new AppError('You do not meet the eligibility requirements for this internship (CGPA, backlogs, etc).', 400);
        }

        try {
            await applicationRepository.applyToInternship(studentId, internshipId);
        } catch (error) {
            // 2. Prevent duplicate applications gracefully
            if (error.code === 'ER_DUP_ENTRY') {
                throw new AppError('You have already applied for this internship. You cannot apply multiple times.', 409);
            }
            // 3. Invalid internship (foreign key failure)
            if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
                throw new AppError('Invalid internship ID. The position may have been deleted.', 404);
            }
            // SQLSTATE 45000 is our custom SIGNAL error from the DB procedure
            if (error.sqlState === '45000') {
                throw new AppError(error.message, 400);
            }
            throw new AppError('Failed to complete application: ' + error.message, 500);
        }
    }

    async updateStatus(applicationId, status, user) {
        if (user.role === 'STUDENT') {
            if (status !== 'WITHDRAWN') {
                throw new AppError('Students can only withdraw their application.', 403);
            }
            const myApps = await this.myApplications(user.user_id);
            const ownsApp = myApps.find(a => a.application_id === parseInt(applicationId));
            if (!ownsApp) throw new AppError('Application not found or permission denied.', 403);
        } else if (user.role === 'COMPANY_POC') {
            const check = await applicationRepository.getApplicationForCompanyCheck(applicationId, user.user_id);
            if (!check.length) throw new AppError('Permission denied.', 403);
        }

        const affectedRows = await applicationRepository.updateStatus(applicationId, status, user.user_id);
        if (affectedRows === 0) throw new AppError('Application not found.', 404);
    }

    async myApplications(studentId) {
        return await applicationRepository.getStudentApplications(studentId);
    }

    async getAllApplications(user) {
        if (user.role === 'ADMIN') {
            return await applicationRepository.getAllApplicationsAdmin();
        } else if (user.role === 'COMPANY_POC') {
            return await applicationRepository.getAllApplicationsCompany(user.user_id);
        } else {
            throw new AppError('Forbidden', 403);
        }
    }
}

module.exports = new ApplicationService();
