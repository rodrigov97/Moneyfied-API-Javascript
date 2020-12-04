const express = require('express'),
    IndexRoutes = require('../routes/main.route'),
    LoginController = require('../controllers/login.controller'),
    UsuarioController = require('../controllers/usuario.controller'),
    MailerController = require('../controllers/mailer.controller'),
    UploadController = require('../controllers/upload.controller'),
    DashboardController = require('../controllers/dashboard.controller'),
    ReceitaController = require('../controllers/receita.controller'),
    ReceitaCategoriaController = require('../controllers/receitaCategoria.controller'),
    DespesaController = require('../controllers/despesa.controller'),
    DespesaCategoriaController = require('../controllers/despesaCategoria.controller'),
    ObjetivoController = require('../controllers/objetivo.controller');

const routesConfig = (app) => {
    const URL = '/api/v1';

    app.use(express.static('dist/Moneyfied-Web/'));

    app.use(`${URL}/login`, LoginController);

    app.use(`${URL}/user`, UsuarioController);

    app.use(`${URL}/send-mail`, MailerController);

    app.use(`${URL}/uploads`, UploadController);

    app.use(`${URL}/dashboard`, DashboardController);

    app.use(`${URL}/income`, ReceitaController);

    app.use(`${URL}/income/categories`, ReceitaCategoriaController);

    app.use(`${URL}/expense`, DespesaController);

    app.use(`${URL}/expense/categories`, DespesaCategoriaController);

    app.use(`${URL}/goal`, ObjetivoController);

    app.use(`/*`, IndexRoutes);
}

module.exports = routesConfig;