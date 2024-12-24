const express = require('express');
const router = express.Router();
const { createDoubtSession, getDoubtSessions, getDoubtSessionById, updateDoubtSession, deleteDoubtSession } = require('../Controllers/doubtSessionController');

router.post('/createDoubtSession', createDoubtSession);
router.get('/getDoubtSessions', getDoubtSessions);
router.get('/getDoubtSessionById/:id', getDoubtSessionById);
router.put('/updateDoubtSession/:id', updateDoubtSession);
router.delete('/deleteDoubtSession/:id', deleteDoubtSession);

module.exports = router;