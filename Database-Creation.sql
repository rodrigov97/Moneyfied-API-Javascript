CREATE DATABASE moneyfied;

USE moneyfied;

SET lc_time_names = 'pt_PT';

CREATE TABLE StatusUsuario (
	         StatusUsuarioId	INT NOT NULL AUTO_INCREMENT
	       , Nome 				VARCHAR(100) NOT NULL
           , PRIMARY KEY (StatusUsuarioId)
);

INSERT INTO StatusUsuario (Nome) VALUES ('Ativo'), ('Desativado');

CREATE TABLE Usuario (
	         UsuarioId 			INT NOT NULL AUTO_INCREMENT
	       , Nome 				VARCHAR(100) NOT NULL
	       , Email 				VARCHAR(50)	NOT NULL
           , Senha				VARCHAR(100) NOT NULL
           , StatusUsuarioId	INT NOT NULL
           , ImagemPerfil		VARCHAR(150) NULL
           , EmailConfirmado	BIT NULL DEFAULT FALSE
           , PRIMARY KEY (UsuarioId)
           , CONSTRAINT FK_StatusUsuarioId FOREIGN KEY (StatusUsuarioId) REFERENCES moneyfied.StatusUsuario(StatusUsuarioId)
);

CREATE TABLE CategoriaDespesa (
	         CategoriaDespesaId 	INT NOT NULL AUTO_INCREMENT
		   , UsuarioId				INT NOT NULL
	       , Nome 					VARCHAR(100) NOT NULL
           , PRIMARY KEY (CategoriaDespesaId)
           , CONSTRAINT FK_DespesaCategoriaUsuarioId FOREIGN KEY (UsuarioId) REFERENCES moneyfied.Usuario(UsuarioId)
);

CREATE TABLE CategoriaReceita (
	         CategoriaReceitaId 	INT NOT NULL AUTO_INCREMENT
		   , UsuarioId				INT NOT NULL
	       , Nome 					VARCHAR(100) NOT NULL
           , PRIMARY KEY (CategoriaReceitaId)
           , CONSTRAINT FK_ReceitaCategoriaUsuarioId FOREIGN KEY (UsuarioId) REFERENCES moneyfied.Usuario(UsuarioId)
);

CREATE TABLE Receita (
	         ReceitaId 				INT NOT NULL AUTO_INCREMENT
		   , UsuarioId				INT NOT NULL
           , CategoriaReceitaId		INT NULL
	       , Descricao 				VARCHAR(100) NOT NULL
	       , Valor 					DOUBLE DEFAULT 0.00
           , DataRecebimento		DATETIME NOT NULL
           , PRIMARY KEY (ReceitaId)
           , CONSTRAINT FK_ReceitaUsuarioId FOREIGN KEY (UsuarioId) REFERENCES moneyfied.Usuario(UsuarioId)
           , CONSTRAINT FK_CategoriaReceitaId FOREIGN KEY (CategoriaReceitaId) REFERENCES moneyfied.CategoriaReceita(CategoriaReceitaId)
);

CREATE TABLE Despesa (
	         DespesaId 				INT NOT NULL AUTO_INCREMENT
		   , UsuarioId				INT NOT NULL
           , CategoriaDespesaId 	INT NULL
	       , Descricao 				VARCHAR(100) NOT NULL
	       , Valor 					DOUBLE NULL
           , Parcelado				BIT NOT NULL
           , ParcelaQtd				DOUBLE NULL
           , ParcelaNumero			DOUBLE NULL
           , ParcelaValor			DOUBLE NULL
           , DataInicial			DATETIME NULL
           , DataFinal				DATETIME NULL
           , DataPagamento			DATETIME NOT NULL
           , PRIMARY KEY (DespesaId)
           , CONSTRAINT FK_DespesaUsuarioId FOREIGN KEY (UsuarioId) REFERENCES moneyfied.Usuario(UsuarioId)
           , CONSTRAINT FK_CategoriaDespesaId FOREIGN KEY (CategoriaDespesaId) REFERENCES moneyfied.CategoriaDespesa(CategoriaDespesaId)
);

CREATE TABLE Objetivo (
	         ObjetivoId 		INT NOT NULL AUTO_INCREMENT
		   , UsuarioId			INT NOT NULL
	       , Nome 				VARCHAR(100) NOT NULL
	       , ValorObjetivo 		DOUBLE NULL
           , ValorAtual		    DOUBLE NOT NULL
           , DataLimite			DATETIME NULL
           , DataObjetivo		DATETIME NOT NULL
           , Atingido			BIT DEFAULT FALSE
           , PRIMARY KEY (ObjetivoId)
           , CONSTRAINT FK_ObjetivoUsuarioId FOREIGN KEY (UsuarioId) REFERENCES moneyfied.Usuario(UsuarioId)
);