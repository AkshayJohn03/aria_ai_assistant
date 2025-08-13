import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SettingsSidebar from './components/SettingsSidebar';
import AppearanceSettings from './components/AppearanceSettings';
import AudioSettings from './components/AudioSettings';
import PrivacySettings from './components/PrivacySettings';
import PerformanceSettings from './components/PerformanceSettings';
import AdvancedSettings from './components/AdvancedSettings';

const SettingsAndPreferences = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('appearance');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Breadcrumb navigation
  const breadcrumbs = [
    { label: 'ARIA', path: '/main-chat-interface' },
    { label: 'Settings', path: '/settings-and-preferences' }
  ];

  useEffect(() => {
    // Load last active category
    const savedCategory = localStorage.getItem('aria-settings-active-category');
    if (savedCategory) {
      setActiveCategory(savedCategory);
    }

    // Load last saved timestamp
    const savedTimestamp = localStorage.getItem('aria-settings-last-saved');
    if (savedTimestamp) {
      setLastSaved(new Date(savedTimestamp));
    }

    // Listen for storage changes to detect unsaved changes
    const handleStorageChange = () => {
      setHasUnsavedChanges(true);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    localStorage.setItem('aria-settings-active-category', category);
  };

  const handleSaveAll = () => {
    const now = new Date();
    setLastSaved(now);
    setHasUnsavedChanges(false);
    localStorage.setItem('aria-settings-last-saved', now.toISOString());
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-lg z-200';
    notification.textContent = 'Settings saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const renderSettingsContent = () => {
    switch (activeCategory) {
      case 'appearance':
        return <AppearanceSettings />;
      case 'audio':
        return <AudioSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'performance':
        return <PerformanceSettings />;
      case 'advanced':
        return <AdvancedSettings />;
      default:
        return <AppearanceSettings />;
    }
  };

  const getCategoryTitle = () => {
    const titles = {
      appearance: 'Appearance',
      audio: 'Audio Settings',
      privacy: 'Privacy & Data',
      performance: 'Performance',
      advanced: 'Advanced Settings'
    };
    return titles[activeCategory] || 'Settings';
  };

  const getCategoryDescription = () => {
    const descriptions = {
      appearance: 'Customize the visual appearance and theme of your ARIA interface',
      audio: 'Configure microphone input, speech recognition, and voice output settings',
      privacy: 'Manage your data storage, privacy controls, and security preferences',
      performance: 'Optimize response times, caching, and system resource usage',
      advanced: 'Developer options, experimental features, and advanced configuration'
    };
    return descriptions[activeCategory] || 'Configure your ARIA settings';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <div className="ml-60 pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Settings Sidebar */}
          <SettingsSidebar
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content Header */}
            <div className="bg-surface border-b border-border px-6 py-4">
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-3">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <Icon name="ChevronRight" size={14} />}
                    <button
                      onClick={() => window.location.href = crumb.path}
                      className="hover:text-text-primary transition-colors duration-150"
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </nav>

              {/* Page Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary">
                    {getCategoryTitle()}
                  </h1>
                  <p className="text-sm text-text-secondary mt-1">
                    {getCategoryDescription()}
                  </p>
                </div>

                {/* Save Actions */}
                <div className="flex items-center space-x-3">
                  {lastSaved && (
                    <div className="text-xs text-text-secondary">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </div>
                  )}
                  
                  {hasUnsavedChanges && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-xs text-warning">Unsaved changes</span>
                    </div>
                  )}

                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveAll}
                    iconName="Save"
                    iconPosition="left"
                    disabled={!hasUnsavedChanges}
                  >
                    Save All
                  </Button>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 max-w-4xl">
                {renderSettingsContent()}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-surface border-t border-border px-6 py-4">
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Shield" size={14} className="text-success" />
                    <span>All settings stored locally</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Server" size={14} className="text-success" />
                    <span>Connected to Ollama</span>
                  </div>
                </div>
                
                <div className="text-xs">
                  ARIA AI Assistant © {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/20 z-40" />
    </div>
  );
};

export default SettingsAndPreferences;