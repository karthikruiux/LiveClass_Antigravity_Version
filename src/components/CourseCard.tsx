import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Flame, 
  Code2, 
  RefreshCw, 
  Info
} from 'lucide-react';
import { highlightText } from '../utils/searchHighlight';

interface CourseCardProps {
  id: string;
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
  scheduleType?: 'mwf' | 'tts' | 'weekend';
  
  // New Figma cases-wise properties
  isTrending?: boolean;
  isNew?: boolean;
  showSaleableInfo?: boolean;
  saleableText?: string;
  showStudentData?: boolean;
  isProject?: boolean;
  projectTitle?: string;
  isRevision?: boolean;
  completedBatches?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
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
  category = 'placement',
  scheduleType,
  
  // Destructure new properties
  isTrending = false,
  isNew = false,
  showSaleableInfo = false,
  saleableText = '',
  showStudentData = false,
  isProject = false,
  projectTitle = '',
  isRevision = false,
  completedBatches = 0
}) => {
  // Resolve enrollment, live, and completed status
  const isEnrolled = typeof isEnrolledProp === 'boolean' ? isEnrolledProp : (state === 'enrolled' || state === 'live');
  const isLive = classStatus ? (classStatus === 'live') : (state === 'live');
  const isCompleted = classStatus ? (classStatus === 'past') : (state === 'enrolled' && completedClasses === classesCount);

  const progressPercent = isEnrolled && completedClasses ? Math.round((completedClasses / classesCount) * 100) : 0;

  // Resolve category display label
  const getDisplayCategory = () => {
    if (isRevision || category === 'revision') return 'Revision';
    if (category === 'ai') return 'Generative AI';
    
    const titleLower = title.toLowerCase();
    const tagsLower = tags.map(t => t.toLowerCase());
    
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

  // Get style colors for category pill
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

  // Illustration background colors based on category
  const categoryBgMap: Record<string, string> = {
    placement: 'bg-blue-50/80',
    dsa: 'bg-purple-50/80',
    ai: 'bg-rose-50/80',
    backend: 'bg-emerald-50/80',
    frontend: 'bg-amber-50/80',
    revision: 'bg-indigo-50/80'
  };

  const illustrationBgClass = categoryBgMap[category] || 'bg-slate-50';

  // Render the bottom-left schedule badges (MWF, TTS, Weekend) sticking out of content area
  const renderScheduleBadge = () => {
    const type = scheduleType || (category === 'frontend' ? 'weekend' : (parseInt(id.replace(/\D/g, '') || '0') % 2 === 1 ? 'mwf' : 'tts'));

    if (type === 'weekend') {
      return (
        <div className="absolute bg-white flex items-center left-0 pl-6 pr-4 py-2 rounded-tr-[16px] top-[-24px] border-t border-r border-slate-200/50 shadow-[1px_-1px_3px_0px_rgba(15,23,42,0.02)] z-10">
          <p className="font-sans font-medium text-[12px] text-[#b45309] tracking-wider whitespace-nowrap">
            Only Weekend
          </p>
        </div>
      );
    }

    if (type === 'mwf') {
      return (
        <div className="absolute bg-white flex items-center left-0 pl-6 pr-4 py-2 rounded-tr-[16px] top-[-24px] border-t border-r border-slate-200/50 shadow-[1px_-1px_3px_0px_rgba(15,23,42,0.02)] z-10">
          <p className="font-sans font-medium text-[12px] text-[#b45309] tracking-wider whitespace-nowrap">
            <span className="font-bold">M </span>
            <span className="text-[#d1d1d1]">T</span>
            <span className="font-bold">{` W `}</span>
            <span className="text-[#d1d1d1]">T</span>
            <span className="font-bold">{` F `}</span>
            <span className="text-[#d1d1d1]">S S</span>
          </p>
        </div>
      );
    }

    return (
      <div className="absolute bg-white flex items-center left-0 pl-6 pr-4 py-2 rounded-tr-[16px] top-[-24px] border-t border-r border-slate-200/50 shadow-[1px_-1px_3px_0px_rgba(15,23,42,0.02)] z-10">
        <p className="font-sans font-medium text-[12px] text-[#b45309] tracking-wider whitespace-nowrap">
          <span className="text-[#d1d1d1]">M</span>
          <span className="font-bold">{` T `}</span>
          <span className="text-[#d1d1d1]">W</span>
          <span className="font-bold">{` T `}</span>
          <span className="text-[#d1d1d1]">F</span>
          <span className="font-bold">{` S`}</span>
          <span className="text-[#d1d1d1]">{` S`}</span>
        </p>
      </div>
    );
  };

  // Render top-right absolute ribbons (Enrolled, Trending, New) with thick border masking
  const renderTopRightRibbon = () => {
    if (isEnrolled) {
      return (
        <div 
          className="absolute border-8 border-white right-[-1px] top-[-1px] rounded-bl-[24px] rounded-tr-[24px] h-[36px] px-6 py-1 flex items-center justify-center bg-gradient-to-r from-[#79d60b] to-[#16a34c] z-20 shadow-[0_2px_8px_rgba(22,163,74,0.15)]"
        >
          <span className="text-white text-[13px] font-bold tracking-wide">
            Enrolled
          </span>
        </div>
      );
    }

    if (isTrending) {
      return (
        <div 
          className="absolute border-8 border-white right-[-1px] top-[-1px] rounded-bl-[24px] rounded-tr-[24px] h-[36px] px-5 py-1 flex items-center justify-center gap-1 bg-gradient-to-r from-[#f97316] to-[#eab308] z-20 shadow-[0_2px_8px_rgba(249,115,22,0.15)]"
        >
          <Flame className="w-3.5 h-3.5 text-white fill-current animate-pulse shrink-0" />
          <span className="text-white text-[13px] font-bold tracking-wide">
            Trending
          </span>
        </div>
      );
    }

    if (isNew) {
      return (
        <div 
          className="absolute border-8 border-white right-[-1px] top-[-1px] rounded-bl-[24px] rounded-tr-[24px] h-[36px] px-6 py-1 flex items-center justify-center bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] z-20 shadow-[0_2px_8px_rgba(59,130,246,0.15)]"
        >
          <span className="text-white text-[13px] font-bold tracking-wide">
            New
          </span>
        </div>
      );
    }

    return null;
  };

  // Render marketing banners at the bottom of the card
  const renderMarketingBanner = () => {
    // Marketing banners are displayed only on default (not enrolled) cards
    if (isEnrolled) return null;

    if (showSaleableInfo) {
      return (
        <div className="bg-[#fef3c7] h-[36px] flex items-center justify-center w-full px-4 text-center shrink-0 border-t border-[#fde68a] rounded-b-[24px]">
          <p className="text-[#78350f] text-[11.5px] font-medium truncate">
            {saleableText || "MongoDB is India's most in-demand database skill"}
          </p>
        </div>
      );
    }

    if (showStudentData) {
      return (
        <div className="bg-[#fef3c7] h-[36px] flex items-center justify-center gap-2 w-full px-4 shrink-0 border-t border-[#fde68a] rounded-b-[24px]">
          <div className="flex items-center -space-x-1.5 shrink-0">
            <img 
              className="w-5 h-5 rounded-full border border-white object-cover" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80" 
              alt="avatar" 
            />
            <img 
              className="w-5 h-5 rounded-full border border-white object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80" 
              alt="avatar" 
            />
            <img 
              className="w-5 h-5 rounded-full border border-white object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80" 
              alt="avatar" 
            />
          </div>
          <p className="text-[#78350f] text-[11.5px] font-medium">
            <span className="font-bold">2K+ </span>Students already started
          </p>
        </div>
      );
    }

    return null;
  };

  const hasBanner = !isEnrolled && (showSaleableInfo || showStudentData);

  return (
    <motion.div
      className={`w-[352px] h-[340px] border rounded-[24px] overflow-hidden flex flex-col justify-between transition-all duration-300 relative group select-none ${
        isLive && isEnrolled
          ? 'bg-red-50/20 border-red-200 shadow-[0_4px_16px_rgba(239,68,68,0.06)]' 
          : isLive && !isEnrolled
          ? 'bg-rose-50/5 border-rose-300 hover:border-rose-400 hover:shadow-md'
          : isEnrolled
          ? 'bg-emerald-50/15 border-emerald-200 shadow-[0_4px_16px_rgba(16,185,129,0.06)]'
          : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
      }`}
      whileHover={{ y: -4 }}
    >
      {/* Absolute top-right ribbon badges */}
      {renderTopRightRibbon()}

      {/* Top Section - Illustration Container */}
      <div className="p-2 flex-1 min-h-0 relative">
        <div className={`h-full w-full rounded-[20px] border-8 border-white flex items-center justify-center overflow-hidden relative group shadow-sm ${illustrationBgClass}`}>
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />

          {/* Top-Left Specialty Badges (Project, Revision) */}
          {isProject && (
            <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm text-blue-600 text-[11px] font-bold z-10 border border-blue-100/30">
              <Code2 className="w-3 h-3" />
              <span>Project</span>
            </div>
          )}

          {isRevision && (
            <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm text-indigo-600 text-[11px] font-bold z-10 border border-indigo-100/30">
              <RefreshCw className="w-3 h-3" />
              <span>Revision</span>
            </div>
          )}

          {/* Fallback to Live Now badge if live and NOT enrolled */}
          {isLive && !isEnrolled && (
            <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-red-600/20 z-10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              <span>LIVE NOW</span>
            </div>
          )}
          
          <img
            src={image}
            alt={title}
            className="object-contain max-h-[90%] max-w-[90%] select-none filter drop-shadow-[0_8px_12px_rgba(15,23,42,0.06)] relative z-0"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className={`px-5 shrink-0 flex flex-col justify-between relative ${hasBanner ? 'pt-3 pb-2' : 'pt-3 pb-4'}`}>
        {renderScheduleBadge()}

        <div className="space-y-2">
          {/* Category Pill Badge Tag */}
          <div className="flex">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border leading-none select-none ${getCategoryStyles()}`}>
              {getDisplayCategory()}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[16px] md:text-[17px] font-bold text-slate-900 leading-snug font-heading tracking-tight line-clamp-2 h-[44px]">
            {highlightText(title, searchQuery)}
          </h3>

          {/* Project Chip OR Tech Tags */}
          {isProject ? (
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 flex items-center gap-2 w-full mt-1 shrink-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[11.5px] text-slate-600 font-semibold truncate">
                Project: {projectTitle || `${title} Clone`}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 h-[22px] overflow-hidden">
              {tags.slice(0, 3).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-[10.5px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg font-semibold"
                >
                  {highlightText(tag, searchQuery)}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-[10.5px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded-lg">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Dynamic content depending on course state */}
        <div className="space-y-2">
          
          {/* Enrolled Progress / Completed State details */}
          {isEnrolled ? (
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <div className="flex gap-1.5 items-center leading-none text-[12px] font-semibold text-slate-500">
                  <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 fill-current" />
                  <span>
                    <span className="font-bold text-slate-900">{completedClasses} of {classesCount}</span> Classes completed
                  </span>
                </div>
                
                {/* Live Now red text at bottom-right of content area */}
                {isLive && (
                  <div className="flex items-center gap-1 text-red-500 text-[10.5px] font-bold animate-pulse shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block"></span>
                    <span>Live Now</span>
                  </div>
                )}
              </div>
              
              <div className="w-full bg-[#e0e6ff] h-[6px] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-[#002eff]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            /* Not Enrolled State details */
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-600 text-[12px] font-semibold">
                <Play className="w-3.5 h-3.5 text-slate-400 shrink-0 fill-current" />
                <span>
                  <span className="font-bold text-slate-900">{classesCount}</span> Curriculum Classes
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-[12px] font-semibold">
                {/* Completed batch chip in gray, otherwise Running in green */}
                {completedBatches > 0 || isCompleted ? (
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                    {completedBatches || 1} Completed
                  </span>
                ) : (
                  runningBatches > 0 && (
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                      {runningBatches} Running
                    </span>
                  )
                )}
                
                {upcomingBatches > 0 && (
                  <span className="bg-yellow-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-100">
                    {upcomingBatches} Upcoming
                  </span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons (Fades/reveals beautifully on desktop hover, always visible on mobile) */}
        <div className="mt-1 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0">
          {isEnrolled ? (
            /* Enrolled Split Buttons Layout */
            <div className="flex gap-2 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll?.();
                }}
                className="w-1/2 h-[36px] rounded-[10px] border border-slate-200 hover:bg-slate-50 text-slate-700 text-[12px] font-bold active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 bg-white"
              >
                <Info className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Details</span>
              </button>
              
              {isLive ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnroll?.();
                  }}
                  className="w-1/2 h-[36px] rounded-[10px] bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center gap-1 shadow-md shadow-red-500/10 hover:shadow-red-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  <span className="text-[12px] font-bold tracking-wide uppercase">Join Live</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnroll?.();
                  }}
                  className="w-1/2 h-[36px] rounded-[10px] border border-slate-200 text-slate-700 text-[12px] font-semibold bg-white hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer truncate px-1"
                >
                  {nextClassTime ? nextClassTime : "Resume Class"}
                </button>
              )}
            </div>
          ) : (
            /* Not Enrolled Single Buttons */
            isLive ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll?.();
                }}
                className="w-full h-[36px] rounded-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <span className="text-[12px] font-bold uppercase tracking-wider">Enroll to Join Live</span>
              </button>
            ) : isCompleted ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll?.();
                }}
                className="w-full h-[36px] rounded-[10px] border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-150 cursor-pointer bg-white"
              >
                <span className="text-[12px] font-bold">Enroll to Watch</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll?.();
                }}
                className="w-full h-[36px] rounded-[10px] border border-blue-600 hover:bg-blue-50/50 text-blue-600 flex items-center justify-center gap-1 active:scale-[0.98] transition-all duration-150 cursor-pointer bg-white"
              >
                <span className="text-[12px] font-bold">Explore & Enroll</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )
          )}
        </div>

      </div>

      {/* Bottom Marketing Banners (Saleable text / Student proof) */}
      {renderMarketingBanner()}

    </motion.div>
  );
};
