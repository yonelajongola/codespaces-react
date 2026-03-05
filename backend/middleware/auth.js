const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, errors: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, errors: 'Invalid or expired token.' });
    }
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, errors: 'Not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, errors: 'Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authenticateToken, requireRole };
