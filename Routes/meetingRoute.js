const express = require('express');
const { createMeeting, getMeeting } = require('../Controllers/meetingController');
const router = express.Router();


router.post('/createMeeting', createMeeting);
router.get('/getMeeting', getMeeting);

module.exports = router;
