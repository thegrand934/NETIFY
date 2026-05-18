import express from 'express';
import { getDashboardStats, getAllUsers, getAllMovies } from '../controllers/admin.controller';
import { protect } from '../middlewares/auth.middleware';
import { admin } from '../middlewares/admin.middleware';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/movies', getAllMovies);

export default router;
