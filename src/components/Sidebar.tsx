import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Tv, 
  FileText, 
  ClipboardCheck, 
  Briefcase, 
  Code, 
  Terminal, 
  LifeBuoy,
  ChevronRight,
  ChevronLeft,
  Menu
} from 'lucide-react';

interface SidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  isMobile?: boolean;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learning', label: 'My Learning', icon: BookOpen },
  { id: 'live', label: 'Live Classes', icon: Tv, badge: 'Live' },
  { id: 'exams', label: 'Exams', icon: FileText },
  { id: 'mock', label: 'Mock Tests', icon: ClipboardCheck },
  { id: 'companies', label: 'Companies', icon: Briefcase },
  { id: 'playgrounds', label: 'Code Playgrounds', icon: Code },
  { id: 'playground', label: 'Playground', icon: Terminal },
  { id: 'support', label: 'Academic Support', icon: LifeBuoy },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab = 'live', onTabChange, isMobile = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const renderSidebarContent = (collapsed: boolean) => (
    <>
      {/* Logo Area */}
      <div className={`flex flex-col items-center shrink-0 border-b border-slate-800/20 pb-4 ${
        collapsed ? 'py-5 gap-3' : 'p-8 gap-4'
      }`}>
        <div className="flex items-center gap-3 w-full justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Code className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1 leading-none">
                  NxtWave <span className="text-blue-500 text-sm font-medium px-1.5 py-0.5 rounded bg-blue-500/10">PRO</span>
                </span>
                <span className="text-xs text-slate-400 font-medium mt-0.5">ACADEMY</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center w-10 h-10 shadow-md"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className={`flex-1 space-y-1 overflow-y-auto no-scrollbar py-4 ${collapsed ? 'px-2' : 'px-4'}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentTab;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`w-full flex items-center rounded-2xl transition-all duration-200 group ${
                collapsed ? 'justify-center p-3' : 'justify-between px-4 py-3.5'
              } ${
                isActive 
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`} />
                  {collapsed && item.badge && (
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
                  )}
                </div>
                {!collapsed && <span className="text-[15px]">{item.label}</span>}
              </div>
              
              {!collapsed && (
                item.badge ? (
                  <span className="bg-red-500 text-[10px] uppercase font-bold text-white px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-4 h-4 text-white/70" />
                )
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile summary / footer in sidebar */}
      <div className={`border-t border-slate-800/30 m-4 rounded-2xl bg-slate-900/40 mt-auto shrink-0 transition-all ${
        collapsed ? 'p-3 flex justify-center' : 'p-6'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-sm text-white overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Profile"
                className="w-full h-full object-cover"
               />
             </div>
             <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
           </div>
           {!collapsed && (
             <div className="flex flex-col min-w-0">
               <span className="text-sm font-semibold text-white truncate">Sanjay Kumar</span>
               <span className="text-[11px] text-slate-400 truncate">ID: CC-28491</span>
             </div>
           )}
         </div>
       </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-sidebar">
        {renderSidebarContent(false)}
      </div>
    );
  }

  return (
    <aside className={`hidden lg:flex min-h-screen bg-sidebar text-white flex flex-col border-r border-slate-800/50 sticky top-0 shrink-0 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-80'
    }`}>
      {renderSidebarContent(isCollapsed)}
    </aside>
  );
};
