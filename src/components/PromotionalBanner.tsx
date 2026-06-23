import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, User, Clock } from 'lucide-react';

interface PromoClass {
  id: string;
  title: string;
  topic: string;
  instructor: string;
  duration: string;
  date: string;
}

const promoClasses: PromoClass[] = [
  {
    id: 'p1',
    title: 'Generative AI & Prompt Engineering',
    topic: 'Mastering ChatGPT System Prompts & Few-Shot Learning',
    instructor: 'Rahul Attuluri (CEO, NxtWave)',
    duration: '2 Hours • Live',
    date: 'Today, 7:00 PM'
  },
  {
    id: 'p2',
    title: 'Data Structures & Algorithms',
    topic: 'Graph Traversals: DFS and BFS Optimized Pathfinding',
    instructor: 'Pradyumna G (Lead Software Architect)',
    duration: '2.5 Hours • Live',
    date: 'Tomorrow, 6:30 PM'
  },
  {
    id: 'p3',
    title: 'Frontend Architecture',
    topic: 'Modern Web Performance: INP & LCP Optimization',
    instructor: 'Kiran Kumar (Senior Frontend Lead)',
    duration: '2 Hours • Live',
    date: '25th June, 4:00 PM'
  }
];

export const PromotionalBanner: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? promoClasses.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === promoClasses.length - 1 ? 0 : prev + 1));
  };

  const currentClass = promoClasses[activeIndex];

  // Slide transitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="relative bg-gradient-to-r from-hero via-[#0E1E45] to-[#0A1633] rounded-[32px] p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-[#10224D]/15">
      
      {/* Decorative Background Rings */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-white"></div>
      </div>

      {/* Left side Callout */}
      <div className="z-10 max-w-xl text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full text-blue-400 text-sm font-semibold tracking-wide mb-6">
          🌟 COMPACT TOPICS
        </div>
        <h2 className="text-[44px] lg:text-[50px] font-bold text-white leading-tight font-heading">
          <span className="text-emerald-400">One Class. One Topic.</span>
          <br />
          No Long Commitment.
        </h2>
        <p className="text-slate-300 text-lg mt-6 font-medium leading-relaxed">
          Struggling with a single tricky topic? Jump into individual standalone classes, clarify doubts with top mentors, and level up without long course commitments.
        </p>
      </div>

      {/* Right side Carousel Widget */}
      <div className="z-10 flex items-center gap-4 w-full max-w-[500px]">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Card Frame */}
        <div className="flex-1 bg-white rounded-[24px] p-6 shadow-2xl relative overflow-hidden min-h-[220px] flex flex-col justify-between border border-slate-100">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentClass.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex-1 flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-[12px] uppercase font-bold tracking-wider text-primary-blue bg-blue-50 px-3 py-1 rounded-full">
                  {currentClass.title}
                </span>
                <h3 className="text-[20px] font-bold text-text-primary mt-3 leading-snug font-heading">
                  {currentClass.topic}
                </h3>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                {/* Instructor */}
                <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{currentClass.instructor}</span>
                </div>
                {/* Timing */}
                <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">{currentClass.date}</span>
                </div>
                {/* Duration */}
                <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{currentClass.duration}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button className="w-full mt-4 py-3 bg-gradient-to-r from-[#173EFF] to-[#238BFF] text-white rounded-xl text-[14px] font-bold shadow-md hover:shadow-lg transition-all active:scale-98">
            Book Free Seat
          </button>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 text-white flex items-center justify-center transition-all shrink-0 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};
