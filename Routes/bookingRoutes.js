let express = require('express')
let Router = express.Router()
let bookingController = require('../controllers/bookingController')
let authController = require('../controllers/authController')

Router.use(authController.protect)

Router.get('/checkout-session/:tourId',
    bookingController.checkoutSession)

Router.use(authController.restrictTo('admin', 'lead-guide'))

Router.route('/')
    .get(bookingController.getAllBookings)
Router.route('/:id')
    .get(bookingController.getBooking)
    .delete(bookingController.deleteBooking)
module.exports = Router