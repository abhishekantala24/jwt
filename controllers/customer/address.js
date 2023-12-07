const Message = require("../../config/message")
const dbUser = require('../../modals/customer/user')
const dbAddress = require('../../modals/customer/address')

module.exports.addAddress = async (req, res) => {
    try {
        await dbAddress.create(req.body)
        res.status(201).json(
            {
                status: 201,
                data: [],
                message: "Address Saved"
            }
        );
    }
    catch (err) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Internal server error"
            }
        );
    }
}

module.exports.getAddress = async (req, res) => {
    try {
        const id = req.user.userId
        const address = await dbAddress.find({ customerId: id })
        if (address) {
            return res.status(404).json(
                {
                    status: 404,
                    data: address,
                    message: "Address get successfully"
                }
            );
        }
        res.status(200).json(
            {
                status: 200,
                data: address,
                message: "Address not found"
            }
        );
    }
    catch (err) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Internal server error"
            }
        );
    }
}

module.exports.removeAddress = async (req, res) => {
    try {
        const id = req.params.id
        dbAddress.findByIdAndDelete(id)
            .then((deletedDocument) => {
                if (!deletedDocument) {
                    return res.status(404).json({
                        status: 404,
                        data: [],
                        message: "Address not found"
                    });
                }
                return res.status(200).json(
                    {
                        status: 200,
                        data: [],
                        message: 'Address deleted successfully'
                    });
            })
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Internal server error"
            }
        );
    }
}

module.exports.setDefaultAddress = async (req, res) => {
    try {
        const customerId = req.user.userId
        const addressId = req.params.id
        await dbAddress.updateMany({ customerId }, { isDefault: false })
        await dbAddress.findByIdAndUpdate(addressId, { isDefault: true })
        return res.status(200).json(
            {
                status: 200,
                data: [],
                message: 'Default address added successfully'
            });
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Address not found"
            }
        );
    }
}