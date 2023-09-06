const AppError = require('../../utils/errors/AppError');
const Task = require('../models/task.model');
const { TaskModel, TimetableModel } = require('../models');

exports.getTask = async (id) => {
    return await TaskModel.findById(id);
};

exports.createTask = async (task) => {
    const { timetable, startDate, endDate } = task;

    if (startDate >= endDate) {
        throw new AppError(`Invalid Hours`, 400);
    }

    const timetableDoc = await TimetableModel.findById(timetable);
    if (!timetableDoc) {
        throw new AppError('Timetable not found', 400);
    }

    if (startDate < timetableDoc.startDate || endDate > timetableDoc.endDate) {
        throw new AppError(
            'Task time is outside the timetable time range',
            400,
        );
    }

    const overlappingTasks = await TaskModel.find({
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

    const createdTask = await TaskModel.create({
        ...task,
        startDate: startDate,
        endDate: endDate,
    });

    await TimetableModel.updateOne(
        { _id: timetable },
        { $addToSet: { tasks: createdTask._id } },
    );

    return createdTask;
};

exports.updateTask = async (id, body, role) => {
    const task = await Task.findById(id);
    if (!task) {
        throw new AppError('Task not found', 400);
    }
    let updatedTask;
    if (role === 'admin') {
        updatedTask = await TaskModel.findByIdAndUpdate(
            { _id: task.id },
            body,
            {
                new: true,
                runValidators: true,
            },
        );
    } else {
        updatedTask = await TaskModel.findByIdAndUpdate(
            {
                _id: task._id,
            },
            {
                ended: body.ended,
                description: body.description,
            },
            {
                new: true,
                runValidators: true,
            },
        );
    }
    return updatedTask;
};

exports.deleteTask = async (id) => {
    const task = await TaskModel.findByIdAndDelete(id);

    if (!task) {
        return false;
    }

    const timetable = await TimetableModel.updateOne(
        {
            _id: task.timetable,
        },
        {
            $pull: { tasks: task._id },
        },
        {
            new: true,
            runValidators: true,
        },
    );

    if (!timetable) {
        return false;
    }

    return true;
};
