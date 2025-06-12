import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Upload, Image } from 'lucide-react';
import { Project, ProjectFormData } from '../../types';
import { supabase } from '../../lib/supabase';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export function ProjectForm({ project, onSubmit, onClose, isOpen }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    type: 'solo',
    technologies: [],
    image_url: '',
    demo_url: '',
    github_url: ''
  });
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        type: project.type,
        technologies: [...project.technologies],
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || ''
      });
      setImagePreview(project.image_url || '');
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'solo',
        technologies: [],
        image_url: '',
        demo_url: '',
        github_url: ''
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [project, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `project-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      await onSubmit({
        ...formData,
        image_url: imageUrl
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300 hover:text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all text-white placeholder-gray-400"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all resize-none text-white placeholder-gray-400"
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Project Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 cursor-pointer hover:bg-white/20 transition-all">
                <input
                  type="radio"
                  value="solo"
                  checked={formData.type === 'solo'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'solo' | 'group' }))}
                  className="w-4 h-4 text-emerald-600 bg-white/20 border-white/30 focus:ring-emerald-500/50"
                />
                <span className="ml-2 text-sm text-gray-200">Solo Project</span>
              </label>
              <label className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 cursor-pointer hover:bg-white/20 transition-all">
                <input
                  type="radio"
                  value="group"
                  checked={formData.type === 'group'}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'solo' | 'group' }))}
                  className="w-4 h-4 text-emerald-600 bg-white/20 border-white/30 focus:ring-emerald-500/50"
                />
                <span className="ml-2 text-sm text-gray-200">Group Project</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Technologies
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all text-white placeholder-gray-400"
                placeholder="Add a technology"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm text-gray-200 text-sm rounded-lg border border-white/20"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-2 text-gray-300 hover:text-red-300 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Project Image
            </label>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-xl cursor-pointer bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-300" />
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      setFormData(prev => ({ ...prev, image_url: '' }));
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500/80 backdrop-blur-sm text-white rounded-full hover:bg-red-600/80 transition-colors border border-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="demo_url" className="block text-sm font-medium text-gray-200 mb-2">
                Demo URL
              </label>
              <input
                id="demo_url"
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all text-white placeholder-gray-400"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="github_url" className="block text-sm font-medium text-gray-200 mb-2">
                GitHub URL
              </label>
              <input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/50 transition-all text-white placeholder-gray-400"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-200 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {uploading ? 'Uploading...' : loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}