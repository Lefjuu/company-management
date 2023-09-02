const express = require('express');
const { timetableController, authController } = require('../controllers');

const router = express.Router();

router.get(
    '/today',
    authController.protect,
    timetableController.getTodayTimetable,
);
router.get('/:param', authController.protect, timetableController.getTimetable);

module.exports = router;
