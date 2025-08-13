import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WebSocketStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastPing, setLastPing] = useState(Date.now());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isAutoReconnect, setIsAutoReconnect] = useState(true);
  const [connectionHistory, setConnectionHistory] = useState([]);

  const connectionStates = {
    connected: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: 'Wifi',
      label: 'Connected',
      description: 'WebSocket connection is active and healthy'
    },
    connecting: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'Loader',
      label: 'Connecting',
      description: 'Establishing connection to Ollama backend'
    },
    disconnected: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      icon: 'WifiOff',
      label: 'Disconnected',
      description: 'Connection to Ollama backend lost'
    },
    reconnecting: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'RotateCw',
      label: 'Reconnecting',
      description: 'Attempting to restore connection'
    }
  };

  const ollamaModels = [
    {
      name: 'aria-gemma3-1b:latest',
      status: 'running',
      lastResponse: Date.now() - 2000,
      responseTime: 850
    },
    {
      name: 'gemma3:1b',
      status: 'running',
      lastResponse: Date.now() - 5000,
      responseTime: 1200
    },
    {
      name: 'HammerAI/openhermes-2.5-mistral:latest',
      status: 'idle',
      lastResponse: Date.now() - 300000,
      responseTime: 2100
    }
  ];

  const [modelStatuses, setModelStatuses] = useState(ollamaModels);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const random = Math.random();
      if (random < 0.05 && connectionStatus === 'connected') {
        setConnectionStatus('disconnected');
        setConnectionHistory(prev => [...prev, {
          timestamp: Date.now(),
          event: 'disconnected',
          reason: 'Network timeout'
        }]);
      } else if (random < 0.1 && connectionStatus === 'disconnected') {
        setConnectionStatus('reconnecting');
        setReconnectAttempts(prev => prev + 1);
      } else if (connectionStatus === 'reconnecting') {
        setConnectionStatus('connected');
        setConnectionHistory(prev => [...prev, {
          timestamp: Date.now(),
          event: 'reconnected',
          reason: 'Connection restored'
        }]);
        setReconnectAttempts(0);
      }

      // Update ping
      if (connectionStatus === 'connected') {
        setLastPing(Date.now());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  // Update model statuses
  useEffect(() => {
    const interval = setInterval(() => {
      setModelStatuses(prev => prev.map(model => ({
        ...model,
        responseTime: model.status === 'running' 
          ? Math.floor(Math.random() * 1000) + 500 
          : model.responseTime,
        lastResponse: model.status === 'running' 
          ? Date.now() - Math.floor(Math.random() * 10000)
          : model.lastResponse
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleManualReconnect = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setConnectionHistory(prev => [...prev, {
        timestamp: Date.now(),
        event: 'manual_reconnect',
        reason: 'User initiated reconnection'
      }]);
    }, 2000);
  };

  const handleToggleAutoReconnect = () => {
    setIsAutoReconnect(!isAutoReconnect);
  };

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-success';
      case 'idle': return 'text-warning';
      case 'stopped': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getModelStatusIcon = (status) => {
    switch (status) {
      case 'running': return 'Play';
      case 'idle': return 'Pause';
      case 'stopped': return 'Square';
      default: return 'Circle';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    const diff = Date.now() - timestamp;
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const currentState = connectionStates[connectionStatus];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Wifi" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">WebSocket Status</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isAutoReconnect ? "default" : "outline"}
            size="sm"
            onClick={handleToggleAutoReconnect}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Auto Reconnect
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg ${currentState.bgColor} mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon 
              name={currentState.icon} 
              size={24} 
              className={`${currentState.color} ${
                connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ?'animate-spin' :''
              }`}
            />
            <div>
              <h3 className={`font-semibold ${currentState.color}`}>
                {currentState.label}
              </h3>
              <p className="text-sm text-text-secondary">
                {currentState.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-text-primary">
              Last Ping: {formatTimestamp(lastPing)}
            </div>
            {reconnectAttempts > 0 && (
              <div className="text-xs text-text-secondary">
                Attempts: {reconnectAttempts}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Controls */}
      <div className="flex items-center space-x-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualReconnect}
          disabled={connectionStatus === 'connecting' || connectionStatus === 'reconnecting'}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Reconnect
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          iconPosition="left"
        >
          Connection Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconName="Activity"
          iconPosition="left"
        >
          View Logs
        </Button>
      </div>

      {/* Model Status */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-text-primary mb-3">Ollama Model Status</h3>
        <div className="space-y-3">
          {modelStatuses.map((model) => (
            <div
              key={model.name}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getModelStatusIcon(model.status)} 
                  size={16} 
                  className={getModelStatusColor(model.status)}
                />
                <div>
                  <span className="font-medium text-text-primary">{model.name}</span>
                  <div className="text-xs text-text-secondary capitalize">
                    {model.status}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-text-secondary">
                {model.responseTime && (
                  <div>Response: {model.responseTime}ms</div>
                )}
                <div>Last: {formatTimestamp(model.lastResponse)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection History */}
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3">Recent Events</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {connectionHistory.slice(-5).reverse().map((event, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={event.event === 'disconnected' ? 'AlertCircle' : 'CheckCircle'} 
                  size={12} 
                  className={event.event === 'disconnected' ? 'text-error' : 'text-success'}
                />
                <span className="text-text-primary capitalize">
                  {event.event.replace('_', ' ')}
                </span>
                <span className="text-text-secondary">- {event.reason}</span>
              </div>
              <span className="text-text-secondary">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {connectionHistory.length === 0 && (
            <div className="text-xs text-text-secondary text-center py-2">
              No recent events
            </div>
          )}
        </div>
      </div>

      {/* Connection Info */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-primary">Connection Information</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary">
          <div>
            <span className="font-medium">Endpoint:</span>
            <div>ws://localhost:11434/api/chat</div>
          </div>
          <div>
            <span className="font-medium">Protocol:</span>
            <div>WebSocket</div>
          </div>
          <div>
            <span className="font-medium">Timeout:</span>
            <div>30 seconds</div>
          </div>
          <div>
            <span className="font-medium">Retry Interval:</span>
            <div>5 seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketStatus;