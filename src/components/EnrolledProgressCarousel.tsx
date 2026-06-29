import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProgressCourse {
  id: string;
  title: string;
  image: string;
  completedClasses: number;
  totalClasses: number;
  badgeText: string;
  badgeTime: string;
  topic: string;
  state: 'starts-soon' | 'today' | 'recording' | 'upcoming';
  buttonText: string;
  colorTheme: 'orange' | 'yellow' | 'green' | 'blue';
}

const mockProgressCourses: ProgressCourse[] = [
  {
    id: 'ep1',
    title: 'Full Stack Dev with React',
    image: 'course_illustration_1.png',
    completedClasses: 8,
    totalClasses: 48,
    badgeText: 'STARTS SOON',
    badgeTime: '00:00',
    topic: 'React Hooks Deep Dive',
    state: 'starts-soon',
    buttonText: 'Get Ready →',
    colorTheme: 'orange'
  },
  {
    id: 'ep2',
    title: 'DSA for MAANG Interviews',
    image: 'course_illustration_1.png',
    completedClasses: 5,
    totalClasses: 45,
    badgeText: 'TODAY',
    badgeTime: '9:00 PM',
    topic: 'Binary Trees & Traversal',
    state: 'today',
    buttonText: 'Set Reminder →',
    colorTheme: 'yellow'
  },
  {
    id: 'ep3',
    title: 'Data Science Fundamentals',
    image: 'course_illustration_1.png',
    completedClasses: 3,
    totalClasses: 60,
    badgeText: 'RECORDING',
    badgeTime: '1h 23m',
    topic: 'Pandas & Data Cleaning',
    state: 'recording',
    buttonText: 'Watch Recording →',
    colorTheme: 'green'
  },
  {
    id: 'ep4',
    title: 'System Design Masterclass',
    image: 'course_illustration_1.png',
    completedClasses: 2,
    totalClasses: 30,
    badgeText: 'UPCOMING',
    badgeTime: 'Tomorrow',
    topic: 'Load Balancing Strategies',
    state: 'upcoming',
    buttonText: 'View Details →',
    colorTheme: 'blue'
  }
];

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
    <div className="space-y-4">
      {/* Title + Controls Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[12px] font-extrabold text-slate-450 uppercase tracking-widest leading-none">
            UP NEXT
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
          // Theme classes
          let themeStyles = {
            border: 'border-orange-100 hover:border-orange-200 hover:shadow-orange-500/5',
            badgeBg: 'bg-orange-50/70',
            badgeText: 'text-orange-600',
            dotColor: 'bg-orange-500',
            imgBg: 'bg-orange-50/50',
            buttonBg: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
            buttonShadow: 'shadow-orange-500/10'
          };
          
          if (course.colorTheme === 'yellow') {
            themeStyles = {
              border: 'border-amber-100 hover:border-amber-250 hover:shadow-amber-500/5',
              badgeBg: 'bg-amber-50/70',
              badgeText: 'text-amber-700',
              dotColor: 'bg-amber-500',
              imgBg: 'bg-amber-50/50',
              buttonBg: 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600',
              buttonShadow: 'shadow-amber-500/10'
            };
          } else if (course.colorTheme === 'green') {
            themeStyles = {
              border: 'border-emerald-100 hover:border-emerald-250 hover:shadow-emerald-500/5',
              badgeBg: 'bg-emerald-50/70',
              badgeText: 'text-emerald-700',
              dotColor: 'bg-emerald-500',
              imgBg: 'bg-emerald-50/50',
              buttonBg: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-650',
              buttonShadow: 'shadow-emerald-500/10'
            };
          } else if (course.colorTheme === 'blue') {
            themeStyles = {
              border: 'border-blue-100 hover:border-blue-250 hover:shadow-blue-500/5',
              badgeBg: 'bg-blue-50/70',
              badgeText: 'text-blue-600',
              dotColor: 'bg-blue-500',
              imgBg: 'bg-blue-50/50',
              buttonBg: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
              buttonShadow: 'shadow-blue-500/10'
            };
          }

          return (
            <div
              key={course.id}
              className={`flex-shrink-0 w-[280px] xs:w-[300px] sm:w-[325px] border flex flex-col hover:shadow-md transition-all duration-300 snap-start rounded-[24px] bg-white overflow-hidden ${themeStyles.border}`}
            >
              {/* Card Header Bar */}
              <div className={`flex items-center justify-between px-4 py-2.5 rounded-t-[24px] ${themeStyles.badgeBg}`}>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${themeStyles.dotColor} animate-pulse`} />
                  <span className={`text-[10px] font-extrabold tracking-wider ${themeStyles.badgeText}`}>
                    {course.badgeText}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  {course.badgeTime}
                </span>
              </div>

              {/* Card Content Area */}
              <div className="flex-1 p-4 flex items-center gap-3">
                {/* Left Image Area */}
                <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${themeStyles.imgBg}`}>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                
                {/* Right Text Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13.5px] font-bold text-slate-800 leading-snug truncate">
                    {course.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-500 font-semibold truncate mt-0.5">
                    {course.topic}
                  </p>
                  <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">
                    {course.completedClasses} of {course.totalClasses} Classes
                  </p>
                </div>
              </div>

              {/* Card Button */}
              <div className="px-4 pb-4">
                <button 
                  onClick={() => alert(`Action triggered for: ${course.title}`)}
                  className={`w-full h-10 text-white font-extrabold text-[12px] rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.97] cursor-pointer shadow-sm ${themeStyles.buttonBg} ${themeStyles.buttonShadow}`}
                >
                  <span>{course.buttonText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
