const express = require('express');
const router = express.Router();
const { createCheckoutSession, confirmCheckoutSession } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/confirm-checkout-session/:sessionId', protect, confirmCheckoutSession);

module.exports = router;
