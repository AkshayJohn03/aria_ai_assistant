import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CouncilPersonalityEditor = () => {
  const [selectedPersonality, setSelectedPersonality] = useState('mythomax');
  const [isEditing, setIsEditing] = useState(false);

  const personalities = [
    {
      id: 'mythomax',
      name: 'MythoMax',
      role: 'Strategic Thinker',
      color: 'purple',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      description: 'Focuses on creative solutions and strategic planning with innovative approaches.',
      systemPrompt: `You are MythoMax, a strategic thinking AI with a focus on creative problem-solving and innovative approaches. Your responses should be:\n\n- Strategic and forward-thinking\n- Creative and unconventional\n- Solution-oriented with multiple perspectives\n- Encouraging of bold ideas and calculated risks\n\nAlways consider long-term implications and think outside conventional boundaries.`,
      responseStyle: 'creative',
      temperature: 0.8,
      maxTokens: 2048,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      isActive: true
    },
    {
      id: 'deepseek',
      name: 'DeepSeek R1',
      role: 'Logical Analyst',
      color: 'blue',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      description: 'Provides structured analysis and logical reasoning with data-driven insights.',
      systemPrompt: `You are DeepSeek R1, a logical analysis AI specializing in structured reasoning and data-driven insights. Your responses should be:\n\n- Methodical and well-structured\n- Evidence-based and analytical\n- Clear in reasoning and logic\n- Focused on facts and verifiable information\n\nAlways break down complex problems into manageable components and provide step-by-step analysis.`,
      responseStyle: 'analytical',
      temperature: 0.3,
      maxTokens: 2048,
      topP: 0.8,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      isActive: true
    },
    {
      id: 'dark-champion',
      name: 'Dark Champion',
      role: 'Philosophical Critic',
      color: 'red',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      description: 'Challenges assumptions and provides alternative perspectives with philosophical depth.',
      systemPrompt: `You are Dark Champion, a philosophical AI that challenges conventional thinking and explores alternative perspectives. Your responses should be:\n\n- Thought-provoking and challenging\n- Philosophically deep and introspective\n- Critical of assumptions and conventional wisdom\n- Exploring ethical and moral dimensions\n\nAlways question the status quo and present alternative viewpoints that others might overlook.`,
      responseStyle: 'philosophical',
      temperature: 0.9,
      maxTokens: 2048,
      topP: 0.95,
      frequencyPenalty: 0.2,
      presencePenalty: 0.3,
      isActive: false
    }
  ];

  const [personalityData, setPersonalityData] = useState(personalities);

  const selectedPersonalityData = personalityData.find(p => p.id === selectedPersonality);

  const handlePersonalityUpdate = (field, value) => {
    setPersonalityData(prev => prev.map(p => 
      p.id === selectedPersonality 
        ? { ...p, [field]: value }
        : p
    ));
  };

  const handleTogglePersonality = (id) => {
    setPersonalityData(prev => prev.map(p => 
      p.id === id 
        ? { ...p, isActive: !p.isActive }
        : p
    ));
  };

  const getPersonalityColor = (color) => {
    const colors = {
      purple: 'border-purple-500 bg-purple-50',
      blue: 'border-blue-500 bg-blue-50',
      red: 'border-red-500 bg-red-50'
    };
    return colors[color] || 'border-gray-500 bg-gray-50';
  };

  const getPersonalityTextColor = (color) => {
    const colors = {
      purple: 'text-purple-700',
      blue: 'text-blue-700',
      red: 'text-red-700'
    };
    return colors[color] || 'text-gray-700';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Users" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Council Personality Editor</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            iconName="Edit"
            iconPosition="left"
          >
            {isEditing ? 'Save Changes' : 'Edit Mode'}
          </Button>
        </div>
      </div>

      {/* Personality Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {personalityData.map((personality) => (
          <button
            key={personality.id}
            onClick={() => setSelectedPersonality(personality.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedPersonality === personality.id
                ? getPersonalityColor(personality.color)
                : 'border-border bg-surface hover:border-border/80'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={personality.avatar}
                alt={personality.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className={`font-medium ${
                    selectedPersonality === personality.id 
                      ? getPersonalityTextColor(personality.color)
                      : 'text-text-primary'
                  }`}>
                    {personality.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Icon
                      name={personality.isActive ? 'CheckCircle' : 'Circle'}
                      size={12}
                      className={personality.isActive ? 'text-success' : 'text-text-secondary'}
                    />
                  </div>
                </div>
                <p className="text-xs text-text-secondary">{personality.role}</p>
              </div>
            </div>
            <p className="text-xs text-text-secondary">{personality.description}</p>
          </button>
        ))}
      </div>

      {/* Personality Configuration */}
      {selectedPersonalityData && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Personality Name"
              value={selectedPersonalityData.name}
              onChange={(e) => handlePersonalityUpdate('name', e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="Role Description"
              value={selectedPersonalityData.role}
              onChange={(e) => handlePersonalityUpdate('role', e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              System Instructions
            </label>
            <textarea
              value={selectedPersonalityData.systemPrompt}
              onChange={(e) => handlePersonalityUpdate('systemPrompt', e.target.value)}
              disabled={!isEditing}
              rows={8}
              className="w-full p-3 border border-border rounded-lg bg-surface text-text-primary text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
              placeholder="Enter system instructions for this personality..."
            />
            <p className="text-xs text-text-secondary mt-1">
              Define the personality's behavior, response style, and core characteristics.
            </p>
          </div>

          {/* Advanced Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Temperature
              </label>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={selectedPersonalityData.temperature}
                onChange={(e) => handlePersonalityUpdate('temperature', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full"
              />
              <span className="text-xs text-text-secondary">
                {selectedPersonalityData.temperature.toFixed(1)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Top P
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={selectedPersonalityData.topP}
                onChange={(e) => handlePersonalityUpdate('topP', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full"
              />
              <span className="text-xs text-text-secondary">
                {selectedPersonalityData.topP.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Frequency Penalty
              </label>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={selectedPersonalityData.frequencyPenalty}
                onChange={(e) => handlePersonalityUpdate('frequencyPenalty', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full"
              />
              <span className="text-xs text-text-secondary">
                {selectedPersonalityData.frequencyPenalty.toFixed(1)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Presence Penalty
              </label>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={selectedPersonalityData.presencePenalty}
                onChange={(e) => handlePersonalityUpdate('presencePenalty', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full"
              />
              <span className="text-xs text-text-secondary">
                {selectedPersonalityData.presencePenalty.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedPersonalityData.isActive ? "destructive" : "default"}
                size="sm"
                onClick={() => handleTogglePersonality(selectedPersonality)}
                iconName={selectedPersonalityData.isActive ? "UserX" : "UserCheck"}
                iconPosition="left"
              >
                {selectedPersonalityData.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" iconName="RotateCcw">
                Reset to Default
              </Button>
              <Button variant="ghost" size="sm" iconName="Copy">
                Duplicate
              </Button>
              <Button variant="ghost" size="sm" iconName="Download">
                Export Config
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilPersonalityEditor;