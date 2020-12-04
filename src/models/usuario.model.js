class Usuario {
    UsuarioId;
    Nome;
    Email;
    Senha;
    ImagemPerfil;
    EmailConfirmado;

    constructor(attr) {
        this.UsuarioId = attr.UsuarioId;
        this.Nome = attr.Nome;
        this.Email = attr.Email;
        this.Senha = attr.Senha;
        this.ImagemPerfil = attr.ImagemPerfil;
        this.EmailConfirmado = attr.EmailConfirmado || null;
    }
}

module.exports = Usuario;