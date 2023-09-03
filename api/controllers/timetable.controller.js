const AppError = require('../../utils/errors/AppError');
const catchError = require('../../utils/errors/catchError');
const { TimetableService } = require('../services');

exports.getTimetable = catchError(async (req, res, next) => {
    const { param } = req.params;
    if (!param) {
        return next(new AppError('Please provide timetableId!', 400));
    }
    const timetable = await TimetableService.getTimetable(param, req.user._id);
    if (
        timetable.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new AppError('You have no access', 403));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: timetable,
        },
    });
});

exports.getTodayTimetable = catchError(async (req, res, next) => {
    const timetable = await TimetableService.getTodayTimetable(req.user._id);
    if (
        timetable.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new AppError('You have no access', 403));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: timetable,
        },
    });
});
