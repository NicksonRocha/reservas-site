const { DataTypes } = require('sequelize')

const sanitizeHtml = require('sanitize-html'); 

const User = require('./User')

const db = require('../db/conn')

const Business = db.define('Business', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O nome do negócio não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('name', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "A categoria do negócio não pode estar vazia." },
        },
        set(value) {
            this.setDataValue('category', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "O CNPJ já está cadastrado." },
        validate: {
            notEmpty: { msg: "O CNPJ não pode estar vazio." },
            isNumeric: { msg: "O CNPJ deve conter apenas números." },
            len: {
                args: [14, 14],
                msg: "O CNPJ deve ter exatamente 14 caracteres.",
            },
        },
        set(value) {
            this.setDataValue('cnpj', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true, 
        set(value) {
            if (value) {
                this.setDataValue('profile_image', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
            }
        },
    },
});

Business.belongsTo(User)
User.hasMany(Business)

module.exports = Business
