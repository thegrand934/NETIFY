"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../config/jwt");
const normalizeEmail = (email) => email.trim().toLowerCase();
const validateEmail = (email) => {
    if (!email)
        return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return 'Invalid email format';
    return null;
};
const validatePassword = (password) => {
    if (!password)
        return 'Password is required';
    if (password.length < 6)
        return 'Password must be at least 6 characters';
    return null;
};
const generateToken = (id, tokenVersion) => {
    return jsonwebtoken_1.default.sign({ id, tokenVersion }, (0, jwt_1.getJwtSecret)(), {
        expiresIn: '30d',
    });
};
const formatAuthResponse = (user) => {
    var _a;
    return ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, (_a = user.tokenVersion) !== null && _a !== void 0 ? _a : 0),
    });
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password } = req.body;
        const email = normalizeEmail(req.body.email || '');
        if (!(name === null || name === void 0 ? void 0 : name.trim())) {
            res.status(400).json({ message: 'Name is required' });
            return;
        }
        const emailError = validateEmail(email);
        if (emailError) {
            res.status(400).json({ message: emailError });
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            res.status(400).json({ message: passwordError });
            return;
        }
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash(password, salt);
        const user = yield User_1.default.create({
            name: name.trim(),
            email,
            passwordHash,
        });
        res.status(201).json(formatAuthResponse(user));
    }
    catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const email = normalizeEmail(req.body.email || '');
        const emailError = validateEmail(email);
        if (emailError) {
            res.status(400).json({ message: emailError });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'Password is required' });
            return;
        }
        const user = yield User_1.default.findOne({ email });
        if (user && (yield bcrypt_1.default.compare(password, user.passwordHash))) {
            res.json(formatAuthResponse(user));
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.loginUser = loginUser;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select('-passwordHash');
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getMe = getMe;
