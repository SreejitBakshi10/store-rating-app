const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [0, 400] }
    },
    averageRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
});

module.exports = Store;