# 🔮 Wishstone Backend API

Production-ready Node.js/Express backend for the Wishstone e-commerce platform.

## ✨ Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations with image/video uploads
- **Shopping Cart & Wishlist**: User-specific cart and wishlist management
- **Order Processing**: Complete order lifecycle with tracking
- **Coupon System**: Flexible discount coupons with validation
- **Admin Panel**: Comprehensive admin dashboard with analytics
- **User Management**: Profile management, order history, password changes

## 🔒 Security Features

- **Helmet.js**: Security headers protection
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for specific domains
- **XSS Protection**: Input sanitization
- **NoSQL Injection Protection**: MongoDB query sanitization
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Production

```bash
# Install dependencies
npm install --production

# Validate environment
npm run validate

# Start production server
npm run start:prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

## 📁 Project Structure

```
wishstone-backend/
├── config/
│   └── validateEnv.js       # Environment validation
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── logger.js            # Request logging
│   ├── security.js          # Security & rate limiting
│   └── upload.js            # File upload handling
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Order.js             # Order model
│   ├── Cart.js              # Cart model
│   ├── Wishlist.js          # Wishlist model
│   ├── Category.js          # Category model
│   └── Coupon.js            # Coupon model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   ├── orders.js            # Order routes
│   ├── cart.js              # Cart routes
│   ├── wishlist.js          # Wishlist routes
│   ├── categories.js        # Category routes
│   ├── coupons.js           # Coupon routes
│   └── admin.js             # Admin routes
├── uploads/                 # File uploads directory
├── logs/                    # Application logs
├── server.js                # Main application file
├── ecosystem.config.js      # PM2 configuration
└── package.json             # Dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Coupons
- `GET /api/coupons` - Get all coupons (admin)
- `POST /api/coupons` - Create coupon (admin)
- `POST /api/coupons/apply` - Apply coupon
- `DELETE /api/coupons/:id` - Delete coupon (admin)

### Admin
- `GET /api/admin/analytics` - Dashboard analytics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/toggle` - Block/activate user

### Health
- `GET /health` - Health check endpoint

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

Required:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (32+ chars in production)
- `FRONTEND_URL` - Frontend domain for CORS
- `ADMIN_URL` - Admin panel domain for CORS (optional)

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5000/health
```

### Logs
Development: Console output
Production: PM2 logs or custom logging service

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Validate environment
npm run validate
```

## 📦 Dependencies

### Core
- express - Web framework
- mongoose - MongoDB ODM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing

### Security
- helmet - Security headers
- cors - CORS middleware
- express-rate-limit - Rate limiting
- express-mongo-sanitize - NoSQL injection protection
- xss-clean - XSS protection

### Utilities
- multer - File uploads
- compression - Response compression
- morgan - HTTP request logger
- dotenv - Environment variables

## 🤝 Contributing

1. Follow existing code style
2. Add proper error handling
3. Update documentation
4. Test thoroughly before committing

## 📄 License

Private - Wishstone E-commerce Platform

## 🆘 Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For API documentation, see endpoint comments in route files.

---

**Built with ❤️ for Wishstone**
