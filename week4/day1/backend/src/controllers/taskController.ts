import { Request, Response } from 'express';
import Task from '../models/Task';
import { TaskRequest } from '../types';

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.query;
    const filter: any = { user: req.user!.id };
    
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user!.id });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user!.id
    });
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user!.id });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted', task });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await Task.countDocuments({ user: req.user!.id });
    const completed = await Task.countDocuments({ user: req.user!.id, completed: true });
    const pending = total - completed;
    
    res.json({ total, completed, pending });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};