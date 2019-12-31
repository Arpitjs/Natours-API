// controller file is used for quering with database and doing crud stuff.
let fs = require('fs')
let tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkID = (req, res, next, val) => {
    console.log(`tour id is ${req.params.id}`)
    let id = req.params.id * 1
    if (id > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
    next()
}

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
    return res.status(400).json({ msg : 'invalid thing to do '})
}
next()
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: { tours }
    })
}

exports.createTours = (req, res) => {
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

exports.findTourByID = (req, res) => {
    let id = req.params.id * 1
    let tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: 'success',
        data: { tour }
    })
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success!',
        data: {
            tour: 'UPDATED TOUR'
        }
    })
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success!',
        data: null
    })
}

