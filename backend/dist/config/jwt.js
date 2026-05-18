"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = void 0;
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (secret && secret.length >= 32) {
        return secret;
    }
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be set and at least 32 characters in production');
    }
    return 'netify_dev_jwt_secret_change_me_32chars';
};
exports.getJwtSecret = getJwtSecret;
