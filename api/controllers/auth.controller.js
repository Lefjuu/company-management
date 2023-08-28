const { AuthService, UserService } = require('../services');
const catchError = require('../../utils/errors/catchError');
const AppError = require('../../utils/errors/AppError');
const JwtUtils = require('../../utils/jwt');

exports.login = catchError(async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return next(new AppError('Please provide login and password!', 400));
    }

    const data = await AuthService.login(login, password);
    if (data instanceof AppError) {
        return next(data);
    }

    return await JwtUtils.generateResponseWithTokens(data, 200, req, res);
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

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.protect = catchError(async (req, res, next) => {
    let token;
    let refreshToken;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (req.headers.refreshtoken) {
        refreshToken = req.headers.refreshtoken;
    } else if (req.cookies.refresh_token) {
        refreshToken = req.cookies.refresh_token;
    }

    if (token) {
        try {
            const decoded = await JwtUtils.decodeAccessToken(token);
            const currentUser = await UserService.getUser(decoded.userId);

            if (!currentUser) {
                return next(
                    new AppError(
                        'The user belonging to this token does no longer exist.',
                        401,
                    ),
                );
            }

            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //     return next(
            //         new AppError(
            //             'User recently changed password! Please log in again.',
            //             401,
            //         ),
            //     );
            // }

            req.user = currentUser;
            res.locals.user = currentUser;

            next();
        } catch (err) {
            try {
                const decodedRefresh =
                    await JwtUtils.decodeRefreshToken(refreshToken);

                const currentUser = await UserService.getUser(
                    decodedRefresh.userId,
                );

                if (!currentUser) {
                    return next(
                        new AppError(
                            'The user belonging to this token does no longer exist.',
                            401,
                        ),
                    );
                }

                return await JwtUtils.generateResponseWithTokens(
                    currentUser,
                    200,
                    req,
                    res,
                );
            } catch (err) {
                console.log(err);
                return next(
                    new AppError(
                        'You are not logged in! Please log in to get access.',
                        401,
                    ),
                );
            }
        }
    } else {
        if (!refreshToken) {
            return next(
                new AppError(
                    'You are not logged in! Please log in to get access.',
                    401,
                ),
            );
        }

        try {
            const decodedRefresh =
                await JwtUtils.decodeRefreshToken(refreshToken);
            const currentUser = await UserService.getUser(
                decodedRefresh.userId,
            );

            if (!currentUser) {
                return next(
                    new AppError(
                        'The user belonging to this token does no longer exist.',
                        401,
                    ),
                );
            }

            return await JwtUtils.generateResponseWithTokens(
                currentUser,
                200,
                req,
                res,
            );
        } catch (err) {
            console.log(err);
            return next(
                new AppError(
                    'You are not logged in! Please log in to get access.',
                    401,
                ),
            );
        }
    }
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

exports.refresh = catchError(async (req, res, next) => {
    const refreshToken = req.headers.refreshToken;
    console.log(req.headers);

    if (!refreshToken) {
        return next(new AppError('Refresh token not provided.', 401));
    }

    const decoded = await JwtUtils.decodeRefreshToken(refreshToken);
    const currentUser = await UserService.getUser(decoded.userId);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401,
            ),
        );
    }

    return await JwtUtils.generateResponseWithTokens(
        currentUser,
        200,
        req,
        res,
    );
});

exports.forgotPassword = catchError(async (req, res, next) => {
    if (!req.body.email) {
        return next(new AppError('Please provide email!', 400));
    }
    const url = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/users/reset-password/`;
    const data = await AuthService.forgotPassword(req.body.email, url);
    if (data instanceof AppError) {
        return next(data);
    }
    res.status(200).json({
        status: 'success',
        message: 'password reset email sent',
    });
});

exports.resetPassword = catchError(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
        return next(
            new AppError('Please provide password and confirm password!', 400),
        );
    }
    const data = await AuthService.resetPassword(
        req.params.token,
        password,
        confirmPassword,
    );

    console.log(data);
    return await JwtUtils.generateResponseWithTokens(data, 200, req, res);
});
