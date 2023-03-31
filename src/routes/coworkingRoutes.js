const express = require('express')
const router = express.Router();
const coworkingController = require('../controllers/coworkingController')
const authController = require('../controllers/authController')

router
    .route('/')
    .get(authController.protect, coworkingController.findAllCoworkings)
    .post(authController.protect, authController.restrictTo('admin'), coworkingController.createCoworking)

router
    .route('/:id')
    .get(coworkingController.findCoworkingByPk)
    .put(authController.protect, authController.restrictTo('admin'), coworkingController.updateCoworking)
    .delete(authController.protect, authController.restrictTo('admin'), coworkingController.deleteCoworking)

module.exports = router;