import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedSettings = () => {
  const [debugMode, setDebugMode] = useState(false);
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState('http://localhost:11434');
  const [apiKey, setApiKey] = useState('');
  const [logLevel, setLogLevel] = useState('info');
  const [maxRetries, setMaxRetries] = useState(3);
  const [customHeaders, setCustomHeaders] = useState('');
  const [enableTelemetry, setEnableTelemetry] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [showRawResponses, setShowRawResponses] = useState(false);
  const [customPromptTemplates, setCustomPromptTemplates] = useState('');

  const logLevelOptions = [
    { value: 'error', label: 'Error' },
    { value: 'warn', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'debug', label: 'Debug' },
    { value: 'trace', label: 'Trace' }
  ];

  const defaultPromptTemplates = `{
  "system_instruction": "You are ARIA, an advanced AI assistant. Be helpful, accurate, and concise.",
  "council_introduction": "The AI Council will now deliberate on your query. Each member brings unique expertise:",
  "mythomax_persona": "Strategic thinker focused on long-term implications and creative solutions.",
  "deepseek_persona": "Logical analyst providing data-driven insights and technical accuracy.",
  "darkchampion_persona": "Philosophical advisor offering unconventional perspectives and bold ideas."
}`;

  useEffect(() => {
    // Load advanced settings
    const savedDebug = localStorage.getItem('aria-debug-mode') === 'true';
    const savedExperimental = localStorage.getItem('aria-experimental-features') === 'true';
    const savedEndpoint = localStorage.getItem('aria-custom-endpoint') || 'http://localhost:11434';
    const savedApiKey = localStorage.getItem('aria-api-key') || '';
    const savedLogLevel = localStorage.getItem('aria-log-level') || 'info';
    const savedMaxRetries = parseInt(localStorage.getItem('aria-max-retries')) || 3;
    const savedHeaders = localStorage.getItem('aria-custom-headers') || '';
    const savedTelemetry = localStorage.getItem('aria-enable-telemetry') === 'true';
    const savedDeveloper = localStorage.getItem('aria-developer-mode') === 'true';
    const savedRawResponses = localStorage.getItem('aria-show-raw-responses') === 'true';
    const savedTemplates = localStorage.getItem('aria-custom-prompt-templates') || defaultPromptTemplates;

    setDebugMode(savedDebug);
    setExperimentalFeatures(savedExperimental);
    setCustomEndpoint(savedEndpoint);
    setApiKey(savedApiKey);
    setLogLevel(savedLogLevel);
    setMaxRetries(savedMaxRetries);
    setCustomHeaders(savedHeaders);
    setEnableTelemetry(savedTelemetry);
    setDeveloperMode(savedDeveloper);
    setShowRawResponses(savedRawResponses);
    setCustomPromptTemplates(savedTemplates);
  }, []);

  const saveSetting = (key, value) => {
    localStorage.setItem(`aria-${key}`, value.toString());
  };

  const handleTestConnection = async () => {
    try {
      // Simulate connection test
      const response = await fetch(`${customEndpoint}/api/tags`);
      if (response.ok) {
        alert('Connection successful! Ollama server is reachable.');
      } else {
        alert('Connection failed. Please check the endpoint URL.');
      }
    } catch (error) {
      alert(`Connection error: ${error.message}`);
    }
  };

  const handleExportSettings = () => {
    const settings = {};
    
    // Collect all advanced settings
    for (let key in localStorage) {
      if (key.startsWith('aria-')) {
        settings[key] = localStorage[key];
      }
    }

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aria-advanced-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result);
        
        // Import settings to localStorage
        Object.keys(settings).forEach(key => {
          if (key.startsWith('aria-')) {
            localStorage.setItem(key, settings[key]);
          }
        });

        // Reload settings
        window.location.reload();
      } catch (error) {
        alert('Error importing settings. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAdvanced = () => {
    if (confirm('Are you sure you want to reset all advanced settings to defaults?')) {
      const advancedKeys = [
        'aria-debug-mode',
        'aria-experimental-features',
        'aria-custom-endpoint',
        'aria-api-key',
        'aria-log-level',
        'aria-max-retries',
        'aria-custom-headers',
        'aria-enable-telemetry',
        'aria-developer-mode',
        'aria-show-raw-responses',
        'aria-custom-prompt-templates'
      ];

      advancedKeys.forEach(key => localStorage.removeItem(key));
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* Developer Options */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Developer Options</h3>
        <p className="text-sm text-text-secondary mb-4">Advanced debugging and development features</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable debug mode"
            description="Show detailed logging and debugging information"
            checked={debugMode}
            onChange={(e) => {
              setDebugMode(e.target.checked);
              saveSetting('debug-mode', e.target.checked);
            }}
          />

          <Checkbox
            label="Developer mode"
            description="Enable developer tools and advanced UI options"
            checked={developerMode}
            onChange={(e) => {
              setDeveloperMode(e.target.checked);
              saveSetting('developer-mode', e.target.checked);
            }}
          />

          <Checkbox
            label="Show raw AI responses"
            description="Display unprocessed responses from AI models"
            checked={showRawResponses}
            onChange={(e) => {
              setShowRawResponses(e.target.checked);
              saveSetting('show-raw-responses', e.target.checked);
            }}
          />

          <Select
            label="Log Level"
            description="Control the verbosity of application logs"
            options={logLevelOptions}
            value={logLevel}
            onChange={(value) => {
              setLogLevel(value);
              saveSetting('log-level', value);
            }}
          />
        </div>
      </div>

      {/* Experimental Features */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Experimental Features</h3>
        <p className="text-sm text-text-secondary mb-4">Beta features that may be unstable</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable experimental features"
            description="Access to beta features and experimental functionality"
            checked={experimentalFeatures}
            onChange={(e) => {
              setExperimentalFeatures(e.target.checked);
              saveSetting('experimental-features', e.target.checked);
            }}
          />

          {experimentalFeatures && (
            <div className="ml-6 space-y-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Experimental Features Enabled</span>
              </div>
              <p className="text-xs text-text-secondary">
                These features are in development and may cause instability. Use at your own risk.
              </p>
              
              <div className="space-y-2">
                <Checkbox
                  label="Multi-modal input processing"
                  description="Process images and documents simultaneously"
                 
                  disabled
                />
                <Checkbox
                  label="Advanced council deliberation"
                  description="Enhanced AI model collaboration features"
                 
                  disabled
                />
                <Checkbox
                  label="Real-time model switching"
                  description="Switch AI models mid-conversation"
                 
                  disabled
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">API Configuration</h3>
        <p className="text-sm text-text-secondary mb-4">Custom Ollama server and API settings</p>
        
        <div className="space-y-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                label="Custom Endpoint URL"
                description="Ollama server endpoint (default: http://localhost:11434)"
                type="url"
                value={customEndpoint}
                onChange={(e) => {
                  setCustomEndpoint(e.target.value);
                  saveSetting('custom-endpoint', e.target.value);
                }}
                placeholder="http://localhost:11434"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              iconName="Wifi"
              iconPosition="left"
            >
              Test
            </Button>
          </div>

          <Input
            label="API Key (Optional)"
            description="Authentication key for remote Ollama instances"
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              saveSetting('api-key', e.target.value);
            }}
            placeholder="Enter API key if required"
          />

          <Input
            label="Max Retry Attempts"
            description="Number of times to retry failed requests"
            type="number"
            min="1"
            max="10"
            value={maxRetries}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setMaxRetries(value);
              saveSetting('max-retries', value);
            }}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Custom Headers (JSON)
            </label>
            <textarea
              value={customHeaders}
              onChange={(e) => {
                setCustomHeaders(e.target.value);
                saveSetting('custom-headers', e.target.value);
              }}
              className="w-full h-24 p-3 bg-input border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder='{"Authorization": "Bearer token", "Custom-Header": "value"}'
            />
            <p className="text-xs text-text-secondary mt-1">
              Additional HTTP headers to send with API requests
            </p>
          </div>
        </div>
      </div>

      {/* Custom Prompt Templates */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Custom Prompt Templates</h3>
        <p className="text-sm text-text-secondary mb-4">Customize AI personality prompts and system instructions</p>
        
        <div className="space-y-4">
          <textarea
            value={customPromptTemplates}
            onChange={(e) => {
              setCustomPromptTemplates(e.target.value);
              saveSetting('custom-prompt-templates', e.target.value);
            }}
            className="w-full h-64 p-4 bg-input border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter custom prompt templates in JSON format..."
          />
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomPromptTemplates(defaultPromptTemplates)}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset to Default
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => saveSetting('custom-prompt-templates', customPromptTemplates)}
              iconName="Check"
              iconPosition="left"
            >
              Save Templates
            </Button>
          </div>
        </div>
      </div>

      {/* Telemetry */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Telemetry & Analytics</h3>
        <p className="text-sm text-text-secondary mb-4">Data collection for improvement purposes</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable telemetry"
            description="Send anonymous usage data to help improve ARIA"
            checked={enableTelemetry}
            onChange={(e) => {
              setEnableTelemetry(e.target.checked);
              saveSetting('enable-telemetry', e.target.checked);
            }}
          />

          {enableTelemetry && (
            <div className="ml-6 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-text-primary mb-2">Data Collected:</h4>
              <ul className="text-xs text-text-secondary space-y-1">
                <li>• Feature usage statistics</li>
                <li>• Performance metrics</li>
                <li>• Error reports (no personal data)</li>
                <li>• Model performance data</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Settings Management */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Settings Management</h3>
        <p className="text-sm text-text-secondary mb-4">Export, import, or reset advanced settings</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={handleExportSettings}
            iconName="Download"
            iconPosition="left"
            fullWidth
          >
            Export Settings
          </Button>
          
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-settings').click()}
              iconName="Upload"
              iconPosition="left"
              fullWidth
            >
              Import Settings
            </Button>
          </div>
          
          <Button
            variant="destructive"
            onClick={handleResetAdvanced}
            iconName="RotateCcw"
            iconPosition="left"
            fullWidth
          >
            Reset Advanced
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;