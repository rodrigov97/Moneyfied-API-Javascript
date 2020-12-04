const { Router } = require('express'),
    AuthRepository = require('../repositories/auth.repository'),
    Receita = require('../models/receita.model'),
    ReceitaRepository = require('../repositories/receita.repository');

const router = Router(),
    ReceitaController = router;

const auth = new AuthRepository();
const repository = new ReceitaRepository();

router.use('/get', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString()),
        month = parseInt(req.query.month.toString()),
        year = parseInt(req.query.year.toString()),
        categoryId = parseInt(req.query.categoryId.toString()),
        start = parseInt(req.query.start.toString()),
        limit = parseInt(req.query.limit.toString());

    repository.getIncome(userId, start, limit, categoryId, month, year, req, res);
});

router.use('/insert', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const receita = new Receita(req.body);

    repository.insertIncome(receita, req, res);
});

router.use('/update', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const receita = new Receita(req.body);

    repository.updateIncome(receita, req, res);
});

router.use('/delete', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const receitaId = parseInt(req.query.receitaId.toString());

    repository.deleteIncome(receitaId, req, res);
});

router.use('/info', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString()),
        date = new Date(),
        month = req.query.month ? parseInt(req.query.month.toString()) : date.getMonth() + 1,
        year = req.query.year ? parseInt(req.query.year.toString()) : date.getFullYear();

    repository.getIncomeResume(userId, month, year, req, res);
});

module.exports = ReceitaController;