const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const favoriteRoutes = require('./routes/favorites');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/uploads');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// require('./config/passport');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NovaCart backend running on port ${PORT}`);
});
