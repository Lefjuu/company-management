const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/verify-email', authController.sendVerifyEmail);
router.post('/verify/:token', authController.verify);
router.post('/refresh', authController.refresh);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

module.exports = router;
