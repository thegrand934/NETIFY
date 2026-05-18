'use client';

import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Video, DollarSign, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Redirecting to login...</p>
      </div>
    );
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-widest text-blue-400">NETIFY ADMIN</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/') ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/content" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/content') ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            <Video size={20} /> Content
          </Link>
          <Link href="/users" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/users') ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            <Users size={20} /> Users
          </Link>
          <Link href="/revenue" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/revenue') ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            <DollarSign size={20} /> Revenue
          </Link>
          <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive('/settings') ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
            <Settings size={20} /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-md transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-end px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">{user.name}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}
