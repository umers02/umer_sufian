"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await User_1.default.create({ username, email, password });
        const token = generateToken(user._id.toString());
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = generateToken(user._id.toString());
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map