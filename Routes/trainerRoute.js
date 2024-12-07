const express = require('express');
const router = express.Router();
const { createTrainer, getTrainers , updateTrainer, deleteTrainer} = require('../Controllers/trainercontroller');
const upload = require('../Middleware/multer');

router.post('/createTrainer', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), createTrainer);

router.get('/getTrainers', getTrainers);
router.put('/updateTrainer/:id', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), updateTrainer);
router.delete('/deleteTrainer/:id', deleteTrainer);

module.exports = router;