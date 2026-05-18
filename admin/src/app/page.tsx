'use client';

import { Users, Video, Activity, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    activeStreams: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => {
        setStats(res.data);
        setError('');
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Failed to load dashboard stats';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={loading ? "..." : stats.totalUsers.toLocaleString()} icon={<Users className="text-blue-500" />} />
        <StatCard title="Active Streams" value={loading ? "..." : stats.activeStreams.toLocaleString()} icon={<Activity className="text-green-500" />} />
        <StatCard title="Content Library" value={loading ? "..." : stats.totalMovies.toLocaleString()} icon={<Video className="text-purple-500" />} />
        <StatCard title="Monthly Revenue" value={loading ? "..." : `$${stats.monthlyRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<DollarSign className="text-yellow-500" />} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Live Traffic Analytics (Placeholder)</h3>
        <div className="w-full h-64 bg-gray-50 rounded-md border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          Chart Component Here
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
