const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "Simple in-memory CRUD API for tasks",
    },
    servers: [
      {
        url: "https://backend-ten-peach-78.vercel.app",
        description: "Production server"
      },
      {
        url: "http://localhost:5000",
        description: "Development server"
      },
    ],
  },
  apis: ["./routes/*.js", "./server.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;