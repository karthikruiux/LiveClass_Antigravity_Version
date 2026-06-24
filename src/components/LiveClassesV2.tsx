import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Calendar, 
  Monitor, 
  FileText, 
  Clock,
  Download,
  Award,
  Trophy,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { CourseCard } from './CourseCard';
import { EnrolledProgressCarousel } from './EnrolledProgressCarousel';
import { CourseCarousel } from './CourseCarousel';

interface Course {
  id: string;
  title: string;
  image: string;
  tags: string[];
  classesCount: number;
  runningBatches: number;
  upcomingBatches: number;
  category: 'placement' | 'dsa' | 'ai' | 'backend' | 'frontend' | 'revision';
  state?: 'not-enrolled' | 'enrolled' | 'live';
  isEnrolled?: boolean;
  classStatus?: 'live' | 'upcoming' | 'past';
  completedClasses?: number;
  nextClassTime?: string;
  scheduleType?: 'mwf' | 'tts' | 'weekend';
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

interface LiveClassesV2Props {
  coursesList: Course[];
  handleEnrollCourse: (id: string) => void;
  handleJoinClass: (id: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  isScrolled?: boolean;
}

// Mock Search databases for Global Search Modal
const mockCoursesData = [
  { id: 'mc1', title: 'Full Stack MERN Developer Elite', desc: 'Master MongoDB, Express, React, Node.js with production scale.', duration: '9 Months' },
  { id: 'mc2', title: 'Data Science & Machine Learning Pro', desc: 'Stats, Python, Scikit-Learn, TensorFlow, and Deep Learning.', duration: '6 Months' },
  { id: 'mc3', title: 'Generative AI & LLM Engineering', desc: 'LangChain, Vector DBs, Fine-tuning, RAG, and prompt engineering.', duration: '3 Months' },
  { id: 'mc4', title: 'System Design Interview Prep', desc: 'Scale systems from zero to billions of daily active users.', duration: '2 Months' }
];

const mockEventsData = [
  { id: 'me1', title: 'System Design Bootcamp by Director of Eng', time: 'Today, 6:00 PM', speaker: 'Siddharth (Ex-Google)' },
  { id: 'me2', title: 'React 19 Hooks & Suspense Workshop', time: 'Tomorrow, 4:00 PM', speaker: 'Arjun (Vercel Core Contributor)' },
  { id: 'me3', title: 'Mock Interview Marathon with FAANG Mentors', time: '26th June, 10:00 AM', speaker: 'Panel of 4 Mentors' }
];

const mockResourcesData = [
  { id: 'mr1', title: 'DSA Ultimate Cheat Sheet & Checklist', type: 'PDF • 45 pages', category: 'DSA' },
  { id: 'mr2', title: 'System Design Template & Production Checklist', type: 'Markdown • 12 pages', category: 'Architecture' },
  { id: 'mr3', title: 'Clean Code Best Practices in JavaScript', type: 'PDF • 8 pages', category: 'Clean Code' }
];



const workshopItems = [
  {
    id: 'w1',
    title: 'AI Agent & LLM Fine-tuning Masterclass',
    desc: 'Learn to build agentic workflows, fine-tune models with LoRA/QLoRA, and evaluate alignment metrics.',
    category: 'projects',
    type: 'weekly',
    status: 'upcoming',
    date: 'Wednesday, 6:00 PM',
    mentor: 'Dr. Sarah (AI Scientist)'
  },
  {
    id: 'w2',
    title: 'Vercel Next.js 15 App Router Deep-Dive',
    desc: 'Master React Server Components, Server Actions, PPR (Partial Prerendering), and advanced caching mechanics.',
    category: 'revision',
    type: 'weekly',
    status: 'live',
    date: 'Live Now',
    mentor: 'Arjun (Core Contributor)'
  },
  {
    id: 'w3',
    title: 'System Design Mock Interview: Uber Scale API Gateway',
    desc: 'Watch a live mock interview mapping out a geo-distributed API gateway with sub-millisecond route resolution.',
    category: 'interview-prep',
    type: 'weekly',
    status: 'past',
    date: 'Recorded yesterday',
    mentor: 'Siddharth (Uber Principal SWE)'
  },
  {
    id: 'w4',
    title: '3-Hour UI/UX Design to Frontend Hand-off Sprints',
    desc: 'Learn visual principles, layout design systems, and fast code implementation using CSS variables.',
    category: 'projects',
    type: 'weekend',
    status: 'upcoming',
    date: 'Saturday, 4:00 PM',
    mentor: 'Sophie (Design Lead, Figma)'
  },
  {
    id: 'w5',
    title: 'DSA Crack-a-thon: Graph Algorithms Simplified',
    desc: 'Solve 10 complex graph traversal and shortest path problems in this weekend intensive marathon.',
    category: 'challenges',
    type: 'weekend',
    status: 'live',
    date: 'Live Now',
    mentor: 'Divya (ACM-ICPC Finalist)'
  }
];

const resourceItems = [
  {
    id: 'r1',
    title: 'System Design Interview Cheat Sheet v2.4',
    type: 'PDF • 48 pages',
    category: 'interview-prep',
    typeFilter: 'weekly',
    downloads: '12k'
  },
  {
    id: 'r2',
    title: 'Ultimate Resume Checklist & ATS Guidelines',
    type: 'Markdown • 5 pages',
    category: 'placement',
    typeFilter: 'weekly',
    downloads: '24k'
  },
  {
    id: 'r3',
    title: 'React Hooks Performance Audit Guide',
    type: 'PDF • 12 pages',
    category: 'revision',
    typeFilter: 'weekly',
    downloads: '8.4k'
  },
  {
    id: 'r4',
    title: 'Weekend Hackathon Boilerplate: Next.js/Supabase',
    type: 'ZIP Repository',
    category: 'projects',
    typeFilter: 'weekend',
    downloads: '3.2k'
  },
  {
    id: 'r5',
    title: 'Weekly DSA Editorial Archive: Graphs & Trees',
    type: 'PDF • 80 pages',
    category: 'challenges',
    typeFilter: 'weekly',
    downloads: '15k'
  },
  {
    id: 'r6',
    title: 'LeetCode Patterns Study Matrix (Spreadsheet)',
    type: 'XLSX Sheet',
    category: 'challenges',
    typeFilter: 'weekend',
    downloads: '18k'
  }
];

export const LiveClassesV2: React.FC<LiveClassesV2Props> = ({
  coursesList,
  handleEnrollCourse,
  handleJoinClass,
  searchTerm = '',
  onSearchChange,
  isScrolled = false
}) => {
  // 1. Primary Filter State
  const [primaryFilter, setPrimaryFilter] = useState<'weekly' | 'weekend'>('weekly');
  
  // 2. Secondary Filter State
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([]);
  
  // 3. Third Filter State (Status)
  const [activeStatus, setActiveStatus] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  // Side-tab active state for V2 Class Sessions hub
  const [activeSessionsTab, setActiveSessionsTab] = useState<'live' | 'upcoming' | 'past'>('live');

  // Simulated Loading State
  const [isSimulatedLoading, setIsSimulatedLoading] = useState<boolean>(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search Modal States
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(window.location.search.includes('q=') ? decodeURIComponent(window.location.search.split('q=')[1]) : '');
  const [activeSearchTab, setActiveSearchTab] = useState<'live' | 'courses' | 'events' | 'resources'>('live');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Secondary chips catalog
  const secondaryChips = [
    { id: 'placement', label: 'Placement' },
    { id: 'revision', label: 'Revision' },
    { id: 'interview-prep', label: 'Interview Prep' },
    { id: 'projects', label: 'Projects' },
    { id: 'challenges', label: 'Challenges' }
  ];

  // Status badges configuration
  const statusFilters: {
    id: 'live' | 'upcoming' | 'past';
    label: string;
    icon: string;
    activeBg: string;
    activeBorder: string;
    activeText: string;
  }[] = [
    { 
      id: 'live', 
      label: 'Live Now', 
      icon: '🔴', 
      activeBg: 'bg-red-50', 
      activeBorder: 'border-red-200', 
      activeText: 'text-red-700' 
    },
    { 
      id: 'upcoming', 
      label: 'Upcoming', 
      icon: '📅', 
      activeBg: 'bg-blue-50', 
      activeBorder: 'border-blue-200', 
      activeText: 'text-blue-700' 
    },
    { 
      id: 'past', 
      label: 'Past (with recording)', 
      icon: '📼', 
      activeBg: 'bg-emerald-50', 
      activeBorder: 'border-emerald-200', 
      activeText: 'text-emerald-700' 
    }
  ];

  // Keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus input in modal
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      setSearchQuery('');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Clean timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Trigger brief shimmer loading overlay when filters change for smooth native transition feel
  const triggerSimulatedLoading = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsSimulatedLoading(true);
    loadingTimeoutRef.current = setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 350);
  };

  const handlePrimaryChange = (val: 'weekly' | 'weekend') => {
    if (val === primaryFilter) return;
    setPrimaryFilter(val);
    triggerSimulatedLoading();
  };

  const handleSecondaryClick = (filterId: string) => {
    if (selectedSecondary.includes(filterId)) {
      setSelectedSecondary([]); // Single select toggle
    } else {
      setSelectedSecondary([filterId]);
    }
    triggerSimulatedLoading();
  };

  const handleStatusChange = (val: 'all' | 'live' | 'upcoming' | 'past') => {
    if (val === activeStatus) {
      setActiveStatus('all'); // Reset if clicked again
    } else {
      setActiveStatus(val);
    }
    triggerSimulatedLoading();
  };

  const handleClearAllFilters = () => {
    setIsSimulatedLoading(true);
    setPrimaryFilter('weekly');
    setSelectedSecondary([]);
    setActiveStatus('all');
    setSearchQuery('');
    onSearchChange?.('');
    
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => {
      setIsSimulatedLoading(false);
    }, 350);
  };

  // Filter Helper Function
  const filterList = <T extends { category: string; type?: string; status?: string; typeFilter?: string }>(list: T[]): T[] => {
    return list.filter(item => {
      // 1. Primary Filter
      const itemType = item.type || item.typeFilter;
      if (itemType && itemType !== primaryFilter) return false;

      // 2. Secondary Filter
      if (selectedSecondary.length > 0 && !selectedSecondary.includes(item.category)) return false;

      // 3. Third Filter (Status)
      if (item.status && activeStatus !== 'all' && item.status !== activeStatus) return false;

      return true;
    });
  };

