const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '2.0.0',
      description: 'Advanced Task Manager API with MongoDB, JWT Authentication, and Request Validation',
      contact: {
        name: 'API Support',
        email: 'support@taskmanager.com'
      }
    },
    servers: [
      {
        url: 'https://backend-ten-peach-78.vercel.app',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      },
      {
        name: 'Statistics',
        description: 'Task statistics endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;