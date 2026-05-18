import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { generateRecoveryKeys, getRecoveryKeysStatus, validateRecoveryKey, resetPasswordWithKey } from '../controllers/recovery.controller';
import { authLimiter, recoveryLimiter } from '../middlewares/security.middleware';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);

// Recovery Keys Routes
router.post('/recovery/generate', protect, recoveryLimiter, generateRecoveryKeys);
router.get('/recovery/keys', protect, getRecoveryKeysStatus);
router.post('/recovery/validate', recoveryLimiter, validateRecoveryKey);
router.post('/recovery/reset', recoveryLimiter, resetPasswordWithKey);

export default router;
