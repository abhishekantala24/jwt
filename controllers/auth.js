const dbModal = require('../modals/user')


module.exports.home = (req, resp) => {
    resp.send('home')
}

module.exports.login_email = async (req, resp) => {
    // console.log(req.body)
    // const result = 
    // resp.send(result)
    const { email, password } = req.body
    try {
        const user = await dbModal.create({ email, password })
        resp.status(201).json(user)
    }
    catch (err) {
        resp.status(400).send("user not created")
    }
}