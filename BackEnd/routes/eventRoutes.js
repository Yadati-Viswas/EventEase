const express = require('express');
const router = express.Router();
const eventController = require('../modules/eventController');
const { fileUpload } = require('../middleware/fileUpload');
const {verifyToken} = require('../middleware/auth');

router.post('/newEvent',verifyToken, fileUpload, eventController.createEvent);
router.get('/all', eventController.getAllEvents);
router.post('/register/:id', verifyToken, eventController.registerEvent);
router.get('/registered-events', verifyToken, eventController.getRegisteredEvents);
router.post('/updateEvent/:id', verifyToken, fileUpload, eventController.updateEvent);
router.post('/delete/:id', verifyToken, eventController.deleteEvent);

module.exports = router;