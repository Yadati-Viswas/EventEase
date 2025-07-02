const express = require('express');
const router = express.Router();
const eventController = require('../modules/eventController');
const { fileUpload } = require('../middleware/fileUpload');
const {verifyToken, isAuthor, isGuest, isLoggedIn} = require('../middleware/auth');
const { convertDateTimetoISO, checkImage, validateResult, validateEvent, validateRsvp, validateId } = require('../middleware/validator');

router.post('/newEvent', verifyToken, isLoggedIn, fileUpload, checkImage, convertDateTimetoISO, validateEvent, validateResult, eventController.createEvent);
router.get('/all', eventController.getAllEvents);
router.post('/register/:id',verifyToken, isLoggedIn, validateId,  eventController.registerEvent);
router.post('/unregister/:id', verifyToken, isLoggedIn, validateId,  eventController.UnregisterEvent);
router.get('/registered-events', verifyToken, isLoggedIn, eventController.getRegisteredEvents);
router.post('/rsvp/:id', verifyToken, isLoggedIn, validateId, validateRsvp, eventController.sendRsvp);
router.get('/getRsvp/:id', verifyToken, isLoggedIn, validateId, eventController.getRsvp);
router.post('/updateEvent/:id', verifyToken, isLoggedIn, validateId, isAuthor, fileUpload, checkImage, convertDateTimetoISO, validateEvent, validateResult, eventController.updateEvent);
router.post('/delete/:id', verifyToken, isLoggedIn, validateId, isAuthor, eventController.deleteEvent);

module.exports = router;