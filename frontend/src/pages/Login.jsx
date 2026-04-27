import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { AnimatedTitle } from '../components/AnimatedText';

const Login = () => {
    const { login } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Register fields
    const [roll_number, setRollNumber] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [department, setDepartment] = useState('');
    const [year_of_study, setYearOfStudy] = useState('');
    const [cgpa, setCgpa] = useState('');
    
    // For Company POC
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roleParam = queryParams.get('role');
        if (roleParam && ['STUDENT', 'COMPANY_POC', 'ADMIN'].includes(roleParam)) {
            setRole(roleParam);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const res = await axios.post('/auth/login', { email, password });
                login(res.data.token, res.data.user);
            } else {
                const payload = { email, password, role };
                if (role === 'STUDENT') {
                    Object.assign(payload, { 
                        roll_number, 
                        first_name, 
                        last_name,
                        department,
                        year_of_study: parseInt(year_of_study, 10),
                        cgpa: parseFloat(cgpa)
                    });
                } else if (role === 'COMPANY_POC') {
                    Object.assign(payload, { 
                        name: companyName, 
                        industry 
                    });
                }
                
                await axios.post('/auth/register', payload);
                const res = await axios.post('/auth/login', { email, password });
                login(res.data.token, res.data.user);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
            <AnimatedBackground />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 bg-white/95 p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 backdrop-blur"
            >
                <button 
                    onClick={() => navigate('/')} 
                    className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="text-center mb-8 mt-2">
                    <AnimatedTitle delay={0.1} className="text-3xl md:text-4xl">
                        InternTrack
                    </AnimatedTitle>
                    <p className="text-sm text-gray-500 mt-2">
                        {isLogin ? `Sign in to your ${role.replace('_', ' ')} account` : `Create a ${role.replace('_', ' ')} account`}
                    </p>
                </div>

                {error && (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input type="email" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                            value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@college.edu"/>
                    </div>

                    {!isLogin && role === 'STUDENT' && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">First Name</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={first_name} onChange={e => setFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={last_name} onChange={e => setLastName(e.target.value)} />
                            </div>
                            <div className="space-y-1 col-span-2">
                                <label className="text-sm font-semibold text-gray-700">Roll Number</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={roll_number} onChange={e => setRollNumber(e.target.value)} />
                            </div>
                            <div className="space-y-1 col-span-2">
                                <label className="text-sm font-semibold text-gray-700">Department</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. CSE"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Year of Study</label>
                                <input type="number" min="1" max="4" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={year_of_study} onChange={e => setYearOfStudy(e.target.value)} placeholder="1-4"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">CGPA</label>
                                <input type="number" step="0.01" min="0" max="10" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={cgpa} onChange={e => setCgpa(e.target.value)} placeholder="0.00 - 10.00"/>
                            </div>
                        </motion.div>
                    )}

                    {!isLogin && role === 'COMPANY_POC' && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-4">
                             <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Company Name</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={companyName} onChange={e => setCompanyName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Industry</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                                    value={industry} onChange={e => setIndustry(e.target.value)} />
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <input type="password" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" 
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-2">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register Account')}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
export default Login;
