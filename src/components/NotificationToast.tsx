import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, Bell, ShieldCheck, ArrowRight } from 'lucide-react';

interface LiveAlert {
  id: string;
  title: string;
  topic: string;
}

interface NotificationToastProps {
  alert: LiveAlert | null;
  onClose: () => void;
  onJoin: (id: string) => void;
  permissionStatus: NotificationPermission;
  onRequestPermission: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  alert,
  onClose,
  onJoin,
  permissionStatus,
  onRequestPermission
}) => {
  return (
    <>
      {/* 1. Global On-Screen Slide-in Alert */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, x: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-6 right-6 z-50 w-96 bg-white border-2 border-red-500 rounded-[24px] shadow-2xl p-5 flex flex-col gap-4 overflow-hidden"
          >
            {/* Pulsing red side-stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-red-600 animate-pulse"></div>

            {/* Header info */}
            <div className="flex items-start justify-between pl-2">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-[12px] tracking-wider uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 fill-current" />
                  Live Class Started
                </span>
              </div>
              
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-1.5 pl-2">
              <h4 className="text-[16px] font-extrabold text-slate-900 leading-snug">
                {alert.title}
              </h4>
              <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                Topic: <span className="font-semibold text-slate-700">{alert.topic}</span>
              </p>
            </div>

            {/* Action Join Button */}
            <button
              onClick={() => {
                onJoin(alert.id);
                onClose();
              }}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-500/10 active:scale-98 transition-all pl-2"
            >
              <span>Join Live Classroom</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Banner Prompt for System Notification Permission */}
      {permissionStatus === 'default' && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm bg-[#F0F4FF] border border-blue-200 rounded-[20px] shadow-xl p-4 flex items-start gap-3.5 animate-bounce">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-2 flex-1 min-w-0">
            <h5 className="text-[13px] font-bold text-blue-900 leading-tight">
              Get Live Alerts in Real Time
            </h5>
            <p className="text-blue-700 text-[11px] font-medium leading-normal">
              Enable browser/system notifications to get notified instantly when your classes go live.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onRequestPermission}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enable Alerts</span>
              </button>
              <button 
                onClick={onClose}
                className="text-blue-600 hover:text-blue-800 text-[11px] font-bold px-2 py-1.5"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
