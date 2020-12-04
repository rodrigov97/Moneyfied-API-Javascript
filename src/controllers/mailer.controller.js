const { Router } = require('express'),
    MailerRepository = require('../repositories/mailer.repository'),
    UsuarioRepository = require('../repositories/usuario.repository');

const router = Router(),
    MailerController = router;

const mail = new MailerRepository();
const user = new UsuarioRepository();

router.use('/email-confirmation', (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No information'
        });

    const email = req.body.Email;
    mail.verifyUserEmail(email, req, res);
});

router.use('/email-confirmation-answer', (req, res) => {
    if (req.query.id === '')
        res.sendStatus(401).send({
            success: false,
            message: 'No identificator'
        });

    const id = req.query.id.toString();
    user.updateEmailVerification(id, req, res);
});

router.use('/password-reset-confirmation', (req, res) => {
    if (req.body === {})
        res.sendStatus(401).send({
            success: false,
            message: 'No information'
        });

    const email = req.body.Email;
    mail.getUserToReset(email, req, res);
});

router.use('/password-reset', (req, res) => {
    if (req.query.id === '')
        res.sendStatus(401).send({
            success: false,
            message: 'No identificator'
        });

    const id = req.query.id.toString();
    mail.resetUserPassword(id, req, res);
});

module.exports = MailerController;