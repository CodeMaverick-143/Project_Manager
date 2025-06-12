import React, { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProjects } from './hooks/useProjects';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Layout/Header';
import { ProjectFilters } from './components/Projects/ProjectFilters';
import { ProjectsGrid } from './components/Projects/ProjectsGrid';
import { ProjectForm } from './components/Projects/ProjectForm';
import { AddProjectButton } from './components/Projects/AddProjectButton';
import { Project, ProjectType, ProjectFormData } from './types';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading, createProject, updateProject, deleteProject } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ProjectType>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || project.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [projects, searchTerm, selectedType]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await createProject(data);
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Background blur elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 relative overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">My Projects</h2>
            <p className="text-gray-300">Manage and showcase your project portfolio</p>
          </div>

          <ProjectFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            projectCount={filteredProjects.length}
          />

          {projectsLoading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading projects...</p>
            </div>
          ) : (
            <ProjectsGrid
              projects={filteredProjects}
              onEdit={handleEditProject}
              onDelete={deleteProject}
              onAddProject={handleAddProject}
            />
          )}

          <AddProjectButton onClick={handleAddProject} />

          <ProjectForm
            project={editingProject}
            onSubmit={handleFormSubmit}
            onClose={handleCloseForm}
            isOpen={isFormOpen}
          />
        </main>
      </div>
    </div>
  );
}

export default App;