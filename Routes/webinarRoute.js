const express = require('express');
const { createWebinar, getWebinar, getWebinarById } = require('../Controllers/webinarController');
const router = express.Router();


router.post('/createWebinar', createWebinar);
router.get('/getWebinar', getWebinar);
router.get('/getWebinarById/:id', getWebinarById);

module.exports = router;
