const express = require('express');
const router = express.Router();
const { registerWebinar, getWebinarRegistrations, getWebinarRegistrationById } = require('../Controllers/webinarRegisterController');

router.post('/createWebinarRegister', registerWebinar);
router.get('/getWebinarRegister', getWebinarRegistrations);
router.get('/getWebinarRegisterById/:id', getWebinarRegistrationById);

module.exports = router;