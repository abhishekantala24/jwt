const { Router } = require("express")
const customer = require('../controllers/customer/feedback')
const cart = require('../controllers/customer/cart')
const auth = require('../controllers/customer/auth')
const admin = require('../controllers/admin/product')
const common = require('../controllers/common/index')

const router = Router()

// auth
router.post('/auth/createuser', auth.createUser)
router.post('/auth/login', auth.login_email)
router.post('/auth/sendotp', auth.send_otp)
router.post('/auth/verifyotp', auth.verify_otp)

// app
router.get('/product', common.getProduct)
router.get('/productcatagory', common.getProductCatagory)
router.post('/addtocart', cart.addToCart)

// feedback
router.post('/customer/feedback', customer.feedback)
router.post('/customer/inquiry', customer.inquiry)

// admin
router.post('/admin/productcatagory', admin.productCatagory)
router.post('/admin/productlist', admin.productList)

module.exports = router