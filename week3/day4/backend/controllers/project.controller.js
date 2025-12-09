const { validationResult } = require('express-validator');
const Project = require('../models/Project.model');
const { successResponse, errorResponse } = require('../utils/response');

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('teamMembers', 'name email role')
      .sort({ createdAt: -1 });
    successResponse(res, 200, 'Projects retrieved successfully', projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email role skills');
    
    if (!project) {
      return errorResponse(res, 404, 'Project not found');
    }
    
    successResponse(res, 200, 'Project retrieved successfully', project);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const project = await Project.create(req.body);
    const populatedProject = await Project.findById(project._id)
      .populate('teamMembers', 'name email role');
    
    successResponse(res, 201, 'Project created successfully', populatedProject);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('teamMembers', 'name email role');

    if (!project) {
      return errorResponse(res, 404, 'Project not found');
    }

    successResponse(res, 200, 'Project updated successfully', project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return errorResponse(res, 404, 'Project not found');
    }

    successResponse(res, 200, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });

    const stats = {
      totalProjects,
      activeProjects,
      completedProjects
    };

    successResponse(res, 200, 'Stats retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getStats
};
