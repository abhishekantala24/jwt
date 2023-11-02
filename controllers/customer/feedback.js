const Message = require("../../config/message")

const dbFeedback = require('../../modals/customer/feedback')
const dbInquiry = require('../../modals/customer/inquiry')

module.exports.feedback = async (req, resp) => {
    const { name, phone, message, customerId, start } = req.body
    try {
        await dbFeedback.create({ name, phone, message, customerId, start })
        resp.status(200).send(Message.THANKYOU)
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}

module.exports.inquiry = async (req, resp) => {
    const { name, phone, reason, customerId } = req.body
    try {
        await dbInquiry.create({ name, phone, reason, customerId })
        resp.status(200).send(Message.WILL_CONTACT)
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}