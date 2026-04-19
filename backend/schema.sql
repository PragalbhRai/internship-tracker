

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

-- 5. Applications (Executed procedurally via CALLs for valid candidates)
CALL apply_to_internship(8, 3);
CALL apply_to_internship(8, 5);
CALL apply_to_internship(8, 7);
CALL apply_to_internship(8, 10);
CALL apply_to_internship(9, 3);
CALL apply_to_internship(9, 10);
CALL apply_to_internship(10, 9);
CALL apply_to_internship(10, 3);
CALL apply_to_internship(10, 10);
CALL apply_to_internship(11, 8);
CALL apply_to_internship(11, 3);
CALL apply_to_internship(12, 3);
CALL apply_to_internship(12, 10);
CALL apply_to_internship(13, 8);
CALL apply_to_internship(13, 3);
CALL apply_to_internship(14, 9);
CALL apply_to_internship(15, 7);

-- 6. Update Statuses and Create Offers
SET @current_user_id = 1;
UPDATE applications SET status = 'SELECTED' WHERE application_id IN (19,18,17,16);
UPDATE applications SET status = 'REJECTED' WHERE application_id IN (15,14,13);
UPDATE applications SET status = 'SHORTLISTED' WHERE application_id IN (12,11);
UPDATE applications SET status = 'INTERVIEW_SCHEDULED' WHERE application_id IN (10,9);

INSERT INTO offers (application_id, offer_letter_url, accepted, response_deadline, responded_at) VALUES 
(19, 'https://s3.bucket/offers/new1.pdf', TRUE, '2026-05-20', CURRENT_TIMESTAMP),
(18, 'https://s3.bucket/offers/new2.pdf', TRUE, '2026-05-20', CURRENT_TIMESTAMP),
(17, 'https://s3.bucket/offers/new3.pdf', NULL, '2026-05-25', NULL),
(16, 'https://s3.bucket/offers/new4.pdf', FALSE, '2026-05-22', CURRENT_TIMESTAMP);
