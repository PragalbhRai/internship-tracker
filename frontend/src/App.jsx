import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';

// A layout specifically for authenticated routes
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token } = useContext(AuthContext);
    
    if (!token) return <Navigate to="/" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        key={window.location.pathname}
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
                <Route path="/" element={<Login />} />
                
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                    <Route path="/student" element={<StudentDashboard />} />
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
