import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: 'network' | 'web' | 'mobile' | 'api';
  status: 'active' | 'completed' | 'paused';
  target_count: number;
  created_at: string;
}

interface Target {
  id: string;
  project_id: string;
  name: string;
  target_url?: string;
  target_ip?: string;
  target_type: 'website' | 'ip';
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  created_at: string;
}

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  targets: Target[];
  isLoading: boolean;
  error: string | null;
  selectProject: (projectId: string) => Promise<void>;
  createProject: (projectData: any) => Promise<void>;
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
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        // Load projects
        const storedProjects = localStorage.getItem('pentestProjects');
        if (storedProjects && storedProjects !== 'undefined') {
          const parsedProjects = JSON.parse(storedProjects);
          setProjects(parsedProjects);
          console.log('Loaded stored projects:', parsedProjects);
        }

        // Load current project
        const storedCurrentProject = localStorage.getItem('currentProject');
        if (storedCurrentProject && storedCurrentProject !== 'undefined') {
          const parsedCurrentProject = JSON.parse(storedCurrentProject);
          setCurrentProject(parsedCurrentProject);
          console.log('Loaded stored current project:', parsedCurrentProject);
        }
      } catch (err) {
        console.error('Error loading stored project data:', err);
        localStorage.removeItem('pentestProjects');
        localStorage.removeItem('currentProject');
      }
    };

    loadStoredData();
  }, []);

  const loadProjects = async () => {
    console.log('ProjectContext: Loading projects from localStorage');
    // Projects are already loaded in useEffect, so this is just for compatibility
    return Promise.resolve();
  };

  const selectProject = async (projectId: string) => {
    console.log('ProjectContext: Selecting project', projectId);
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      localStorage.setItem('currentProject', JSON.stringify(project));
      console.log('ProjectContext: Project selected', project);
    }
    return Promise.resolve();
  };

  const createProject = async (projectData: any) => {
    console.log('ProjectContext: Creating project', projectData);
    setIsLoading(true);
    
    // Create project instantly (no delay)
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectData.name,
      description: projectData.description || '',
      project_type: projectData.project_type,
      status: 'active',
      target_count: 0,
      created_at: new Date().toISOString()
    };
    
    // Update state
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setCurrentProject(newProject);
    
    // Store in localStorage
    localStorage.setItem('pentestProjects', JSON.stringify(updatedProjects));
    localStorage.setItem('currentProject', JSON.stringify(newProject));
    
    setIsLoading(false);
    console.log('ProjectContext: Project created instantly', newProject);
    
    return Promise.resolve();
  };

  const loadTargets = async (projectId: string) => {
    console.log('ProjectContext: Loading targets for project', projectId);
    
    // Load targets from localStorage
    try {
      const storedTargets = localStorage.getItem(`targets_${projectId}`);
      if (storedTargets && storedTargets !== 'undefined') {
        const parsedTargets = JSON.parse(storedTargets);
        setTargets(parsedTargets);
        console.log('Loaded targets for project:', parsedTargets);
      } else {
        setTargets([]);
      }
    } catch (err) {
      console.error('Error loading targets:', err);
      setTargets([]);
    }
    
    return Promise.resolve();
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