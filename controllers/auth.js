const Message = require("../config/message")

const dbUser = require('../modals/createuser')
const dbFeedback = require('../modals/feedback')
const dbInquiry = require('../modals/inquiry')

module.exports.home = (req, resp) => {
    resp.send('home')
}

module.exports.createUser = async (req, resp) => {
    const { email, password, phone, roll, name } = req.body
    try {
        await dbUser.create({ email, password, phone, roll, name })
        resp.status(201).send("user created")
    }
    catch (err) {
        resp.status(400).send(Message.SOMETHING_WRONG)
    }
}

module.exports.login_email = async (req, resp) => {
    const { email, password } = req.body
    try {
        await dbUser.find({ email, password })
        if (user.length > 0) {
            resp.status(201).send(Message.LOGIN_SUCCESS)
        } else {
            resp.status(400).send(Message.CREDENTIAL_ERROR)
        }
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}

module.exports.feedback = async (req, resp) => {
    const { name, phone, message } = req.body
    try {
        await dbFeedback.create({ name, phone, message })
        resp.status(201).send(Message.THANKYOU)
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}

module.exports.inquiry = async (req, resp) => {
    const { name, phone, reason } = req.body
    try {
        await dbInquiry.create({ name, phone, reason })
        resp.status(201).send(Message.WILL_CONTACT)
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}