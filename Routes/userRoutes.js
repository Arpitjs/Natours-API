let express = require('express')
let userRouter = express.Router()
let userController = require('../controllers/userController')

userRouter
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

userRouter.
    route('/:id')
    .get(userController.findUserByID)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = userRouter