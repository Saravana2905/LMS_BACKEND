const express = require('express');
const router = express.Router();

const { createTechnicalSupport, getTechnicalSupports, getTechnicalSupportById, updateTechnicalSupport, deleteTechnicalSupport } = require('../Controllers/technicalSupportController');

router.post('/createTechnicalSupport', createTechnicalSupport);
router.get('/getTechnicalSupports', getTechnicalSupports);
router.get('/getTechnicalSupportById/:id', getTechnicalSupportById);
router.put('/updateTechnicalSupport/:id', updateTechnicalSupport);
router.delete('/deleteTechnicalSupport/:id', deleteTechnicalSupport);

module.exports = router;