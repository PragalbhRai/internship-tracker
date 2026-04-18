import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Clock, Building, MapPin, CheckCircle, XCircle } from 'lucide-react';

const Stepper = ({ status }) => {
    const steps = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED'];
    let currentIdx = steps.indexOf(status);
    let isRejected = status === 'REJECTED';
    let isWithdrawn = status === 'WITHDRAWN';

    if (isRejected || isWithdrawn) currentIdx = steps.length; // Max out progress bar but show red

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">Application Status</p>
            <div className="flex items-center">
                {steps.map((step, idx) => (
                    <React.Fragment key={step}>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${idx <= currentIdx && !isRejected && !isWithdrawn ? 'bg-accent' : (isRejected && idx === steps.indexOf('SELECTED') ? 'bg-red-500' : 'bg-gray-200')}`} title={step} />
                        {idx < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${idx < currentIdx && !isRejected && !isWithdrawn ? 'bg-accent' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <p className={`text-sm mt-2 font-bold ${isRejected ? 'text-red-500' : 'text-accent'}`}>{status}</p>
        </div>
    );
}

const StudentDashboard = () => {
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [ints, apps] = await Promise.all([
                axios.get('/internships'),
                axios.get('/applications/mine')
            ]);
            setInternships(ints.data);
            setApplications(apps.data);
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
            await fetchData(); // simple refresh
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to apply');
        }
    };

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    const appliedIds = applications.map(a => a.internship_id);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-darkBg tracking-tight">Student Dashboard</h1>
                <p className="text-gray-500 mt-1">Discover opportunities and track your applications.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Available Internships */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="text-accent" /> Eligible Internships</h2>
                    <div className="space-y-4">
                        {internships.length === 0 ? <p className="text-gray-500">No internships currently match your eligibility.</p> :
                            internships.map(i => {
                                const hasApplied = appliedIds.includes(i.internship_id);
                                return (
                                    <div key={i.internship_id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-darkBg">{i.title}</h3>
                                                <p className="text-accent text-sm font-semibold flex items-center gap-1"><Building size={14}/> {i.company_name}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-indigo-50 text-accent text-xs font-bold rounded">{i.type}</span>
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
                                            className={`w-full py-2 rounded-lg font-medium transition-all ${hasApplied ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:bg-indigo-700 shadow-md active:scale-[0.98]'}`}>
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
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-accent" /> Active Applications</h2>
                    <div className="space-y-4">
                         {applications.length === 0 ? <p className="text-gray-500">You haven't applied to any internships yet.</p> :
                            applications.map(a => (
                                <div key={a.application_id} className="p-4 border border-gray-100 rounded-xl">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-darkBg">{a.title}</h3>
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
