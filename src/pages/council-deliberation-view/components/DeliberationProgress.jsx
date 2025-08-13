import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliberationProgress = ({ 
  currentPhase, 
  totalPhases, 
  activeModels, 
  completedModels, 
  estimatedTime 
}) => {
  const phases = [
    { id: 'analysis', label: 'Initial Analysis', icon: 'Search' },
    { id: 'deliberation', label: 'Model Deliberation', icon: 'Users' },
    { id: 'synthesis', label: 'Response Synthesis', icon: 'Merge' },
    { id: 'review', label: 'Final Review', icon: 'CheckCircle' }
  ];

  const getPhaseStatus = (phaseIndex) => {
    if (phaseIndex < currentPhase) return 'completed';
    if (phaseIndex === currentPhase) return 'active';
    return 'pending';
  };

  const getProgressPercentage = () => {
    const baseProgress = (currentPhase / totalPhases) * 100;
    const modelProgress = (completedModels.length / activeModels.length) * (100 / totalPhases);
    return Math.min(baseProgress + modelProgress, 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Council Deliberation</h2>
          <p className="text-sm text-gray-500">
            Phase {currentPhase + 1} of {totalPhases} • Est. {estimatedTime}s remaining
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {completedModels.length}/{activeModels.length} Models
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          
          <div className="w-12 h-12 relative">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray={`${getProgressPercentage()}, 100`}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Phase Steps */}
      <div className="space-y-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(index);
          return (
            <div key={phase.id} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : status === 'active' ?'bg-blue-100 text-blue-600' :'bg-gray-100 text-gray-400'
              }`}>
                {status === 'completed' ? (
                  <Icon name="Check" size={16} />
                ) : status === 'active' ? (
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                ) : (
                  <Icon name={phase.icon} size={16} />
                )}
              </div>
              
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  status === 'completed' 
                    ? 'text-green-700' 
                    : status === 'active' ?'text-blue-700' :'text-gray-500'
                }`}>
                  {phase.label}
                </div>
                
                {status === 'active' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {activeModels.filter(model => !completedModels.includes(model.id)).map(model => model.name).join(', ')} working...
                  </div>
                )}
              </div>
              
              {status === 'active' && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Models Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Model Status</h3>
        <div className="grid grid-cols-3 gap-4">
          {activeModels.map((model) => {
            const isCompleted = completedModels.includes(model.id);
            const isWorking = !isCompleted && currentPhase === 1; // Deliberation phase
            
            return (
              <div key={model.id} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isCompleted 
                    ? 'bg-green-400' 
                    : isWorking 
                    ? 'bg-blue-400 animate-pulse' :'bg-gray-300'
                }`}></div>
                <span className={`text-xs ${
                  isCompleted 
                    ? 'text-green-700' 
                    : isWorking 
                    ? 'text-blue-700' :'text-gray-500'
                }`}>
                  {model.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliberationProgress;