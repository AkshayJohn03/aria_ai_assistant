import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import Icon from '../../../components/AppIcon';

const ChatArea = ({ 
  messages, 
  isProcessing, 
  processingMessage,
  onMessageBranch, 
  onMessageCopy, 
  onMessageRegenerate 
}) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    onMessageCopy(content);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-2xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MessageSquare" size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Start a Conversation
              </h3>
              <p className="text-text-secondary mb-6">
                Ask me anything! I can help with analysis, creative tasks, coding, research, and more. 
                Use Deep Think mode for complex problems that benefit from collaborative AI reasoning.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-surface border border-border rounded-lg text-left">
                  <Icon name="Lightbulb" size={16} className="text-accent mb-2" />
                  <p className="font-medium text-text-primary mb-1">Creative Writing</p>
                  <p className="text-text-secondary text-xs">
                    Generate stories, poems, or creative content
                  </p>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg text-left">
                  <Icon name="Code" size={16} className="text-success mb-2" />
                  <p className="font-medium text-text-primary mb-1">Code Analysis</p>
                  <p className="text-text-secondary text-xs">
                    Debug, optimize, or explain code snippets
                  </p>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg text-left">
                  <Icon name="FileText" size={16} className="text-primary mb-2" />
                  <p className="font-medium text-text-primary mb-1">Document Review</p>
                  <p className="text-text-secondary text-xs">
                    Analyze and summarize uploaded documents
                  </p>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg text-left">
                  <Icon name="Users" size={16} className="text-warning mb-2" />
                  <p className="font-medium text-text-primary mb-1">Deep Thinking</p>
                  <p className="text-text-secondary text-xs">
                    Complex problem solving with AI council
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div className="max-w-3xl">
                <ChatMessage
                  key={message.id}
                  message={message}
                  onBranch={onMessageBranch}
                  onCopy={handleCopy}
                  onMessageRegenerate={onMessageRegenerate}
                />
              </div>
            ))}
            
            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mr-12 mb-6">
                <div className="flex justify-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="Bot" size={16} className="text-text-secondary" />
                    </div>
                    <div className="bg-surface border border-border rounded-2xl p-4 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-text-secondary">
                          {processingMessage || 'Thinking...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;