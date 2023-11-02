const dbCart = require("../../modals/customer/cart")
const dbUser = require('../../modals/customer/createuser')
const dbProductList = require("../../modals/admin/productlist")

module.exports.addToCart = async (req, resp) => {
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
                        return resp.status(200).send("cart updated")
                    }
                }
                else {
                    await dbCart.create({ "productId": productId, "customerId": customerId, "quantity": quantity, ...product })
                    return resp.status(200).send("product added")
                }
            }
            return resp.status(200).send("product not found")
        }
        return resp.status(200).send("customer not found")
    }
    catch (err) {
        resp.status(400).send("Message.USER_NOT_FOUND")
    }
}

module.exports.getCartData = async (req, resp) => {
    const { customerId } = req.body
    try {
        const cartData = await dbCart.find({ 'customerId': customerId })
        if (cartData.length) {
            resp.status(200).send({ cart: cartData })
        } else {
            resp.status(200).send('cart item not found')
        }
    }
    catch (err) {
        resp.status(400).send("Message.USER_NOT_FOUND")
    }
}

const mongoose = require('mongoose');

module.exports.removeCartProduct = async (req, res) => {
    const { customerId, productId } = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid customerId or productId' });
        }
        dbCart.findOne({ customerId, productId })
            .then(async (cartItem) => {
                if (!cartItem) {
                    return res.status(404).json({ error: 'Product not found in the cart' });
                }
                if (cartItem.quantity === 1) {
                    await dbCart.findByIdAndDelete(cartItem._id);
                } else {
                    cartItem.quantity -= 1;
                    await cartItem.save();
                }
                return res.status(200).json({ message: 'Product removed successfully' });
            });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
