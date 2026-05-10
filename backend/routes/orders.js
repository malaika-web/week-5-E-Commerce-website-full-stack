const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.post('/', createOrder);
router.get('/admin/all', admin, getAllOrders);
router.put('/admin/:id/status', admin, updateOrderStatus);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
