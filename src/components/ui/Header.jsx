import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    { label: 'Chat', path: '/main-chat-interface', icon: 'MessageSquare' },
    { label: 'Council', path: '/council-deliberation-view', icon: 'Users' },
    { label: 'Documents', path: '/document-upload-and-analysis', icon: 'FileText' },
    { label: 'Sessions', path: '/session-management-dashboard', icon: 'History' },
  ];

  const secondaryNavItems = [
    { label: 'Models', path: '/model-configuration-hub', icon: 'Settings' },
    { label: 'Settings', path: '/settings-and-preferences', icon: 'Cog' },
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Bot" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">ARIA</span>
              <span className="text-xs text-text-secondary -mt-1">AI Assistant</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems.map((item) => (
            <Button
              key={item.path}
              variant={isActivePath(item.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="px-3 py-2"
            >
              {item.label}
            </Button>
          ))}
          
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              iconName="MoreHorizontal"
              iconSize={16}
              className="px-3 py-2"
            >
              More
            </Button>
            
            {isMoreMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-medium z-150">
                <div className="py-1">
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        handleNavigation(item.path);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted ${
                        isActivePath(item.path) 
                          ? 'bg-primary/10 text-primary' :'text-text-primary'
                      }`}
                    >
                      <Icon name={item.icon} size={16} className="mr-3" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            iconName="Menu"
            iconSize={20}
          />
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Bell"
            iconSize={16}
            className="px-2"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="User"
            iconSize={16}
            className="px-2"
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMoreMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-popover border-b border-border shadow-medium z-150">
          <div className="py-2">
            {[...primaryNavItems, ...secondaryNavItems].map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  handleNavigation(item.path);
                  setIsMoreMenuOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-sm transition-colors duration-150 hover:bg-muted ${
                  isActivePath(item.path) 
                    ? 'bg-primary/10 text-primary border-r-2 border-primary' :'text-text-primary'
                }`}
              >
                <Icon name={item.icon} size={16} className="mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;