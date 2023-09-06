const { TimetableModel } = require('../models');
const { redisClient, getAsync, setAsync } = require('../../libs/redis.lib');

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
            console.log(cachedData);
            return JSON.parse(cachedData);
        }

        console.log('Cache miss, fetching from the database.');

        const existingTimetable = await TimetableModel.findOne({
            userId: userId,
            currentDate: formattedDate,
        });

        if (!existingTimetable) {
            console.log(
                'Data not found in the database, creating a new timetable.',
            );

            const createdTimetable = await TimetableModel.create({
                userId,
                currentDate: formattedDate,
            });

            await setAsync(
                cacheKey,
                JSON.stringify(createdTimetable),
                'EX',
                3600,
            );

            console.log('New timetable created and cached.');

            return createdTimetable;
        }

        await setAsync(cacheKey, JSON.stringify(existingTimetable), 'EX', 7200);

        console.log('Existing timetable fetched from the database and cached.');

        return existingTimetable;
    } catch (error) {
        console.error('Error:', error);
        return callback(error, null);
    }
};
