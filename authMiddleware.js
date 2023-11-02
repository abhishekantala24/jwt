const jwt = require('jsonwebtoken');
const customerSecretKey = '@ntala#123';
const adminSecretKey = 'brunt@admin';
function createToken(user, key) {
    console.log(key);
    const payload = {
        userId: user._id,
        email: user.email,
    };
    return jwt.sign(payload, key, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    const identity = req.header('identity');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    if (!identity) {
        return res.status(401).json({ message: 'Access denied. No identity provided.' });
    }
    const secretKey = identity === "admin" ? adminSecretKey : customerSecretKey
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = { createToken, verifyToken };