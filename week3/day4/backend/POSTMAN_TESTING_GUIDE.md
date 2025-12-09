# Postman Testing Guide - Team & Project Management API

## Quick Setup

### 1. Import Collection
- Open Postman
- Click **Import** → Select `Team_Project_Management_API.postman_collection.json`
- Collection will auto-configure with base URL and token management

### 2. Start Server
```bash
cd backend
npm start
```

## Testing Flow

### Step 1: Authentication
1. **Register** - Creates new user, auto-saves token
   - POST `/api/auth/register`
   - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

2. **Login** - Returns token, auto-saves for subsequent requests
   - POST `/api/auth/login`
   - Body: `{ "email": "john@example.com", "password": "password123" }`

### Step 2: Members (Requires Auth)
1. **Create Member**
   - POST `/api/members`
   - Body: `{ "name": "Alice Smith", "email": "alice@example.com", "role": "Frontend Developer", "skills": ["React", "JavaScript"], "phone": "+1234567890" }`
   - Copy the `_id` from response

2. **Get All Members**
   - GET `/api/members`

3. **Get Member By ID**
   - GET `/api/members/:id`
   - Replace `:id` with copied member ID

4. **Update Member**
   - PUT `/api/members/:id`
   - Body: `{ "role": "Senior Frontend Developer" }`

5. **Delete Member**
   - DELETE `/api/members/:id`

### Step 3: Projects (Requires Auth)
1. **Create Project**
   - POST `/api/projects`
   - Body: `{ "title": "E-commerce Platform", "description": "Building modern platform", "techStack": ["React", "Node.js"], "status": "active" }`
   - Copy the `_id` from response

2. **Get All Projects**
   - GET `/api/projects`

3. **Get Stats**
   - GET `/api/projects/stats`

4. **Get Project By ID**
   - GET `/api/projects/:id`

5. **Update Project**
   - PUT `/api/projects/:id`
   - Body: `{ "status": "completed" }`

6. **Delete Project**
   - DELETE `/api/projects/:id`

## Key Points

- **Token Auto-Management**: Login/Register automatically saves token to collection variable
- **Authorization**: All Member & Project endpoints require `Bearer {{token}}` header (auto-added)
- **Base URL**: Set to `http://localhost:5000/api` (change in collection variables if needed)
- **Replace IDs**: Update `:id` parameters with actual MongoDB ObjectIds from responses

## Common Issues

- **401 Unauthorized**: Run Login request first to refresh token
- **Connection Error**: Ensure server is running on port 5000
- **Validation Errors**: Check required fields match model schemas
