const express = require('express');
const { authController, userController } = require('../controllers');

const router = express.Router();
// authController.protect,

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify/:token', authController.verify);
router.get('/refresh', authController.refresh);

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

router.use(authController.protect, authController.restrictTo('admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(authController.protect, userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
