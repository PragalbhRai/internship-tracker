-- Create and use database
CREATE DATABASE IF NOT EXISTS InternshipTracking;
USE InternshipTracking;

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'COMPANY_POC', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. STUDENTS TABLE
-- ==========================================
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL CHECK (year_of_study BETWEEN 1 AND 4),
    cgpa DECIMAL(4,2) NOT NULL CHECK (cgpa BETWEEN 0 AND 10.00),
    active_backlogs INT DEFAULT 0,
    resume_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ==========================================
-- 3. COMPANIES TABLE
-- ==========================================
CREATE TABLE companies (
    company_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    industry VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ==========================================
-- 4. INTERNSHIPS TABLE
-- ==========================================
CREATE TABLE internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('SUMMER', 'WINTER', 'SIX_MONTHS', 'PPO') NOT NULL,
    stipend DECIMAL(10,2) DEFAULT 0.00 CHECK (stipend >= 0),
    location VARCHAR(100) NOT NULL,
    deadline DATE NOT NULL,
    
    -- Eligibility Rules (Integrated to meet requirements)
    min_cgpa DECIMAL(4,2) DEFAULT 0.00 CHECK (min_cgpa BETWEEN 0 AND 10.00),
    max_active_backlogs INT DEFAULT 0,
    allowed_years VARCHAR(50), -- Comma-separated, e.g., '3,4'
    allowed_department VARCHAR(255), -- Comma-separated, e.g., 'CSE,ECE'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- ==========================================
-- 5. APPLICATIONS TABLE
-- ==========================================
CREATE TABLE applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    internship_id INT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED', 'REJECTED', 'WITHDRAWN') DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (student_id, internship_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE
);

-- ==========================================
-- 6. APPLICATION STATUS HISTORY TABLE
-- ==========================================
CREATE TABLE application_status_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED', 'REJECTED', 'WITHDRAWN') NOT NULL,
    comments TEXT,
    changed_by INT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ==========================================
-- 7. OFFERS TABLE
-- ==========================================
CREATE TABLE offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL UNIQUE,
    offer_letter_url VARCHAR(255),
    accepted BOOLEAN DEFAULT NULL, -- NULL = Pending, TRUE = Accepted, FALSE = Rejected
    response_deadline DATE NOT NULL,
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_students_cgpa ON students(cgpa);
CREATE INDEX idx_students_dept ON students(department);
CREATE INDEX idx_students_year ON students(year_of_study);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_internships_company ON internships(company_id);


DELIMITER //

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger: Insert APPLIED record on new application
CREATE TRIGGER tg_after_application_insert
AFTER INSERT ON applications
FOR EACH ROW
BEGIN
    INSERT INTO application_status_history (application_id, status, changed_by)
    VALUES (NEW.application_id, NEW.status, NEW.student_id);
END//

-- Trigger: Auto-log application status changes
CREATE TRIGGER tg_after_application_update
AFTER UPDATE ON applications
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        -- Fallback to `student_id` if `@current_user_id` session variable is not set
        INSERT INTO application_status_history (application_id, status, changed_by)
        VALUES (NEW.application_id, NEW.status, IFNULL(@current_user_id, NEW.student_id));
    END IF;
END//

-- ==========================================
-- STORED PROCEDURES
-- ==========================================

-- Procedure: Check Eligibility
CREATE PROCEDURE check_eligibility(
    IN p_student_id INT, 
    IN p_internship_id INT, 
    OUT p_is_eligible BOOLEAN
)
BEGIN
    DECLARE v_student_cgpa DECIMAL(4,2);
    DECLARE v_student_backlogs INT;
    DECLARE v_student_year INT;
    DECLARE v_student_dept VARCHAR(100);
    
    DECLARE v_min_cgpa DECIMAL(4,2);
    DECLARE v_max_backlogs INT;
    DECLARE v_allowed_years VARCHAR(50);
    DECLARE v_allowed_depts VARCHAR(255);
    
    SET p_is_eligible = FALSE;
    
    -- Student Data
    SELECT cgpa, active_backlogs, year_of_study, department 
    INTO v_student_cgpa, v_student_backlogs, v_student_year, v_student_dept
    FROM students WHERE student_id = p_student_id;
    
    -- Internship Eligibility Data
    SELECT min_cgpa, max_active_backlogs, allowed_years, allowed_department
    INTO v_min_cgpa, v_max_backlogs, v_allowed_years, v_allowed_depts
    FROM internships WHERE internship_id = p_internship_id;
    
    -- Verification
    IF (v_min_cgpa IS NULL OR v_student_cgpa >= v_min_cgpa) AND
       (v_max_backlogs IS NULL OR v_student_backlogs <= v_max_backlogs) AND
       (v_allowed_years IS NULL OR FIND_IN_SET(CAST(v_student_year AS CHAR), v_allowed_years) > 0) AND
       (v_allowed_depts IS NULL OR FIND_IN_SET(v_student_dept, v_allowed_depts) > 0) THEN
        SET p_is_eligible = TRUE;
    END IF;
