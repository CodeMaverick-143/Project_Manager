import React from 'react';
import { Search, Filter, Users, User, Grid } from 'lucide-react';
import { ProjectType } from '../../types';

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: ProjectType;
  onTypeChange: (type: ProjectType) => void;
  projectCount: number;
}

export function ProjectFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  projectCount
}: ProjectFiltersProps) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-300" />
            <span className="text-sm font-medium text-gray-200">Filter by:</span>
          </div>
          
          <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            <button
              onClick={() => onTypeChange('all')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === 'all'
                  ? 'bg-emerald-500/30 text-white shadow-lg backdrop-blur-sm'
                  : 'text-gray-300 hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              <Grid className="w-4 h-4 mr-2" />
              All
            </button>
            <button
              onClick={() => onTypeChange('solo')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === 'solo'
                  ? 'bg-emerald-500/30 text-white shadow-lg backdrop-blur-sm'
                  : 'text-gray-300 hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Solo
            </button>
            <button
              onClick={() => onTypeChange('group')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === 'group'
                  ? 'bg-emerald-500/30 text-white shadow-lg backdrop-blur-sm'
                  : 'text-gray-300 hover:text-gray-100 hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Group
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
        <span>
          {projectCount} {projectCount === 1 ? 'project' : 'projects'} found
        </span>
      </div>
    </div>
  );
}