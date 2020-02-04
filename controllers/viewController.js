let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let AppError = require('../utils/appError')
let Booking = require('../models/bookingModel')

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1 get all the tour data from BE
    let tours = await Tour.find()
    // 2 build template
    // 3 render the template 
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    let tour = await Tour.findOne({ slug: req.params.slug })
        .populate({
            path: 'reviews',
            fields: 'review rating user'
        })
    if (!tour) {
        return next(new AppError('there is no tour of that name!', 404))
    }
    res.status(200).render('tour', {
        title: tour.name,
        tour
    })
})

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'yer account'
    })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1 find bookings made by that user
    let bookings = await Booking.find({user: req.user.id})
    console.log(bookings)
    // 2 get the tour ids using the bookings array where we populated tours
    let tourIDs = bookings.map(booking => booking.tour)
    let tours = await Tour.find({_id: {$in: tourIDs }})

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    })
})

exports.login = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into yer account.'
    })
}

