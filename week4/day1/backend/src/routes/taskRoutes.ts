import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController';
import auth from '../middlewares/auth';
import { validateTask, validateCreateTask, validateId } from '../middlewares/validation';

const router = express.Router();

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

router.get('/', auth, getAllTasks);
router.get('/:id', auth, validateId, getTaskById);
router.post('/', auth, validateCreateTask, createTask);
router.put('/:id', auth, validateId, validateTask, updateTask);
router.delete('/:id', auth, validateId, deleteTask);

export default router;