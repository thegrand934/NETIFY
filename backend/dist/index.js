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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const User_1 = __importDefault(require("./models/User"));
const jwt_1 = require("./config/jwt");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
let memoryServer = null;
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:3000',
    'http://localhost:3001',
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(null, true);
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.get('/api/health', (req, res) => {
    const dbReady = mongoose_1.default.connection.readyState === 1;
    res.status(dbReady ? 200 : 503).json({
        status: dbReady ? 'ok' : 'degraded',
        message: dbReady ? 'NETIFY Backend is running.' : 'Database not connected.',
        db: dbReady ? 'connected' : 'disconnected',
    });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
const ensureDevAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@netify.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = yield bcrypt_1.default.hash(adminPassword, 10);
    const existing = yield User_1.default.findOne({ email: adminEmail });
    if (existing) {
        existing.role = 'admin';
        existing.passwordHash = passwordHash;
        yield existing.save();
        console.log(`Dev admin ready: ${adminEmail} (password: ${adminPassword})`);
        return;
    }
    const anyAdmin = yield User_1.default.findOne({ role: 'admin' });
    if (anyAdmin) {
        return;
    }
    yield User_1.default.create({
        name: 'Admin User',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isPremium: true,
    });
    console.log(`Dev admin created: ${adminEmail} (password: ${adminPassword})`);
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.log('No MONGO_URI provided. Starting in-memory MongoDB...');
        memoryServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        mongoUri = memoryServer.getUri();
    }
    yield mongoose_1.default.connect(mongoUri);
    console.log('MongoDB connected successfully');
    yield ensureDevAdmin();
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, jwt_1.getJwtSecret)();
    yield connectDB();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
