import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, BookOpen, GraduationCap, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeLink, setResumeLink] = useState('');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'success' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/student/profile');
                setProfile(response.data);
                setResumeLink(response.data.resume_url || '');
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

    const handleSaveResume = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const response = await axios.put('/student/profile', { resume_url: resumeLink });
            setProfile(response.data);
            setToast({ message: 'Resume link saved successfully.', type: 'success' });
        } catch (err) {
            console.error('Error saving resume link', err);
            setToast({ message: err.response?.data?.error || 'Unable to save resume link.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
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
                        <div className="flex flex-col sm:flex-row sm:items-end gap-6 pt-6 mb-8">
                        <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-indigo-600">
                            <User size={48} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {profile.first_name} {profile.last_name}
                            </h2>
                            <p className="text-indigo-600 font-medium font-mono mt-1 w-fit bg-indigo-50 px-3 py-1 rounded-md">
                                {profile.roll_number}
                            </p>
                            <p className="text-gray-500 mt-2">{profile.email}</p>
                        </div>
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

                    <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Resume & Contact</h3>
                                <p className="text-sm text-gray-500">Add your resume link here so companies can review your profile.</p>
                            </div>
                            <p className="text-sm text-gray-500">
                                Contact: <a href={`mailto:${profile.email}`} className="text-indigo-600 underline">{profile.email}</a>
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Current resume: {profile.resume_url ? (
                            <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View resume</a>
                        ) : (
                            <span className="text-gray-500">Not uploaded yet.</span>
                        )}</p>
                        <form onSubmit={handleSaveResume} className="space-y-4">
                            <div>
                                <label htmlFor="resumeLink" className="block text-sm font-medium text-gray-700">Resume / Portfolio URL</label>
                                <input
                                    id="resumeLink"
                                    type="url"
                                    placeholder="https://example.com/my-resume"
                                    value={resumeLink}
                                    onChange={(e) => setResumeLink(e.target.value)}
                                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                <p className="text-xs text-gray-500 mt-2">Paste a public link to your resume or portfolio here.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {saving ? 'Saving...' : 'Save Resume Link'}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentProfile;
