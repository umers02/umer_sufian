"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
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
router.get('/', auth_1.default, taskController_1.getStats);
exports.default = router;
//# sourceMappingURL=statsRoutes.js.map