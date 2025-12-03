# Task Manager API

Simple in-memory CRUD API for managing tasks with search functionality and statistics.

## Features
- Create, read, update, delete tasks
- Search tasks by title
- View task statistics
- Swagger documentation
- Error handling middleware

## Setup & Run

1. Install dependencies:
```bash
npm install express swagger-ui-express swagger-jsdoc
```

2. Start the server:
```bash
node server.js
```

3. Access the API:
- Server: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?title=search` - Search tasks by title
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Statistics
- `GET /api/stats` - Get task statistics

## Sample Requests & Responses

### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Learn Node.js",
  "completed": false
}
```

Response:
```json
{
  "id": 1,
  "title": "Learn Node.js",
  "completed": false
}
```

### Get All Tasks
```bash
GET /api/tasks
```

Response:
```json
[
  {
    "id": 1,
    "title": "Learn Node.js",
    "completed": false
  }
]
```

### Search Tasks
```bash
GET /api/tasks?title=learn
```

Response:
```json
[
  {
    "id": 1,
    "title": "Learn Node.js",
    "completed": false
  }
]
```

### Get Statistics
```bash
GET /api/stats
```

Response:
```json
{
  "total": 5,
  "completed": 2,
  "pending": 3
}
```