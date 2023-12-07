const dbCart = require("../../modals/customer/cart")
const dbUser = require('../../modals/customer/user')
const dbProductList = require("../../modals/admin/product")
const mongoose = require('mongoose');

module.exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body
    const userId = req.user.userId
    try {
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
            await dbCart.create({ "productId": productId, "customerId": userId, "quantity": quantity })
            return res.status(201).send({
                status: 201,
                data: [],
                message: "product added in your cart"
            })
        }
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

module.exports.getCartData = async (req, res) => {
    const customerId = req.user.userId
    try {
        const cartData = await dbCart.countDocuments({ 'customerId': customerId })
        if (cartData) {
            const pipeline = [
                {
                    $match: { customerId: new mongoose.Types.ObjectId(customerId) }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                {
                    $project: {
                        productCatagory: 0
                    }
                },
                {
                    $unwind: "$product"
                },
                {
                    $lookup: {
                        from: "catagorys",
                        localField: "product.productCatagory",
                        foreignField: "_id",
                        as: "category",
                    },
                },
                {
                    $addFields: {
                        "product.category": { $arrayElemAt: ["$category", 0] }
                    }
                },
                {
                    $project: {
                        productId: 0,
                        customerId: 0,
                        "product.productCatagory": 0,
                        "category": 0
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
        console.log(err);
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Internal server error"
            }
        );
    }
}

module.exports.removeCartProduct = async (req, res) => {
    const customerId = req.user.userId
    const productId = req.params.id
    try {
        await dbCart.findOne({ customerId, productId })
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
                message: "Internal server error"
            }
        );
    }
}

module.exports.removeAllCartProduct = async (req, res) => {
    const customerId = req.user.userId
    try {
        await dbCart.deleteMany({ customerId: customerId })
        return res.status(200).json({
            status: 200,
            data: [],
            message: "removed all cart product"
        });
    } catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: error,
                message: "Internal server error"
            }
        );
    }
}

