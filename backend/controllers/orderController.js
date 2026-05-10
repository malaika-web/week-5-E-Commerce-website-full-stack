const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Stripe = require('stripe');

exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentIntentId, paymentMethod = 'stripe' } = req.body;
  if (paymentMethod !== 'cod' && !paymentIntentId) {
    return res.status(400).json({ message: 'Payment confirmation is required' });
  }
  if (paymentMethod !== 'cod' && !process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ message: 'Stripe secret key is not configured' });
  }
  const stripe = paymentMethod === 'cod' ? null : Stripe(process.env.STRIPE_SECRET_KEY);

  const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const products = cart.products.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const totalPrice = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const expectedAmount = Math.round(totalPrice * 100);

  if (paymentMethod !== 'cod') {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (
      paymentIntent.status !== 'succeeded' ||
      paymentIntent.amount !== expectedAmount ||
      paymentIntent.metadata.userId !== req.user._id.toString()
    ) {
      return res.status(400).json({ message: 'Payment could not be verified' });
    }
  }

  if (paymentIntentId) {
    const existingOrder = await Order.findOne({ paymentIntentId });
    if (existingOrder) {
      return res.status(409).json({ message: 'Order already exists for this payment' });
    }
  }

  const order = await Order.create({
    userId: req.user._id,
    products,
    totalPrice,
    shippingAddress,
    paymentIntentId: paymentIntentId || '',
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
    status: paymentMethod === 'cod' ? 'pending' : 'processing',
  });
  cart.products = [];
  await cart.save();

  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate('products.product');
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('userId', 'name email').populate('products.product').sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.body.status) order.status = req.body.status;
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;
  await order.save();
  res.json(order);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('products.product');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (!order.userId.equals(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this order' });
  }
  res.json(order);
};
