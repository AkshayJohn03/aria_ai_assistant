import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemperatureControl = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [isLivePreview, setIsLivePreview] = useState(true);

  const presetValues = [
    { value: 0.1, label: 'Precise', description: 'Deterministic, factual responses' },
    { value: 0.4, label: 'Balanced', description: 'Good mix of accuracy and creativity' },
    { value: 0.7, label: 'Creative', description: 'More varied and creative outputs' },
    { value: 1.0, label: 'Diverse', description: 'Highly creative and unpredictable' },
    { value: 1.5, label: 'Wild', description: 'Very experimental responses' },
    { value: 2.0, label: 'Chaos', description: 'Maximum randomness and creativity' }
  ];

  const getTemperatureDescription = (temp) => {
    if (temp <= 0.2) return 'Highly deterministic responses with minimal variation';
    if (temp <= 0.5) return 'Balanced responses with some creative variation';
    if (temp <= 0.8) return 'Creative responses with good coherence';
    if (temp <= 1.2) return 'Highly creative with increased unpredictability';
    if (temp <= 1.6) return 'Very experimental with significant variation';
    return 'Maximum creativity with high unpredictability';
  };

  const getTemperatureColor = (temp) => {
    if (temp <= 0.3) return 'text-blue-600';
    if (temp <= 0.6) return 'text-green-600';
    if (temp <= 1.0) return 'text-yellow-600';
    if (temp <= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTemperatureIcon = (temp) => {
    if (temp <= 0.3) return 'Snowflake';
    if (temp <= 0.6) return 'Leaf';
    if (temp <= 1.0) return 'Sun';
    if (temp <= 1.5) return 'Flame';
    return 'Zap';
  };

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setTemperature(value);
  };

  const handlePresetClick = (value) => {
    setTemperature(value);
  };

  const sampleResponses = {
    0.1: "The capital of France is Paris. It is located in the north-central part of the country.",
    0.4: "Paris, the elegant capital of France, sits gracefully along the Seine River in the country's heart.",
    0.7: "Ah, Paris! The City of Light beckons with its romantic boulevards and timeless charm as France's captivating capital.",
    1.0: "Paris dances as France's crown jewel, where cobblestone dreams meet café whispers in the nation's beating heart.",
    1.5: "In the tapestry of France, Paris blooms like a midnight rose, weaving stories through ancient stones and modern souls.",
    2.0: "Paris? A symphony of forgotten umbrellas and dancing streetlights, where France's soul pirouettes through time's kaleidoscope!"
  };

  const getCurrentSample = () => {
    const closest = Object.keys(sampleResponses).reduce((prev, curr) => 
      Math.abs(curr - temperature) < Math.abs(prev - temperature) ? curr : prev
    );
    return sampleResponses[closest];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Thermometer" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Temperature Control</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isLivePreview ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLivePreview(!isLivePreview)}
            iconName="Eye"
            iconPosition="left"
          >
            Live Preview
          </Button>
        </div>
      </div>

      {/* Current Temperature Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Icon 
            name={getTemperatureIcon(temperature)} 
            size={24} 
            className={getTemperatureColor(temperature)}
          />
          <span className={`text-3xl font-bold ${getTemperatureColor(temperature)}`}>
            {temperature.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          {getTemperatureDescription(temperature)}
        </p>
      </div>

      {/* Temperature Slider */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={temperature}
            onChange={handleSliderChange}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                #3b82f6 0%, 
                #10b981 25%, 
                #f59e0b 50%, 
                #f97316 75%, 
                #ef4444 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-text-secondary mt-2">
            <span>0.1</span>
            <span>0.5</span>
            <span>1.0</span>
            <span>1.5</span>
            <span>2.0</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {presetValues.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`p-3 rounded-lg border text-left transition-all duration-200 hover:shadow-sm ${
              Math.abs(temperature - preset.value) < 0.05
                ? 'border-primary bg-primary/5' :'border-border bg-surface hover:border-border/80'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-text-primary">{preset.label}</span>
              <span className="text-xs text-text-secondary">{preset.value}</span>
            </div>
            <p className="text-xs text-text-secondary">{preset.description}</p>
          </button>
        ))}
      </div>

      {/* Live Preview */}
      {isLivePreview && (
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="MessageSquare" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Response Preview</span>
            <span className="text-xs text-text-secondary">
              (Temperature: {temperature.toFixed(1)})
            </span>
          </div>
          <div className="p-3 bg-surface rounded border border-border">
            <p className="text-sm text-text-primary italic">
              "What is the capital of France?"
            </p>
            <div className="mt-2 p-2 bg-primary/5 rounded">
              <p className="text-sm text-text-primary">
                {getCurrentSample()}
              </p>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            This preview shows how temperature affects response creativity and variation.
          </p>
        </div>
      )}

      {/* Advanced Controls */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">Advanced Controls</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" iconName="RotateCcw">
              Reset
            </Button>
            <Button variant="ghost" size="sm" iconName="Save">
              Save Preset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureControl;