const express = require('express');
const router = express.Router();
const { getUsers, addUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('admin'), getUsers)
    .post(protect, authorize('admin'), addUser);

module.exports = router;