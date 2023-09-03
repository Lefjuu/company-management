const AppError = require('../../utils/errors/AppError');
const Task = require('../models/task.model');
const Timetable = require('../models/timetable.model');

exports.getTask = async (id) => {
    return await Task.findById(id);
};

exports.createTask = async (task) => {
    const { timetable, startDate, endDate } = task;

    if (startDate >= endDate) {
        throw new AppError(`Invalid Hours`, 400);
    }

    const timetableDoc = await Timetable.findById(timetable);
    if (!timetableDoc) {
        throw new AppError('Timetable not found', 400);
    }

    if (startDate < timetableDoc.startDate || endDate > timetableDoc.endDate) {
        throw new AppError(
            'Task time is outside the timetable time range',
            400,
        );
    }

    const overlappingTasks = await Task.find({
        timetable: timetable,
        $or: [
            {
                startDate: { $lt: endDate },
                endDate: { $gt: startDate },
            },
        ],
    });

    if (overlappingTasks.length > 0) {
        throw new AppError('Task time overlaps with existing tasks', 400);
    }

    const createdTask = await Task.create({
        ...task,
        startDate: startDate,
        endDate: endDate,
    });

    await Timetable.updateOne(
        { _id: timetable },
        { $addToSet: { tasks: createdTask._id } },
    );

    return createdTask;
};

exports.updateTaskStatus = async (id) => {
    const task = await Task.findById(id);
    if (!task) {
        throw new AppError('Task not found', 400);
    }
    const updatedTask = await Task.updateOne(
        {
            _id: task._id,
        },
        {
            ended: !task.ended,
        },
    );
    return updatedTask;
};
