const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key';

function createToken(user) {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { createToken, verifyToken };
