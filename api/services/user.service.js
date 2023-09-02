const User = require('../models/user.model');

exports.getUser = async (id) => {
    return await User.findById(id);
};

exports.getAllUsers = async () => {
    return await User.find();
};

exports.createUser = async (user) => {
    return await User.create(user);
};

exports.deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

exports.updateUser = async (id, body) => {
    return await User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });
};
