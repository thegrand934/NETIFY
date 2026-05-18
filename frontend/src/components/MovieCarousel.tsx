'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieCarouselProps {
  title: string;
}

export default function MovieCarousel({ title }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Mock data for UI demonstration
  const mockMovies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full px-4 md:px-12 py-6 relative z-10 group/carousel">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{title}</h2>
      
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
      >
        <ChevronLeft size={28} />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/70 hover:bg-black/90 text-white rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
      >
        <ChevronRight size={28} />
      </button>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x relative" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {mockMovies.map((item) => (
          <motion.div
            key={item}
            className="relative flex-none w-[120px] md:w-[280px] aspect-[2/3] rounded-md overflow-hidden bg-secondary cursor-pointer group snap-start"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Placeholder poster */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-700">
              Poster
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex gap-2 mb-2">
                <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200">
                  <Play className="w-4 h-4 fill-current ml-1" />
                </button>
              </div>
              <h3 className="text-white font-bold text-sm">Movie Title {item}</h3>
              <p className="text-green-500 text-xs font-bold mt-1">98% Match</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-300 mt-2">
                <span className="border border-gray-500 px-1 rounded">U/A 16+</span>
                <span>2h 14m</span>
                <span className="border border-gray-500 px-1 rounded">HD</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
