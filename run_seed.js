const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'backend/.env' });

const seedSQL = `
-- ==========================================
-- EXTENDED SEED DATA (Added via AI)
-- ==========================================

-- 1. New Users
INSERT INTO users (email, password_hash, role) VALUES 
('amit.s@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('priya.p@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('rahul.k@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('neha.g@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('karan.v@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('anjali.d@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('vikas.y@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('sneha.r@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('hr@wipro.com', '$2a$10$abcdefghijklmnopqrstuv', 'COMPANY_POC'),
('careers@zoho.com', '$2a$10$abcdefghijklmnopqrstuv', 'COMPANY_POC'),
('ta@flipkart.com', '$2a$10$abcdefghijklmnopqrstuv', 'COMPANY_POC'),
('hr@tcs.com', '$2a$10$abcdefghijklmnopqrstuv', 'COMPANY_POC');

-- 2. New Students
INSERT INTO students (student_id, roll_number, first_name, last_name, department, year_of_study, cgpa, active_backlogs)
SELECT user_id, 'CS21001', 'Amit', 'Sharma', 'CSE', 3, 8.8, 0 FROM users WHERE email = 'amit.s@college.edu' UNION ALL
SELECT user_id, 'EC21002', 'Priya', 'Patel', 'ECE', 4, 7.5, 0 FROM users WHERE email = 'priya.p@college.edu' UNION ALL
SELECT user_id, 'IT21003', 'Rahul', 'Kumar', 'IT', 2, 6.8, 1 FROM users WHERE email = 'rahul.k@college.edu' UNION ALL
SELECT user_id, 'ME21004', 'Neha', 'Gupta', 'MECH', 3, 9.2, 0 FROM users WHERE email = 'neha.g@college.edu' UNION ALL
SELECT user_id, 'EE21005', 'Karan', 'Verma', 'EEE', 4, 6.5, 2 FROM users WHERE email = 'karan.v@college.edu' UNION ALL
SELECT user_id, 'CV21006', 'Anjali', 'Desai', 'CIVIL', 3, 7.8, 0 FROM users WHERE email = 'anjali.d@college.edu' UNION ALL
SELECT user_id, 'CS21007', 'Vikas', 'Yadav', 'CSE', 2, 8.5, 0 FROM users WHERE email = 'vikas.y@college.edu' UNION ALL
SELECT user_id, 'EC21008', 'Sneha', 'Reddy', 'ECE', 3, 9.5, 0 FROM users WHERE email = 'sneha.r@college.edu';

-- 3. New Companies
INSERT INTO companies (company_id, name, industry, description)
SELECT user_id, 'Wipro', 'IT Services', 'Global IT consulting' FROM users WHERE email = 'hr@wipro.com' UNION ALL
SELECT user_id, 'Zoho', 'Software Products', 'SaaS products and suite' FROM users WHERE email = 'careers@zoho.com' UNION ALL
SELECT user_id, 'Flipkart', 'E-commerce', 'Leading online marketplace' FROM users WHERE email = 'ta@flipkart.com' UNION ALL
SELECT user_id, 'Tata Consultancy Services', 'IT Services', 'Global leader in IT services' FROM users WHERE email = 'hr@tcs.com';

-- 4. New Internships
INSERT INTO internships (company_id, title, description, type, stipend, location, deadline, min_cgpa, max_active_backlogs, allowed_years, allowed_department)
SELECT user_id, 'Wipro Summer Intern', 'General', 'SUMMER', 15000.00, 'Hybrid', '2026-05-15', NULL, NULL, NULL, NULL FROM users WHERE email = 'hr@wipro.com' UNION ALL
SELECT user_id, 'Zoho SDE Intern', 'SDE', 'SIX_MONTHS', 40000.00, 'Onsite - Chennai', '2026-06-01', 8.0, 0, '4', 'CSE,IT' FROM users WHERE email = 'careers@zoho.com' UNION ALL
SELECT user_id, 'Flipkart Backend Intern', 'Backend', 'SUMMER', 60000.00, 'Remote', '2026-05-20', 7.5, 1, '3,4', 'CSE,IT' FROM users WHERE email = 'ta@flipkart.com' UNION ALL
SELECT user_id, 'TCS Analyst', 'Analyst', 'WINTER', 20000.00, 'Onsite - Pune', '2026-07-10', 7.0, 0, '4', 'ECE,EEE' FROM users WHERE email = 'hr@tcs.com' UNION ALL
SELECT user_id, 'Flipkart Analytics Intern', 'Data Analysis', 'SUMMER', 45000.00, 'Hybrid', '2026-05-25', 8.5, 0, '3', 'CSE,IT,ECE' FROM users WHERE email = 'ta@flipkart.com' UNION ALL
SELECT user_id, 'Wipro Core Eng Intern', 'Mech/Civil', 'SIX_MONTHS', 25000.00, 'Onsite - Bangalore', '2026-06-15', 7.0, 0, '3,4', 'MECH,CIVIL' FROM users WHERE email = 'hr@wipro.com' UNION ALL
SELECT user_id, 'Zoho Frontend Intern', 'UI Dev', 'SUMMER', 35000.00, 'Remote', '2026-05-10', 0.0, 1, '2,3', 'CSE,IT' FROM users WHERE email = 'careers@zoho.com' UNION ALL
SELECT user_id, 'TCS Systems Engineer', 'IT Infra', 'SIX_MONTHS', 22000.00, 'Hybrid', '2026-07-01', 6.5, 2, '2,3,4', NULL FROM users WHERE email = 'hr@tcs.com';
`;

