let mongoose = require('mongoose')
let tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name, man.'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have duration, man.']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a size, man.']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty, man.']
    },
    ratingsAverage: {
        type: Number,
        default: 3
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price, man.']
    }, priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary, man.']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a image, man.']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
})

let Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour