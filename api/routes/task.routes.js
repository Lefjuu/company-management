const express = require('express');
const { taskController } = require('../controllers');

const router = express.Router();

router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);

module.exports = router;
