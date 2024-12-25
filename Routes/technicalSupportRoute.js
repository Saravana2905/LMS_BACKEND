const express = require('express');
const router = express.Router();

const { createTicket, getTickets, updateTicket, updateTicketStatus, deleteTicket, closeTicket } = require('../Controllers/technicalSupportController');
const { getTestById } = require('../Controllers/testController');

router.post('/createTechnicalSupport', createTicket);
router.get('/getTechnicalSupports', getTickets);
router.get('/getTechnicalSupportById/:id', getTestById);
router.put('/updateTechnicalSupport/:id', updateTicket);
router.put('/updateTicketStatus/:id', updateTicketStatus)
router.delete('/deleteTechnicalSupport/:id', deleteTicket);
router.put('/closeTicket/:id', closeTicket);

module.exports = router;