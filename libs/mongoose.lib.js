const mongoose = require('mongoose');
const {
    MONGODB_HOSTNAME,
    MONGODB_DATABASE,
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    PROJECT_MODE,
} = require('../config/index.js');

module.exports = db = () => {
    return new Promise((resolve, reject) => {
        if (PROJECT_MODE === 'development') {
            mongoose.set('debug', true);
        }
        mongoose.set('strictQuery', false);

        mongoose.connect(
            MONGODB_USERNAME && MONGODB_PASSWORD
                ? `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}/${MONGODB_DATABASE}?retryWrites=true&w=majority`
                : `mongodb://${MONGODB_HOSTNAME}:${MONGODB_DATABASE}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        const mongo = mongoose.connection;

        mongo.once('connected', () => {
            console.log('✅ MongoDB: connected!');
            resolve();
        });

        mongo.on('error', (error) => {
            console.error('❌ MongoDB: error');
            reject(error);
        });
    });
};
