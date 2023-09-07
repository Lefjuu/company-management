const { TimetableModel } = require('../models');
const { getAsync, setAsync } = require('../../libs/redis.lib');
const { REDIS_EXPIRES_IN } = require('../../config');

function isDateFormat(input) {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return dateRegex.test(input);
}
function isMongoObjectId(input) {
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    return mongoIdRegex.test(input);
}

exports.getTimetable = async (param, currentUser, employeeId) => {
    const cacheKey = `timetable_${param}_${currentUser}_${employeeId || ''}`;

    const cachedTimetable = await getAsync(cacheKey);

    if (cachedTimetable) {
        return JSON.parse(cachedTimetable);
    }

    let timetable;

    if (employeeId && isDateFormat(param)) {
        timetable = await TimetableModel.findOne({
            userId: employeeId,
            currentDate: param,
        });
    } else if (isDateFormat(param)) {
        timetable = await TimetableModel.findOne({
            currentDate: param,
            userId: currentUser,
        });
    } else if (isMongoObjectId(param)) {
        timetable = await TimetableModel.findById(param);
    }

    if (!timetable) {
        timetable = await TimetableModel.create({
            userId: currentUser,
            currentDate: param,
        });
    }

    await setAsync(cacheKey, JSON.stringify(timetable), 'EX', REDIS_EXPIRES_IN);

    return timetable;
};

exports.getTodayTimetable = async (userId, callback) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, '0')}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentYear}`;

    const cacheKey = `timetable_${userId}_${formattedDate}`;

    try {
        console.log(cacheKey);
        const cachedData = await getAsync(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const existingTimetable = await TimetableModel.findOne({
            userId: userId,
            currentDate: formattedDate,
        });

        if (!existingTimetable) {
            const createdTimetable = await TimetableModel.create({
                userId,
                currentDate: formattedDate,
            });

            await setAsync(
                cacheKey,
                JSON.stringify(createdTimetable),
                'EX',
                REDIS_EXPIRES_IN,
            );

            return createdTimetable;
        }

        await setAsync(
            cacheKey,
            JSON.stringify(existingTimetable),
            'EX',
            REDIS_EXPIRES_IN,
        );

        return existingTimetable;
    } catch (error) {
        console.error('Error:', error);
        return callback(error, null);
    }
};
