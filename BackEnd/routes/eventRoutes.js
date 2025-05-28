const express = require('express');
const router = express.Router();
const eventController = require('../modules/eventController');
const { fileUpload } = require('../middleware/fileUpload');

router.post('/newEvent',fileUpload, eventController.createEvent);
router.get('/all', eventController.getAllEvents);
router.post('/register/:id', eventController.registerEvent);
router.get('/registered-events', eventController.getRegisteredEvents);
router.post('/updateEvent/:id', fileUpload, eventController.updateEvent);
router.post('/delete/:id', eventController.deleteEvent);

module.exports = router;