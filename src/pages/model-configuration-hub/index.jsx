import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ModelSelector from './components/ModelSelector';
import TemperatureControl from './components/TemperatureControl';
import CouncilPersonalityEditor from './components/CouncilPersonalityEditor';
import PerformanceMetrics from './components/PerformanceMetrics';
import CustomInstructions from './components/CustomInstructions';
import WebSocketStatus from './components/WebSocketStatus';

const ModelConfigurationHub = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs = [
    { id: 'models', label: 'Models', icon: 'Cpu', component: ModelSelector },
    { id: 'temperature', label: 'Temperature', icon: 'Thermometer', component: TemperatureControl },
    { id: 'personalities', label: 'Personalities', icon: 'Users', component: CouncilPersonalityEditor },
    { id: 'performance', label: 'Performance', icon: 'BarChart3', component: PerformanceMetrics },
    { id: 'instructions', label: 'Instructions', icon: 'FileText', component: CustomInstructions },
    { id: 'connection', label: 'Connection', icon: 'Wifi', component: WebSocketStatus }
  ];

  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmChange) return;
    }
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  const handleSaveAll = () => {
    // Mock save functionality
    console.log('Saving all configurations...');
    setHasUnsavedChanges(false);
  };

  const handleResetAll = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all configurations to default values?');
    if (confirmReset) {
      console.log('Resetting all configurations...');
      setHasUnsavedChanges(false);
    }
  };

  const handleExportConfig = () => {
    // Mock export functionality
    const config = {
      models: {},
      temperature: {},
      personalities: {},
      instructions: {},
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aria-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  Model Configuration Hub
                </h1>
                <p className="text-text-secondary">
                  Configure AI models, personalities, and system parameters for optimal performance
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 text-warning rounded-lg">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm">Unsaved changes</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={handleExportConfig}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Config
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleResetAll}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Reset All
                </Button>
                <Button
                  variant="default"
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

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {ActiveComponent && <ActiveComponent />}
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">Quick Actions</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" iconName="Copy">
                  Copy Current Config
                </Button>
                <Button variant="ghost" size="sm" iconName="Upload">
                  Import Config
                </Button>
                <Button variant="ghost" size="sm" iconName="TestTube">
                  Test Configuration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelConfigurationHub;