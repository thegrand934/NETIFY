'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, User, Menu, Home, Download, Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const mySpaceHref = user ? '/settings/security/recovery-keys' : '/login';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Navigation */}
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-12 py-3 md:py-4 flex items-center justify-between',
          isScrolled ? 'bg-background/90 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
        )}
      >
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-2xl md:text-3xl font-bold tracking-tighter shrink-0"
            style={{ 
              background: 'linear-gradient(to right, #D9B3FF, #C56CFF, #8F6BFF, #58B7FF)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            NETIFY
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/series" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/sports" className="hover:text-white transition-colors">Sports</Link>
            <Link href="/live" className="hover:text-white transition-colors">Live TV</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-foreground/80">
          <button className="hover:text-white transition-colors"><Search className="w-5 h-5 md:w-5 md:h-5" /></button>
          <button className="hover:text-white transition-colors"><Bell className="w-5 h-5 md:w-5 md:h-5" /></button>
          
          {isLoading ? (
            <div className="hidden md:block w-20 h-8 bg-white/10 rounded animate-pulse" />
          ) : user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-medium text-white">{user.name}</span>
              <button onClick={logout} className="text-sm bg-primary/20 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 text-sm font-medium bg-primary hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
              Sign In
            </Link>
          )}
          
          <button className="hidden md:block hover:text-white transition-colors"><Menu className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Mobile Bottom Navigation (JioHotstar Style) */}
      <div className="md:hidden fixed bottom-0 w-full bg-background/95 backdrop-blur-md border-t border-gray-800 z-50 flex justify-around items-center pb-safe pt-2 px-2 h-16 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
        <Link href="/" className={cn("flex flex-col items-center gap-1", pathname === '/' ? "text-blue-400" : "text-gray-400 hover:text-white")}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/movies" className={cn("flex flex-col items-center gap-1", pathname === '/movies' ? "text-blue-400" : "text-gray-400 hover:text-white")}>
          <Tv className="w-5 h-5" />
          <span className="text-[10px] font-medium">Movies</span>
        </Link>
        <Link href="/downloads" className={cn("flex flex-col items-center gap-1", pathname === '/downloads' ? "text-blue-400" : "text-gray-400 hover:text-white")}>
          <Download className="w-5 h-5" />
          <span className="text-[10px] font-medium">Downloads</span>
        </Link>
        <Link href={mySpaceHref} className={cn("flex flex-col items-center gap-1", pathname === mySpaceHref || (user && pathname.startsWith('/settings')) ? "text-blue-400" : "text-gray-400 hover:text-white")}>
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">My Space</span>
        </Link>
      </div>
    </>
  );
}
