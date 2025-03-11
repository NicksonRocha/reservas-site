const { DataTypes } = require('sequelize');
const User = require('./User');
const Business = require('./Business');
const db = require('../db/conn'); 

const Notification = db.define('Notification', {
  message: {
    type: DataTypes.STRING(200), 
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recipientType: {
    type: DataTypes.ENUM('user', 'business'), 
    allowNull: true,
  },
});

Notification.belongsTo(User, {
  foreignKey: 'userId', 
  allowNull: true,
});
User.hasMany(Notification, { foreignKey: 'userId' });

Notification.belongsTo(Business, {
  foreignKey: 'businessId',
  allowNull: true, 
});
Business.hasMany(Notification, { foreignKey: 'businessId' });

module.exports = Notification;
