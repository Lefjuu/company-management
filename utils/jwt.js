const {
    JWT_EXPIRES_IN,
    JWT_SECRET_ACCESS_KEY,
    JWT_COOKIE_EXPIRES_IN,
    JWT_SECRET_REFRESH_KEY,
} = require('../config/index');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) => {
    return jwt.sign({ userId: id }, JWT_SECRET_ACCESS_KEY, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ userId: id }, JWT_SECRET_REFRESH_KEY);
};

const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET_ACCESS_KEY, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

exports.createSendToken = async (user, statusCode, req, res) => {
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.cookie('jwt', accessToken, {
        expires: new Date(
            Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        refreshToken,
        data: {
            user,
        },
    });
};

exports.decodeToken = (token) => {
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
