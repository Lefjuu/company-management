const {
    JWT_SECRET_ACCESS_KEY,
    JWT_SECRET_REFRESH_KEY,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
} = require('../config/index');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
    return jwt.sign({ userId: id }, JWT_SECRET_ACCESS_KEY, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ userId: id }, JWT_SECRET_REFRESH_KEY, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
};

exports.generateResponseWithTokens = async (
    user,
    statusCode,
    req,
    res,
    message,
) => {
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        message: message ? message : '',
        refreshToken,
        data: {
            user,
        },
    });
};

exports.decodeAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_ACCESS_KEY, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

exports.decodeRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_REFRESH_KEY, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};
