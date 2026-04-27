const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const MAX_FEED_ITEMS = 40;

const ensureRoomState = (roomStates, roomName) => {
    if (!roomStates.has(roomName)) {
        roomStates.set(roomName, { presence: new Map(), feed: [] });
    }
    return roomStates.get(roomName);
};

const formatPresence = (presenceMap) => {
    return Array.from(presenceMap.values()).map((member) => ({
        userId: member.userId,
        role: member.role,
        label: member.label,
    }));
};

const normalizeToken = (token = '') => token.replace(/^Bearer\s+/i, '').trim();

const createCollabGateway = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
            credentials: true,
        },
    });

    const roomStates = new Map();

    io.on('connection', (socket) => {
        const rawToken = socket.handshake.auth?.token || '';
        const token = normalizeToken(rawToken);
        let user = null;

        if (token && process.env.JWT_SECRET) {
            try {
                user = jwt.verify(token, process.env.JWT_SECRET);
            } catch (_) {
                user = null;
            }
        }

        socket.data.user = user;
        socket.data.currentRoom = null;

        socket.on('collab:join', ({ channel = 'global' } = {}) => {
            const safeChannel = String(channel).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30) || 'global';
            const roomName = `collab:${safeChannel}`;
            const actor = socket.data.user;
            const state = ensureRoomState(roomStates, roomName);

            if (socket.data.currentRoom && socket.data.currentRoom !== roomName) {
                const prevState = roomStates.get(socket.data.currentRoom);
                if (prevState) {
                    prevState.presence.delete(socket.id);
                    io.to(socket.data.currentRoom).emit('collab:presence', { presence: formatPresence(prevState.presence) });
                }
                socket.leave(socket.data.currentRoom);
            }

            socket.join(roomName);
            socket.data.currentRoom = roomName;

            state.presence.set(socket.id, {
                userId: actor?.user_id || `guest-${socket.id.slice(0, 6)}`,
                role: actor?.role || 'GUEST',
                label: actor?.email || actor?.role || 'Guest',
            });

            socket.emit('collab:snapshot', {
                presence: formatPresence(state.presence),
                feed: state.feed,
            });
            io.to(roomName).emit('collab:presence', { presence: formatPresence(state.presence) });
        });

        socket.on('collab:activity', ({ message = '', channel = '' } = {}) => {
            const targetRoom = socket.data.currentRoom || `collab:${String(channel || 'global').toLowerCase()}`;
            const state = ensureRoomState(roomStates, targetRoom);
            const actor = socket.data.user;
            const text = String(message).trim().slice(0, 160);

            if (!text) return;

            const item = {
                id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
                message: text,
                at: Date.now(),
                by: actor?.role || 'GUEST',
            };

            state.feed.unshift(item);
            if (state.feed.length > MAX_FEED_ITEMS) {
                state.feed.length = MAX_FEED_ITEMS;
            }

            io.to(targetRoom).emit('collab:activity', item);
        });

        socket.on('disconnect', () => {
            const roomName = socket.data.currentRoom;
            if (!roomName) return;

            const state = roomStates.get(roomName);
            if (!state) return;

            state.presence.delete(socket.id);
            io.to(roomName).emit('collab:presence', { presence: formatPresence(state.presence) });
        });
    });

    return io;
};

module.exports = createCollabGateway;
