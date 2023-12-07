const mongoose = require('mongoose')
require('../../config/config')

const finquirySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }
})


module.exports = mongoose.model('inquirys', finquirySchema)