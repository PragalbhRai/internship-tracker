import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FilePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';
import { MotionCard, FloatingButton } from '../components/MotionCard';
import { AnimatedTitle } from '../components/AnimatedText';
import LivePresence from '../components/LivePresence';
import ImmersiveScene from '../components/ImmersiveScene';
import { useRealtime } from '../context/RealtimeContext';

const CompanyDashboard = () => {
    const { publishActivity } = useRealtime();
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: 'success' });

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', type: 'SUMMER', stipend: 0, location: '', deadline: '', min_cgpa: 0, allowed_department: ''
    });

    const fetchData = async () => {
        try {
            const [intsRes, appsRes] = await Promise.all([
                axios.get('/internships'),
                axios.get('/applications').catch(() => ({data: []}))
            ]);
            setInternships(intsRes.data.data || intsRes.data);
            setApplications(appsRes.data.data || appsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/internships', formData);
            setShowForm(false);
            fetchData();
            setToast({ message: 'Internship posted successfully!', type: 'success' });
            publishActivity(`Published internship: ${formData.title || 'new role'}`, 'company');
        } catch (error) {
            setToast({ message: 'Failed to post internship', type: 'error' });
        }
    }

    const updateStatus = async (appId, newStatus) => {
        try {
            await axios.patch(`/applications/${appId}/status`, { status: newStatus });
            fetchData();
            setToast({ message: 'Status updated successfully', type: 'success' });
            publishActivity(`Updated application #${appId} to ${newStatus}`, 'company');
        } catch (err) { setToast({ message: 'Failed to update status', type: 'error' }); }
    }

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const APP_STATUSES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED', 'REJECTED'];

    return (
        <div className="space-y-8">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
            
            <motion.div 
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div>
                    <AnimatedTitle delay={0.1} className="text-4xl md:text-5xl">Company Dashboard</AnimatedTitle>
                    <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity }}>
                            🚀
                        </motion.span>
                        Manage your postings and applicants. Active postings: {internships.length}
                    </p>
                    <LivePresence className="mt-4 max-w-lg" channel="company" />
                </div>
                <FloatingButton variant="primary" onClick={() => setShowForm(!showForm)} delay={0.2}>
                    <FilePlus size={18} className="inline mr-2" />
                    Post Internship
                </FloatingButton>
            </motion.div>

            <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                <ImmersiveScene />
            </div>

            {showForm && (
                <MotionCard delay={0.1} className="p-6">
                    <motion.h2 
                        className="text-xl font-bold mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Create New Internship
                    </motion.h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Title</label>
                            <input type="text" required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" rows="3" onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                             <label className="text-sm font-semibold text-gray-700">Type</label>
                             <select className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, type: e.target.value})}>
                                 <option value="SUMMER">Summer</option>
                                 <option value="WINTER">Winter</option>
                                 <option value="SIX_MONTHS">6 Months</option>
                             </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Stipend (Monthly)</label>
                            <input type="number" required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, stipend: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Location</label>
                            <input type="text" required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Deadline</label>
                            <input type="date" required className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, deadline: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Minimum CGPA Required</label>
                            <input type="number" step="0.1" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, min_cgpa: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Allowed Departments (CSV)</label>
                            <input type="text" placeholder="CSE,ECE" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, allowed_department: e.target.value})} />
                        </div>
                        <div className="col-span-2 pt-2">
                        <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Publish</button>
                        </div>
                    </form>
                </MotionCard>
            )}

            <MotionCard delay={0.15} className="p-6 overflow-hidden">
                <motion.h2 
                    className="text-xl font-bold mb-4 flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Users className="text-indigo-600" />
                    </motion.div>
                    Applicants
                </motion.h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="p-4">Applicant</th>
                                <th className="p-4">Internship</th>
                                <th className="p-4">Dept / CGPA</th>
                                <th className="p-4">Applied Date</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.map(app => (
                                <tr key={app.application_id} className="hover:bg-gray-50/50">
                                    <td className="p-4 font-semibold text-gray-900">{app.first_name} {app.last_name}</td>
                                    <td className="p-4">{app.title}</td>
                                    <td className="p-4">{app.department} - {app.cgpa}</td>
                                    <td className="p-4">{new Date(app.applied_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <select 
                                            value={app.status}
                                            onChange={(e) => updateStatus(app.application_id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold outline-none border cursor-pointer
                                                ${app.status === 'SELECTED' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                  app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                  'bg-indigo-50 text-indigo-600 border-indigo-200'}`}
                                        >
                                            {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No applicants yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </MotionCard>
        </div>
    );
};
export default CompanyDashboard;
