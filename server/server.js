const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productionHouseRoutes = require('./routes/productionHouseRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const savedHouseRoutes = require('./routes/savedHouseRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Enable CORS
app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
        });
        next();
    });
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'AdHoc Production Backend API',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/production-houses', productionHouseRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/saved-houses', savedHouseRoutes);
app.use('/api/verification', verificationRoutes);

// 404 Not Found handler
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`
=====================================================
  AdHoc Express Backend is running on port ${PORT}
  Health check: http://localhost:${PORT}/api/health
  API Base:     http://localhost:${PORT}/api
=====================================================
    `);

    // Verify DB connectivity
    const isDbConnected = await testConnection();
    if (!isDbConnected) {
        console.warn(`
[!NOTE] MySQL connection not yet established.
Please make sure:
1. MySQL80 service is running.
2. In 'server/.env', DB_USER and DB_PASSWORD match your local MySQL credentials.
3. You have run 'npm run db:init' and 'npm run db:seed' inside the 'server' folder.
        `);
    }
});

module.exports = app;
