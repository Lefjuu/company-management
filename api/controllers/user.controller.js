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

exports.getAllUsers = catchError(async (req, res, next) => {
    const users = await UserService.getAllUsers();
    if (!users) {
        return next(new AppError('Users not found', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: users,
        },
    });
});

exports.createUser = catchError(async (req, res, next) => {
    const user = await UserService.createUser(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: user,
        },
    });
});

exports.deleteUser = catchError(async (req, res, next) => {
    const doc = await UserService.deleteUser(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.updateUser = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

// exports.getAll = (Model) =>
//     catchAsync(async (req, res, next) => {
//         // To allow for nested GET reviews on tour (hack)
//         let filter = {};
//         if (req.params.tourId) filter = { tour: req.params.tourId };

//         const features = new APIFeatures(Model.find(filter), req.query)
//             .filter()
//             .sort()
//             .limitFields()
//             .paginate();
//         // const doc = await features.query.explain();
//         const doc = await features.query;

//         // SEND RESPONSE
//         res.status(200).json({
//             status: 'success',
//             results: doc.length,
//             data: {
//                 data: doc,
//             },
//         });
//     });
