const express = require('express');
const router = express.Router();
const userController = require('../modules/userController');
const user = require('../models/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/check-session', userController.checkSession);
router.get('/myEvents', userController.myEvents);
router.get('/logout', userController.logout);
router.post('/google-login', userController.googleLogin);
router.post('/reset-password',userController.resetPassword);

module.exports = router;