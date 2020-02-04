let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let stripe = require('stripe')(process.env.STRIPE_SECRET)
let Booking = require('../models/bookingModel')
let handlerFactory = require('../controllers/handlerFactory')

exports.checkoutSession = catchAsync(async(req, res, next) => {

    // 1 get currently booked tour
    let tour = await Tour.findById(req.params.tourId)
    // 2 create checkout session
    let session = await stripe.checkout.sessions.create({
        // session info 
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        // product info
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://wwww.natours.dev/img/tours/${tour.imageCover}`],
            amount: tour.price * 100,
            currency: 'usd',
            quantity: 1
        }
        ]
    })
    // 3 create a session as response
    res.status(200).json({
        status: 'success',
        session
    })
})

exports.createBookingCheckout = catchAsync(async(req, res, next) => {
    let { tour, user, price } = req.query
    if(!tour && !user && !price) return next()
    await Booking.create({tour, user, price })
    res.redirect(req.originalUrl.split('?')[0])
})


exports.getAllBookings = handlerFactory.getAll(Booking)
exports.createBooking = handlerFactory.createOne(Booking)
exports.deleteBooking = handlerFactory.deleteOne(Booking)
exports.getBooking = handlerFactory.getOne(Booking)