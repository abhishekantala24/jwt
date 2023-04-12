const Message = require("../../config/message")

const dbUser = require('../../modals/customer/createuser')

module.exports.createUser = async (req, resp) => {
    const { email, password, phone, name } = req.body
    try {
        const user = await dbUser.create({ name, phone, email, password })
        resp.status(200).send({ user: user, message: Message.USER_CREATED })
    }
    catch (err) {
        resp.status(400).send(Message.USER_EXIST)
    }
}

module.exports.login_email = async (req, resp) => {
    const { email, password } = req.body
    try {
        const user = await dbUser.find({
            "$or":[
                {"email":{$regex:email}},
                {"password":{$regex:password}}
            ]
        })
        if (user.length >= 0) {
            resp.status(200).send({ user: user[0], Message: Message.LOGIN_SUCCESS })
        } else {
            resp.status(200).send({ Message: Message.CREDENTIAL_ERROR })
        }
    }
    catch (err) {
        resp.status(400).send(Message.USER_NOT_FOUND)
    }
}
