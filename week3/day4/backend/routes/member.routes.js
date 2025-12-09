const express = require('express');
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} = require('../controllers/member.controller');
const { protect } = require('../middleware/authMiddleware');
const { memberValidation } = require('../utils/validators');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllMembers)
  .post(memberValidation, createMember);

router.route('/:id')
  .get(getMemberById)
  .put(updateMember)
  .delete(deleteMember);

module.exports = router;
