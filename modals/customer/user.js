const mongoose = require('mongoose')
require('../../config/config')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('users', userSchema)