// routes/mailRoutes.js
const express = require('express');
const router = express.Router();
const { sendEmails } = require('../Controllers/mailController');

router.post('/send-emails', sendEmails);

module.exports = router;
