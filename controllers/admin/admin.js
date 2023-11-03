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
            return res.status(404).json(
                {
                    status: 404,
                    message: "Admin not found"
                }
            )
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json(
                {
                    status: 401,
                    message: "Invalid credentials"
                }
            );
        }
        const token = authMiddleware.createToken(user, "brunt@admin");

        // Send the token in the response
        res.status(200).json({
            status: 200,
            token: token,
            message: "Login Successfully !"
        });
    } catch (error) {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}


module.exports.createAdmin = async (req, res) => {
    const { email, password, phone, firstName, lastName } = req.body;

    try {
        const existingUser = await dbAdmin.findOne({ email });
        const existingPhone = await dbAdmin.findOne({ phone });

        if (existingUser || existingPhone) {
            return res.status(400).json(
                {
                    status: 400,
                    data: [],
                    message: "Email or Phone Number is already registered"
                }
            );
        }

        const user = new dbAdmin({ email, password, phone, firstName, lastName });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;

        await user.save();

        const token = authMiddleware.createToken(user, "brunt@admin");

        res.status(201).json({
            status: 201,
            data: { token: token },
            message: "Admin Created Successfully !"
        });
    } catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}

module.exports.updateAdmin = async (req, res) => {
    const id = req.user.userId
    const { email, phone, firstName, lastName } = req.body;
    try {
        const updateAdminDetails = await dbAdmin.findByIdAndUpdate({ _id: id }, { email, phone, firstName, lastName });
        if (updateAdminDetails) {
            return res.status(200).json(
                {
                    status: 200,
                    data: [],
                    message: "Admin details updated"
                }
            );
        }

        res.status(404).json({
            status: 404,
            data: [],
            message: "Admin not found"
        });
    } catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}

module.exports.getAdminDetails = async (req, res) => {
    const id = req.user.userId
    try {
        const adminDetails = await dbAdmin.findOne({ _id: id }).select('-password')

        if (adminDetails) {
            return res.status(200).json(
                {
                    status: 200,
                    data: adminDetails,
                    message: "Admin details get successfully"
                }
            );
        }

        res.status(404).json({
            status: 404,
            data: [],
            message: "Admin not found"
        });
    } catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
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