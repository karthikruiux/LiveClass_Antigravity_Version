import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, BookOpen, Clock, ArrowRight, ArrowLeft, Play, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Batch {
  id: string;
  date: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  classesCount: number;
  completedCount?: number;
  studentsEnrolled?: number;
  timings: string;
  startDateText: string;
  endDateText: string;
  recommended?: boolean;
}

interface ClassSession {
  id: string;
  dateText: string;
  indexText: string;
  topic: string;
  isCompleted: boolean;
  isLive?: boolean;
}

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  courseState?: 'not-enrolled' | 'enrolled' | 'live';
  currentEnrolledBatchId?: string;
  onConfirm: (batchId: string, status: 'completed' | 'ongoing' | 'upcoming') => void;
}

const mockBatches: Batch[] = [
  {
    id: 'b-completed',
    date: '20th Jan 2026',
    status: 'completed',
    classesCount: 40,
    completedCount: 40,
    timings: '6 PM - 7 PM  |  8 PM - 9 PM',
    startDateText: '20 Jan, 26',
    endDateText: '1 Mar, 26'
  },
  {
    id: 'b-ongoing',
    date: '1st April 2026',
    status: 'ongoing',
    classesCount: 52,
    completedCount: 12,
    studentsEnrolled: 240,
    timings: '6 PM - 7 PM  |  8 PM - 9 PM',
    startDateText: '1 Apr, 26',
    endDateText: '30 May, 26'
  },
  {
    id: 'b-upcoming',
    date: '15th April 2026',
    status: 'upcoming',
    classesCount: 52,
    studentsEnrolled: 240,
    timings: '6 PM - 7 PM  |  8 PM - 9 PM',
    startDateText: '15 Apr, 26',
    endDateText: '15 Jun, 26',
    recommended: true
  }
];

// Mock classes for the schedule details overview
const getMockClasses = (batchStatus: 'completed' | 'ongoing' | 'upcoming'): ClassSession[] => {
  const topics = [
    'Deep Learning Approaches & Neural Networks',
    'Ethics in Generative AI and Safety Guardrails',
    'Generative Models for Multimodal Pipelines',
    'Future Trends in Generative Artificial Intelligence',
    'AI-Driven Content Creation & Workflows',
    'Exploring Neural Networks & Transformer Architectures',
    'Fine-Tuning Large Language Models',
    'RAG Systems and Vector Databases'
  ];

  return Array.from({ length: 8 }).map((_, idx) => {
    const isCompleted = batchStatus === 'completed' || (batchStatus === 'ongoing' && idx < 3);
    const isLive = batchStatus === 'ongoing' && idx === 3;
    
    return {
      id: `c-${idx}`,
      dateText: idx === 0 ? '4th Apr' : '8th Apr',
      indexText: `${idx + 1}/${batchStatus === 'completed' ? 40 : 52}`,
      topic: topics[idx % topics.length],
      isCompleted,
      isLive
    };
  });
};

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  courseState = 'not-enrolled',
  currentEnrolledBatchId = 'b-ongoing', // Default to b-ongoing for enrolled courses
  onConfirm
}) => {
  const [view, setView] = useState<'batch-list' | 'schedule-details'>('batch-list');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Initialize selected batch based on course status
  useEffect(() => {
    if (isOpen) {
      setView('batch-list');
      setSuccessToast(null);
      
      if (courseState === 'enrolled' || courseState === 'live') {
        setSelectedBatchId(currentEnrolledBatchId);
      } else {
        setSelectedBatchId(null);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, courseState, currentEnrolledBatchId]);

  const selectedBatch = mockBatches.find((b) => b.id === selectedBatchId);
  const isSwitchingBatch = (courseState === 'enrolled' || courseState === 'live') && selectedBatchId !== currentEnrolledBatchId;

  const handleSelectBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
  };

  const handleBatchAction = () => {
    if (!selectedBatch) return;

    if (selectedBatch.status === 'completed') {
      // Completed batch flow: Go straight to Schedule Details with "View recordings" CTA
      setView('schedule-details');
    } else if (isSwitchingBatch) {
      // Switching batch flow: Proceed to Schedule Details first, or trigger change
      setView('schedule-details');
    } else {
      // Standard ongoing/upcoming enrollment
      setView('schedule-details');
    }
  };

  const handleConfirmAction = () => {
    if (!selectedBatch) return;

    let successMsg = '';
    if (isSwitchingBatch) {
      successMsg = 'Batch changed successfully!';
    } else if (selectedBatch.status === 'ongoing') {
      successMsg = 'Joined class successfully!';
    } else if (selectedBatch.status === 'upcoming') {
      successMsg = 'Registered for batch successfully!';
    } else {
      successMsg = 'Recordings loaded!';
    }

    setSuccessToast(successMsg);

    // Show toast for 1.5 seconds, then trigger callback and close
    setTimeout(() => {
      onConfirm(selectedBatch.id, selectedBatch.status);
      onClose();
    }, 1500);
  };

  const classSessions = selectedBatch ? getMockClasses(selectedBatch.status) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-[540px] h-full bg-white shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
          >
            {/* 1. SUCCESS TOAST NOTIFICATION OVERLAY inside modal */}
            <AnimatePresence>
              {successToast && (
                <motion.div
                  initial={{ opacity: 0, y: -80 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -80 }}
                  className="absolute inset-x-0 top-0 bg-[#E7F6EC] border-b border-emerald-200 py-5 px-8 flex items-center gap-3 z-50 shadow-md"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-bounce" />
                  <span className="text-emerald-800 font-extrabold text-[15px] tracking-tight">
                    {successToast}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VIEW A: BATCH SELECTION LIST */}
            {view === 'batch-list' && (
              <>
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 space-y-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-[24px] font-bold text-slate-900 leading-tight font-heading pr-6">
                      {courseTitle}
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                    Master the fundamentals to advanced AI techniques. Create production-ready applications leveraging AI models and smart prompt design.
                  </p>
                </div>

                {/* Batch list */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                  <h3 className="text-[14px] font-bold text-slate-700 uppercase tracking-wider">
                    Choose your batch
                  </h3>

                  <div className="space-y-4">
                    {mockBatches.map((batch) => {
                      const isCompleted = batch.status === 'completed';
                      const isSelected = selectedBatchId === batch.id;
                      const isEnrolledBatch = (courseState === 'enrolled' || courseState === 'live') && batch.id === currentEnrolledBatchId;
                      
                      return (
                        <div
                          key={batch.id}
                          onClick={() => handleSelectBatch(batch.id)}
                          className={`relative border rounded-[20px] p-5 flex items-center justify-between transition-all duration-200 select-none cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/10 shadow-lg shadow-blue-500/5 scale-[1.01]'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                          }`}
                        >
                          {/* Recommended Badge overlay */}
                          {batch.recommended && (
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md z-10">
                              Recommended
                            </div>
                          )}

                          {/* Currently Enrolled Batch Pill */}
                          {isEnrolledBatch && (
                            <div className="absolute top-0 left-8 -translate-y-1/2 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Enrolled Batch</span>
                            </div>
                          )}

                          {/* Info */}
                          <div className="space-y-3 flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[15px] font-bold text-slate-900 font-heading">
                                {batch.date}
                              </span>
                              
                              {batch.status === 'completed' && (
                                <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 rounded-lg border border-slate-200">
                                  Completed
                                </span>
                              )}
                              {batch.status === 'ongoing' && (
                                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 rounded-lg border border-emerald-100">
                                  Ongoing
                                </span>
                              )}
                              {batch.status === 'upcoming' && (
                                <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-2 rounded-lg border border-amber-100">
                                  Upcoming
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                {isCompleted ? (
                                  <span>{batch.classesCount} classes</span>
                                ) : batch.completedCount ? (
                                  <span>
                                    <strong className="text-slate-700">{batch.completedCount}</strong> of {batch.classesCount} completed
                                  </span>
                                ) : (
                                  <span>{batch.classesCount} classes</span>
                                )}
                              </span>
                              
                              {batch.studentsEnrolled && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{batch.studentsEnrolled} students</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-6 sm:p-8 border-t border-slate-100 space-y-4 bg-white">
                  {/* Warning banner for Batch Switching */}
                  {isSwitchingBatch && (
                    <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-[12px] font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        You are currently enrolled in <strong className="text-slate-800">1st April 2026</strong>. Switching to this batch will transfer your progress.
                      </div>
                    </div>
                  )}

                  {selectedBatch?.status === 'completed' ? (
                    <button
                      onClick={handleBatchAction}
                      className="w-full h-14 rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <span>View recordings</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleBatchAction}
                      disabled={!selectedBatchId}
                      className={`w-full h-14 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg ${
                        selectedBatchId
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-blue-500/10'
                          : 'bg-blue-100 text-blue-300 shadow-none cursor-not-allowed'
                      }`}
                    >
                      <span>{isSwitchingBatch ? 'Change Batch' : 'Continue with selected Batch'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="text-center text-slate-400 text-xs font-semibold">
                    Free to enroll — no questions asked.
                  </div>
                </div>
              </>
            )}

            {/* VIEW B: SCHEDULE DETAILS VIEW */}
            {view === 'schedule-details' && selectedBatch && (
              <>
                {/* Header with Go to Batch back arrow */}
                <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setView('batch-list')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-[13px] font-bold group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Go to batch</span>
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Schedule Details header & Progress line */}
                <div className="px-8 pt-6 pb-4 border-b border-slate-50 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[22px] font-bold text-slate-900 leading-tight font-heading">
                      Schedule Details
                    </h2>
                    {/* Badge */}
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase ${
                      selectedBatch.status === 'completed'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : selectedBatch.status === 'ongoing'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {selectedBatch.status}
                    </span>
                  </div>

                  {/* Selected Batch date title card */}
                  <div className="text-[15px] font-bold text-slate-500">
                    {selectedBatch.date}
                  </div>

                  {/* Horizontal Blue Progress line */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                      <span>Start <strong className="text-slate-700">{selectedBatch.startDateText}</strong></span>
                      <span className="text-slate-600 font-extrabold">
                        Classes completed - {selectedBatch.status === 'completed' ? selectedBatch.classesCount : selectedBatch.status === 'ongoing' ? '12' : '0'} out of {selectedBatch.classesCount}
                      </span>
                      <span>End <strong className="text-slate-700">{selectedBatch.endDateText}</strong></span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-700"
                        style={{ 
                          width: `${selectedBatch.status === 'completed' ? 100 : selectedBatch.status === 'ongoing' ? 23 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Class Overview scrolling list */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
                  <h3 className="text-[15px] font-bold text-slate-700">
                    Class Overview
                  </h3>

                  {/* Timeline Header label */}
                  <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                    <span className="col-span-2">Date</span>
                    <span className="col-span-2">Class</span>
                    <span className="col-span-8">Topic</span>
                  </div>

                  {/* Timeline List */}
                  <div className="relative border-l-2 border-dashed border-slate-200 ml-4 pl-4 space-y-6">
                    {classSessions.map((session) => (
                      <div key={session.id} className="relative grid grid-cols-12 items-center gap-2 group/session">
                        
                        {/* Dot */}
                        <div className={`absolute -left-[23px] w-3 h-3 rounded-full border-2 border-white transition-transform duration-200 group-hover/session:scale-125 ${
                          session.isLive 
                            ? 'bg-red-500 ring-4 ring-red-500/20'
                            : session.isCompleted
                              ? 'bg-emerald-500'
                              : 'bg-slate-300'
                        }`} />

                        {/* Date Col */}
                        <span className="col-span-2 text-[12px] font-semibold text-slate-500">
                          {session.dateText}
                        </span>

                        {/* Class Index Col */}
                        <span className="col-span-2 text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/50 w-fit">
                          {session.indexText}
                        </span>

                        {/* Topic & Timings Col */}
                        <div className="col-span-8 space-y-2">
                          <span className="text-[13px] font-bold text-slate-800 block truncate" title={session.topic}>
                            {session.topic}
                          </span>
                          
                          {/* Timings with play/locked button */}
                          <div className="flex items-center gap-1.5">
                            <button className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                              {session.isCompleted ? (
                                <Play className="w-3 h-3 text-blue-600 fill-current" />
                              ) : (
                                <Clock className="w-3 h-3 text-slate-400" />
                              )}
                              <span>6-7 PM</span>
                            </button>
                            <button className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                              {session.isCompleted ? (
                                <Play className="w-3 h-3 text-blue-600 fill-current" />
                              ) : (
                                <Clock className="w-3 h-3 text-slate-400" />
                              )}
                              <span>8:30-9:30 PM</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Sticky Action Footer in Schedule details */}
                <div className="p-6 sm:p-8 border-t border-slate-100 bg-white">
                  {selectedBatch.status === 'completed' ? (
                    <button
                      onClick={onClose}
                      className="w-full h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[15px] font-bold flex items-center justify-center transition-all active:scale-98"
                    >
                      Close Overview
                    </button>
                  ) : selectedBatch.status === 'ongoing' ? (
                    <button
                      onClick={handleConfirmAction}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-blue-500/10"
                    >
                      <span>Go to Live Class</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmAction}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-blue-500/10"
                    >
                      <span>Register for classes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
