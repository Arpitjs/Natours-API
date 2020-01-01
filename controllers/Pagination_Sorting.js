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

        // sorting
        if (req.query.sort) {
            // console.log(req.query.sort)
            // console.log('req.query', req.query)
            // console.log('splitted',req.query.sort.split(','))
            // console.log('joined',req.query.sort.split(',').join(' '))
            let sortBy = req.query.sort.split(',').join(' ')
            // console.log('sort by',sortBy)
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        //fields limiting
        if (req.query.fields) {
            let fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // pagination
        let page = req.query.page * 1 || 1
        let toLimit = req.query.limit * 1 || 100
        let toSkip = (page - 1) * toLimit
        query = query.skip(toSkip).limit(toLimit)
        if (req.query.page) {
            let numTours = await Tour.countDocuments()
            if (toSkip >= numTours) throw new Error('This page does not exist.')
        }
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



