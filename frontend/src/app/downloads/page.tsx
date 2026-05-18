'use client';

import { Download, Smartphone, PlayCircle, Film } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DownloadsPage() {
  // Start with empty state as requested
  const [downloads, setDownloads] = useState([]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-16 md:pt-20 pb-20 px-4 md:px-12 w-full flex flex-col items-center">
      
      {/* Background glow effects for premium look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-6 md:mb-12 border-b border-gray-800 pb-4 md:pb-6">
          <div className="p-2 md:p-3 bg-gray-900 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Smartphone className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">My Downloads</h1>
            <p className="text-sm text-gray-400 mt-1">Watch your downloaded content offline</p>
          </div>
        </div>

        {downloads.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-col items-center justify-center mt-10 py-16 px-4 bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-3xl text-center relative overflow-hidden"
          >
            {/* Inner glow for the empty state box */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-32 h-32 mb-8"
            >
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="relative w-full h-full bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center shadow-2xl">
                <Download className="w-12 h-12 text-blue-500" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-800 p-2 rounded-full border border-gray-700 shadow-lg">
                <Film className="w-5 h-5 text-purple-400" />
              </div>
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">No Downloads Yet</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
              Movies and TV shows you download will appear here so you can watch them anytime, anywhere—even without Wi-Fi.
            </p>

            <Link href="/" className="group relative inline-flex items-center gap-3">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative flex items-center gap-2 bg-black px-8 py-4 rounded-full border border-gray-700 group-hover:border-gray-500 transition-colors">
                <PlayCircle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold tracking-wide">Find Something to Watch</span>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* List logic here for when items are actually downloaded */}
          </div>
        )}
      </div>
    </div>
  );
}
