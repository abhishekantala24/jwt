const { Router } = require("express")
const controller = require('../controllers/auth')

const router = Router()

router.get('/', controller.home)
router.post('/createuser', controller.createUser)
router.post('/login', controller.login_email)
router.post('/feedback', controller.feedback)
router.post('/inquiry', controller.inquiry)

module.exports = router