const Timetable = require('../models/timetable.model');

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
        const existingTimetable = await Timetable.findOne({
            userId: employeeId,
            currentDate: param,
        });

        if (existingTimetable) {
            return existingTimetable;
        }
        return await Timetable.create({
            userId: employeeId,
            currentDate: param,
        });
    }
    if (isDateFormat(param)) {
        const existingTimetable = await Timetable.findOne({
            currentDate: param,
            userId: currentUser,
        });

        if (existingTimetable) {
            return existingTimetable;
        }
    } else if (isMongoObjectId(param)) {
        const existingTimetable = await Timetable.findById(param);

        if (existingTimetable) {
            return existingTimetable;
        }
    }

    const newTimetable = await Timetable.create({
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

    const existingTimetable = await Timetable.findOne({
        userId: userId,
        currentDate: formattedDate,
    });

    if (!existingTimetable) {
        const createdTimetable = await Timetable.create({
            userId,
            currentDate: formattedDate,
        });
        return createdTimetable;
    }

    return existingTimetable;
};

exports.getAllTimetables = async () => {};

exports.createTimetable = async (user) => {
    return await Timetable.create(user);
};

exports.deleteTimetable = async (id) => {
    return await User.findByIdAndDelete(id);
};

exports.updateTimetable = async (id, body) => {
    return await User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });
};
