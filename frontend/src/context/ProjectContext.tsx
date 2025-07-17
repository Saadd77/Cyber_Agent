import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, ProjectCreate, Target } from '../types/api';
import { projectsAPI, targetsAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  targets: Target[];
  isLoading: boolean;
  error: string | null;
  selectProject: (projectId: string) => Promise<void>;
  createProject: (projectData: ProjectCreate) => Promise<void>;
  loadProjects: () => Promise<void>;
  loadTargets: (projectId: string) => Promise<void>;
  clearError: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current project from localStorage on mount
  useEffect(() => {
    const storedProject = localStorage.getItem('currentProject');
    if (storedProject) {
      try {
        setCurrentProject(JSON.parse(storedProject));
      } catch (err) {
        console.error('Error parsing stored project:', err);
        localStorage.removeItem('currentProject');
      }
    }
  }, []);

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const projectsData = await projectsAPI.getAll();
      setProjects(projectsData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to load projects';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectProject = async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const project = await projectsAPI.getById(projectId);
      setCurrentProject(project);
      localStorage.setItem('currentProject', JSON.stringify(project));
      
      // Load targets for the selected project
      await loadTargets(projectId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to select project';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: ProjectCreate) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newProject = await projectsAPI.create(projectData);
      setCurrentProject(newProject);
      localStorage.setItem('currentProject', JSON.stringify(newProject));
      
      // Refresh projects list
      await loadProjects();
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create project';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTargets = async (projectId: string) => {
    try {
      const targetsData = await targetsAPI.getByProject(projectId);
      setTargets(targetsData);
    } catch (err: any) {
      console.error('Failed to load targets:', err);
      // Don't set error for targets loading failure
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: ProjectContextType = {
    currentProject,
    projects,
    targets,
    isLoading,
    error,
    selectProject,
    createProject,
    loadProjects,
    loadTargets,
    clearError,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};