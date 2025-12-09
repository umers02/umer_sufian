const { validationResult } = require('express-validator');
const Member = require('../models/Member.model');
const { successResponse, errorResponse } = require('../utils/response');

const getAllMembers = async (req, res, next) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    successResponse(res, 200, 'Members retrieved successfully', members);
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return errorResponse(res, 404, 'Member not found');
    }
    successResponse(res, 200, 'Member retrieved successfully', member);
  } catch (error) {
    next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const member = await Member.create(req.body);
    successResponse(res, 201, 'Member created successfully', member);
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return errorResponse(res, 404, 'Member not found');
    }

    successResponse(res, 200, 'Member updated successfully', member);
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return errorResponse(res, 404, 'Member not found');
    }

    successResponse(res, 200, 'Member deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};
