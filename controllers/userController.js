let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')
let AppError = require('../utils/appError')
let handlerFactory = require('./handlerFactory')
let multer = require('multer')
let sharp = require('sharp')

let multerStorage = multer.memoryStorage()

let multerFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] == 'image') {
        cb(null, true)
    } else {
        cb(new AppError('Not an image!', 400), false)
    }
}

let upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

// multer middlewares
exports.uploadUserPhoto = upload.single('photo')

exports.resizePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`)
    next()
})
// for only allowing particular fields to be updated by the user
let filterObj = (obj, ...allowedFields) => {
    let newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
    console.log(req.file)
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('this route is not for password updates', 400))
    }
    let filteredBody = filterObj(req.body, 'name', 'email')
    if (req.file) filteredBody.photo = req.file.filename
    let updatedUser = await User.findByIdAndUpdate(req.user, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: updatedUser

    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    // tried using findByIdAndUpdate and only setting the active property to false, but it didnt work for some reason.
    await User.findByIdAndDelete(req.user.id, { active: false })
    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getAllUsers = handlerFactory.getAll(User)
exports.findUserByID = handlerFactory.getOne(User)
// only done by admin
exports.updateUser = handlerFactory.updateOne(User)
exports.deleteUser = handlerFactory.deleteOne(User)