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
        type: String,
        required: true,
    }
})


module.exports = mongoose.model('inquirys', finquirySchema)