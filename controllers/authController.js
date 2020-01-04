let { promisify } = require('util')
let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let jwt = require('jsonwebtoken')
let AppError = require('../utils/appError')

let signToken = id => jwt.sign({ id }, process.env.JWT_SECRET)

exports.signUp = catchAsync(async (req, res, next) => {
    let newUser = await User.create(req.body)

    let token = signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        data: { newUser }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    let { email, password } = req.body
    if (!email || !password) {
        return next(new AppError('Please provide email and password both', 400))
    }
    let user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new AppError('wrong email or password, try again', 401))
    }
    let isMatch = await user.correctPassword(password, user.password)
    if (!isMatch) return next(new AppError('invalid email or password', 401))

    let token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new AppError('you are not logged in, token not provided.', 401))
    }
    let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    console.log(decoded)
    let user = await User.findById(decoded.id)
    if (!user) return next(new AppError('the user no longer exist', 401))
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('password was recently changed.', 401))
    }
    req.user = user
    next()
})

// roles ['admin', 'lead-guide'] but now role=user
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('you do not have permission to do so', 403))
        }
        next()
    }
}