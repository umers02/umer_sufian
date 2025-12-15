import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger setup
import swaggerDocs from './config/swagger';

app.get('/api-docs', (req: Request, res: Response) => {
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

app.get('/swagger.json', (req: Request, res: Response) => {
  res.json(swaggerDocs);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Task Manager RestFul Api Running...");
});

// Routes
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import statsRoutes from './routes/statsRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);

// Error handling middleware
import errorHandler from "./middlewares/errorHandler";
app.use(errorHandler);

// Start server

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
  });

export default app;