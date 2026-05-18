'use client';

import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[75vh] md:h-[90vh] flex items-center">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero.png" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-12 w-full max-w-4xl mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-[linear-gradient(to_right,#D9B3FF,#C56CFF,#8F6BFF,#58B7FF)] bg-clip-text text-transparent font-bold tracking-widest text-sm uppercase mb-4 block">
            NETIFY Original
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-3 md:mb-4 drop-shadow-lg">
            CRIMSON CITY
          </h1>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mb-6 md:mb-8 drop-shadow-md line-clamp-3">
            In a dark futuristic world where light is a luxury, one rogue AI architect must uncover the ancient secrets of the Crimson Citadel before the city descends into eternal night.
          </p>
          
          <div className="flex items-center gap-3 md:gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-md font-bold text-sm md:text-base hover:bg-gray-200 transition-colors">
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              Play Now
            </button>
            <button className="flex items-center gap-2 bg-secondary/80 text-white px-4 py-2 md:px-6 md:py-3 rounded-md font-bold text-sm md:text-base hover:bg-secondary transition-colors backdrop-blur-sm border border-gray-600/50">
              <Info className="w-4 h-4 md:w-5 md:h-5" />
              More Info
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
