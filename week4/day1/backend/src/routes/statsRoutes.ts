import express from 'express';
import { getStats } from '../controllers/taskController';
import auth from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get user task statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task statistics for authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of tasks
 *                 completed:
 *                   type: integer
 *                   description: Number of completed tasks
 *                 pending:
 *                   type: integer
 *                   description: Number of pending tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, getStats);

export default router;