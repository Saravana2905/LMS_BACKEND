const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, updateCourseById, deleteCourseById, deleteAllCourses, getCourseByStudentId, registerCourse, getCourseByCategory, getReadingMaterial } = require('../Controllers/courseController');
const upload = require('../Middleware/multer');

router.post('/createCourse', upload.fields([
    { name: 'courseVideo', maxCount: 1 },
    { name: 'courseThumbnail', maxCount: 1 },
    { name: 'courseAttachment', maxCount: 10 }
]), createCourse);

router.get('/getAllCourses', getAllCourses);

router.get('/getCourseById/:id', getCourseById);

router.put('/updateCourse/:id',upload.fields([
    { name: 'courseVideo', maxCount: 1 },
    { name: 'courseThumbnail', maxCount: 1 },
    { name: 'courseAttachment', maxCount: 10 }
]), updateCourseById);

router.delete('/deleteCourse/:id', deleteCourseById);

router.delete('/deleteAllCourses', deleteAllCourses);

router.post('/registerCourse/:id', registerCourse)

router.get('/getCourseByCategory/:category', getCourseByCategory);

router.get('/getCourseByStudentId/:id', getCourseByStudentId);

router.get('/getMaterialByStudentId/:id', getReadingMaterial);

module.exports = router;
