const { Router } = require("express")
const customer = require('../controllers/customer/feedback')
const cart = require('../controllers/customer/cart')
const auth = require('../controllers/customer/auth')
const admin = require('../controllers/admin/product')
const users = require('../controllers/admin/customer')
const common = require('../controllers/common/index')
const authMiddleware = require('../authMiddleware')

const router = Router()

// auth
router.post('/auth/createuser', auth.createUser)
router.post('/auth/login', auth.login_email)
router.post('/auth/sendotp', auth.send_otp)
router.post('/auth/verifyotp', auth.verify_otp)

// product
router.get('/product', common.getProduct)
router.get('/productcatagory', common.getProductCatagory)

// cart
router.post('/addtocart', cart.addToCart)
router.post('/getCartData', cart.getCartData)
router.delete('/removeCartProduct/:id', cart.removeCartProduct)

// feedback
router.post('/customer/feedback', customer.feedback)
router.post('/customer/inquiry', customer.inquiry)

// admin
router.post('/admin/addProductcatagory', admin.addProductCatagory)
router.post('/admin/addProduct', admin.addProduct)
router.get('/admin/GetProduct/:id', admin.GetProduct)
router.post('/admin/UpdateProduct', admin.UpdateProduct)
router.delete('/admin/DeleteProduct/:id', admin.DeleteProduct)
router.get('/admin/getAllUser', users.getAllUser)

module.exports = router