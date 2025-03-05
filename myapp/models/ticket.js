const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    topic: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { 
        type: DataTypes.ENUM('Новое', 'В работе', 'Завершено', 'Отменено'), 
        defaultValue: 'Новое' 
    },
    resolution: { type: DataTypes.TEXT, allowNull: true },
    cancelReason: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: sequelize.NOW }
});

module.exports = Ticket;
