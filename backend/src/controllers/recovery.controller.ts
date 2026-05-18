import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getJwtSecret } from '../config/jwt';

const generateRandomKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.randomBytes(8);
  const part = (offset: number) =>
    Array.from({ length: 4 }, (_, i) => chars[bytes[offset + i] % chars.length]).join('');
  return `${part(0)}-${part(4)}`;
};

export const generateRecoveryKeys = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!password) {
      res.status(400).json({ message: 'Password is required' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid password. Cannot generate keys.' });
      return;
    }

    const plainKeys: string[] = [];
    const hashedKeys = [];

    for (let i = 0; i < 10; i++) {
      const key = generateRandomKey();
      plainKeys.push(key);
      const hashedCode = await bcrypt.hash(key, 10);
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

    await user.save();

    res.json({
      message: 'Recovery keys generated successfully',
      keys: plainKeys,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating keys' });
  }
};

export const getRecoveryKeysStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
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
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching status' });
  }
};

export const validateRecoveryKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, recoveryKey } = req.body;
    const email = (identifier || '').trim().toLowerCase();

    if (!email || !recoveryKey) {
      res.status(400).json({ message: 'Email and recovery key are required' });
      return;
    }

    const user = await User.findOne({ email });

    if (!user || !user.recoveryKeys?.length) {
      res.status(401).json({ message: 'Invalid email or recovery key' });
      return;
    }

    let validKeyId: string | null = null;
    for (const key of user.recoveryKeys) {
      if (!key.used) {
        const isMatch = await bcrypt.compare(recoveryKey, key.hashedCode);
        if (isMatch) {
          validKeyId = String((key as { _id?: { toString(): string } })._id);
          break;
        }
      }
    }

    if (!validKeyId) {
      res.status(401).json({ message: 'Invalid email or recovery key' });
      return;
    }

    const tempToken = jwt.sign(
      { id: user._id, keyId: validKeyId, purpose: 'password_reset' },
      getJwtSecret(),
      { expiresIn: '15m' }
    );

    res.json({
      message: 'Recovery key validated successfully',
      tempToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error validating key' });
  }
};

export const resetPasswordWithKey = async (req: Request, res: Response): Promise<void> => {
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

    const decoded = jwt.verify(tempToken, getJwtSecret()) as {
      id: string;
      keyId: string;
      purpose?: string;
    };

    if (decoded.purpose !== 'password_reset') {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const keyUsedAt = new Date();

    const result = await User.updateOne(
      {
        _id: decoded.id,
        'recoveryKeys._id': decoded.keyId,
        'recoveryKeys.used': false,
      },
      {
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
      }
    );

    if (result.modifiedCount !== 1) {
      res.status(400).json({ message: 'Recovery key already used or invalid' });
      return;
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
