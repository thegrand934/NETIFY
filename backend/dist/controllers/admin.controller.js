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
exports.getAllMovies = exports.getAllUsers = exports.getDashboardStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const Movie_1 = __importDefault(require("../models/Movie"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.default.countDocuments();
        const totalMovies = yield Movie_1.default.countDocuments();
        const premiumUsers = yield User_1.default.countDocuments({ isPremium: true });
        res.json({
            totalUsers,
            totalMovies,
            activeStreams: premiumUsers,
            monthlyRevenue: premiumUsers * 14.99
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDashboardStats = getDashboardStats;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select('-passwordHash').sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching users' });
    }
});
exports.getAllUsers = getAllUsers;
const getAllMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie_1.default.find().sort({ createdAt: -1 });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching movies' });
    }
});
exports.getAllMovies = getAllMovies;
