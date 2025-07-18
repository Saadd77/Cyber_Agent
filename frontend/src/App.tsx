import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { DebugPanel } from './components/DebugPanel';

function App() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { currentProject, clearCurrentProject } = useProject();
  const [activeTab, setActiveTab] = useState('terminal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isConnected] = useState(true);
  const location = useLocation();

  // Debug effect to track state changes
  useEffect(() => {
    console.log('App state:', {
      user: user ? `${user.first_name} ${user.last_name}` : 'null',
      authLoading,
      currentProject: currentProject ? currentProject.name : 'null',
      location: location.pathname
    });
  }, [user, authLoading, currentProject, location]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingOverlay>Loading application...</LoadingOverlay>
      </div>
    );
  }

  // Handle logout properly
  const handleLogout = () => {
    logout();
    if (clearCurrentProject) {
      clearCurrentProject();
    }
  };

  // Main application layout component
  const MainApp = () => {
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

    return (
      <div className="h-screen flex flex-col bg-gray-900">
        <Header 
          user={user!} 
          currentProject={currentProject} 
          onLogout={handleLogout} 
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
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Debug Panel - always available */}
      <DebugPanel />
      
      <Routes>
        {/* Public routes - always accessible */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Protected routes - require authentication */}
        {user ? (
          <>
            <Route path="/projects" element={<ProjectSelection />} />
            
            {/* Main app routes - require both user and project */}
            {currentProject ? (
              <>
                <Route path="/" element={<MainApp />} />
                <Route path="/terminal" element={<Navigate to="/" replace />} />
                <Route path="/target" element={<Navigate to="/" replace />} />
                <Route path="/history" element={<Navigate to="/" replace />} />
                <Route path="/notes" element={<Navigate to="/" replace />} />
                <Route path="/monitor" element={<Navigate to="/" replace />} />
              </>
            ) : (
              // If user but no project, redirect to project selection
              <Route path="*" element={<Navigate to="/projects" replace />} />
            )}
          </>
        ) : (
          // If no user, redirect to login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;