# NovaCart Backend API

## Setup
1. Copy `.env.example` to `.env`
2. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `STRIPE_SECRET_KEY`
3. Run `npm install`
4. Seed data with `npm run seed`
5. Start backend with `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register` — register with `{ name, email, password }`
- `POST /api/auth/login` — login with `{ email, password }`
- `GET /api/auth/profile` — get current user profile (protected)

### Products
- `GET /api/products` — list products, optional query `search`, `category`
- `GET /api/products/:id` — get product details
- `POST /api/products` — create product (admin only)
- `PUT /api/products/:id` — update product (admin only)
- `DELETE /api/products/:id` — delete product (admin only)

### Cart
- `GET /api/cart` — get current user cart
- `POST /api/cart` — add product to cart with `{ productId, quantity }`
- `PUT /api/cart/:productId` — update quantity
- `DELETE /api/cart/:productId` — remove item

### Orders
- `POST /api/orders` — create paid order from cart with `{ shippingAddress, paymentIntentId }`
- `GET /api/orders` — get user orders
- `GET /api/orders/:id` — get specific order

### Payments
- `POST /api/payments/create-checkout-session` — create a Stripe Checkout Session from the authenticated user's cart with `{ shippingAddress }`
- `POST /api/payments/confirm-checkout-session/:sessionId` — verify the paid Stripe session, create the order, and clear the cart
