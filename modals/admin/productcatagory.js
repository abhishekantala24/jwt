const mongoose = require('mongoose')
require('../../config/config')

const productCatagorySchema = mongoose.Schema({
    catagory: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('catagorys', productCatagorySchema)