'use client';

import { Search, MoreVertical, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/users')
      .then(res => {
        setUsers(res.data);
        setError('');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load users');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
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
              placeholder="Search users by email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Joined Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No users found.</td></tr>
            ) : users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 ${user.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} rounded-full flex items-center justify-center font-bold`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  {user.role === 'admin' ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Admin</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">User</span>
                  )}
                </td>
                <td className="p-4 text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button className="text-red-600 hover:bg-red-50 p-2 rounded mr-2" title="Ban User"><ShieldAlert size={18} /></button>
                  )}
                  <button className="text-gray-400 hover:text-gray-900 p-2"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 bg-gray-50">
          <p>Showing {users.length} entries</p>
        </div>
      </div>
    </div>
  );
}
