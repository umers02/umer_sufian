# Task Manager API v2.0

Advanced Task Manager API with MongoDB integration, JWT authentication, and comprehensive validation.

## Features
- 🔐 **JWT Authentication** - Secure user registration and login
- 🗄️ **MongoDB Integration** - Persistent data storage with Mongoose
- ✅ **Request Validation** - Input validation using express-validator
- 📚 **Swagger Documentation** - Complete API documentation
- 🔍 **Search Functionality** - Search tasks by title
- 📊 **Statistics** - View task completion statistics
- 🛡️ **Error Handling** - Comprehensive error handling middleware
- 👤 **User-specific Tasks** - Each user manages their own tasks

## Setup & Run

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

3. Start MongoDB (if running locally)

4. Start the server:
```bash
npm run dev  # Development with nodemon
# or
npm start    # Production
```

5. Access the API:
- Server: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected - Requires JWT Token)
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks?title=search` - Search user tasks by title
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Statistics (Protected - Requires JWT Token)
- `GET /api/stats` - Get user task statistics

## Sample Requests & Responses

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task (Protected)
```bash
POST /api/tasks
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Learn Node.js",
  "description": "Complete Node.js tutorial",
  "completed": false
}
```

Response:
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "title": "Learn Node.js",
  "description": "Complete Node.js tutorial",
  "completed": false,
  "user": "64f8a1b2c3d4e5f6a7b8c9d0",
  "createdAt": "2023-09-06T10:30:00.000Z",
  "updatedAt": "2023-09-06T10:30:00.000Z"
}
```

### Get All Tasks (Protected)
```bash
GET /api/tasks
Authorization: Bearer <your-jwt-token>
```

### Get Statistics (Protected)
```bash
GET /api/stats
Authorization: Bearer <your-jwt-token>
```

Response:
```json
{
  "total": 5,
  "completed": 2,
  "pending": 3
}
```

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. After registering or logging in, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Validation

All requests are validated using express-validator:
- **Username**: Minimum 3 characters
- **Email**: Valid email format
- **Password**: Minimum 6 characters
- **Task Title**: Required, maximum 200 characters
- **Task Description**: Optional, maximum 1000 characters

## Error Responses

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT implementation
- **bcryptjs**: Password hashing
- **express-validator**: Request validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **swagger-jsdoc & swagger-ui-express**: API documentation