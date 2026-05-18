import mongoose, { Document, Schema } from 'mongoose';

export interface IRecoveryKey {
  hashedCode: string;
  used: boolean;
  createdAt: Date;
  usedAt?: Date;
}

export interface ISecurityLog {
  action: string;
  ip?: string;
  device?: string;
  timestamp: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  createdAt: Date;
  recoveryKeys: IRecoveryKey[];
  recoveryGeneratedAt?: Date;
  securityLogs: ISecurityLog[];
  trustedDevices: string[];
  tokenVersion: number;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  recoveryKeys: [{
    hashedCode: { type: String, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    usedAt: { type: Date }
  }],
  recoveryGeneratedAt: { type: Date },
  securityLogs: [{
    action: { type: String, required: true },
    ip: { type: String },
    device: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  trustedDevices: [{ type: String }],
  tokenVersion: { type: Number, default: 0 }
});

export default mongoose.model<IUser>('User', UserSchema);
