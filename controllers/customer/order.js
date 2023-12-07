const mongoose = require('mongoose');
const Message = require("../../config/message")

const dbOrder = require('../../modals/customer/order')
const dbCart = require('../../modals/customer/cart')
const dbAddress = require('../../modals/customer/address')
const dbOrderedItem = require('../../modals/customer/orderedItem')

module.exports.createOrder = async (req, res) => {
    const customerId = req.user.userId;
    const email = req.user.email;
    const { paymentType, total } = req.body;
    try {
        const deliveryAddress = await dbAddress
            .findOne({ customerId, isDefault: true })
            .select('_id')
            .lean();

        if (!deliveryAddress) {
            return res.status(404).json({
                code: 404,
                data: [],
                message: "Default delivery address not found",
            });
        }
        const cartValid = await dbCart.countDocuments({ customerId: customerId })
        if (cartValid < 0) {
            return res.status(404).json({
                code: 404,
                data: [],
                message: "Cart is empty",
            });
        }

        const pipeline = [
            {
                $match: { customerId: new mongoose.Types.ObjectId(customerId) }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: "$product"
            },
            {
                $project: {
                    _id: 0,
                    productId: "$product._id",
                    quantity: "$quantity",
                    price: "$product.price"
                }
            },
            {
                $group: {
                    _id: null,
                    items: {
                        $push: {
                            productId: "$productId",
                            quantity: "$quantity",
                            price: "$price"
                        }
                    },
                    grandTotal: { $sum: { $multiply: ["$quantity", "$price"] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    items: 1,
                    grandTotal: 1
                }
            }
        ];
        const cartAggregationResult = await dbCart.aggregate(pipeline).exec();

        const grandTotal = cartAggregationResult[0]?.grandTotal || [];
        const orderItems = cartAggregationResult[0]?.items || [];

        const order = {
            customerId,
            deliveryAddress: deliveryAddress._id,
            status: 'pending',
            createdAt: new Date(),
            total: grandTotal,
            paymentType,
        };
        const session = await dbOrder.startSession();
        session.startTransaction();
        try {
            const [orderDoc] = await dbOrder.create([order], { session });
            const orderedItemsWithOrderId = orderItems.map((item) => ({
                ...item,
                orderId: orderDoc._id,
                customerId: customerId,
            }));
            await dbOrderedItem.create(orderedItemsWithOrderId, { session });
            await dbCart.deleteMany({ customerId }, { session });
            await session.commitTransaction();
            session.endSession();
            res.status(201).json({
                status: 201,
                data: orderDoc,
                message: "Your order placed successfully!",
            });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            data: err,
            message: "Internal server error",
        });
    }
};

module.exports.getOrderData = async (req, res) => {
    const customerId = req.user.userId
    try {
        const orderCount = await dbOrder.countDocuments({ customerId: customerId });

        if (!orderCount) {
            return res.status(404).json({
                code: 404,
                data: orderCount,
                message: "Order not found",
            });
        }

        const data = await dbOrder.aggregate([
            { $match: { customerId: new mongoose.Types.ObjectId(customerId) } },
            {
                $lookup: {
                    from: 'ordereditems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderedItems',
                },
            },
            {
                $unwind: '$orderedItems',
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderedItems.productId',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $unwind: '$product',
            },
            {
                $project: {
                    orderId: '$_id',
                    orderDate: '$createdAt',
                    deliveryAddress: '$deliveryAddress',
                    status: '$status',
                    total: '$total',
                    isReturn: '$isReturn',
                    returnReason: '$returnReason',
                    upiId: '$upiId',
                    paymentStatus: '$paymentStatus',
                    paymentType: '$paymentType',
                    productId: '$product._id',
                    productName: '$product.productName',
                    description: '$product.description',
                    price: '$product.price',
                    productCategory: '$product.productCatagory',
                    stock: '$product.stock',
                    quantity: '$orderedItems.quantity',
                    totalPrice: '$orderedItems.price',
                },
            },
            {
                $group: {
                    _id: '$orderId',
                    orderDate: { $first: '$orderDate' },
                    deliveryAddress: { $first: '$deliveryAddress' },
                    status: { $first: '$status' },
                    total: { $first: '$total' },
                    isReturn: { $first: '$isReturn' },
                    returnReason: { $first: '$returnReason' },
                    upiId: { $first: '$upiId' },
                    paymentStatus: { $first: '$paymentStatus' },
                    paymentType: { $first: '$paymentType' },
                    products: {
                        $push: {
                            productId: '$productId',
                            productName: '$productName',
                            description: '$description',
                            price: '$price',
                            productCategory: '$productCategory',
                            stock: '$stock',
                            quantity: '$quantity',
                            totalPrice: '$totalPrice',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    orderId: '$_id',
                    orderDate: 1,
                    deliveryAddress: 1,
                    status: 1,
                    total: 1,
                    isReturn: 1,
                    returnReason: 1,
                    upiId: 1,
                    paymentStatus: 1,
                    paymentType: 1,
                    products: 1,
                },
            },
        ])

        res.status(200).json({
            status: 200,
            data: {
                order: data
            },
            message: "Order details and associated ordered items retrieved successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            data: [],
            message: "Internal server error",
        });
    }
}

module.exports.getOrderDataById = async (req, res) => {
    const orderId = req.params.id
    try {
        const pipeline = [
            { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
            {
                $lookup: {
                    from: 'ordereditems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderedItems',
                },
            },
            {
                $unwind: '$orderedItems',
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderedItems.productId',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {
                $unwind: '$product',
            },
            {
                $project: {
                    orderId: '$_id',
                    orderDate: '$createdAt',
                    deliveryAddress: '$deliveryAddress',
                    status: '$status',
                    total: '$total',
                    isReturn: '$isReturn',
                    returnReason: '$returnReason',
                    upiId: '$upiId',
                    paymentStatus: '$paymentStatus',
                    paymentType: '$paymentType',
                    productId: '$product._id',
                    productName: '$product.productName',
                    description: '$product.description',
                    price: '$product.price',
                    productCategory: '$product.productCatagory',
                    stock: '$product.stock',
                    quantity: '$orderedItems.quantity',
                    totalPrice: '$orderedItems.price',
                },
            },
            {
                $group: {
                    _id: '$orderId',
                    orderDate: { $first: '$orderDate' },
                    deliveryAddress: { $first: '$deliveryAddress' },
                    status: { $first: '$status' },
                    total: { $first: '$total' },
                    isReturn: { $first: '$isReturn' },
                    returnReason: { $first: '$returnReason' },
                    upiId: { $first: '$upiId' },
                    paymentStatus: { $first: '$paymentStatus' },
                    paymentType: { $first: '$paymentType' },
                    products: {
                        $push: {
                            productId: '$productId',
                            productName: '$productName',
                            description: '$description',
                            price: '$price',
                            productCategory: '$productCategory',
                            stock: '$stock',
                            quantity: '$quantity',
                            totalPrice: '$totalPrice',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    orderId: '$_id',
                    orderDate: 1,
                    deliveryAddress: 1,
                    status: 1,
                    total: 1,
                    isReturn: 1,
                    returnReason: 1,
                    upiId: 1,
                    paymentStatus: 1,
                    paymentType: 1,
                    products: 1,
                },
            },
        ];

        const orderedItems = await dbOrder.aggregate(pipeline)
        // const orderItems = orderedItems || [];
        res.status(200).json({
            status: 200,
            data: orderedItems,
            message: "Order details and associated ordered items retrieved successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            data: [],
            message: "Internal server error",
        });
    }
}