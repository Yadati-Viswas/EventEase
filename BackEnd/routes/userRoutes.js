const express = require('express');
const router = express.Router();
const userController = require('../modules/userController');
const { isGuest, isLoggedIn, verifyToken  } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateResult,  validateSignUp, validateLogin } = require('../middleware/validator');

router.post('/signup', isGuest,  validateSignUp, validateResult, userController.signup);
router.post('/login', isGuest, loginLimiter, validateLogin, validateResult, userController.login);
router.get('/myEvents', verifyToken, isLoggedIn, userController.myEvents);
router.get('/logout', userController.logout);
router.post('/google-login', userController.googleLogin);
router.post('/reset-password', isGuest, userController.resetPassword);

module.exports = router;