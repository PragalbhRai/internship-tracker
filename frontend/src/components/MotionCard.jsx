import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const MotionCard = ({ children, delay = 0, className = "", onClick = null }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: -10,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay,
            },
        },
        hover: {
            y: -8,
            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
            },
        },
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className} ${
                onClick ? 'cursor-pointer' : ''
            }`}
            style={{
                perspective: '1200px',
            }}
        >
            {/* Animated Border Glow on Hover */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        border: '2px solid',
                        borderImage: 'linear-gradient(45deg, #4f46e5, #a855f7, #ec4899) 1',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Motion Gradient Overlay on Hover */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(79, 70, 229, 0.1) 0%, transparent 80%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Children with position relative */}
            <motion.div className="relative z-10 h-full">{children}</motion.div>
        </motion.div>
    );
};

export const StatCard = ({ icon: Icon, label, value, color = 'indigo', delay = 0 }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <MotionCard delay={delay} className="p-6">
            <div className="flex items-center gap-4">
                <motion.div
                    className={`p-4 rounded-xl ${colorClasses[color]}`}
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Icon size={24} />
                </motion.div>
                <div>
                    <motion.p
                        className="text-sm font-medium text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.2 }}
                    >
                        {label}
                    </motion.p>
                    <motion.h3
                        className="text-2xl font-bold text-gray-900 mt-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: delay + 0.4,
                            type: 'spring',
                            stiffness: 100,
                        }}
                    >
                        {value}
                    </motion.h3>
                </div>
            </div>
        </MotionCard>
    );
};

export const FloatingButton = ({ children, onClick, variant = 'primary', delay = 0 }) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    };

    return (
        <motion.button
            onClick={onClick}
            className={`px-6 py-3 rounded-xl font-medium transition-all shadow-md ${variants[variant]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: '0 15px 30px rgba(79, 70, 229, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay,
            }}
        >
            <motion.span
                animate={{
                    x: [0, 3, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                }}
            >
                {children}
            </motion.span>
        </motion.button>
    );
};
