const Message = require("../../config/message")

const dbUser = require('../../modals/customer/createuser')
const otpGenerator = require('otp-generator')

module.exports.createUser = async (req, resp) => {
    const { email, password, phone, name } = req.body
    try {
        const user = await dbUser.create({ name, phone, email, password })
        resp.status(200).send({ user: user, message: Message.USER_CREATED })
    }
    catch (err) {
        resp.status(400).send(err)
    }
}

module.exports.login_email = async (req, resp) => {
    const { email, password } = req.body
    try {
        const user = await dbUser.findOne({
            "email": email,
            "password": password
        })
        if (user.email) {
            resp.status(200).send({
                status: 200,
                data: user,
                Message: Message.LOGIN_SUCCESS
            })
        }
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
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
            client.messages
                .create({
                    body: `Your OTP is: ${otp}`,
                    from: '6354016781',
                    to: `whatsapp:${phoneNumber}`
                })
                .then((message) => {
                    console.log(`OTP sent: ${message.sid}`);
                    return resp.status(200).send({ Message: "OTP Sent" });
                })
                .catch((error) => {
                    console.error(`Error sending OTP: ${error.message}`);
                    return resp.status(500).send({ Message: "Failed to send OTP" });
                });

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