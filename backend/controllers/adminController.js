const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

exports.getAnalytics = async (req, res) => {
  const [users, products, orders, sales] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$totalPrice' } } },
    ]),
  ]);

  const lowStock = await Product.find({ stock: { $lte: 5 } }).select('title stock category price').limit(10);
  res.json({
    users,
    products,
    orders,
    revenue: sales[0]?.revenue || 0,
    lowStock,
  });
};
