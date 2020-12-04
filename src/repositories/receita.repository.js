const sql = require('../config/database.config'),
    Receita = require('../models/receita.model');

class ReceitaRepository {

    constructor() { }

    getIncome(userId, start, limit, categoryId, month, year, req, res) {
        var script = `SELECT R.ReceitaId
                           , R.UsuarioId
                           , R.CategoriaReceitaId
                           , CR.Nome AS Categoria
                           , R.Descricao
                           , CAST(FORMAT(IFNULL(R.Valor,0),2,'pt_BR') AS VARCHAR(100)) AS Valor
                           , DATE_FORMAT(R.DataRecebimento, "%d/%m/%Y") AS DataRecebimento
                        FROM Receita R
                        LEFT JOIN CategoriaReceita CR ON CR.CategoriaReceitaId = R.CategoriaReceitaId
                       WHERE R.UsuarioId = ${userId}
                         AND MONTH(R.DataRecebimento) = ${month}
                         AND YEAR(R.DataRecebimento) = ${year}
                         AND (CASE WHEN ${categoryId} = 0 THEN R.CategoriaReceitaId != 0
                              ELSE R.CategoriaReceitaId = ${categoryId} END)
                       LIMIT ${start}, ${limit};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaRepository.errorHandler(error, res);
                }
                else {
                    ReceitaRepository.getTotalRows(userId, month, year, response, req, res);
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    getIncomeResume(userId, month, year, req, res) {
        var script = `SELECT Descricao
                           , FORMAT(IFNULL(Valor,0),2,'pt_BR') AS MaxValor
                        FROM Receita
                       WHERE UsuarioId = ${userId}
                         AND MONTH(DataRecebimento) = ${month}
                         AND YEAR(DataRecebimento) = ${year}
                    ORDER BY Valor DESC LIMIT 1;`;

        script += `SELECT Descricao
                        , FORMAT(IFNULL(Valor,0),2,'pt_BR') AS MinValor
                     FROM Receita
                    WHERE UsuarioId = ${userId}
                      AND MONTH(DataRecebimento) = ${month}
                      AND YEAR(DataRecebimento) = ${year}
                 ORDER BY Valor ASC LIMIT 1;`;

        script += `SELECT FORMAT(SUM(IFNULL(Valor,0)),2, 'pt_BR') AS ValorTotal
                     FROM Receita
                    WHERE UsuarioId = ${userId}
                      AND MONTH(DataRecebimento) = ${month}
                      AND YEAR(DataRecebimento) = ${year};`;
        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaRepository.errorHandler(error, res);
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

    static getTotalRows(userId, month, year, receitas, req, res) {
        var script = `SELECT COUNT(1) AS TotalLinhas
                        FROM Receita
                       WHERE UsuarioId = ${userId}
                         AND MONTH(DataRecebimento) = ${month}
                         AND YEAR(DataRecebimento) = ${year};`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    ReceitaRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        totalLinhas: response[0].TotalLinhas,
                        receitas: receitas
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    insertIncome(income, req, res) {
        var script = `INSERT
                        INTO Receita (
                             UsuarioId
                           , CategoriaReceitaId
                           , Descricao
                           , Valor
                           , DataRecebimento
                           )
                      VALUES (
                             ${income.UsuarioId}
                           , ${income.CategoriaReceitaId}
                           , '${income.Descricao}'
                           , ${income.Valor}
                           , '${income.DataRecebimento}'
                            );`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaRepository.errorHandler(error, res);
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

    deleteIncome(receitaId, req, res) {
        var script = `DELETE
                        FROM Receita
                       WHERE ReceitaId = ${receitaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaRepository.errorHandler(error, res);
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

    updateIncome(income, req, res) {
        var script = `UPDATE Receita 
                         SET CategoriaReceitaId = ${income.CategoriaReceitaId}
                           , Descricao = '${income.Descricao}'
                           , Valor = ${income.Valor}
                           , DataRecebimento = '${income.DataRecebimento}'
                       WHERE ReceitaId = ${income.ReceitaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaRepository.errorHandler(error, res);
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

module.exports = ReceitaRepository;