const express = require('express');
const router = express.Router();
const { createStudent, getStudents, updateStudent, deleteStudent, loginStudent } = require('../Controllers/studentController');
const upload = require('../Middleware/multer');

router.post('/createStudent', upload.fields([
    { name: 'profileImage', maxCount: 1 }
]), createStudent);

router.get('/getStudents', getStudents);
router.put('/updateStudent/:id', upload.fields([
    { name: 'profileImage', maxCount: 1 }
]), updateStudent);
router.delete('/deleteStudent/:id', deleteStudent);
router.post("/login", loginStudent);

module.exports = router;