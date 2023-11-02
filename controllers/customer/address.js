const Message = require("../../config/message")

const dbAddress = require('../../modals/customer/address')

module.exports.addAddress = async (req, res) => {
    try {
        await dbAddress.create(req.body)
        res.status(201).json(
            {
                status: 201,
                message: "Address Saved"
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

module.exports.getAddress = async (req, res) => {
    try {
        const address = await dbAddress.find({})
        if (!address) {
            res.status(404).json(
                {
                    status: 404,
                    message: "Address not found"
                }
            );
        }
        res.status(200).json(
            {
                status: 200,
                data: address,
                message: "Address get successfully"
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