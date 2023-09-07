const express = require('express');
const { create } = require('./libs/express.lib.js');
const mongoose = require('./libs/mongoose.lib.js');
const { redisClient } = require('./libs/redis.lib.js');

const app = express();

const init = async () => {
    // express
    await create(app);

    // mongoose
    await mongoose();

    // redis
    await redisClient.connect();
};

module.exports = { init, app };
