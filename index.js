const {
    PROJECT_MODE,
    SERVER_HOSTNAME,
    SERVER_PORT,
} = require('./config/index.js');
const { init, app } = require('./app.js');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

(async () => {
    try {
        await init();

        app.listen(SERVER_PORT, () => {
            console.log(
                `🚀 Server is ready!
                \nmode: ${PROJECT_MODE}
                \nserver: http://${SERVER_HOSTNAME}:${SERVER_PORT}`,
            );
        });
    } catch (err) {
        console.log(err);
    }
})();

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});
