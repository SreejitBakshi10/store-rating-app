const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

const syncDB = async () => {
    try {
        await sequelize.sync({ force: false }); 
        console.log("Tables synced successfully.");
    } catch (error) {
        console.error("Error syncing tables:", error);
    }
};

module.exports = { User, Store, Rating, syncDB };