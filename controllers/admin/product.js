const Message = require("../../config/message")

const dbProductList = require("../../modals/admin/productlist")
const dbProductCatagory = require("../../modals/admin/productcatagory")

module.exports.productCatagory = async (req, res) => {
    const { catagory } = req.body
    try {
        await dbProductCatagory.create({ catagory })
        res.status(201).send("product catagory added")
    }
    catch {
        res.status(400).send("try again")
    }
}

module.exports.productList = async (req, res) => {
    const { productName, description, price, productCatagory } = req.body
    try {
        await dbProductList.create({ productName, description, price, productCatagory })
        res.status(201).send("product added")
    }
    catch {
        res.status(400).send("try again")
    }
}