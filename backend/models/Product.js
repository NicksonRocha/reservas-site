const { DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html');
const Business = require('./Business');
const Album = require('./Album');
const db = require('../db/conn');

const Product = db.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O título não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('title', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            this.setDataValue('description', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "O preço deve ser um número válido." },
            min: { args: [0], msg: "O preço deve ser maior ou igual a 0." },
        },
    },
    pricePromotion: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            isDecimal: { msg: "O preço promocional deve ser um número válido." },
            min: { args: [0], msg: "O preço promocional deve ser maior ou igual a 0." },
        },
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('category', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    promotion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { msg: "A duração deve ser um número inteiro." },
        },
    },
    productImageId: {  
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'ProductImages', 
            key: 'id',
        },
    },
    AlbumId: {  
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Albums',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
});

Product.addHook('beforeCreate', (product) => {
    Object.keys(product.dataValues).forEach((key) => {
        if (typeof product[key] === 'string') {
            product[key] = sanitizeHtml(product[key], { allowedTags: [], allowedAttributes: {} });
        }
    });
});

Product.addHook('beforeUpdate', (product) => {
    Object.keys(product.dataValues).forEach((key) => {
        if (typeof product[key] === 'string') {
            product[key] = sanitizeHtml(product[key], { allowedTags: [], allowedAttributes: {} });
        }
    });
});

Product.belongsTo(Album, { foreignKey: 'AlbumId' });
Album.hasMany(Product, { foreignKey: 'AlbumId' });

Product.belongsTo(Business);
Business.hasMany(Product);

module.exports = Product;

