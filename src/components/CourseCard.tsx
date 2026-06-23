import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, ArrowRight, Play, Radio, Calendar, CheckCircle2 } from 'lucide-react';
import { highlightText } from '../utils/searchHighlight';

interface CourseCardProps {
  title: string;
  image: string;
  tags: string[];
  classesCount: number;
  runningBatches: number;
  upcomingBatches: number;
  onEnroll?: () => void;
  state?: 'not-enrolled' | 'enrolled' | 'live';
  isEnrolled?: boolean;
  classStatus?: 'live' | 'upcoming' | 'past';
  completedClasses?: number;
  nextClassTime?: string;
  searchQuery?: string;
  category?: 'placement' | 'dsa' | 'ai' | 'backend' | 'frontend' | 'revision';
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  image,
  tags,
  classesCount,
  runningBatches,
  upcomingBatches,
  onEnroll,
  state = 'not-enrolled',
  isEnrolled: isEnrolledProp,
  classStatus,
  completedClasses = 0,
  nextClassTime = '',
  searchQuery = '',
  category = 'placement'
}) => {
  const isEnrolled = typeof isEnrolledProp === 'boolean' ? isEnrolledProp : (state === 'enrolled' || state === 'live');
  const isLive = classStatus ? (classStatus === 'live') : (state === 'live');
  const isCompleted = classStatus ? (classStatus === 'past') : (state === 'enrolled' && completedClasses === classesCount);

  const progressPercent = isEnrolled && completedClasses ? Math.round((completedClasses / classesCount) * 100) : 0;

  const getDisplayCategory = () => {
    const titleLower = title.toLowerCase();
    const tagsLower = tags.map(t => t.toLowerCase());
    
    if (category === 'revision') return 'Revision';
    if (category === 'ai') return 'Generative AI';
    
    if (titleLower.includes('interview') || tagsLower.some(t => t.includes('interview'))) {
      return 'Interview Prep';
    }
    if (category === 'placement') return 'Placement Prep';
    
    if (category === 'backend' || category === 'frontend' || tagsLower.some(t => t.includes('project') || t.includes('build'))) {
      return 'Projects';
    }
    if (category === 'dsa' || tagsLower.some(t => t.includes('challenge') || t.includes('leetcode') || t.includes('algorithm'))) {
      return 'Challenges';
    }
    
    return (category as string).charAt(0).toUpperCase() + (category as string).slice(1);
  };

  const getCategoryStyles = () => {
    const disp = getDisplayCategory();
    switch (disp) {
      case 'Placement Prep':
        return 'text-blue-600 bg-blue-50/50 border-blue-100';
      case 'Revision':
        return 'text-indigo-600 bg-indigo-50/50 border-indigo-100';
      case 'Interview Prep':
        return 'text-violet-600 bg-violet-50/50 border-violet-100';
      case 'Projects':
        return 'text-emerald-700 bg-emerald-50/50 border-emerald-100';
      case 'Challenges':
        return 'text-fuchsia-600 bg-fuchsia-50/50 border-fuchsia-100';
      case 'Generative AI':
        return 'text-rose-600 bg-rose-50/50 border-rose-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // Custom colors linked with course type (category)
  const categoryBgMap: Record<string, string> = {
    placement: 'bg-blue-50',       // Placement -> light blue
    dsa: 'bg-purple-50',           // DSA -> light purple
    ai: 'bg-rose-50',              // AI -> light rose
    backend: 'bg-emerald-50',      // Backend -> light emerald
    frontend: 'bg-amber-50',       // Frontend -> light amber
    revision: 'bg-indigo-50'       // Revision -> light indigo
  };

  const illustrationBgClass = categoryBgMap[category] || 'bg-slate-100';

  return (
    <motion.div
      className={`w-full border rounded-[22px] overflow-hidden flex flex-col transition-all duration-300 relative cursor-pointer ${
        isLive && isEnrolled
          ? 'bg-red-50/20 border-red-200 shadow-[0_4px_16px_rgba(239,68,68,0.06)]' 
          : isLive && !isEnrolled
          ? 'bg-rose-50/5 border-rose-300 hover:border-rose-400 hover:shadow-md'
          : isEnrolled
          ? 'bg-emerald-50/15 border-emerald-200 shadow-[0_4px_16px_rgba(16,185,129,0.06)]'
          : 'bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-md'
      }`}
      style={{ minHeight: '370px' }}
      whileHover={{ y: -4 }}
    >
      {/* Top Section - Illustration Container */}
      <div className="p-2.5">
        <div className={`h-[125px] rounded-[14px] flex items-center justify-center overflow-hidden relative group ${illustrationBgClass}`}>
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />

          {/* Live Indicator Badge */}
          {isLive && (
            <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-red-600/20 z-10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              <span>LIVE NOW</span>
            </div>
          )}

          {/* Enrolled Badge */}
          {isEnrolled && (
            <div className={`absolute top-2.5 ${isLive ? 'left-[95px]' : 'left-2.5'} bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-emerald-600/20 z-10`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>Enrolled</span>
            </div>
          )}

          {/* Completed Badge */}
          {!isLive && isCompleted && (
            <div className={`absolute top-2.5 ${isEnrolled ? 'left-[95px]' : 'left-2.5'} bg-slate-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-slate-600/20 z-10`}>
              <span>Past Class</span>
            </div>
          )}
          
          <img
            src={image}
            alt={title}
            className="object-contain max-h-[100px] select-none filter drop-shadow-[0_8px_12px_rgba(15,23,42,0.06)] relative z-0"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="px-5 pb-3 pt-2 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Category Pill Badge Tag */}
          <div className="flex">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border leading-none select-none ${getCategoryStyles()}`}>
              {getDisplayCategory()}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[17px] lg:text-[18px] font-bold text-text-primary leading-snug font-heading tracking-tight line-clamp-2">
            {highlightText(title, searchQuery)}
          </h3>

          {/* Tech Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[11px] text-text-secondary bg-slate-100 px-2.5 py-0.5 rounded-lg font-semibold"
              >
                {highlightText(tag, searchQuery)}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[11px] text-text-secondary font-bold bg-slate-100 px-2 py-0.5 rounded-lg">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic content depending on course state */}
        <div className="space-y-3 mt-4">
          
          {/* Enrolled & Completed/Past course state details */}
          {isEnrolled && isCompleted && (
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Course Progress</span>
                  <span>{classesCount}/{classesCount} (100%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full w-full" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[11.5px] font-semibold">
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span>All {classesCount} Recorded Classes Available</span>
              </div>
            </div>
          )}

          {/* Enrolled & Live course state details */}
          {isEnrolled && isLive && (
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Course Progress</span>
                  <span>{completedClasses}/{classesCount} ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-red-600 animate-pulse text-[11px] font-bold bg-red-50 border border-red-100/80 px-2.5 py-1 rounded-xl">
                <Radio className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Active Classroom Live Now</span>
              </div>
            </div>
          )}

          {/* Enrolled & Upcoming course state details */}
          {isEnrolled && !isLive && !isCompleted && (
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Course Progress</span>
                  <span>{completedClasses}/{classesCount} ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              {nextClassTime && (
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{nextClassTime}</span>
                </div>
              )}
            </div>
          )}

          {/* Not Enrolled & Live course state details */}
          {!isEnrolled && isLive && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-bold bg-rose-50 border border-rose-100/80 px-2.5 py-1 rounded-xl">
                <Radio className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Live Class In Progress</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary pl-0.5">
                <Monitor className="w-4 h-4 text-rose-500 stroke-[2]" />
                <span className="text-[12px] font-semibold">
                  Enroll to access active classroom
                </span>
              </div>
            </div>
          )}

          {/* Not Enrolled & Completed/Past course state details */}
          {!isEnrolled && isCompleted && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-bold bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
                <Play className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{classesCount} Recorded Classes Available</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary pl-0.5">
                <Monitor className="w-4 h-4 text-slate-400 stroke-[2]" />
                <span className="text-[12px] font-semibold">
                  Full recorded syllabus access
                </span>
              </div>
            </div>
          )}

          {/* Not Enrolled & Upcoming course state details */}
          {!isEnrolled && !isLive && !isCompleted && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary pl-0.5">
                <Monitor className="w-4 h-4 text-primary-blue stroke-[2]" />
                <span className="text-[12px] font-semibold">
                  {classesCount} Curriculum Classes
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-[12px] font-semibold pl-0.5">
                {runningBatches > 0 && (
                  <span className="bg-badge-running text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    {runningBatches} Running
                  </span>
                )}
                {upcomingBatches > 0 && (
                  <span className="bg-badge-upcoming text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                    {upcomingBatches} Upcoming
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Action Buttons depending on State */}
      <div className="px-5 pb-5 pt-1.5 mt-auto">
        {isEnrolled && isLive ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            className="w-full h-[40px] rounded-[12px] bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-red-500/10 hover:shadow-red-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[13px] font-bold uppercase tracking-wider">Join Live Class</span>
          </button>
        ) : isEnrolled && isCompleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            className="w-full h-[40px] rounded-[12px] bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="text-[13px] font-bold">Watch Recording</span>
          </button>
        ) : isEnrolled ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            className="w-full h-[40px] rounded-[12px] bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="text-[13px] font-bold">Resume Class</span>
          </button>
        ) : !isEnrolled && isLive ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            className="w-full h-[40px] rounded-[12px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span className="text-[13px] font-bold uppercase tracking-wider">Enroll to Join Live</span>
          </button>
        ) : !isEnrolled && isCompleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            className="w-full h-[40px] rounded-[12px] border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span className="text-[13px] font-bold">Enroll to Watch</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            className="w-full h-[40px] rounded-[12px] border border-blue-600 hover:bg-blue-50/50 text-blue-600 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span className="text-[13px] font-bold">Explore & Enroll</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
