let mongoose = require('mongoose')

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

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()
})

let Review = mongoose.model('Review', reviewSchema)
module.exports = Review