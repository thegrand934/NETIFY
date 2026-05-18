import { Request, Response } from 'express';
import User from '../models/User';
import Movie from '../models/Movie';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    
    const premiumUsers = await User.countDocuments({ isPremium: true });

    res.json({
      totalUsers,
      totalMovies,
      activeStreams: premiumUsers,
      monthlyRevenue: premiumUsers * 14.99
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

export const getAllMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching movies' });
  }
};
