const express = require("express");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger");

app.get('/api-docs', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Task Manager API</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ]
      });
    };
  </script>
</body>
</html>
  `);
});

app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocs);
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns API status message
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get("/", (req, res) => {
  res.send("Task Manager RestFul Api Running...");
});

// Routes
const taskRoutes = require("./routes/taskRoutes");
const statsRoutes = require("./routes/statsRoutes");
app.use("/api/tasks", taskRoutes);
app.use("/api/stats", statsRoutes);

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
