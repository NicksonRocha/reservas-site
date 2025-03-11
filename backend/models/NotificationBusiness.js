const { DataTypes } = require('sequelize');
const User = require('./User'); 
const Business = require('./Business'); 
const db = require('../db/conn'); 

const NotificationBusiness = db.define('NotificationBusiness', {
  message: {
    type: DataTypes.STRING(300), 
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

NotificationBusiness.belongsTo(User, {
  foreignKey: 'userId', 
  allowNull: true, 
});
User.hasMany(NotificationBusiness, { foreignKey: 'userId' });

NotificationBusiness.belongsTo(Business, {
  foreignKey: 'businessId', 
  allowNull: true, 
});
Business.hasMany(NotificationBusiness, { foreignKey: 'businessId' });

module.exports = NotificationBusiness;
