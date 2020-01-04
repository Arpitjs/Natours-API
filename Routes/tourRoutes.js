let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')
let authController = require('../controllers/authController')

// Router.param('id', tourController.checkID)

Router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)

Router.route('/tour-stats')
.get(tourController.getTourStats)

Router.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan)

Router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTours)

Router
    .route('/:id')
    .get(tourController.findTourByID)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour)

    module.exports = Router