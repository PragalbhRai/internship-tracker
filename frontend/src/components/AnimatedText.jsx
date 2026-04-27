import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedTitle = ({ children, delay = 0, className = '' }) => {
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: {
                staggerChildren: 0.06,
                delayChildren: delay,
            },
        }),
    };

    const child = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <motion.h1
            className={`text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {String(children).split("").map((char, index) => (
                <motion.span key={index} variants={child} className="inline-block">
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.h1>
    );
};

export const GlitchText = ({ text, delay = 0 }) => {
    return (
        <motion.div
            className="relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.8 }}
        >
            <span className="text-3xl font-bold text-gray-900">{text}</span>
            <motion.span
                className="absolute inset-0 text-3xl font-bold text-indigo-600 opacity-0"
                animate={{
                    x: [0, -2, 2, -1, 1, 0],
                    opacity: [0, 0.8, 0.8, 0.8, 0.8, 0],
                }}
                transition={{
                    duration: 0.5,
                    delay: delay + 0.5,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                }}
            >
                {text}
            </motion.span>
        </motion.div>
    );
};

export const PulseText = ({ text, className = "" }) => {
    return (
        <motion.span
            className={className}
            animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.95, 1.02, 0.95],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {text}
        </motion.span>
    );
};

export const ShimmerText = ({ children, className = "" }) => {
    return (
        <motion.div
            className={`relative ${className}`}
            style={{
                backgroundImage: `linear-gradient(
                    90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.3) 50%,
                    transparent 100%
                )`,
                backgroundSize: '200% 100%',
            }}
            animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            {children}
        </motion.div>
    );
};
