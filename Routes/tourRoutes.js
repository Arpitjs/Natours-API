let express = require('express')
let Router = express.Router()
let tourController = require('../controllers/tourController')

// Router.param('id', tourController.checkID)

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