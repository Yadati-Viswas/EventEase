const express = require('express');
const router = express.Router();
const userController = require('../modules/userModules/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/check-session', userController.checkSession);
router.get('/myEvents', userController.myEvents);
router.get('/logout', userController.logout);

module.exports = router;