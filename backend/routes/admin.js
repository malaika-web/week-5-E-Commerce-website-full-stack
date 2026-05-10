const express = require('express');
const { getAnalytics, getUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, admin);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);

module.exports = router;
