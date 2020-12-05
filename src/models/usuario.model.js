class Usuario {

    constructor(attr) {
        this.UsuarioId = attr.UsuarioId;
        this.Nome = attr.Nome;
        this.Email = attr.Email;
        this.Senha = attr.Senha;
        this.ImagemPerfil = attr.ImagemPerfil;
        this.EmailConfirmado = attr.EmailConfirmado;
    }
}

module.exports = Usuario;