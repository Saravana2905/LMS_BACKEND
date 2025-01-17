const express = require('express');
const router = express.Router();
const { CreatePlans, createSubscription, getSubscription } = require('../Controllers/cashfreeController');

router.post('/createPlan', CreatePlans);
router.post('/createSubscription', createSubscription)
router.get('/getSubscription/:id', getSubscription)

module.exports = router