const express = require('express');
const router = express.Router();
const{ createTest, getTests, getTestById, deleteTest, updateTest, getTestbyCourseId } = require('../Controllers/testController');

router.post('/createTest', createTest);
router.get('/getTests', getTests);
router.get('/getTestById/:id', getTestById);
router.put('/updateTest/:id', updateTest);
router.delete('/deleteTest/:id', deleteTest);
router.get('/getTestByCourseId/:id', getTestbyCourseId);

module.exports = router;