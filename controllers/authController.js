let crypto = require('crypto')
let { promisify } = require('util')
let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let jwt = require('jsonwebtoken')
let AppError = require('../utils/appError')
let sendMail = require('../utils/email')

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) return next(new AppError('there is no user with that email', 404))
    let resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })
    // providing entire url here. req.protocol is http or https.
    let resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    let message = `forgot your password? submit a patch request with your
    new password to: ${resetURL}. if you did not forget yer password, ignore this.`
    try {
        await sendMail({
            email: user.email,
            subject: 'your password reset token. valid for 10 mins',
            message
        })
        res.status(200).json({
            status: 'success',
            message: 'token sent to the email!'
        })
    } catch (e) {
        user.passwordResetToken = undefined,
            user.passwordResetExpires = undefined,
            await user.save({ validateBeforeSave: false })
        return next(new AppError('error sending the email', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1 get user based on the token

    let hashedToken = crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    let user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    // 2 if token aint expires and theres user, set the password

    if (!user) return next(new AppError('token is invalid or has expired', 400))
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    // 3 update changedPasswordAt

    // 4 log the user in, send jwt to client
    let token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})