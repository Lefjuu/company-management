const express = require('express');
const { authController, userController } = require('../controllers');

const router = express.Router();
// authController.protect,

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify/:token', authController.verify);
router.post('/refresh', authController.refresh);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// router.use(authController.protect);

// PROTECTED ROUTES
router.get(
    '/me',
    authController.protect,
    authController.getMe,
    userController.getUser,
);
// router.get('/logout', authController.logout);

module.exports = router;
