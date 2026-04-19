import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg z-50 text-white min-w-[250px] ${
                        type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-indigo-600'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium inline-block pr-6">{message}</span>
                        <button onClick={onClose} className="text-white/80 hover:text-white text-lg leading-none absolute right-4 top-1/2 -translate-y-1/2">
                            &times;
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
