import React, { useState } from 'react';
import { Target, Plus, Globe, Server, Play, Trash2, Edit3 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { targetsAPI } from '../services/api';
import { LoadingSpinner } from './common/LoadingSpinner';

export const TargetPanel: React.FC = () => {
  const { currentProject, targets, loadTargets } = useProject();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTarget, setNewTarget] = useState({
    name: '',
    target_url: '',
    target_ip: '',
    target_type: 'website' as 'website' | 'ip'
  });

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    setIsLoading(true);
    setError('');

    try {
      await targetsAPI.create({
        project_id: currentProject.id,
        name: newTarget.name,
        target_url: newTarget.target_type === 'website' ? newTarget.target_url : undefined,
        target_ip: newTarget.target_type === 'ip' ? newTarget.target_ip : undefined,
        target_type: newTarget.target_type
      });

      // Reset form
      setNewTarget({
        name: '',
        target_url: '',
        target_ip: '',
        target_type: 'website'
      });
      setShowAddForm(false);

      // Reload targets
      await loadTargets(currentProject.id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add target');
    } finally {
      setIsLoading(false);
    }
  };

  const getTargetIcon = (type: string) => {
    return type === 'website' ? <Globe className="h-5 w-5" /> : <Server className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'scanning': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-red-400" />
          <h2 className="text-xl font-semibold text-white">Targets</h2>
          <span className="ml-auto bg-red-400/20 text-red-400 px-2 py-1 rounded-full text-sm">
            {targets.length} Total
          </span>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Target</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Add Target Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h3 className="text-lg font-medium text-white mb-4">Add New Target</h3>
          
          <form onSubmit={handleAddTarget} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Name
              </label>
              <input
                type="text"
                value={newTarget.name}
                onChange={(e) => setNewTarget(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-red-400"
                placeholder="My Target"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Type
              </label>
              <select
                value={newTarget.target_type}
                onChange={(e) => setNewTarget(prev => ({ ...prev, target_type: e.target.value as 'website' | 'ip' }))}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-red-400"
              >
                <option value="website">Website</option>
                <option value="ip">IP Address</option>
              </select>
            </div>

            {newTarget.target_type === 'website' ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newTarget.target_url}
                  onChange={(e) => setNewTarget(prev => ({ ...prev, target_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-red-400"
                  placeholder="https://example.com"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  IP Address
                </label>
                <input
                  type="text"
                  value={newTarget.target_ip}
                  onChange={(e) => setNewTarget(prev => ({ ...prev, target_ip: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-red-400"
                  placeholder="192.168.1.1"
                  required
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add Target</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Targets List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {targets.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No targets added</h3>
            <p className="text-gray-500 mb-6">Add your first target to start security testing</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              Add First Target
            </button>
          </div>
        ) : (
          targets.map((target) => (
            <div key={target.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400">
                    {getTargetIcon(target.target_type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{target.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {target.target_url || target.target_ip}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(target.status)}`}>
                    {target.status}
                  </span>
                  <button className="p-2 rounded hover:bg-gray-600 transition-colors">
                    <Play className="h-4 w-4 text-green-400" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-600 transition-colors">
                    <Edit3 className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-600 transition-colors">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Added: {new Date(target.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  // frontend/src/components/TargetPanel.tsx - ADD:

const executeAgent = async (targetId: string, agentType: string) => {
  if (!currentProject) return;
  
  setIsLoading(true);
  setError('');
  
  try {
    const target = targets.find(t => t.id === targetId);
    if (!target) throw new Error('Target not found');
    
    const response = await agentsAPI.execute({
      agent_type: agentType,
      target: target.target_url || target.target_ip || '',
      project_id: currentProject.id,
      target_id: targetId,
      options: {}
    });
    
    // Show success message and maybe navigate to results
    console.log('Agent execution started:', response);
    
  } catch (err: any) {
    setError(err.response?.data?.detail || 'Failed to execute agent');
  } finally {
    setIsLoading(false);
  }
};

// Add agent execution buttons to each target
<div className="flex items-center space-x-2">
  <button 
    onClick={() => executeAgent(target.id, 'web_classifier')}
    className="p-2 rounded hover:bg-gray-600 transition-colors"
    title="Web Classification"
  >
    <Globe className="h-4 w-4 text-blue-400" />
  </button>
  <button 
    onClick={() => executeAgent(target.id, 'web_pentester')}
    className="p-2 rounded hover:bg-gray-600 transition-colors"
    title="Web Penetration Test"
  >
    <Shield className="h-4 w-4 text-purple-400" />
  </button>
  <button 
    onClick={() => executeAgent(target.id, 'network_scanner')}
    className="p-2 rounded hover:bg-gray-600 transition-colors"
    title="Network Scan"
  >
    <Server className="h-4 w-4 text-red-400" />
  </button>
</div>
};