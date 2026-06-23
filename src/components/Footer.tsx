import React from 'react';
import { Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-8 px-10 mt-16 rounded-t-[32px]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading font-extrabold text-[22px] tracking-tight text-text-primary">
              NxtWave Academy
            </span>
          </div>
          <p className="text-text-secondary text-sm font-medium text-center max-w-md mt-1">
            Build production-ready skills, get mentorship from top tech companies, and unlock your dream career.
          </p>
        </div>

        {/* Links Grid */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-semibold text-text-secondary">
          <a href="#" className="hover:text-primary-blue transition-colors">Home</a>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <a href="#" className="hover:text-primary-blue transition-colors">Terms of Service</a>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <a href="#" className="hover:text-primary-blue transition-colors">Privacy Policy</a>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <a href="#" className="hover:text-primary-blue transition-colors">Contact Us</a>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <a href="#" className="hover:text-primary-blue transition-colors">Help Centre</a>
        </div>

        {/* Social Icons (using inline SVGs to avoid any dependency import issues) */}
        <div className="flex items-center gap-4">
          {/* Facebook */}
          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-blue hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Twitter / X */}
          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-blue hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
            aria-label="Twitter / X"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* Linkedin */}
          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-blue hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
            aria-label="LinkedIn"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
            </svg>
          </a>

          {/* Youtube */}
          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-blue hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.482 20.455 12 20.455 12 20.455s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-blue hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[13px] text-slate-400 font-medium">
          <span>© 2026 NxtWave Technologies. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Designed for developers, powered by AI.</span>
        </div>

      </div>
    </footer>
  );
};
