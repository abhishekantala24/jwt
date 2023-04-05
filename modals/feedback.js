const mongoose = require('mongoose')
require('../config/config')

const feedbackSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
})


module.exports = mongoose.model('feedbacks', feedbackSchema)