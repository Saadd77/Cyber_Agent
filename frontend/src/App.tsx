import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useProject } from './context/ProjectContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ProjectSelection } from './components/ProjectSelection';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { Terminal } from './components/Terminal';
import { TargetPanel } from './components/TargetPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { ReportNotesPanel } from './components/ReportNotesPanel';
import { MonitorPanel } from './components/MonitorPanel';
import { LoadingOverlay } from './components/common/LoadingSpinner';

function App() {
  const { user, isLoading: authLoading } = useAuth();
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState('terminal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isConnected] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Debug effect to track state changes
  useEffect(() => {
    setDebugInfo({
      user: user ? `${user.first_name} ${user.last_name}` : 'null',
      authLoading,
      currentProject: currentProject ? currentProject.name : 'null',
      timestamp: new Date().toISOString()
    });
  }, [user, authLoading, currentProject]);

  // Add console logs for debugging
  console.log('App render:', { user, authLoading, currentProject });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingOverlay>Loading application...</LoadingOverlay>
        </div>
      </div>
    );
  }

  // Debug panel (remove this in production)
  const DebugPanel = () => (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 text-xs text-white z-50">
      <h3 className="font-bold mb-2">Debug Info:</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );

  // If not authenticated, show auth pages
  if (!user) {
    console.log('Rendering auth routes');
    return (
      <div className="min-h-screen bg-gray-900">
        <DebugPanel />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // If authenticated but no project selected, show project selection
  if (!currentProject) {
    console.log('Rendering project selection');
    return (
      <div className="min-h-screen bg-gray-900">
        <DebugPanel />
        <Routes>
          <Route path="/projects" element={<ProjectSelection />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </div>
    );
  }

  // Main application layout
  const renderMainContent = () => {
    switch (activeTab) {
      case 'terminal':
        return <Terminal isConnected={isConnected} />;
      case 'target':
        return <TargetPanel />;
      case 'history':
        return <HistoryPanel />;
      case 'notes':
        return <ReportNotesPanel />;
      case 'monitor':
        return <MonitorPanel isConnected={isConnected} />;
      default:
        return <Terminal isConnected={isConnected} />;
    }
  };

  console.log('Rendering main app');
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <DebugPanel />
      <Header 
        user={user} 
        currentProject={currentProject} 
        onLogout={() => window.location.href = '/login'} 
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          width={sidebarWidth}
          setWidth={setSidebarWidth}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
      
      <StatusBar
        isConnected={isConnected}
        currentTarget="No target selected"
        testType="None"
      />
    </div>
  );
}

export default App;