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

exports.getTour =  catchAsync(async(req, res, next) => {
    let tour = await Tour.findOne( { slug: req.params.slug } )
    .populate({ 
        path: 'reviews', 
        fields: 'review rating user'
    })
    res.status(200).render('tour', {
        title: tour.name,
       tour
})
})

exports.login =(req, res) => {
    res.status(200).render('login', {
       title: 'Log into yer account.'
    })
}