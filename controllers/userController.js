let User = require('../models/userModel')
let catchAsync = require('../utils/catchAsync')

exports.getAllUsers =  catchAsync(async (req, res, next) => {
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
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}