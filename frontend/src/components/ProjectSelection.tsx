import React, { useState } from 'react';
import { Plus, Folder, Calendar, Target, ArrowRight, Search, Filter } from 'lucide-react';

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

interface ProjectSelectionProps {
  onProjectSelect: (projectId: string) => void;
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastAccessed'>) => void;
}

export const ProjectSelection: React.FC<ProjectSelectionProps> = ({
  onProjectSelect,
  onCreateProject
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    targetCount: 0,
    status: 'active' as const,
    type: 'web' as const
  });

  // Mock projects data
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Security Audit',
      description: 'Comprehensive security assessment of online shopping platform',
      createdAt: new Date('2025-01-10'),
      lastAccessed: new Date('2025-01-15'),
      targetCount: 5,
      status: 'active',
      type: 'web'
    },
    {
      id: '2',
      name: 'Corporate Network Assessment',
      description: 'Internal network penetration testing for enterprise client',
      createdAt: new Date('2025-01-05'),
      lastAccessed: new Date('2025-01-14'),
      targetCount: 12,
      status: 'active',
      type: 'network'
    },
    {
      id: '3',
      name: 'API Security Review',
      description: 'REST API vulnerability assessment and testing',
      createdAt: new Date('2024-12-20'),
      lastAccessed: new Date('2025-01-12'),
      targetCount: 8,
      status: 'completed',
      type: 'api'
    },
    {
      id: '4',
      name: 'Mobile App Pentest',
      description: 'Security testing of iOS and Android applications',
      createdAt: new Date('2024-12-15'),
      lastAccessed: new Date('2025-01-10'),
      targetCount: 3,
      status: 'paused',
      type: 'mobile'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return '🌐';
      case 'network': return '🔗';
      case 'mobile': return '📱';
      case 'api': return '⚡';
      default: return '📁';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      onCreateProject(newProject);
      setShowCreateForm(false);
      setNewProject({
        name: '',
        description: '',
        targetCount: 0,
        status: 'active',
        type: 'web'
      });
    }
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-2xl">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Plus className="h-6 w-6 text-red-400" />
                <h2 className="text-2xl font-semibold text-white">Create New Project</h2>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
                  placeholder="Enter project name"
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
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
                  placeholder="Describe your penetration testing project"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Type
                  </label>
                  <select
                    value={newProject.type}
                    onChange={(e) => setNewProject(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
                  >
                    <option value="web">Web Application</option>
                    <option value="network">Network Infrastructure</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="api">API Testing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initial Target Count
                  </label>
                  <input
                    type="number"
                    value={newProject.targetCount}
                    onChange={(e) => setNewProject(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Select Project</h1>
          <p className="text-gray-400 text-lg">Choose an existing project or create a new penetration testing project</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-red-400"
            >
              <option value="all">All Types</option>
              <option value="web">Web</option>
              <option value="network">Network</option>
              <option value="mobile">Mobile</option>
              <option value="api">API</option>
            </select>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 hover:border-red-400/50 transition-all duration-300 cursor-pointer group"
              onClick={() => onProjectSelect(project.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(project.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                      {project.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{project.targetCount} targets</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{project.lastAccessed.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first penetration testing project'}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Project</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};