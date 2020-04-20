const express = require('express');
const recognitionController = require('../src/controllers/recognition');
let router = express.Router();

router.get('/training', (req, res, next)=> {
    recognitionController.training({req, res, next});
})

router.post('/recognizing', (req, res, next)=> {
    recognitionController.recognizing({req, res, next});
})

module.exports = router;
