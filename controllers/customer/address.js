const Message = require("../../config/message")
const dbUser = require('../../modals/customer/createuser')
const dbAddress = require('../../modals/customer/address')

module.exports.addAddress = async (req, res) => {
    const { customerId } = req.body
    try {
        const user = await dbUser.findOne({ _id: customerId });
        if (!user) {
            return res.status(404).json(
                {
                    status: 404,
                    message: "user not found"
                }
            );
        }
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
        const id = req.user.userId
        const address = await dbAddress.find({ customerId: id })
        if (address.length === 0) {
            return res.status(404).json(
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

module.exports.removeAddress = async (req, res) => {
    try {
        const id = req.params.id
        dbAddress.findByIdAndDelete(id)
            .then((deletedDocument) => {
                if (!deletedDocument) {
                    return res.status(404).json({
                        status: 404,
                        message: "Address not found"
                    });
                }
                return res.status(200).json(
                    {
                        status: 200,
                        message: 'Address deleted successfully'
                    });
            })
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}

module.exports.setDefaultAddress = async (req, res) => {
    try {
        const customerId = req.user.userId
        const addressId = req.params.id
        dbAddress.updateMany({ customerId }, { isDefault: false })
        const updatedAddress = await dbAddress.findByIdAndUpdate(addressId, { isDefault: true })
            .then((defaultAddress) => {
                if (!defaultAddress) {
                    return res.status(404).json({
                        status: 404,
                        message: "Address not found"
                    });
                }
                return res.status(200).json(
                    {
                        status: 200,
                        message: 'Default address added successfully'
                    });
            })
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}