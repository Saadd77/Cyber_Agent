import React from 'react';
import { Shield, User, Settings, LogOut, FolderOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currentProjectId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastAccessed: Date;
  targetCount: number;
  status: 'active' | 'completed' | 'paused';
  type: 'network' | 'web' | 'mobile' | 'api';
}

interface HeaderProps {
  user: User;
  currentProject?: Project | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, currentProject, onLogout }) => {
  const navigate = useNavigate();

  const handleSwitchProject = () => {
    navigate('/projects');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-red-400" />
          <div>
            <h1 className="text-xl font-bold text-white">AI PenTest Platform</h1>
            {currentProject && (
              <p className="text-sm text-gray-400">Project: {currentProject.name}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentProject && (
            <button 
              onClick={handleSwitchProject}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors" 
              title="Switch Project"
            >
              <FolderOpen className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-300">Switch Project</span>
            </button>
          )}
          
          <div className="flex items-center space-x-2 text-gray-300">
            <User className="h-5 w-5" />
            <span className="text-sm">{user.firstName} {user.lastName}</span>
          </div>
          
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors" title="Settings">
            <Settings className="h-5 w-5 text-gray-300" />
          </button>
          
          <button 
            onClick={onLogout}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors" 
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
};