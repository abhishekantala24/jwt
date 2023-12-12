const Message = require("../../config/message")

const dbProductList = require("../../modals/admin/product")
const dbProductCatagory = require("../../modals/admin/productcatagory")

module.exports.getProduct = async (req, res) => {
    try {
        const product = await dbProductList.aggregate([
            {
                $lookup: {
                    from: 'catagorys',
                    localField: 'productCatagory',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            }
        ]).exec();

        if (product) {
            return res.status(200).send({
                status: 200,
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
                message: "Internal server error"
            }
        );
    }
}

module.exports.getProductCatagory = async (_req, res) => {
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
                message: "Internal server error"
            }
        );
    }
}

module.exports.getProductById = async (req, res) => {
    const id = req.params.id
    try {
        const product = await dbProductList.findOne({ "_id": id })
        return res.status(200).send({
            status: 200,
            data: product,
            message: "product get successfully"
        })
    }
    catch (error) {
        return res.status(404).send({
            status: 404,
            data: [],
            message: "Product not found"
        })
    }
}

module.exports.getProductByProductCatagory = async (req, res) => {
    const id = req.params.id
    try {
        const product = await dbProductList.findOne({ "productCatagory": id })
        return res.status(200).send({
            status: 200,
            data: product,
            message: "product get successfully"
        })
    }
    catch (error) {
        return res.status(404).send({
            status: 404,
            data: [],
            message: "Product not found"
        })
    }
}