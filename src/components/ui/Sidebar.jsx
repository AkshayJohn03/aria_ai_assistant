import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSession, setActiveSession] = useState('Current Session');
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const navigationItems = [
    {
      group: 'Chat Workspace',
      items: [
        { label: 'Main Chat', path: '/main-chat-interface', icon: 'MessageSquare', badge: null },
        { label: 'Council View', path: '/council-deliberation-view', icon: 'Users', badge: '3' },
      ]
    },
    {
      group: 'Tools',
      items: [
        { label: 'Documents', path: '/document-upload-and-analysis', icon: 'FileText', badge: null },
        { label: 'Sessions', path: '/session-management-dashboard', icon: 'History', badge: null },
      ]
    },
    {
      group: 'Configuration',
      items: [
        { label: 'Models', path: '/model-configuration-hub', icon: 'Settings', badge: null },
        { label: 'Preferences', path: '/settings-and-preferences', icon: 'Cog', badge: null },
      ]
    }
  ];

  const recentSessions = [
    'Current Session',
    'Document Analysis - Project Alpha',
    'Model Comparison Study',
    'Research Discussion',
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'Loader';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be replaced with actual WebSocket status monitoring
      setConnectionStatus(prev => prev === 'connected' ? 'connected' : 'connected');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-surface border-r border-border z-100 transition-all duration-300 ease-out ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Bot" size={20} color="white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-text-primary">ARIA</span>
                  <span className="text-xs text-text-secondary -mt-1">AI Assistant</span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              iconSize={16}
              className="p-1"
            />
          </div>

          {/* Session Context */}
          {!isCollapsed && (
            <div className="p-4 border-b border-border">
              <div className="relative">
                <button
                  onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
                  className="w-full flex items-center justify-between p-2 text-sm bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-2">
                    <Icon name="MessageCircle" size={14} />
                    <span className="truncate">{activeSession}</span>
                  </div>
                  <Icon name="ChevronDown" size={14} />
                </button>

                {isSessionDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-medium z-150">
                    <div className="py-1">
                      {recentSessions.map((session, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveSession(session);
                            setIsSessionDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted ${
                            session === activeSession ? 'bg-primary/10 text-primary' : 'text-text-primary'
                          }`}
                        >
                          <div className="truncate">{session}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {navigationItems.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {!isCollapsed && (
                    <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
                      {group.group}
                    </h3>
                  )}
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-150 hover:bg-muted group ${
                          isActivePath(item.path) 
                            ? 'bg-primary/10 text-primary border-r-2 border-primary' :'text-text-primary hover:text-text-primary'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon 
                            name={item.icon} 
                            size={18} 
                            className={isActivePath(item.path) ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}
                          />
                          {!isCollapsed && (
                            <span className="text-sm font-medium">{item.label}</span>
                          )}
                        </div>
                        {!isCollapsed && item.badge && (
                          <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-border">
            <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
              <Icon 
                name={getConnectionStatusIcon()} 
                size={14} 
                className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}
              />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary capitalize">
                    {connectionStatus}
                  </span>
                  <span className="text-xs text-text-secondary">
                    WebSocket Status
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      <div className="lg:hidden fixed inset-0 bg-black/20 z-50" />
    </>
  );
};

export default Sidebar;