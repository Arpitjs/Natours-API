let catchAsync = require('../utils/catchAsync')
let AppError = require('../utils/AppError')
let APIFeatures = require('../utils/apiFeatures')

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) {
            return next(new AppError('No document found with that ID', 404))
        }
        res.status(204).json({
            status: 'success!',
            data: null
        })
    })

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        // NOTE: mongoose validators do not run again for findByIdAndUpdate
        // sab middleware pass garesi yaha samma auda req.body ma tyo imageCover ra images ko nam hunxa 
        // so aba yo tala ko query run vaera db ma save hunxa.
        let doc = await Model.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
        if (!doc) {
            return next(new AppError('No document found with that ID', 404))
        }
        res.status(200).json({
            status: 'success!',
            data: { doc }
        })
    })

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.create(req.body)
        if (!doc) {
            return next(new AppError('No document found with that ID', 404))
        }
        res.status(201).json({
            status: 'success!',
            data: { doc }
        })
    })

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        // previously let tour = await Tour.findById(req.params.id).populate('reviews')
        let query = Model.findById(req.params.id)
        if (popOptions) query = query.populate(popOptions)
        let doc = await query
        if (!doc) {
            return next(new AppError('No tour found with that ID', 404))
        }
        res.status(200).json({
            status: 'success!',
            data: { doc }
        })
    })

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        //  to allow nested GET reviews on tour
        let filter = {}
        if (req.params.tourId) filter = { tour: req.params.tourId }
        let features = new APIFeatures(Model.find(filter), req.query)
            .filter().sort().limit().pagination()
        // let doc = await features.query.explain()
        let doc = await features.query
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: doc
        })
    })



