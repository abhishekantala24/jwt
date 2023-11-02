const Message = require("../../config/message")

const dbAdmin = require('../../modals/admin/admin')
const otpGenerator = require('otp-generator')
const authMiddleware = require('../../authMiddleware')
const bcrypt = require('bcrypt');

module.exports.Admin_login_email = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await dbAdmin.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = authMiddleware.createToken(user, "brunt@admin");

        // Send the token in the response
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports.createAdmin = async (req, res) => {
    const { email, password, phone, firstName, lastName } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await dbAdmin.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Create a new user
        const user = new dbAdmin({ email, password, phone, firstName, lastName });

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;

        // Save the user to the database
        await user.save();

        // If signup is successful, create a JWT token
        const token = authMiddleware.createToken(user, "brunt@admin");

        // Send the token in the response
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports.send_otp = async (req, resp) => {
    const { phoneNumber } = req.body
    try {
        const otp = otpGenerator?.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const user = await dbAdmin.updateOne(
            { phone: phoneNumber },
            { $set: { otp: otp } })
        if (user.modifiedCount > 0) {
            return resp.status(200).send({ Message: "Otp Send" })
        }
        return resp.status(200).send({ Message: "failed" })
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}

module.exports.verify_otp = async (req, resp) => {
    const { phoneNumber, otp } = req.body
    try {
        const user = await dbAdmin.findOne({
            "phone": phoneNumber,
            "otp": otp
        })
        if (user) {
            const response = await dbAdmin.updateOne(
                { phone: phoneNumber },
                { $set: { otp: null } })
            if (response.modifiedCount) {
                return resp.status(200).send({ Message: "verified" })
            } else {
                return resp.status(200).send({ Message: "vrification failed" })
            }
        }
        return resp.status(200).send({ Message: "otp not valid" })
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}