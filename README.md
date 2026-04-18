# InternTrack — College Internship Management System

A full-stack, database-driven internship portal built as a 
replacement for the scattered email + Google Forms workflow 
used by college placement cells.

## Problem Solved
- Internships shared via scattered emails
- Manual filtering of applicants from Google Forms
- No visibility into application status for students
- No placement analytics for the admin

## Tech Stack
| Layer | Technology |
|---|---|
| Database | MySQL |
| Backend | Node.js + Express + MySQL2 |
| Auth | JWT with Role-Based Access Control |
| Frontend | React + Vite + Tailwind CSS v3 |
| Animations | Framer Motion |

## Roles
- **Student** — view eligible internships, apply, track status
- **Company POC** — post internships, manage applicants, update status
- **Admin** — full system oversight, placement analytics dashboard

## Database Schema
Tables: `users`, `students`, `companies`, `internships`, 
`applications`, `application_status_history`, `offers`

### DBMS Concepts Implemented
- **Normalization** — Schema normalized to 3NF
- **Constraints** — PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, 
  NOT NULL, DEFAULT on all tables
- **Triggers** — Auto-log on application insert and status update
- **Stored Procedures** — `check_eligibility()`, 
  `apply_to_internship()` (transaction-wrapped)
- **Views** — `eligible_students_view` (CGPA >= 7.5, no backlogs)
- **Transactions** — Application insert + history log are atomic
- **Indexes** — On frequently joined and filtered columns

## How to Run Locally

### Prerequisites
- MySQL 8+
- Node.js 18+
- npm

### 1. Database Setup
Open MySQL Workbench and run:schema.sql
### 2. Backend
```bash
cd backend
npm install
# Edit .env and add your MySQL password
npm run dev
```
Backend runs on `http://localhost:5000`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Test Credentials
| Role | Email | Password |
|---|---|---|
| Student | john.doe@college.edu | pass123 |
| Company | hr@techcorp.com | pass123 |
| Admin | admin@college.edu | pass123 |

## Key Features
- Eligibility filtering at both DB and API level
- One-click apply via stored procedure
- Visual application status stepper
- Full audit trail of every status change with `changed_by`
- Admin analytics dashboard with live SQL aggregations