import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FilePlus } from 'lucide-react';

const CompanyDashboard = () => {
    const [internships, setInternships] = useState([]);
    // Applications fetched using a quick backend patch
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', type: 'SUMMER', stipend: 0, location: '', deadline: '', min_cgpa: 0, allowed_department: ''
    });

    const fetchData = async () => {
        try {
            const [intsRes, appsRes] = await Promise.all([
                axios.get('/internships'),
                axios.get('/applications').catch(() => ({data: []})) // Handled in case backend patch didn't run yet
            ]);
            setInternships(intsRes.data);
            setApplications(appsRes.data);
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
        } catch (error) {
            alert('Failed to post internship');
        }
    }

    const updateStatus = async (appId, newStatus) => {
        try {
            await axios.patch(`/applications/${appId}/status`, { status: newStatus });
            fetchData();
        } catch (err) { alert('Failed to update status'); }
    }

    if (loading) return <div>Loading...</div>;

    const APP_STATUSES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED', 'REJECTED'];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-darkBg tracking-tight">Company Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your postings and applicants.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-md flex items-center gap-2">
                    <FilePlus size={18} /> Post Internship
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Create New Internship</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Title</label>
                            <input type="text" required className="w-full p-2 border border-gray-200 rounded-lg outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea required className="w-full p-2 border border-gray-200 rounded-lg outline-none" rows="3" onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                             <label className="text-sm font-semibold text-gray-700">Type</label>
                             <select className="w-full p-2 border border-gray-200 rounded-lg outline-none" onChange={e => setFormData({...formData, type: e.target.value})}>
                                 <option value="SUMMER">Summer</option>
                                 <option value="WINTER">Winter</option>
                                 <option value="SIX_MONTHS">6 Months</option>
                             </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Stipend (Monthly)</label>
                            <input type="number" required className="w-full p-2 border border-gray-200 rounded-lg outline-none" onChange={e => setFormData({...formData, stipend: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Location</label>
                            <input type="text" required className="w-full p-2 border border-gray-200 rounded-lg outline-none" onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Deadline</label>
                            <input type="date" required className="w-full p-2 border border-gray-200 rounded-lg outline-none" onChange={e => setFormData({...formData, deadline: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Minimum CGPA Required</label>
                            <input type="number" step="0.1" className="w-full p-2 border border-gray-200 rounded-lg outline-none" onChange={e => setFormData({...formData, min_cgpa: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Allowed Departments (CSV)</label>
                            <input type="text" placeholder="CSE,ECE" className="w-full p-2 border border-gray-200 rounded-lg outline-none" onChange={e => setFormData({...formData, allowed_department: e.target.value})} />
                        </div>
                        <div className="col-span-2 pt-2">
                        <button type="submit" className="bg-darkBg text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800">Publish</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-accent" /> Applicants</h2>
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
                                    <td className="p-4 font-semibold text-darkBg">{app.first_name} {app.last_name}</td>
                                    <td className="p-4">{app.title}</td>
                                    <td className="p-4">{app.department} • {app.cgpa}</td>
                                    <td className="p-4">{new Date(app.applied_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <select 
                                            value={app.status}
                                            onChange={(e) => updateStatus(app.application_id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold outline-none border cursor-pointer
                                                ${app.status === 'SELECTED' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                  app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                  'bg-indigo-50 text-accent border-indigo-200'}`}
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
            </div>
        </div>
    );
};
export default CompanyDashboard;
