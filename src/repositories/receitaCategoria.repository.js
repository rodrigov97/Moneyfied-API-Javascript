const sql = require('../config/database.config'),
    ReceitaCategoria = require('../models/receitaCategoria.model');

class ReceitaCategoriaRepository {

    constructor() { }

    getIncomeCategories(userId, req, res) {
        var script = `SELECT CategoriaReceitaId
                           , Nome AS value
                        FROM CategoriaReceita
                       WHERE UsuarioId = ${userId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaCategoriaRepository.errorHandler(error, res);
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

    insertIncomeCategory(category, req, res) {
        var script = `INSERT
                        INTO CategoriaReceita (
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
                    ReceitaCategoriaRepository.errorHandler(error, res);
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

    updateIncomeCategory(category, req, res) {
        var script = `UPDATE CategoriaReceita 
                         SET Nome = '${category.Nome}'
                       WHERE CategoriaReceitaId = ${category.CategoriaReceitaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaCategoriaRepository.errorHandler(error, res);
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

    deleteIncomeCategory(categoriaId, req, res) {
        var script = `DELETE
                        FROM CategoriaReceita
                       WHERE CategoriaReceitaId = ${categoriaId};`;

        try {
            sql.query(script, function (error, response) {

                if (error) {
                    ReceitaCategoriaRepository.errorHandler(error, res);
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

module.exports = ReceitaCategoriaRepository;