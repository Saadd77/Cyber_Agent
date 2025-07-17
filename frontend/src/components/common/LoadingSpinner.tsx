import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'border-red-500/30 border-t-red-500',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-500/30 border-t-gray-500'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingOverlay: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" color="primary" />
        {children && <div className="text-white text-center">{children}</div>}
      </div>
    </div>
  );
};

export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center space-x-3 py-8">
      <LoadingSpinner size="md" color="primary" />
      {message && <span className="text-gray-400">{message}</span>}
    </div>
  );
};