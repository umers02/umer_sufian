const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRegister, validateLogin, handleValidationErrors } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;