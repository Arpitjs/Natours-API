let express = require('express')
let Router = express.Router()

let userController = require('../controllers/userController')
let authController = require('../controllers/authController')

// doesnt fit rest arch. so separately.
Router.post('/signup',authController.signUp)
Router.post('/login',authController.login)

Router.post('/forgotPassword', authController.forgotPassword)
Router.patch('/resetPassword/:token', authController.resetPassword)

Router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

Router.
    route('/:id')
    .get(userController.findUserByID)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = Router