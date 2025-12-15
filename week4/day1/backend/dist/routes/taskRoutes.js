"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         completed:
 *           type: boolean
 *         user:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
router.get('/', auth_1.default, taskController_1.getAllTasks);
router.get('/:id', auth_1.default, validation_1.validateId, taskController_1.getTaskById);
router.post('/', auth_1.default, validation_1.validateCreateTask, taskController_1.createTask);
router.put('/:id', auth_1.default, validation_1.validateId, validation_1.validateTask, taskController_1.updateTask);
router.delete('/:id', auth_1.default, validation_1.validateId, taskController_1.deleteTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map