const Message = require("../../config/message")

const dbProductList = require("../../modals/admin/productlist")
const dbProductCatagory = require("../../modals/admin/productcatagory")

module.exports.getProduct = async (req, resp) => {
    try{
        const product = await dbProductList.find({})
        resp.status(201).send({product})
    }catch{
        resp.status(400).send("product not found")
    }
}

module.exports.getProductCatagory = async (req, resp) => {
    try{
        const product = await dbProductCatagory.find({})
        resp.status(201).send({product})
    }catch{
        resp.status(400).send("catagory not found")
    }
}
