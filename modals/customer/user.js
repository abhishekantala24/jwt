const mongoose = require('mongoose')
require('../../config/config')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
    }
})

module.exports = mongoose.model('users', userSchema)