import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelSelector = () => {
  const [selectedModel, setSelectedModel] = useState('aria-gemma3-1b:latest');

  const models = [
    {
      id: 'aria-gemma3-1b:latest',
      name: 'aria-gemma3-1b:latest',
      description: 'Local Ollama model',
      status: 'active',
      size: '815 MB',
      responseTime: '0.8s',
      memoryUsage: 'N/A',
      isDownloaded: true,
      capabilities: ['Text Generation', 'Code', 'Reasoning']
    },
    {
      id: 'gemma3:1b',
      name: 'gemma3:1b',
      description: 'Local Ollama model',
      status: 'active',
      size: '815 MB',
      responseTime: '1.0s',
      memoryUsage: 'N/A',
      isDownloaded: true,
      capabilities: ['Text Generation']
    },
    {
      id: 'HammerAI/openhermes-2.5-mistral:latest',
      name: 'HammerAI/openhermes-2.5-mistral:latest',
      description: 'Local Ollama model',
      status: 'inactive',
      size: '4.4 GB',
      responseTime: '2.1s',
      memoryUsage: 'N/A',
      isDownloaded: true,
      capabilities: ['Conversation', 'General']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'inactive': return 'text-text-secondary';
      case 'loading': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'inactive': return 'Circle';
      case 'loading': return 'Loader';
      default: return 'Circle';
    }
  };

  const handleModelToggle = (modelId) => {
    // Mock toggle functionality
    console.log(`Toggling model: ${modelId}`);
  };

  const handleModelDownload = (modelId) => {
    // Mock download functionality
    console.log(`Downloading model: ${modelId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Cpu" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Model Selector</h2>
        </div>
        <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
              selectedModel === model.id
                ? 'border-primary bg-primary/5' :'border-border bg-surface hover:border-border/80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <button
                    onClick={() => setSelectedModel(model.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon
                      name={selectedModel === model.id ? 'RadioButtonChecked' : 'RadioButtonUnchecked'}
                      size={16}
                      className={selectedModel === model.id ? 'text-primary' : 'text-text-secondary'}
                    />
                    <h3 className="font-medium text-text-primary">{model.name}</h3>
                  </button>
                  <div className="flex items-center space-x-1">
                    <Icon
                      name={getStatusIcon(model.status)}
                      size={14}
                      className={`${getStatusColor(model.status)} ${
                        model.status === 'loading' ? 'animate-spin' : ''
                      }`}
                    />
                    <span className={`text-xs font-medium capitalize ${getStatusColor(model.status)}`}>
                      {model.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-3">{model.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="text-xs">
                    <span className="text-text-secondary">Size:</span>
                    <span className="ml-1 font-medium text-text-primary">{model.size}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-text-secondary">Response:</span>
                    <span className="ml-1 font-medium text-text-primary">{model.responseTime}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-text-secondary">Memory:</span>
                    <span className="ml-1 font-medium text-text-primary">{model.memoryUsage}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-text-secondary">Status:</span>
                    <span className={`ml-1 font-medium ${model.isDownloaded ? 'text-success' : 'text-warning'}`}>
                      {model.isDownloaded ? 'Downloaded' : 'Not Downloaded'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {model.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-muted text-text-secondary rounded-md"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                {model.isDownloaded ? (
                  <Button
                    variant={model.status === 'active' ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => handleModelToggle(model.id)}
                    iconName={model.status === 'active' ? 'Square' : 'Play'}
                    iconPosition="left"
                  >
                    {model.status === 'active' ? 'Stop' : 'Start'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleModelDownload(model.id)}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Download
                  </Button>
                )}
                <Button variant="ghost" size="sm" iconName="Settings" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-primary">Model Management</span>
        </div>
        <p className="text-xs text-text-secondary">
          Models are managed through Ollama. Ensure Ollama is running and models are properly installed.
          Active models consume system resources even when not in use.
        </p>
      </div>
    </div>
  );
};

export default ModelSelector;