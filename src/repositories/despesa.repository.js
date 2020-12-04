const sql = require('../config/database.config'),
    Despesa = require('../models/despesa.model');

class DespesaRepository {

    constructor() { }

    getExpense(userId, start, limit, categoryId, month, year, req, res) {
        var script = `SELECT D.DespesaId
                           , D.UsuarioId
                           , D.CategoriaDespesaId
                           , CD.Nome AS Categoria
                           , D.Descricao
                           , CAST(FORMAT(IFNULL(D.Valor,0),2,'pt_BR') AS VARCHAR(100)) AS Valor
                           , D.Parcelado
                           , D.ParcelaQtd
                           , CONCAT("(", D.ParcelaNumero, "/", D.ParcelaQtd, ")") AS ParcelaNumero
                           , CAST(FORMAT(IFNULL(D.ParcelaValor,0),2,'pt_BR') AS VARCHAR(100)) AS ParcelaValor
                           , DATE_FORMAT(D.DataInicial, "%d/%m/%Y") AS DataInicial
                           , DATE_FORMAT(D.DataFinal, "%d/%m/%Y") AS DataFinal
                           , DATE_FORMAT(D.DataPagamento, "%d/%m/%Y") AS DataPagamento
                        FROM Despesa D
                        LEFT JOIN CategoriaDespesa CD ON CD.CategoriaDespesaId = D.CategoriaDespesaId
                       WHERE D.UsuarioId = ${userId}
                         AND MONTH(D.DataPagamento) = ${month}
                         AND YEAR(D.DataPagamento) = ${year}
                         AND (CASE WHEN ${categoryId} = 0 THEN D.CategoriaDespesaId != 0
                              ELSE D.CategoriaDespesaId = ${categoryId} END)
                       LIMIT ${start}, ${limit};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaRepository.errorHandler(error, res);
                }
                else {
                    DespesaRepository.getTotalRows(userId, month, year, response, req, res);
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    getExpenseResume(userId, month, year, req, res) {
        var script = `SELECT Descricao
                           , FORMAT(IFNULL(ParcelaValor,0),2,'pt_BR') AS MaxValor
                        FROM Despesa
                       WHERE UsuarioId = ${userId}
                         AND MONTH(DataPagamento) = ${month}
                         AND YEAR(DataPagamento) = ${year}
                    ORDER BY Valor DESC LIMIT 1;`;

        script += `SELECT Descricao
                        , FORMAT(IFNULL(ParcelaValor,0),2,'pt_BR') AS MinValor
                     FROM Despesa
                    WHERE UsuarioId = ${userId}
                      AND MONTH(DataPagamento) = ${month}
                      AND YEAR(DataPagamento) = ${year}
                 ORDER BY Valor ASC LIMIT 1;`;

        script += `SELECT FORMAT(SUM(IFNULL(ParcelaValor,0)),2, 'pt_BR') AS ValorTotal
                     FROM Despesa
                    WHERE UsuarioId = ${userId}
                      AND MONTH(DataPagamento) = ${month}
                      AND YEAR(DataPagamento) = ${year};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaRepository.errorHandler(error, res);
                }
                else if (response[0].length > 0) {
                    var values = {
                        MaxDesc: response[0][0].Descricao,
                        MaxValue: response[0][0].MaxValor,
                        MinDesc: response[1][0].Descricao,
                        MinValue: response[1][0].MinValor,
                        TotalValue: response[2][0].ValorTotal,
                    };

                    res.status(200).send({
                        success: true,
                        values: values
                    });
                }
                else {
                    res.status(200).send({
                        success: false
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static getTotalRows(userId, month, year, despesas, req, res) {
        var script = `SELECT COUNT(1) AS TotalLinhas
                        FROM Despesa
                       WHERE UsuarioId = ${userId}
                         AND MONTH(DataPagamento) = ${month}
                         AND YEAR(DataPagamento) = ${year};`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    DespesaRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        totalLinhas: response[0].TotalLinhas,
                        despesas: despesas
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    insertExpense(expense, req, res) {
        var script = '';

        if (!expense.Parcelado) {
            script = `INSERT
                        INTO Despesa (
                             UsuarioId
                           , CategoriaDespesaId
                           , Descricao
                           , Valor
                           , Parcelado
                           , ParcelaQtd
                           , ParcelaNumero
                           , ParcelaValor
                           , DataInicial
                           , DataFinal
                           , DataPagamento
                           )
                      VALUES (
                             ${expense.UsuarioId}
                           , ${expense.CategoriaDespesaId}
                           , '${expense.Descricao}'
                           , ${expense.Valor}
                           , ${expense.Parcelado}
                           , ${expense.ParcelaQtd}
                           , ${1}
                           , ${expense.ParcelaValor}
                           , '${expense.DataInicial}'
                           , '${expense.DataFinal}'
                           , '${expense.DataPagamento}'
                             );`;
        }
        else {
            var count = 0;

            for (count; count < expense.ParcelaQtd; count++) {

                script += `INSERT
                            INTO Despesa (
                                 UsuarioId
                               , CategoriaDespesaId
                               , Descricao
                               , Valor
                               , Parcelado
                               , ParcelaQtd
                               , ParcelaNumero
                               , ParcelaValor
                               , DataInicial
                               , DataFinal
                               , DataPagamento
                               )
                        VALUES (
                                 ${expense.UsuarioId}
                               , ${expense.CategoriaDespesaId}
                               , '${expense.Descricao}'
                               , ${expense.Valor}
                               , ${expense.Parcelado}
                               , ${expense.ParcelaQtd}
                               , ${(count + 1)}
                               , ${expense.ParcelaValor}
                               , '${expense.DataInicial}'
                               , '${expense.DataFinal}'
                               , DATE_ADD('${expense.DataPagamento}', INTERVAL ${count} MONTH)
                                 );
                                 `;
            }
        }

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        response: response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    deleteExpense(despesaId, req, res) {
        var script = `DELETE
                        FROM Despesa
                       WHERE DespesaId = ${despesaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        response: response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    updateExpense(expense, req, res) {
        var script = `UPDATE Despesa 
                         SET CategoriaDespesaId = ${expense.CategoriaDespesaId}
                           , Descricao = '${expense.Descricao}'
                           , Valor = ${expense.Valor}
                           , Parcelado = ${expense.Parcelado}
                           , ParcelaQtd = ${expense.ParcelaQtd}
                           , ParcelaValor = ${expense.ParcelaValor}
                           , DataInicial = '${expense.DataInicial}'
                           , DataFinal = '${expense.DataFinal}'
                           , DataPagamento = '${expense.DataPagamento}'
                       WHERE DespesaId = ${expense.DespesaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        response: response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static errorHandler(error, res) {
        res.status(500).send({
            error: error,
            message: error.sqlMessage
        });
    }
}

module.exports = DespesaRepository;