import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelPanel = ({ 
  model, 
  response, 
  isActive, 
  isComplete, 
  responseTime, 
  confidence, 
  onVote, 
  onClarify, 
  onSave 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Simulate typing effect for active responses
  useEffect(() => {
    if (isActive && response && !isComplete) {
      setIsTyping(true);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < response.length) {
          setDisplayedText(response.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    } else if (isComplete) {
      setDisplayedText(response);
      setIsTyping(false);
    }
  }, [isActive, response, isComplete]);

  const getModelTheme = () => {
    switch (model.id) {
      case 'mythomax':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
          border: 'border-purple-200',
          accent: 'text-purple-600',
          icon: 'Crown',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600'
        };
      case 'deepseek':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          accent: 'text-blue-600',
          icon: 'Brain',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
      case 'darkchampion':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          border: 'border-gray-200',
          accent: 'text-gray-700',
          icon: 'Zap',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-700'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          accent: 'text-gray-600',
          icon: 'MessageSquare',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        };
    }
  };

  const theme = getModelTheme();

  return (
    <div className={`h-full ${theme.bg} ${theme.border} border rounded-lg flex flex-col`}>
      {/* Model Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${theme.iconBg} rounded-lg flex items-center justify-center`}>
              <Icon name={theme.icon} size={16} className={theme.iconColor} />
            </div>
            <div>
              <h3 className={`font-semibold ${theme.accent}`}>{model.name}</h3>
              <p className="text-xs text-gray-500">{model.specialty}</p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {isActive && !isComplete && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Thinking...</span>
              </div>
            )}
            {isComplete && (
              <div className="flex items-center space-x-1">
                <Icon name="CheckCircle" size={14} className="text-green-500" />
                <span className="text-xs text-green-600">Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        {isComplete && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Response: {responseTime}ms</span>
            <div className="flex items-center space-x-1">
              <Icon name="TrendingUp" size={12} />
              <span>Confidence: {confidence}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Response Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!response && !isActive && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Icon name="Clock" size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for deliberation...</p>
            </div>
          </div>
        )}

        {(response || displayedText) && (
          <div className="space-y-3">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {/* Key Points */}
            {isComplete && model.keyPoints && (
              <div className="mt-4 p-3 bg-white/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights:</h4>
                <ul className="space-y-1">
                  {model.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isComplete && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote('up')}
                iconName="ThumbsUp"
                iconSize={14}
                className="text-gray-500 hover:text-green-600"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote('down')}
                iconName="ThumbsDown"
                iconSize={14}
                className="text-gray-500 hover:text-red-600"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClarify}
                iconName="MessageCircle"
                iconSize={14}
                className="text-gray-500"
              >
                Clarify
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                iconName="Bookmark"
                iconSize={14}
                className="text-gray-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelPanel;