require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const createCollabGateway = require('./realtime/collabGateway');

const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internships');
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/internships', internshipRoutes);
app.use('/applications', applicationRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);

const errorHandler = require('./middleware/errorHandler');

// Global Error Handler
app.use(errorHandler);

createCollabGateway(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
