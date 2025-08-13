import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SynthesisArea = ({ 
  synthesizedResponse, 
  modelContributions, 
  isGenerating, 
  onRegenerateResponse, 
  onExportResponse 
}) => {
  const [expandedContributions, setExpandedContributions] = useState({});
  const [selectedTab, setSelectedTab] = useState('synthesis');

  const toggleContribution = (modelId) => {
    setExpandedContributions(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  const getContributionWeight = (contribution) => {
    const weights = { high: 'High', medium: 'Medium', low: 'Low' };
    return weights[contribution.weight] || 'Medium';
  };

  const getWeightColor = (weight) => {
    switch (weight) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const tabs = [
    { id: 'synthesis', label: 'Final Response', icon: 'FileText' },
    { id: 'contributions', label: 'Model Contributions', icon: 'Users' },
    { id: 'timeline', label: 'Deliberation Timeline', icon: 'Clock' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  selectedTab === tab.id
                    ? 'bg-blue-50 text-blue-700' :'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerateResponse}
              iconName="RefreshCw"
              iconSize={14}
              disabled={isGenerating}
            >
              Regenerate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportResponse}
              iconName="Download"
              iconSize={14}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Synthesis Tab */}
        {selectedTab === 'synthesis' && (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Synthesizing council responses...</p>
                  <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                </div>
              </div>
            ) : (
              <>
                {/* Quality Metrics */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">94%</div>
                      <div className="text-xs text-gray-500">Consensus</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">8.7/10</div>
                      <div className="text-xs text-gray-500">Quality Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">2.3s</div>
                      <div className="text-xs text-gray-500">Generation Time</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon name="Award" size={16} className="text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">High Quality Response</span>
                  </div>
                </div>

                {/* Synthesized Response */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {synthesizedResponse}
                  </div>
                </div>

                {/* Response Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ThumbsUp"
                      iconSize={14}
                      className="text-gray-500 hover:text-green-600"
                    >
                      Helpful
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ThumbsDown"
                      iconSize={14}
                      className="text-gray-500 hover:text-red-600"
                    >
                      Not Helpful
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      iconSize={14}
                      className="text-gray-500"
                    >
                      Copy
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Contributions Tab */}
        {selectedTab === 'contributions' && (
          <div className="space-y-4">
            {modelContributions.map((contribution) => (
              <div key={contribution.modelId} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleContribution(contribution.modelId)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name={contribution.icon} size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{contribution.modelName}</h3>
                      <p className="text-sm text-gray-500">{contribution.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWeightColor(contribution.weight)}`}>
                      {getContributionWeight(contribution)} Impact
                    </span>
                    <Icon 
                      name={expandedContributions[contribution.modelId] ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-gray-400" 
                    />
                  </div>
                </button>
                
                {expandedContributions[contribution.modelId] && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="space-y-3 mt-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Contributions:</h4>
                        <ul className="space-y-1">
                          {contribution.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                              <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Influence on Final Response:</h4>
                        <p className="text-sm text-gray-600">{contribution.influence}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Timeline Tab */}
        {selectedTab === 'timeline' && (
          <div className="space-y-6">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {[
                  { time: '14:52:07', event: 'Deliberation initiated', icon: 'Play', color: 'blue' },
                  { time: '14:52:08', event: 'Mythomax began strategic analysis', icon: 'Crown', color: 'purple' },
                  { time: '14:52:09', event: 'DeepSeek started logical evaluation', icon: 'Brain', color: 'blue' },
                  { time: '14:52:10', event: 'Dark Champion initiated philosophical review', icon: 'Zap', color: 'gray' },
                  { time: '14:52:12', event: 'Cross-model communication established', icon: 'MessageCircle', color: 'green' },
                  { time: '14:52:15', event: 'Response synthesis completed', icon: 'CheckCircle', color: 'green' }
                ].map((item, index) => (
                  <div key={index} className="relative flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      item.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      item.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                      item.color === 'gray'? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <Icon name={item.icon} size={14} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.event}</p>
                        <span className="text-xs text-gray-500">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SynthesisArea;