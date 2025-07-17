import React from 'react';
import { Wifi, WifiOff, Activity, Target, Timer } from 'lucide-react';

interface StatusBarProps {
  isConnected: boolean;
  currentTarget: string;
  testType: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isConnected,
  currentTarget,
  testType
}) => {
  return (
    <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-red-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className="text-sm text-gray-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {currentTarget && (
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">{currentTarget}</span>
            </div>
          )}

          {testType && (
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-300 capitalize">{testType}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Timer className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};