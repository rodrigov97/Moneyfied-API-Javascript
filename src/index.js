const express = require('express'),
    configMiddlewares = require('./config/middleWares'),
    routesConfig = require('./config/routes'),
    app = express();

configMiddlewares(app);
routesConfig(app);

module.exports = app;