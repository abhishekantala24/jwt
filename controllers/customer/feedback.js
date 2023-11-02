const Message = require("../../config/message")

const dbFeedback = require('../../modals/customer/feedback')
const dbInquiry = require('../../modals/customer/inquiry')

module.exports.feedback = async (req, res) => {
    const { name, phone, message, customerId, start } = req.body
    try {
        await dbFeedback.create({ name, phone, message, customerId, start })
        res.status(201).json(
            {
                status: 201,
                message: "Thank you for giving feedback"
            }
        );
    }
    catch (err) {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}

module.exports.inquiry = async (req, res) => {
    const { name, phone, reason, customerId } = req.body
    try {
        await dbInquiry.create({ name, phone, reason, customerId })
        res.status(201).json(
            {
                status: 201,
                message: Message.WILL_CONTACT
            }
        );
    }
    catch (err) {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}