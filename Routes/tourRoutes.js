let fs = require('fs')
let express = require('express')
let app = express()
let tourRouter = express.Router()
let tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

let getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: { tours }
    })
}

let createTours = (req, res) => {
    let newID = tours[tours.length - 1].id + 1
    let newTour = Object.assign({ id: newID }, req.body)
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        })
    })
}

let findTourByID = (req, res) => {
    let id = req.params.id * 1
    if (id > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
    let tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: { tour }
    })
}

let updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
    res.status(200).json({
        status: 'success!',
        data: {
            tour: 'UPDATED TOUR'
        }
    })
}

let deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
    res.status(204).json({
        status: 'success!',
        data: null
    })
}

tourRouter
    .route('/')
    .get(getAllTours)
    .post(createTours)

tourRouter
    .route('/:id')
    .get(findTourByID)
    .patch(updateTour)
    .delete(deleteTour)

    module.exports = tourRouter