export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'solo' | 'group';
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export type ProjectType = 'all' | 'solo' | 'group';

export interface ProjectFormData {
  title: string;
  description: string;
  type: 'solo' | 'group';
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
}