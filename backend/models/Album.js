
const { DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html'); 
const Business = require('./Business');
const db = require('../db/conn');

const Album = db.define('Album', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
            notEmpty: { msg: "O nome do álbum não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('name', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        defaultValue: 0,  
        validate: {
            isInt: { msg: "A ordem deve ser um número inteiro válido." },
            min: { args: [0], msg: "A ordem deve ser maior ou igual a 0." },
        },
    },
});

Album.addHook('beforeCreate', (album) => {
    if (typeof album.name === 'string') {
        album.name = sanitizeHtml(album.name, { allowedTags: [], allowedAttributes: {} });
    }
});

Album.addHook('beforeUpdate', (album) => {
    if (typeof album.name === 'string') {
        album.name = sanitizeHtml(album.name, { allowedTags: [], allowedAttributes: {} });
    }
});

Album.belongsTo(Business, { foreignKey: 'BusinessId' });
Business.hasMany(Album, { foreignKey: 'BusinessId' });

module.exports = Album;
