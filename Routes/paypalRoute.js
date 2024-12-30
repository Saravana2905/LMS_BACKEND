const express = require('express');
const { createOrder, createSubscription, savePayment } = require('../Controllers/paypalController');
const router = express.Router();

// router.post('/createOrder', createOrder)
router.post('/createSubscription', createSubscription)
router.post('/savePayment', savePayment)

module.exports = router