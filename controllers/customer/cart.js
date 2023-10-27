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

module.exports.removeCartProduct = async (req, res) => {
    try {
        const id = req.params.id
        dbCart.findByIdAndDelete(id)
            .then((removedDocument) => {
                if (!removedDocument) {
                    return res.status(404).json({ error: 'Document not found' });
                }

                return res.status(200).json({ message: 'Document removed successfully' });
            })
    }
    catch (error) {
        res.status(400).send("try again please")
    }
}