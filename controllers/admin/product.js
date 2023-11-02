const Message = require("../../config/message")
const dbProductList = require("../../modals/admin/productlist")
const dbProductCatagory = require("../../modals/admin/productcatagory")


module.exports.addProductCatagory = async (req, res) => {
    const { catagory } = req.body
    try {
        await dbProductCatagory.create({ catagory })
        res.status(200).send({
            status: 200,
            message: "product catagory added successfully"
        })
    }
    catch {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}

module.exports.addProduct = async (req, res) => {
    const { productName, description, price, productCatagory, stock } = req.body
    try {
        await dbProductList.create({ productName, description, price, productCatagory, stock })
        res.status(200).send({
            status: 200,
            message: "product added successfully"
        })
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}

module.exports.UpdateProduct = async (req, res) => {
    const { _id, productName, description, price, productCatagory, stock } = req.body
    try {
        const product = await dbProductList.findOne({ "_id": _id }).updateOne(
            {
                productName: productName,
                description: description,
                price: price,
                productCatagory: productCatagory,
                stock: stock
            })
        if (product.modifiedCount === 1) {
            res.status(200).send(
                {
                    status: 200,
                    message: "Product update successfully"
                })
        } else {
            res.status(200).send({
                status: 200,
                message: "Product already modify with that value"
            })
        }
    }
    catch {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}

module.exports.DeleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        dbProductList.findByIdAndDelete(id)
            .then((deletedDocument) => {
                if (!deletedDocument) {
                    return res.status(404).json({
                        status: 404,
                        message: "Product not found"
                    });
                }
                return res.status(200).json(
                    {
                        status: 200,
                        message: 'Product deleted successfully'
                    });
            })
    }
    catch (error) {
        res.status(500).json(
            {
                status: 500,
                message: "Server error"
            }
        );
    }
}