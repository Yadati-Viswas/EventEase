const express = require('express');
const userRoutes = require('./userRoutes');
const eventRoutes = require('./eventRoutes');
const otpController = require('../modules/otpController');
const router = express.Router();

router.use('/users', userRoutes );
router.use('/events', eventRoutes);
router.post('/send-otp', otpController.sendOTP);
router.post('/verify-otp', otpController.verifyOTP);
module.exports = router;