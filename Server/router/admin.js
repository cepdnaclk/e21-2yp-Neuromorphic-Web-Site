const express = require('express');
const {
    getDashboardStats,
    getUsers,
    updateUser,
    deleteUser,
    getSystemSettings,
    updateSystemSettings
} = require('../controller/admin');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('Admin'));

router
    .route('/dashboard')
    .get(getDashboardStats);

router
    .route('/users')
    .get(getUsers);

router
    .route('/users/:id')
    .put(updateUser);

router
    .route('/users/:id')
    .delete(deleteUser);

router
    .route('/settings')
    .get(getSystemSettings)
    .put(updateSystemSettings);



module.exports = router;