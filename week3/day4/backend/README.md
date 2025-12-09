# Team & Project Management Portal - Backend

## Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Update `.env` file with your MongoDB URI and JWT secret

3. **Start MongoDB**
Make sure MongoDB is running on your system

4. **Run the Server**
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects (Protected)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/stats` - Get project statistics

### Members (Protected)
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

## Authentication
All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```
