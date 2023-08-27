const express = require('express');
const { create } = require('./libs/express.lib.js');
// const { routes } = require('./services/router.service.js');
const mongoose = require('./libs/mongoose.lib.js');

const app = express();

const init = async () => {
    // express
    await create(app);

    // mongoose
    await mongoose();

    // // routes
    // await routes(app);
};

module.exports = { init, app };
