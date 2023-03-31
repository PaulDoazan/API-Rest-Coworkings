const express = require('express')
const router = express.Router();
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')

router
    .route('/')
    .get(reviewController.findAllReviews)
    .post(authController.protect, authController.restrictTo('admin'), reviewController.createReview)

router
    .route('/:id')
    .get(reviewController.findReviewByPk)


module.exports = router;