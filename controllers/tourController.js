let Tour = require('../models/tourModel')

exports.getAllTours = async (req, res) => {
    try {
        // build the query
        // filtering
        let queryObj = { ...req.query }
        let exlcude = ['page', 'sort', 'limit', 'fields']
        exlcude.forEach(field => delete queryObj[field])
        // console.log(req.query, queryObj)
        // advanced filtering
        // console.log(queryObj)
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // console.log(JSON.parse(queryStr))
        let query = Tour.find(JSON.parse(queryStr)) 
        // execute the query
        let allTours = await query
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
        let updated = await Tour.findByIdAndUpdate(req.params.id, req.body,
            { new: true }, { runValidators: true })
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

