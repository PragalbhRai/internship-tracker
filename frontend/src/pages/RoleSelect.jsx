import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, ShieldCheck } from 'lucide-react';

const RoleSelect = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'STUDENT',
            title: 'Student',
            description: 'Apply for internships, track your application status, and manage your profile.',
            icon: <GraduationCap size={48} className="text-indigo-500 mb-4" />
        },
        {
            id: 'COMPANY_POC',
            title: 'Company POC',
            description: 'Post internship opportunities, review applications, and hire top talent.',
            icon: <Building2 size={48} className="text-indigo-500 mb-4" />
        },
        {
            id: 'ADMIN',
            title: 'Admin',
            description: 'Manage the platform, oversee students and companies, and monitor activity.',
            icon: <ShieldCheck size={48} className="text-indigo-500 mb-4" />
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#1E293B] flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Welcome to InternTrack</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">Please select your role to continue securely to the platform.</p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full"
            >
                {roles.map((role) => (
                    <motion.div
                        key={role.id}
                        variants={itemVariants}
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/login?role=${role.id}`)}
                        className="bg-white rounded-2xl p-8 cursor-pointer shadow-xl border-2 border-transparent hover:border-indigo-500 transition-colors duration-300 flex flex-col items-center text-center group"
                    >
                        <div className="p-4 bg-indigo-50 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                            {role.icon}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">{role.title}</h2>
                        <p className="text-gray-600 leading-relaxed">{role.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default RoleSelect;
