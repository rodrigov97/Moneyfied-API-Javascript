class Receita {

    constructor(attr) {
        this.ReceitaId = attr.ReceitaId ? attr.ReceitaId : null;
        this.UsuarioId = attr.UsuarioId ? attr.UsuarioId : null;
        this.CategoriaReceitaId = attr.CategoriaReceitaId ? attr.CategoriaReceitaId : null;
        this.Descricao = attr.Descricao;
        this.Valor = attr.Valor;
        this.DataRecebimento = attr.DataRecebimento;
    }
}

module.exports = Receita;