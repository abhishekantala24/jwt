const mongoose = require('mongoose');
require('../../config/config')

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses',
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
});

 module.exports = mongoose.model('orders', orderSchema);

 
