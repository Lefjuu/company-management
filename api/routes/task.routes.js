const express = require('express');
const { taskController, authController } = require('../controllers');

const router = express.Router();

router
    .route('/:id')
    .get(authController.protect, taskController.getTask)
    .patch(authController.protect, taskController.updateTask);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', taskController.createTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
