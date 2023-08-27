const { AuthService, UserService } = require('../services');
const catchError = require('../../utils/errors/catchError');
const AppError = require('../../utils/errors/AppError');
const JwtUtils = require('../../utils/jwt');
const User = require('../models/user.model');

exports.login = catchError(async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return next(new AppError('Please provide login and password!', 400));
    }

    const data = await AuthService.login(login, password);
    if (data instanceof AppError) {
        return next(data);
    }

    JwtUtils.createSendToken(data, 200, req, res);
});

exports.signup = catchError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    const url = `${req.protocol}://${req.get('host')}/api/v1/users/verify/`;
    const data = await AuthService.signup(req.body, url);
    if (data instanceof AppError) {
        return next(data);
    }

    res.status(201).json({
        status: 'success',
        data: {
            user: data,
        },
    });
});

exports.me = catchError(async (req, res) => {
    const userId = req.user.id;
    if (verifyToken(req.headers, userId)) {
        if (userId) {
            const data = await AuthService.me(userId);
            if (data) {
                return res.status(200).json(data);
            } else {
                return new AppError('User not found', 401);
            }
        }
    }
});

exports.protect = catchError(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401,
            ),
        );
    }

    const decoded = await JwtUtils.decodeToken(token);

    const currentUser = await UserService.getUser(decoded.userId);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401,
            ),
        );
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401,
            ),
        );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

exports.verify = catchError(async (req, res, next) => {
    const data = await AuthService.verify(req.params.token);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'Your account has been activated',
    });
});

// exports.setNewPassword = async (req, res) => {
//     try {
//         const { password, repeatedPassword } = req.body;
//         const { string } = req.params;

//         if (
//             !password ||
//             validator.isEmpty(password) ||
//             !repeatedPassword ||
//             validator.isEmpty(repeatedPassword)
//         ) {
//             throw {
//                 code: CodeEnum.ProvideValues,
//                 message: 'Provide passwords',
//             };
//         }
//         if (password !== repeatedPassword) {
//             throw {
//                 code: CodeEnum.PasswordsNotIdentical,
//                 message: 'Passwords are not this same',
//             };
//         }
//         await AuthService.setNewPassword(string, password);
//         res.sendStatus(202);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };
