import React, { useState, useRef, useEffect } from 'react';
import { Search, Award, Zap, ChevronDown, X, ArrowUpRight, Menu } from 'lucide-react';
import { highlightText } from '../utils/searchHighlight';
import { motion, AnimatePresence } from 'framer-motion';

interface SuggestionCourse {
  id: string;
  title: string;
  category: string;
  state?: string;
}

interface HeaderProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  courses: SuggestionCourse[];
  layoutVersion: 'V1' | 'V2';
  onLayoutVersionChange: (version: 'V1' | 'V2') => void;
  onMenuToggle?: () => void;
  isScrolled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  searchValue = '', 
  courses = [], 
  layoutVersion, 
  onLayoutVersionChange,
  onMenuToggle,
  isScrolled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = searchValue.trim()
    ? courses.filter(c => 
        c.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.category.toLowerCase().includes(searchValue.toLowerCase())
      ).slice(0, 5)
    : courses.slice(0, 4); // Default trending suggestions

  const handleSuggestionClick = (title: string) => {
    onSearchChange?.(title);
    setIsFocused(false);
  };

  const handleClearSearch = () => {
    onSearchChange?.('');
  };

  return (
    <header className={`bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex flex-col gap-4 z-40 ${
      layoutVersion === 'V2' ? 'relative' : 'sticky top-0'
    }`}>
      <div className="flex items-center justify-between gap-4">
        
        <div className={`flex items-center gap-2 sm:gap-3 flex-1 transition-all duration-300 ${
          isScrolled && layoutVersion === 'V2'
            ? 'max-w-[320px] xs:max-w-[380px] sm:max-w-[480px] md:max-w-[580px] lg:max-w-[640px]'
            : 'max-w-[200px] xs:max-w-[260px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[500px]'
        }`}>
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
            title="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <AnimatePresence>
            {isScrolled && layoutVersion === 'V2' && (
              <motion.h1
                initial={{ opacity: 0, width: 0, marginRight: 0 }}
                animate={{ opacity: 1, width: 'auto', marginRight: 12 }}
                exit={{ opacity: 0, width: 0, marginRight: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden text-lg sm:text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap shrink-0 hidden xs:block"
              >
                Live Classes
              </motion.h1>
            )}
          </AnimatePresence>
          
          {/* Search Bar with Suggestions */}
          <div ref={dropdownRef} className="relative w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search classes, tags, or categories..."
              value={searchValue}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {searchValue && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {isFocused && (
            <div className="absolute top-[52px] left-0 right-0 bg-white border border-slate-200/80 rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-3.5">
              
              {/* Header label */}
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {searchValue.trim() ? 'Matching Courses' : 'Trending Courses'}
              </div>

              {/* Suggestions List */}
              <div className="flex flex-col gap-1">
                {filteredSuggestions.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleSuggestionClick(course.title)}
                    className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-left w-full group"
                  >
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className="text-[13.5px] font-bold text-slate-800 truncate group-hover:text-primary-blue transition-colors">
                        {highlightText(course.title, searchValue)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">
                        {course.category}
                      </span>
                    </div>

                    {/* Status badge in suggestion */}
                    <div className="flex items-center gap-2 shrink-0">
                      {course.state === 'live' && (
                        <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
                          LIVE
                        </span>
                      )}
                      {course.state === 'enrolled' && (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          ENROLLED
                        </span>
                      )}
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
                
                {filteredSuggestions.length === 0 && (
                  <div className="text-slate-400 text-xs py-4 text-center">
                    No matching classes found.
                  </div>
                )}
              </div>

              {/* Tag suggestions */}
              {!searchValue.trim() && (
                <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Popular Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Gen AI', 'DSA', 'Next.js', 'System Design', 'Python'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleSuggestionClick(tag)}
                        className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-primary-blue text-slate-600 px-3 py-1.5 rounded-lg font-bold transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-6">
          {/* Variation Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-2xl flex items-center gap-0.5 border border-slate-200/40 shadow-sm shrink-0">
            <button
              onClick={() => onLayoutVersionChange('V1')}
              className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                layoutVersion === 'V1'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-750'
              }`}
            >
              V1
            </button>
            <button
              onClick={() => onLayoutVersionChange('V2')}
              className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                layoutVersion === 'V2'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-750'
              }`}
            >
              V2
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* Gamification Stats */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4">
            {/* Coins */}
            <div className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100/70 border border-amber-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl transition-all cursor-pointer">
              <span className="text-base sm:text-lg">🪙</span>
              <div className="flex flex-col">
                <span className="text-[12px] sm:text-[13px] font-bold text-amber-800 leading-none">4,820</span>
                <span className="text-[8px] sm:text-[9px] text-amber-600 font-medium tracking-wide mt-0.5">COINS</span>
              </div>
            </div>

            {/* Streak */}
            <div className="hidden lg:flex items-center gap-2 bg-orange-50 hover:bg-orange-100/70 border border-orange-200 px-4 py-2 rounded-2xl transition-all cursor-pointer">
              <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-orange-800 leading-none">12 Days</span>
                <span className="text-[9px] text-orange-600 font-medium tracking-wide mt-0.5">STREAK</span>
              </div>
            </div>

            {/* Leaderboard points */}
            <div className="hidden xl:flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-200 px-4 py-2 rounded-2xl transition-all cursor-pointer">
              <Award className="w-5 h-5 text-indigo-600" />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-indigo-800 leading-none">840 XP</span>
                <span className="text-[9px] text-indigo-600 font-medium tracking-wide mt-0.5">POINTS</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Sanjay Avatar"
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-[14px] font-semibold text-slate-800 leading-none group-hover:text-blue-600 transition-colors">Sanjay Kumar</span>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5">Premium Plan</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};
