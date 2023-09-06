const { TimetableModel } = require('../models');

function isDateFormat(input) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return dateRegex.test(input);
}
function isMongoObjectId(input) {
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    return mongoIdRegex.test(input);
}

exports.getTimetable = async (param, currentUser, employeeId) => {
    if (employeeId && isDateFormat(param)) {
        const existingTimetable = await TimetableModel.findOne({
            userId: employeeId,
            currentDate: param,
        });

        if (existingTimetable) {
            return existingTimetable;
        }
        return await TimetableModel.create({
            userId: employeeId,
            currentDate: param,
        });
    }
    if (isDateFormat(param)) {
        const existingTimetable = await TimetableModel.findOne({
            currentDate: param,
            userId: currentUser,
        });

        if (existingTimetable) {
            return existingTimetable;
        }
    } else if (isMongoObjectId(param)) {
        const existingTimetable = await TimetableModel.findById(param);

        if (existingTimetable) {
            return existingTimetable;
        }
    }

    const newTimetable = await TimetableModel.create({
        userId: currentUser,
        currentDate: param,
    });

    return newTimetable;
};

exports.getTodayTimetable = async (userId) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, '0')}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentYear}`;

    const existingTimetable = await TimetableModel.findOne({
        userId: userId,
        currentDate: formattedDate,
    });

    if (!existingTimetable) {
        const createdTimetable = await TimetableModel.create({
            userId,
            currentDate: formattedDate,
        });
        return createdTimetable;
    }

    return existingTimetable;
};
