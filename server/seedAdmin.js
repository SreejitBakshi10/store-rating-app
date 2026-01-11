const { User, syncDB } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await syncDB();

        const name = "System Administrator (Main)";
        const email = "admin@store.com";
        const password = "AdminPassword1!";

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            console.log("Admin already exists.");
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name,
            email,
            password: hashedPassword,
            address: "Headquarters Address, City, Country",
            role: "admin"
        });

        console.log("Admin created successfully!");
        console.log("Login with:", email, " | ", password);
        process.exit();

    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

createAdmin();