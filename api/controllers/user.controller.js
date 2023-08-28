const AppError = require('../../utils/errors/AppError');
const catchError = require('../../utils/errors/catchError');
const UserService = require('../services/user.service');

exports.getUser = catchError(async (req, res, next) => {
    const user = await UserService.getUser(req.params.id);
    if (!user) {
        return next(new AppError('User not found with that ID', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: user,
        },
    });
});
