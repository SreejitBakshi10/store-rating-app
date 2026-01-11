const express = require('express');
const cors = require('cors');
const { syncDB } = require('./models');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

syncDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});