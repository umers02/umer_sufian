# Streaming Backend API

## Project Structure

This is a Node.js backend for a streaming application with role-based access control.

### Roles
- **SuperAdmin**: Manages admins
- **Admin**: Manages users, videos, and plans
- **User**: Access to streaming content and subscriptions

### Features
- User authentication and authorization
- Video streaming
- Subscription management
- Payment processing
- Role-based access control

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/streaming-app
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key
```

### Running the Application

```bash
# Development
npm run dev

# Production
npm start
```

### API Endpoints

- `/api/auth` - Authentication routes
- `/api/super-admin` - SuperAdmin routes
- `/api/admin` - Admin routes
- `/api/user` - User routes