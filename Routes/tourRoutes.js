let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')

// Router.param('id', tourController.checkID)

Router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)

Router.route('/tour-stats')
.get(tourController.getTourStats)

Router.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan)

Router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTours)

Router
    .route('/:id')
    .get(tourController.findTourByID)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

    module.exports = Router