  // Filter real courses from coursesList
  const filteredCoursesList = coursesList.filter(course => {
    // 0. Global Search Term Filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matchSearch = course.title.toLowerCase().includes(query) ||
        course.tags.some(t => t.toLowerCase().includes(query)) ||
        course.category.toLowerCase().includes(query);
      if (!matchSearch) return false;
    }

    // 1. Primary Filter (Weekly vs Weekend)
    // If 'weekend', match category 'frontend' (labeled "Weekend Batches") or if the tags contain 'Weekend'
    // If 'weekly', match other categories.
    const isWeekendCourse = course.category === 'frontend' || course.tags.some(t => t.toLowerCase().includes('weekend'));
    if (primaryFilter === 'weekly' && isWeekendCourse) return false;
    if (primaryFilter === 'weekend' && !isWeekendCourse) return false;

    // 2. Secondary Filter (Placement, Revision, Interview Prep, Projects, Challenges)
    if (selectedSecondary.length > 0) {
      const match = selectedSecondary.some(sec => {
        if (sec === 'placement') return course.category === 'placement';
        if (sec === 'revision') return course.category === 'revision';
        if (sec === 'interview-prep') return course.category === 'placement' || course.title.toLowerCase().includes('interview') || course.tags.some(t => t.toLowerCase().includes('interview'));
        if (sec === 'projects') return course.category === 'backend' || course.category === 'frontend' || course.tags.some(t => t.toLowerCase().includes('project') || t.toLowerCase().includes('build'));
        if (sec === 'challenges') return course.category === 'dsa' || course.tags.some(t => t.toLowerCase().includes('challenge') || t.toLowerCase().includes('leetcode') || t.toLowerCase().includes('algorithm'));
        return false;
      });
      if (!match) return false;
    }

    // 3. Third Filter (Status)
    if (activeStatus !== 'all') {
      const statusValue = course.classStatus || (course.state === 'live' ? 'live' : course.state === 'enrolled' ? 'past' : 'upcoming');
      return statusValue === activeStatus;
    }

    return true;
  });



  // Split filtered courses by status
  const getCourseStatus = (c: Course) => c.classStatus || (c.state === 'live' ? 'live' : c.state === 'enrolled' ? 'past' : 'upcoming');
  const liveFilteredCourses = filteredCoursesList.filter(c => getCourseStatus(c) === 'live');
  const upcomingFilteredCourses = filteredCoursesList.filter(c => getCourseStatus(c) === 'upcoming');
  const pastFilteredCourses = filteredCoursesList.filter(c => getCourseStatus(c) === 'past');

  // Split filtered courses by categories
  const placementGroup = filteredCoursesList.filter(c => 
    c.category === 'placement' && 
    !c.title.toLowerCase().includes('interview') && 
    !c.tags.some(t => t.toLowerCase().includes('interview') || t.toLowerCase().includes('mock')) &&
    !c.title.toLowerCase().includes('system design')
  );

  const interviewGroup = filteredCoursesList.filter(c => 
    c.category === 'placement' && 
    (c.title.toLowerCase().includes('interview') || 
     c.tags.some(t => t.toLowerCase().includes('interview') || t.toLowerCase().includes('mock')) ||
     c.title.toLowerCase().includes('system design') ||
     c.tags.some(t => t.toLowerCase().includes('system design')))
  );

  const projectsGroup = filteredCoursesList.filter(c => 
    c.category === 'backend' || c.category === 'frontend' || c.isProject
  );

  const challengesGroup = filteredCoursesList.filter(c => 
    c.category === 'dsa'
  );

  const aiGroup = filteredCoursesList.filter(c => 
    c.category === 'ai'
  );

  const revisionGroup = filteredCoursesList.filter(c => 
    c.category === 'revision' || c.isRevision
  );

  // Curated Recommendations Group (Trending or New courses)
  const recommendedGroup = coursesList.filter(c => {
    const isWeekendCourse = c.category === 'frontend' || c.tags.some(t => t.toLowerCase().includes('weekend'));
    if (primaryFilter === 'weekly' && isWeekendCourse) return false;
    if (primaryFilter === 'weekend' && !isWeekendCourse) return false;
    return c.isTrending || c.isNew || c.showSaleableInfo;
  });

  // Auto-focus the first tab that has courses if the current tab becomes empty due to filtering
  useEffect(() => {
    const currentTabHasCourses = 
      (activeSessionsTab === 'live' && liveFilteredCourses.length > 0) ||
      (activeSessionsTab === 'upcoming' && upcomingFilteredCourses.length > 0) ||
      (activeSessionsTab === 'past' && pastFilteredCourses.length > 0);
      
    if (!currentTabHasCourses) {
      if (liveFilteredCourses.length > 0) {
        setActiveSessionsTab('live');
      } else if (upcomingFilteredCourses.length > 0) {
        setActiveSessionsTab('upcoming');
      } else if (pastFilteredCourses.length > 0) {
        setActiveSessionsTab('past');
      }
    }
  }, [liveFilteredCourses.length, upcomingFilteredCourses.length, pastFilteredCourses.length, activeSessionsTab]);

  // Filtered lists for Section 3 & 4
  const workshopsFiltered = filterList(workshopItems);
  const resourcesFiltered = filterList(resourceItems);

  // Search Results Filters
  const getFilteredLiveClasses = () => {
    if (!searchQuery.trim()) return coursesList.slice(0, 4);
    return coursesList.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getFilteredCourses = () => {
    if (!searchQuery.trim()) return mockCoursesData;
    return mockCoursesData.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredEvents = () => {
    if (!searchQuery.trim()) return mockEventsData;
    return mockEventsData.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredResources = () => {
    if (!searchQuery.trim()) return mockResourcesData;
    return mockResourcesData.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="w-full relative min-h-screen pb-20 bg-slate-50/40">
      
      {/* 1. STICKY DISCOVERY BAR */}
      <div className={`sticky top-0 z-30 bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-10 shadow-sm transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-4 sm:py-5'
      }`}>
        
        {/* Row 1: Title and Search (hidden when scrolled) */}
        <AnimatePresence initial={false}>
          {!isScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <h1 className="text-[22px] sm:text-[24px] font-bold text-[#0F172A] font-heading tracking-tight">Live Classes</h1>
              
              {/* Capsule Search Bar */}
              <button
                onClick={() => {
                  setActiveSearchTab('live');
                  setIsSearchOpen(true);
                }}
                className="flex items-center gap-2.5 w-full sm:w-[280px] px-4 py-2 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/50 text-slate-450 hover:text-slate-500 rounded-full transition-all text-[13px] cursor-pointer text-left shrink-0"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-400">Search Live Classes</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Row 2: Filters */}
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center flex-wrap gap-4 sm:gap-5 min-w-0">
            
            {/* Primary Filter: Weekly / Weekend slider */}
            <div className="bg-[#0F172A] p-0.5 rounded-full flex items-center border border-slate-950/10 shadow-inner shrink-0">
              <button
                onClick={() => handlePrimaryChange('weekly')}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                  primaryFilter === 'weekly'
                    ? 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => handlePrimaryChange('weekend')}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                  primaryFilter === 'weekend'
                    ? 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekend
              </button>
            </div>

            {/* Divider (Hidden below desktop) */}
            <div className="hidden lg:block h-5 w-px bg-slate-200 mx-1 shrink-0"></div>

            {/* Secondary Filter: Text tabs */}
            <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-0.5 min-w-0">
              {secondaryChips.map(chip => {
                const isActive = selectedSecondary.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    onClick={() => handleSecondaryClick(chip.id)}
                    className={`relative py-1 text-xs font-bold tracking-tight transition-all cursor-pointer select-none whitespace-nowrap ${
                      isActive
                        ? 'text-slate-800'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>{chip.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeSecondaryLine"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider (Hidden below desktop) */}
            <div className="hidden lg:block h-5 w-px bg-slate-200 mx-1 shrink-0"></div>

            {/* Third Filter: Status Dot selectors */}
            <div className="flex items-center gap-5 shrink-0">
              {statusFilters.map(status => {
                const isActive = activeStatus === status.id;
                // Map the dot color
                const dotColor = 
                  status.id === 'live' 
                    ? 'bg-red-500' 
                    : status.id === 'upcoming'
                    ? 'bg-blue-500'
                    : 'bg-slate-400';
                return (
                  <button
                    key={status.id}
                    onClick={() => handleStatusChange(status.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer select-none ${
                      isActive ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0 ${status.id === 'live' && isActive ? 'animate-pulse' : ''}`} />
                    <span>{status.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Side Options (Search capsule and Clear filters) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search capsule shown on right when scrolled */}
            {isScrolled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setActiveSearchTab('live');
                  setIsSearchOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/50 text-slate-400 rounded-full transition-all text-[13px] font-semibold cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search Live Classes</span>
              </motion.button>
            )}

            {/* Clear Filters Button (Visible when filters are customized) */}
            {(selectedSecondary.length > 0 || activeStatus !== 'all' || primaryFilter !== 'weekly' || searchQuery !== '' || searchTerm !== '') && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs font-bold text-red-650 hover:text-red-800 hover:bg-red-50/50 px-3 py-1.5 rounded-full border border-red-200/50 hover:border-red-300 flex items-center gap-1 cursor-pointer transition-all shrink-0 select-none bg-red-50/5 active:scale-[0.97]"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* 2. MAIN V2 CONTAINER */}
      <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-12 sm:space-y-16 relative">

        {!searchTerm && (
          <>
            <EnrolledProgressCarousel />
          </>
        )}

        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200/80 rounded-[20px] px-5 py-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-800 text-sm font-semibold">
              <span className="text-base">🔍</span>
              <span>Showing results for: <strong className="text-blue-900 font-bold">"{searchTerm}"</strong></span>
            </div>
            <button
              onClick={() => onSearchChange?.('')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-850 px-3 py-1.5 hover:bg-blue-100/70 border border-blue-200/40 rounded-xl transition-all cursor-pointer select-none active:scale-[0.98]"
            >
              Clear Search
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isSimulatedLoading ? (
            /* Shimmer loading skeletons list */
            <motion.div
              key="loading-shimmer"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              className="space-y-16"
            >
              {[1, 2, 3].map((sectionIndex) => (
                <div key={sectionIndex} className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(cardIndex => (
                      <div key={cardIndex} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm animate-pulse">
                        <div className="h-40 bg-slate-100 rounded-2xl w-full" />
                        <div className="h-4 bg-slate-100 rounded w-2/3" />
                        <div className="h-3 bg-slate-100 rounded w-full" />
                        <div className="h-3 bg-slate-100 rounded w-4/5" />
                        <div className="flex gap-2 pt-2">
                          <div className="h-6 bg-slate-100 rounded w-12" />
                          <div className="h-6 bg-slate-100 rounded w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* Real populated contents (responsive to filters) */
            <motion.div
              key="content-loaded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-16"
            >
              
              {/* Unified Side-Tabbed Class Sessions Hub */}
              {(liveFilteredCourses.length > 0 || upcomingFilteredCourses.length > 0 || pastFilteredCourses.length > 0) ? (
                <section className="space-y-6">
                  {/* Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-slate-100 text-slate-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-slate-255/30">
                        Class Schedule
                      </span>
                      <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                        Your Class Sessions Hub
                      </h2>
                    </div>
                    <p className="text-slate-500 text-xs font-medium">
                      Browse your active live classrooms, upcoming schedule, and past recordings in one place.
                    </p>
                  </div>

                  {/* Side-Tabbed Container */}
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* Left side Tab Bar Selector (Vertical on desktop, Horizontal on mobile) */}
                    <div className="w-full md:w-[250px] shrink-0 bg-white border border-slate-200/60 rounded-[24px] shadow-sm overflow-hidden flex flex-row md:flex-col">
                      
                      {/* Live Now Tab */}
                      <button
                        onClick={() => setActiveSessionsTab('live')}
                        className={`flex-1 md:flex-initial flex items-center justify-between px-5 py-4 text-left transition-all cursor-pointer relative select-none border-b md:border-b-0 md:border-l-4 ${
                          activeSessionsTab === 'live'
                            ? 'bg-red-50/45 text-red-700 md:border-l-red-500 font-bold'
                            : 'text-slate-500 hover:bg-slate-50/60 md:border-l-transparent font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span className="text-xs sm:text-[13px] tracking-tight">Live Now</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                          activeSessionsTab === 'live' ? 'bg-red-100/80 text-red-750' : 'bg-slate-100 text-slate-550'
                        }`}>
                          {liveFilteredCourses.length}
                        </span>
                        
                        {/* Mobile bottom indicator bar */}
                        {activeSessionsTab === 'live' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 md:hidden" />
                        )}
                      </button>

                      {/* Upcoming Tab */}
                      <button
                        onClick={() => setActiveSessionsTab('upcoming')}
                        className={`flex-1 md:flex-initial flex items-center justify-between px-5 py-4 text-left transition-all cursor-pointer relative select-none border-b md:border-b-0 md:border-l-4 ${
                          activeSessionsTab === 'upcoming'
                            ? 'bg-blue-50/45 text-blue-750 md:border-l-blue-500 font-bold'
                            : 'text-slate-500 hover:bg-slate-50/60 md:border-l-transparent font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className={`w-4 h-4 shrink-0 ${activeSessionsTab === 'upcoming' ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs sm:text-[13px] tracking-tight">Upcoming</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                          activeSessionsTab === 'upcoming' ? 'bg-blue-100/80 text-blue-755' : 'bg-slate-100 text-slate-550'
                        }`}>
                          {upcomingFilteredCourses.length}
                        </span>

                        {/* Mobile bottom indicator bar */}
                        {activeSessionsTab === 'upcoming' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 md:hidden" />
                        )}
                      </button>

                      {/* Recorded Tab */}
                      <button
                        onClick={() => setActiveSessionsTab('past')}
                        className={`flex-1 md:flex-initial flex items-center justify-between px-5 py-4 text-left transition-all cursor-pointer relative select-none md:border-l-4 ${
                          activeSessionsTab === 'past'
                            ? 'bg-emerald-50/45 text-emerald-750 md:border-l-emerald-500 font-bold'
                            : 'text-slate-500 hover:bg-slate-50/60 md:border-l-transparent font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Monitor className={`w-4 h-4 shrink-0 ${activeSessionsTab === 'past' ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className="text-xs sm:text-[13px] tracking-tight">Recorded</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                          activeSessionsTab === 'past' ? 'bg-emerald-100/80 text-emerald-755' : 'bg-slate-100 text-slate-550'
                        }`}>
                          {pastFilteredCourses.length}
                        </span>

                        {/* Mobile bottom indicator bar */}
                        {activeSessionsTab === 'past' && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 md:hidden" />
                        )}
                      </button>

                    </div>

                    {/* Right side Cards Grid Display area */}
                    <div className="flex-1 w-full min-w-0">
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSessionsTab}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                        >
                          {activeSessionsTab === 'live' && (
                            liveFilteredCourses.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {liveFilteredCourses.map(course => (
                                  <CourseCard 
                                    key={course.id}
                                    {...course}
                                    onEnroll={() => handleJoinClass(course.id)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="bg-white border border-slate-200/50 rounded-[24px] p-8 text-center text-slate-400 text-xs font-bold shadow-sm">
                                No classes currently live in this view.
                              </div>
                            )
                          )}

                          {activeSessionsTab === 'upcoming' && (
                            upcomingFilteredCourses.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {upcomingFilteredCourses.map(course => (
                                  <CourseCard 
                                    key={course.id}
                                    {...course}
                                    onEnroll={() => handleEnrollCourse(course.id)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="bg-white border border-slate-200/50 rounded-[24px] p-8 text-center text-slate-400 text-xs font-bold shadow-sm">
                                No scheduled classes available in this view.
                              </div>
                            )
                          )}

                          {activeSessionsTab === 'past' && (
                            pastFilteredCourses.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {pastFilteredCourses.map(course => (
                                  <CourseCard 
                                    key={course.id}
                                    {...course}
                                    onEnroll={() => handleEnrollCourse(course.id)}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="bg-white border border-slate-200/50 rounded-[24px] p-8 text-center text-slate-400 text-xs font-bold shadow-sm">
                                No recorded past classes available in this view.
                              </div>
                            )
                          )}
                        </motion.div>
                      </AnimatePresence>

                    </div>

                  </div>
                </section>
              ) : (
                /* Empty state when all lists are completely empty */
                <div className="bg-white border border-slate-200/50 rounded-[24px] p-8 sm:p-12 text-center text-slate-400 text-xs font-bold shadow-sm space-y-3">
                  <div className="text-3xl">📭</div>
                  <p>No classes found matching the active filter and search criteria.</p>
                  <button 
                    onClick={handleClearAllFilters}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-850 px-4 py-2 hover:bg-blue-50 border border-blue-200/50 rounded-xl transition-all cursor-pointer select-none"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Styled Visual Separator */}
              <div className="relative py-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200/60" />
                </div>
                <div className="relative bg-white border border-slate-200/80 shadow-sm rounded-full px-5 py-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
                    Explore Curated Specializations
                  </span>
                </div>
              </div>

              {/* 4. Recommended as per your journey Section */}
              {recommendedGroup.length > 0 && (
                <section className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200/30 flex items-center gap-1 leading-none">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                        <span>Recommended</span>
                      </span>
                      <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                        Recommended as per your journey
                      </h2>
                    </div>
                    <p className="text-slate-500 text-xs font-medium">
                      Curated trending paths, system design deep dives, and upcoming high-salary specializations tailored to your progress.
                    </p>
                  </div>
                  <CourseCarousel 
                    courses={recommendedGroup} 
                    onEnroll={handleEnrollCourse} 
                  />
                </section>
              )}

              {/* Sellable Section 1: Elite Placement Club Banner */}
              <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 p-8 sm:p-10 text-white shadow-xl border border-slate-800">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-400/20 px-3 py-1 rounded-full text-xs font-bold text-blue-300 uppercase tracking-wider leading-none">
                      <Award className="w-3.5 h-3.5" />
                      <span>Elite Placement Program</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-heading leading-tight">
                      Land your dream job in top tech companies.
                    </h3>
                    <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                      Join our rigorous, placement-backed bootcamp. Get intensive training in DSA, System Design, Full-Stack engineering, and mock interviews. Work directly with recruiters from top FAANG and Indian product startups.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="border-r border-white/10 pr-2">
                        <p className="text-xl sm:text-2xl font-black text-blue-455">12 LPA</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Average Package</p>
                      </div>
                      <div className="border-r border-white/10 px-2">
                        <p className="text-xl sm:text-2xl font-black text-emerald-400">42 LPA</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Highest Package</p>
                      </div>
                      <div className="pl-2">
                        <p className="text-xl sm:text-2xl font-black text-indigo-400">98.4%</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Placement Rate</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl lg:w-[320px] shrink-0 space-y-5">
                    <div className="space-y-3">
                      <p className="text-xs text-slate-350 font-semibold text-center">
                        Trusted by thousands of ambitious developers
                      </p>
                      <div className="flex items-center justify-center -space-x-2">
                        <img className="w-8 h-8 rounded-full border border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80" alt="Student" />
                        <img className="w-8 h-8 rounded-full border border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80" alt="Student" />
                        <img className="w-8 h-8 rounded-full border border-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80" alt="Student" />
                        <img className="w-8 h-8 rounded-full border border-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80" alt="Student" />
                        <div className="w-8 h-8 rounded-full border border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-355">
                          +5K
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium text-center">
                        5,000+ Students hired in elite product firms.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => alert("Redirecting to scholarship application form... 🚀")}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer text-center"
                    >
                      Apply for Scholarship
                    </button>
                  </div>
                </div>
              </section>

              {/* 5. Placement Related Section */}
              {placementGroup.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Career Tracks
                        </span>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                          Placement Related Bootcamps
                        </h2>
                      </div>
                      <p className="text-slate-400 text-xs font-medium">
                        Core job-preparedness tracks, soft skills, and comprehensive aptitude bootcamps.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
                      {placementGroup.length} Specializations
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {placementGroup.map(course => (
                      <CourseCard 
                        key={course.id}
                        {...course}
                        onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 6. Interview Prep Section */}
              {interviewGroup.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Interview Prep
                        </span>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                          System Design & FAANG Prep
                        </h2>
                      </div>
                      <p className="text-slate-400 text-xs font-medium">
                        Syllabus focused on system design scalability, architectural patterns, and mock coding marathons.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
                      {interviewGroup.length} Pathways
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {interviewGroup.map(course => (
                      <CourseCard 
                        key={course.id}
                        {...course}
                        onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Sellable Section 2: 1-on-1 FAANG Mock Prep Banner */}
              <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-zinc-900 to-neutral-955 p-8 sm:p-10 text-white shadow-xl border border-neutral-800">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -top-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/20 px-3 py-1 rounded-full text-xs font-bold text-amber-450 uppercase tracking-wider leading-none">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>FAANG Interview Readiness</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-heading leading-tight text-neutral-100">
                      Get Mock Interviewed by FAANG Mentors.
                    </h3>
                    <p className="text-neutral-405 text-xs sm:text-sm leading-relaxed">
                      Watch a senior engineer break down your DSA logic and system architecture in a realistic mock environment. Get granular scoring on problem solving, coding speed, communication, and system design.
                    </p>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-neutral-300 text-[11px] sm:text-xs font-semibold">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-450 shrink-0" />
                        <span>Real-time DSA logic & code optimization feedback</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-450 shrink-0" />
                        <span>ATS-friendly resume scoring & audit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-450 shrink-0" />
                        <span>System Design architecture deep dive</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-455 shrink-0" />
                        <span>Behavioral & leadership principles prep</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-neutral-850/60 border border-neutral-800/80 p-6 rounded-2xl lg:w-[320px] shrink-0 space-y-4 text-center">
                    <div className="space-y-1">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Limited Slots Available</p>
                      <p className="text-base sm:text-lg font-black text-amber-455 flex items-center justify-center gap-1">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span>Only 3 Slots Left This Week</span>
                      </p>
                    </div>
                    
                    <div className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-[10px] text-[10px] text-neutral-400 text-left font-medium leading-normal">
                      🛡️ <strong className="text-neutral-250">Free Session:</strong> This mock interview is completely free for enrolled students who maintain a &gt;80% progress score.
                    </div>
                    
                    <button 
                      onClick={() => alert("Opening live calendar booking widget... 📅")}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/15 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Book Free Slot Now
                    </button>
                  </div>
                </div>
              </section>

              {/* 7. Projects Section */}
              {projectsGroup.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Projects
                        </span>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                          Build Real-World Projects
                        </h2>
                      </div>
                      <p className="text-slate-400 text-xs font-medium">
                        Production-grade fullstack web applications, database schema designs, and microservices in Go.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
                      {projectsGroup.length} Projects
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsGroup.map(course => (
                      <CourseCard 
                        key={course.id}
                        {...course}
                        onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 8. Challenges Section */}
              {challengesGroup.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-fuchsia-100 text-fuchsia-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Challenges
                        </span>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                          DSA & Coding Challenges
                        </h2>
                      </div>
                      <p className="text-slate-400 text-xs font-medium">
                        Solve complex graph, tree, and dynamic programming challenges with expert editorial walkthroughs.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
                      {challengesGroup.length} Challenges
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {challengesGroup.map(course => (
                      <CourseCard 
                        key={course.id}
                        {...course}
                        onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 9. AI & Emerging Tech Section */}
              {aiGroup.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Generative AI
                        </span>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                          AI & Emerging Deep Tech
                        </h2>
                      </div>
                      <p className="text-slate-400 text-xs font-medium">
                        Generative AI, Prompt Engineering, LLM orchestration with LangChain, and Computer Vision models.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
                      {aiGroup.length} Pathways
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {aiGroup.map(course => (
                      <CourseCard 
                        key={course.id}
                        {...course}
                        onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* 10. Revision Classes Section */}
              {revisionGroup.length > 0 && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Revision
                        </span>
                        <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                          Crash Courses & Revision Sprints
                        </h2>
                      </div>
                      <p className="text-slate-400 text-xs font-medium">
                        Quick refresher sessions to solidifying your core web dev concepts and system design blueprints.
                      </p>
                    </div>
                    <div className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl self-start sm:self-center">
                      {revisionGroup.length} Sprints
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {revisionGroup.map(course => (
                      <CourseCard 
                        key={course.id}
                        {...course}
                        onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Section 11: Upcoming Workshops & Masterclasses */}
              <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm space-y-6">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                    Featured Masterclasses & Sprints
                  </h2>
                  <p className="text-slate-400 text-xs font-medium">
                    Specialized workshops and hackathons hosted by tech directors from leading scale organizations.
                  </p>
                </div>

                {workshopsFiltered.length > 0 ? (
                  <div className="flex gap-6 overflow-x-auto no-scrollbar py-2">
                    {workshopsFiltered.map((workshop) => (
                      <div 
                        key={workshop.id} 
                        className="w-[280px] xs:w-[320px] shrink-0 border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-white p-5 rounded-2xl space-y-4 transition-all hover:shadow-md flex flex-col justify-between group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {workshop.category}
                            </span>
                            {workshop.status === 'live' && (
                              <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded uppercase animate-pulse">Live</span>
                            )}
                          </div>
                          
                          <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                            {workshop.title}
                          </h4>
                          <p className="text-slate-500 text-xs leading-normal line-clamp-3">
                            {workshop.desc}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100/80 space-y-3">
                          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                            <span>Mentor: {workshop.mentor}</span>
                            <span className="text-slate-650 flex items-center gap-1 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-slate-450" />
                              {workshop.date}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              alert(`Registered for Workshop: "${workshop.title}"`);
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Reserve Seat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50/50 border border-slate-200/40 rounded-2xl p-6 sm:p-10 text-center text-slate-400 text-xs font-bold">
                    No upcoming workshops matching your active focus tags.
                  </div>
                )}
              </section>

              {/* Section 12: Recommended Learning Resources */}
              <section className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-bold text-slate-800 tracking-tight">
                    Recommended Resources & Documents
                  </h2>
                  <p className="text-slate-400 text-xs font-medium">
                    Download PDF cheatsheets, LeetCode patterns, and reference architectures built by our core curriculum engineering team.
                  </p>
                </div>

                {resourcesFiltered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resourcesFiltered.map((res) => (
                      <div 
                        key={res.id} 
                        className="flex items-center justify-between p-4 border border-slate-100 bg-white hover:border-slate-200 rounded-2xl hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 pr-4">
                            <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                              {res.title}
                            </h4>
                            <p className="text-slate-400 text-xs font-medium mt-0.5">
                              {res.type} • <span className="capitalize">{res.category}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            alert(`Downloading resource: "${res.title}"...`);
                          }}
                          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50/50 hover:bg-blue-50 font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{res.downloads || '1.2k'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-100 rounded-[24px] p-8 text-center text-slate-400 text-xs font-bold">
                    No reference downloads matching current selection.
                  </div>
                )}
              </section>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 3. GLOBAL SEARCH MODAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex justify-center items-start pt-[10vh] overflow-y-auto px-4">
            
            <div className="fixed inset-0 cursor-default" onClick={() => setIsSearchOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full max-w-[800px] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[80vh] z-10"
            >
              
              {/* Top Search bar */}
              <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Live Classes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-slate-800 placeholder-slate-400 text-base font-semibold focus:outline-none"
                />
                
                <span className="text-[10px] text-slate-400 font-bold border border-slate-100 bg-slate-50 px-2 py-1 rounded">
                  ESC
                </span>
                
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Switcher */}
              <div className="bg-slate-50/50 px-5 border-b border-slate-100 flex gap-4 overflow-x-auto no-scrollbar">
                {(['live', 'courses', 'events', 'resources'] as const).map((tab) => {
                  const label = tab === 'live' ? 'Live Classes' : tab === 'courses' ? 'Courses' : tab === 'events' ? 'Events' : 'Resources';
                  const isActive = activeSearchTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveSearchTab(tab)}
                      className={`py-3 px-1 text-xs md:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Search Results Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px]">
                
                {/* 1. Live Classes tab */}
                {activeSearchTab === 'live' && (
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {searchQuery ? `Live Class Results (${getFilteredLiveClasses().length})` : 'Trending Live Classes'}
                    </div>
                    {getFilteredLiveClasses().length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {getFilteredLiveClasses().map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl border border-slate-100/60 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                <Monitor className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                                  {course.title}
                                </h4>
                                <div className="flex gap-2 items-center mt-1">
                                  <span className="text-[11px] text-slate-400 font-semibold">{course.classesCount} Syllabus Classes</span>
                                  {course.state === 'live' && (
                                    <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">Live</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                if (course.state === 'live') {
                                  handleJoinClass(course.id);
                                } else {
                                  handleEnrollCourse(course.id);
                                }
                              }}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
                            >
                              {course.state === 'live' ? 'Join Live' : 'Register'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-400 text-sm">
                        No live classes found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Courses tab */}
                {activeSearchTab === 'courses' && (
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {searchQuery ? `Career Programs (${getFilteredCourses().length})` : 'Popular Career Programs'}
                    </div>
                    {getFilteredCourses().length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {getFilteredCourses().map((c) => (
                          <div
                            key={c.id}
                            className="p-3.5 hover:bg-slate-50 rounded-2xl border border-slate-100/60 transition-colors flex items-center justify-between group"
                          >
                            <div className="space-y-1">
                              <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {c.title}
                              </h4>
                              <p className="text-slate-500 text-xs leading-normal">{c.desc}</p>
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                              {c.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-400 text-sm">
                        No career programs found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Events tab */}
                {activeSearchTab === 'events' && (
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {searchQuery ? `Workshops & Events (${getFilteredEvents().length})` : 'Featured Workshops'}
                    </div>
                    {getFilteredEvents().length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {getFilteredEvents().map((e) => (
                          <div
                            key={e.id}
                            className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl border border-slate-100/60 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-amber-600 transition-colors">
                                  {e.title}
                                </h4>
                                <p className="text-slate-400 text-xs mt-0.5">By {e.speaker} • {e.time}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                alert(`Successfully registered for the workshop: "${e.title}"!`);
                              }}
                              className="text-xs border border-amber-500 hover:bg-amber-50 text-amber-700 font-bold px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                            >
                              Register
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-400 text-sm">
                        No events found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Resources tab */}
                {activeSearchTab === 'resources' && (
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {searchQuery ? `Learning Documents (${getFilteredResources().length})` : 'Popular Downloadables'}
                    </div>
                    {getFilteredResources().length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {getFilteredResources().map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl border border-slate-100/60 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors">
                                  {r.title}
                                </h4>
                                <p className="text-slate-400 text-xs mt-0.5">{r.type}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                alert(`Downloading: "${r.title}"...`);
                              }}
                              className="text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                            >
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-slate-400 text-sm">
                        No resources found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
