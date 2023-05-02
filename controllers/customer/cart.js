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
                        { $set: { quantity: matchProduct.quantity + quantity } })
                    if (update.modifiedCount) {
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
    const { id } = req.body
    try {
        const cartData = dbCart.find({ '_id': id })
        resp.status(200).send(cartData)
    }
    catch (err) {
        resp.status(400).send("Message.USER_NOT_FOUND")
    }
}