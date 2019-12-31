let express = require('express')
let morgan = require('morgan')
let app = express()

let tourRouter = require('./Routes/tourRoutes')
let userRouter = require('./Routes/userRoutes')

if(process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app