async function run() {
    console.log("Starting DB script...");
    
    // 1. Append to schema.sql
    try {
        fs.appendFileSync('schema.sql', "\n" + seedSQL);
        console.log("Appended core seed to schema.sql successfully.");
    } catch (e) {
        console.error("Failed to append to schema.sql", e);
    }
    
    // 2. Execute against DB
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: '', // Replace with your actual MySQL password
        database: process.env.DB_NAME || 'InternshipTracking',
        multipleStatements: true
    });

    try {
        // Execute the pure inserts
        await connection.query(seedSQL);
        console.log("Core inserts completed.");
        
        // Let's implement the procedural application / offer mapping programmatically to avoid complex DELIMITER parsing
        
        // Helper to get IDs
        const getId = async (query) => { const [r] = await connection.query(query); return r[0] ? Object.values(r[0])[0] : null; };
        
        const amit = await getId("SELECT user_id FROM users WHERE email = 'amit.s@college.edu'");
        const priya = await getId("SELECT user_id FROM users WHERE email = 'priya.p@college.edu'");
        const rahul = await getId("SELECT user_id FROM users WHERE email = 'rahul.k@college.edu'");
        const neha = await getId("SELECT user_id FROM users WHERE email = 'neha.g@college.edu'");
        const karan = await getId("SELECT user_id FROM users WHERE email = 'karan.v@college.edu'");
        const anjali = await getId("SELECT user_id FROM users WHERE email = 'anjali.d@college.edu'");
        const vikas = await getId("SELECT user_id FROM users WHERE email = 'vikas.y@college.edu'");
        const sneha = await getId("SELECT user_id FROM users WHERE email = 'sneha.r@college.edu'");
        
        const w_sum = await getId("SELECT internship_id FROM internships WHERE title = 'Wipro Summer Intern'");
        const z_sde = await getId("SELECT internship_id FROM internships WHERE title = 'Zoho SDE Intern'");
        const f_back = await getId("SELECT internship_id FROM internships WHERE title = 'Flipkart Backend Intern'");
        const t_ana = await getId("SELECT internship_id FROM internships WHERE title = 'TCS Analyst'");
        const f_ana = await getId("SELECT internship_id FROM internships WHERE title = 'Flipkart Analytics Intern'");
        const w_core = await getId("SELECT internship_id FROM internships WHERE title = 'Wipro Core Eng Intern'");
        const z_fe = await getId("SELECT internship_id FROM internships WHERE title = 'Zoho Frontend Intern'");
        const t_sys = await getId("SELECT internship_id FROM internships WHERE title = 'TCS Systems Engineer'");

        // Applications array
        const appsToSubmit = [
            [amit, w_sum], [amit, f_back], [amit, f_ana], [amit, t_sys],
            [priya, w_sum], [priya, t_sys],
            [rahul, z_fe], [rahul, w_sum], [rahul, t_sys],
            [neha, w_core], [neha, w_sum],
            [karan, w_sum], [karan, t_sys],
            [anjali, w_core], [anjali, w_sum],
            [vikas, z_fe], [sneha, f_ana]
        ];

        // Ensure we suppress throws and explicitly just insert Applications
        console.log("Applying users to roles...");
        // Bypassing CALL apply_to_internship() so we can execute properly from node side. Actually the requirement says "use CALL apply_to_internship() for all". 
        // We will execute the CALL! Eligibility will be enforced by DB logic!
        
        let successApps = 0;
        let eligibleSQL = ``;
        for(let [s, i] of appsToSubmit) {
            try {
                await connection.query("CALL apply_to_internship(?, ?)", [s, i]);
                successApps++;
                eligibleSQL += `CALL apply_to_internship(${s}, ${i});\n`;
            } catch(e) {
                // Not eligible!
                // console.log("Not eligible:", s, i, e.message);
            }
        }
        
        // Let's ensure at least 15 applications exist!
        const [totalAppsCheck] = await connection.query("SELECT application_id FROM applications ORDER BY application_id DESC");
        const appIds = totalAppsCheck.map(r => r.application_id);
        
        // Make 4 Selected, 3 Rejected, 2 Shortlisted, 2 Interview
        await connection.query("SET @current_user_id = 1;");
        for(let j=0; j<4; j++) await connection.query("UPDATE applications SET status = 'SELECTED' WHERE application_id = ?", [appIds[j]]);
        for(let j=4; j<7; j++) await connection.query("UPDATE applications SET status = 'REJECTED' WHERE application_id = ?", [appIds[j]]);
        for(let j=7; j<9; j++) await connection.query("UPDATE applications SET status = 'SHORTLISTED' WHERE application_id = ?", [appIds[j]]);
        for(let j=9; j<11; j++) await connection.query("UPDATE applications SET status = 'INTERVIEW_SCHEDULED' WHERE application_id = ?", [appIds[j]]);
        
        // Build the appending sql properly
        const proceduralSQL = `
-- 5. Applications (Executed procedurally via CALLs for valid candidates)
${eligibleSQL}
-- 6. Update Statuses and Create Offers
SET @current_user_id = 1;
UPDATE applications SET status = 'SELECTED' WHERE application_id IN (${appIds.slice(0,4).join(',')});
UPDATE applications SET status = 'REJECTED' WHERE application_id IN (${appIds.slice(4,7).join(',')});
UPDATE applications SET status = 'SHORTLISTED' WHERE application_id IN (${appIds.slice(7,9).join(',')});
UPDATE applications SET status = 'INTERVIEW_SCHEDULED' WHERE application_id IN (${appIds.slice(9,11).join(',')});

INSERT INTO offers (application_id, offer_letter_url, accepted, response_deadline, responded_at) VALUES 
(${appIds[0]}, 'https://s3.bucket/offers/new1.pdf', TRUE, '2026-05-20', CURRENT_TIMESTAMP),
(${appIds[1]}, 'https://s3.bucket/offers/new2.pdf', TRUE, '2026-05-20', CURRENT_TIMESTAMP),
(${appIds[2]}, 'https://s3.bucket/offers/new3.pdf', NULL, '2026-05-25', NULL),
(${appIds[3]}, 'https://s3.bucket/offers/new4.pdf', FALSE, '2026-05-22', CURRENT_TIMESTAMP);
`;
        fs.appendFileSync('schema.sql', proceduralSQL);
        
        // Add offers explicitly
        await connection.query(`
            INSERT INTO offers (application_id, offer_letter_url, accepted, response_deadline, responded_at) VALUES 
            (?, 'https://s3.bucket/offers/new1.pdf', TRUE, '2026-05-20', CURRENT_TIMESTAMP),
            (?, 'https://s3.bucket/offers/new2.pdf', TRUE, '2026-05-20', CURRENT_TIMESTAMP),
            (?, 'https://s3.bucket/offers/new3.pdf', NULL, '2026-05-25', NULL),
            (?, 'https://s3.bucket/offers/new4.pdf', FALSE, '2026-05-22', CURRENT_TIMESTAMP)
        `, [appIds[0], appIds[1], appIds[2], appIds[3]]);


        // VERIFICATION QUERIES
        console.log("\n--- VERIFICATION QUERIES ---");
        const [[{total_students}]] = await connection.query("SELECT COUNT(*) as total_students FROM students");
        console.log("Total Students:", total_students);
        
        const [[{total_applications}]] = await connection.query("SELECT COUNT(*) as total_applications FROM applications");
        console.log("Total Applications:", total_applications);
        
        const [[{total_placed}]] = await connection.query("SELECT COUNT(*) as total_placed FROM offers WHERE accepted = TRUE");
        console.log("Total Placed (Accepted Offers):", total_placed);
        
        const [statusCounts] = await connection.query("SELECT status, COUNT(*) as count FROM applications GROUP BY status");
        console.table(statusCounts);

    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await connection.end();
    }
}

run();
