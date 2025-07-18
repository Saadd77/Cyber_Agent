import React, { useState } from 'react';
import { Bug, RefreshCw, Trash2, User, FolderOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

const DebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, logout } = useAuth();
  const { currentProject, clearCurrentProject, projects } = useProject();
  const navigate = useNavigate();

  const clearAllData = () => {
    logout();
    if (clearCurrentProject) {
      clearCurrentProject();
    }
    localStorage.clear();
    window.location.href = '/login';
  };

  const clearProjectData = () => {
    if (clearCurrentProject) {
      clearCurrentProject();
    }
    localStorage.removeItem('currentProject');
    navigate('/projects');
  };

  const goToLogin = () => {
    logout();
    navigate('/login');
  };

  const goToProjects = () => {
    navigate('/projects');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg z-50 transition-colors"
        title="Toggle Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed bottom-20 left-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm z-50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Debug Panel</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Current State */}
          <div className="mb-4 text-xs">
            <div className="text-gray-400 mb-2">Current State:</div>
            <div className="bg-gray-700 p-2 rounded text-green-400 font-mono">
              <div>User: {user ? `${user.first_name} ${user.last_name}` : 'None'}</div>
              <div>Email: {user?.email || 'None'}</div>
              <div>Project: {currentProject?.name || 'None'}</div>
              <div>Projects: {projects.length}</div>
              <div>Path: {window.location.pathname}</div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <div className="text-gray-400 text-xs mb-2">Quick Navigation:</div>
            
            <button
              onClick={goToLogin}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Go to Login</span>
            </button>

            <button
              onClick={goToProjects}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Go to Projects</span>
            </button>

            <button
              onClick={clearProjectData}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear Project</span>
            </button>

            <button
              onClick={clearAllData}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Reset All Data</span>
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            This panel is for development only
          </div>
        </div>
      )}
    </>
  );
};

export { DebugPanel };