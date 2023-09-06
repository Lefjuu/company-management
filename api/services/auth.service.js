const AppError = require('../../utils/errors/AppError.js');
const Email = require('../../utils/email.js');
const { UserModel } = require('../models');
const crypto = require('crypto');

exports.login = async (login, password) => {
    const user = await UserModel.findOne({
        username: login,
    }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return new AppError('Incorrect login or password', 401);
    } else if (!user.active) {
        return new AppError('Verify your account', 401);
    } else {
        return user;
    }
};

exports.signup = async (newUser, url) => {
    const exists = await UserModel.exists({
        email: newUser.email,
    });
    if (exists) {
        return new AppError(`${newUser.email} is already registered`, 400);
    } else {
        const user = await UserModel.create(newUser);

        const urlWithToken = url + user.verifyToken;

        await new Email(newUser, urlWithToken).sendVerificationToken();
        const { password, __v, active, ...userWithoutPassword } =
            user.toObject();

        return userWithoutPassword;
    }
};

exports.me = async (userId) => {
    const user = await UserModel.findById(userId);

    return user;
};

exports.verify = async (token) => {
    const user = await UserModel.findOne({
        verifyToken: token,
    });

    if (!user || user.verifyTokenExpires < new Date()) {
        return new AppError(`Token expired`, 400);
    }

    await User.findOneAndUpdate(user._id, { active: true });
};

exports.forgotPassword = async (email, url) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        return new AppError('There is no user with this email address.', 400);
    }

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        const resetURL = url + resetToken;
        await new Email(user, resetURL).sendPasswordReset();
        return true;
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return new AppError(
            'There was an error sending the email. Try again later!',
            500,
        );
    }
};

exports.resetPassword = async (token, password, confirmPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return new AppError('Token is invalid or has expired', 400);
    }
    user.password = password;
    user.passwordConfirm = confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return user;
};

exports.sendVerifyEmail = async (email, url) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        return new AppError('There is no user with this email address.', 400);
    }

    const urlWithToken = url + user.verifyToken;

    await new Email(user, urlWithToken).sendVerificationToken();
    return true;
};
