let mongoose = require('mongoose')

let bookingSchema = mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    })
    next()
})

let Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking