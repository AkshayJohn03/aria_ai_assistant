import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PerformanceSettings = () => {
  const [responseCaching, setResponseCaching] = useState(true);
  const [preloadModels, setPreloadModels] = useState(false);
  const [maxConcurrentRequests, setMaxConcurrentRequests] = useState(3);
  const [memoryLimit, setMemoryLimit] = useState(2048);
  const [websocketTimeout, setWebsocketTimeout] = useState(30);
  const [enableGPU, setEnableGPU] = useState(false);
  const [streamingResponses, setStreamingResponses] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  
  // Performance metrics
  const [metrics, setMetrics] = useState({
    memoryUsage: 1024,
    cacheSize: 256,
    activeConnections: 1,
    averageResponseTime: 2.3,
    totalRequests: 147,
    cacheHitRate: 78
  });

  const concurrentOptions = [
    { value: '1', label: '1 request' },
    { value: '2', label: '2 requests' },
    { value: '3', label: '3 requests' },
    { value: '5', label: '5 requests' },
    { value: '10', label: '10 requests' }
  ];

  const memoryOptions = [
    { value: '512', label: '512 MB' },
    { value: '1024', label: '1 GB' },
    { value: '2048', label: '2 GB' },
    { value: '4096', label: '4 GB' },
    { value: '8192', label: '8 GB' }
  ];

  const compressionOptions = [
    { value: 'none', label: 'None (Fastest)' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High (Smallest)' }
  ];

  const timeoutOptions = [
    { value: '10', label: '10 seconds' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '1 minute' },
    { value: '120', label: '2 minutes' },
    { value: '300', label: '5 minutes' }
  ];

  useEffect(() => {
    // Load performance settings
    const savedCaching = localStorage.getItem('aria-response-caching') !== 'false';
    const savedPreload = localStorage.getItem('aria-preload-models') === 'true';
    const savedConcurrent = parseInt(localStorage.getItem('aria-max-concurrent')) || 3;
    const savedMemory = parseInt(localStorage.getItem('aria-memory-limit')) || 2048;
    const savedTimeout = parseInt(localStorage.getItem('aria-websocket-timeout')) || 30;
    const savedGPU = localStorage.getItem('aria-enable-gpu') === 'true';
    const savedStreaming = localStorage.getItem('aria-streaming-responses') !== 'false';
    const savedCompression = localStorage.getItem('aria-compression-level') || 'medium';

    setResponseCaching(savedCaching);
    setPreloadModels(savedPreload);
    setMaxConcurrentRequests(savedConcurrent);
    setMemoryLimit(savedMemory);
    setWebsocketTimeout(savedTimeout);
    setEnableGPU(savedGPU);
    setStreamingResponses(savedStreaming);
    setCompressionLevel(savedCompression);

    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.max(512, prev.memoryUsage + (Math.random() - 0.5) * 100),
        averageResponseTime: Math.max(0.5, prev.averageResponseTime + (Math.random() - 0.5) * 0.5),
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 3),
        cacheHitRate: Math.min(100, Math.max(0, prev.cacheHitRate + (Math.random() - 0.5) * 5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const saveSetting = (key, value) => {
    localStorage.setItem(`aria-${key}`, value.toString());
  };

  const handleClearCache = () => {
    // Clear response cache
    const keysToRemove = [];
    for (let key in localStorage) {
      if (key.startsWith('aria-cache-')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setMetrics(prev => ({ ...prev, cacheSize: 0, cacheHitRate: 0 }));
    alert('Response cache cleared successfully!');
  };

  const handleOptimizePerformance = () => {
    // Apply optimal settings
    setResponseCaching(true);
    setPreloadModels(false);
    setMaxConcurrentRequests(3);
    setStreamingResponses(true);
    setCompressionLevel('medium');
    
    saveSetting('response-caching', true);
    saveSetting('preload-models', false);
    saveSetting('max-concurrent', 3);
    saveSetting('streaming-responses', true);
    saveSetting('compression-level', 'medium');
    
    alert('Performance settings optimized!');
  };

  const getMemoryUsageColor = () => {
    const percentage = (metrics.memoryUsage / memoryLimit) * 100;
    if (percentage > 80) return 'text-destructive';
    if (percentage > 60) return 'text-warning';
    return 'text-success';
  };

  const getResponseTimeColor = () => {
    if (metrics.averageResponseTime > 5) return 'text-destructive';
    if (metrics.averageResponseTime > 3) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Performance Metrics</h3>
        <p className="text-sm text-text-secondary mb-4">Real-time system performance indicators</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Cpu" size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">Memory Usage</span>
            </div>
            <p className={`text-lg font-semibold ${getMemoryUsageColor()}`}>
              {Math.round(metrics.memoryUsage)} MB
            </p>
            <p className="text-xs text-text-secondary">
              {Math.round((metrics.memoryUsage / memoryLimit) * 100)}% of {memoryLimit} MB limit
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">Avg Response Time</span>
            </div>
            <p className={`text-lg font-semibold ${getResponseTimeColor()}`}>
              {metrics.averageResponseTime.toFixed(1)}s
            </p>
            <p className="text-xs text-text-secondary">
              {metrics.totalRequests} total requests
            </p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Database" size={16} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">Cache Hit Rate</span>
            </div>
            <p className="text-lg font-semibold text-success">
              {Math.round(metrics.cacheHitRate)}%
            </p>
            <p className="text-xs text-text-secondary">
              {metrics.cacheSize} MB cached
            </p>
          </div>
        </div>
      </div>

      {/* Response Optimization */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Response Optimization</h3>
        <p className="text-sm text-text-secondary mb-4">Configure response caching and delivery</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Enable response caching"
            description="Cache AI responses to improve performance for similar queries"
            checked={responseCaching}
            onChange={(e) => {
              setResponseCaching(e.target.checked);
              saveSetting('response-caching', e.target.checked);
            }}
          />

          <Checkbox
            label="Enable streaming responses"
            description="Display AI responses as they are generated for faster perceived performance"
            checked={streamingResponses}
            onChange={(e) => {
              setStreamingResponses(e.target.checked);
              saveSetting('streaming-responses', e.target.checked);
            }}
          />

          <Select
            label="Response Compression"
            description="Compress responses to reduce bandwidth usage"
            options={compressionOptions}
            value={compressionLevel}
            onChange={(value) => {
              setCompressionLevel(value);
              saveSetting('compression-level', value);
            }}
          />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              iconName="Trash2"
              iconPosition="left"
            >
              Clear Cache
            </Button>
            <span className="text-xs text-text-secondary">
              Frees up {metrics.cacheSize} MB of storage
            </span>
          </div>
        </div>
      </div>

      {/* Connection Settings */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Connection Settings</h3>
        <p className="text-sm text-text-secondary mb-4">WebSocket and request configuration</p>
        
        <div className="space-y-4">
          <Select
            label="Max Concurrent Requests"
            description="Maximum number of simultaneous AI model requests"
            options={concurrentOptions}
            value={maxConcurrentRequests.toString()}
            onChange={(value) => {
              const numValue = parseInt(value);
              setMaxConcurrentRequests(numValue);
              saveSetting('max-concurrent', numValue);
            }}
          />

          <Select
            label="WebSocket Timeout"
            description="How long to wait for AI model responses"
            options={timeoutOptions}
            value={websocketTimeout.toString()}
            onChange={(value) => {
              const numValue = parseInt(value);
              setWebsocketTimeout(numValue);
              saveSetting('websocket-timeout', numValue);
            }}
          />

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Wifi" size={16} className="text-success" />
              <span className="text-sm font-medium text-text-primary">Connection Status</span>
            </div>
            <p className="text-sm text-success">Connected to Ollama</p>
            <p className="text-xs text-text-secondary">
              {metrics.activeConnections} active WebSocket connection(s)
            </p>
          </div>
        </div>
      </div>

      {/* Resource Management */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Resource Management</h3>
        <p className="text-sm text-text-secondary mb-4">Control system resource usage</p>
        
        <div className="space-y-4">
          <Select
            label="Memory Limit"
            description="Maximum memory allocation for AI processing"
            options={memoryOptions}
            value={memoryLimit.toString()}
            onChange={(value) => {
              const numValue = parseInt(value);
              setMemoryLimit(numValue);
              saveSetting('memory-limit', numValue);
            }}
          />

          <Checkbox
            label="Preload AI models"
            description="Keep frequently used models in memory for faster responses"
            checked={preloadModels}
            onChange={(e) => {
              setPreloadModels(e.target.checked);
              saveSetting('preload-models', e.target.checked);
            }}
          />

          <Checkbox
            label="Enable GPU acceleration"
            description="Use GPU for faster AI model processing (requires compatible hardware)"
            checked={enableGPU}
            onChange={(e) => {
              setEnableGPU(e.target.checked);
              saveSetting('enable-gpu', e.target.checked);
            }}
          />
        </div>
      </div>

      {/* Performance Actions */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Performance Optimization</h3>
            <p className="text-sm text-text-secondary">Apply recommended settings for optimal performance</p>
          </div>
          <Button
            variant="default"
            onClick={handleOptimizePerformance}
            iconName="Zap"
            iconPosition="left"
          >
            Optimize Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSettings;