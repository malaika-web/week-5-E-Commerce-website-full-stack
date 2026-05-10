const Cart = require('../models/Cart');
const Product = require('../models/Product');

const ensureCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, products: [] });
  }
  return cart;
};

exports.getCart = async (req, res) => {
  const cart = await ensureCart(req.user._id);
  await cart.populate('products.product');
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const cart = await ensureCart(req.user._id);
  const item = cart.products.find((item) => item.product.equals(productId));

  if (item) {
    item.quantity = Math.min(item.quantity + Math.max(1, quantity || 1), product.stock);
  } else {
    cart.products.push({ product: productId, quantity: Math.max(1, quantity || 1) });
  }

  await cart.save();
  await cart.populate('products.product');
  res.json(cart);
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await ensureCart(req.user._id);
  const item = cart.products.find((item) => item.product.equals(req.params.productId));

  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  item.quantity = Math.max(1, quantity);
  await cart.save();
  await cart.populate('products.product');
  res.json(cart);
};

exports.removeCartItem = async (req, res) => {
  const cart = await ensureCart(req.user._id);
  cart.products = cart.products.filter((item) => !item.product.equals(req.params.productId));
  await cart.save();
  await cart.populate('products.product');
  res.json(cart);
};
