const sql = require('../config/database.config'),
    ObjetivoController = require('../controllers/objetivo.controller'),
    Objetivo = require('../models/objetivo.model');

class ObjetivoRepository {

    constructor() { }

    getGoal(userId, start, limit, month, year, name, req, res) {
        var script = `SELECT O.ObjetivoId
                           , O.UsuarioId
                           , O.Nome
                           , FORMAT(IFNULL(O.ValorObjetivo,0),2,'pt_BR') AS ValorObjetivo
                           , FORMAT(IFNULL(O.ValorAtual,0),2,'pt_BR') AS ValorAtual
                           , DATE_FORMAT(O.DataLimite, "%d/%m/%Y") AS DataLimite
                           , DATE_FORMAT(O.DataObjetivo, "%d/%m/%Y") AS DataObjetivo
                           , CASE WHEN DATE_FORMAT(O.DataLimite, "%d/%m/%Y") <= DATE_FORMAT(NOW(), "%d/%m/%Y") AND O.ValorAtual >= O.ValorObjetivo THEN 'Alcancado'
                                  WHEN DATE_FORMAT(O.DataLimite, "%d/%m/%Y") >= DATE_FORMAT(NOW(), "%d/%m/%Y") AND O.ValorAtual < O.ValorObjetivo THEN 'EmAndamento'
                                  WHEN DATE_FORMAT(O.DataLimite, "%d/%m/%Y") < DATE_FORMAT(NOW(), "%d/%m/%Y") AND O.ValorAtual < O.ValorObjetivo THEN 'NaoAlcancado'
                             END AS Status
                           , CONCAT((O.ValorAtual / O.ValorObjetivo) * 100, '%') AS Porcentagem
                        FROM Objetivo O
                       WHERE O.UsuarioId = ${userId}
                         AND (CASE WHEN '${name}' <> '' THEN O.Nome LIKE '%${name}%' ELSE O.Nome <> '' END)
                         AND MONTH(O.DataObjetivo) = ${month}
                         AND YEAR(O.DataObjetivo) = ${year}
                       LIMIT ${start}, ${limit};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ObjetivoRepository.errorHandler(error, res);
                }
                else {
                    ObjetivoRepository.getTotalRows(userId, month, year, name, response, req, res);
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    static getTotalRows(userId, month, year, name, objetivos, req, res) {
        var script = `SELECT COUNT(1) AS TotalLinhas
                        FROM Objetivo O
                        WHERE O.UsuarioId = ${userId}
                          AND (CASE WHEN '${name}' <> '' THEN O.Nome LIKE '%${name}%' ELSE O.Nome <> '' END)
                          AND MONTH(O.DataObjetivo) = ${month}
                          AND YEAR(O.DataObjetivo) = ${year};`;

        try {
            sql.query(script, function (error, response) {
                if (error) {
                    ObjetivoRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        totalLinhas: response[0].TotalLinhas,
                        objetivos: objetivos
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    insertGoal(goal, req, res) {
        var script = `INSERT
                        INTO Objetivo (
                             UsuarioId
                           , Nome
                           , ValorObjetivo
                           , ValorAtual
                           , DataLimite
                           , DataObjetivo
                           )
                      VALUES (
                             ${goal.UsuarioId}
                           , '${goal.Nome}'
                           , ${goal.ValorObjetivo}
                           , ${goal.ValorAtual}
                           , '${goal.DataLimite}'
                           , '${goal.DataObjetivo}'
                            );`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ObjetivoRepository.errorHandler(error, res);
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

    updateGoal(goal, req, res) {
        var script = `UPDATE Objetivo
                         SET Nome = '${goal.Nome}'
                           , ValorObjetivo = ${this.parseFloatString(goal.ValorObjetivo)}
                           , ValorAtual = ${this.parseFloatString(goal.ValorAtual)}
                           , DataLimite = '${goal.DataLimite}'
                      WHERE ObjetivoId = ${goal.ObjetivoId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ObjetivoRepository.errorHandler(error, res);
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

    deleteGoal(objetivoId, req, res) {
        var script = `DELETE
                        FROM Objetivo
                       WHERE ObjetivoId = ${objetivoId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ObjetivoRepository.errorHandler(error, res);
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

    addAmount(goalId, amount, req, res) {
        var script = `UPDATE Objetivo
                         SET ValorAtual(ValorAtual + ${amount})
                       WHERE ObjetivoId = ${goalId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ObjetivoRepository.errorHandler(error, res);
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

    parseFloatString(number) {
        return parseFloat(number.toString().replace(',', '.'))
    }

    static errorHandler(error, res) {
        res.status(500).send({
            error: error,
            message: error.sqlMessage
        });
    }
}

module.exports = ObjetivoRepository;