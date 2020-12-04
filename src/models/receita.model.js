class Receita {
    ReceitaId;
    UsuarioId;
    CategoriaReceitaId;
    Descricao;
    Valor;
    DataRecebimento;

    constructor(attr) {
        this.ReceitaId = attr.ReceitaId || null;
        this.UsuarioId = attr.UsuarioId || null;
        this.CategoriaReceitaId = attr.CategoriaReceitaId || null;
        this.Descricao = attr.Descricao;
        this.Valor = attr.Valor;
        this.DataRecebimento = attr.DataRecebimento;
    }
}

module.exports = Receita;