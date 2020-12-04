const sql = require('../config/database.config'),
    DespesaCategoria = require('../models/despesaCategoria.model');

class DespesaCategoriaRepository {

    constructor() { }

    getExpenseCategories(userId, req, res) {
        var script = `SELECT CategoriaDespesaId
                           , Nome AS value
                        FROM CategoriaDespesa
                       WHERE UsuarioId = ${userId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaCategoriaRepository.errorHandler(error, res);
                }
                else {
                    res.status(200).send({
                        success: true,
                        categories: response
                    });
                }
            });
        }
        catch (err) {
            res.status(500).send({ error: err, message: err.message });
        }
    }

    insertExpenseCategory(category, req, res) {
        var script = `INSERT
                        INTO CategoriaDespesa (
                             UsuarioId
                           , Nome
                           )
                      VALUES (
                             ${category.UsuarioId}
                           , '${category.Nome}'
                            );`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaCategoriaRepository.errorHandler(error, res);
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

    updateExpenseCategory(category, req, res) {
        var script = `UPDATE CategoriaDespesa 
                         SET Nome = '${category.Nome}'
                       WHERE CategoriaDespesaId = ${category.CategoriaDespesaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaCategoriaRepository.errorHandler(error, res);
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

    deleteExpenseCategory(categoriaId, req, res) {
        var script = `DELETE
                        FROM CategoriaDespesa
                       WHERE CategoriaDespesaId = ${categoriaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    DespesaCategoriaRepository.errorHandler(error, res);
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

module.exports = DespesaCategoriaRepository;
