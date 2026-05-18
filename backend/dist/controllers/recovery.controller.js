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
exports.resetPasswordWithKey = exports.validateRecoveryKey = exports.getRecoveryKeysStatus = exports.generateRecoveryKeys = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../config/jwt");
const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const bytes = crypto_1.default.randomBytes(8);
    const part = (offset) => Array.from({ length: 4 }, (_, i) => chars[bytes[offset + i] % chars.length]).join('');
    return `${part(0)}-${part(4)}`;
};
const generateRecoveryKeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { password } = req.body;
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!password) {
            res.status(400).json({ message: 'Password is required' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid password. Cannot generate keys.' });
            return;
        }
        const plainKeys = [];
        const hashedKeys = [];
        for (let i = 0; i < 10; i++) {
            const key = generateRandomKey();
            plainKeys.push(key);
            const hashedCode = yield bcrypt_1.default.hash(key, 10);
            hashedKeys.push({
                hashedCode,
                used: false,
                createdAt: new Date(),
            });
        }
        user.recoveryKeys = hashedKeys;
        user.recoveryGeneratedAt = new Date();
        user.securityLogs.push({
            action: 'GENERATED_RECOVERY_KEYS',
            ip: req.ip,
            device: req.headers['user-agent'] || 'Unknown',
            timestamp: new Date(),
        });
        yield user.save();
        res.json({
            message: 'Recovery keys generated successfully',
            keys: plainKeys,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error generating keys' });
    }
});
exports.generateRecoveryKeys = generateRecoveryKeys;
const getRecoveryKeysStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const activeKeysCount = user.recoveryKeys.filter((k) => !k.used).length;
        res.json({
            activeKeys: activeKeysCount,
            totalKeys: user.recoveryKeys.length,
            lastGenerated: user.recoveryGeneratedAt || null,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching status' });
    }
});
exports.getRecoveryKeysStatus = getRecoveryKeysStatus;
const validateRecoveryKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { identifier, recoveryKey } = req.body;
        const email = (identifier || '').trim().toLowerCase();
        if (!email || !recoveryKey) {
            res.status(400).json({ message: 'Email and recovery key are required' });
            return;
        }
        const user = yield User_1.default.findOne({ email });
        if (!user || !((_a = user.recoveryKeys) === null || _a === void 0 ? void 0 : _a.length)) {
            res.status(401).json({ message: 'Invalid email or recovery key' });
            return;
        }
        let validKeyId = null;
        for (const key of user.recoveryKeys) {
            if (!key.used) {
                const isMatch = yield bcrypt_1.default.compare(recoveryKey, key.hashedCode);
                if (isMatch) {
                    validKeyId = String(key._id);
                    break;
                }
            }
        }
        if (!validKeyId) {
            res.status(401).json({ message: 'Invalid email or recovery key' });
            return;
        }
        const tempToken = jsonwebtoken_1.default.sign({ id: user._id, keyId: validKeyId, purpose: 'password_reset' }, (0, jwt_1.getJwtSecret)(), { expiresIn: '15m' });
        res.json({
            message: 'Recovery key validated successfully',
            tempToken,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error validating key' });
    }
});
exports.validateRecoveryKey = validateRecoveryKey;
const resetPasswordWithKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tempToken, newPassword } = req.body;
        if (!tempToken || !newPassword) {
            res.status(400).json({ message: 'Token and new password are required' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(tempToken, (0, jwt_1.getJwtSecret)());
        if (decoded.purpose !== 'password_reset') {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }
        const user = yield User_1.default.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(newPassword, 10);
        const keyUsedAt = new Date();
        const result = yield User_1.default.updateOne({
            _id: decoded.id,
            'recoveryKeys._id': decoded.keyId,
            'recoveryKeys.used': false,
        }, {
            $set: {
                passwordHash,
                'recoveryKeys.$.used': true,
                'recoveryKeys.$.usedAt': keyUsedAt,
            },
            $inc: { tokenVersion: 1 },
            $push: {
                securityLogs: {
                    action: 'PASSWORD_RESET_VIA_KEY',
                    ip: req.ip,
                    device: req.headers['user-agent'] || 'Unknown',
                    timestamp: keyUsedAt,
                },
            },
        });
        if (result.modifiedCount !== 1) {
            res.status(400).json({ message: 'Recovery key already used or invalid' });
            return;
        }
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.resetPasswordWithKey = resetPasswordWithKey;
