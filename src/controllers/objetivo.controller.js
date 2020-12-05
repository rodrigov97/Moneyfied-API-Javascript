const { Router } = require('express'),
    AuthRepository = require('../repositories/auth.repository'),
    Objetivo = require('../models/objetivo.model'),
    ObjetivoRepository = require('../repositories/objetivo.repository');

const router = Router(),
    ObjetivoController = router;

const auth = new AuthRepository();
const repository = new ObjetivoRepository();

router.use('/get', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No parameters'
        });

    const userId = parseInt(req.query.userId.toString()),
        month = parseInt(req.query.month.toString()),
        year = parseInt(req.query.year.toString()),
        start = parseInt(req.query.start.toString()),
        limit = parseInt(req.query.limit.toString()),
        name = req.query.name.toString();

    repository.getGoal(userId, start, limit, month, year, name, req, res);
});

router.use('/insert', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const receita = new Objetivo(req.body);

    repository.insertGoal(receita, req, res);
});

router.use('/update', auth.verifyJWT, (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const objetivo = new Objetivo(req.body);

    repository.updateGoal(objetivo, req, res);
});

router.use('/delete', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const objetivoId = parseInt(req.query.objetivoId.toString());

    repository.deleteGoal(objetivoId, req, res);
});

router.use('/add-amount', auth.verifyJWT, (req, res) => {
    if (req.query === {})
        res.sendStatus(401).send({
            message: 'No information.'
        });

    const goalId = parseInt(req.query.goalId.toString()),
        amount = parseFloat(req.query.amount.toString());

    repository.addAmount(goalId, amount, req, res);
});

module.exports = ObjetivoController;