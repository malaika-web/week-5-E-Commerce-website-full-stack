const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  verifyEmail,
  forgotPassword,
  oauthPlaceholder,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/oauth/:provider', oauthPlaceholder);

// OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  const token = require('../controllers/authController').generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  const token = require('../controllers/authController').generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
});

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/verify-email', protect, verifyEmail);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

module.exports = router;
