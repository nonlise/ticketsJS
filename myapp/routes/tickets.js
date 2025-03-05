const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router.post('/', ticketsController.createTicket);
router.put('/:id/work', ticketsController.workOnTicket);
router.put('/:id/complete', ticketsController.completeTicket);
router.put('/:id/cancel', ticketsController.cancelTicket);
router.get('/', ticketsController.getTickets);
router.put('/cancel-progress', ticketsController.cancelAllInProgress);

module.exports = router;
