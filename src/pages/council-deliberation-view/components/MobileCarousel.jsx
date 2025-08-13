import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MobileCarousel = ({ models, responses, activeModel, onModelSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < models.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < models.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getModelTheme = (modelId) => {
    switch (modelId) {
      case 'mythomax':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-indigo-50',
          border: 'border-purple-200',
          accent: 'text-purple-600',
          icon: 'Crown'
        };
      case 'deepseek':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          accent: 'text-blue-600',
          icon: 'Brain'
        };
      case 'darkchampion':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          border: 'border-gray-200',
          accent: 'text-gray-700',
          icon: 'Zap'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          accent: 'text-gray-600',
          icon: 'MessageSquare'
        };
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Model Responses</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            iconName="ChevronLeft"
            iconSize={16}
          />
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {models.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex === models.length - 1}
            iconName="ChevronRight"
            iconSize={16}
          />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-out"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ width: `${models.length * 100}%` }}
        >
          {models.map((model, index) => {
            const theme = getModelTheme(model.id);
            const response = responses[model.id];
            const isActive = activeModel === model.id;
            
            return (
              <div
                key={model.id}
                className="w-full flex-shrink-0"
                style={{ width: `${100 / models.length}%` }}
              >
                <div className={`h-96 ${theme.bg} ${theme.border} border-l border-r`}>
                  {/* Model Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Icon name={theme.icon} size={20} className={theme.accent} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${theme.accent}`}>{model.name}</h3>
                        <p className="text-sm text-gray-500">{model.specialty}</p>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isActive ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600">Thinking...</span>
                          </>
                        ) : response ? (
                          <>
                            <Icon name="CheckCircle" size={14} className="text-green-500" />
                            <span className="text-xs text-green-600">Complete</span>
                          </>
                        ) : (
                          <>
                            <Icon name="Clock" size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500">Waiting</span>
                          </>
                        )}
                      </div>
                      
                      {response && (
                        <div className="text-xs text-gray-500">
                          {response.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response Content */}
                  <div className="p-4 h-64 overflow-y-auto">
                    {response ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {response.content}
                        </p>
                        
                        {response.keyPoints && (
                          <div className="mt-4 p-3 bg-white/50 rounded-lg">
                            <h4 className="text-xs font-medium text-gray-700 mb-2">Key Points:</h4>
                            <ul className="space-y-1">
                              {response.keyPoints.slice(0, 2).map((point, pointIndex) => (
                                <li key={pointIndex} className="flex items-start space-x-2 text-xs text-gray-600">
                                  <Icon name="ArrowRight" size={10} className="mt-1 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : isActive ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-xs text-gray-600">Processing...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <Icon name="Clock" size={20} className="mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Waiting for turn...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center space-x-2 p-4 border-t border-gray-200">
        {models.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-150 ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="ThumbsUp"
              iconSize={14}
              className="text-gray-500"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="ThumbsDown"
              iconSize={14}
              className="text-gray-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="MessageCircle"
              iconSize={14}
              className="text-gray-500"
            >
              Ask
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Bookmark"
              iconSize={14}
              className="text-gray-500"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCarousel;