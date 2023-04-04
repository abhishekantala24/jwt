const dbModal = require('../modals/user')


module.exports.home = (req, resp) => {
    resp.send('home')
}

module.exports.createUser = async (req, resp) => {
    const { email, password } = req.body
    try {
        const user = await dbModal.create({ email, password })
        resp.status(201).json(user)
    }
    catch (err) {
        resp.status(400).send("user not created")
    }
}

module.exports.login_email = async (req, resp) => {
    const { email, password } = req.body
    try {
        const user = await dbModal.find({ email, password })
        resp.status(201).send("login successfully")
    }
    catch (err) {
        resp.status(400).send("user not created")
    }
}