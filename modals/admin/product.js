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
        type: Number,
        required: true,
    },
    productCatagory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'catagorys',
        required: true,
    },
    stock:{
        type: String,
        required: true,  
    }
})


module.exports = mongoose.model('products', productSchema)