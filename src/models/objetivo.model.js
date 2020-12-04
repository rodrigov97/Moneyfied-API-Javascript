class Objetivo {
    ObjetivoId;
    UsuarioId;
    Nome;
    ValorObjetivo;
    ValorAtual;
    DataLimite;
    DataObjetivo;
    Status;
    Porcentagem;

    constructor(attr) {
        this.ObjetivoId = attr.ObjetivoId ? attr.ObjetivoId : null;
        this.UsuarioId = attr.UsuarioId ? attr.UsuarioId : null;
        this.Nome = attr.Nome;
        this.ValorObjetivo = attr.ValorObjetivo;
        this.ValorAtual = attr.ValorAtual;
        this.DataLimite = attr.DataLimite;
        this.DataObjetivo = attr.DataObjetivo;
        this.Status = attr.Status;
        this.Porcentagem = attr.Porcentagem ? attr.Porcentagem : null;
    }
}

module.exports = Objetivo;