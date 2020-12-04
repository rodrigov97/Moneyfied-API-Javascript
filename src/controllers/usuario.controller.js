const { Router } = require('express'),
    AuthController = require('./auth.controller'),
    UsuarioRepository = require('../repositories/usuario.repository'),
    Usuario = require('../models/usuario.model');

const router = Router(),
    UsuarioController = router;

const auth = new AuthController();
const repository = new UsuarioRepository();

router.post('/register', (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    var usuario = new Usuario(req.body);

    repository.postUser(usuario, req, res);
});

router.use('/get', auth.verifyJWT, (req, res) => {
    if (req.query.Id === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No User Id'
        });

    const userId = req.query.Id.toString();

    repository.getUser(userId, req, res);
});

router.use('/update', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(204).send({
            message: 'No content.'
        });

    var usuario = new Usuario(req.body);

    repository.updateUser(usuario, req, res);
});

module.exports = UsuarioController;
