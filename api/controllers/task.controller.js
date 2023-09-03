const AppError = require('../../utils/errors/AppError');
const catchError = require('../../utils/errors/catchError');
const { TaskService } = require('../services');

exports.getTask = catchError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Please provide taskId!', 400));
    }
    const task = await TaskService.getTask(id);
    if (
        task.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new AppError('You have no access', 403));
    }
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
    if (
        task.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new AppError('You have no access', 403));
    }
    res.status(201).json({
        status: 'success',
        data: {
            data: task,
        },
    });
});

exports.updateTaskStatus = catchError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError('Please provide id!', 400));
    }
    const task = await TaskService.getTask(id);
    if (task instanceof AppError) {
        return next(task);
    }
    console.log(task);
    if (
        task.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new AppError('You have no access', 403));
    }
    const updatedTask = await TaskService.updateTaskStatus(id);

    res.status(200).json({
        status: 'success',
        data: {
            data: updatedTask,
        },
    });
});
