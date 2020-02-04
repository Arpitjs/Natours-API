let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let handlerFactory = require('./handlerFactory')
let AppError = require('../utils/appError')
let stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.checkoutSession = catchAsync(async(req, res, next) => {

    // 1 get currently booked tour
    let tour = await Tour.findById(req.params.tourId)
    // 2 create checkout session
    let session = await stripe.checkout.sessions.create({
        // session info
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}`,
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