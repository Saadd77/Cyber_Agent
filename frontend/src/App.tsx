import React, { useState } from 'react';
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

  if (authLoading) {
    return <LoadingOverlay>Loading application...</LoadingOverlay>;
  }

  // If not authenticated, show auth pages
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If authenticated but no project selected, show project selection
  if (!currentProject) {
    return (
      <Routes>
        <Route path="/projects" element={<ProjectSelection />} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
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

  return (
    <div className="h-screen flex flex-col bg-gray-900">
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