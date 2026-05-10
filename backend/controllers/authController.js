const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const isStrongPassword = (password = '') => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  avatar: user.avatar,
  isEmailVerified: user.isEmailVerified,
  addresses: user.addresses || [],
});

exports.generateToken = generateToken;

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }
  if (!isStrongPassword(password)) {
    return res.status(400).json({ message: 'Password must be 8+ chars with uppercase, lowercase, number, and symbol' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashedPassword });

  res.status(201).json({
    user: sanitizeUser(user),
    token: generateToken(user._id),
  });
};

exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  user.rememberPreference = Boolean(rememberMe);
  await user.save();

  res.json({
    user: sanitizeUser(user),
    token: generateToken(user._id),
  });
};

exports.getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  res.json({ user: sanitizeUser(req.user) });
};

exports.updateProfile = async (req, res) => {
  const updates = ['name', 'phone', 'avatar'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });
  await req.user.save();
  res.json({ user: sanitizeUser(req.user) });
};

exports.addAddress = async (req, res) => {
  const { label, fullName, phone, line1, city, postalCode, country, isDefault } = req.body;
  if (!line1) return res.status(400).json({ message: 'Address line is required' });
  if (isDefault) req.user.addresses.forEach((address) => { address.isDefault = false; });
  req.user.addresses.push({ label, fullName, phone, line1, city, postalCode, country, isDefault: Boolean(isDefault) });
  await req.user.save();
  res.status(201).json({ addresses: req.user.addresses });
};

exports.deleteAddress = async (req, res) => {
  req.user.addresses = req.user.addresses.filter((address) => address._id.toString() !== req.params.addressId);
  await req.user.save();
  res.json({ addresses: req.user.addresses });
};

exports.verifyEmail = async (req, res) => {
  req.user.isEmailVerified = true;
  await req.user.save();
  res.json({ message: 'Email verified for demo workflow', user: sanitizeUser(req.user) });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  res.json({ message: 'Password reset instructions sent if the email exists' });
};

exports.oauthPlaceholder = async (req, res) => {
  res.status(501).json({ message: `${req.params.provider} OAuth requires provider credentials in production` });
};
