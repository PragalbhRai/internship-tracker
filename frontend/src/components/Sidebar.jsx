import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    if(!user) return null;

    return (
        <div className="w-64 bg-darkBg text-white h-screen flex flex-col fixed inset-y-0 left-0 shadow-lg">
            <div className="p-6 font-bold text-2xl tracking-wider text-accent border-b border-gray-700">
                InternTrack
            </div>
            
            <div className="flex-1 px-4 py-6 space-y-2">
                <NavLink to={`/${user.role.toLowerCase() === 'company_poc' ? 'company' : user.role.toLowerCase()}`} end 
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-600 font-medium shadow-md' : 'hover:bg-gray-800'}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
            </div>

            <div className="p-4 border-t border-gray-700">
                <div className="px-4 py-2 mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Logged in as</p>
                    <p className="font-semibold truncate mt-1" title={user.email}>{user.email}</p>
                    <p className="text-xs text-accent mt-1">{user.role}</p>
                </div>
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors mt-2">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
