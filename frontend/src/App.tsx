import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ProjectSelection } from './components/ProjectSelection';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { TargetPanel } from './components/TargetPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { ReportNotesPanel } from './components/ReportNotesPanel';
import { MonitorPanel } from './components/MonitorPanel';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { authAPI, projectsAPI } from './services/api';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  currentProjectId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  last_accessed: Date;
  target_count: number;
  status: 'active' | 'completed' | 'paused';
  project_type: 'network' | 'web' | 'mobile' | 'api';
}

const Dashboard: React.FC<{
  user: User;
  currentProject: Project | null;
  onLogout: () => void;
}> = ({ user, currentProject, onLogout }) => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTarget, setCurrentTarget] = useState('');
  const [testType, setTestType] = useState('');

  const renderMainContent = () => {
    switch (activeTab) {
      case 'terminal':
        return (
          <div className="h-full p-4">
            <Terminal isConnected={isConnected} />
          </div>
        );
      case 'target':
        return (
          <div className="h-full p-4 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <TargetPanel 
                currentTarget={currentTarget}
                setCurrentTarget={setCurrentTarget}
                testType={testType}
                setTestType={setTestType}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                currentProject={currentProject}
              />
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="h-full p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <HistoryPanel />
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="h-full p-4 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <ReportNotesPanel />
            </div>
          </div>
        );
      case 'monitor':
        return (
          <div className="h-full p-4 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <MonitorPanel isConnected={isConnected} />
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <h2 className="text-2xl font-bold mb-2">Select a Tool</h2>
              <p>Choose an option from the sidebar to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header user={user} currentProject={currentProject} onLogout={onLogout} />
      
      <div className="flex-1 flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          width={sidebarWidth}
          setWidth={setSidebarWidth}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderMainContent()}
          
          <StatusBar 
            isConnected={isConnected}
            currentTarget={currentTarget}
            testType={testType}
          />
        </main>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for existing session
  React.useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storedUser = localStorage.getItem('pentestUser');
      const storedProject = localStorage.getItem('currentProject');
      const token = localStorage.getItem('access_token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      if (storedProject) {
        setCurrentProject(JSON.parse(storedProject));
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name
      };
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('pentestUser', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleProjectSelect = async (projectId: string) => {
    try {
      const project = await projectsAPI.getById(projectId);
      
      const projectData: Project = {
        id: project.id,
        name: project.name,
        description: project.description,
        created_at: new Date(project.created_at),
        last_accessed: new Date(project.last_accessed),
        target_count: project.target_count,
        status: project.status,
        project_type: project.project_type
      };
      
      localStorage.setItem('currentProject', JSON.stringify(projectData));
      setCurrentProject(projectData);
      
      const updatedUser = { ...user!, currentProjectId: projectId };
      localStorage.setItem('pentestUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to select project:', error);
    }
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'last_accessed'>) => {
    try {
      const newProject = await projectsAPI.create({
        name: projectData.name,
        description: projectData.description,
        project_type: projectData.project_type,
        status: projectData.status,
        target_count: projectData.target_count
      });
      
      const projectDataFormatted: Project = {
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        created_at: new Date(newProject.created_at),
        last_accessed: new Date(newProject.last_accessed),
        target_count: newProject.target_count,
        status: newProject.status,
        project_type: newProject.project_type
      };
      
      localStorage.setItem('currentProject', JSON.stringify(projectDataFormatted));
      setCurrentProject(projectDataFormatted);
      
      const updatedUser = { ...user!, currentProjectId: newProject.id };
      localStorage.setItem('pentestUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleSignup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await authAPI.signup({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password
      });
      
      const newUser: User = {
        id: response.id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name
      };
      
      localStorage.setItem('pentestUser', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pentestUser');
    localStorage.removeItem('currentProject');
    localStorage.removeItem('access_token');
    setUser(null);
    setCurrentProject(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing AI PenTest Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/signup" 
          element={
            user ? <Navigate to="/" replace /> : <SignupPage onSignup={handleSignup} />
          } 
        />
        <Route 
          path="/" 
          element={
            user && currentProject ? (
              <Dashboard user={user} currentProject={currentProject} onLogout={handleLogout} />
            ) : user ? (
              <ProjectSelection 
                onProjectSelect={handleProjectSelect}
                onCreateProject={handleCreateProject}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/projects" 
          element={
            user ? (
              <ProjectSelection 
                onProjectSelect={handleProjectSelect}
                onCreateProject={handleCreateProject}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
