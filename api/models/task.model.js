const { default: mongoose } = require('mongoose');

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // Validation for "hh:mm" format
            },
            message: (props) =>
                `${props.value} is not a valid time in "hh:mm" format!`,
        },
    },
    endDate: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // Validation for "hh:mm" format
            },
            message: (props) =>
                `${props.value} is not a valid time in "hh:mm" format!`,
        },
    },
    description: {
        type: String,
    },
    timetable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable',
    },
    ended: {
        type: Boolean,
        default: false,
    },
});

// taskSchema.pre('save', function (next) {
//     const startDateParts = this.startDate.split(':').map(Number);
//     const endDateParts = this.endDate.split(':').map(Number);
//     const startTime = new Date(0, 0, 0, startDateParts[0], startDateParts[1]);
//     const endTime = new Date(0, 0, 0, endDateParts[0], endDateParts[1]);

//     if (startTime >= endTime) {
//         return next(new Error('startDate must be earlier than endDate'));
//     }
//     next();
// });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
