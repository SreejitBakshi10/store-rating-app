const { User, Store } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

exports.getUsers = async (req, res) => {
    try {
        const { role, name, email, sort } = req.query;
        let whereClause = {};

        if (role) whereClause.role = role;
        if (name) whereClause.name = { [Op.like]: `%${name}%` };
        if (email) whereClause.email = { [Op.like]: `%${email}%` };

        let order = [['createdAt', 'DESC']];
        if (sort) {
            const [field, direction] = sort.split(':');
            order = [[field, direction.toUpperCase()]];
        }

        const users = await User.findAll({
            where: whereClause,
            order: order,
            attributes: { exclude: ['password'] }
        });

        const usersWithRatings = await Promise.all(users.map(async (u) => {
            const userJson = u.toJSON();
            if (u.role === 'store_owner') {
                const store = await Store.findOne({ where: { email: u.email } });
                userJson.ownerRating = store ? store.averageRating : 'N/A';
            } else {
                userJson.ownerRating = '-';
            }
            return userJson;
        }));

        res.json(usersWithRatings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role: role || 'user'
        });

        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: "Server Error" });
    }
};