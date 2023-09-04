const express = require('express');
const { authController, userController } = require('../controllers');

const router = express.Router();

// PROTECTED ROUTES
router.get(
    '/me',
    authController.protect,
    authController.getMe,
    userController.getUser,
);

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
