import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Clock, Building, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';

const Stepper = ({ status }) => {
    const steps = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED'];
    let currentIdx = steps.indexOf(status);
    let isRejected = status === 'REJECTED';
    let isWithdrawn = status === 'WITHDRAWN';

    if (isRejected || isWithdrawn) currentIdx = steps.length;

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">Application Status</p>
            <div className="flex items-center">
                {steps.map((step, idx) => (
                    <React.Fragment key={step}>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${idx <= currentIdx && !isRejected && !isWithdrawn ? 'bg-indigo-600' : (isRejected && idx === steps.indexOf('SELECTED') ? 'bg-red-500' : 'bg-gray-200')}`} title={step} />
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${idx < currentIdx && !isRejected && !isWithdrawn ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <p className={`text-sm mt-2 font-bold ${isRejected ? 'text-red-500' : 'text-indigo-600'}`}>{status}</p>
        </div>
    );
}

const StudentDashboard = () => {
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState({ message: '', type: 'success' });

    const fetchData = async () => {
        try {
            const [ints, apps] = await Promise.all([
                axios.get('/internships'),
                axios.get('/applications/mine')
            ]);
            setInternships(ints.data.data || ints.data);
            setApplications(apps.data.data || apps.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (internship_id) => {
        try {
            await axios.post('/applications', { internship_id });
            await fetchData();
            setToast({ message: 'Application submitted successfully!', type: 'success' });
        } catch (error) {
            setToast({ message: error.response?.data?.error || 'Failed to apply', type: 'error' });
        }
    };

    const filteredInternships = internships.filter(i => 
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-96">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const appliedIds = applications.map(a => a.internship_id);

    return (
        <div className="space-y-8 relative">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
            
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
                <p className="text-gray-500 mt-1">Discover opportunities and track your applications.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Available Internships */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase className="text-indigo-600" /> Eligible Internships</h2>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title or company..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {filteredInternships.length === 0 ? <p className="text-gray-500">No internships found.</p> :
                            filteredInternships.map(i => {
                                const hasApplied = appliedIds.includes(i.internship_id);
                                return (
                                    <div key={i.internship_id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{i.title}</h3>
                                                <p className="text-indigo-600 text-sm font-semibold flex items-center gap-1"><Building size={14}/> {i.company_name}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded">{i.type}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{i.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center gap-1"><MapPin size={14}/> {i.location}</span>
                                            <span className="flex items-center gap-1"><Clock size={14}/> Apply by {new Date(i.deadline).toLocaleDateString()}</span>
                                            <span className="font-medium">₹{i.stipend} / mo</span>
                                        </div>
                                        <button 
                                            onClick={() => handleApply(i.internship_id)} 
                                            disabled={hasApplied}
                                            className={`w-full py-2 rounded-lg font-medium transition-all ${hasApplied ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-[0.98]'}`}>
                                            {hasApplied ? 'Applied' : 'Apply Now'}
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                {/* My Applications */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-indigo-600" /> Active Applications</h2>
                    <div className="space-y-4">
                         {applications.length === 0 ? <p className="text-gray-500">You haven't applied to any internships yet.</p> :
                            applications.map(a => (
                                <div key={a.application_id} className="p-4 border border-gray-100 rounded-xl">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{a.title}</h3>
                                            <p className="text-gray-500 text-sm">{a.company_name}</p>
                                        </div>
                                        <p className="text-xs text-gray-400">Applied: {new Date(a.applied_at).toLocaleDateString()}</p>
                                    </div>
                                    <Stepper status={a.status} />
                                </div>
                            ))
                         }
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentDashboard;
