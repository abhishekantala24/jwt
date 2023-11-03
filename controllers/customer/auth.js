const Message = require("../../config/message")

const dbUser = require('../../modals/customer/createuser')
const otpGenerator = require('otp-generator')
const authMiddleware = require('../../authMiddleware')
const bcrypt = require('bcrypt');

module.exports.login_email = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await dbUser.findOne({ email });

        if (!user) {
            return res.status(404).json(
                {
                    status: 404,
                    data: [],
                    message: "User not found"
                }
            );
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                data: [],
                message: 'Invalid credentials'
            });
        }
        const token = authMiddleware.createToken(user, "@ntala#123");

        // Send the token in the response
        res.status(200).json({
            status: 200,
            data: { token: token },
            message: "Login Successfully !"
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: [],
            message: "Server error"
        });
    }
}


module.exports.createUser = async (req, res) => {
    const { email, password, phone, name } = req.body;

    try {
        const existingUser = await dbUser.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: 400,
                data: [],
                message: "Email is already registered"
            });
        }
        const user = new dbUser({ email, password, phone, name });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        await user.save();
        const token = authMiddleware.createToken(user, "@ntala#123");
        res.status(201).json({
            status: 201,
            data: { token: token },
            message: "User Created Successfully !"
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            data: [],
            message: "Server error"
        });
    }
}


module.exports.send_otp = async (req, resp) => {
    const { phoneNumber } = req.body
    try {
        const otp = otpGenerator?.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const user = await dbUser.updateOne(
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
        const user = await dbUser.findOne({
            "phone": phoneNumber,
            "otp": otp
        })
        if (user) {
            const response = await dbUser.updateOne(
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