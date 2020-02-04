let express = require('express')
let Router = express.Router()
let bookingController = require('../controllers/bookingController')
let authController = require('../controllers/authController')

Router.get('/checkout-session/:tourId',
authController.protect, bookingController.checkoutSession )

module.exports = Router