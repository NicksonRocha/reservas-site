

const { DataTypes } = require('sequelize');
const sanitizeHtml = require('sanitize-html'); 
const db = require('../db/conn');

const ProductImage = db.define('ProductImage', {
    title_one: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue(
                    'title_one',
                    sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
                );
            }
        },
    },
    title_two: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue(
                    'title_two',
                    sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
                );
            }
        },
    },
    title_three: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue(
                    'title_three',
                    sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
                );
            }
        },
    },
    title_four: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue(
                    'title_four',
                    sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
                );
            }
        },
    },
    title_five: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue(
                    'title_five',
                    sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
                );
            }
        },
    },
    title_six: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue(
                    'title_six',
                    sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
                );
            }
        },
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'id',
        },
        allowNull: false,
    },
});

ProductImage.belongsTo(db.models.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
db.models.Product.hasMany(ProductImage, { foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = ProductImage;
