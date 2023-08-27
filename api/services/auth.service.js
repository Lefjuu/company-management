const AppError = require('../../utils/errors/AppError.js');
const Email = require('../../utils/email.js');
const User = require('../models/user.model.js');

exports.login = async (login, password) => {
    const user = await User.findOne({
        username: login,
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return new AppError('Incorrect login or password', 401);
    } else if (!user.active) {
        console.log(user);
        return new AppError('Verify your account', 401);
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

        const urlWithToken = url + user.verifyToken;

        await new Email(newUser, urlWithToken).sendWelcome();
        const { password, __v, active, ...userWithoutPassword } =
            user.toObject();

        return userWithoutPassword;
    }
};

exports.me = async (userId) => {
    const user = await User.findById(userId);

    return user;
};

exports.verify = async (token) => {
    const user = await User.findOne({
        verifyToken: token,
    });

    if (!user || user.verifyTokenExpires < new Date()) {
        return new AppError(`Token expired`, 400);
    }

    await User.findOneAndUpdate(user._id, { active: true });
};
