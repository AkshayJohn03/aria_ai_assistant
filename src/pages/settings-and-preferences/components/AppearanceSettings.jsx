import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AppearanceSettings = () => {
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState(14);
  const [customCSS, setCustomCSS] = useState('');
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: 'Sun', description: 'Clean and bright interface' },
    { id: 'dark', label: 'Dark', icon: 'Moon', description: 'Easy on the eyes' },
    { id: 'system', label: 'System', icon: 'Monitor', description: 'Follow system preference' }
  ];

  const fontSizes = [
    { value: 12, label: 'Small' },
    { value: 14, label: 'Medium' },
    { value: 16, label: 'Large' },
    { value: 18, label: 'Extra Large' }
  ];

  const defaultCustomCSS = `/* Custom AI Personality Styles */
.ai-mythomax {
  border-left: 3px solid #8B5CF6;
  background: linear-gradient(90deg, #8B5CF6/10, transparent);
}

.ai-deepseek {
  border-left: 3px solid #10B981;
  background: linear-gradient(90deg, #10B981/10, transparent);
}

.ai-darkchampion {
  border-left: 3px solid #EF4444;
  background: linear-gradient(90deg, #EF4444/10, transparent);
}`;

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('aria-theme') || 'system';
    const savedFontSize = parseInt(localStorage.getItem('aria-font-size')) || 14;
    const savedCustomCSS = localStorage.getItem('aria-custom-css') || defaultCustomCSS;
    const savedAnimations = localStorage.getItem('aria-animations') !== 'false';
    const savedCompactMode = localStorage.getItem('aria-compact-mode') === 'true';

    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setCustomCSS(savedCustomCSS);
    setEnableAnimations(savedAnimations);
    setCompactMode(savedCompactMode);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('aria-theme', newTheme);
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem('aria-font-size', newSize.toString());
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const handleCustomCSSChange = (css) => {
    setCustomCSS(css);
    localStorage.setItem('aria-custom-css', css);
  };

  const resetToDefaults = () => {
    setTheme('system');
    setFontSize(14);
    setCustomCSS(defaultCustomCSS);
    setEnableAnimations(true);
    setCompactMode(false);
    
    localStorage.removeItem('aria-theme');
    localStorage.removeItem('aria-font-size');
    localStorage.removeItem('aria-custom-css');
    localStorage.removeItem('aria-animations');
    localStorage.removeItem('aria-compact-mode');
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Theme</h3>
        <p className="text-sm text-text-secondary mb-4">Choose your preferred color scheme</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              className={`p-4 border rounded-lg transition-all duration-150 hover:border-primary/50 ${
                theme === option.id 
                  ? 'border-primary bg-primary/5' :'border-border bg-surface'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={option.icon} 
                  size={20} 
                  className={theme === option.id ? 'text-primary' : 'text-text-secondary'}
                />
                <div className="text-left">
                  <div className="font-medium text-text-primary">{option.label}</div>
                  <div className="text-xs text-text-secondary">{option.description}</div>
                </div>
              </div>
              {theme === option.id && (
                <Icon name="Check" size={16} className="text-primary mt-2" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Font Size</h3>
        <p className="text-sm text-text-secondary mb-4">Adjust text size for better readability</p>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-text-secondary">A</span>
          <input
            type="range"
            min="12"
            max="18"
            step="2"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-lg text-text-secondary">A</span>
          <span className="text-sm font-medium text-text-primary min-w-[60px]">
            {fontSizes.find(f => f.value === fontSize)?.label}
          </span>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p style={{ fontSize: `${fontSize}px` }} className="text-text-primary">
            Preview: This is how your text will appear in the application.
          </p>
        </div>
      </div>

      {/* Interface Options */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Interface Options</h3>
        <p className="text-sm text-text-secondary mb-4">Customize interface behavior</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable animations"
            description="Show smooth transitions and loading animations"
            checked={enableAnimations}
            onChange={(e) => {
              setEnableAnimations(e.target.checked);
              localStorage.setItem('aria-animations', e.target.checked.toString());
            }}
          />
          
          <Checkbox
            label="Compact mode"
            description="Reduce spacing for more content on screen"
            checked={compactMode}
            onChange={(e) => {
              setCompactMode(e.target.checked);
              localStorage.setItem('aria-compact-mode', e.target.checked.toString());
            }}
          />
        </div>
      </div>

      {/* Custom CSS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-text-primary">Custom Styling</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomEditor(!showCustomEditor)}
            iconName={showCustomEditor ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showCustomEditor ? 'Hide Editor' : 'Show Editor'}
          </Button>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Customize AI personality styles and interface elements
        </p>
        
        {showCustomEditor && (
          <div className="space-y-4">
            <textarea
              value={customCSS}
              onChange={(e) => handleCustomCSSChange(e.target.value)}
              className="w-full h-64 p-4 bg-muted border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your custom CSS here..."
            />
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomCSS(defaultCustomCSS)}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Reset to Default
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={() => handleCustomCSSChange(customCSS)}
                iconName="Check"
                iconPosition="left"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Section */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Reset Appearance</h3>
            <p className="text-sm text-text-secondary">Restore all appearance settings to defaults</p>
          </div>
          <Button
            variant="outline"
            onClick={resetToDefaults}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;