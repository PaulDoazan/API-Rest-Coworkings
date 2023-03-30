const express = require('express')
const router = express.Router();
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')

router
    .route('/')
    .get(reviewController.findAllReviews)

router
    .route('/:id')
    .get(reviewController.findReviewByPk)

router
    .route('/')
    .post(reviewController.createReview)

module.exports = router;