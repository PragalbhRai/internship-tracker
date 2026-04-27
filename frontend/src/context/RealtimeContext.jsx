import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const RealtimeContext = createContext({
    socket: null,
    connected: false,
    joinChannel: () => {},
    publishActivity: () => {},
});

export const RealtimeProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            setSocket((prev) => {
                if (prev) prev.disconnect();
                return null;
            });
            setConnected(false);
            return;
        }

        const baseUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const instance = io(baseUrl, {
            autoConnect: true,
            auth: { token },
            withCredentials: true,
        });

        instance.on('connect', () => setConnected(true));
        instance.on('disconnect', () => setConnected(false));

        setSocket(instance);

        return () => {
            instance.disconnect();
            setConnected(false);
        };
    }, [token]);

    const joinChannel = useCallback((channel) => {
        if (!socket) return;
        socket.emit('collab:join', { channel });
    }, [socket]);

    const publishActivity = useCallback((message, channel) => {
        if (!socket || !message) return;
        socket.emit('collab:activity', { message, channel });
    }, [socket]);

    const value = useMemo(() => ({ socket, connected, joinChannel, publishActivity }), [socket, connected, joinChannel, publishActivity]);

    return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
};

export const useRealtime = () => useContext(RealtimeContext);
