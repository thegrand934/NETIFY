"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const recovery_controller_1 = require("../controllers/recovery.controller");
const security_middleware_1 = require("../middlewares/security.middleware");
const router = express_1.default.Router();
router.post('/register', security_middleware_1.authLimiter, auth_controller_1.registerUser);
router.post('/login', security_middleware_1.authLimiter, auth_controller_1.loginUser);
router.get('/me', auth_middleware_1.protect, auth_controller_1.getMe);
// Recovery Keys Routes
router.post('/recovery/generate', auth_middleware_1.protect, security_middleware_1.recoveryLimiter, recovery_controller_1.generateRecoveryKeys);
router.get('/recovery/keys', auth_middleware_1.protect, recovery_controller_1.getRecoveryKeysStatus);
router.post('/recovery/validate', security_middleware_1.recoveryLimiter, recovery_controller_1.validateRecoveryKey);
router.post('/recovery/reset', security_middleware_1.recoveryLimiter, recovery_controller_1.resetPasswordWithKey);
exports.default = router;
