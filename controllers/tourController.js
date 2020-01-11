let Tour = require('../models/tourModel')
let catchAsync = require('../utils/catchAsync')
let handlerFactory = require('./handlerFactory')
let AppError = require('../utils/appError')

exports.getAllTours = handlerFactory.getAll(Tour)
exports.getTour = handlerFactory.getOne(Tour, { path: 'reviews' })
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

exports.getToursWithin = catchAsync(async (req, res, next) => {
    let { distance, latlng, unit } = req.params
    let [lat, lng] = latlng.split(',')
    let radius = unit === 'miles' ? distance / 3963.2 :
        distance = distance / 6378.1
    if (!lat || !lng) next(new AppError('Please provide lat and long!', 400))
    console.log(distance, latlng, unit)
    let tours = await Tour.find({
        startLocation: {
            $geoWithin:
                { $centerSphere: [[lng, lat], radius] }
        }
    })
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    })

})

exports.getDistances = catchAsync(async (req, res, next) => {
    let { latlng, unit } = req.params
    let [lat, lng] = latlng.split(',')
    let multiplier = unit === 'mi' ? 0.000621371 : 0.001
    if (!lat || !lng) next(new AppError('Please provide lat and long!', 400))
    console.log(latlng, unit)

    let distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance', 
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])
    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: { distances }
    })
})