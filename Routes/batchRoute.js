const express = require('express');
const router = express.Router();
const { getBatchesByCourseId, getBatchByStudentId } = require('../Controllers/batchController');

router.get('/getbacthesByCourseId/:id', getBatchesByCourseId);
router.get('/getbacthesByStudentId/:id', getBatchByStudentId);

module.exports = router;