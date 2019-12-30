let express = require('express')
let morgan = require('morgan')
let app = express()
let port = 4200
let tourRouter = require('./Routes/tourRoutes')
let userRouter = require('./Routes/userRoutes')

app.use(morgan('dev'))
app.use(express.json())
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// app.get('/api/v1/tours', getAllTours)
// app.post('/api/v1/tours', createTours)
// app.get('/api/v1/tours/:id', findTourByID)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.listen(port, () => console.log('app running @' + port))