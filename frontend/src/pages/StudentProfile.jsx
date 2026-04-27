import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, BookOpen, GraduationCap, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/student/profile');
                setProfile(response.data);
            } catch (err) {
                console.error('Error fetching profile', err);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto mt-8 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                <div className="bg-white p-8 rounded-b-2xl shadow-sm border border-gray-100 -mt-10 relative">
                    <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white mb-4 absolute -top-12 left-8"></div>
                    <div className="mt-16 space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-4xl mx-auto mt-8 text-center bg-white p-12 rounded-2xl shadow-sm border border-red-100">
                <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Error</h2>
                <p className="text-gray-500">{error || 'Profile not found.'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your academic details and preferences.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-indigo-600 absolute -top-12 left-8">
                        <User size={48} />
                    </div>

                    <div className="mt-16 sm:mt-14 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {profile.first_name} {profile.last_name}
                        </h2>
                        <p className="text-indigo-600 font-medium font-mono mt-1 w-fit bg-indigo-50 px-3 py-1 rounded-md">
                            {profile.roll_number}
                        </p>
                        <p className="text-gray-500 mt-2">{profile.email}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-indigo-500"><BookOpen size={24}/></div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Department</p>
                                <p className="font-bold text-gray-900">{profile.department}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-blue-500"><Calendar size={24}/></div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Year of Study</p>
                                <p className="font-bold text-gray-900">Year {profile.year_of_study}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-green-500"><GraduationCap size={24}/></div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">CGPA</p>
                                <p className="font-bold text-gray-900 text-xl">{profile.cgpa}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm text-red-500"><AlertCircle size={24}/></div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Active Backlogs</p>
                                <p className="font-bold text-gray-900 text-xl">
                                    {profile.active_backlogs > 0 ? (
                                        <span className="text-red-500">{profile.active_backlogs}</span>
                                    ) : (
                                        <span className="text-green-500">None</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentProfile;
