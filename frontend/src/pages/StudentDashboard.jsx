import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Clock, Building, MapPin, Search, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';
import { MotionCard } from '../components/MotionCard';
import { AnimatedTitle } from '../components/AnimatedText';
import LivePresence from '../components/LivePresence';
import ImmersiveScene from '../components/ImmersiveScene';
import { useRealtime } from '../context/RealtimeContext';

const Stepper = ({ status }) => {
    const steps = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'SELECTED'];
    let currentIdx = steps.indexOf(status);
    let isRejected = status === 'REJECTED';
    let isWithdrawn = status === 'WITHDRAWN';

    if (isRejected || isWithdrawn) {
        currentIdx = steps.indexOf('INTERVIEW_SCHEDULED'); // Put the error somewhere visual, or max it out
    }
    
    // Calculate progress line percentage based on steps length.
    let progressPercentage = 0;
    if(currentIdx > 0) {
        progressPercentage = (currentIdx / (steps.length - 1)) * 100;
    }
    if (isRejected || isWithdrawn) progressPercentage = 100;

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 pb-4">
            <p className="text-xs text-gray-500 mb-6 font-medium">Application Status</p>
            <div className="relative flex justify-between items-center w-full px-2">
                {/* Background line */}
                <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full" />
                
                {/* Animated progress line */}
                <motion.div 
                    className={`absolute left-2 top-1/2 -translate-y-1/2 h-1 z-0 rounded-full ${isRejected || isWithdrawn ? 'bg-red-500' : 'bg-indigo-600'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `calc(${progressPercentage}% - 16px)` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {steps.map((step, idx) => {
                    const isCompleted = idx <= currentIdx && !isRejected && !isWithdrawn;
                    const isErrorNode = (isRejected || isWithdrawn) && idx === steps.length - 1;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.15 }}
                                className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] bg-white
                                    ${isCompleted ? 'border-indigo-600 shadow-md shadow-indigo-200' : 
                                      isErrorNode ? 'border-red-500 shadow-md shadow-red-200' : 
                                      'border-gray-300'}`}
                            >
                                {isCompleted && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                                {isCompleted && idx === steps.length - 1 && <Check size={12} className="text-indigo-600 absolute" strokeWidth={4} />}
                                {isErrorNode && <X size={12} className="text-red-500 absolute" strokeWidth={4} />}
                            </motion.div>
                            <span className={`text-[10px] font-bold ${isCompleted ? 'text-indigo-700' : isErrorNode ? 'text-red-600' : 'text-gray-400'} absolute top-8 whitespace-nowrap`}>
                                {step.replace('_', ' ')}
                            </span>
                        </div>
                    );
                })}
            </div>
            {(isRejected || isWithdrawn) && (
                <p className="text-sm mt-8 font-bold text-red-500 text-center uppercase tracking-wider">{status}</p>
            )}
        </div>
    );
}

const StudentDashboard = () => {
    const { publishActivity } = useRealtime();
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL');
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
            const internship = internships.find((item) => item.internship_id === internship_id);
            publishActivity(`Applied to ${internship?.title || 'an internship'}`, 'student');
        } catch (error) {
            setToast({ message: error.response?.data?.error || 'Failed to apply', type: 'error' });
        }
    };

    const handleWithdraw = async (application_id) => {
        if(!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) return;
        try {
            await axios.patch(`/applications/${application_id}/status`, { status: 'WITHDRAWN' });
            await fetchData();
            setToast({ message: 'Application withdrawn!', type: 'success' });
            publishActivity(`Withdrew application #${application_id}`, 'student');
        } catch (error) {
            setToast({ message: error.response?.data?.error || 'Failed to withdraw', type: 'error' });
        }
    };

    const filteredInternships = internships.filter(i => {
        const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              i.company_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'ALL' || i.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

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
                </div>
            </div>
        );
    }

    const appliedIds = applications.map(a => a.internship_id);

    const typeColors = {
        'SUMMER': 'border-l-indigo-500',
        'WINTER': 'border-l-blue-500',
        'SIX_MONTHS': 'border-l-purple-500',
        'PPO': 'border-l-green-500'
    };

    return (
        <div className="space-y-8 relative">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <AnimatedTitle delay={0.1} className="text-4xl md:text-5xl">Student Dashboard</AnimatedTitle>
                <p className="text-gray-500 flex items-center gap-2">
                    <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ✨
                    </motion.span>
                    Discover opportunities and track your applications.
                </p>
                <LivePresence className="mt-4 max-w-lg" channel="student" />
            </motion.div>

            <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                <ImmersiveScene />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Available Internships */}
                <MotionCard delay={0.1} className="p-6 flex flex-col h-[calc(100vh-12rem)]">
                    <motion.div 
                        className="flex justify-between items-center mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 20, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Briefcase className="text-indigo-600" />
                            </motion.div>
                            Eligible Internships
                        </h2>
                    </motion.div>

                    <div className="relative mb-4">
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

                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                        {['ALL', 'SUMMER', 'WINTER', 'SIX_MONTHS', 'PPO'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === f ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {f === 'ALL' ? 'All' : f === 'SIX_MONTHS' ? '6 Months' : f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                        {filteredInternships.length === 0 ? <p className="text-gray-500">No internships found.</p> :
                            filteredInternships.map(i => {
                                const hasApplied = appliedIds.includes(i.internship_id);
                                const borderClass = typeColors[i.type] || 'border-l-gray-200';
                                
                                return (
                                    <div key={i.internship_id} className={`p-4 border border-gray-100 border-l-4 ${borderClass} rounded-xl hover:shadow-md transition-shadow bg-white`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{i.title}</h3>
                                                <p className="text-indigo-600 text-sm font-semibold flex items-center gap-1"><Building size={14}/> {i.company_name}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">{i.type.replace('_', ' ')}</span>
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
                </MotionCard>

                {/* My Applications */}
                <MotionCard delay={0.2} className="p-6 flex flex-col h-[calc(100vh-12rem)]">
                    <motion.h2 
                        className="text-xl font-bold mb-4 flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Clock className="text-indigo-600" />
                        </motion.div>
                        Active Applications
                    </motion.h2>
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                         {applications.length === 0 ? <p className="text-gray-500">You haven't applied to any internships yet.</p> :
                            applications.map(a => {
                                const canWithdraw = !['REJECTED', 'WITHDRAWN', 'SELECTED'].includes(a.status);
                                
                                return (
                                    <div key={a.application_id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{a.title}</h3>
                                                <p className="text-gray-500 text-sm font-medium"><Building size={14} className="inline mr-1 -mt-0.5"/>{a.company_name}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">Applied: {new Date(a.applied_at).toLocaleDateString()}</p>
                                        </div>
                                        <Stepper status={a.status} />
                                        
                                        {canWithdraw && (
                                            <button 
                                                onClick={() => handleWithdraw(a.application_id)}
                                                className="mt-6 w-full py-2 bg-red-50 text-red-600 font-bold tracking-wide text-xs rounded-lg hover:bg-red-100 transition-colors uppercase"
                                            >
                                                Withdraw Application
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                         }
                    </div>
                </MotionCard>
            </div>
        </div>
    );
};
export default StudentDashboard;
