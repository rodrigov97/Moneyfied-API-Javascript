class Despesa {
    DespesaId;
    UsuarioId;
    CategoriaDespesaId;
    Descricao;
    Valor;
    Parcelado;
    ParcelaQtd;
    ParcelaNumero;
    ParcelaValor;
    DataInicial;
    DataFinal;
    DataPagamento;

    constructor(attr) {
        this.DespesaId = attr.DespesaId || null;
        this.UsuarioId = attr.UsuarioId || null;
        this.CategoriaDespesaId = attr.CategoriaDespesaId || null;
        this.Descricao = attr.Descricao;
        this.Valor = attr.Valor;
        this.Parcelado = attr.Parcelado;
        this.ParcelaQtd = attr.ParcelaQtd || null;
        this.ParcelaNumero = attr.ParcelaNumero || null;
        this.ParcelaValor = attr.ParcelaValor || null;
        this.DataInicial = attr.DataInicial || null;
        this.DataFinal = attr.DataFinal || null;
        this.DataPagamento = attr.DataPagamento;
    }
}

module.exports = Despesa;