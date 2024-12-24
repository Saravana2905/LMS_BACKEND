const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject } = require('../Controllers/projectController');

router.post('/createProject', createProject);
router.get('/getAllProjects', getAllProjects);
router.get('/getProjectById/:id', getProjectById);
router.put('/updateProject/:id', updateProject);
router.delete('/deleteProject/:id', deleteProject);

module.exports = router;