const dbUser = require('../modals/createuser')
const dbFeedback = require('../modals/feedback')
const dbInquiry = require('../modals/inquiry')


module.exports.home = (req, resp) => {
    resp.send('home')
}

module.exports.createUser = async (req, resp) => {
    const { email, password, phone, roll, name } = req.body
    try {
        const user = await dbUser.create({ email, password, phone, roll, name })
        resp.status(201).send("user created")
    }
    catch (err) {
        resp.status(400).send("oops! something went wrong")
    }
}

module.exports.login_email = async (req, resp) => {
    const { email, password } = req.body
    try {
        const user = await dbUser.find({ email, password })
        if (user.length > 0) {
            resp.status(201).send("login successfully")
        } else {
            resp.status(400).send("invalid password or email")
        }
    }
    catch (err) {
        resp.status(400).send("user not found")
    }
}

module.exports.feedback = async (req, resp) => {
    const { name, phone, message } = req.body
    try {
        await dbFeedback.create({ name, phone, message })
        resp.status(201).send("Thank you")
    }
    catch (err) {
        resp.status(400).send("oops! something went wrong ")
    }
}

module.exports.inquiry = async (req, resp) => {
    const { name, phone, reason } = req.body
    try {
        await dbInquiry.create({ name, phone, reason })
        resp.status(201).send("will will contact you soon")
    }
    catch (err) {
        resp.status(400).send("oops! something went wrong ")
    }
}