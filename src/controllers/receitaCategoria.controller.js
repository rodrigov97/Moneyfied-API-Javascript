const { Router } = require('express'),
    AuthRepository = require('../repositories/auth.repository'),
    ReceitaCategoria = require('../models/receitaCategoria.model'),
    ReceitaCategoriaRepository = require('../repositories/receitaCategoria.repository');

const router = Router(),
    ReceitaCategoriaController = router;

const auth = new AuthRepository();
const repository = new ReceitaCategoriaRepository();

router.use('/get', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString());

    repository.getIncomeCategories(userId, req, res);
});

router.use('/insert', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const categoria = new ReceitaCategoria(req.body);

    repository.insertIncomeCategory(categoria, req, res);
});

router.use('/update', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const categoria = new ReceitaCategoria(req.body);

    repository.updateIncomeCategory(categoria, req, res);
});

router.use('/delete', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const categoriaId = parseInt(req.query.CategoriaId.toString());

    repository.deleteIncomeCategory(categoriaId, req, res);
});

module.exports = ReceitaCategoriaController;