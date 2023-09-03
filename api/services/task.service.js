const AppError = require('../../utils/errors/AppError');
const Task = require('../models/task.model');
const Timetable = require('../models/timetable.model');

exports.getTask = async (id) => {
    return await Task.findById(id);
};

exports.createTask = async (task) => {
    const { timetable, startDate, endDate } = task;

    if (startDate > endDate) {
        throw new AppError(`StartDate can't be before endDate`);
    }

    const timetableDoc = await Timetable.findById(timetable);
    if (!timetableDoc) {
        throw new AppError('Timetable not found');
    }

    const timetableStartDate = timetableDoc.startDate;
    const timetableEndDate = timetableDoc.endDate;

    if (startDate < timetableStartDate || endDate > timetableEndDate) {
        throw new AppError('Task time is outside the timetable time range');
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
        throw new AppError('Task time overlaps with existing tasks');
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
