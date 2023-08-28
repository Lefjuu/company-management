const express = require('express');
const { authController, userController } = require('../controllers');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify/:token', authController.verify);
router.post('/refresh', authController.refresh);

router.use(authController.protect);

router.get('/me', authController.getMe, userController.getUser);
// router.get('/logout', authController.logout);

module.exports = router;
