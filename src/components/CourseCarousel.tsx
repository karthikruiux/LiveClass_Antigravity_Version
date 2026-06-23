import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CourseCard } from './CourseCard';

interface Course {
  id: string;
  title: string;
  image: string;
  tags: string[];
  classesCount: number;
  runningBatches: number;
  upcomingBatches: number;
  category: 'placement' | 'dsa' | 'ai' | 'backend' | 'frontend' | 'revision';
}

interface CourseCarouselProps {
  courses: Course[];
  onEnroll?: (courseId: string) => void;
}

export const CourseCarousel: React.FC<CourseCarouselProps> = ({ courses, onEnroll }) => {
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
  }, [courses]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-6 relative group/carousel">
      {/* Navigation Arrows */}
      <div className="absolute -left-6 top-[200px] z-20 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          className={`w-14 h-14 rounded-full border border-slate-200 bg-white shadow-xl flex items-center justify-center pointer-events-auto transition-all active:scale-95 ${
            canScrollLeft ? 'text-slate-800 hover:bg-slate-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute -right-6 top-[200px] z-20 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className={`w-14 h-14 rounded-full border border-slate-200 bg-white shadow-xl flex items-center justify-center pointer-events-auto transition-all active:scale-95 ${
            canScrollRight ? 'text-slate-800 hover:bg-slate-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Slide Container */}
      <div
        ref={containerRef}
        className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {courses.map((course) => (
          <div key={course.id} className="w-full md:w-[48%] xl:w-[31.5%] flex-shrink-0 snap-start">
            <CourseCard
              {...course}
              onEnroll={() => onEnroll?.(course.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
