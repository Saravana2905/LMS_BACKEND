const express = require('express');
const router = express.Router();
const {createsubscription} = require('../Controllers/paypalController');

router.post('/createSubscription', createsubscription)

module.exports = router;