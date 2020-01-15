let express = require('express')
let router = express.Router()
let viewsController = require('../controllers/viewController')
let authController = require('../controllers/authController')

router.get('/', authController.isLoggedIn, viewsController.getOverview)
router.get('/tours/:slug', authController.isLoggedIn, viewsController.getTour)
router.get('/login',authController.isLoggedIn, viewsController.login)
router.get('/me', authController.protect, viewsController.getAccount)

module.exports = router