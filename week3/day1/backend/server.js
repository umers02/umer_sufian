const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

// Swagger setup
const swaggerUi = require("swagger-ui-express");
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
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const taskRoutes = require("./routes/taskRoutes");
const statsRoutes = require("./routes/statsRoutes");
app.use("/api/tasks", taskRoutes);
app.use("/api/stats", statsRoutes);

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:5000/api-docs`);
});
