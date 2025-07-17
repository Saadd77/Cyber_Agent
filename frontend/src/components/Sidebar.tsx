import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Target, History, FileText, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  width: number;
  setWidth: (width: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed, 
  width, 
  setWidth 
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const menuItems = [
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'target', label: 'Target', icon: Target },
    { id: 'history', label: 'History', icon: History },
    { id: 'notes', label: 'Report Notes', icon: FileText },
    { id: 'monitor', label: 'Monitor', icon: Activity },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 400) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <aside 
      ref={sidebarRef}
      className="bg-gray-800 border-r border-gray-700 relative flex-shrink-0 transition-all duration-300"
      style={{ width: collapsed ? '60px' : `${width}px` }}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-2 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-300" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-300" />
        )}
      </button>

      <nav className="p-4 pt-16">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  'w-full flex items-center rounded-lg transition-all duration-200 relative group',
                  collapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3',
                  activeTab === item.id
                    ? 'bg-red-400/20 text-red-400 border border-red-400/30'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Resize Handle */}
      {!collapsed && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-red-400/50 transition-colors"
          onMouseDown={handleMouseDown}
        />
      )}
    </aside>
  );
};