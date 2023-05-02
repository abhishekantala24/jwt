
const dbUser = require('../../modals/customer/createuser')

module.exports.getAllUser = async (req, resp) => {
    try {
        const users = await dbUser.find({})
        resp.status(200).send({
            status: 200,
            data: users,
            Message: "successful"
        })
    } catch {
        resp.status(400).send("product not found")
    }
}