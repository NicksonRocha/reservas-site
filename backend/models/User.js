

const { DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html'); // Importação para sanitizar entradas
const db = require('../db/conn');

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O nome não pode estar vazio." },
        },
        set(value) {
            this.setDataValue(
                'name',
                sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
            );
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: "O e-mail deve ser válido." },
            notEmpty: { msg: "O e-mail não pode estar vazio." },
        },
        set(value) {
            this.setDataValue(
                'email',
                sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
            );
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "A senha não pode estar vazia." },
        },
        set(value) {            
            this.setDataValue(
                'password',
                sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
            );
        },
    },
});

module.exports = User;
