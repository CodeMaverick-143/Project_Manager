import React from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';

interface ProjectsGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddProject: () => void;
}

export function ProjectsGrid({ projects, onEdit, onDelete, onAddProject }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full mb-6 border border-white/20">
          <FolderOpen className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
        <p className="text-gray-300 mb-8">
          Get started by creating your first project to showcase your work.
        </p>
        <button
          onClick={onAddProject}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all shadow-lg hover:shadow-emerald-500/25"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}