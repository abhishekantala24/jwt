const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';
function createToken(user) {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = { createToken, verifyToken };