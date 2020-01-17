let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')
let authController = require('../controllers/authController')
let reviewRouter = require('../Routes/reviewRoute')
// Router.param('id', tourController.checkID)

Router.use('/:tourId/review', reviewRouter)

Router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours)

Router.route('/tour-stats')
    .get(tourController.getTourStats)

Router.route('/monthly-plan/:year')
    .get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan)

Router.route('/tour-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin)

Router.route('/distances/:latlng/unit/:unit')
.get(tourController.getDistances)

Router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, tourController.createTour)

Router
    .route('/:id')
    .get(tourController.getTour)
    
    .patch(authController.protect, 
        authController.restrictTo('admin', 'lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
         tourController.updateTour)

    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour)

module.exports = Router