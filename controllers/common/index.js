const Message = require("../../config/message")

const dbProductList = require("../../modals/admin/productlist")
const dbProductCatagory = require("../../modals/admin/productcatagory")

module.exports.getProduct = async (req, res) => {
    try {
        const product = await dbProductList.find({})
        if (product) {
            return res.status(200).send({
                data: product,
                message: "All product get successfully"
            })
        }
        return res.status(404).send({
            status: 404,
            data: [],
            message: "Product not found"
        })
    } catch {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}

module.exports.getProductCatagory = async (req, res) => {
    try {
        const product = await dbProductCatagory.find({})
        if (product) {
            return res.status(200).send({
                status: 200,
                data: product,
                message: "All product categories get successfully"
            })
        }
        return res.status(404).send({
            status: 404,
            data: [],
            message: "Product not found"
        })
    } catch {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}

module.exports.getProductById = async (req, res) => {
    const id = req.params.id
    try {
        const product = await dbProductList.findOne({ "_id": id })
        if (product) {
            return res.status(200).send({
                status: 200,
                data: product,
                message: "product get successfully"
            })
        }
        return res.status(404).send({
            status: 404,
            data: [],
            message: "Product not found"
        })
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}

module.exports.getProductByProductCatagory = async (req, res) => {
    const id = req.params.id
    try {
        const product = await dbProductList.findOne({ "productCatagory": id })
        if (product) {
            return res.status(200).send({
                status: 200,
                data: product,
                message: "product get successfully"
            })
        }
        return res.status(404).send({
            status: 404,
            data: [],
            message: "Product not found"
        })
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                data: [],
                message: "Server error"
            }
        );
    }
}