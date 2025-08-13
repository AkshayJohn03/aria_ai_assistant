import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomInstructions = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('general');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedInstructions, setSavedInstructions] = useState([]);

  const templates = [
    {
      id: 'general',
      name: 'General Assistant',
      description: 'Balanced, helpful responses for general queries',
      content: `You are ARIA, an advanced AI assistant designed to be helpful, harmless, and honest. Your responses should be:\n\n- Clear and concise\n- Accurate and well-researched\n- Respectful and professional\n- Tailored to the user's expertise level\n\nAlways strive to provide comprehensive answers while being mindful of potential biases or limitations in your knowledge.`
    },
    {
      id: 'creative',name: 'Creative Writing',description: 'Enhanced creativity for writing and brainstorming',
      content: `You are ARIA in creative mode, designed to inspire and assist with creative endeavors. Your responses should be:\n\n- Imaginative and original\n- Rich in descriptive language\n- Encouraging of creative exploration\n- Supportive of unconventional ideas\n\nFeel free to think outside the box and offer multiple creative perspectives on any topic.`
    },
    {
      id: 'technical',name: 'Technical Expert',description: 'Precise, detailed responses for technical topics',
      content: `You are ARIA in technical expert mode, specialized in providing detailed technical information. Your responses should be:\n\n- Technically accurate and precise\n- Well-structured with clear explanations\n- Include relevant examples and code snippets when appropriate\n- Reference best practices and industry standards\n\nAlways verify technical details and provide step-by-step guidance when needed.`
    },
    {
      id: 'research',name: 'Research Assistant',description: 'Analytical approach for research and analysis',
      content: `You are ARIA in research mode, designed to assist with analytical and research tasks. Your responses should be:\n\n- Methodical and evidence-based\n- Include multiple perspectives on complex topics\n- Cite relevant sources and methodologies\n- Highlight limitations and areas for further investigation\n\nApproach each query with scientific rigor and critical thinking.`
    },
    {
      id: 'educational',name: 'Educational Tutor',description: 'Patient, explanatory responses for learning',
      content: `You are ARIA in educational mode, designed to facilitate learning and understanding. Your responses should be:\n\n- Patient and encouraging\n- Break down complex concepts into digestible parts\n- Use analogies and examples to clarify difficult topics\n- Encourage questions and deeper exploration\n\nAdapt your explanations to the learner's level and provide additional resources when helpful.`
    },
    {
      id: 'custom',
      name: 'Custom Template',
      description: 'Create your own custom instructions',
      content: ''
    }
  ];

  const [templateData, setTemplateData] = useState(templates);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    const template = templateData.find(t => t.id === templateId);
    if (template && templateId !== 'custom') {
      setCustomInstructions(template.content);
    } else if (templateId === 'custom') {
      setCustomInstructions('');
    }
  };

  const handleSaveInstructions = () => {
    const newInstruction = {
      id: Date.now(),
      name: `Custom Instructions ${savedInstructions.length + 1}`,
      content: customInstructions,
      createdAt: new Date().toISOString(),
      isActive: false
    };
    setSavedInstructions(prev => [...prev, newInstruction]);
  };

  const handleLoadSaved = (instruction) => {
    setCustomInstructions(instruction.content);
    setSelectedTemplate('custom');
  };

  const handleDeleteSaved = (id) => {
    setSavedInstructions(prev => prev.filter(inst => inst.id !== id));
  };

  const previewResponse = `Based on your custom instructions, I would respond in the following manner:\n\n"Thank you for your question. Following the guidelines you've established, I'll provide a comprehensive response that aligns with the specified tone, style, and approach you've configured.\n\nYour custom instructions help me understand exactly how you'd like me to communicate and what aspects to emphasize in my responses. This ensures consistency across our conversation and helps me provide the most relevant and useful information for your specific needs."\n\nThis preview shows how your instructions would influence my response style and approach.`;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Custom Instructions</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            iconName="Eye"
            iconPosition="left"
          >
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveInstructions}
            iconName="Save"
            iconPosition="left"
            disabled={!customInstructions.trim()}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-medium text-text-primary mb-3">Templates</h3>
          <div className="space-y-2">
            {templateData.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 hover:shadow-sm ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5' :'border-border bg-surface hover:border-border/80'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon 
                    name={template.id === 'custom' ? 'Plus' : 'FileText'} 
                    size={14} 
                    className={selectedTemplate === template.id ? 'text-primary' : 'text-text-secondary'}
                  />
                  <span className="font-medium text-text-primary text-sm">{template.name}</span>
                </div>
                <p className="text-xs text-text-secondary">{template.description}</p>
              </button>
            ))}
          </div>

          {/* Saved Instructions */}
          {savedInstructions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-text-primary mb-3">Saved Instructions</h3>
              <div className="space-y-2">
                {savedInstructions.map((instruction) => (
                  <div
                    key={instruction.id}
                    className="p-3 rounded-lg border border-border bg-surface"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        {instruction.name}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadSaved(instruction)}
                          iconName="Upload"
                          className="p-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSaved(instruction.id)}
                          iconName="Trash2"
                          className="p-1 text-error hover:text-error"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {new Date(instruction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions Editor */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-text-primary">
                {selectedTemplate === 'custom' ? 'Custom Instructions' : templateData.find(t => t.id === selectedTemplate)?.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                <Icon name="Type" size={12} />
                <span>{customInstructions.length} characters</span>
              </div>
            </div>

            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Enter your custom instructions here. These will guide how ARIA responds to your queries..."
              rows={12}
              className="w-full p-4 border border-border rounded-lg bg-surface text-text-primary text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            {/* Preview Mode */}
            {isPreviewMode && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="MessageSquare" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-text-primary">Response Preview</span>
                </div>
                <div className="p-3 bg-surface rounded border border-border">
                  <p className="text-sm text-text-primary whitespace-pre-line">
                    {customInstructions ? previewResponse : 'Enter custom instructions to see a preview of how they would affect responses.'}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCustomInstructions('')}
                iconName="Trash2"
                iconPosition="left"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const template = templateData.find(t => t.id === selectedTemplate);
                  if (template) setCustomInstructions(template.content);
                }}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Reset to Template
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Copy"
                iconPosition="left"
                onClick={() => navigator.clipboard.writeText(customInstructions)}
              >
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
            </div>

            {/* Usage Tips */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Lightbulb" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">Tips for Effective Instructions</span>
              </div>
              <ul className="text-xs text-text-secondary space-y-1">
                <li>• Be specific about the tone and style you want</li>
                <li>• Include examples of desired response formats</li>
                <li>• Specify any constraints or limitations</li>
                <li>• Mention your expertise level for appropriate responses</li>
                <li>• Include any domain-specific requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomInstructions;