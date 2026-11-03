const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adhoc_jwt_super_secret_key_2026_change_in_production');

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session expired. Please sign in again.' });
        }
        return res.status(401).json({ error: 'Invalid authentication token.' });
    }
};

// Optional auth: parses token if present, but doesn't block unauthenticated requests
const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adhoc_jwt_super_secret_key_2026_change_in_production');
            req.user = decoded;
        }
    } catch {
        // Ignore invalid token on optional routes
    }
    next();
};

// Role-based authorization
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient privileges.' });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    optionalAuthMiddleware,
    requireRole,
};
