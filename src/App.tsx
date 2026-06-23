import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EnrolledCourseCarousel } from './components/EnrolledCourseCarousel';
import { FilterSection } from './components/FilterSection';
import { LiveClassesV2 } from './components/LiveClassesV2';
import { CourseCarousel } from './components/CourseCarousel';
import { CourseCard } from './components/CourseCard';
import { PromotionalBanner } from './components/PromotionalBanner';
import { AdditionalStats } from './components/AdditionalStats';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';
import { EnrollmentModal } from './components/EnrollmentModal';
import { BellRing, PlayCircle, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

const initialCourses: Course[] = [
  // Placement Prep (₹8-12 LPA Essentials)
  {
    id: 'p1',
    title: 'Placement Prep bootcamp',
    image: '/course_illustration_1.png',
    tags: ['Aptitude', 'Resume', 'Mock Interviews', 'Soft Skills'],
    classesCount: 48,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'placement',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 12,
    nextClassTime: 'Next Class: Tomorrow, 10:00 AM'
  },
  {
    id: 'p2',
    title: 'System Design & Scale',
    image: '/course_illustration_1.png',
    tags: ['Architecture', 'System Design', 'Scale', 'APIs'],
    classesCount: 52,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'placement',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming'
  },
  {
    id: 'p3',
    title: 'FAANG Interview Masterclass',
    image: '/course_illustration_1.png',
    tags: ['LeetCode', 'DSA', 'System Design', 'Behavioral'],
    classesCount: 30,
    runningBatches: 2,
    upcomingBatches: 2,
    category: 'placement',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'past'
  },
  // DSA (DSA for MAANG)
  {
    id: 'd1',
    title: 'Data Structures & Algorithms',
    image: '/course_illustration_1.png',
    tags: ['Java', 'Algorithms', 'Recursion', 'Graphs'],
    classesCount: 64,
    runningBatches: 2,
    upcomingBatches: 1,
    category: 'dsa',
    state: 'live',
    isEnrolled: true,
    classStatus: 'live',
    completedClasses: 32
  },
  {
    id: 'd2',
    title: 'Competitive Programming Prep',
    image: '/course_illustration_1.png',
    tags: ['C++', 'Math', 'Dynamic Programming', 'Complexity'],
    classesCount: 56,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'dsa',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'live'
  },
  {
    id: 'd3',
    title: 'Advanced Trees & Graphs',
    image: '/course_illustration_1.png',
    tags: ['Advanced DSA', 'Trees', 'Graphs', 'Trie'],
    classesCount: 38,
    runningBatches: 0,
    upcomingBatches: 2,
    category: 'dsa',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming'
  },
  // AI (Generative AI)
  {
    id: 'a1',
    title: 'Generative AI & Prompt Engineering',
    image: '/course_illustration_1.png',
    tags: ['ML', 'Python', 'Gen AI', 'ChatGPT'],
    classesCount: 52,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'ai',
    state: 'live',
    isEnrolled: true,
    classStatus: 'live',
    completedClasses: 5
  },
  {
    id: 'a2',
    title: 'Deep Learning & Neural Networks',
    image: '/course_illustration_1.png',
    tags: ['PyTorch', 'CNNs', 'RNNs', 'NLP'],
    classesCount: 60,
    runningBatches: 2,
    upcomingBatches: 1,
    category: 'ai',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'past'
  },
  {
    id: 'a3',
    title: 'Computer Vision Fundamentals',
    image: '/course_illustration_1.png',
    tags: ['OpenCV', 'YOLO', 'Image Processing', 'TensorFlow'],
    classesCount: 45,
    runningBatches: 1,
    upcomingBatches: 3,
    category: 'ai',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming'
  },
  // Backend (Build Projects)
  {
    id: 'b1',
    title: 'Node.js & Express REST APIs',
    image: '/course_illustration_1.png',
    tags: ['JavaScript', 'Node.js', 'Express', 'APIs'],
    classesCount: 50,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'backend',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'live'
  },
  {
    id: 'b2',
    title: 'SQL & NoSQL Databases Masterclass',
    image: '/course_illustration_1.png',
    tags: ['PostgreSQL', 'MongoDB', 'Redis', 'Queries'],
    classesCount: 42,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'backend',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'past',
    completedClasses: 42
  },
  {
    id: 'b3',
    title: 'Microservices with Go & Docker',
    image: '/course_illustration_1.png',
    tags: ['Go', 'gRPC', 'Docker', 'K8s'],
    classesCount: 55,
    runningBatches: 2,
    upcomingBatches: 2,
    category: 'backend',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming'
  },
  // Frontend (Weekend Batches)
  {
    id: 'f1',
    title: 'React & Tailwind CSS Fundamentals',
    image: '/course_illustration_1.png',
    tags: ['React', 'Tailwind CSS', 'Vite', 'Hooks'],
    classesCount: 48,
    runningBatches: 1,
    upcomingBatches: 3,
    category: 'frontend',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 18,
    nextClassTime: 'Next Class: Today, 8:30 PM'
  },
  {
    id: 'f2',
    title: 'Next.js Production Architecture',
    image: '/course_illustration_1.png',
    tags: ['Next.js', 'RSC', 'Vercel', 'Tailwind'],
    classesCount: 52,
    runningBatches: 2,
    upcomingBatches: 1,
    category: 'frontend',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming'
  },
  {
    id: 'f3',
    title: 'Framer Motion & Animations',
    image: '/course_illustration_1.png',
    tags: ['Framer Motion', 'Animations', 'CSS', 'UX'],
    classesCount: 36,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'frontend',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'past'
  },
  // Revision (Revision Classes)
  {
    id: 'r1',
    title: 'React Hooks & State Management Revision',
    image: '/course_illustration_1.png',
    tags: ['React', 'Hooks', 'Redux', 'Zustand'],
    classesCount: 10,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'revision',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming'
  },
  {
    id: 'r2',
    title: 'System Design Interview Refresher',
    image: '/course_illustration_1.png',
    tags: ['System Design', 'Caching', 'Load Balancers', 'Scale'],
    classesCount: 8,
    runningBatches: 1,
    upcomingBatches: 0,
    category: 'revision',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 7,
    nextClassTime: 'Next Class: Tomorrow, 4:00 PM'
  }
];

function App() {
  const [currentTab, setCurrentTab] = useState('live');
  const [layoutVersion, setLayoutVersion] = useState<'V1' | 'V2'>('V1');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [coursesList, setCoursesList] = useState<Course[]>(initialCourses);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  
  // Notification States
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [activeAlert, setActiveAlert] = useState<{ id: string; title: string; topic: string } | null>(null);
  const [simulationTimer, setSimulationTimer] = useState<number | null>(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<Course | null>(null);

  // Sync notification status on load
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Monitor scroll offset on the main container
  useEffect(() => {
    const handleScroll = () => {
      if (mainScrollRef.current) {
        setIsScrolled(mainScrollRef.current.scrollTop > 60);
      }
    };
    const el = mainScrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      // initial check
      handleScroll();
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleRequestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((status) => {
        setPermissionStatus(status);
        if (status === 'granted') {
          // Send welcome test notification
          new Notification('NxtWave Academy', {
            body: 'System notifications enabled successfully! You will get alerts when classes start.',
            icon: '/course_illustration_1.png'
          });
        }
      });
    } else {
      alert('This browser does not support desktop notifications.');
    }
  };

  const triggerLiveSimulation = () => {
    // Clear any existing timer
    if (simulationTimer) {
      clearTimeout(simulationTimer);
    }

    const timer = window.setTimeout(() => {
      const liveAlert = {
        id: 'a1',
        title: 'Generative AI & Prompt Engineering',
        topic: 'Mastering ChatGPT System Prompts & Few-Shot Learning'
      };
      
      // 1. Show on-screen toast
      setActiveAlert(liveAlert);

      // 2. Fire system push notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🔴 Live Class Alert', {
          body: `"${liveAlert.title}" is live now. Topic: ${liveAlert.topic}`,
          icon: '/course_illustration_1.png',
          tag: 'live-class-alert',
          requireInteraction: true
        });
      }
    }, 2000); // Trigger in 2 seconds

    setSimulationTimer(timer);
    alert('Simulated live class scheduled in 2 seconds! Feel free to switch tabs to verify notifications.');
  };

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (simulationTimer) clearTimeout(simulationTimer);
    };
  }, [simulationTimer]);

  // Filter courses based on active category and search term
  const filteredCourses = coursesList.filter((course) => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Groups for section-wise display when 'all' category is active
  const placementCourses = filteredCourses.filter(c => c.category === 'placement');
  const dsaCourses = filteredCourses.filter(c => c.category === 'dsa');
  const aiCourses = filteredCourses.filter(c => c.category === 'ai');
  const backendCourses = filteredCourses.filter(c => c.category === 'backend');
  const frontendCourses = filteredCourses.filter(c => c.category === 'frontend');
  const revisionCourses = filteredCourses.filter(c => c.category === 'revision');

  const handleEnrollCourse = (id: string) => {
    const course = coursesList.find(c => c.id === id);
    if (!course) return;

    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((status) => {
        setPermissionStatus(status);
        setSelectedEnrollCourse(course);
      });
    } else {
      setSelectedEnrollCourse(course);
    }
  };

  const handleJoinClass = (id: string) => {
    alert(`Redirecting to live classroom session for: ${coursesList.find(c => c.id === id)?.title} ⚡`);
  };

  // Header needs suggestion list
  const suggestionList = coursesList.map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    state: c.state
  }));

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen text-text-primary antialiased">
      {/* Mobile Sidebar Slide-over Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative flex w-80 max-w-xs flex-col bg-sidebar text-white h-full shadow-2xl z-10"
            >
              {/* Close Button inside Drawer */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer z-20"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <Sidebar 
                currentTab={currentTab} 
                onTabChange={(tab) => {
                  setCurrentTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                isMobile={true}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Left Sidebar Layout */}
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main content scroll container */}
      <div ref={mainScrollRef} className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative">
        
        {/* Header Search & Actions */}
        <Header 
          searchValue={searchTerm} 
          onSearchChange={setSearchTerm} 
          courses={suggestionList} 
          layoutVersion={layoutVersion}
          onLayoutVersionChange={setLayoutVersion}
          onMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
          isScrolled={isScrolled}
        />

        {/* Global Notifications System overlays */}
        <NotificationToast
          alert={activeAlert}
          onClose={() => setActiveAlert(null)}
          onJoin={handleJoinClass}
          permissionStatus={permissionStatus}
          onRequestPermission={handleRequestPermission}
        />

        {/* Floating Simulation Control Panel for validation */}
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-slate-200 rounded-[20px] shadow-2xl p-4 w-72 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
            <BellRing className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Alert Simulation Controller</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Test the live class notification mechanics (triggers system push alerts + global on-screen toaster cards).
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={triggerLiveSimulation}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-blue-500/10"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Simulate Class Going Live</span>
            </button>
            <button
              onClick={handleRequestPermission}
              className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Ask System Permission</span>
            </button>
          </div>
        </div>

        {/* Content body rendered dynamically based on sidebar tab selection */}
        {currentTab === 'live' ? (
          layoutVersion === 'V1' ? (
            <main className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-10 sm:space-y-16 max-w-7xl mx-auto w-full">
              {/* 1. Filter Section (Now at the top of the page as the primary action fold) */}
              <FilterSection
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />

              {/* Conditionally show carousels when 'All Courses' category is active and no search query is typed */}
              {activeCategory === 'all' && !searchTerm && (
                <>
                  {/* 2. My Enrolled Courses */}
                  <EnrolledCourseCarousel />

                  {/* 3. For Your Journey (Horizontal Carousel of Hand-Picked Courses) */}
                  <div className="space-y-6">
                    <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight">
                      For Your Journey
                    </h2>
                    <CourseCarousel 
                      courses={coursesList.filter((_, i) => i % 2 === 0)} 
                      onEnroll={handleEnrollCourse} 
                    />
                  </div>
                </>
              )}

              {/* Category Grids or Single Filter Grid */}
              {activeCategory === 'all' ? (
                <div className="space-y-16">
                  {/* 5. Placement Preparation */}
                  {placementCourses.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight">
                        ₹8-12 LPA Essentials
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {placementCourses.map(course => (
                          <CourseCard 
                            key={course.id} 
                            {...course} 
                            searchQuery={searchTerm}
                            onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. DSA */}
                  {dsaCourses.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight">
                        DSA for MAANG
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dsaCourses.map(course => (
                          <CourseCard 
                            key={course.id} 
                            {...course} 
                            searchQuery={searchTerm}
                            onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7. AI */}
                  {aiCourses.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight">
                        Generative AI
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {aiCourses.map(course => (
                          <CourseCard 
                            key={course.id} 
                            {...course} 
                            searchQuery={searchTerm}
                            onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. Backend */}
                  {backendCourses.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight">
                        Build Projects
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {backendCourses.map(course => (
                          <CourseCard 
                            key={course.id} 
                            {...course} 
                            searchQuery={searchTerm}
                            onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 9. Frontend */}
                  {frontendCourses.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight">
                        Weekend Batches
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {frontendCourses.map(course => (
                          <CourseCard 
                            key={course.id} 
                            {...course} 
                            searchQuery={searchTerm}
                            onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Revision Classes */}
                  {revisionCourses.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight">
                        Revision Classes
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {revisionCourses.map(course => (
                          <CourseCard 
                            key={course.id} 
                            {...course} 
                            searchQuery={searchTerm}
                            onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Single Grid for specific Filter Category
                <div className="space-y-6">
                  <h2 className="text-[32px] font-bold text-text-primary font-heading tracking-tight capitalize">
                    {activeCategory === 'placement' ? '₹8-12 LPA Essentials' :
                     activeCategory === 'dsa' ? 'DSA for MAANG' :
                     activeCategory === 'ai' ? 'Generative AI' :
                     activeCategory === 'backend' ? 'Build Projects' :
                     activeCategory === 'frontend' ? 'Weekend Batches' :
                     activeCategory === 'revision' ? 'Revision Classes' :
                     activeCategory} Courses
                  </h2>
                  {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredCourses.map(course => (
                        <CourseCard 
                          key={course.id} 
                          {...course}  
                          searchQuery={searchTerm}
                          onEnroll={() => course.state === 'live' ? handleJoinClass(course.id) : handleEnrollCourse(course.id)} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-card-border rounded-[24px] p-6 sm:p-12 text-center text-text-secondary">
                      <p className="text-lg font-medium">No courses found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 10. Promotional Banner */}
              <PromotionalBanner />

              {/* 11. Additional Category Sections */}
              <AdditionalStats />

              {/* 12. Footer */}
              <Footer />
            </main>
          ) : (
            <LiveClassesV2 
              coursesList={coursesList}
              handleEnrollCourse={handleEnrollCourse}
              handleJoinClass={handleJoinClass}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isScrolled={isScrolled}
            />
          )
        ) : (
          /* Placeholder view for other pages to prove that Notification triggers globally */
          <main className="px-4 sm:px-6 lg:px-10 py-10 max-w-7xl mx-auto w-full h-[80vh] flex flex-col items-center justify-center text-center gap-5">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/5">
              <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[32px] font-bold text-slate-800 capitalize">
                {currentTab.replace('-', ' ')} Page
              </h2>
              <p className="text-text-secondary text-sm max-w-md">
                You are currently on the {currentTab} page. You can trigger simulated live class notifications using the control panel in the bottom right to see alerts popup globally.
              </p>
            </div>
            <button 
              onClick={() => setCurrentTab('live')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-[14px] shadow-lg shadow-blue-500/10 active:scale-95 transition-all"
            >
              Go to Live Classes Page
            </button>
          </main>
        )}
      </div>

      {/* Batch Selection Enrollment Modal */}
      <EnrollmentModal
        isOpen={selectedEnrollCourse !== null}
        onClose={() => setSelectedEnrollCourse(null)}
        courseTitle={selectedEnrollCourse?.title || ''}
        courseState={selectedEnrollCourse?.state}
        onConfirm={(_batchId, status) => {
          setCoursesList(prev => prev.map(c => {
            if (c.id === selectedEnrollCourse?.id) {
              return {
                ...c,
                state: status === 'ongoing' ? 'live' : 'enrolled',
                isEnrolled: true,
                classStatus: status === 'ongoing' ? 'live' : 'upcoming',
                completedClasses: status === 'ongoing' ? 12 : 0,
                nextClassTime: status === 'ongoing' ? 'Next Class: Today, 8:30 PM' : 'Next Class: 15th April, 6:00 PM'
              };
            }
            return c;
          }));
          setSelectedEnrollCourse(null);
        }}
      />
    </div>
  );
}

export default App;
