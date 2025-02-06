const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, updateCourseById, deleteCourseById, deleteAllCourses, getCourseByStudentId, registerCourse, getCourseByCategory, getReadingMaterial, updateCourseAttachmentById } = require('../Controllers/courseController');
const upload = require('../Middleware/multer');

router.post('/createCourse', upload.fields([
    { name: 'courseVideo', maxCount: 1 },
    { name: 'courseThumbnail', maxCount: 1 },
    { name: 'courseAttachment', maxCount: 36 },
    {name: 'courseCurriculumAttachment', maxCount: 1 }
]), createCourse);

router.get('/getAllCourses', getAllCourses);

router.get('/getCourseById/:id', getCourseById);

router.put('/updateCourse/:id',upload.fields([
    { name: 'courseVideo', maxCount: 1 },
    { name: 'courseThumbnail', maxCount: 1 },
    { name: 'courseAttachment', maxCount: 36 },
    {name: 'courseCurriculumAttachment', maxCount: 1 }
]), updateCourseById);

router.delete('/deleteCourse/:id', deleteCourseById);

router.delete('/deleteAllCourses', deleteAllCourses);

router.post('/registerCourse/:id', registerCourse)

router.get('/getCourseByCategory/:category', getCourseByCategory);

router.get('/getCourseByStudentId/:id', getCourseByStudentId);

router.get('/getMaterialByStudentId/:id', getReadingMaterial);

router.put('/updateCourseAttachment/:id', upload.fields([  
    { name: 'courseAttachment', maxCount: 36 }
]), updateCourseAttachmentById
)

module.exports = router;
