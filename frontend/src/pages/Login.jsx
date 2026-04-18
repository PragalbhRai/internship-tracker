import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Register fields (simplified for mock-up validation)
    const [roll_number, setRollNumber] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');

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
                if(role === 'STUDENT'){
                    Object.assign(payload, { roll_number, first_name, last_name, department: 'CSE', year_of_study: 3, cgpa: 8.0 });
                } else if(role === 'COMPANY_POC'){
                    Object.assign(payload, { name: first_name + ' Company', industry: 'Software' });
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-darkBg tracking-tight">InternTrack</h1>
                    <p className="text-sm text-gray-500 mt-2">{isLogin ? 'Sign in to access your dashboard' : 'Create an account to get started'}</p>
                </div>

                {error && (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="space-y-1">
                             <label className="text-sm font-semibold text-gray-700">Account Type</label>
                             <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all" value={role} onChange={e => setRole(e.target.value)}>
                                 <option value="STUDENT">Student</option>
                                 <option value="COMPANY_POC">Company POC</option>
                                 <option value="ADMIN">Administrator</option>
                             </select>
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input type="email" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all" 
                            value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@college.edu"/>
                    </div>

                    {!isLogin && (role === 'STUDENT' || role === 'COMPANY_POC') && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">First Name</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all" 
                                    value={first_name} onChange={e => setFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all" 
                                    value={last_name} onChange={e => setLastName(e.target.value)} />
                            </div>
                            {role === 'STUDENT' && (
                                <div className="space-y-1 col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Roll Number</label>
                                    <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all" 
                                        value={roll_number} onChange={e => setRollNumber(e.target.value)} />
                                </div>
                            )}
                        </motion.div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <input type="password" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:bg-white outline-none transition-all" 
                            value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-accent text-white font-medium py-3 rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-2">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register Account')}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-accent font-semibold hover:underline cursor-pointer">
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
export default Login;
