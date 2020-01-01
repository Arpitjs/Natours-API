let Tour = require('../models/tourModel')
let APIFeatures = require('../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = async (req, res) => {
    try {
        let features = new APIFeatures(Tour.find(), req.query)
            .filter().sort().limit().pagination()
        let allTours = await features.query
        res.status(200).json({
            status: 'success',
            results: allTours.length,
            data: allTours
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e
        })
    }
}

exports.createTours = async (req, res) => {
    try {
        // let newTour = new Tour({})
        // newTour.save()
        let newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        })
    }


}

exports.findTourByID = async (req, res) => {
    try {
        // Tour.findOne({_id: req.params.id})
        let tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success!',
            data: { tour }
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e
        })

    }
}

exports.updateTour = async (req, res) => {
    try {
        let updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200).json({
            status: 'success!',
            data: {
                tour: updated
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success!',
            data: null
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e
        })
    }
}

exports.getTourStats = async (req, res) => {
    try {
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
            //     {
            //         $match: {_id: { $ne: 'easy'} }
            //     }
        ])

        res.status(200).json({
            status: 'success!',
            data: { stats }
        })
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
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
                _id: { $month: '$startDates'},
                numTourStarts: { $sum: 1},
                tours: { $push: '$name' }
            }
        }, {
            $addFields: { month: '$_id' }
        }, {
            $project: {
                _id: 0
            }
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
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e
        })
    }
}