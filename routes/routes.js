const { Router } = require("express")
const controller = require('../controllers/auth')

const router = Router()

router.get('/', controller.home)
router.post('/createuser', controller.createUser)
router.post('/login', controller.login_email)

module.exports = router