const Message = require("../../config/message")

const dbUser = require('../../modals/customer/createuser')

module.exports.createUser = async (req, resp) => {
    const { email, password, phone, name } = req.body
    try {
        const user = await dbUser.create({ name, phone, email, password })
        resp.status(201).send({ user: user, message: Message.USER_CREATED })
    }
    catch (err) {
        resp.status(400).send(Message.USER_EXIST)
    }
}

module.exports.login_email = async (req, resp) => {
    const { email, password } = req.body
    try {
        const user = await dbUser.find({ email, password })
        if (user.length > 0) {
            resp.status(201).send({ user: user[0]._id, Message: Message.LOGIN_SUCCESS })
        } else {
            resp.status(400).send(Message.CREDENTIAL_ERROR)
        }
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}
