import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Plus, FolderOpen, Calendar, Target, Play, Settings, LogOut, 
  Globe, Server, Smartphone, Code, Clock, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { LoadingSpinner } from './common/LoadingSpinner';

export const ProjectSelection: React.FC = () => {
  const { user, logout } = useAuth();
  const { projects, selectProject, createProject, isLoading } = useProject();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    project_type: 'web' as 'network' | 'web' | 'mobile' | 'api'
  });
  const navigate = useNavigate();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      console.log('Project created, navigating to main app...');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleSelectProject = async (projectId: string) => {
    try {
      await selectProject(projectId);
      console.log('Project selected, navigating to main app...');
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to select project:', err);
    }
  };

  // Quick project creation
  const quickCreateProject = (name: string, type: 'network' | 'web' | 'mobile' | 'api', description: string) => {
    const projectData = { name, project_type: type, description };
    createProject(projectData).then(() => {
      navigate('/', { replace: true });
    }).catch(console.error);
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return <Globe className="h-6 w-6 text-blue-400" />;
      case 'network': return <Server className="h-6 w-6 text-green-400" />;
      case 'mobile': return <Smartphone className="h-6 w-6 text-purple-400" />;
      case 'api': return <Code className="h-6 w-6 text-orange-400" />;
      default: return <FolderOpen className="h-6 w-6 text-gray-400" />;
    }
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'web': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'network': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'mobile': return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'api': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-red-400" />
            <div>
              <h1 className="text-xl font-bold text-white">AI PenTest Platform</h1>
              <p className="text-sm text-gray-400">Select or create a project</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="text-sm">Welcome, {user?.first_name}</span>
            </div>
            
            <button 
              onClick={logout}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors" 
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Project Creation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start Projects</h2>
          <p className="text-gray-400 mb-6">Get started instantly with pre-configured project templates</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => quickCreateProject('Web Application Test', 'web', 'Security testing for web applications and websites')}
              className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-all group"
            >
              <Globe className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Web App Testing</h3>
              <p className="text-gray-400 text-sm">Test websites and web applications for vulnerabilities</p>
            </button>

            <button
              onClick={() => quickCreateProject('Network Infrastructure', 'network', 'Network penetration testing and infrastructure analysis')}
              className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-green-500/50 transition-all group"
            >
              <Server className="h-8 w-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Network Testing</h3>
              <p className="text-gray-400 text-sm">Scan and test network infrastructure and services</p>
            </button>

            <button
              onClick={() => quickCreateProject('Mobile App Security', 'mobile', 'Security assessment for mobile applications')}
              className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all group"
            >
              <Smartphone className="h-8 w-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Mobile Testing</h3>
              <p className="text-gray-400 text-sm">Test mobile apps for security vulnerabilities</p>
            </button>

            <button
              onClick={() => quickCreateProject('API Security Audit', 'api', 'REST API and web service security testing')}
              className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-orange-500/50 transition-all group"
            >
              <Code className="h-8 w-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">API Testing</h3>
              <p className="text-gray-400 text-sm">Test REST APIs and web services for security issues</p>
            </button>
          </div>
        </div>

        {/* Existing Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Projects</h2>
              <span className="text-sm text-gray-400">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getProjectTypeIcon(project.project_type)}
                      <div>
                        <h3 className="text-white font-semibold">{project.name}</h3>
                        <p className="text-gray-400 text-sm">{project.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getProjectTypeColor(project.project_type)}`}>
                      {project.project_type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {project.target_count} target{project.target_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">{project.status}</span>
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleSelectProject(project.id)}
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Open Project</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Project Creation */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create Custom Project</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Custom Project</span>
            </button>
          </div>

          {showCreateForm && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400"
                    placeholder="My Security Assessment"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400"
                    placeholder="Brief description of what you'll be testing..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Type
                  </label>
                  <select
                    value={newProject.project_type}
                    onChange={(e) => setNewProject(prev => ({ ...prev, project_type: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-400"
                  >
                    <option value="web">Web Application</option>
                    <option value="network">Network Infrastructure</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="api">API/Web Service</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !newProject.name}
                    className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Create Project</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};