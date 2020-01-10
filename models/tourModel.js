let mongoose = require('mongoose')
let slugify = require('slugify')
// let User = require('./userModel')

let tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name, man.'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters.'],
        minlength: [10, 'A tour name must have more than 10 characters.'],
    },
    slug: String,
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
        required: [true, 'A tour must have difficulty, man.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'only pick those mentioned.'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 3,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Discount price ({VALUE}) should be below actual price.']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // here this only points to current doc on new creation.
                return val < this.price
            },
            message: 'Discount price is unacceptable.'
        }
    },
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        //embedded documents
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

// virtual popluate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// document middlewares
//runs before save() and create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// connecting users and tours using embedding method
// tourSchema.pre('save', async function(next) {
//     let guidePromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidePromises)
//     next()
// })

// query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    next()
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`query took ${Date.now() - this.start} ms.`)
    next()
})

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    // console.log(this.pipeline())
    next()
})

let Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour 