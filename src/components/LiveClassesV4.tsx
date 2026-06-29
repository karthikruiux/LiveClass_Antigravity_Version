import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Calendar, 
  Monitor, 
  Clock, 
  PlayCircle, 
  FileText, 
  ArrowLeft, 
  BookOpen, 
  ChevronRight, 
  Globe, 
  Lock, 
  Check,
  ArrowRight,
  Info,
  Code2,
  RefreshCw,
  ChevronDown,
  Users,
  Layers,
  Hourglass,
  History,
  Sparkles
} from 'lucide-react';
import { highlightText } from '../utils/searchHighlight';
import { EnrolledProgressCarousel } from './EnrolledProgressCarousel';
import { CourseCarousel } from './CourseCarousel';

interface SubTopic {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'completed';
  time?: string;
  duration?: string;
}

interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
}

interface Course {
  id: string;
  title: string;
  image: string;
  tags: string[];
  classesCount: number;
  runningBatches: number;
  upcomingBatches: number;
  category: 'placement' | 'dsa' | 'ai' | 'backend' | 'frontend' | 'revision' | 'projects' | 'challenges' | 'interview-prep';
  state?: 'not-enrolled' | 'enrolled' | 'live';
  isEnrolled?: boolean;
  classStatus?: 'live' | 'upcoming' | 'past';
  completedClasses?: number;
  nextClassTime?: string;
  scheduleType?: 'mwf' | 'tts' | 'weekend' | 'weekday' | 'weekly';
  recentClassTitle?: string;
  nextBatchStartDate?: string;
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

interface LiveClassesV4Props {
  coursesList?: Course[];
  handleEnrollCourse?: (id: string) => void;
  handleJoinClass?: (id: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  isScrolled?: boolean;
  scheduleType?: 'weekday' | 'weekend';
  onScheduleTypeChange?: (type: 'weekday' | 'weekend') => void;
}

// Global Search Databases (same as V2)
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

// Rich mock data representing classes/courses in V4 main grid
const mockCourses: Course[] = [
  {
    id: 'v4-c1',
    title: 'Placement Prep Bootcamp',
    image: 'course_illustration_1.png',
    tags: ['Aptitude', 'Resume Build', 'Mock Interviews'],
    classesCount: 48,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'placement',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 12,
    nextClassTime: 'Next Class: Tomorrow, 10:00 AM',
    recentClassTitle: 'Resume Optimization & Profiling',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c9',
    title: 'Build Your Own Static Website',
    image: 'course_illustration_1.png',
    tags: ['HTML', 'CSS', 'Bootstrap', 'Responsive Web'],
    classesCount: 12,
    runningBatches: 1,
    upcomingBatches: 0,
    category: 'projects',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 7,
    nextClassTime: 'Next Class: Sunday, 11:00 AM',
    recentClassTitle: 'Flexbox & Bootstrap Grid Layouts',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c2',
    title: 'FAANG Masterclass: Advanced System Design',
    image: 'course_illustration_1.png',
    tags: ['Microservices', 'Scale', 'System Architecture'],
    classesCount: 30,
    runningBatches: 2,
    upcomingBatches: 1,
    category: 'placement',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'live',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c3',
    title: 'React Hooks & State Management Revision',
    image: 'course_illustration_1.png',
    tags: ['React', 'Hooks', 'Zustand', 'Context API'],
    classesCount: 10,
    runningBatches: 1,
    upcomingBatches: 0,
    category: 'revision',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 7,
    nextClassTime: 'Next Class: Today, 4:00 PM',
    recentClassTitle: 'Zustand Advanced Store Operations',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c4',
    title: 'Python for AI & Deep Learning Refresher',
    image: 'course_illustration_1.png',
    tags: ['Python', 'NumPy', 'TensorFlow'],
    classesCount: 12,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'revision',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'past',
    completedClasses: 12, // Fully completed course
    nextBatchStartDate: 'Starts July 8, 2026',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c5',
    title: 'System Design Interview Refresher',
    image: 'course_illustration_1.png',
    tags: ['Caching', 'Load Balancers', 'Scale'],
    classesCount: 8,
    runningBatches: 1,
    upcomingBatches: 0,
    category: 'interview-prep',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'live',
    completedClasses: 5,
    nextClassTime: 'Live Now',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c6',
    title: 'Next.js 15 Production Architecture Project',
    image: 'course_illustration_1.png',
    tags: ['Next.js', 'Vercel', 'Tailwind', 'RSC'],
    classesCount: 20,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'projects',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming',
    completedClasses: 0, // Not started yet (Upcoming)
    nextBatchStartDate: 'Starts July 12, 2026',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c7',
    title: 'DSA Crack-a-thon: Graph Marathon',
    image: 'course_illustration_1.png',
    tags: ['DFS', 'BFS', 'Dijkstra', 'Graph Theory'],
    classesCount: 6,
    runningBatches: 1,
    upcomingBatches: 0,
    category: 'challenges',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'live',
    completedClasses: 1,
    nextClassTime: 'Live Now',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c8',
    title: 'Building Slack-like Chat Application',
    image: 'course_illustration_1.png',
    tags: ['WebSockets', 'Go', 'Redis', 'Docker'],
    classesCount: 15,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'projects',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'past',
    completedClasses: 15, // Fully completed course
    nextBatchStartDate: 'Starts July 15, 2026',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c10',
    title: 'Docker & Kubernetes Production Guide',
    image: 'course_illustration_1.png',
    tags: ['Containers', 'Kubernetes', 'K8s', 'DevOps'],
    classesCount: 18,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'projects',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming',
    completedClasses: 0,
    nextBatchStartDate: 'Starts July 18, 2026',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c11',
    title: 'Node.js & Express API Scaling Masterclass',
    image: 'course_illustration_1.png',
    tags: ['NodeJS', 'Express', 'Redis', 'Caching', 'REST'],
    classesCount: 24,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'placement',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'past',
    completedClasses: 24,
    nextBatchStartDate: 'Starts July 20, 2026',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c12',
    title: 'Generative AI & LLM Integration Course',
    image: 'course_illustration_1.png',
    tags: ['GenAI', 'LLM', 'LangChain', 'OpenAI'],
    classesCount: 16,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'revision',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'live',
    completedClasses: 6,
    nextClassTime: 'Live Now',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c13',
    title: 'Data Structures & Algorithms Foundations',
    image: 'course_illustration_1.png',
    tags: ['DSA', 'Arrays', 'Trees', 'Recursion'],
    classesCount: 50,
    runningBatches: 2,
    upcomingBatches: 3,
    category: 'challenges',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'past',
    completedClasses: 50,
    nextBatchStartDate: 'Starts July 10, 2026',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c14',
    title: 'UI/UX Design Systems with Tailwind & Figma',
    image: 'course_illustration_1.png',
    tags: ['Figma', 'TailwindCSS', 'CSS', 'Design System'],
    classesCount: 12,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'projects',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming',
    completedClasses: 0,
    nextBatchStartDate: 'Starts July 25, 2026',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c15',
    title: 'Machine Learning & Predictive Modeling Pro',
    image: 'course_illustration_1.png',
    tags: ['ML', 'Scikit-learn', 'Pandas', 'Regression'],
    classesCount: 32,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'placement',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 18,
    nextClassTime: 'Next Class: Saturday, 2:00 PM',
    recentClassTitle: 'Random Forests & Decision Trees',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c16',
    title: 'SQL & Database Design Interview Prep',
    image: 'course_illustration_1.png',
    tags: ['SQL', 'PostgreSQL', 'Indexes', 'Queries'],
    classesCount: 20,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'placement',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'past',
    completedClasses: 20,
    nextBatchStartDate: 'Starts July 6, 2026',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c17',
    title: 'AWS Cloud Practitioner Certificate Batch',
    image: 'course_illustration_1.png',
    tags: ['AWS', 'Cloud', 'S3', 'EC2', 'IAM'],
    classesCount: 16,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'projects',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming',
    completedClasses: 0,
    nextBatchStartDate: 'Starts July 19, 2026',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c18',
    title: 'JavaScript Engine & V8 Under the Hood',
    image: 'course_illustration_1.png',
    tags: ['JavaScript', 'V8', 'Call Stack', 'Memory'],
    classesCount: 10,
    runningBatches: 1,
    upcomingBatches: 0,
    category: 'revision',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 4,
    nextClassTime: 'Next Class: Thursday, 5:00 PM',
    recentClassTitle: 'Garbage Collection Algorithms',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c19',
    title: 'Rust for Systems Programming & WebAssembly',
    image: 'course_illustration_1.png',
    tags: ['Rust', 'Wasm', 'Memory Safety', 'Concurrency'],
    classesCount: 24,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'projects',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'live',
    completedClasses: 8,
    nextClassTime: 'Live Now',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c20',
    title: 'TypeScript Masterclass: Type Level Programming',
    image: 'course_illustration_1.png',
    tags: ['TypeScript', 'Generics', 'Utility Types'],
    classesCount: 15,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'revision',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'upcoming',
    completedClasses: 0,
    nextBatchStartDate: 'Starts July 22, 2026',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c21',
    title: 'Cybersecurity Essentials & Penetration Testing',
    image: 'course_illustration_1.png',
    tags: ['Security', 'PenTesting', 'Kali Linux', 'Networks'],
    classesCount: 30,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'challenges',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'past',
    completedClasses: 30,
    nextBatchStartDate: 'Starts August 1, 2026',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c22',
    title: 'Micro-Frontend Architectures at FAANG Scale',
    image: 'course_illustration_1.png',
    tags: ['Module Federation', 'Webpack', 'Webpack 5'],
    classesCount: 20,
    runningBatches: 1,
    upcomingBatches: 1,
    category: 'placement',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 9,
    nextClassTime: 'Next Class: Monday, 7:00 PM',
    recentClassTitle: 'Webpack Module Federation Setup',
    scheduleType: 'weekday'
  },
  {
    id: 'v4-c23',
    title: 'Vue.js 3 Production Deployment Refresher',
    image: 'course_illustration_1.png',
    tags: ['Vue', 'Pinia', 'Vite', 'Deployment'],
    classesCount: 8,
    runningBatches: 1,
    upcomingBatches: 0,
    category: 'revision',
    state: 'not-enrolled',
    isEnrolled: false,
    classStatus: 'past',
    completedClasses: 8,
    nextBatchStartDate: 'Starts July 28, 2026',
    scheduleType: 'weekend'
  },
  {
    id: 'v4-c24',
    title: 'Data Engineering & ETL Pipelines with Spark',
    image: 'course_illustration_1.png',
    tags: ['Spark', 'ETL', 'Hadoop', 'Data Lake'],
    classesCount: 40,
    runningBatches: 1,
    upcomingBatches: 2,
    category: 'placement',
    state: 'enrolled',
    isEnrolled: true,
    classStatus: 'upcoming',
    completedClasses: 15,
    nextClassTime: 'Next Class: Friday, 3:00 PM',
    recentClassTitle: 'ETL Pipelines with PySpark',
    scheduleType: 'weekday'
  }
];

// High-fidelity custom SVGs for tools (Python & Scikit-learn)
const PythonLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.9 1a5.4 5.4 0 0 0-5.3 5.3v2.2h5.4V9h-7.6A3.4 3.4 0 0 0 1 12.4v4.4a3.4 3.4 0 0 0 3.4 3.3H6.6v-2.2a2.2 2.2 0 0 1 2.2-2.2h6.4a3.4 3.4 0 0 0 3.4-3.4V7.9A5.4 5.4 0 0 0 13.3 2.6H11.9V1z" fill="#3776AB" />
    <path d="M12.1 23a5.4 5.4 0 0 0 5.3-5.3v-2.2h-5.4v-.5h7.6a3.4 3.4 0 0 0 3.4-3.4V7.2a3.4 3.4 0 0 0-3.4-3.3H17.4v2.2a2.2 2.2 0 0 1-2.2 2.2H8.8A3.4 3.4 0 0 0 5.4 11.7v4.5A5.4 5.4 0 0 0 10.7 21.4h1.4V23z" fill="#FFD343" />
  </svg>
);


// Course Details Map (Flagship example matching the screenshot 100% exactly)
const courseDetailsMap: Record<string, {
  progress: string;
  progressPercent: number;
  topicsCount: number;
  cheatSheetsCount: number;
  description: string;
  beforeYouStart: { title: string; category: string } | null;
  topics: Topic[];
  outcomes: string[];
  skills: string[];
  tools: { name: string; renderIcon: () => React.ReactNode }[];
}> = {
  'v4-c9': {
    progress: '57%',
    progressPercent: 57,
    topicsCount: 4,
    cheatSheetsCount: 16,
    description: 'Build a static website that appears beautifully on mobile screens. Develop a Tourism website to browse through the content, videos, and images of popular destinations, websites to host conferences and events, etc. Publish your website and share it with your friends, family and beyond. Learn to use tools and technologies such as HTML, CSS and Bootstrap.',
    beforeYouStart: { title: 'Supervised Learning: Classification', category: 'Machine Learning' },
    topics: [
      {
        id: 'v4-c9-t1',
        title: 'HTML5 & CSS3 Basics',
        subTopics: [
          { id: 'v4-c9-s1-1', title: 'Web Foundations & HTML5 Structure', status: 'completed', time: 'Completed', duration: '1h 45m' },
          { id: 'v4-c9-s1-2', title: 'CSS Styling & Colors', status: 'completed', time: 'Completed', duration: '1h 30m' },
          { id: 'v4-c9-s1-3', title: 'CSS Box Model & Spacing', status: 'completed', time: 'Completed', duration: '2h 00m' }
        ]
      },
      {
        id: 'v4-c9-t2',
        title: 'Responsive Web Design',
        subTopics: [
          { id: 'v4-c9-s2-1', title: 'Flexbox Layouts & Properties', status: 'completed', time: 'Completed', duration: '1h 50m' },
          { id: 'v4-c9-s2-2', title: 'CSS Grid Layouts Deep-Dive', status: 'completed', time: 'Completed', duration: '1h 40m' },
          { id: 'v4-c9-s2-3', title: 'Media Queries & Breakpoints', status: 'completed', time: 'Completed', duration: '2h 10m' }
        ]
      },
      {
        id: 'v4-c9-t3',
        title: 'Bootstrap Framework',
        subTopics: [
          { id: 'v4-c9-s3-1', title: 'Bootstrap Grid System & Containers', status: 'completed', time: 'Completed', duration: '1h 35m' },
          { id: 'v4-c9-s3-2', title: 'Bootstrap Navigation & Cards', status: 'live', time: 'Live Now' },
          { id: 'v4-c9-s3-3', title: 'Creating a Tourism Website', status: 'upcoming', time: 'Scheduled' }
        ]
      },
      {
        id: 'v4-c9-t4',
        title: 'Publishing & Beyond',
        subTopics: [
          { id: 'v4-c9-s4-1', title: 'Interactive Forms & User Input', status: 'upcoming', time: 'Scheduled' },
          { id: 'v4-c9-s4-2', title: 'Version Control with Git & GitHub', status: 'upcoming', time: 'Scheduled' },
          { id: 'v4-c9-s4-3', title: 'Deploying to GitHub Pages', status: 'upcoming', time: 'Scheduled' }
        ]
      }
    ],
    outcomes: [
      'Design and build responsive static websites using HTML, CSS, and Bootstrap framework',
      'Create and structure web pages with semantic HTML elements and proper layout techniques',
      'Deploy and publish websites to the cloud using AWS S3, CloudFront, and Route 53'
    ],
    skills: ['Responsive Web Design', 'HTML5/CSS3', 'Bootstrap Framework'],
    tools: [
      { name: 'VS Code', renderIcon: () => <span className="text-xs">💻</span> },
      { name: 'Git', renderIcon: () => <span className="text-xs">🌿</span> }
    ]
  }
};

// Premium Figma Batch Category Tabs Background & Shadow Glow Components
const ActiveTabBackground = () => (
  <>
    {/* Shadow Glow behind the tab */}
    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[112px] h-[36px] -z-20 pointer-events-none opacity-90">
      <svg viewBox="0 0 112 36" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.61623 12.454C3.40401 5.3639 9.39691 0 16.5306 0H95.4694C102.603 0 108.596 5.3639 109.384 12.454L112 36H0L2.61623 12.454Z" fill="url(#shade-grad)"/>
        <defs>
          <linearGradient id="shade-grad" x1="56" y1="0" x2="56" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C7D8FF" stopOpacity="1"/>
            <stop offset="64%" stopColor="#FFFFFF" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>

    {/* Folder Tab Shape (Fill and Stroke) */}
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <svg viewBox="0 0 152 37" className="w-full h-[37px] overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Closed path for fill */}
        <path 
          d="M152 36.5C140.614 36.5 131.049 27.9387 129.791 16.6223L129.501 14.0084C128.646 6.31807 122.146 0.5 114.408 0.5H37.5916C29.8539 0.5 23.3535 6.31806 22.4991 14.0084L22.2086 16.6223C20.9513 27.9387 11.386 36.5 0 36.5 H152 Z" 
          fill="url(#tab-grad)"
        />
        {/* Open path for stroke */}
        <path 
          d="M152 36.5C140.614 36.5 131.049 27.9387 129.791 16.6223L129.501 14.0084C128.646 6.31807 122.146 0.5 114.408 0.5H37.5916C29.8539 0.5 23.3535 6.31806 22.4991 14.0084L22.2086 16.6223C20.9513 27.9387 11.386 36.5 0 36.5" 
          stroke="#335CFF" 
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="tab-grad" x1="76" y1="0" x2="76" y2="37" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#EBF0FF"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </>
);

const batchStatusTabs = [
  { id: 'running', label: 'Running', icon: Layers },
  { id: 'upcoming', label: 'Upcoming', icon: Hourglass },
  { id: 'completed', label: 'Past', icon: History }
];

export const LiveClassesV4: React.FC<LiveClassesV4Props> = ({
  coursesList = [],
  handleEnrollCourse: _handleEnrollCourse,
  handleJoinClass,
  searchTerm: globalSearchTerm = '',
  onSearchChange,
  isScrolled: _isScrolled = false,
  scheduleType: propScheduleType,
  onScheduleTypeChange
}) => {
  // Navigation State for SPA details page transition
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'topics' | 'cheatsheets' | 'live'>('topics');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Use lifted scheduleType state from props, falling back to local state if needed
  const [localScheduleType, setLocalScheduleType] = useState<'weekday' | 'weekend'>('weekday');
  const scheduleType = propScheduleType || localScheduleType;
  const setScheduleType = onScheduleTypeChange || setLocalScheduleType;

  const [selectedStatus, setSelectedStatus] = useState<string>('running');

  // Local reactive state for courses data to allow dynamic inline enrollment
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  // States to manage the inline enrollment flow inside the "Live Classes" tab
  const [selectedBatchId, setSelectedBatchId] = useState<Record<string, string>>({});
  const [enrollFlowView, setEnrollFlowView] = useState<Record<string, 'batch-list' | 'schedule-details' | 'enrolled'>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Search Modal states (same as V2)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchTab, setActiveSearchTab] = useState<'live' | 'courses' | 'events' | 'resources'>('live');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveSearchTab('live');
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Escape key listener to close modal
  useEffect(() => {
    const handleEscapeClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleEscapeClose);
    }
    return () => window.removeEventListener('keydown', handleEscapeClose);
  }, [isSearchOpen]);

  // Autofocus input in modal & Lock scroll
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


  // Filter courses for main V4 grid based on selections
  const filteredCourses = courses.filter((course) => {
    // 1. Weekday/Weekend Filter (mwf/tts/weekly map to weekday)
    const courseSchedule = (course.scheduleType === 'weekly' || course.scheduleType === 'weekday' || course.scheduleType === 'mwf' || course.scheduleType === 'tts')
      ? 'weekday'
      : 'weekend';
    const matchesSchedule = courseSchedule === scheduleType;

    // 2. Status Filter matching user business rules:
    // - Running: currently active/running (live, or partially completed, or next class scheduled and not fully completed)
    // - Upcoming: haven't started yet (completedClasses is 0 or undefined, classStatus is upcoming or has future start date)
    // - Completed: fully completed (completedClasses === classesCount)
    let courseStatus = 'upcoming';
    if (course.completedClasses !== undefined && course.completedClasses === course.classesCount) {
      courseStatus = 'completed';
    } else if (course.classStatus === 'live' || (course.completedClasses !== undefined && course.completedClasses > 0) || (course.nextClassTime && !course.nextClassTime.includes('Batch Starts'))) {
      courseStatus = 'running';
    } else {
      courseStatus = 'upcoming';
    }

    const matchesStatus = selectedStatus === 'all' || selectedStatus === courseStatus;

    // 3. Search Filter
    const matchesSearch = globalSearchTerm.trim() === '' ||
      course.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(globalSearchTerm.toLowerCase()));

    return matchesSchedule && matchesStatus && matchesSearch;
  });

  // Curated Recommendations Group (Trending or New courses) for V4
  const recommendedGroup = courses.filter(c => {
    const isWeekendCourse = c.category === 'frontend' || c.tags.some(t => t.toLowerCase().includes('weekend'));
    if (scheduleType === 'weekday' && isWeekendCourse) return false;
    if (scheduleType === 'weekend' && !isWeekendCourse) return false;
    return c.isTrending || c.isNew || c.showSaleableInfo;
  });

  // Search Results Filters (Same as V2)
  const getFilteredLiveClasses = () => {
    const listToSearch = coursesList.length > 0 ? coursesList : courses;
    if (!searchQuery.trim()) return listToSearch.slice(0, 4);
    return listToSearch.filter(c =>
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

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  // Helper to resolve active course object
  const getActiveCourseObject = () => {
    if (!activeCourseId) return null;
    const course = courses.find(c => c.id === activeCourseId) || coursesList.find(c => c.id === activeCourseId);
    return course || null;
  };

  // Dynamic Details Generator Fallback for non-flagship courses
  const getCourseDetails = (course: Course) => {
    if (courseDetailsMap[course.id]) {
      return courseDetailsMap[course.id];
    }
    
    // Dynamic generation
    const classesCount = course.classesCount || 12;
    const completedClasses = course.completedClasses !== undefined ? course.completedClasses : (course.isEnrolled ? 4 : 0);
    const isLiveNow = course.classStatus === 'live';
    
    const progressPercent = classesCount > 0 
      ? Math.round((completedClasses / classesCount) * 100)
      : 0;
      
    // Generate topics & subtopics
    const tagsToUse = course.tags.length > 0 ? course.tags : ['Fundamentals', 'Core Concepts', 'Advanced Techniques', 'Real-world Projects'];
    const topicsCount = Math.max(3, tagsToUse.length);
    const topics: Topic[] = [];
    
    let subTopicCounter = 0;
    
    for (let i = 0; i < topicsCount; i++) {
      const tag = tagsToUse[i % tagsToUse.length];
      const subTopicsInTopic: SubTopic[] = [];
      const subTopicsCount = Math.ceil(classesCount / topicsCount);
      
      for (let j = 0; j < subTopicsCount; j++) {
        if (subTopicCounter >= classesCount) break;
        
        let status: 'completed' | 'live' | 'upcoming' = 'upcoming';
        if (subTopicCounter < completedClasses) {
          status = 'completed';
        } else if (subTopicCounter === completedClasses && isLiveNow) {
          status = 'live';
        } else {
          status = 'upcoming';
        }
        
        const subTopicNum = j + 1;
        const topicNum = i + 1;
        
        subTopicsInTopic.push({
          id: `sub-${course.id}-${topicNum}-${subTopicNum}`,
          title: `Deep Dive into ${tag} Part ${subTopicNum}`,
          status,
          time: status === 'live' ? 'Live Now' : status === 'upcoming' ? 'Scheduled' : 'Completed',
          duration: status === 'completed' ? '1h 30m' : undefined
        });
        
        subTopicCounter++;
      }
      
      topics.push({
        id: `topic-${course.id}-${i + 1}`,
        title: `${tag} Mastery Module`,
        subTopics: subTopicsInTopic
      });
    }

    const outcomes = [
      `Design and build production-grade architectures using ${course.title} principles`,
      `Solve complex scaling challenges, applying professional design methodologies`,
      `Integrate and deploy applications securely using industry-standard platforms`
    ];

    const tools = course.tags.map(tag => {
      let renderIcon = () => <span className="text-xs">🛠️</span>;
      if (tag.toLowerCase().includes('react')) renderIcon = () => <span className="text-xs">⚛️</span>;
      if (tag.toLowerCase().includes('python')) renderIcon = () => <PythonLogo />;
      if (tag.toLowerCase().includes('java')) renderIcon = () => <span className="text-xs">☕</span>;
      if (tag.toLowerCase().includes('node')) renderIcon = () => <span className="text-xs">🟢</span>;
      if (tag.toLowerCase().includes('docker')) renderIcon = () => <span className="text-xs">🐳</span>;
      if (tag.toLowerCase().includes('sql')) renderIcon = () => <span className="text-xs">🛢️</span>;
      if (tag.toLowerCase().includes('git')) renderIcon = () => <span className="text-xs">🌿</span>;
      return { name: tag, renderIcon };
    }).slice(0, 3);
    
    if (tools.length === 0) {
      tools.push(
        { name: 'VS Code', renderIcon: () => <span className="text-xs">💻</span> },
        { name: 'Git', renderIcon: () => <span className="text-xs">🌿</span> }
      );
    }

    return {
      progress: progressPercent > 0 ? `${progressPercent}%` : '0%',
      progressPercent,
      topicsCount: topics.length,
      cheatSheetsCount: Math.round(topics.length * 4),
      description: `Master ${course.title} from basic to advanced levels. This comprehensive course covers all key concepts, real-world projects, and hands-on laboratory exercises designed by industry experts to prepare you for top-tier tech roles.`,
      beforeYouStart: course.tags.length > 0 ? { title: `${course.tags[0]} Fundamentals`, category: 'Prerequisite' } : null,
      topics,
      outcomes,
      skills: course.tags,
      tools
    };
  };

  const activeCourse = getActiveCourseObject();
  const activeDetails = activeCourse ? getCourseDetails(activeCourse) : null;

  // Lock scroll when viewing course details page and reset view for enrolled courses
  useEffect(() => {
    if (activeCourseId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Always reset view to enrolled dashboard for already enrolled courses when opened from card
      const course = courses.find(c => c.id === activeCourseId) || coursesList.find(c => c.id === activeCourseId);
      if (course) {
        const isEnrolled = course.isEnrolled || course.state === 'enrolled' || course.state === 'live';
        if (isEnrolled) {
          setEnrollFlowView(prev => ({ ...prev, [activeCourseId]: 'enrolled' }));
        }
      }
    }
  }, [activeCourseId, courses, coursesList]);

  // Automatically expand the live topic or the first topic on activeCourseId change
  useEffect(() => {
    if (activeCourseId && activeDetails) {
      const liveTopic = activeDetails.topics.find(t => t.subTopics.some(s => s.status === 'live'));
      if (liveTopic) {
        setExpandedTopics({ [liveTopic.id]: true });
      } else if (activeDetails.topics.length > 0) {
        setExpandedTopics({ [activeDetails.topics[0].id]: true });
      }
    }
  }, [activeCourseId, activeDetails]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };


  return (
    <div className="w-full relative min-h-screen pb-20 bg-slate-50/40">
      
      {/* 1. SUCCESS TOAST NOTIFICATION OVERLAY inside V4 */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -80 }}
            className="fixed inset-x-0 top-6 max-w-[420px] mx-auto bg-[#E7F6EC] border border-emerald-200 py-3.5 px-5 flex items-center gap-3 z-[100] shadow-xl rounded-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-emerald-800 font-extrabold text-[13.5px] tracking-tight">
              {successToast}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeCourse && activeDetails ? (
          /* ========================================================= */
          /* COURSE DETAILS PAGE VIEW (Matching the Screenshot Exactly) */
          /* ========================================================= */
          <motion.div
            key="details-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6"
          >
            {/* Back button row */}
            <div className="flex items-center">
              <button 
                onClick={() => setActiveCourseId(null)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-[13px] font-bold cursor-pointer bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left 2 Columns */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                
                {/* Course Badge & Icon */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-[#1845FF] text-white flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-[#059669] uppercase tracking-wider block">
                      COURSE
                    </span>
                    <h2 className="text-[13px] font-bold text-slate-400 mt-0.5 uppercase">
                      {activeCourse.category}
                    </h2>
                  </div>
                </div>

                {/* Title & Circular Progress Ring Row */}
                <div className="flex items-start justify-between gap-6 border-b border-slate-100 pb-4">
                  <div>
                    <h1 className="text-[24px] sm:text-[28px] font-bold text-slate-850 font-heading leading-tight tracking-tight">
                      {activeCourse.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mt-2">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>{activeDetails.topicsCount} Topics</span>
                    </div>
                  </div>

                  {/* Circular Progress Ring */}
                  <div className="flex items-center gap-2 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-2 px-3.5 shadow-sm">
                    <span className="text-[14px] font-extrabold text-cyan-600">
                      {activeDetails.progress}
                    </span>
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="#F1F5F9"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="#06B6D4" // Vibrant Cyan ring
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 12}
                          strokeDashoffset={2 * Math.PI * 12 * (1 - activeDetails.progressPercent / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-slate-500 text-[13.5px] leading-relaxed max-w-3xl">
                  {activeDetails.description}
                </p>

                {/* Before You Start section */}
                {activeDetails.beforeYouStart && (
                  <div className="mt-4">
                    <h3 className="text-[14.5px] font-bold text-slate-800 font-heading">Before You Start</h3>
                    <p className="text-[11.5px] text-slate-400 mt-0.5">
                      These courses will help you follow along. You can skip them if you're already comfortable.
                    </p>

                    <div className="mt-3 p-3.5 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between max-w-md shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-purple-500 uppercase block tracking-wider">Prerequisite</span>
                          <span className="text-[13px] font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                            {activeDetails.beforeYouStart.title}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                )}

                {/* Segment Tabs Row */}
                <div className="border-b border-slate-200 mt-6 flex gap-6 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveDetailsTab('topics')}
                    className={`border-b-2 pb-2.5 text-[13.5px] font-bold cursor-pointer transition-all whitespace-nowrap ${
                      activeDetailsTab === 'topics'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Topics ({activeDetails.topicsCount})
                  </button>

                  <button
                    onClick={() => setActiveDetailsTab('live')}
                    className={`border-b-2 pb-2.5 text-[13.5px] font-bold cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeDetailsTab === 'live'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      {activeCourse.classStatus === 'live' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${activeCourse.classStatus === 'live' ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                    </span>
                    <span>Live Classes</span>
                  </button>

                  <button
                    onClick={() => setActiveDetailsTab('cheatsheets')}
                    className={`border-b-2 pb-2.5 text-[13.5px] font-bold cursor-pointer transition-all whitespace-nowrap ${
                      activeDetailsTab === 'cheatsheets'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Cheat Sheets ({activeDetails.cheatSheetsCount})
                  </button>
                </div>

                {/* Tab Contents */}
                {activeDetailsTab === 'topics' && (
                  <div className="space-y-4 mt-4">
                    {activeDetails.topics.map((topic, topicIdx) => {
                      const isExpanded = !!expandedTopics[topic.id];
                      const hasLiveSubTopic = topic.subTopics.some(s => s.status === 'live');
                      
                      return (
                        <div 
                          key={topic.id}
                          className="bg-white border border-slate-200/75 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all animate-fade-in"
                        >
                          {/* Accordion Header */}
                          <button
                            onClick={() => toggleTopic(topic.id)}
                            className="w-full px-5 py-4 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-left cursor-pointer select-none border-none"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Chevron indicator */}
                              <div className="text-slate-400 shrink-0">
                                {isExpanded ? (
                                  <ChevronDown className="w-5 h-5" />
                                ) : (
                                  <ChevronRight className="w-5 h-5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                                  TOPIC {topicIdx + 1}
                                </span>
                                <h4 className="text-[14px] font-bold text-slate-800 leading-snug truncate">
                                  {topic.title}
                                </h4>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Live indicator on header */}
                              {hasLiveSubTopic && (
                                <span className="inline-flex items-center gap-1 bg-red-105 text-red-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                  Live
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400 font-bold bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg shadow-sm">
                                {topic.subTopics.length} {topic.subTopics.length === 1 ? 'Session' : 'Sessions'}
                              </span>
                            </div>
                          </button>

                          {/* Accordion Content (Sub-topics Timeline) */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className="border-t border-slate-100"
                              >
                                <div className="px-5 py-4 pl-9 relative space-y-4">
                                  {/* Timeline vertical connector line */}
                                  <div className="absolute left-[25px] top-4 bottom-4 w-0.5 bg-slate-100" />

                                  {topic.subTopics.map((sub, subIdx) => {
                                    const isSubLive = sub.status === 'live';
                                    const isSubCompleted = sub.status === 'completed';
                                    
                                    return (
                                      <div key={sub.id} className="relative flex items-start justify-between gap-4 group/sub select-none">
                                        
                                        {/* Timeline Node Icon */}
                                        <div className="absolute left-[-22px] top-0.5 shrink-0 z-10">
                                          {isSubCompleted ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm">
                                              <Check className="w-3 h-3 stroke-[3]" />
                                            </div>
                                          ) : isSubLive ? (
                                            <div className="w-5 h-5 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shadow-md animate-pulse">
                                              <span className="h-2 w-2 rounded-full bg-red-600" />
                                            </div>
                                          ) : (
                                            <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-205 flex items-center justify-center text-slate-400 shadow-sm group-hover/sub:border-slate-300 transition-colors">
                                              <span className="text-[9px] font-bold">{subIdx + 1}</span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Sub-topic Info */}
                                        <div className="space-y-0.5 min-w-0 pl-1">
                                          <h5 className={`text-[13px] font-bold leading-snug group-hover/sub:text-blue-600 transition-colors ${
                                            isSubCompleted ? 'text-slate-600' : isSubLive ? 'text-red-750' : 'text-slate-750'
                                          }`}>
                                            {sub.title}
                                          </h5>
                                          
                                          {/* Status description */}
                                          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 font-semibold">
                                            {isSubCompleted ? (
                                              <span className="text-emerald-600">Recorded • {sub.duration || '1h 30m'}</span>
                                            ) : isSubLive ? (
                                              <span className="text-red-600 animate-pulse font-extrabold">LIVE NOW</span>
                                            ) : (
                                              <span>Upcoming Session</span>
                                            )}
                                          </div>
                                        </div>

                                        {/* Action Buttons for sub-topics */}
                                        <div className="shrink-0 pl-2">
                                          {isSubCompleted ? (
                                            <button
                                              onClick={() => alert(`Playing recording for: "${sub.title}"`)}
                                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer border-none"
                                            >
                                              Watch
                                            </button>
                                          ) : isSubLive ? (
                                            <button
                                              onClick={() => handleJoinClass?.(activeCourse.id)}
                                              className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer border-none"
                                            >
                                              Join
                                            </button>
                                          ) : (
                                            <span className="text-[10.5px] text-slate-400 bg-slate-55 border border-slate-200/80 px-2 py-0.5 rounded-lg font-bold">
                                              Locked
                                            </span>
                                          )}
                                        </div>

                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeDetailsTab === 'live' && (() => {
                  const isEnrolled = activeCourse.isEnrolled || activeCourse.state === 'enrolled' || activeCourse.state === 'live';
                  const currentFlowView = enrollFlowView[activeCourse.id] || (isEnrolled ? 'enrolled' : 'batch-list');
                  const currentBatchId = selectedBatchId[activeCourse.id] || 'b-ongoing';

                  const liveSub = activeDetails.topics.flatMap(t => t.subTopics).find(s => s.status === 'live');
                  const liveParentTopic = activeDetails.topics.find(t => t.subTopics.some(s => s.id === liveSub?.id));
                  const nextUpcomingSub = activeDetails.topics.flatMap(t => t.subTopics).find(s => s.status === 'upcoming');

                  const totalClasses = activeCourse.classesCount || 12;

                  const getClassDateText = (classNum: number, batchStatus: string) => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    if (batchStatus === 'completed') {
                      const date = new Date(2026, 0, 20); // 20 Jan
                      date.setDate(date.getDate() + (classNum - 1) * 2);
                      return `${date.getDate()} ${months[date.getMonth()]}`;
                    } else if (batchStatus === 'upcoming') {
                      const date = new Date(2026, 3, 15); // 15 Apr
                      date.setDate(date.getDate() + (classNum - 1) * 2);
                      return `${date.getDate()} ${months[date.getMonth()]}`;
                    } else { // ongoing
                      if (classNum === 1) return '4 Apr';
                      if (classNum === 2) return '6 Apr';
                      if (classNum === 3) return '8 Apr (Today)';
                      if (classNum === 4) return '10 Apr';
                      if (classNum === 5) return '12 Apr';
                      if (classNum === 6) return '14 Apr';
                      
                      const date = new Date(2026, 3, 8); // 8 Apr
                      date.setDate(date.getDate() + (classNum - 3) * 2);
                      return `${date.getDate()} ${months[date.getMonth()]}`;
                    }
                  };

                  const batches = [
                    {
                      id: 'b-completed',
                      title: '20th Jan 2026',
                      status: 'completed',
                      scheduleType: 'Weekday',
                      classesCount: totalClasses,
                      completedCount: totalClasses,
                      timings: 'Mon - Fri  •  6 PM - 7 PM  |  8 PM - 9 PM',
                      startDateText: '20 Jan, 26',
                      endDateText: '1 Mar, 26',
                      slot1Timing: '6 PM - 7 PM',
                      slot2Timing: '8 PM - 9 PM',
                      desc: 'Master React from basics to advanced patterns. Build production-scale applications.'
                    },
                    {
                      id: 'b-ongoing',
                      title: '1st April 2026',
                      status: 'ongoing',
                      scheduleType: 'Weekday',
                      classesCount: totalClasses,
                      completedCount: activeCourse.completedClasses !== undefined ? activeCourse.completedClasses : 12,
                      studentsEnrolled: 240,
                      timings: 'Mon - Fri  •  6 PM - 7 PM  |  8:30 PM - 9:30 PM',
                      startDateText: '10 Apr, 26',
                      endDateText: '20 Apr, 26',
                      slot1Timing: '6 PM - 7 PM',
                      slot2Timing: '8:30 PM - 9:30 PM',
                      desc: 'Features active live sessions, real-time Q&A, and live mentor support. Best for active learning.'
                    },
                    {
                      id: 'b-upcoming',
                      title: '15th April 2026',
                      status: 'upcoming',
                      scheduleType: 'Weekend',
                      classesCount: totalClasses,
                      studentsEnrolled: 240,
                      timings: 'Sat - Sun  •  10 AM - 12 PM  |  2 PM - 4 PM',
                      startDateText: '15 Apr, 26',
                      endDateText: '25 Apr, 26',
                      slot1Timing: '10 AM - 12 PM',
                      slot2Timing: '2 PM - 4 PM',
                      recommended: true,
                      desc: 'Reserve your seat for the next cohort. All sessions will be conducted fully live.'
                    }
                  ];

                  const selectedBatch = batches.find(b => b.id === currentBatchId) || batches[1];

                  if (currentFlowView === 'batch-list') {
                    return (
                      <div className="space-y-6 mt-4 animate-fade-in">
                        {/* Header Info */}
                        <div className="border-b border-slate-100 pb-5">
                          <h2 className="text-[20px] font-bold text-slate-900 leading-tight font-heading">
                            {activeCourse.title}
                          </h2>
                          <p className="text-slate-500 text-[13px] leading-relaxed font-medium mt-1.5">
                            Master the fundamentals to advanced techniques. Create production-ready applications leveraging modern frameworks and clean architecture.
                          </p>
                        </div>

                        {/* Batch list */}
                        <div className="space-y-4">
                          <h3 className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">
                            Choose your batch
                          </h3>

                          <div className="space-y-4">
                            {batches.map((batch) => {
                              const isSelected = currentBatchId === batch.id;
                              const isEnrolledBatch = isEnrolled && (batch.id === (selectedBatchId[activeCourse.id] || 'b-ongoing'));
                              
                              return (
                                <div
                                  key={batch.id}
                                  onClick={() => setSelectedBatchId(prev => ({ ...prev, [activeCourse.id]: batch.id }))}
                                  className={`relative border rounded-[20px] p-5 flex items-center justify-between transition-all duration-200 select-none cursor-pointer bg-white shadow-sm hover:shadow-md ${
                                    isSelected
                                      ? 'border-blue-600 bg-blue-50/5 shadow-lg shadow-blue-500/5 scale-[1.01]'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {/* Recommended Badge overlay */}
                                  {batch.recommended && (
                                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md z-10">
                                      Recommended
                                    </div>
                                  )}

                                  {/* Currently Enrolled Batch Pill */}
                                  {isEnrolledBatch && (
                                    <div className="absolute top-0 left-8 -translate-y-1/2 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      <span>Enrolled Batch</span>
                                    </div>
                                  )}

                                  {/* Info */}
                                  <div className="space-y-3 flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-[16px] font-bold text-slate-900 font-heading">
                                        {batch.title}
                                      </span>
                                      
                                      {batch.status === 'completed' && (
                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-slate-200 uppercase tracking-wider">
                                          Completed
                                        </span>
                                      )}
                                      {batch.status === 'ongoing' && (
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-wider">
                                          Ongoing
                                        </span>
                                      )}
                                      {batch.status === 'upcoming' && (
                                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-amber-100 uppercase tracking-wider">
                                          Upcoming
                                        </span>
                                      )}
                                      {batch.scheduleType && (
                                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${
                                          batch.scheduleType === 'Weekday'
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                            : 'bg-purple-50 text-purple-700 border-purple-100'
                                        }`}>
                                          {batch.scheduleType}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 flex-wrap">
                                      <span className="flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                        {batch.status === 'completed' ? (
                                          <span>{batch.classesCount} classes</span>
                                        ) : batch.status === 'ongoing' ? (
                                          <span className="flex items-center gap-1 text-slate-650">
                                            <PlayCircle className="w-3.5 h-3.5 text-slate-400 fill-current" />
                                            <span><strong className="text-slate-750 font-bold">{batch.completedCount} of {batch.classesCount}</strong> classes completed</span>
                                          </span>
                                        ) : (
                                          <span>{batch.classesCount} classes</span>
                                        )}
                                      </span>
                                      
                                      {batch.studentsEnrolled && (
                                        <span className="flex items-center gap-1.5">
                                          <Users className="w-3.5 h-3.5 text-slate-400" />
                                          <span>{batch.studentsEnrolled} students enrolled</span>
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{batch.timings}</span>
                                    </div>
                                  </div>

                                  {/* Selector radio */}
                                  <div className="shrink-0 flex items-center justify-center pl-2">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                      isSelected
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    }`}>
                                      {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                      )}
                                    </div>
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="pt-6 border-t border-slate-100 space-y-4 bg-white">
                          <div className="flex gap-3">
                            {isEnrolled && (
                              <button
                                onClick={() => setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'enrolled' }))}
                                className="px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-bold transition-all cursor-pointer bg-white"
                              >
                                Cancel
                              </button>
                            )}

                            {selectedBatch.status === 'completed' ? (
                              <button
                                onClick={() => setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'schedule-details' }))}
                                className="w-full h-11 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50/30 text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white"
                              >
                                <span>View recordings</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'schedule-details' }))}
                                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer border-none"
                              >
                                <span>Continue with selected batch</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                            Priority assist — free and simple enrollment.
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (currentFlowView === 'schedule-details') {
                    // Resolve sub-topic statuses for this specific batch preview
                    const previewTopics = activeDetails.topics.map((topic) => {
                      const previewSubTopics = topic.subTopics.map((sub) => {
                        let status: 'completed' | 'live' | 'upcoming' = 'upcoming';
                        if (selectedBatch.id === 'b-completed') {
                          status = 'completed';
                        } else if (selectedBatch.id === 'b-upcoming') {
                          status = 'upcoming';
                        } else {
                          status = sub.status;
                        }
                        return { ...sub, status };
                      });
                      return { ...topic, subTopics: previewSubTopics };
                    });

                    const totalCompleted = selectedBatch.status === 'completed'
                      ? selectedBatch.classesCount
                      : selectedBatch.status === 'upcoming'
                        ? 0
                        : selectedBatch.completedCount || 0;

                    const progressPercent = selectedBatch.classesCount > 0
                      ? Math.round((totalCompleted / selectedBatch.classesCount) * 100)
                      : 0;

                    return (
                      <div className="space-y-6 mt-4 animate-fade-in relative pb-16">
                        
                        {/* Header Row */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <button
                            onClick={() => setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'batch-list' }))}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11.5px] font-bold cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Go to batch</span>
                          </button>
                          
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Selected Batch
                          </span>
                        </div>

                        {/* Title & Badge Row */}
                        <div className="space-y-2">
                          <h2 className="text-[20px] font-bold text-slate-900 font-heading">
                            Schedule Details
                          </h2>
                          <div className="flex items-center gap-2.5">
                            <span className="text-[14px] font-extrabold text-slate-500">
                              {selectedBatch.title}
                            </span>
                            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border leading-none select-none ${
                              selectedBatch.status === 'completed'
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : selectedBatch.status === 'ongoing'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {selectedBatch.status}
                            </span>
                            {selectedBatch.scheduleType && (
                              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border leading-none select-none ${
                                selectedBatch.scheduleType === 'Weekday'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                  : 'bg-purple-50 text-purple-700 border-purple-100'
                              }`}>
                                {selectedBatch.scheduleType}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Lectures Info / Progress Bar Card */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                          <div className="flex justify-between items-center text-[11.5px] font-bold text-slate-450">
                            <div className="flex flex-col">
                              <span className="text-[9.5px] text-slate-400 uppercase">Start</span>
                              <span className="text-slate-800 font-extrabold mt-0.5">{selectedBatch.startDateText}</span>
                            </div>
                            
                            <span className="text-slate-700 font-extrabold text-xs">
                              Classes completed - {totalCompleted} out of {selectedBatch.classesCount}
                            </span>

                            <div className="flex flex-col text-right">
                              <span className="text-[9.5px] text-slate-400 uppercase">End</span>
                              <span className="text-slate-800 font-extrabold mt-0.5">{selectedBatch.endDateText}</span>
                            </div>
                          </div>

                          {/* Progress bar fill */}
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Class Overview Timeline */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-800 font-heading">
                              Class Overview
                            </h3>

                            {/* Dot Legend */}
                            <div className="flex items-center gap-4 flex-wrap text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Completed</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                <span>Today</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-350" />
                                <span>Upcoming</span>
                              </div>
                            </div>
                          </div>

                          {/* Table Headers */}
                          <div className="grid grid-cols-12 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider pb-1 pl-6">
                            <span className="col-span-2">Date</span>
                            <span className="col-span-2">Class</span>
                            <span className="col-span-8">Topic</span>
                          </div>

                          {/* Syllabus Timeline List */}
                          <div className="relative border-l-2 border-dashed border-slate-200 ml-4.5 pl-5.5 space-y-5 relative">
                            {(() => {
                              let absoluteClassNumber = 0;
                              return previewTopics.map((topic) => 
                                topic.subTopics.map((sub) => {
                                  absoluteClassNumber++;
                                  const classNum = absoluteClassNumber;
                                  
                                  const isToday = selectedBatch.status === 'ongoing' && classNum === 3;
                                  const isSubCompleted = selectedBatch.status === 'completed' || (selectedBatch.status === 'ongoing' && classNum < 3);

                                  return (
                                    <div key={sub.id} className="relative grid grid-cols-12 items-start gap-2 py-3 border-b border-slate-100/40 group/timeline select-none">
                                      {/* Node Dot */}
                                      <div className={`absolute -left-[27px] top-[17px] w-2.5 h-2.5 rounded-full border-2 border-white z-10 transition-transform duration-200 group-hover/timeline:scale-125 ${
                                        isSubCompleted
                                          ? 'bg-emerald-500'
                                          : isToday
                                            ? 'bg-blue-600 ring-4 ring-blue-500/10'
                                            : 'bg-slate-300'
                                      }`} />

                                      {/* Column 1: Date */}
                                      <div className="col-span-2 text-[12px] font-semibold text-slate-500 pt-1">
                                        {getClassDateText(classNum, selectedBatch.status)}
                                      </div>

                                      {/* Column 2: Class */}
                                      <div className="col-span-2 text-[10.5px] font-bold text-slate-400 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded w-fit text-center mt-0.5">
                                        {classNum}/{selectedBatch.classesCount}
                                      </div>

                                      {/* Column 3: Topic & Timings */}
                                      <div className="col-span-8 space-y-2">
                                        <h5 className={`text-[13px] font-bold leading-snug group-hover/timeline:text-blue-650 transition-colors ${
                                          isSubCompleted ? 'text-slate-655' : 'text-slate-755'
                                        }`}>
                                          {sub.title}
                                        </h5>

                                        {/* Slot timing buttons */}
                                        <div className="flex items-center gap-2">
                                          {/* Slot 1 Timing Button */}
                                          {isSubCompleted ? (
                                            <button
                                              onClick={() => alert(`Playing recording for "${sub.title}" slot 1...`)}
                                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none"
                                            >
                                              <PlayCircle className="w-3.5 h-3.5 text-blue-600 fill-current" />
                                              <span>{selectedBatch.slot1Timing || '6-7 PM'}</span>
                                            </button>
                                          ) : isToday ? (
                                            // Today 1st slot completed
                                            <button
                                              onClick={() => alert(`Playing recording for today's completed slot 1...`)}
                                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none"
                                            >
                                              <PlayCircle className="w-3.5 h-3.5 text-blue-600 fill-current" />
                                              <span>{selectedBatch.slot1Timing || '6-7 PM'}</span>
                                            </button>
                                          ) : (
                                            <button
                                              disabled
                                              className="bg-slate-50 border border-slate-200 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                                            >
                                              <Clock className="w-3.5 h-3.5 text-slate-350" />
                                              <span>{selectedBatch.slot1Timing || '6-7 PM'}</span>
                                            </button>
                                          )}

                                          {/* Slot 2 Timing Button */}
                                          {isSubCompleted ? (
                                            <button
                                              onClick={() => alert(`Playing recording for "${sub.title}" slot 2...`)}
                                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none"
                                            >
                                              <PlayCircle className="w-3.5 h-3.5 text-blue-600 fill-current" />
                                              <span>{selectedBatch.slot2Timing || '8:30-9:30 PM'}</span>
                                            </button>
                                          ) : isToday ? (
                                            // Today 2nd slot is LIVE (render as solid blue)
                                            <button
                                              onClick={() => handleJoinClass?.(activeCourse.id)}
                                              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3.5 py-1 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer border-none"
                                            >
                                              <span className="relative flex h-1.5 w-1.5 shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                              </span>
                                              <span>{selectedBatch.slot2Timing || '8:30-9:30 PM'}</span>
                                            </button>
                                          ) : (
                                            <button
                                              disabled
                                              className="bg-slate-50 border border-slate-200 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                                            >
                                              <Clock className="w-3.5 h-3.5 text-slate-350" />
                                              <span>{selectedBatch.slot2Timing || '8:30-9:30 PM'}</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              );
                            })()}
                          </div>
                          </div>

                        {/* CTA Footer */}
                        <div className="pt-6 border-t border-slate-100 bg-white space-y-3">
                          {selectedBatch.status === 'completed' ? (
                            <button
                              onClick={() => {
                                setCourses(prev => prev.map(c => c.id === activeCourse.id ? { ...c, isEnrolled: true, completedClasses: totalClasses, classStatus: 'past', state: 'enrolled' } : c));
                                setSuccessToast('Recordings unlocked successfully!');
                                setTimeout(() => {
                                  setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'enrolled' }));
                                  setSuccessToast(null);
                                }, 1500);
                              }}
                              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none shadow-md shadow-blue-500/10"
                            >
                              <span>Access recordings</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                // Enroll in the batch
                                const enrolledStatus = selectedBatch.status;
                                setCourses(prev => prev.map(c => {
                                  if (c.id === activeCourse.id) {
                                    return {
                                      ...c,
                                      isEnrolled: true,
                                      state: enrolledStatus === 'ongoing' ? 'live' : 'enrolled',
                                      classStatus: enrolledStatus === 'ongoing' ? 'live' : 'upcoming',
                                      completedClasses: enrolledStatus === 'ongoing' ? Math.round(totalClasses * 0.6) : 0,
                                      nextClassTime: enrolledStatus === 'ongoing' ? 'Next Class: Today, 8:30 PM' : 'Next Class: July 15, 7:00 PM'
                                    };
                                  }
                                  return c;
                                }));

                                setSuccessToast("You've successfully enrolled!");
                                setTimeout(() => {
                                  setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'enrolled' }));
                                  setSuccessToast(null);
                                }, 1500);
                              }}
                              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13.5px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer border-none"
                            >
                              <span>Enroll in this batch</span>
                            </button>
                          )}

                          <div className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                            You can join classes at any time after this.
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Default View: Enrolled Dashboard
                  return (
                    <div className="space-y-6 mt-4 animate-fade-in">
                      {/* Back button to batches list */}
                      <div className="flex items-center justify-between pb-1">
                        <button
                          onClick={() => setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'batch-list' }))}
                          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-[11.5px] font-bold cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Go to batches list</span>
                        </button>
                      </div>

                      {/* Active Batch Header card with Switch Cohort button */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 px-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-emerald-600 uppercase block tracking-wider">Active Cohort</span>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-[13px] font-bold text-slate-850">
                                Enrolled in {currentBatchId === 'b-completed' ? 'Self-Paced Completed Batch' : currentBatchId === 'b-upcoming' ? 'Upcoming Cohort' : 'Ongoing Live Batch'}
                              </span>
                              {selectedBatch.scheduleType && (
                                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border leading-none select-none ${
                                  selectedBatch.scheduleType === 'Weekday'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                    : 'bg-purple-50 text-purple-700 border-purple-100'
                                }`}>
                                  {selectedBatch.scheduleType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setEnrollFlowView(prev => ({ ...prev, [activeCourse.id]: 'batch-list' }));
                          }}
                          className="text-[11px] text-blue-650 hover:text-blue-750 font-extrabold bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg border border-blue-100/50 shadow-sm transition-all cursor-pointer shrink-0 self-start sm:self-center"
                        >
                          Switch Cohort
                        </button>
                      </div>

                      {/* Layout Grid for Enrolled Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        
                        {/* Left/Center Columns: Live Banner, Timeline & Recordings */}
                        <div className="md:col-span-2 space-y-5">
                          
                          {/* Live Class Banner */}
                          {liveSub && currentBatchId === 'b-ongoing' ? (
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Monitor className="w-24 h-24 text-red-500" />
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                <div className="space-y-1.5">
                                  <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                                    Live Session in Progress
                                  </span>
                                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug">
                                    {liveSub.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">
                                    Module: {liveParentTopic?.title || 'Advanced Concepts'}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleJoinClass?.(activeCourse.id)}
                                  className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-red-500/15 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border-none"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  <span>Join Live Session</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 shadow-sm py-8">
                              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                                <Monitor className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-slate-800 font-heading">No Live Class Right Now</h4>
                                <p className="text-xs text-slate-500 max-w-sm">
                                  {currentBatchId === 'b-completed' 
                                    ? 'This is a self-paced completed cohort. All sessions are recorded and watchable below.'
                                    : 'There is no active live session running for this cohort at this moment. You can check the schedule below.'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Interactive Class Overview Timeline */}
                          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <h4 className="text-[13px] font-bold text-slate-800 font-heading">
                                Class Schedule & Timeline
                              </h4>
                              
                              {/* Dot Legend */}
                              <div className="flex items-center gap-4 flex-wrap text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>Completed</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                                  <span>Today</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-slate-350" />
                                  <span>Upcoming</span>
                                </div>
                              </div>
                            </div>

                            {/* Table Headers */}
                            <div className="grid grid-cols-12 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider pb-1 pl-6">
                              <span className="col-span-2">Date</span>
                              <span className="col-span-2">Class</span>
                              <span className="col-span-8">Topic</span>
                            </div>

                            <div className="relative border-l-2 border-dashed border-slate-200 ml-4.5 pl-5.5 space-y-5 relative">
                              {(() => {
                                let absoluteClassNumber = 0;
                                const selectedBatchStatus = currentBatchId === 'b-completed' ? 'completed' : currentBatchId === 'b-upcoming' ? 'upcoming' : 'ongoing';
                                
                                return activeDetails.topics.map((topic) => 
                                  topic.subTopics.map((sub) => {
                                    absoluteClassNumber++;
                                    const classNum = absoluteClassNumber;
                                    
                                    const isToday = selectedBatchStatus === 'ongoing' && classNum === 3;
                                    const isSubCompleted = selectedBatchStatus === 'completed' || (selectedBatchStatus === 'ongoing' && classNum < 3);

                                    return (
                                      <div key={sub.id} className="relative grid grid-cols-12 items-start gap-2 py-3.5 border-b border-slate-100/40 group/timeline select-none">
                                        {/* Node Dot */}
                                        <div className={`absolute -left-[27px] top-[18px] w-2.5 h-2.5 rounded-full border-2 border-white z-10 transition-transform duration-200 group-hover/timeline:scale-125 ${
                                          isSubCompleted
                                            ? 'bg-emerald-500'
                                            : isToday
                                              ? 'bg-blue-600 ring-4 ring-blue-500/10'
                                              : 'bg-slate-300'
                                        }`} />

                                        {/* Column 1: Date */}
                                        <div className="col-span-2 text-[12px] font-semibold text-slate-500 pt-1">
                                          {getClassDateText(classNum, selectedBatchStatus)}
                                        </div>

                                        {/* Column 2: Class */}
                                        <div className="col-span-2 text-[10.5px] font-bold text-slate-400 bg-slate-55 border border-slate-200/50 px-2 py-0.5 rounded w-fit text-center mt-0.5">
                                          {classNum}/{totalClasses}
                                        </div>

                                        {/* Column 3: Topic & Timings */}
                                        <div className="col-span-8 space-y-2">
                                          <h5 className={`text-[13px] font-bold leading-snug group-hover/timeline:text-blue-650 transition-colors ${
                                            isSubCompleted ? 'text-slate-655' : 'text-slate-755'
                                          }`}>
                                            {sub.title}
                                          </h5>

                                          {/* Timing buttons */}
                                          <div className="flex items-center gap-2">
                                            {/* Slot 1 Button */}
                                            {isSubCompleted ? (
                                              <button
                                                onClick={() => alert(`Playing recording for: "${sub.title}"`)}
                                                className="bg-slate-105 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg transition-all border-none flex items-center gap-1 cursor-pointer"
                                              >
                                                <PlayCircle className="w-3.5 h-3.5 text-blue-650 fill-current" />
                                                <span>{selectedBatch.slot1Timing || '6-7 PM'}</span>
                                              </button>
                                            ) : isToday ? (
                                              <button
                                                onClick={() => alert(`Playing recording for today's completed slot 1...`)}
                                                className="bg-slate-105 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg transition-all border-none flex items-center gap-1 cursor-pointer"
                                              >
                                                <PlayCircle className="w-3.5 h-3.5 text-blue-650 fill-current" />
                                                <span>{selectedBatch.slot1Timing || '6-7 PM'}</span>
                                              </button>
                                            ) : (
                                              <button
                                                disabled
                                                className="bg-slate-50 border border-slate-200 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                                              >
                                                <Clock className="w-3.5 h-3.5 text-slate-350" />
                                                <span>{selectedBatch.slot1Timing || '6-7 PM'}</span>
                                              </button>
                                            )}

                                            {/* Slot 2 Button */}
                                            {isSubCompleted ? (
                                              <button
                                                onClick={() => alert(`Playing recording for: "${sub.title}"`)}
                                                className="bg-slate-105 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg transition-all border-none flex items-center gap-1 cursor-pointer"
                                              >
                                                <PlayCircle className="w-3.5 h-3.5 text-blue-650 fill-current" />
                                                <span>{selectedBatch.slot2Timing || '8:30-9:30 PM'}</span>
                                              </button>
                                            ) : isToday ? (
                                              <button
                                                onClick={() => handleJoinClass?.(activeCourse.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3.5 py-1 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer border-none"
                                              >
                                                <span className="relative flex h-1.5 w-1.5 shrink-0">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                                </span>
                                                <span>{selectedBatch.slot2Timing || '8:30-9:30 PM'}</span>
                                              </button>
                                            ) : (
                                              <button
                                                disabled
                                                className="bg-slate-50 border border-slate-200 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                                              >
                                                <Clock className="w-3.5 h-3.5 text-slate-350" />
                                                <span>{selectedBatch.slot2Timing || '8:30-9:30 PM'}</span>
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                );
                              })()}
                            </div>
                            </div>
                          </div>

                        {/* Right Column: Next Scheduled & Progress Summary */}
                        <div className="space-y-5">
                          
                          {/* Next Class details */}
                          {currentBatchId !== 'b-completed' && (
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                                Next Scheduled Class
                              </h4>
                              {nextUpcomingSub ? (
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Calendar className="w-4.5 h-4.5" />
                                  </div>
                                  <div>
                                    <h5 className="text-[13px] font-bold text-slate-800 font-heading leading-snug">
                                      {nextUpcomingSub.title}
                                    </h5>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                      Date: {activeCourse.nextClassTime ? activeCourse.nextClassTime.replace('Next Class: ', '') : 'Saturday, 10:00 AM'}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic">No upcoming classes scheduled.</p>
                              )}
                            </div>
                          )}

                          {/* Horizontal Batch Progress Details */}
                          {(() => {
                            const selectedBatch = batches.find(b => b.id === currentBatchId) || batches[1];
                            const totalCompleted = selectedBatch.status === 'completed'
                              ? selectedBatch.classesCount
                              : selectedBatch.status === 'upcoming'
                                ? 0
                                : selectedBatch.completedCount || 0;

                            const progressPercent = selectedBatch.classesCount > 0
                              ? Math.round((totalCompleted / selectedBatch.classesCount) * 100)
                              : 0;

                            return (
                              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                                  Cohort Progress
                                </h4>
                                
                                <div className="space-y-3 pt-1">
                                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-450">
                                    <span>Start: {selectedBatch.startDateText}</span>
                                    <span>End: {selectedBatch.endDateText}</span>
                                  </div>
                                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                                    <div
                                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                  <div className="text-center text-xs font-bold text-slate-500">
                                    {totalCompleted} of {selectedBatch.classesCount} sessions completed ({progressPercent}%)
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                        </div>

                      </div>
                    </div>
                  );
                })()}

                {activeDetailsTab === 'cheatsheets' && (
                  <div className="space-y-4 mt-4">
                    {[
                      { title: 'DSA Ultimate Cheat Sheet & Checklist', type: 'PDF • 45 pages', category: 'DSA', desc: 'Comprehensive guide covering Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming with code snippets.' },
                      { title: 'System Design Template & Production Checklist', type: 'Markdown • 12 pages', category: 'Architecture', desc: 'Ready-to-use template for scaling systems, covering load balancing, caching, sharding, and key metrics.' },
                      { title: 'Clean Code Best Practices in JavaScript', type: 'PDF • 8 pages', category: 'Clean Code', desc: 'Essential clean coding principles, naming conventions, refactoring tips, and code review checklists.' }
                    ].map((doc, idx) => (
                      <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold text-purple-500 uppercase block tracking-wider">{doc.category}</span>
                            <h4 className="text-[14px] font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                              {doc.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-normal max-w-xl">{doc.desc}</p>
                            <span className="text-[10.5px] text-slate-400 font-semibold block pt-1">{doc.type}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading document: "${doc.title}"...`)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer self-start sm:self-center border-none"
                        >
                          Download Document
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24">
                
                {/* 1. Complete to Unlock Certificate Card */}
                <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl p-6 py-8 flex flex-col items-center justify-center text-center aspect-video relative overflow-hidden shadow-lg premium-glow">
                  {/* Lock Symbol inside purple circle ring */}
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-[13px] font-bold leading-snug tracking-tight max-w-[190px]">
                    Complete the Course to Unlock Certificate
                  </h3>
                </div>

                {/* 2. Learning Outcomes */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                    Learning Outcomes
                  </h4>
                  <div className="space-y-3.5">
                    {activeDetails.outcomes.map((outcome) => (
                      <div key={outcome} className="flex items-start gap-3">
                        {/* Purple solid checkmark circle */}
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-purple-500/10">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <p className="text-[12.5px] text-slate-600 leading-normal font-medium">
                          {outcome}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Skills You'll Gain */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                    Skills You'll Gain
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDetails.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="bg-slate-50 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200/40 shadow-sm"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Tools You'll Use */}
                <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                    Tools You'll Use
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeDetails.tools.map((tool) => (
                      <div 
                        key={tool.name}
                        className="inline-flex items-center gap-2 bg-white border border-slate-200 p-2 px-3.5 rounded-xl text-[12px] font-bold text-slate-700 shadow-sm hover:border-slate-300 transition-colors"
                      >
                        {tool.renderIcon()}
                        <span>{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* MAIN GRID LIST VIEW                                       */
          /* ========================================================= */
          <motion.div
            key="list-page"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto w-full flex flex-col gap-6"
          >
            {/* PAGE HEADER ROW (Sticky to top with full-width background, scheduling toggle, and search button) */}
            <div className="sticky top-[72px] sm:top-[80px] z-30 bg-[#f7f7f7]/95 backdrop-blur-md px-4 sm:px-6 lg:px-10 -mx-4 sm:-mx-6 lg:-mx-10 py-4 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-text-primary font-heading tracking-tight">
                Live Classes
              </h1>
              
              <div className="flex items-center gap-3 shrink-0">
                {/* Weekday/Weekend Capsule Toggle */}
                <div className="bg-slate-200/65 p-1 rounded-full flex items-center gap-0.5 border border-slate-300/40 shadow-inner shrink-0">
                  <button
                    onClick={() => setScheduleType('weekday')}
                    className={`relative z-10 px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-350 cursor-pointer select-none border-none bg-transparent ${
                      scheduleType === 'weekday' ? 'text-slate-800 font-extrabold' : 'text-slate-550 hover:text-slate-800'
                    }`}
                  >
                    Weekday
                    {scheduleType === 'weekday' && (
                      <motion.div
                        layoutId="pageSchedulePill"
                        className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm border border-slate-200/30"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setScheduleType('weekend')}
                    className={`relative z-10 px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-350 cursor-pointer select-none border-none bg-transparent ${
                      scheduleType === 'weekend' ? 'text-slate-800 font-extrabold' : 'text-slate-550 hover:text-slate-800'
                    }`}
                  >
                    Weekend
                    {scheduleType === 'weekend' && (
                      <motion.div
                        layoutId="pageSchedulePill"
                        className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm border border-slate-200/30"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </div>

                {/* V2-style Capsule Search Bar Trigger */}
                <button
                  onClick={() => {
                    setActiveSearchTab('live');
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-2.5 w-full sm:w-[240px] px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-500 rounded-full transition-all text-[13px] cursor-pointer text-left shrink-0 shadow-sm font-medium h-[36px]"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-400">Search Live Classes</span>
                </button>
              </div>
            </div>

            {/* My Learning Progress Section */}
            <EnrolledProgressCarousel />

            {/* Curated Recommendations Section */}
            {recommendedGroup.length > 0 && (
              <section className="space-y-6 mt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-indigo-50/85 text-indigo-750 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200/35 flex items-center gap-1 leading-none select-none">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                      <span>Recommended</span>
                    </span>
                    <h2 className="text-[20px] sm:text-[24px] font-bold text-slate-800 tracking-tight font-heading">
                      Recommended For You
                    </h2>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-[13px] font-medium">
                    Curated trending paths, system design deep dives, and upcoming high-salary specializations tailored to your progress.
                  </p>
                </div>
                <CourseCarousel 
                  courses={recommendedGroup as any} 
                  onEnroll={_handleEnrollCourse} 
                />
              </section>
            )}
            {/* Enrolled Courses Tabs Section Header */}
            <div className="mt-8">
              <h2 className="text-[20px] sm:text-[24px] font-bold text-slate-800 font-heading tracking-tight">
                Enrolled Courses
              </h2>
            </div>

            {/* Premium Figma Batch Category Tabs (Placed directly on the page) */}
            <div className="w-full mt-2 relative select-none">
              {/* Horizontal line running along the bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#335CFF]" />
              
              <div className="flex items-end gap-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-0 relative z-10">
                {batchStatusTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = selectedStatus === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedStatus(tab.id)}
                      className={`relative w-[152px] h-[37px] flex items-center justify-center gap-2 cursor-pointer select-none border-none bg-transparent transition-colors duration-300 ${
                        isActive ? 'text-[#335CFF] font-semibold' : 'text-[#5C5C5C] hover:text-[#335CFF]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryTabBg"
                          className="absolute inset-0 -z-10"
                          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                        >
                          <ActiveTabBackground />
                        </motion.div>
                      )}
                      <div className="relative flex-row flex items-center justify-center gap-1.5 z-10 pb-0.5">
                        <IconComponent className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-[#335CFF]' : 'text-[#5C5C5C]'}`} />
                        <span className="text-sm tracking-[-0.084px]">{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Course Grid */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-medium">
                    Showing <strong className="text-slate-800 font-semibold">{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'class' : 'classes'}
                  </span>
                  {selectedStatus !== 'all' && (
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                      Status: {selectedStatus === 'running' ? 'Running' : selectedStatus === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>
                  )}
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                    Schedule: {scheduleType}
                  </span>
                </div>
                
                {/* Active search tag */}
                {globalSearchTerm && (
                  <span className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span>Query: "{globalSearchTerm}"</span>
                    <button onClick={handleClearSearch} className="text-amber-600 hover:text-amber-900 font-bold">×</button>
                  </span>
                )}
              </div>

              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => {
                    // Determine the card's category dynamically based on business rules
                    const isCompleted = course.completedClasses !== undefined && course.completedClasses === course.classesCount;
                    const isLive = course.classStatus === 'live';
                    const isRunning = !isCompleted && (isLive || (course.completedClasses !== undefined && course.completedClasses > 0) || (course.nextClassTime && !course.nextClassTime.includes('Batch Starts')));
                    const isUpcoming = !isCompleted && !isRunning;
                    const isEnrolled = course.isEnrolled || course.state === 'enrolled' || course.state === 'live';

                    // Illustration box background colors based on category
                    const categoryBgMap: Record<string, string> = {
                      placement: 'bg-blue-50/80',
                      challenges: 'bg-purple-50/80',
                      revision: 'bg-rose-50/80',
                      projects: 'bg-emerald-50/80',
                      'interview-prep': 'bg-violet-50/80'
                    };

                    const getCategoryStyles = (cat: string) => {
                      switch (cat) {
                        case 'placement':
                          return 'text-blue-600 bg-blue-50/50 border-blue-100';
                        case 'revision':
                          return 'text-indigo-600 bg-indigo-50/50 border-indigo-100';
                        case 'interview-prep':
                          return 'text-violet-600 bg-violet-50/50 border-violet-100';
                        case 'projects':
                          return 'text-emerald-750 bg-emerald-50/50 border-emerald-100';
                        case 'challenges':
                          return 'text-fuchsia-600 bg-fuchsia-50/50 border-fuchsia-100';
                        default:
                          return 'text-slate-600 bg-slate-50 border-slate-200';
                      }
                    };

                    // Render schedule badges with exact day-based highlighting from Figma
                    const renderScheduleBadge = (type: string, courseId: string) => {
                      if (type === 'weekend') {
                        return (
                          <div className="absolute bg-white flex items-center left-0 pl-6 pr-4 py-2 rounded-tr-[16px] top-[-24px] border-t border-r border-slate-200/50 shadow-[1px_-1px_3px_0px_rgba(15,23,42,0.02)] z-10">
                            <p className="font-sans font-semibold text-[12px] text-[#b45309] tracking-wider whitespace-nowrap">
                              Only Weekend
                            </p>
                          </div>
                        );
                      }
                      
                      // Alternate MWF and TTS highlights dynamically based on course ID just like CourseCard.tsx
                      const numericId = parseInt(courseId.replace(/\D/g, '') || '0');
                      if (numericId % 2 === 1) {
                        return (
                          <div className="absolute bg-white flex items-center left-0 pl-6 pr-4 py-2 rounded-tr-[16px] top-[-24px] border-t border-r border-slate-200/50 shadow-[1px_-1px_3px_0px_rgba(15,23,42,0.02)] z-10">
                            <p className="font-sans font-semibold text-[12px] text-[#b45309] tracking-wider whitespace-nowrap">
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
                          <p className="font-sans font-semibold text-[12px] text-[#b45309] tracking-wider whitespace-nowrap">
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

                    const cardBorderClass = isLive
                      ? 'border-rose-200 shadow-[0_4px_20px_rgba(244,63,94,0.06)] hover:border-rose-400 hover:shadow-[0_12px_24px_rgba(244,63,94,0.1)]'
                      : isCompleted
                      ? 'border-emerald-200/85 shadow-[0_4px_20px_rgba(16,185,129,0.04)] hover:border-emerald-400 hover:shadow-[0_12px_24px_rgba(16,185,129,0.08)]'
                      : 'border-slate-250/95 shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-blue-500/50 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)]';

                    return (
                      <motion.div
                        key={course.id}
                        onClick={() => {
                          setActiveCourseId(course.id);
                          setActiveDetailsTab(isLive ? 'live' : 'topics');
                        }}
                        whileHover={{ y: -4 }}
                        className={`w-full max-w-[360px] mx-auto min-h-[395px] h-full border rounded-[24px] overflow-hidden flex flex-col justify-between transition-all duration-300 relative group select-none bg-white ${cardBorderClass}`}
                      >


                        {/* Top Section - Illustration Container */}
                        <div className="p-2 h-[140px] shrink-0 relative">
                          <div className={`h-full w-full rounded-[20px] border-8 border-white flex items-center justify-center overflow-hidden relative shadow-sm ${categoryBgMap[course.category] || 'bg-slate-50'}`}>
                            {/* Subtle background glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
                            
                            {/* Top-Left Specialty Badges (Project, Revision) */}
                            {course.category === 'projects' && (
                              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm text-blue-600 text-[11px] font-bold z-10 border border-blue-100/30">
                                <Code2 className="w-3.5 h-3.5" />
                                <span>Project</span>
                              </div>
                            )}

                            {course.category === 'revision' && (
                              <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm text-indigo-600 text-[11px] font-bold z-10 border border-indigo-100/30">
                                <RefreshCw className="w-3.5 h-3.5" />
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

                            {/* Image Illustration */}
                            <img
                              src={course.image}
                              alt={course.title}
                              className="object-contain max-h-[90%] max-w-[90%] select-none filter drop-shadow-[0_8px_12px_rgba(15,23,42,0.06)] relative z-0"
                            />
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="px-5 pb-4 pt-3.5 shrink-0 flex flex-col justify-between relative flex-1">
                          {/* Sticking schedule badge */}
                          {renderScheduleBadge(course.scheduleType || '', course.id)}

                          <div className="space-y-2">
                            {/* Category Badge Pill */}
                            <div className="flex">
                              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border leading-none select-none ${getCategoryStyles(course.category)}`}>
                                {course.category === 'placement' ? 'Placement Prep' : course.category === 'interview-prep' ? 'Interview Prep' : course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-[16px] md:text-[17px] font-bold text-slate-900 leading-snug font-heading tracking-tight line-clamp-2 h-[44px]">
                              {course.title}
                            </h3>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 h-[22px] overflow-hidden">
                              {course.tags.slice(0, 3).map((tag, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-[10.5px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg font-semibold"
                                >
                                  {tag}
                                </span>
                              ))}
                              {course.tags.length > 3 && (
                                <span className="text-[10.5px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded-lg">
                                  +{course.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Dynamic Content Details depending on batch state */}
                          <div className="space-y-2 mt-2">
                            {/* Running Batch recently completed box details */}
                            {isRunning && course.completedClasses !== undefined && course.completedClasses > 0 && (
                              <div className="bg-slate-50 border border-slate-150 rounded-[12px] p-2 flex items-center justify-between shadow-sm">
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Recently Completed</span>
                                  <span className="text-[10.5px] font-bold text-slate-650 truncate max-w-[120px]">
                                    {course.recentClassTitle || 'Class Session'}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert(`Playing recently completed class recording for: "${course.recentClassTitle || course.title}"`);
                                  }}
                                  className="flex items-center gap-1 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-[9px] font-extrabold px-2 py-0.5 rounded-md transition-all shrink-0 cursor-pointer"
                                >
                                  <PlayCircle className="w-3 h-3" />
                                  <span>Recording</span>
                                </button>
                              </div>
                            )}

                            {/* Completed Batch recordings summary */}
                            {isCompleted && (
                              <div className="bg-slate-50 border border-slate-150 p-2 rounded-[12px] text-[10.5px] font-medium text-slate-650 flex items-center justify-between shadow-sm">
                                <span className="flex items-center gap-1.5 font-bold text-slate-650">
                                  <PlayCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 fill-current" />
                                  <span>All Recordings Available ({course.classesCount})</span>
                                </span>
                              </div>
                            )}

                            {/* Completed Batch: New Batch Starting Next Indicator */}
                            {isCompleted && course.upcomingBatches > 0 && (
                              <div className="bg-purple-50/85 border border-purple-150/50 text-purple-800 p-2 rounded-[12px] text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm">
                                <span>✨</span>
                                <span>Next Batch: {course.nextBatchStartDate || 'Starting Soon'}</span>
                              </div>
                            )}

                            {/* Upcoming Batch Info details */}
                            {isUpcoming && (
                              <div className="bg-blue-50/75 border border-blue-150/50 text-blue-850 p-2 rounded-[12px] text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm">
                                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>{course.nextBatchStartDate || 'Batch Starts Soon'}</span>
                              </div>
                            )}
                          </div>

                          {/* Progress bar for enrolled courses */}
                          {isEnrolled && (
                            <div className="space-y-1 mt-2.5">
                              <div className="w-full bg-[#e0e6ff] h-[6px] rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-[#1845FF]'
                                  }`}
                                  style={{ width: `${course.completedClasses && course.classesCount ? Math.round((course.completedClasses / course.classesCount) * 100) : 0}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Footer Info & Action Button */}
                          <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                              <span className="flex items-center gap-1.5">
                                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                                <span>
                                  {isCompleted ? (
                                    `${course.classesCount}/${course.classesCount} Completed`
                                  ) : isRunning && course.completedClasses ? (
                                    `${course.completedClasses}/${course.classesCount} Completed`
                                  ) : isUpcoming ? (
                                    `0/${course.classesCount} Completed`
                                  ) : (
                                    `${course.classesCount} Classes`
                                  )}
                                </span>
                              </span>

                              {isLive && (
                                <span className="flex items-center gap-1 text-red-500 font-extrabold animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  <span>Live Now</span>
                                </span>
                              )}
                              {isRunning && !isLive && course.nextClassTime && (
                                <span className="flex items-center gap-1 text-emerald-650 font-bold">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{course.nextClassTime.replace('Next Class: ', '')}</span>
                                </span>
                              )}
                              {isUpcoming && (
                                <span className="flex items-center gap-1 text-blue-600 font-bold">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{course.upcomingBatches} Batches</span>
                                </span>
                              )}
                            </div>

                            {/* Action Buttons (Fades/reveals beautifully on desktop hover, always visible on mobile) */}
                            <div className="mt-1 transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0 w-full">
                              {isEnrolled ? (
                                /* Enrolled Split Buttons Layout */
                                <div className="flex gap-2 w-full">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveCourseId(course.id);
                                      setActiveDetailsTab(isLive ? 'live' : 'topics');
                                    }}
                                    className="w-1/2 h-[36px] rounded-[10px] border border-slate-200 hover:bg-slate-50 text-slate-700 text-[12px] font-bold active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 bg-white"
                                  >
                                    <Info className="w-3.5 h-3.5 stroke-[2.5] text-slate-500" />
                                    <span>Details</span>
                                  </button>
                                  
                                  {isLive ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleJoinClass?.(course.id);
                                      }}
                                      className="w-1/2 h-[36px] rounded-[10px] bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center gap-1 shadow-md shadow-red-500/10 hover:shadow-red-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                                    >
                                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                      </span>
                                      <span className="text-[12px] font-bold tracking-wide uppercase">Join Live</span>
                                    </button>
                                  ) : isCompleted ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Opening recordings viewer for completed course: "${course.title}"`);
                                      }}
                                      className="w-1/2 h-[36px] rounded-[10px] border border-slate-250 text-slate-700 text-[12px] font-bold bg-white hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
                                      <span>Recordings</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveCourseId(course.id);
                                        setActiveDetailsTab(isLive ? 'live' : 'topics');
                                      }}
                                      className="w-1/2 h-[36px] rounded-[10px] border border-slate-200 text-slate-700 text-[12px] font-semibold bg-white hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer truncate px-1 text-center"
                                    >
                                      <span>Resume Class</span>
                                    </button>
                                  )}
                                </div>
                              ) : (
                                /* Not Enrolled Single Buttons */
                                isLive ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveCourseId(course.id);
                                      setActiveDetailsTab('live');
                                      setEnrollFlowView(prev => ({ ...prev, [course.id]: 'batch-list' }));
                                      setSelectedBatchId(prev => ({ ...prev, [course.id]: 'b-ongoing' }));
                                    }}
                                    className="w-full h-[36px] rounded-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer text-xs font-bold uppercase tracking-wider"
                                  >
                                    <span>Enroll to Join Live</span>
                                  </button>
                                ) : isCompleted ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveCourseId(course.id);
                                      setActiveDetailsTab('live');
                                      setEnrollFlowView(prev => ({ ...prev, [course.id]: 'batch-list' }));
                                      setSelectedBatchId(prev => ({ ...prev, [course.id]: 'b-ongoing' }));
                                    }}
                                    className="w-full h-[36px] rounded-[10px] border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-150 cursor-pointer bg-white text-xs font-bold"
                                  >
                                    <span>Enroll to Watch</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveCourseId(course.id);
                                      setActiveDetailsTab('live');
                                      setEnrollFlowView(prev => ({ ...prev, [course.id]: 'batch-list' }));
                                      setSelectedBatchId(prev => ({ ...prev, [course.id]: 'b-ongoing' }));
                                    }}
                                    className="w-full h-[36px] rounded-[10px] border border-blue-600 hover:bg-blue-50/50 text-blue-650 flex items-center justify-center gap-1 active:scale-[0.98] transition-all duration-150 cursor-pointer bg-white text-xs font-bold"
                                  >
                                    <span>Explore & Enroll</span>
                                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-[24px] p-12 text-center text-slate-500 max-w-xl mx-auto flex flex-col items-center gap-4 shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                    <Search className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-800 font-heading">No Classes Found</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                      No sessions match your active filters. Try adjusting your schedule toggle or status filters.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStatus('all');
                      handleClearSearch();
                    }}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL SEARCH MODAL (SAME AS V2) */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex justify-center items-start pt-[10vh] overflow-y-auto px-4">
            
            {/* Click backdrop to close */}
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                  }}
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
                          ? 'border-blue-650 text-blue-600'
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
                                  {highlightText(course.title, searchQuery)}
                                </h4>
                                <div className="flex gap-2 items-center mt-1">
                                  <span className="text-[11px] text-slate-400 font-semibold">{course.classesCount} Syllabus Classes</span>
                                  {course.classStatus === 'live' && (
                                    <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">Live Now</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setIsSearchOpen(false);
                                if (course.classStatus === 'live') {
                                  handleJoinClass?.(course.id);
                                } else {
                                  setActiveCourseId(course.id);
                                  setActiveDetailsTab('topics');
                                }
                              }}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
                            >
                              {course.classStatus === 'live' ? 'Join Live' : 'Register'}
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
                                {highlightText(c.title, searchQuery)}
                              </h4>
                              <p className="text-slate-500 text-xs leading-normal">{highlightText(c.desc, searchQuery)}</p>
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
                                  {highlightText(e.title, searchQuery)}
                                </h4>
                                <p className="text-slate-400 text-xs mt-0.5">By {highlightText(e.speaker, searchQuery)} • {e.time}</p>
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
                                  {highlightText(r.title, searchQuery)}
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
