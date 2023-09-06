const UserModel = require('../models/user.model');

exports.getUser = async (id) => {
    return await UserModel.findById(id);
};

exports.getAllUsers = async () => {
    return await UserModel.find();
};

exports.createUser = async (user) => {
    return await UserModel.create(user);
};

exports.deleteUser = async (id) => {
    return await UserModel.findByIdAndDelete(id);
};

exports.updateUser = async (id, body) => {
    return await UserModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });
};
