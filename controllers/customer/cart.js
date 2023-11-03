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
            const productIds = cartData.map(item => item.productId);
            const productList = await dbProductList.find({ _id: { $in: productIds } });

            const updatedCartItems = cartData.map(cartItem => {
                const matchingProduct = productList.find(product => product._id.toString() === cartItem.productId.toString());
                if (matchingProduct) {
                    return {
                        ...cartItem.toObject(),
                        productData: matchingProduct.toObject()
                    };
                }
                return cartItem;
            });

            const total = updatedCartItems.reduce((acc, item) => {
                if (item.productData) {
                    return acc + item.productData.price * item.quantity;
                }
                return acc;
            }, 0);

            res.status(200).send({
                status: 200,
                data: {
                    cartItem: updatedCartItems,
                    total
                },
                message: "Cart item get successfully"
            })
        } else {
            res.status(404).send({
                status: 404,
                data: [],
                message: "Cart item not found"
            })
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
                data: [],
                message: "Server error"
            }
        );
    }
}
