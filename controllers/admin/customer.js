
const dbUser = require('../../modals/customer/createuser')

module.exports.getAllUser = async (req, res) => {
    try {
        const users = await dbUser.find({}).select('-password')
        if (!users) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        res.status(200).send({
            status: 200,
            data: users,
            message: "successfull"
        })
    } catch {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}