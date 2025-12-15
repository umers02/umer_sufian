"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getAllTasks = async (req, res) => {
    try {
        const { title } = req.query;
        const filter = { user: req.user.id };
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }
        const tasks = await Task_1.default.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res) => {
    try {
        const task = await Task_1.default.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    try {
        const task = await Task_1.default.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const task = await Task_1.default.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.default.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted', task });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.deleteTask = deleteTask;
const getStats = async (req, res) => {
    try {
        const total = await Task_1.default.countDocuments({ user: req.user.id });
        const completed = await Task_1.default.countDocuments({ user: req.user.id, completed: true });
        const pending = total - completed;
        res.json({ total, completed, pending });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getStats = getStats;
//# sourceMappingURL=taskController.js.map