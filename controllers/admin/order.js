const dbOrder = require('../../modals/customer/order')

module.exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body
    try {
        await dbOrder.updateOne({ _id: orderId }, { status: status })
        res.status(200).send({
            status: 200,
            message: "Order Status Updated"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
}