END//

-- Procedure: Apply to Internship (Transaction Wrapped)
CREATE PROCEDURE apply_to_internship(
    IN p_student_id INT, 
    IN p_internship_id INT
)
BEGIN
    DECLARE v_eligible BOOLEAN;
    
    CALL check_eligibility(p_student_id, p_internship_id, v_eligible);
    
    IF v_eligible THEN
        START TRANSACTION;
        -- Insert into applications table. The trigger `tg_after_application_insert` will handle history logging!
        INSERT INTO applications (student_id, internship_id, status)
        VALUES (p_student_id, p_internship_id, 'APPLIED');
        COMMIT;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student is not eligible for this internship.';
    END IF;
END//

DELIMITER ;

-- ==========================================
-- VIEW
-- ==========================================

-- View: Eligible Students (cgpa >= 7.5, no backlogs)
CREATE OR REPLACE VIEW eligible_students_view AS
SELECT student_id, roll_number, first_name, last_name, department, cgpa
FROM students
WHERE cgpa >= 7.5 AND active_backlogs = 0;


-- ==========================================
-- SEED DATA 
-- ==========================================

-- 1. Users
INSERT INTO users (email, password_hash, role) VALUES 
('admin@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'ADMIN'),
('john.doe@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('jane.smith@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('bob.jones@college.edu', '$2a$10$abcdefghijklmnopqrstuv', 'STUDENT'),
('hr@techcorp.com', '$2a$10$abcdefghijklmnopqrstuv', 'COMPANY_POC'),
('hr@innovate.com', '$2a$10$abcdefghijklmnopqrstuv', 'COMPANY_POC');

-- 2. Students
INSERT INTO students (student_id, roll_number, first_name, last_name, department, year_of_study, cgpa, active_backlogs) VALUES
(2, 'CS2020001', 'John', 'Doe', 'CSE', 3, 8.5, 0), -- Eligible for TechCorp
(3, 'EC2020022', 'Jane', 'Smith', 'ECE', 4, 7.2, 1), -- Not eligible for TechCorp (low cgpa, backlogs), eligible for Innovate
(4, 'ME2020055', 'Bob', 'Jones', 'MECH', 3, 9.0, 0); -- High CGPA but wrong dept for TechCorp

-- 3. Companies
INSERT INTO companies (company_id, name, industry, description) VALUES
(5, 'TechCorp', 'Software Development', 'Leading global AI company'),
(6, 'Innovate LLC', 'Hardware', 'Cutting edge hardware manufacturing');

-- 4. Internships with Eligibility
INSERT INTO internships (company_id, title, description, type, stipend, location, deadline, min_cgpa, max_active_backlogs, allowed_years, allowed_department) VALUES
(5, 'SDE Summer Intern', 'Backend microservices development', 'SUMMER', 50000.00, 'Bangalore', '2026-05-01', 8.0, 0, '3,4', 'CSE,IT'),
(6, 'Electronics Engineering Intern', 'Hardware board design', 'SIX_MONTHS', 30000.00, 'Hyderabad', '2026-06-01', 7.0, 1, '4', 'ECE,EEE');

-- 6. Applications (Using the transaction-wrapped Procedure)
-- John Doe applies to TechCorp
CALL apply_to_internship(2, 1); 

-- Jane Smith applies to Innovate
CALL apply_to_internship(3, 2);

-- 7. Update Application Statuses (Simulating standard flows)

-- Let's pretend HR POC at TechCorp (user_id = 5) shortlists John Doe.
SET @current_user_id = 5;
UPDATE applications SET status = 'SHORTLISTED' WHERE student_id = 2 AND internship_id = 1;

-- Later, John Doe is scheduled for an interview.
UPDATE applications SET status = 'INTERVIEW_SCHEDULED' WHERE student_id = 2 AND internship_id = 1;

-- Following the interview, he gets selected!
UPDATE applications SET status = 'SELECTED' WHERE student_id = 2 AND internship_id = 1;

-- 8. Offers Table
-- After being SELECTED, an offer letter is generated.
INSERT INTO offers (application_id, offer_letter_url, response_deadline) 
VALUES (1, 'https://s3.bucket/offers/john_doe.pdf', '2026-05-15');

-- John accepts the offer!
UPDATE offers 
SET accepted = TRUE, responded_at = CURRENT_TIMESTAMP 
WHERE offer_id = 1;
UPDATE users 
SET password_hash = '$2b$10$2HJisXGzmIYtl6u08PWyBef7Rx.IhvL/kAlnV6TJUAw5CgNC12yJq'
WHERE email IN (
    'amit.s@college.edu', 'priya.p@college.edu',
    'rahul.k@college.edu', 'neha.g@college.edu',
    'karan.v@college.edu', 'anjali.d@college.edu',
    'vikas.y@college.edu', 'sneha.r@college.edu',
    'hr@wipro.com', 'careers@zoho.com',
    'ta@flipkart.com', 'hr@tcs.com'
);