const Task = require('../models/task.model');

exports.getTask = async (id) => {
    return await Task.findById(id);
};

exports.createTask = async (task) => {
    return await Task.create(task);
};
