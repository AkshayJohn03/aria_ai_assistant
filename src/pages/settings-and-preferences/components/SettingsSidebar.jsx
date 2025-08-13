import React from 'react';
import Icon from '../../../components/AppIcon';

const SettingsSidebar = ({ activeCategory, onCategoryChange, isCollapsed, onToggleCollapse }) => {
  const categories = [
    {
      id: 'appearance',
      label: 'Appearance',
      icon: 'Palette',
      description: 'Theme, fonts, and visual customization'
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: 'Mic',
      description: 'Voice input and output settings'
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: 'Shield',
      description: 'Data storage and security options'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: 'Zap',
      description: 'Speed and resource optimization'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: 'Settings2',
      description: 'Developer and experimental features'
    }
  ];

  return (
    <div className={`bg-surface border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
            <p className="text-sm text-text-secondary">Customize your ARIA experience</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
        >
          <Icon 
            name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
            size={16} 
            className="text-text-secondary"
          />
        </button>
      </div>

      {/* Categories */}
      <nav className="p-4">
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-150 hover:bg-muted group ${
                activeCategory === category.id 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary' :'text-text-primary'
              }`}
              title={isCollapsed ? category.label : undefined}
            >
              <Icon 
                name={category.icon} 
                size={18} 
                className={`${
                  activeCategory === category.id 
                    ? 'text-primary' :'text-text-secondary group-hover:text-text-primary'
                }`}
              />
              {!isCollapsed && (
                <div className="ml-3 text-left">
                  <div className="text-sm font-medium">{category.label}</div>
                  <div className="text-xs text-text-secondary">{category.description}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default SettingsSidebar;