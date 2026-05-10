const Stripe = require('stripe');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover',
  });
};

const getStripeImage = (image) => {
  try {
    const url = new URL(image);
    return ['http:', 'https:'].includes(url.protocol) ? [url.toString()] : [];
  } catch {
    return [];
  }
};

const getCartTotal = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('products.product');
  if (!cart || cart.products.length === 0) {
    return { cart: null, totalPrice: 0 };
  }

  const totalPrice = cart.products.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  return { cart, totalPrice };
};

exports.createCheckoutSession = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ message: 'Stripe secret key is not configured' });
  }

  const { cart, totalPrice } = await getCartTotal(req.user._id);
  if (!cart) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const amount = Math.round(totalPrice * 100);
  if (amount < 50) {
    return res.status(400).json({ message: 'Order total is too low for card payment' });
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const shippingAddress = String(req.body.shippingAddress || '').trim().slice(0, 500);
  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: req.user.email,
    line_items: cart.products.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.product.price * 100),
        product_data: {
          name: item.product.title,
          images: getStripeImage(item.product.image),
        },
      },
      quantity: item.quantity,
    })),
    success_url: `${clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/checkout`,
    metadata: {
      userId: req.user._id.toString(),
      cartId: cart._id.toString(),
      shippingAddress,
    },
  });

  res.json({ url: session.url });
};

exports.confirmCheckoutSession = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ message: 'Stripe secret key is not configured' });
  }

  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
  if (!session || session.metadata?.userId !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Checkout session not found' });
  }

  if (session.payment_status !== 'paid') {
    return res.status(400).json({ message: 'Payment is not complete yet' });
  }

  const existingOrder = await Order.findOne({ stripeSessionId: session.id });
  if (existingOrder) {
    return res.json(existingOrder);
  }

  const cart = await Cart.findOne({ userId: req.user._id }).populate('products.product');
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: 'Cart is empty or already processed' });
  }

  const products = cart.products.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));
  const totalPrice = products.reduce((sum, item) => sum + item.quantity * item.price, 0);

  if (Math.round(totalPrice * 100) !== session.amount_total) {
    return res.status(400).json({ message: 'Checkout total could not be verified' });
  }

  const order = await Order.create({
    userId: req.user._id,
    products,
    totalPrice,
    shippingAddress: session.metadata?.shippingAddress || '',
    stripeSessionId: session.id,
    paymentIntentId: session.payment_intent,
    paymentStatus: 'paid',
    status: 'processing',
  });

  cart.products = [];
  await cart.save();

  res.status(201).json(order);
};
