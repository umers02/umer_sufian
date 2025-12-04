const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/taskController');
const auth = require('../middlewares/auth');

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

module.exports = router;