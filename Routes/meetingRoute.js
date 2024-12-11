const express = require('express');
const { createMeeting, getMeeting, getMeetingById } = require('../Controllers/meetingController');
const router = express.Router();


router.post('/createMeeting', createMeeting);
router.get('/getMeeting', getMeeting);
router.get('/getMeetingById/:id', getMeetingById);

module.exports = router;
