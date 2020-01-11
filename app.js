let express = require('express')
let morgan = require('morgan')
let path = require('path')
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
let reviewRouter = require('./Routes/reviewRoute')

// template engine
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// serving static files
app.use(express.static(path.join(__dirname, 'public')))

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

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

//Template routes
app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'arpit'
    })
})

app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    })
})

app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker'
    })
})

// API Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`cannot find ${req.originalUrl} on this server.`, 404))
})

app.use(globalErrorHandler)

module.exports = app