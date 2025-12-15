# Installation Guide

## Quick Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Install MongoDB** (if not already installed):
   - **Windows**: Download from https://www.mongodb.com/try/download/community
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow MongoDB installation guide for your distribution

3. **Start MongoDB:**
```bash
# Windows/macOS/Linux
mongod
```

4. **Create environment file:**
```bash
# Copy the example and modify as needed
cp .env.example .env
```

5. **Start the application:**
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
```

## Testing the API

1. **Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Login and get token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Create a task (use token from login):**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Task","description":"This is a test task"}'
```

## Troubleshooting

- **MongoDB connection error**: Ensure MongoDB is running
- **JWT errors**: Check JWT_SECRET in .env file
- **Validation errors**: Check request body format
- **Port conflicts**: Change PORT in .env file