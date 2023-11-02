const mongoose = require('mongoose');
require('../../config/config')

const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isReturn: {
        type: Boolean,
        default: false,
    },
    returnReason: String,
    upiId: String,
    total: String,
    paymentStatus: {
        type: Boolean,
        default: false,
    },
    paymentType: String,
    orderAcceptedBy: String,
});

 module.exports = mongoose.model('orders', orderSchema);

 
