const Message = require("../../config/message")

const dbOrder = require('../../modals/customer/order')
const dbCart = require('../../modals/customer/cart')
const dbAddress = require('../../modals/customer/address')
const dbOrderedItem = require('../../modals/customer/orderedItem')

module.exports.createOrder = async (req, res) => {
    const customerId = req.user.userId
    const email = req.user.email
    const { paymentType, total } = req.body
    try {
        const cartItems = await dbCart.find({ customerId })
        if (cartItems.length === 0) {
            return res.status(404).json({
                code: 404,
                data: [],
                message: "Cart is empty"
            });
        }
        const deliveryAddress = await dbAddress.findOne( { customerId, isDefault: true }).select('_id').lean();
        await dbOrder.create(
            {
                customerId,
                deliveryAddress: deliveryAddress._id.toString(),
                status: 'pending',
                createdAt: new Date(),
                total,
                paymentType,
                orderAcceptedBy: email,
            }
        ).then(async (response) => {
            const orderedItems = cartItems.map((cartItem) => {
                return {
                    productId: cartItem.productId,
                    customerId: customerId,
                    quantity: cartItem.quantity,
                    orderId: response._id
                };
            });

            await dbOrderedItem.insertMany(orderedItems);
            await dbCart.deleteMany({});
            res.status(201).json(
                {
                    status: 201,
                    data: response,
                    message: "Your order placed successfully!"
                }
            );
        })
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