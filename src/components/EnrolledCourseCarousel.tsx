import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  title: string;
  image: string;
  completedClasses: number;
  totalClasses: number;
  nextClassTime: string;
  nextClassEndTime: string;
  nextClassTopic: string;
  state: 'live' | 'upcoming' | 'past';
  dateStr?: string;
}

const mockEnrolled: EnrolledCourse[] = [
  {
    id: 'e1',
    title: 'Generative AI & Prompt Engineering',
    image: '/course_illustration_1.png',
    completedClasses: 2,
    totalClasses: 52,
    nextClassTime: '6:00 PM',
    nextClassEndTime: '8:00 PM',
    nextClassTopic: 'If Else Loops using AI',
    state: 'live'
  },
  {
    id: 'e2',
    title: 'Data Structures & Algorithms',
    image: '/course_illustration_1.png',
    completedClasses: 34,
    totalClasses: 60,
    nextClassTime: '10:00 AM',
    nextClassEndTime: '12:00 PM',
    nextClassTopic: 'Graph Traversals: DFS and BFS',
    state: 'upcoming',
    dateStr: 'May 7'
  },
  {
    id: 'e3',
    title: 'Full Stack MERN Developer',
    image: '/course_illustration_1.png',
    completedClasses: 8,
    totalClasses: 45,
    nextClassTime: '6:00 PM',
    nextClassEndTime: '8:00 PM',
    nextClassTopic: 'Express.js Routing and Middlewares',
    state: 'past',
    dateStr: 'May 3'
  },
  {
    id: 'e4',
    title: 'System Design Fundamentals',
    image: '/course_illustration_1.png',
    completedClasses: 15,
    totalClasses: 30,
    nextClassTime: '8:00 PM',
    nextClassEndTime: '10:00 PM',
    nextClassTopic: 'Horizontal vs Vertical Scaling',
    state: 'upcoming',
    dateStr: 'May 12'
  }
];

export const EnrolledCourseCarousel: React.FC = () => {
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
            My Enrolled Classes
          </h2>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
            {mockEnrolled.length} Active
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
        {mockEnrolled.map((course) => {
          const isLive = course.state === 'live';
          const isUpcoming = course.state === 'upcoming';
          const isPast = course.state === 'past';
          
          return (
            <div
              key={course.id}
              className={`flex-shrink-0 w-[295px] xs:w-[360px] sm:w-[468px] h-[168px] overflow-hidden p-5 rounded-[16px] border border-slate-200/60 shadow-[0px_2px_8px_0px_rgba(15,23,42,0.04)] relative flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-300 snap-start`}
              style={isLive ? {
                backgroundImage: "linear-gradient(90deg, rgba(254, 226, 226, 0.12) 0%, rgba(254, 226, 226, 0.12) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)"
              } : undefined}
            >
              {/* Thumbnail Area (Absolute Top Right) */}
              <div className={`absolute border-2 border-white right-4 top-4 rounded-[16px] shadow-[0px_6px_16px_0px_rgba(15,23,42,0.07)] w-[72px] h-[72px] bg-[#F0FDEB] flex items-center justify-center overflow-hidden z-10 ${
                isPast ? 'opacity-60' : ''
              }`}>
                <img 
                  src={course.image} 
                  alt="Course illustration" 
                  className="w-10 h-10 object-contain pointer-events-none"
                />
              </div>

              {/* Content Area */}
              <div className="flex flex-col gap-2.5 items-start w-full pr-[80px]">
                {/* Status Badge */}
                {isLive && (
                  <div className="bg-[#fee2e2] flex gap-1.5 items-center px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse" />
                    <span className="text-[#b91c1c] text-[11px] font-bold uppercase tracking-wider">
                      Live Now
                    </span>
                  </div>
                )}
                {isUpcoming && (
                  <div className="bg-[#fffcc2] flex items-center px-2.5 py-1 rounded-full">
                    <span className="text-[#78350f] text-[11px] font-bold uppercase tracking-wider">
                      Upcoming
                    </span>
                  </div>
                )}
                {isPast && (
                  <div className="bg-[#cbd5e1]/50 flex items-center px-2.5 py-1 rounded-full">
                    <span className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider">
                      Past
                    </span>
                  </div>
                )}

                {/* Course Title */}
                <h4 className="text-[16px] font-bold text-[#0f172a] leading-[1.4] truncate w-full pr-1">
                  {course.title}
                </h4>

                {/* Timing / Topic Info */}
                <div className="flex gap-2 items-center text-slate-500 text-[13px] w-full">
                  {isLive ? (
                    <>
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate leading-[1.4]">
                        {course.nextClassTime} - {course.nextClassEndTime} · {course.nextClassTopic}
                      </span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className={`truncate leading-[1.4] ${isPast ? 'line-through opacity-70' : ''}`}>
                        {course.dateStr} · {course.nextClassTime} - {course.nextClassEndTime}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Primary CTA Button */}
              <div className="w-full">
                {isLive && (
                  <button 
                    onClick={() => alert(`Joining live classroom for: ${course.title}`)}
                    className="w-full h-10 bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center justify-center rounded-full font-bold text-[13px] shadow-sm shadow-red-500/10 transition-all cursor-pointer select-none active:scale-[0.98]"
                  >
                    Join Now
                  </button>
                )}
                {isUpcoming && (
                  <button 
                    onClick={() => alert(`Reminder set for: ${course.title}`)}
                    className="w-full h-10 bg-white border border-[#eab308] hover:bg-[#fffdf0] text-[#78350f] flex items-center justify-center rounded-full font-bold text-[13px] transition-all cursor-pointer select-none active:scale-[0.98]"
                  >
                    Set Reminder
                  </button>
                )}
                {isPast && (
                  <button 
                    onClick={() => alert(`Opening recording rewatch for: ${course.title}`)}
                    className="w-full h-10 bg-white border border-[#cbd5e1] hover:bg-slate-50 text-[#64748b] flex items-center justify-center rounded-full font-bold text-[13px] transition-all cursor-pointer select-none active:scale-[0.98]"
                  >
                    Rewatch
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
