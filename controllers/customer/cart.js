const dbCart = require("../../modals/customer/cart")
const dbUser = require('../../modals/customer/createuser')
const dbProductList = require("../../modals/admin/productlist")
const mongoose = require('mongoose');

module.exports.addToCart = async (req, res) => {
    const { productId, customerId, quantity } = req.body

    try {
        const user = await dbUser.findOne({ "_id": customerId })
        if (user) {
            const product = await dbProductList.findOne({ "_id": productId })
            if (product) {
                const matchProduct = await dbCart.findOne({ "productId": productId })
                if (matchProduct) {
                    const update = await dbCart.updateOne(
                        { productId: productId },
                        { $set: { quantity: (parseInt(matchProduct.quantity, 10) + parseInt(quantity, 10)).toString() } })

                    if (update.modifiedCount > 0) {
                        return res.status(200).send({
                            status: 200,
                            data: [],
                            message: "cart updated"
                        })
                    }
                }
                else {
                    await dbCart.create({ "productId": productId, "customerId": customerId, "quantity": quantity, ...product })
                    return res.status(201).send({
                        status: 201,
                        data: [],
                        message: "product added in your cart"
                    })
                }
            }
            return res.status(404).send({
                status: 404,
                data: [],
                message: "product not found"
            })
        }
        return res.status(200).send({
            status: 404,
            data: [],
            message: "User not found"
        })
    }
    catch (err) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}

module.exports.getCartData = async (req, res) => {
    const customerId = req.user.userId
    try {
        const cartData = await dbCart.find({ 'customerId': customerId })

        if (cartData.length) {
            const pipeline = [
                {
                    $match: { customerId: customerId }
                },
                {
                    $lookup: {
                        from: 'products',
                        let: { localProductId: { $toObjectId: '$productId' } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$_id', '$$localProductId'] }
                                }
                            }
                        ],
                        as: 'productDetails'
                    }
                },
                {
                    $unwind: '$productDetails'
                },
                {
                    $group: {
                        _id: null,
                        cartItem: {
                            $push: {
                                _id: '$$ROOT._id',
                                productId: '$$ROOT.productId',
                                customerId: '$$ROOT.customerId',
                                quantity: '$$ROOT.quantity',
                                productDetails: '$productDetails',
                                totalPrice: { $multiply: ['$productDetails.price', '$$ROOT.quantity'] }
                            }
                        },
                        total: { $sum: { $multiply: ['$productDetails.price', '$quantity'] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        cartItem: 1,
                        total: 1
                    }
                }
            ];

            const result = await dbCart.aggregate(pipeline)

            if (result.length > 0) {
                res.status(200).send({
                    status: 200,
                    data: result,
                    message: "Cart items retrieved successfully"
                });
            } else {
                res.status(404).send({
                    status: 404,
                    data: result,
                    message: "Cart items not found"
                });
            }
        } else {
            res.status(404).send({
                status: 404,
                data: [],
                message: "Cart items not found"
            });
        }
    }
    catch (err) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}

module.exports.removeCartProduct = async (req, res) => {
    const { customerId, productId } = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                status: 400,
                data: [],
                message: "Invalid customerId or productId"
            });
        }
        dbCart.findOne({ customerId, productId })
            .then(async (cartItem) => {
                if (!cartItem) {
                    return res.status(404).json({
                        status: 404,
                        data: [],
                        message: "Product not found in the cart"
                    });
                }
                if (cartItem.quantity === 1) {
                    await dbCart.findByIdAndDelete(cartItem._id);
                } else {
                    cartItem.quantity -= 1;
                    await cartItem.save();
                }
                return res.status(200).json({
                    status: 200,
                    data: [],
                    message: "Product removed successfully"
                });
            });
    } catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: error,
                message: "Server error"
            }
        );
    }
}
