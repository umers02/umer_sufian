# Ecommerce Backend API

A complete NestJS-based ecommerce backend with MongoDB, featuring user authentication, product management, cart functionality, order processing, loyalty points system, sales management, and real-time notifications.

## Features

### Core Ecommerce Features
- ✅ Product Listings & Details with images, description, price, and stock
- ✅ Shopping Cart (Add/Remove items, quantity management)
- ✅ User Authentication (Register, Login, JWT-based)
- ✅ Order Management & History
- ✅ Checkout Process

### Loyalty Points System
- ✅ Users earn points on every purchase (10% of purchase amount)
- ✅ Products can be loyalty-only (buyable with points only)
- ✅ Hybrid products (buyable with either money or points)
- ✅ User loyalty points tracking in profile

### Sale System
- ✅ Products can go on sale with discount percentages
- ✅ Automatic price calculation for discounted products
- ✅ Sale management (start/end dates)

### Real-time Notifications
- ✅ WebSocket-based real-time notifications
- ✅ Sale start notifications to all users
- ✅ Order confirmation notifications
- ✅ Points earned notifications

### Role-Based Access Control (RBAC)
- ✅ **User**: Browse products, manage cart, place orders, earn/spend points
- ✅ **Admin**: Manage products, create sales, view orders, dashboard access
- ✅ **Super Admin**: Full control including admin management

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Real-time**: Socket.IO
- **Validation**: class-validator
- **Password Hashing**: bcryptjs

## Installation & Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=3000

# Cloudinary Configuration (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. **Start MongoDB**:
Make sure MongoDB is running on your system.

4. **Run the application**:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### Users
```
GET    /api/users/profile     - Get current user profile
PATCH  /api/users/profile     - Update current user profile
GET    /api/users             - Get all users (Admin only)
GET    /api/users/:id         - Get user by ID (Admin only)
PATCH  /api/users/:id         - Update user (Admin only)
DELETE /api/users/:id         - Delete user (Super Admin only)
```

### Products
```
GET    /api/products          - Get all products (with filters)
GET    /api/products/search   - Search products
GET    /api/products/:id      - Get product by ID
POST   /api/products          - Create product with images (Admin only)
PATCH  /api/products/:id      - Update product with images (Admin only)
DELETE /api/products/:id      - Delete product (Admin only)
POST   /api/products/upload-images - Upload multiple images (Admin only)
```

### Cart
```
GET    /api/cart              - Get user's cart
POST   /api/cart/add          - Add item to cart
PATCH  /api/cart/:productId   - Update item quantity
DELETE /api/cart/:productId   - Remove item from cart
DELETE /api/cart              - Clear cart
```

### Orders
```
POST   /api/orders            - Create new order
GET    /api/orders/my-orders  - Get current user's orders
GET    /api/orders            - Get all orders (Admin only)
GET    /api/orders/:id        - Get order by ID
PATCH  /api/orders/:id/status - Update order status (Admin only)
```

### Sales
```
GET    /api/sales             - Get all sales
GET    /api/sales/active      - Get active sales
GET    /api/sales/:id         - Get sale by ID
POST   /api/sales             - Create sale (Admin only)
PATCH  /api/sales/:id         - Update sale (Admin only)
DELETE /api/sales/:id         - Delete sale (Admin only)
```

### Admin
```
GET    /api/admin/dashboard   - Get admin dashboard stats
```

### Super Admin
```
GET    /api/super-admin/admins        - Get all admins
POST   /api/super-admin/promote/:id   - Promote user to admin
POST   /api/super-admin/demote/:id    - Demote admin to user
```

## Request/Response Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Add Product with Images (Admin)
```javascript
// Using FormData for file upload
const formData = new FormData();
formData.append('name', 'iPhone 14');
formData.append('description', 'Latest iPhone model');
formData.append('price', '999');
formData.append('stock', '50');
formData.append('type', 'hybrid');
formData.append('pointsPrice', '99900');
formData.append('category', 'Electronics');
// Add multiple images
formData.append('images', file1);
formData.append('images', file2);

POST /api/products
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
Body: formData
```

### Upload Images Only
```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);

POST /api/products/upload-images
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
Body: formData
```

### Add to Cart
```json
POST /api/cart/add
Authorization: Bearer <jwt_token>
{
  "productId": "64a1b2c3d4e5f6789012345",
  "quantity": 2,
  "usePoints": false
}
```

### Create Order
```json
POST /api/orders
Authorization: Bearer <jwt_token>
{
  "shippingAddress": "123 Main St, City, Country",
  "paymentMethod": "card"
}
```

### Create Sale (Admin)
```json
POST /api/sales
Authorization: Bearer <jwt_token>
{
  "name": "Black Friday Sale",
  "description": "Huge discounts on electronics",
  "discountPercentage": 25,
  "startDate": "2024-11-29T00:00:00Z",
  "endDate": "2024-11-30T23:59:59Z",
  "products": ["64a1b2c3d4e5f6789012345", "64a1b2c3d4e5f6789012346"]
}
```

## WebSocket Events

Connect to WebSocket at `ws://localhost:3000`

### Events:
- `notification` - Receives real-time notifications
  - Sale started notifications
  - Order confirmations
  - Points earned notifications

## Database Schema

### User
- name, email, password (hashed)
- role (user/admin/super_admin)
- loyaltyPoints
- isActive

### Product
- name, description, price, salePrice
- stock, images, category
- type (regular/loyalty_only/hybrid)
- pointsPrice, isOnSale, isActive

### Cart
- user (reference)
- items (array of products with quantity, price, usePoints)
- totalAmount, totalPoints

### Order
- user (reference)
- items (array with product details)
- totalAmount, pointsUsed, pointsEarned
- status, shippingAddress, paymentMethod

### Sale
- name, description, discountPercentage
- startDate, endDate
- products (array of references)
- isActive

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build
```

## Default Admin Account

After starting the application, you can create a super admin account by registering normally and then manually updating the role in the database:

```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "super_admin" } }
)
```

## License

This project is licensed under the MIT License.