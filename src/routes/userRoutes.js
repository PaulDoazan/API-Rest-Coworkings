const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')

router
    .route('/api/users')
    .get(userController.findAllUsers)

router
    .route('/api/users/:id')
    .get(userController.findUserByPk)

module.exports = router;