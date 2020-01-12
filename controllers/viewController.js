let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async(req, res, next) => {
    // 1 get all the tour data from BE
let tours = await Tour.find()
    // 2 build template
    // 3 render the template 
    res.status(200).render('overview', { 
        title: 'All Tours',
        tours
     })
})

exports.getTour =  (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker'
    })
}