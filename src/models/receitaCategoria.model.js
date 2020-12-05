const { Receita } = require("./receita.model");

class ReceitaCategoria {

    constructor(attr) {
        this.CategoriaReceitaId = attr.CategoriaReceitaId ? attr.CategoriaReceitaId : null;
        this.UsuarioId = attr.UsuarioId ? attr.UsuarioId : null;
        this.Nome = attr.Nome;
    }
}

module.exports = ReceitaCategoria;