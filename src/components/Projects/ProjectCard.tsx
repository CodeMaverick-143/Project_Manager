import React from 'react';
import { Edit, Trash2, ExternalLink, Github, Users, User } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl hover:border-white/30 transition-all duration-300 group hover:scale-[1.02]">
      {project.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
            <div className="flex items-center mb-3">
              {project.type === 'group' ? (
                <div className="flex items-center text-emerald-300 bg-emerald-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-emerald-400/30">
                  <Users className="w-3 h-3 mr-1" />
                  Group Project
                </div>
              ) : (
                <div className="flex items-center text-green-300 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-green-400/30">
                  <User className="w-3 h-3 mr-1" />
                  Solo Project
                </div>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-300 hover:text-emerald-300 hover:bg-emerald-500/20 backdrop-blur-sm rounded-lg transition-all border border-transparent hover:border-emerald-400/30"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-300 hover:text-red-300 hover:bg-red-500/20 backdrop-blur-sm rounded-lg transition-all border border-transparent hover:border-red-400/30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-gray-200 text-sm mb-4 line-clamp-3">{project.description}</p>

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-200 text-xs rounded-lg border border-white/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex space-x-3">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-gray-300 hover:text-gray-200 font-medium transition-colors"
            >
              <Github className="w-4 h-4 mr-1" />
              Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}