import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Users, DollarSign, Briefcase } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_placed: 0, avg_stipend: 0, applications_per_internship: [] });
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, studentsRes] = await Promise.all([
                    axios.get('/admin/dashboard'),
                    axios.get('/admin/students')
                ]);
                setStats(statsRes.data);
                setStudents(studentsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-darkBg tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Platform Analytics and Student Placements.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 text-accent rounded-xl"><Users size={24}/></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Placed</p>
                        <h3 className="text-2xl font-bold text-darkBg">{stats.total_placed}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24}/></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Average Stipend</p>
                        <h3 className="text-2xl font-bold text-darkBg">₹{parseFloat(stats.avg_stipend).toFixed(0)}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Activity size={24}/></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Drives</p>
                        <h3 className="text-2xl font-bold text-darkBg">{stats.applications_per_internship.length}</h3>
                    </div>
                </div>
            </div>

            {/* Students Data Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4">Student Placement Directory</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="p-4">Roll Number</th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Department / Year</th>
                                <th className="p-4">CGPA</th>
                                <th className="p-4">Backlogs</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map(s => (
                                <tr key={s.student_id} className="hover:bg-gray-50/50">
                                    <td className="p-4 font-mono font-medium">{s.roll_number}</td>
                                    <td className="p-4 font-semibold text-darkBg">{s.first_name} {s.last_name}</td>
                                    <td className="p-4">{s.department} • Year {s.year_of_study}</td>
                                    <td className="p-4 font-medium">{s.cgpa}</td>
                                    <td className="p-4">{s.active_backlogs > 0 ? <span className="text-red-500 font-bold">{s.active_backlogs}</span> : '0'}</td>
                                    <td className="p-4">
                                        {s.is_placed ? 
                                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold">Placed</span> : 
                                            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-bold">Unplaced</span>
                                        }
                                    </td>
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
