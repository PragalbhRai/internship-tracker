import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if(!user) return null;

    const navItems = {
        STUDENT: [
            { path: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { path: '/student/profile', label: 'My Profile', icon: <User size={20} /> }
        ],
        COMPANY_POC: [
            { path: '/company', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }
        ],
        ADMIN: [
            { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }
        ]
    };

    const currentNavItems = navItems[user.role] || [];
    const emailInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

    return (
        <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed inset-y-0 left-0 shadow-xl border-r border-slate-800">
            <div className="p-6 pb-4">
                <div className="font-bold text-2xl tracking-wider text-indigo-400 mb-6 text-center">
                    InternTrack
                </div>
                
                {/* User Profile Chip */}
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xl shadow-inner">
                        {emailInitial}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate" title={user.email}>{user.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{user.role}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                {currentNavItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path} 
                        end={item.path === '/student' || item.path === '/admin' || item.path === '/company'}
                        className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-slate-300 hover:text-white group"
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-indigo-600 rounded-xl z-0"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-3">
                                    <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800">
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-xl transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
