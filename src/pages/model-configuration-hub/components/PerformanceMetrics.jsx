import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState('response-time');
  const [timeRange, setTimeRange] = useState('1h');
  const [isRealTime, setIsRealTime] = useState(true);

  // Mock performance data
  const responseTimeData = [
    { time: '14:45', value: 0.8, model: 'Qwen2.5' },
    { time: '14:46', value: 1.2, model: 'DeepSeek' },
    { time: '14:47', value: 0.9, model: 'Qwen2.5' },
    { time: '14:48', value: 2.1, model: 'MythoMax' },
    { time: '14:49', value: 1.1, model: 'Qwen2.5' },
    { time: '14:50', value: 1.5, model: 'DeepSeek' },
    { time: '14:51', value: 0.7, model: 'Qwen2.5' },
    { time: '14:52', value: 1.8, model: 'MythoMax' }
  ];

  const memoryUsageData = [
    { time: '14:45', qwen: 6.2, deepseek: 6.8, mythomax: 12.1 },
    { time: '14:46', qwen: 6.3, deepseek: 7.1, mythomax: 12.3 },
    { time: '14:47', qwen: 6.1, deepseek: 6.9, mythomax: 12.0 },
    { time: '14:48', qwen: 6.4, deepseek: 7.2, mythomax: 12.5 },
    { time: '14:49', qwen: 6.2, deepseek: 7.0, mythomax: 12.2 },
    { time: '14:50', qwen: 6.5, deepseek: 7.3, mythomax: 12.4 },
    { time: '14:51', qwen: 6.3, deepseek: 7.1, mythomax: 12.1 },
    { time: '14:52', qwen: 6.4, deepseek: 7.2, mythomax: 12.3 }
  ];

  const tokenUsageData = [
    { model: 'Qwen2.5', input: 15420, output: 8930, total: 24350 },
    { model: 'DeepSeek R1', input: 12340, output: 7650, total: 19990 },
    { model: 'MythoMax', input: 8760, output: 5420, total: 14180 },
    { model: 'Dark Champion', input: 3210, output: 1890, total: 5100 }
  ];

  const currentMetrics = {
    'response-time': {
      title: 'Response Time',
      unit: 'seconds',
      current: '1.2s',
      trend: '+0.1s',
      trendDirection: 'up',
      data: responseTimeData
    },
    'memory-usage': {
      title: 'Memory Usage',
      unit: 'GB',
      current: '25.9 GB',
      trend: '+2.1 GB',
      trendDirection: 'up',
      data: memoryUsageData
    },
    'token-usage': {
      title: 'Token Usage',
      unit: 'tokens',
      current: '63.6K',
      trend: '+5.2K',
      trendDirection: 'up',
      data: tokenUsageData
    }
  };

  const systemStats = [
    {
      label: 'Active Models',
      value: '2/4',
      icon: 'Cpu',
      color: 'text-success',
      description: 'Models currently running'
    },
    {
      label: 'Cache Hit Rate',
      value: '87.3%',
      icon: 'Database',
      color: 'text-success',
      description: 'Percentage of cached responses'
    },
    {
      label: 'Avg Response Time',
      value: '1.2s',
      icon: 'Clock',
      color: 'text-warning',
      description: 'Average across all models'
    },
    {
      label: 'Total Memory',
      value: '25.9 GB',
      icon: 'HardDrive',
      color: 'text-error',
      description: 'Combined model memory usage'
    }
  ];

  const metricOptions = [
    { id: 'response-time', label: 'Response Time', icon: 'Clock' },
    { id: 'memory-usage', label: 'Memory Usage', icon: 'HardDrive' },
    { id: 'token-usage', label: 'Token Usage', icon: 'Hash' }
  ];

  const timeRangeOptions = [
    { id: '1h', label: '1 Hour' },
    { id: '6h', label: '6 Hours' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      // This would update with real data from WebSocket
      console.log('Updating metrics...');
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const renderChart = () => {
    const metric = currentMetrics[selectedMetric];
    
    if (selectedMetric === 'token-usage') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metric.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="model" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="input" fill="#3b82f6" name="Input Tokens" />
            <Bar dataKey="output" fill="#10b981" name="Output Tokens" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (selectedMetric === 'memory-usage') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metric.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="qwen" stroke="#3b82f6" name="Qwen2.5" strokeWidth={2} />
            <Line type="monotone" dataKey="deepseek" stroke="#10b981" name="DeepSeek" strokeWidth={2} />
            <Line type="monotone" dataKey="mythomax" stroke="#f59e0b" name="MythoMax" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={metric.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Performance Metrics</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isRealTime ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRealTime(!isRealTime)}
            iconName="Activity"
            iconPosition="left"
          >
            Real-time
          </Button>
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>

      {/* System Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {systemStats.map((stat, index) => (
          <div key={index} className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={stat.icon} size={16} className={stat.color} />
              <span className="text-sm font-medium text-text-primary">{stat.label}</span>
            </div>
            <div className="text-xl font-bold text-text-primary mb-1">{stat.value}</div>
            <p className="text-xs text-text-secondary">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Metric Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {metricOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedMetric === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(option.id)}
              iconName={option.icon}
              iconPosition="left"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.id}
              variant={timeRange === option.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Metric Display */}
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {currentMetrics[selectedMetric].title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-text-primary">
                {currentMetrics[selectedMetric].current}
              </span>
              <span className={`text-sm font-medium ${
                currentMetrics[selectedMetric].trendDirection === 'up' ?'text-error' :'text-success'
              }`}>
                {currentMetrics[selectedMetric].trend}
              </span>
              <Icon 
                name={currentMetrics[selectedMetric].trendDirection === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={currentMetrics[selectedMetric].trendDirection === 'up' ? 'text-error' : 'text-success'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        {renderChart()}
      </div>

      {/* Performance Insights */}
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Lightbulb" size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-primary">Performance Insights</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">
            • MythoMax shows higher response times due to its larger model size (13B parameters)
          </p>
          <p className="text-sm text-text-secondary">
            • Memory usage is within acceptable limits, but consider model rotation for optimization
          </p>
          <p className="text-sm text-text-secondary">
            • Cache hit rate of 87.3% indicates good performance optimization
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;