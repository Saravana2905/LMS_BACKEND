const express = require('express');
const { createOrder } = require('../Controllers/paypalController');
const router = express.Router();

router.post('/createOrder', createOrder)

module.exports = router