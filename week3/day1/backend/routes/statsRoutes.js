const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/taskController");

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get task statistics
 *     responses:
 *       200:
 *         description: Task statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 completed:
 *                   type: integer
 *                 pending:
 *                   type: integer
 */
router.get("/", getStats);

module.exports = router;