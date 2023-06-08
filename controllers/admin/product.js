const Message = require("../../config/message")

const dbProductList = require("../../modals/admin/productlist")
const dbProductCatagory = require("../../modals/admin/productcatagory")


module.exports.addProductCatagory = async (req, res) => {
    const { catagory } = req.body
    try {
        await dbProductCatagory.create({ catagory })
        res.status(200).send("product catagory added")
    }
    catch {
        res.status(400).send("try again")
    }
}
module.exports.addProduct = async (req, res) => {
    console.log("Hello");
    const { productName, description, price, productCatagory, stock } = req.body
    console.log(req.body);
    try {
        await dbProductList.create({ productName, description, price, productCatagory, stock })
        res.status(200).send("product added")
        console.log(res)
    }
    catch {
        res.status(400).send("try again")
        console.log(res)
    }
}
module.exports.GetProduct = async (req, res) => {
    const id = req.params.id
    const user = await dbProductList.findOne({ "_id": id })
    res.status(200).send(user)
}
module.exports.UpdateProduct = async (req, res) => {
    const { _id, productName, description, price, productCatagory, stock } = req.body
    console.log(_id)
    try {
        const product = await dbProductList.findOne({ "_id": _id }).updateOne(
            {
                productName: productName,
                description: description,
                price: price,
                productCatagory: productCatagory,
                stock: stock
            })
        console.log(product)
        if (product.modifiedCount === 1) {
            res.status(200).send("Product update successfully")
        } else {
            res.status(200).send("Product already modify with that value")
        }
    }
    catch {
        res.status(400).send("try again please")
    }
}
module.exports.DeleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        dbProductList.findByIdAndDelete(id)
            .then((deletedDocument) => {
                if (!deletedDocument) {
                    return res.status(404).json({ error: 'Document not found' });
                }

                return res.status(200).json({ message: 'Document deleted successfully' });
            })
    }
    catch (error) {

    }
}