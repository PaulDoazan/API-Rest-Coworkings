const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

router
    .route('/')
    .get(userController.findAllUsers)

router
    .route('/:id')
    .get(userController.findUserByPk)

module.exports = router;