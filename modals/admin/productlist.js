const mongoose = require('mongoose')
require('../../config/config')

const productSchema = mongoose.Schema({
   
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    productCatagory: {
        type: String,
        required: true,
    },
    stock:{
        type: String,
        required: true,  
    }
})


module.exports = mongoose.model('products', productSchema)