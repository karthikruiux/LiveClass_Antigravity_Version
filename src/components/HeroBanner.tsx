import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Users, MessageSquare, Flame } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative h-[180px] bg-gradient-to-r from-hero via-[#122452] to-[#0A1633] rounded-[24px] p-8 overflow-hidden flex items-center justify-between shadow-xl shadow-[#10224D]/15">
      
      {/* Sleek Decorative Curved Geometric Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M -50,90 Q 200,-20 450,110 T 950,40 T 1450,110" 
            fill="none" 
            stroke="#1845FF" 
            strokeWidth="2.5" 
          />
          <path 
            d="M -20,120 Q 220,10 480,140 T 980,60 T 1480,140" 
            fill="none" 
            stroke="#238BFF" 
            strokeWidth="1.5" 
          />
          <circle cx="150" cy="30" r="4" fill="#1845FF" />
          <circle cx="700" cy="120" r="6" fill="#238BFF" opacity="0.4" />
          <circle cx="950" cy="50" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Left side Content */}
      <div className="z-10 flex flex-col justify-center h-full max-w-[65%] space-y-3.5">
        {/* Pulsing Tag */}
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full text-blue-400 text-[11px] font-bold tracking-wider uppercase w-fit">
          <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-orange-500" />
          <span>Interactive Learning Hub</span>
        </div>

        <h1 className="text-[36px] md:text-[40px] font-extrabold text-white leading-none tracking-tight font-heading">
          Live Classes
        </h1>
        
        {/* Horizontal glassmorphic badges */}
        <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white/90 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Join at any stage</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white/90 shadow-sm">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Learn with mentors</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white/90 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask doubts live</span>
          </div>
        </div>
      </div>

      {/* Right side Illustration (compact & slightly overlapping) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[340px] h-[220px] pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotate: [0, 1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Glowing backplate blur */}
          <div className="absolute w-[200px] h-[200px] bg-blue-500/15 rounded-full blur-[40px] -z-10"></div>
          
          <img 
            src="/hero_illustration.png" 
            alt="Futuristic learning setup"
            className="object-contain max-h-[190px] drop-shadow-[0_15px_35px_rgba(24,69,255,0.25)] select-none"
          />
        </motion.div>
      </div>

    </div>
  );
};
