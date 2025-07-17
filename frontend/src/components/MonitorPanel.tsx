import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Server, AlertTriangle } from 'lucide-react';

interface MonitorPanelProps {
  isConnected: boolean;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface ActiveTest {
  id: string;
  target: string;
  type: string;
  progress: number;
  status: string;
  startTime: Date;
}

export const MonitorPanel: React.FC<MonitorPanelProps> = ({ isConnected }) => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23
  });

  const [activeTests] = useState<ActiveTest[]>([
    {
      id: '1',
      target: 'https://example.com',
      type: 'Web Penetration',
      progress: 75,
      status: 'Scanning vulnerabilities...',
      startTime: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2',
      target: '192.168.1.100',
      type: 'Network Scan',
      progress: 30,
      status: 'Port scanning...',
      startTime: new Date(Date.now() - 120000) // 2 minutes ago
    }
  ]);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (value: number) => {
    if (value > 80) return 'text-red-400';
    if (value > 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (progress: number) => {
    if (progress > 75) return 'bg-red-400';
    if (progress > 50) return 'bg-yellow-400';
    return 'bg-blue-400';
  };

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full space-y-6">
      {/* System Metrics */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="h-6 w-6 text-red-400" />
          <h2 className="text-xl font-semibold text-white">System Monitor</h2>
          <div className={`ml-auto flex items-center space-x-2 ${isConnected ? 'text-red-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-red-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="h-5 w-5 text-blue-400" />
              <span className={`text-sm font-medium ${getMetricColor(metrics.cpu)}`}>
                {metrics.cpu.toFixed(1)}%
              </span>
            </div>
            <div className="text-white font-medium mb-2">CPU Usage</div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(metrics.cpu).replace('text-', 'bg-')}`}
                style={{ width: `${metrics.cpu}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="h-5 w-5 text-purple-400" />
              <span className={`text-sm font-medium ${getMetricColor(metrics.memory)}`}>
                {metrics.memory.toFixed(1)}%
              </span>
            </div>
            <div className="text-white font-medium mb-2">Memory</div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(metrics.memory).replace('text-', 'bg-')}`}
                style={{ width: `${metrics.memory}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Server className="h-5 w-5 text-orange-400" />
              <span className={`text-sm font-medium ${getMetricColor(metrics.disk)}`}>
                {metrics.disk.toFixed(1)}%
              </span>
            </div>
            <div className="text-white font-medium mb-2">Disk Usage</div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(metrics.disk).replace('text-', 'bg-')}`}
                style={{ width: `${metrics.disk}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="h-5 w-5 text-red-400" />
              <span className={`text-sm font-medium ${getMetricColor(metrics.network)}`}>
                {metrics.network.toFixed(1)}%
              </span>
            </div>
            <div className="text-white font-medium mb-2">Network</div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getMetricColor(metrics.network).replace('text-', 'bg-')}`}
                style={{ width: `${metrics.network}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tests */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Active Tests</h2>
          <span className="ml-auto bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-sm">
            {activeTests.length} Running
          </span>
        </div>

        <div className="space-y-4">
          {activeTests.map((test) => (
            <div key={test.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-medium">{test.target}</div>
                  <div className="text-sm text-gray-400">{test.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{test.progress}%</div>
                  <div className="text-sm text-gray-400">{formatDuration(test.startTime)}</div>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(test.progress)}`}
                    style={{ width: `${test.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-300">{test.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">System Alerts</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-400/10 border border-red-400/30 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <div>
              <div className="text-red-400 font-medium">High CPU Usage Detected</div>
              <div className="text-sm text-gray-400">CPU usage has exceeded 80% for 5 minutes</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <div>
              <div className="text-yellow-400 font-medium">Memory Usage Warning</div>
              <div className="text-sm text-gray-400">Memory usage approaching 70%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};