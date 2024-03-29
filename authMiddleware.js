const jwt = require('jsonwebtoken');
const dbUser = require('./modals/customer/user')

const customerSecretKey = '@ntala#123';
const adminSecretKey = 'brunt@admin';
function createToken(user, key) {
    const payload = {
        userId: user._id,
        email: user.email,
    };
    return jwt.sign(payload, key, { expiresIn: '240h' });
}

const verifyToken = async (req, res, next) => {
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
        const users = await dbUser.find({}).select('-password')
        if(!users){
            res.status(404).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = { createToken, verifyToken };