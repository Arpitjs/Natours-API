let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let AppError = require('../utils/appError')

let filterObj = (obj, ...allowedFields) => {
    let newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    let users = await User.find()
    res.status(200).json({
        status: 'success',
        data: { users }
    })
})

exports.findUserByID = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('this route is not for password updates', 400))
    }
    let filteredBody = filterObj(req.body, 'name', 'email')
    let updatedUser = await User.findByIdAndUpdate(req.user, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: updatedUser

    })
})

exports.deleteMe = catchAsync(async(req, res, next) => {
    // tried using findByIdAndUpdate and only setting the active property to false, but it didnt work for some reason.
    await User.findByIdAndDelete(req.user.id, { active: false })
    res.status(204).json({
        status: 'success',
        data: null
    })
})