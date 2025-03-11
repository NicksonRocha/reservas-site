

const { DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html'); 
const Product = require('./Product'); 
const db = require('../db/conn');

const OptionsTour = db.define('OptionsTour', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O nome do passeio não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('name', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    startHour: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: { msg: "O horário inicial não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('startHour', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    endHour: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: { msg: "O horário final não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('endHour', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    capacity: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        defaultValue: 1,
        validate: {
            isInt: { msg: "A capacidade deve ser um número inteiro." },
            min: { args: 1, msg: "A capacidade deve ser pelo menos 1." },
        },
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "O preço deve ser um número decimal válido." },
            min: { args: 0, msg: "O preço deve ser maior ou igual a 0." },
        },
    },
    date: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
            isDate: { msg: "A data deve ser uma data válida no formato 'YYYY-MM-DD'." },
        },
    },
    productId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products', 
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

OptionsTour.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OptionsTour, { foreignKey: 'productId' });

module.exports = OptionsTour;
