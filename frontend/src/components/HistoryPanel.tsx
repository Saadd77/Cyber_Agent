import React, { useState } from 'react';
import { History, Calendar, Target, Clock, CheckCircle, XCircle } from 'lucide-react';

interface TestResult {
  id: string;
  target: string;
  type: string;
  status: 'completed' | 'failed' | 'running';
  timestamp: Date;
  duration: string;
  findings: number;
}

export const HistoryPanel: React.FC = () => {
  const [history] = useState<TestResult[]>([
    {
      id: '1',
      target: 'https://example.com',
      type: 'Web Penetration',
      status: 'completed',
      timestamp: new Date('2025-01-15T14:30:00'),
      duration: '5m 23s',
      findings: 3
    },
    {
      id: '2',
      target: '192.168.1.100',
      type: 'Network Penetration',
      status: 'completed',
      timestamp: new Date('2025-01-15T13:15:00'),
      duration: '12m 45s',
      findings: 5
    },
    {
      id: '3',
      target: 'https://shop.example.com',
      type: 'Website Classification',
      status: 'failed',
      timestamp: new Date('2025-01-15T12:00:00'),
      duration: '2m 10s',
      findings: 0
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-red-400" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <History className="h-5 w-5 text-red-400" />
        <h2 className="text-xl font-semibold text-white">Test History</h2>
        <span className="ml-auto bg-red-400/20 text-red-400 px-2 py-1 rounded-full text-sm">
          {history.length} Tests
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {history.map((test) => (
          <div 
            key={test.id} 
            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => setSelectedTest(test)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(test.status)}
                <span className={`font-medium ${getStatusColor(test.status)}`}>
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{test.timestamp.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-gray-400" />
                <span className="text-white font-medium">{test.target}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{test.type}</span>
                <span>Duration: {test.duration}</span>
              </div>
              
              {test.findings > 0 && (
                <div className="text-sm">
                  <span className="text-orange-400">{test.findings} findings</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Test Details Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTest(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Test Details</h3>
              <button 
                onClick={() => setSelectedTest(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Target</label>
                <div className="text-white font-medium">{selectedTest.target}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Test Type</label>
                  <div className="text-white">{selectedTest.type}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Duration</label>
                  <div className="text-white">{selectedTest.duration}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <div className={`font-medium ${getStatusColor(selectedTest.status)}`}>
                    {selectedTest.status.charAt(0).toUpperCase() + selectedTest.status.slice(1)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Findings</label>
                  <div className="text-white">{selectedTest.findings}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Timestamp</label>
                <div className="text-white">{selectedTest.timestamp.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};