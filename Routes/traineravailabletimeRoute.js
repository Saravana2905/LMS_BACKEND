const express = require('express');
const router = express.Router();
const { createTrainerAvailableTime, getTrainerAvailableTimes, updateTrainerAvailableTime, deleteTrainerAvailableTime, bookTrainerAvailableTime } = require('../Controllers/trainerAvailableTimeController');

router.post('/createTrainerAvailableTime', createTrainerAvailableTime);
router.get('/getTrainerAvailableTimes/:trainerId', getTrainerAvailableTimes);
router.put('/updateTrainerAvailableTime/:slotId', updateTrainerAvailableTime);
router.delete('/deleteTrainerAvailableTime/:slotId', deleteTrainerAvailableTime);   
router.put('/trainer-available-time/book/:slotId', bookTrainerAvailableTime);


module.exports = router;