const AppError = require('../../utils/errors/AppError');
const catchError = require('../../utils/errors/catchError');
const { TaskService } = require('../services');

exports.getTask = catchError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Please provide taskId!', 400));
    }
    const task = await TaskService.getTask(id);
    console.log(task);

    res.status(200).json({
        status: 'success',
        data: {
            data: task,
        },
    });
});

exports.createTask = catchError(async (req, res, next) => {
    const { name, startDate, endDate } = req.body;
    if (!name || !startDate || !endDate) {
        return next(
            new AppError('Please provide name, startDate and endDate!', 400),
        );
    }
    const task = await TaskService.createTask(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: task,
        },
    });
});
