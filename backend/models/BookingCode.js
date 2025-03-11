const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const BookingCode = db.define('BookingCode', {
  encryptedId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  qrCodeImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = BookingCode;
