"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, database_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger setup
const swagger_1 = __importDefault(require("./config/swagger"));
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
    res.json(swagger_1.default);
});
app.get("/", (req, res) => {
    res.send("Task Manager RestFul Api Running...");
});
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
// Error handling middleware
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
app.use(errorHandler_1.default);
// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map