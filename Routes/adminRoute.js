const express = require('express');
const router = express.Router();
const { createAdmin, getAdmin } = require('../Controllers/adminController');

router.post('/createAdmin',createAdmin);
router.get('/getAdmin', getAdmin);

module.exports = router