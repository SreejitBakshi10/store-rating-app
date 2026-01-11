const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

exports.createStore = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        const newStore = await Store.create({ name, email, address });

        res.status(201).json(newStore);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllStores = async (req, res) => {
    try {
        const { sort, name, address } = req.query;
        let whereClause = {};

        if (name) whereClause.name = { [Op.like]: `%${name}%` };
        if (address) whereClause.address = { [Op.like]: `%${address}%` };

        let order = [['createdAt', 'DESC']];
        if (sort) {
            const [field, direction] = sort.split(':');
            order = [[field, direction.toUpperCase()]];
        }

        const stores = await Store.findAll({
            where: whereClause,
            order: order,
            include: [
                {
                    model: Rating,
                    required: false,
                    where: { userId: req.user.id },
                    attributes: ['score']
                }
            ]
        });

        const formattedStores = stores.map(store => {
            const storeJson = store.toJSON();
            storeJson.myRating = storeJson.Ratings.length > 0 ? storeJson.Ratings[0].score : null;
            delete storeJson.Ratings;
            return storeJson;
        });

        res.json(formattedStores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addRating = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { score } = req.body;
        const userId = req.user.id;

        if (score < 1 || score > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        let rating = await Rating.findOne({ where: { storeId, userId } });

        if (rating) {
            rating.score = score;
            await rating.save();
        } else {
            await Rating.create({ storeId, userId, score });
        }

        const aggData = await Rating.findOne({
            where: { storeId },
            attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgRating']],
            raw: true
        });

        const newAvg = parseFloat(aggData.avgRating).toFixed(1);

        await Store.update({ averageRating: newAvg }, { where: { id: storeId } });

        res.json({ message: "Rating submitted", averageRating: newAvg });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();

        res.json({ totalUsers, totalStores, totalRatings });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getOwnerDashboard = async (req, res) => {
    try {
        console.log("Fetching dashboard for User ID:", req.user.id);

        const user = await User.findByPk(req.user.id);

        if (!user) {
            console.log("User not found in DB");
            return res.status(404).json({ message: "User account not found." });
        }

        console.log("User found:", user.email);

        const store = await Store.findOne({
            where: { email: user.email },
            include: [{
                model: Rating,
                include: [{ model: User, attributes: ['name', 'email'] }]
            }]
        });

        if (!store) {
            console.log("Store not found for email:", user.email);
            return res.status(404).json({ message: "No store found linked to your email address." });
        }

        res.json({
            storeName: store.name,
            averageRating: store.averageRating,
            ratings: store.Ratings
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteRating = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user.id;

        const rating = await Rating.findOne({ where: { storeId, userId } });

        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        }

        await rating.destroy();

        const aggData = await Rating.findOne({
            where: { storeId },
            attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgRating']],
            raw: true
        });

        const newAvg = aggData && aggData.avgRating ? parseFloat(aggData.avgRating).toFixed(1) : 0;

        await Store.update({ averageRating: newAvg }, { where: { id: storeId } });

        res.json({ message: "Rating removed", averageRating: newAvg });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};