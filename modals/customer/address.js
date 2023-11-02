const mongoose = require('mongoose');

// Define the Address Schema
const addressSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false // Default to false for new addresses
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    wingNo: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
    },
    area: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('addresses', addressSchema);
