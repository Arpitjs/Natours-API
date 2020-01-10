let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let handlerFactory = require('./handlerFactory')

exports.getAllTours = handlerFactory.getAll(Tour)
exports.getTour = handlerFactory.getOne(Tour, { path: 'reviews' } )
exports.createTour = handlerFactory.createOne(Tour)
exports.updateTour = handlerFactory.updateOne(Tour)
exports.deleteTour = handlerFactory.deleteOne(Tour)

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getTourStats = catchAsync(async (req, res, next) => {
        let stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }, {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: {_id: { $ne: 'easy'} }
            // }
        ])

        res.status(200).json({
            status: 'success!',
            data: { stats }
        })
        })

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
        let year = req.params.year * 1
        let plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            }, {
                $addFields: { month: '$_id' }
            }, {
                $project: { _id: 0 }
            }, {
                $sort: { numTourStarts: -1 }
            }, {
                $limit: 12
            }
        ])
        res.status(200).json({
            status: 'success!',
            results: plan.length,
            data: { plan }
        })
})