const { Router } = require("express")
const customer = require('../controllers/customer/feedback')
const cart = require('../controllers/customer/cart')
const auth = require('../controllers/customer/auth')
const product = require('../controllers/admin/product')
const adminAuth = require('../controllers/admin/admin')
const users = require('../controllers/admin/customer')
const common = require('../controllers/common/index')
const authMiddleware = require('../authMiddleware')

const router = Router()

// customer authentication apis
router.post('/auth/createuser', auth.createUser)
router.post('/auth/login', auth.login_email)
router.post('/auth/sendotp', auth.send_otp)
router.post('/auth/verifyotp', auth.verify_otp)

// Admin authentication apis
router.post('/admin/createadmin', adminAuth.createAdmin)
router.post('/admin/login', adminAuth.Admin_login_email)
router.post('/admin/sendotp', adminAuth.send_otp)
router.post('/admin/verifyotp', adminAuth.verify_otp)

// Commen Apis
router.get('/product', authMiddleware.verifyToken, common.getProduct)
router.get('/productcatagory', authMiddleware.verifyToken, common.getProductCatagory)
router.get('/getproduct/:id', authMiddleware.verifyToken, common.getProductById)
router.get('/getProductByProductCatagory/:id', authMiddleware.verifyToken, common.getProductByProductCatagory)

// Customer apis
router.post('/customer/addtocart', authMiddleware.verifyToken, cart.addToCart)
router.post('/customer/getCartData', authMiddleware.verifyToken, cart.getCartData)
router.post('/customer/removeCartProduct', authMiddleware.verifyToken, cart.removeCartProduct)

router.post('/customer/feedback', authMiddleware.verifyToken, customer.feedback)
router.post('/customer/inquiry', authMiddleware.verifyToken, customer.inquiry)

// admin apis

router.post('/admin/addProductcatagory', authMiddleware.verifyToken, product.addProductCatagory)
router.post('/admin/addProduct', authMiddleware.verifyToken, product.addProduct)
router.post('/admin/UpdateProduct', authMiddleware.verifyToken, product.UpdateProduct)
router.delete('/admin/DeleteProduct/:id', authMiddleware.verifyToken, product.DeleteProduct)

router.get('/admin/getAllUser', authMiddleware.verifyToken, users.getAllUser)

module.exports = router