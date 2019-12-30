let express = require('express')
let app = express()
let userRouter = express.Router()

let getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}
let findUserByID = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}
let createUser = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}
let updateUser = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}
let deleteUser = (req, res) => {
    res.status(500).json({
        status: 'err',
        msg: 'test'
    })
}

userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser)

userRouter.
    route('/:id')
    .get(findUserByID)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = userRouter