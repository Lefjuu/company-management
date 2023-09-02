const mongoose = require('mongoose');

const timetableSchema = mongoose.Schema({
    startDate: {
        type: String,
        default: '08:00',
        validate: {
            validator: function (v) {
                return /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: (props) =>
                `${props.value} is not a valid time in "hh:mm" format!`,
        },
    },
    endDate: {
        type: String,
        default: '16:00',
        validate: {
            validator: function (v) {
                return /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: (props) =>
                `${props.value} is not a valid time in "hh:mm" format!`,
        },
    },
    currentDate: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
