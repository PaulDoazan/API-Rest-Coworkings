const express = require('express')
const router = express.Router();
const coworkingController = require('../controllers/coworkingController')
const authController = require('../controllers/authController')

router
    .route('/')
    .get(coworkingController.findAllCoworkings)

router
    .route('/withReview')
    .get(coworkingController.findAllCoworkingsByReview)
    .post(authController.protect, authController.restrictTo('admin'), coworkingController.createCoworking)

// router
//     .route(['/withReview', '/withReview/:minRate'])
//     .get(coworkingController.findAllCoworkingsByReviewSQL)

router
    .route('/:id')
    .get(coworkingController.findCoworkingByPk)
    .put(authController.protect, authController.restrictTo('admin'), coworkingController.updateCoworking)
    .delete(authController.protect, authController.restrictTo('admin'), coworkingController.deleteCoworking)

module.exports = router;