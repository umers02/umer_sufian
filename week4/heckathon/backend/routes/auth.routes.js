const express = require('express');
const { register, login, logout } = require('../controllers/auth/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');
const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

module.exports = router;