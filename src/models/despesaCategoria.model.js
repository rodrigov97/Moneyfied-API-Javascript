class DespesaCategoria {
    CategoriaDespesaId;
    UsuarioId;
    Nome;

    constructor(attr) {
        this.CategoriaDespesaId = attr.CategoriaDespesaId ? attr.CategoriaDespesaId : null;
        this.UsuarioId = attr.UsuarioId ? attr.UsuarioId : null;
        this.Nome = attr.Nome;
    }
}

module.exports = DespesaCategoria;