const bodyParser = require('body-parser'),
    cors = require('cors');

const configMiddlewares = (app) => {

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
}

module.exports = configMiddlewares;
