import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from './context/AuthContext';

import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import AnimatedBackground from './components/AnimatedBackground';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useContext(AuthContext);
    const location = useLocation();
    
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

    return (
        <div className="relative flex bg-gray-50 min-h-screen">
            <AnimatedBackground />
            <div className="relative z-10">
                <Sidebar />
            </div>
            <main className="relative z-10 flex-1 ml-64 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        key={location.pathname}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

function App() {
    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<RoleSelect />} />
                <Route path="/login" element={<Login />} />
                
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['COMPANY_POC']} />}>
                    <Route path="/company" element={<CompanyDashboard />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

export default App;
