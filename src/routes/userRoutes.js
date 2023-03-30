const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

router
    .route('/signup')
    .post(authController.signup)

router
    .route('/login')
    .post(authController.login)

router
    .route('/')
    .get(userController.findAllUsers)

router
    .route('/:id')
    .get(userController.findUserByPk)

module.exports = router;