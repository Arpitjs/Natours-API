let mongoose = require('mongoose')
let Tour = require('./tourModel')

let reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review is needed.']
    },
    rating: {
        type: Number,
        validate: {
            validator: function (val) {
                return val <= 5
            },
            message: 'the rating cannot be more than 5.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
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
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })

reviewSchema.index( { tour: 1, user: 1 }, { unique: true } )

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})

reviewSchema.statics.calcAvgRatings = async function (tourID) {
    // this refers to the model
    // using static coz it is used when dealing with models
    let stats = await this.aggregate([
        {
            $match: { tour: tourID }
        },
        {
            $group: {
                _id: '$tour',
                numRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    console.log(stats)
    if(stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
        ratingsQuantity: stats[0].numRating,
        ratingsAverage: stats[0].avgRating
    })
} else {
    await Tour.findByIdAndUpdate(tourID, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5
})
}
}
reviewSchema.post('save', function () {
    // this referes to the current document (review)
    this.constructor.calcAvgRatings(this.tour)
})

// findByIdAndUpdate/Delete only works for query middleware, not document mw.
// in query we dont have direct access to the document.
// after executing the query we can access the current document
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.rev = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne() does NOT work here, query has already executed.
    await this.rev.constructor.calcAvgRatings(this.rev.tour)
})

let Review = mongoose.model('Review', reviewSchema)

module.exports = Review