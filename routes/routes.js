const { Router } = require("express")
const customer = require('../controllers/customer/feedback')
const cart = require('../controllers/customer/cart')
const auth = require('../controllers/customer/auth')
const product = require('../controllers/admin/product')
const adminAuth = require('../controllers/admin/admin')
const address = require('../controllers/customer/address')
const users = require('../controllers/admin/customer')
const common = require('../controllers/common/index')
const order = require('../controllers/customer/order')
const authMiddleware = require('../authMiddleware')

const router = Router()

// customer authentication apis
router.post('/auth/createuser', auth.createUser)
router.post('/auth/login', auth.login_email)
router.post('/auth/updateUserDetails', authMiddleware.verifyToken, auth.updateUserDetails)
router.post('/auth/sendotp', auth.send_otp)
router.post('/auth/verifyotp', auth.verify_otp)

// Admin authentication apis
router.post('/admin/createadmin', adminAuth.createAdmin)
router.post('/admin/updateadmin', authMiddleware.verifyToken, adminAuth.updateAdmin)
router.get('/admin/getadmindetails', authMiddleware.verifyToken, adminAuth.getAdminDetails)
router.post('/admin/login', adminAuth.Admin_login_email)
router.post('/admin/sendotp', adminAuth.send_otp)
router.post('/admin/verifyotp', adminAuth.verify_otp)
//------------------------------------------------------------------------------------------------------------

// Commen Apis
router.get('/product', authMiddleware.verifyToken, common.getProduct)
router.get('/productcatagory', authMiddleware.verifyToken, common.getProductCatagory)
router.get('/getproduct/:id', authMiddleware.verifyToken, common.getProductById)
router.get('/getProductByProductCatagory/:id', authMiddleware.verifyToken, common.getProductByProductCatagory)

// Customer apis
router.post('/customer/addtocart', authMiddleware.verifyToken, cart.addToCart)
router.get('/customer/getCartData', authMiddleware.verifyToken, cart.getCartData)
router.delete('/customer/removeCartProduct/:id', authMiddleware.verifyToken, cart.removeCartProduct)
router.delete('/customer/removeAllCartProduct', authMiddleware.verifyToken, cart.removeAllCartProduct)

router.post('/customer/addaddress', authMiddleware.verifyToken, address.addAddress)
router.get('/customer/getaddress', authMiddleware.verifyToken, address.getAddress)
router.put('/customer/defaultaddress/:id', authMiddleware.verifyToken, address.setDefaultAddress)
router.delete('/customer/removeaddress/:id', authMiddleware.verifyToken, address.removeAddress)

router.post('/customer/createOrder', authMiddleware.verifyToken, order.createOrder)
router.get('/customer/getOrder', authMiddleware.verifyToken, order.getOrderData)
router.get('/customer/getOrderById/:id', authMiddleware.verifyToken, order.getOrderDataById)

router.post('/customer/feedback', authMiddleware.verifyToken, customer.feedback)
router.post('/customer/inquiry', authMiddleware.verifyToken, customer.inquiry)

// admin apis
router.post('/admin/addProductcatagory', authMiddleware.verifyToken, product.addProductCatagory)
router.post('/admin/addProduct', authMiddleware.verifyToken, product.addProduct)
router.post('/admin/UpdateProduct', authMiddleware.verifyToken, product.UpdateProduct)
router.delete('/admin/DeleteProduct/:id', authMiddleware.verifyToken, product.DeleteProduct)
router.get('/admin/getAllUser', authMiddleware.verifyToken, users.getAllUser)

module.exports = router