let express = require('express')
let Router = express.Router( { mergeParams: true } )
let reviewController = require('../controllers/reviewController')
let authController = require('../controllers/authController')

Router.use(authController.protect)

Router
.route('/')
.get(reviewController.getAllReviews)
.post( 
authController.restrictTo('user'),
reviewController.setTourUserIds,
reviewController.createReview)

Router
.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
.delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)

module.exports = Router