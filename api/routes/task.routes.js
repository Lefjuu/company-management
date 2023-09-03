const express = require('express');
const { taskController, authController } = require('../controllers');

const router = express.Router();

router
    .route('/:id')
    .get(authController.protect, taskController.getTask)
    .patch(authController.protect, taskController.updateTaskUser);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', taskController.createTask);

module.exports = router;
