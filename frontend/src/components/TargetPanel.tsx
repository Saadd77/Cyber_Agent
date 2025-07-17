import React, { useState } from 'react';
import { Target, Globe, Server, Eye, Play } from 'lucide-react';

interface TargetPanelProps {
  currentTarget: string;
  setCurrentTarget: (target: string) => void;
  testType: string;
  setTestType: (type: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export const TargetPanel: React.FC<TargetPanelProps> = ({
  currentTarget,
  setCurrentTarget,
  testType,
  setTestType,
  isConnected,
  setIsConnected
}) => {
  const [targetType, setTargetType] = useState<'website' | 'ip'>('website');

  const testTypes = [
    {
      id: 'network',
      label: 'Network Penetration',
      icon: Server,
      description: 'Scan ports, services, and network vulnerabilities',
      color: 'text-blue-400'
    },
    {
      id: 'web',
      label: 'Web Penetration',
      icon: Globe,
      description: 'Test web applications for security flaws',
      color: 'text-purple-400'
    },
    {
      id: 'classify',
      label: 'Website Classification',
      icon: Eye,
      description: 'Analyze and classify website content',
      color: 'text-orange-400'
    }
  ];

  const handleStartTest = () => {
    if (currentTarget && testType) {
      setIsConnected(true);
      // Here you would typically make an API call to your FastAPI backend
      console.log('Starting test:', { target: currentTarget, type: testType });
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="h-5 w-5 text-red-400" />
        <h2 className="text-lg font-semibold text-white">Target Configuration</h2>
      </div>

      <div className="space-y-6">
        {/* Target Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Target Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTargetType('website')}
              className={`p-3 rounded-lg border transition-all ${
                targetType === 'website'
                  ? 'border-red-400 bg-red-400/10 text-red-400'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Globe className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Website</span>
            </button>
            <button
              onClick={() => setTargetType('ip')}
              className={`p-3 rounded-lg border transition-all ${
                targetType === 'ip'
                  ? 'border-red-400 bg-red-400/10 text-red-400'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Server className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm font-medium">IP Address</span>
            </button>
          </div>
        </div>

        {/* Target Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            {targetType === 'website' ? 'Website URL' : 'IP Address'}
          </label>
          <input
            type="text"
            value={currentTarget}
            onChange={(e) => setCurrentTarget(e.target.value)}
            placeholder={targetType === 'website' ? 'https://example.com' : '192.168.1.1'}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
          />
        </div>

        {/* Test Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Test Type
          </label>
          <div className="space-y-3">
            {testTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setTestType(type.id)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    testType === type.id
                      ? 'border-red-400 bg-red-400/10'
                      : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${type.color}`} />
                    <div>
                      <div className="font-medium text-white">{type.label}</div>
                      <div className="text-sm text-gray-400 mt-1">{type.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartTest}
          disabled={!currentTarget || !testType}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <Play className="h-5 w-5" />
          <span className="font-medium">Start Test</span>
        </button>
      </div>
    </div>
  );
};