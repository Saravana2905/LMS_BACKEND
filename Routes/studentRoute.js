const express = require('express');
const router = express.Router();
const { createStudent, getStudents, updateStudent, deleteStudent, loginStudent, getStudentById } = require('../Controllers/studentController');
const upload = require('../Middleware/multer');
const Auth = require('../Middleware/Authenticate')

router.post('/createStudent', upload.fields([
    { name: 'profileImage', maxCount: 1 }
]), createStudent);//student

router.get('/getStudents', getStudents);//admin & trainer
router.get('/getStudentById/:id', getStudentById); //admin & trainer
router.put('/updateStudent/:id', upload.fields([
    { name: 'profileImage', maxCount: 1 }
]), updateStudent); //student
router.delete('/deleteStudent/:id', deleteStudent); //admin
router.post("/login", loginStudent); //student

module.exports = router;

// Auth.authenticateJWT, Auth.verifyRole(['Student']) ,