let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let jwt = require('jsonwebtoken')
let AppError = require('../utils/appError')
let bcrypt = require('bcryptjs')

let signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRES_IN })

exports.signUp = catchAsync(async (req, res, next) => {
    let newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

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
        return next(new AppError('wrong email or password, try again', 400))
    }
    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return next(new AppError('invalid email or password', 400))

    let token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})