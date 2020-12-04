const { Router } = require('express'),
    uploads = require('../services/upload'),
    AuthRepository = require('../repositories/auth.repository'),
    UsuarioRepository = require('../repositories/usuario.repository');

const router = Router(),
    UploadController = router;

const auth = new AuthRepository();
const repository = new UsuarioRepository();

router.use('/profile', auth.verifyJWT, uploads.single('file'), (req, res) => {
    try {
        if (req.query.Id === {})
            res.sendStatus(401).send({
                success: false,
                message: 'No User Id'
            });

        const userId = req.query.Id.toString();

        repository.updateUserProfile(userId, req.file.filename, req, res);
    } catch (error) {
        res.status(500).send({
            success: false,
            error: 'Ocorreu um erro ao salvar a imagem, tente novamente'
        });
    }
});

module.exports = UploadController;