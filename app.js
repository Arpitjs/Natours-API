let express = require('express')
let morgan = require('morgan')
let app = express()
let rateLimit = require('express-rate-limit')
let helmet = require('helmet')
let mongoSanitize = require('express-mongo-sanitize')
let  xss = require('xss-clean')
let hpp = require('hpp')

let AppError = require('./utils/appError')
let globalErrorHandler = require('./controllers/errorController')
let tourRouter = require('./Routes/tourRoutes')
let userRouter = require('./Routes/userRoutes')

// set security http headers
app.use(helmet())

// for limit request from same IP
let limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 60 * 1000,
    message: 'too many requests from you, try again later.'
})

app.use('/api',limiter)

// logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// body parser
app.use(express.json({ limit: '10kb' } ))

// data sanitization against nosql query injection
app.use(mongoSanitize())
// data sanitization against XSS
app.use(xss())

// prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 
'difficulty', 'price', 'maxGroupSize']
}))

app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`cannot find ${req.originalUrl} on this server.`, 404))
})

app.use(globalErrorHandler)

module.exports = app