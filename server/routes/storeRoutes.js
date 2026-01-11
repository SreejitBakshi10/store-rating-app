const express = require('express');
const router = express.Router();
const {
    createStore,
    getAllStores,
    addRating,
    deleteRating,
    getAdminStats,
    getOwnerDashboard
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAllStores);
router.post('/', protect, authorize('admin'), createStore);
router.get('/admin-stats', protect, authorize('admin'), getAdminStats);
router.post('/:storeId/rate', protect, authorize('user'), addRating);
router.delete('/:storeId/rate', protect, authorize('user'), deleteRating);
router.get('/my-dashboard', protect, authorize('store_owner'), getOwnerDashboard);

module.exports = router;