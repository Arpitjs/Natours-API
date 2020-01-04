let express = require('express')
let Router = express.Router()

let userController = require('../controllers/userController')
let authController = require('../controllers/authController')

// doesnt fit rest arch. so separately.
Router.post('/signup',authController.signUp)
Router.post('/login',authController.login)

Router.post('/forgotPassword', authController.forgotPassword)
Router.patch('/resetPassword/:token', authController.resetPassword)
Router.patch('/updatePassword', authController.protect, authController.updatePassword)
Router.patch('/updateMe', authController.protect, userController.updateMe)
Router.delete('/deleteMe', authController.protect, userController.deleteMe)

Router
    .route('/')
    .get(userController.getAllUsers)

Router.
    route('/:id')
    .get(userController.findUserByID)

module.exports = Router