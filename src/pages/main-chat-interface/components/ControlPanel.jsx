import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ControlPanel = ({ 
  mode, 
  onModeChange, 
  temperature, 
  onTemperatureChange, 
  selectedModel, 
  onModelChange,
  councilStatus,
  systemInstructions,
  onSystemInstructionsChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const models = [
    { id: 'aria-uncensored:latest', name: 'aria-uncensored:latest', description: 'Local Ollama model' },
    { id: 'gemma3:1b', name: 'gemma3:1b', description: 'Local Ollama model' },
    { id: 'HammerAI/openhermes-2.5-mistral:latest', name: 'HammerAI/openhermes-2.5-mistral:latest', description: 'Local Ollama model' }
  ];

  const getModeIcon = (currentMode) => {
    return currentMode === 'fast' ? 'Zap' : 'Users';
  };

  const getModeColor = (currentMode) => {
    return currentMode === 'fast' ? 'text-success' : 'text-accent';
  };

  const getCouncilStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'deliberating': return 'text-warning';
      case 'idle': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Controls</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            className="p-2 lg:hidden"
          />
        </div>
      </div>

      {/* Control Content */}
      <div className={`flex-1 overflow-y-auto ${isExpanded || window.innerWidth >= 1024 ? 'block' : 'hidden lg:block'}`}>
        <div className="p-4 space-y-6">
          {/* Mode Toggle */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Processing Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mode === 'fast' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onModeChange('fast')}
                iconName="Zap"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Fast
              </Button>
              <Button
                variant={mode === 'deep' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onModeChange('deep')}
                iconName="Users"
                iconPosition="left"
                iconSize={14}
                className="justify-start"
              >
                Deep Think
              </Button>
            </div>
            <p className="text-xs text-text-secondary mt-2">
              {mode === 'fast' ?'Quick responses using lightweight models' :'Collaborative thinking with AI council'
              }
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Primary Model
            </label>
            <div className="space-y-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-all duration-150 hover:bg-muted ${
                    selectedModel === model.id 
                      ? 'border-primary bg-primary/5' :'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      selectedModel === model.id ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {model.name}
                    </span>
                    {selectedModel === model.id && (
                      <Icon name="Check" size={14} className="text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    {model.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Slider */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Creativity Level: {temperature}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          {/* Council Status (Deep Think Mode) */}
          {mode === 'deep' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Council Status
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      councilStatus === 'active' ? 'bg-success' :
                      councilStatus === 'deliberating'? 'bg-warning animate-pulse' : 'bg-text-secondary'
                    }`}></div>
                    <span className="text-sm text-text-primary capitalize">
                      {councilStatus}
                    </span>
                  </div>
                  <Icon 
                    name="Users" 
                    size={16} 
                    className={getCouncilStatusColor(councilStatus)}
                  />
                </div>
                
                {councilStatus === 'deliberating' && (
                  <div className="text-xs text-text-secondary p-2 bg-warning/10 rounded border-l-2 border-warning">
                    Council members are analyzing your request...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System Instructions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-text-primary">
                System Instructions
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                iconName={showSystemPrompt ? "ChevronUp" : "ChevronDown"}
                iconSize={14}
                className="p-1"
              />
            </div>
            
            {showSystemPrompt && (
              <div className="space-y-2">
                <textarea
                  value={systemInstructions}
                  onChange={(e) => onSystemInstructionsChange(e.target.value)}
                  placeholder="Enter custom system instructions..."
                  className="w-full p-3 text-sm bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
                  rows={4}
                />
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSystemInstructionsChange('')}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSystemInstructionsChange('You are a helpful, harmless, and honest AI assistant. Provide accurate and thoughtful responses.')}
                    className="text-xs"
                  >
                    Default
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Quick Upload
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/40 transition-colors duration-200">
              <Icon name="Upload" size={24} className="mx-auto mb-2 text-text-secondary" />
              <p className="text-xs text-text-secondary mb-2">
                Drop files here or click to browse
              </p>
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
                iconPosition="left"
                iconSize={14}
                className="text-xs"
              >
                Select Files
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;