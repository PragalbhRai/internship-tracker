import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(125deg, rgba(15,23,42,0.06) 0%, rgba(99,102,241,0.08) 48%, rgba(6,182,212,0.06) 100%)',
                }}
                animate={{ opacity: [0.65, 0.95, 0.65] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '58px 58px',
                }}
                animate={{ backgroundPosition: ['0px 0px', '58px 58px'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
                className="absolute inset-x-0 top-[-30%] h-[65%]"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.02) 70%, transparent 100%)',
                    filter: 'blur(26px)',
                }}
                animate={{ x: ['-8%', '8%', '-8%'] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(255,255,255,0) 15%, rgba(2,6,23,0.22) 100%)',
                }}
            />
        </div>
    );
};

export default AnimatedBackground;
