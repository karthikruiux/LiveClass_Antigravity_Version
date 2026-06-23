import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterSectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const filterCategories = [
  { id: 'all', label: 'All Courses' },
  { id: 'ai', label: 'Generative AI' },
  { id: 'placement', label: '₹8-12 LPA Essentials' },
  { id: 'dsa', label: 'DSA for MAANG' },
  { id: 'backend', label: 'Build Projects' },
  { id: 'frontend', label: 'Weekend Batches' },
  { id: 'revision', label: 'Revision Classes' },
];

export const FilterSection: React.FC<FilterSectionProps> = ({
  activeCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="filter-bar-pattern rounded-[32px] p-6 md:p-8 flex flex-col gap-6 border border-white/5 shadow-2xl">
      
      {/* Centered Heading */}
      <div className="text-center">
        <h3 className="text-white text-sm md:text-[15px] font-semibold tracking-wide">
          New here? Pick what you want to do.
        </h3>
      </div>

      {/* Row containing scrollable tabs and search input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        
        {/* Scrollable Category Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1 pb-1 md:pb-0 scroll-smooth pr-2">
          {filterCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-full text-[13px] md:text-[14px] font-bold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#1845FF] text-white shadow-lg shadow-blue-600/30 scale-[1.02]' 
                    : 'text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
          
          {/* Clear Filters Button */}
          {(activeCategory !== 'all' || searchTerm !== '') && (
            <button
              onClick={() => {
                onCategoryChange('all');
                onSearchChange('');
              }}
              className="px-4 py-2 rounded-full text-xs font-bold text-red-400 hover:text-red-300 hover:bg-white/5 border border-red-500/20 hover:border-red-500/40 flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap select-none active:scale-[0.98]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Right Search Input pill with dark circular search button inside */}
        <div className="relative w-full md:w-[260px] lg:w-[320px] shrink-0">
          <input
            type="text"
            placeholder="Search live classes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-5 pr-22 py-3 bg-white text-gray-800 placeholder-gray-400 rounded-full focus:outline-none font-semibold text-sm shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            className="w-9 h-9 rounded-full bg-[#18181B] hover:bg-black flex items-center justify-center text-white absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors shadow-md"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

