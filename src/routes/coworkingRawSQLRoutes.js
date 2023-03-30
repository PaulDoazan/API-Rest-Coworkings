const express = require('express')
const router = express.Router();
const coworkingRawSQLController = require('../controllers/coworkingRawSQLController')

router
    .route('/')
    .get(coworkingRawSQLController.findAllCoworkings)

module.exports = router;