# Tea E-commerce Backend API

A complete backend API for a tea e-commerce platform with role-based authentication, product management, cart functionality, and order processing.

## Features

- **Authentication & Authorization**: JWT-based auth with role management (superadmin, admin, user)
- **Product Management**: CRUD operations with variants, categories, and advanced filtering
- **Cart System**: Real-time cart management with stock validation
- **Order Processing**: Complete order workflow with inventory management
- **Admin Dashboard**: Analytics, user management, and inventory reports
- **Stock Management**: Automatic stock updates and low-stock alerts

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: Express Validator
- **Password Hashing**: bcrypt

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with required variables (see .env.example)
4. Start the server:
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products with filtering & pagination
- `GET /api/products/:id` - Get single product with variants
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories` - Get categories
- `POST /api/products/categories` - Create category (Admin)

### Variants
- `GET /api/variants/product/:productId` - Get variants by product
- `GET /api/variants/:id` - Get single variant
- `GET /api/variants/:id/stock` - Check variant stock
- `POST /api/variants/product/:productId` - Create variant (Admin)
- `PUT /api/variants/:id` - Update variant (Admin)
- `DELETE /api/variants/:id` - Delete variant (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:itemId` - Update cart item quantity
- `DELETE /api/cart/item/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/admin/:id/status` - Update order status (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/inventory` - Inventory report
- `GET /api/admin/users` - Get users (Superadmin)
- `PUT /api/admin/users/:userId/block` - Block user (Superadmin)
- `PUT /api/admin/users/:userId/unblock` - Unblock user (Superadmin)
- `POST /api/admin/admins` - Create admin (Superadmin)
- `DELETE /api/admin/admins/:adminId` - Delete admin (Superadmin)

## Query Parameters

### Products Filtering
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `rating` - Minimum rating filter
- `flavor` - Filter by flavor (case-insensitive)
- `search` - Text search in name, description, flavor
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort direction: asc/desc (default: desc)

## Role-Based Access Control

### User Roles
- **User**: Can browse products, manage cart, place orders
- **Admin**: Can manage products, variants, view orders
- **Superadmin**: Full access including user management

### Permissions
- Product management: Admin, Superadmin
- Order management: Admin, Superadmin
- User management: Superadmin only
- Analytics: Admin, Superadmin

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Success Responses

All successful responses follow this format:
```json
{
  "success": true,
  "data": {},
  "pagination": {} // For paginated endpoints
}
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tea-ecommerce
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Database Models

- **User**: Authentication and profile data
- **Product**: Product information and base pricing
- **Variant**: Product variants with individual pricing and stock
- **Category**: Product categorization
- **Cart**: User shopping cart
- **Order**: Order processing and history

## Business Logic

### Stock Management
- Stock is managed at variant level
- Automatic stock reduction on order placement
- Stock validation before cart updates and order creation
- Low stock alerts in admin dashboard

### Pricing
- Base price stored in Product model
- Variant price differences stored in Variant model
- Final price = Base price + Variant price difference

### Order Processing
1. Validate cart items and stock
2. Calculate total amount
3. Create order record
4. Reduce variant stock quantities
5. Clear user cart

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based route protection
- Input validation and sanitization
- MongoDB injection prevention
- CORS configuration