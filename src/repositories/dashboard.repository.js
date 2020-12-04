const sql = require('../config/database.config'),
    Objetivo = require('../models/objetivo.model');

class DashboardRepository {

    constructor() { }

    getIncome(userId, req, res) {
        var script = `SELECT Descricao
                           , CAST(FORMAT(IFNULL(Valor,0),2,'pt_BR') AS VARCHAR(100)) AS Valor
                        FROM Receita
                       WHERE UsuarioId = ${userId}
                         AND YEAR(DataRecebimento) = YEAR(NOW())
                         AND MONTH(DataRecebimento) = MONTH(NOW())
                         AND DAY(DataRecebimento) = DAY(NOW())`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DashboardRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        receitas: response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    getExpense(userId, req, res) {
        var script = `SELECT Descricao
                           , CAST(FORMAT(IFNULL(ParcelaValor,0),2,'pt_BR') AS VARCHAR(100)) AS Valor
                        FROM Despesa
                       WHERE UsuarioId = ${userId}
                         AND YEAR(DataPagamento) = YEAR(NOW())
                         AND MONTH(DataPagamento) = MONTH(NOW())
                         AND DAY(DataPagamento) = DAY(NOW())`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DashboardRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        despesas: response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    getGoal(userId, req, res) {
        var script = `SELECT Nome
                           , CONCAT((ValorAtual / ValorObjetivo) * 100, '%') AS Porcentagem
                           , CASE WHEN DATE_FORMAT(DataLimite, "%d/%m/%Y") <= DATE_FORMAT(NOW(), "%d/%m/%Y") AND ValorAtual >= ValorObjetivo THEN 'Alcancado'
                                  WHEN DATE_FORMAT(DataLimite, "%d/%m/%Y") >= DATE_FORMAT(NOW(), "%d/%m/%Y") AND ValorAtual < ValorObjetivo THEN 'EmAndamento'
                                  WHEN DATE_FORMAT(DataLimite, "%d/%m/%Y") < DATE_FORMAT(NOW(), "%d/%m/%Y") AND ValorAtual < ValorObjetivo THEN 'NaoAlcancado'
                             END AS Status
                        FROM Objetivo
                       WHERE UsuarioId = ${userId}`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DashboardRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        objetivos: response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    getResume(userId, req, res) {
        var script = `SELECT FORMAT(IFNULL(SUM(IFNULL(Valor,0)),0),2,'pt_BR') AS TotalReceita
                        FROM Receita
                       WHERE UsuarioId = ${userId}
                         AND YEAR(DataRecebimento) = YEAR(NOW())
                         AND MONTH(DataRecebimento) = MONTH(NOW());
                           `;

        script += `SELECT FORMAT(IFNULL(SUM(IFNULL(Valor,0)),0),2,'pt_BR') AS TotalDespesa
                     FROM Despesa
                    WHERE UsuarioId = ${userId}
                      AND YEAR(DataPagamento) = YEAR(NOW())
                      AND MONTH(DataPagamento) = MONTH(NOW());
                      `;

        script += `SELECT FORMAT(IFNULL((SELECT IFNULL(SUM(IFNULL(Valor,0)),0) AS TotalReceita
                     FROM Receita
                    WHERE UsuarioId = ${userId}
                      AND YEAR(DataRecebimento) = YEAR(NOW())
                      AND MONTH(DataRecebimento) = MONTH(NOW())) - (SELECT IFNULL(SUM(IFNULL(Valor,0)),0) AS TotalDespesa
                                                     FROM Despesa
                                                    WHERE UsuarioId = ${userId}
                                                      AND YEAR(DataPagamento) = YEAR(NOW())
                                                      AND MONTH(DataPagamento) = MONTH(NOW())),0),2,'pt_BR') AS Saldo`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DashboardRepository.errorHandler(error, res);
                }
                else if (response[0].length > 0) {
                    var values = {
                        ReceitaValue: response[0][0] ? response[0][0].TotalReceita : '0,00',
                        DespesaValue: response[1][0] ? response[1][0].TotalDespesa : '0,00',
                        Saldo: response[2][0].Saldo
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

    getChartData(userId, req, res) {
        var script = `SET lc_time_names = 'pt_PT';
                      SELECT SUM(Valor) AS Valor
                           , MONTHNAME(DataRecebimento) AS Mes
                        FROM Receita
                       WHERE UsuarioId = ${userId}
                         AND YEAR(DataRecebimento) = YEAR(NOW())
                    GROUP BY YEAR(DataRecebimento)
                           , MONTH(DataRecebimento);`;

        script += `SELECT SUM(ParcelaValor) AS Valor
                        , MONTHNAME(DataPagamento) AS Mes
                     FROM Despesa
                    WHERE UsuarioId = ${userId}
                      AND YEAR(DataPagamento) = YEAR(NOW())
                 GROUP BY YEAR(DataPagamento)
                        , MONTH(DataPagamento);`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DashboardRepository.errorHandler(error, res);
                }
                else if (response[1].length > 0) {
                    var values = [{
                        'name': 'Receitas',
                        'series': DashboardRepository.getIncomeChartData(response[1])
                    }, {
                        'name': 'Despesas',
                        'series': DashboardRepository.getExpenseChartData(response[2])
                    }];

                    res.status(200).send({
                        success: true,
                        values: values
                    });
                }
                else {
                    res.status(200).send({
                        success: false,
                        error: error
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static getIncomeChartData(incomes) {
        var values = [];

        incomes.forEach(income => {

            values.push({
                "name": income.Mes,
                "value": income.Valor
            });
        });

        return values;
    }

    static getExpenseChartData(expenses) {
        var values = [];

        expenses.forEach(expense => {

            values.push({
                "name": expense.Mes,
                "value": expense.Valor
            });
        });

        return values;
    }

    static errorHandler(error, res) {
        res.status(500).send({
            error: error,
            message: error.sqlMessage
        });
    }
}

module.exports = DashboardRepository;
