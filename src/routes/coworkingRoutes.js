const express = require('express')
const router = express.Router();
const coworkingController = require('../controllers/coworkingController')
const auth = require('../auth/auth')

router
    .route('/')
    .get(auth.protect, coworkingController.findAllCoworkings)
    .post(auth.protect, auth.restrictTo('admin'), coworkingController.createCoworking)

router
    .route('/:id')
    .get(coworkingController.findCoworkingByPk)
    .put(auth.protect, auth.restrictTo('admin'), coworkingController.updateCoworking)
    .delete(auth.protect, auth.restrictTo('admin'), coworkingController.deleteCoworking)

module.exports = router;