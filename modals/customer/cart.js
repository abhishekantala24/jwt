const mongoose = require('mongoose')
require('../../config/config')

const cartSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('carts', cartSchema)