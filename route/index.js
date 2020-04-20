const express = require('express');
const recognition = require('./recognition');
const seeds = require('../database/seeds');
let router = express.Router();


let prefix = '/api/v1';

router.use( prefix + '/ai', recognition);

router.use( prefix + '/seeds', seeds);

module.exports = router;
