import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ModelPanel from './components/ModelPanel';
import DeliberationProgress from './components/DeliberationProgress';
import SynthesisArea from './components/SynthesisArea';
import MobileCarousel from './components/MobileCarousel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CouncilDeliberationView = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [activeModels, setActiveModels] = useState([]);
  const [completedModels, setCompletedModels] = useState([]);
  const [modelResponses, setModelResponses] = useState({});
  const [synthesizedResponse, setSynthesizedResponse] = useState('');
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  // Mock data for AI models
  const models = [
    {
      id: 'mythomax',
      name: 'Mythomax',
      specialty: 'Strategic Thinking & Creative Solutions',
      icon: 'Crown',
      keyPoints: [
        'Consider unconventional approaches to maximize impact',
        'Leverage strategic partnerships for scalable solutions',
        'Focus on long-term value creation over short-term gains'
      ]
    },
    {
      id: 'deepseek',
      name: 'DeepSeek R1',
      specialty: 'Logical Analysis & Data-Driven Insights',
      icon: 'Brain',
      keyPoints: [
        'Analyze quantitative metrics and performance indicators',
        'Identify logical dependencies and potential bottlenecks',
        'Provide evidence-based recommendations with risk assessment'
      ]
    },
    {
      id: 'darkchampion',
      name: 'Dark Champion',
      specialty: 'Philosophical Insights & Critical Thinking',
      icon: 'Zap',
      keyPoints: [
        'Question fundamental assumptions and challenge status quo',
        'Explore ethical implications and unintended consequences',
        'Provide contrarian perspectives to strengthen decision-making'
      ]
    }
  ];

  // Mock responses for demonstration
  const mockResponses = {
    mythomax: {
      content: `From a strategic perspective, this challenge presents an opportunity to revolutionize our approach. I recommend implementing a multi-tiered strategy that combines innovative technology adoption with human-centered design principles.\n\nThe key is to think beyond conventional solutions and create a framework that can adapt to changing market conditions. We should focus on building strategic partnerships that amplify our capabilities while maintaining our core competitive advantages.\n\nConsider this: instead of competing directly, we can create an entirely new category that positions us as the definitive leader. This requires bold thinking and willingness to challenge industry norms.`,
      responseTime: 1847,
      confidence: 92,
      keyPoints: [
        'Consider unconventional approaches to maximize impact',
        'Leverage strategic partnerships for scalable solutions',
        'Focus on long-term value creation over short-term gains'
      ]
    },
    deepseek: {
      content: `Based on logical analysis of the available data, I've identified several critical factors that must be addressed systematically.\n\nFirst, the quantitative metrics indicate a 23% efficiency gap in current processes, which can be optimized through targeted interventions. The correlation analysis reveals three primary bottlenecks that, when resolved, could improve overall performance by 34%.\n\nSecond, risk assessment shows moderate probability (67%) of success with current resources, but this increases to 89% with proper resource allocation and timeline adjustments. The cost-benefit analysis supports implementation with an estimated ROI of 156% over 18 months.\n\nRecommendation: Proceed with phased implementation, starting with high-impact, low-risk components.`,
      responseTime: 2156,
      confidence: 96,
      keyPoints: [
        'Analyze quantitative metrics and performance indicators','Identify logical dependencies and potential bottlenecks','Provide evidence-based recommendations with risk assessment'
      ]
    },
    darkchampion: {
      content: `Let me challenge the fundamental assumptions underlying this entire approach. Are we solving the right problem, or are we merely addressing symptoms of a deeper systemic issue?\n\nThe philosophical question here isn't just about optimization or strategy—it's about whether our current paradigm is fundamentally flawed. What if the very framework we're operating within is the constraint that's limiting our potential?\n\nConsider the ethical implications: Who benefits from this solution? What are the unintended consequences we're not seeing? Sometimes the most profound insights come from questioning what everyone else takes for granted.\n\nMy contrarian view: Instead of improving the existing system, we should consider whether it's time to abandon it entirely and build something fundamentally different.`,
      responseTime: 1923,
      confidence: 88,
      keyPoints: [
        'Question fundamental assumptions and challenge status quo','Explore ethical implications and unintended consequences','Provide contrarian perspectives to strengthen decision-making'
      ]
    }
  };

  const mockSynthesizedResponse = `After careful deliberation among our AI council, here's the synthesized recommendation:\n\n**Strategic Approach**: We should pursue a revolutionary multi-tiered strategy that combines Mythomax's innovative partnership framework with systematic implementation based on DeepSeek's quantitative analysis.\n\n**Implementation Plan**: Begin with a phased approach targeting the identified 23% efficiency gap, while simultaneously building strategic partnerships that position us in a new market category. The 89% success probability with proper resource allocation supports this direction.\n\n**Critical Considerations**: Dark Champion's philosophical challenge is valid—we must ensure we're solving the root problem, not just symptoms. This means regularly questioning our assumptions and monitoring for unintended consequences throughout implementation.\n\n**Recommended Action**: Proceed with the hybrid approach that balances innovation with data-driven decision making, while maintaining ethical oversight and willingness to pivot if fundamental assumptions prove incorrect.\n\n**Expected Outcome**: 156% ROI over 18 months with significantly reduced risk through systematic validation of each implementation phase.`;

  const modelContributions = [
    {
      modelId: 'mythomax',
      modelName: 'Mythomax',
      specialty: 'Strategic Thinking',
      icon: 'Crown',
      weight: 'high',
      keyPoints: [
        'Multi-tiered strategic framework',
        'Partnership-based scaling approach',
        'New market category creation'
      ],
      influence: 'Provided the overarching strategic vision and innovative approach that forms the foundation of the final recommendation.'
    },
    {
      modelId: 'deepseek',
      modelName: 'DeepSeek R1',
      specialty: 'Logical Analysis',
      icon: 'Brain',
      weight: 'high',
      keyPoints: [
        'Quantitative performance metrics',
        'Risk assessment and ROI calculations',
        'Phased implementation methodology'
      ],
      influence: 'Supplied critical data analysis and risk assessment that validates the strategic approach with concrete metrics.'
    },
    {
      modelId: 'darkchampion',
      modelName: 'Dark Champion',
      specialty: 'Critical Thinking',
      icon: 'Zap',
      weight: 'medium',
      keyPoints: [
        'Fundamental assumption challenges',
        'Ethical oversight requirements',
        'Contrarian perspective integration'
      ],
      influence: 'Provided essential philosophical grounding and risk mitigation through critical questioning of core assumptions.'
    }
  ];

  // Simulate deliberation process
  useEffect(() => {
    const simulateDeliberation = async () => {
      setActiveModels(models);
      
      // Phase 1: Initial Analysis
      setTimeout(() => {
        setCurrentPhase(1);
        setCompletedModels(['mythomax']);
        setModelResponses(prev => ({
          ...prev,
          mythomax: mockResponses.mythomax
        }));
      }, 1000);

      // Phase 2: Additional models complete
      setTimeout(() => {
        setCompletedModels(['mythomax', 'deepseek']);
        setModelResponses(prev => ({
          ...prev,
          deepseek: mockResponses.deepseek
        }));
      }, 2500);

      // Phase 3: Final model completes
      setTimeout(() => {
        setCompletedModels(['mythomax', 'deepseek', 'darkchampion']);
        setModelResponses(prev => ({
          ...prev,
          darkchampion: mockResponses.darkchampion
        }));
      }, 4000);

      // Phase 4: Synthesis
      setTimeout(() => {
        setCurrentPhase(2);
        setIsGeneratingSynthesis(true);
      }, 5000);

      setTimeout(() => {
        setIsGeneratingSynthesis(false);
        setSynthesizedResponse(mockSynthesizedResponse);
        setCurrentPhase(3);
      }, 7000);
    };

    simulateDeliberation();
  }, []);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModelVote = (modelId, voteType) => {
    console.log(`Voted ${voteType} for model ${modelId}`);
  };

  const handleModelClarify = (modelId) => {
    console.log(`Request clarification from model ${modelId}`);
  };

  const handleModelSave = (modelId) => {
    console.log(`Save response from model ${modelId}`);
  };

  const handleRegenerateResponse = () => {
    setIsGeneratingSynthesis(true);
    setTimeout(() => {
      setIsGeneratingSynthesis(false);
    }, 3000);
  };

  const handleExportResponse = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      models: models.map(model => ({
        ...model,
        response: modelResponses[model.id]
      })),
      synthesizedResponse,
      contributions: modelContributions
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `council-deliberation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Council Deliberation</h1>
              <p className="text-text-secondary mt-1">
                Deep Think Mode - Multi-model collaborative analysis
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                iconName="Settings"
                iconSize={16}
              >
                Configure
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconSize={16}
                onClick={handleExportResponse}
              >
                Export Session
              </Button>
            </div>
          </div>

          {/* Progress Section */}
          <DeliberationProgress
            currentPhase={currentPhase}
            totalPhases={4}
            activeModels={activeModels}
            completedModels={completedModels}
            estimatedTime={Math.max(0, 8 - Math.floor((Date.now() % 10000) / 1000))}
          />

          {/* Desktop View - Three Panel Layout */}
          {!isMobileView ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
              {models.map((model) => (
                <ModelPanel
                  key={model.id}
                  model={model}
                  response={modelResponses[model.id]?.content}
                  isActive={activeModels.some(m => m.id === model.id) && !completedModels.includes(model.id)}
                  isComplete={completedModels.includes(model.id)}
                  responseTime={modelResponses[model.id]?.responseTime}
                  confidence={modelResponses[model.id]?.confidence}
                  onVote={(voteType) => handleModelVote(model.id, voteType)}
                  onClarify={() => handleModelClarify(model.id)}
                  onSave={() => handleModelSave(model.id)}
                />
              ))}
            </div>
          ) : (
            /* Mobile View - Carousel */
            <MobileCarousel
              models={models}
              responses={modelResponses}
              activeModel={activeModels.find(m => !completedModels.includes(m.id))?.id}
              onModelSelect={setSelectedModel}
            />
          )}

          {/* Synthesis Area */}
          <SynthesisArea
            synthesizedResponse={synthesizedResponse}
            modelContributions={modelContributions}
            isGenerating={isGeneratingSynthesis}
            onRegenerateResponse={handleRegenerateResponse}
            onExportResponse={handleExportResponse}
          />

          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  {completedModels.length}/{activeModels.length} models completed
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  Session: {Math.floor((Date.now() % 300000) / 1000)}s
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RotateCcw"
                iconSize={14}
              >
                Reset Session
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Share"
                iconSize={14}
              >
                Share Results
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CouncilDeliberationView;