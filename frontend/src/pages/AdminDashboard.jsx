import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Activity, Users, DollarSign, GraduationCap, Edit, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimatedTitle } from '../components/AnimatedText';
import LivePresence from '../components/LivePresence';
import ImmersiveScene from '../components/ImmersiveScene';
import Toast from '../components/Toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_placed: 0, avg_stipend: 0, applications_per_internship: [] });
    const [students, setStudents] = useState([]);
    const [departmentStats, setDepartmentStats] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editCgpa, setEditCgpa] = useState('');
    const [editBacklogs, setEditBacklogs] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, studentsRes, deptRes, appsRes] = await Promise.all([
                    axios.get('/admin/dashboard'),
                    axios.get('/admin/students'),
                    axios.get('/admin/stats/departments'),
                    axios.get('/admin/applications')
                ]);
                setStats(statsRes.data);
                setStudents(studentsRes.data);
                setDepartmentStats(deptRes.data);
                setAllApplications(appsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading) {
            if (location.pathname === '/admin/applications') {
                document.getElementById('applications-section')?.scrollIntoView({ behavior: 'smooth' });
            } else if (location.pathname === '/admin/students') {
                document.getElementById('students-section')?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.pathname, loading]);

    const handleEditStudent = (student) => {
        setEditingStudentId(student.student_id);
        setEditCgpa(student.cgpa);
        setEditBacklogs(student.active_backlogs);
    };

    const handleSaveStudent = async () => {
        try {
            await axios.patch(`/admin/students/${editingStudentId}`, {
                cgpa: parseFloat(editCgpa),
                active_backlogs: parseInt(editBacklogs)
            });
            setStudents(students.map(s => s.student_id === editingStudentId ? { ...s, cgpa: editCgpa, active_backlogs: editBacklogs } : s));
            setEditingStudentId(null);
            setToast({ message: 'Student updated successfully.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to update student.', type: 'error' });
        }
    };

    const handleCancelEdit = () => {
        setEditingStudentId(null);
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await axios.patch(`/applications/${applicationId}/status`, { status: newStatus });
            setAllApplications(allApplications.map(app => app.application_id === applicationId ? { ...app, status: newStatus } : app));
            setToast({ message: 'Application status updated.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to update status.', type: 'error' });
        }
    };

    const filteredApplications = statusFilter === 'ALL' ? allApplications : allApplications.filter(app => app.status === statusFilter);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-12 bg-gray-100 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const chartData = stats.applications_per_internship.map(item => ({
        name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
        Applications: item.application_count
    }));

    return (
        <div className="space-y-8">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <AnimatedTitle delay={0.08} className="text-4xl md:text-5xl">Admin Dashboard</AnimatedTitle>
                <p className="text-gray-500 mt-1">Platform analytics and student placements.</p>
                <LivePresence className="mt-4 max-w-lg" channel="admin" />
            </motion.div>

            <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                <ImmersiveScene />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><GraduationCap size={24}/></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Students</p>
                        <h3 className="text-2xl font-bold text-gray-900">{students.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={24}/></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Placed</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total_placed}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Average Stipend</p>
                        <h3 className="text-2xl font-bold text-gray-900">INR {parseFloat(stats.avg_stipend || 0).toFixed(0)}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Activity size={24}/></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Drives</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.applications_per_internship.length}</h3>
                    </div>
                </div>
            </div>

            {/* Applications per Internship Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6">Applications per Internship</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar 
                                dataKey="Applications" 
                                fill="#4F46E5" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Department-wise Placement Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6">Department-wise Placement Percentage</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentStats} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="department" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#6B7280', fontSize: 12 }} 
                                domain={[0, 100]}
                            />
                            <Tooltip 
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                formatter={(value) => [`${value}%`, 'Placement %']}
                            />
                            <Bar 
                                dataKey="placement_percentage" 
                                fill="#10B981" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Students Data Grid */}
            <div id="students-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4">Student Placement Directory</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="p-4">Roll Number</th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Resume</th>
                                <th className="p-4">Department / Year</th>
                                <th className="p-4">CGPA</th>
                                <th className="p-4">Backlogs</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map(s => (
                                editingStudentId === s.student_id ? (
                                    <tr key={s.student_id} className="bg-blue-50">
                                        <td className="p-4 font-mono font-medium">{s.roll_number}</td>
                                        <td className="p-4 font-semibold text-gray-900">{s.first_name} {s.last_name}</td>
                                        <td className="p-4 text-indigo-600 underline break-all">{s.email}</td>
                                        <td className="p-4">
                                            {s.resume_url ? (
                                                <a href={s.resume_url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View</a>
                                            ) : (
                                                <span className="text-gray-500">No resume</span>
                                            )}
                                        </td>
                                        <td className="p-4">{s.department} - Year {s.year_of_study}</td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={editCgpa}
                                                onChange={(e) => setEditCgpa(e.target.value)}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                value={editBacklogs}
                                                onChange={(e) => setEditBacklogs(e.target.value)}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="p-4">
                                            {s.is_placed ? 
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">Placed</span> : 
                                                <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-bold">Unplaced</span>
                                            }
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button onClick={handleSaveStudent} className="text-green-600 hover:text-green-800">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={handleCancelEdit} className="text-red-600 hover:text-red-800">
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={s.student_id} className="hover:bg-gray-50/50">
                                        <td className="p-4 font-mono font-medium">{s.roll_number}</td>
                                        <td className="p-4 font-semibold text-gray-900">{s.first_name} {s.last_name}</td>
                                        <td className="p-4 text-indigo-600 underline break-all">{s.email}</td>
                                        <td className="p-4">
                                            {s.resume_url ? (
                                                <a href={s.resume_url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View</a>
                                            ) : (
                                                <span className="text-gray-500">No resume</span>
                                            )}
                                        </td>
                                        <td className="p-4">{s.department} - Year {s.year_of_study}</td>
                                        <td className="p-4 font-medium">{s.cgpa}</td>
                                        <td className="p-4">{s.active_backlogs > 0 ? <span className="text-red-500 font-bold">{s.active_backlogs}</span> : '0'}</td>
                                        <td className="p-4">
                                            {s.is_placed ? 
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">Placed</span> : 
                                                <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-bold">Unplaced</span>
                                            }
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => handleEditStudent(s)} className="text-blue-600 hover:text-blue-800">
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* All Applications */}
            <div id="applications-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">All Applications</h2>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="APPLIED">Applied</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                        <option value="INTERVIEWED">Interviewed</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="p-4">Student</th>
                                <th className="p-4">Roll No</th>
                                <th className="p-4">Department</th>
                                <th className="p-4">CGPA</th>
                                <th className="p-4">Internship</th>
                                <th className="p-4">Company</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Applied Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.map(app => (
                                <tr key={app.application_id} className="hover:bg-gray-50/50">
                                    <td className="p-4 font-semibold text-gray-900">{app.first_name} {app.last_name}</td>
                                    <td className="p-4 font-mono">{app.roll_number}</td>
                                    <td className="p-4">{app.department}</td>
                                    <td className="p-4 font-medium">{app.cgpa}</td>
                                    <td className="p-4">{app.title}</td>
                                    <td className="p-4">{app.company_name || 'Admin Posted'}</td>
                                    <td className="p-4">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded text-xs"
                                        >
                                            <option value="APPLIED">Applied</option>
                                            <option value="SHORTLISTED">Shortlisted</option>
                                            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                                            <option value="INTERVIEWED">Interviewed</option>
                                            <option value="SELECTED">Selected</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="p-4">{new Date(app.applied_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;
