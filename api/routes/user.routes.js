const express = require('express');
const { authController, userController } = require('../controllers');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
// router.get('/logout', authController.logout);

module.exports = router;
