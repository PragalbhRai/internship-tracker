import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRealtime } from '../context/RealtimeContext';

const collaborators = [
    { name: 'A', color: 'bg-indigo-500' },
    { name: 'R', color: 'bg-emerald-500' },
    { name: 'K', color: 'bg-cyan-500' },
    { name: 'N', color: 'bg-amber-500' },
];

const feed = [
    'Reviewing candidate updates',
    'Syncing shortlist changes',
    'Refreshing dashboard data',
    'Publishing status transitions',
];

const LivePresence = ({ className = '', channel = 'global' }) => {
    const { socket, connected, joinChannel } = useRealtime();
    const [idx, setIdx] = useState(0);
    const [liveFeed, setLiveFeed] = useState(feed);
    const [presence, setPresence] = useState([]);
    const active = useMemo(() => feed[idx % feed.length], [idx]);
    const liveActive = useMemo(() => {
        if (!liveFeed.length) return active;
        return liveFeed[0];
    }, [liveFeed, active]);

    useEffect(() => {
        const timer = setInterval(() => setIdx((prev) => prev + 1), 2500);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!socket || !connected) return;

        joinChannel(channel);

        const onSnapshot = ({ presence: members = [], feed: items = [] } = {}) => {
            setPresence(members);
            if (items.length) setLiveFeed(items.map((item) => item.message));
        };

        const onPresence = ({ presence: members = [] } = {}) => {
            setPresence(members);
        };

        const onActivity = (item) => {
            if (!item?.message) return;
            setLiveFeed((prev) => [item.message, ...prev].slice(0, 8));
        };

        socket.on('collab:snapshot', onSnapshot);
        socket.on('collab:presence', onPresence);
        socket.on('collab:activity', onActivity);

        return () => {
            socket.off('collab:snapshot', onSnapshot);
            socket.off('collab:presence', onPresence);
            socket.off('collab:activity', onActivity);
        };
    }, [socket, connected, channel, joinChannel]);

    const visibleCollaborators = presence.length
        ? presence.slice(0, 5).map((member, i) => ({
              name: String(member.label || member.role || member.userId || 'U').charAt(0).toUpperCase(),
              color: collaborators[i % collaborators.length].color,
          }))
        : collaborators;

    return (
        <div className={`flex items-center justify-between gap-4 rounded-xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur ${className}`}>
            <div className="flex items-center -space-x-2">
                {visibleCollaborators.map((member, i) => (
                    <motion.div
                        key={`${member.name}-${i}`}
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${member.color}`}
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {member.name}
                        <motion.span
                            className="absolute inset-0 rounded-full border border-white/70"
                            animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                            transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity }}
                        />
                    </motion.div>
                ))}
            </div>
            <div className="min-w-0 flex-1 text-right text-xs font-medium text-slate-600">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={active}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="inline-block truncate"
                    >
                        Live: {liveActive}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LivePresence;
