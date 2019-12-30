let fs = require('fs')
let express = require('express')
let app = express()
let port = 4200
app.use(express.json())

let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours }
})
})

app.post('/api/v1/tours', (req, res) => {
let newID = tours[tours.length - 1].id + 1
let newTour = Object.assign({id: newID}, req.body)
tours.push(newTour)
fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
        status: 'success',
        data: { tour: newTour }
    })
})
})

app.listen(port, () => console.log('app running @' + port))