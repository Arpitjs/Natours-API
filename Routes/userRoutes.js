let express = require('express')
let Router = express.Router()

let userController = require('../controllers/userController')
let authController = require('../controllers/authController')

// doesnt fit rest arch. so separately.
Router.post('/signup',authController.signUp)
Router.post('/login',authController.login)

// password routes
Router.post('/forgotPassword', authController.forgotPassword)
Router.patch('/resetPassword/:token', authController.resetPassword)

// works for all the routes below it
Router.use(authController.protect)
Router.patch('/updatePassword', authController.updatePassword)
// me routes
Router.patch('/updateMe', userController.updateMe)
Router.delete('/deleteMe', userController.deleteMe)
Router.get('/me', userController.getMe,
userController.findUserByID)

Router.use(authController.restrictTo('admin'))
Router
    .route('/')
    .get(userController.getAllUsers)

Router.
    route('/:id')
    .get(userController.findUserByID)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = Router