

const { DataTypes } = require('sequelize'); 
const sanitizeHtml = require('sanitize-html'); 
const db = require('../db/conn');
const User = require('./User');
const OptionsTour = require('./OptionsTour');
const Product = require('./Product');
const Business = require('./Business');
const BookingCode = require('./BookingCode');

const Booking = db.define('Booking', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ownerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O nome do proprietário não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('ownerName', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue('cpf', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
            }
        },
    },
    passportNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue('passportNumber', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
            }
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue('phone', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
            }
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: { msg: "O e-mail deve ser válido." },
        },
        set(value) {
            this.setDataValue('email', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: { msg: "A data de nascimento deve ser válida." },
        },
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
            if (value) {
                this.setDataValue('state', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
            }
        },
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O país não pode estar vazio." },
        },
        set(value) {
            this.setDataValue('country', sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
        },
    },
    ticketConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    optionTourId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OptionsTour,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Business,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});


Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(OptionsTour, { foreignKey: 'optionTourId', as: 'optionTour' });
Booking.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Booking.belongsTo(Business, { foreignKey: 'businessId', as: 'business' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
OptionsTour.hasMany(Booking, { foreignKey: 'optionTourId', as: 'bookings' });
Product.hasMany(Booking, { foreignKey: 'productId', as: 'bookings' });
Business.hasMany(Booking, { foreignKey: 'businessId', as: 'bookings' });

Booking.hasOne(BookingCode, { foreignKey: 'bookingId', as: 'bookingCode' });
BookingCode.belongsTo(Booking, { foreignKey: 'bookingId', as: 'bookingCode' });

module.exports = Booking;
