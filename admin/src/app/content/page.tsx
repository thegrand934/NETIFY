'use client';

import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Movie {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  genre: string;
  isPremium: boolean;
  createdAt: string;
}

export default function ContentPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/movies')
      .then(res => {
        setMovies(res.data);
        setError('');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load content');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Plus size={18} /> Upload New
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search content..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Genre</th>
              <th className="p-4 font-semibold">Tier</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : movies.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No content uploaded yet.</td></tr>
            ) : movies.map((movie) => (
              <tr key={movie._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-12 h-16 bg-gray-200 rounded object-cover overflow-hidden">
                    <img src={movie.posterUrl || `https://picsum.photos/seed/${movie._id}/100/150`} alt="poster" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{movie.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1 w-48">{movie.description}</p>
                  </div>
                </td>
                <td className="p-4 text-gray-700">{movie.genre}</td>
                <td className="p-4">
                  {movie.isPremium ? (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Premium</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Free</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Published</span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded mr-2"><Edit size={18} /></button>
                  <button className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 bg-gray-50">
          <p>Showing {movies.length} entries</p>
        </div>
      </div>
    </div>
  );
}
