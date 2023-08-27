const AppError = require('../../utils/errors/AppError.js');
const Email = require('../../utils/email.js');
const User = require('../models/user.model.js');

exports.login = async (login, password) => {
    const user = await User.findOne({
        username: login,
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return new AppError('Incorrect login or password', 401);
    } else {
        return user;
    }
};

exports.signup = async (newUser, url) => {
    const exists = await User.exists({
        email: newUser.email,
    });
    if (exists) {
        return new AppError(`${newUser.email} is already registered`, 400);
    } else {
        const user = await User.create(newUser);

        console.log(url);
        await new Email(newUser, url).sendWelcome();
        const { password, __v, active, ...userWithoutPassword } =
            user.toObject();

        return userWithoutPassword;
    }
};

exports.me = async (userId) => {
    const user = await User.findById(userId);

    return user;
};
