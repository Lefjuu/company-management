const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const globalErrorHandler = require('../utils/errors/ErrorHandler');
const rateLimit = require('express-rate-limit');
const { NODE_ENV } = require('../config/index.js');
const userRouter = require('../api/routes/user.routes');
const taskRouter = require('../api/routes/task.routes');
const timetableRouter = require('../api/routes/timetable.routes');
const AppError = require('../utils/errors/AppError');

const create = async (app) => {
    app.use(helmet());
    app.use(
        bodyParser.json({
            limit: '50mb',
            extended: true,
        }),
    );
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
        rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 100,
            message: 'You have exceeded the requests in 1 minute limit!',
            headers: true,
        }),
    );
    app.use(cookieParser());

    const corsOptions = {
        // origin: CLIENT_HOSTNAME,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: ['Content-Type', 'Authorization'],
    };

    app.use(cors(corsOptions));

    if (NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/task', taskRouter);
    app.use('/api/v1/timetable', timetableRouter);

    app.all('*', (req, res, next) => {
        next(
            new AppError(`Can't find ${req.originalUrl} on this server!`, 404),
        );
    });

    app.use(globalErrorHandler);
};

module.exports = { create };
