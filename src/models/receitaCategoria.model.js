const { Receita } = require("./receita.model");

class ReceitaCategoria {
    CategoriaReceitaId;
    UsuarioId;
    Nome;

    constructor(attr) {
        this.CategoriaReceitaId = attr.CategoriaReceitaId ? attr.CategoriaReceitaId : null;
        this.UsuarioId = attr.UsuarioId ? attr.UsuarioId : null;
        this.Nome = attr.Nome;
    }
}

module.exports = ReceitaCategoria;