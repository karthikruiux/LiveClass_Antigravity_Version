import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProgressCourse {
  id: string;
  title: string;
  image: string;
  completedClasses: number;
  totalClasses: number;
  nextClassTime: string;
  nextClassEndTime: string;
  nextClassTopic: string;
  bgColor: string; // Dynamic bg color as per figma annotations
  state?: 'live' | 'upcoming';
}

const mockProgressCourses: ProgressCourse[] = [
  {
    id: 'ep1',
    title: 'Generative AI & Prompt Engineering',
    image: '/course_illustration_1.png',
    completedClasses: 2,
    totalClasses: 52,
    nextClassTime: '6 PM',
    nextClassEndTime: '8 PM',
    nextClassTopic: 'If Else Loops using AI',
    bgColor: 'bg-[#fee2e2]', // Dynamic background: red-100/bg-red font color for live
    state: 'live'
  },
  {
    id: 'ep2',
    title: 'Data Structures & Algorithms',
    image: '/course_illustration_1.png',
    completedClasses: 34,
    totalClasses: 60,
    nextClassTime: '10 AM',
    nextClassEndTime: '12 PM',
    nextClassTopic: 'Graph Traversals: DFS and BFS',
    bgColor: 'bg-[#e0f2fe]', // light blue tint
    state: 'upcoming'
  },
  {
    id: 'ep3',
    title: 'Full Stack MERN Developer',
    image: '/course_illustration_1.png',
    completedClasses: 8,
    totalClasses: 45,
    nextClassTime: '6 PM',
    nextClassEndTime: '8 PM',
    nextClassTopic: 'Express.js Routing and Middlewares',
    bgColor: 'bg-[#fee2e2]', // light red tint
    state: 'upcoming'
  },
  {
    id: 'ep4',
    title: 'System Design Fundamentals',
    image: '/course_illustration_1.png',
    completedClasses: 15,
    totalClasses: 30,
    nextClassTime: '8 PM',
    nextClassEndTime: '10 PM',
    nextClassTopic: 'Horizontal vs Vertical Scaling',
    bgColor: 'bg-[#f3e8ff]', // light purple tint
    state: 'upcoming'
  }
];

const CircularMiniProgress: React.FC<{ percent: number }> = ({ percent }) => {
  const radius = 24;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius; // ~150.8
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="absolute -top-1 -right-1 w-14 h-14 bg-white rounded-full shadow-md border border-slate-100/50 flex items-center justify-center z-20 select-none">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#0043FF" // Bright brand blue arc
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Progress percent text inside circle */}
      <span className="text-[10px] font-extrabold text-slate-800 z-10">
        {percent}%
      </span>
    </div>
  );
};

export const EnrolledProgressCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      
      const observer = new ResizeObserver(checkScroll);
      observer.observe(el);
      
      return () => {
        el.removeEventListener('scroll', checkScroll);
        observer.disconnect();
      };
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title + Controls Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-slate-800 font-heading tracking-tight">
            My Learning Progress
          </h2>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
            {mockProgressCourses.length} Batches
          </span>
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollLeft 
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95' 
                : 'border-slate-100 bg-slate-50 text-slate-350 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              canScrollRight 
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95' 
                : 'border-slate-100 bg-slate-50 text-slate-350 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {mockProgressCourses.map((course) => {
          const progressPercent = Math.round((course.completedClasses / course.totalClasses) * 100);
          const isLive = course.state === 'live';
          
          return (
            <div
              key={course.id}
              className={`flex-shrink-0 w-[295px] xs:w-[360px] sm:w-[468px] h-[144px] bg-white border p-3 flex items-center gap-4 hover:shadow-md transition-all duration-300 snap-start rounded-full ${
                isLive
                  ? 'border-red-200/90 shadow-[0px_4px_12px_0px_rgba(239,68,68,0.06)]'
                  : 'border-slate-200 shadow-[0px_2px_8px_0px_rgba(15,23,42,0.04)]'
              }`}
            >
              {/* Dynamic Color Image Area */}
              <div className={`relative shrink-0 w-[120px] h-[120px] rounded-full ${course.bgColor} flex items-center justify-center overflow-visible`}>
                <img 
                  src={course.image} 
                  alt="Illustration" 
                  className="w-20 h-20 object-contain pointer-events-none"
                />
                {/* Circular Progress Badge overlay */}
                <CircularMiniProgress percent={progressPercent} />
              </div>

              {/* Course details */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                <div className="flex flex-col min-w-0 pr-2">
                  <h4 className="text-[14px] font-bold text-slate-900 leading-snug truncate">
                    {course.title}
                  </h4>
                  <p className="text-[12px] text-slate-500 font-medium">
                    {course.completedClasses} of {course.totalClasses} Classes Completed
                  </p>
                </div>

                {/* Slots timing info */}
                <div className="flex gap-1 items-center text-[12px] text-slate-500 w-full pr-2">
                  {isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse mr-1 shrink-0" />
                  )}
                  <span className="font-bold text-slate-900">{course.nextClassTime}</span>
                  <span>|</span>
                  <span className="font-bold text-slate-900">{course.nextClassEndTime}</span>
                  <span>:</span>
                  <span className="truncate flex-1 min-w-0 font-medium">
                    {course.nextClassTopic}
                  </span>
                </div>

                {/* Actions Buttons */}
                <div className="flex gap-3 items-center">
                  {isLive ? (
                    <button 
                      onClick={() => alert(`Joining live class for: ${course.title}`)}
                      className="h-8 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-bold px-4 transition-all cursor-pointer shadow-md shadow-red-500/10 select-none active:scale-[0.97]"
                    >
                      Join Live
                    </button>
                  ) : (
                    <button 
                      onClick={() => alert(`Starting class at: ${course.nextClassTime}`)}
                      className="h-8 border border-slate-200 hover:bg-slate-50 text-[#020617] rounded-xl text-xs font-bold px-4 transition-all cursor-pointer shadow-sm select-none active:scale-[0.97]"
                    >
                      Starts at {course.nextClassTime}
                    </button>
                  )}
                  <button 
                    onClick={() => alert(`Showing details for: ${course.title}`)}
                    className="text-xs font-bold text-[#002eff] hover:underline cursor-pointer select-none whitespace-nowrap"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
