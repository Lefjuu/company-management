const express = require('express');
const { taskController, authController } = require('../controllers');

const router = express.Router();

router.get('/:id', authController.protect, taskController.getTask);
router.patch(
    '/status/:id',
    authController.protect,
    taskController.updateTaskStatus,
);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', taskController.createTask);

module.exports = router;
