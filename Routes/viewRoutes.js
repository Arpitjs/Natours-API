let express = require('express')
let router = express.Router()
let viewsController = require('../controllers/viewController')
let authController = require('../controllers/authController')

router.use(authController.isLoggedIn)

router.get('/', viewsController.getOverview)
router.get('/tours/:slug', authController.protect, viewsController.getTour)
router.get('/login', viewsController.login)

module.exports = router