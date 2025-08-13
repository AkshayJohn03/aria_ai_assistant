import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatMessage = ({ message, onBranch, onCopy, onRegenerate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getModelBadgeColor = (model) => {
    const colors = {
      'aria-gemma3-1b:latest': 'bg-blue-100 text-blue-800',
      'gemma3:1b': 'bg-green-100 text-green-800',
      'HammerAI/openhermes-2.5-mistral:latest': 'bg-purple-100 text-purple-800',
      'Qwen2.5': 'bg-blue-100 text-blue-800',
      'DeepSeek': 'bg-green-100 text-green-800',
      'Mythomax': 'bg-purple-100 text-purple-800',
      'DeepSeek R1': 'bg-orange-100 text-orange-800',
      'Dark Champion': 'bg-red-100 text-red-800'
    };
    return colors[model] || 'bg-gray-100 text-gray-800';
  };

  const renderMessageContent = (content) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const languageMatch = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="my-3 bg-muted rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-muted border-b border-border">
                  <span className="text-xs text-text-secondary font-mono">
                    {languageMatch ? languageMatch[1] : 'code'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(String(children))}
                    iconName="Copy"
                    iconSize={12}
                    className="p-1"
                  />
                </div>
                <pre className="p-3 text-sm overflow-x-auto" style={{
                  fontFamily: 'JetBrains Mono, Menlo, Consolas, "Source Code Pro", monospace',
                  lineHeight: 1.5,
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}>
                  <code {...props}>{children}</code>
                </pre>
              </div>
            ) : (
              <code className="px-1 py-0.5 rounded bg-muted text-text-primary" style={{
                fontFamily: 'JetBrains Mono, Menlo, Consolas, "Source Code Pro", monospace',
                lineHeight: 1.4
              }} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div 
      className={`group mb-6 ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-full ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
          {/* Message Header */}
          <div className={`flex items-center mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-center space-x-2">
              {message.sender !== 'user' && message.model && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModelBadgeColor(message.model)}`}>
                  {message.model}
                </span>
              )}
              <span className="text-xs text-text-secondary">
                {formatTimestamp(message.timestamp)}
              </span>
              {message.temperature && (
                <span className="text-xs text-text-secondary">
                  T: {message.temperature}
                </span>
              )}
            </div>
          </div>

          {/* Message Bubble */}
          <div className={`relative p-5 rounded-2xl shadow-soft ${
            message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-surface border border-border'
          }`}>
            {/* Message Content */}
            <div className={`text-[15px] leading-7 ${
              message.sender === 'user' ? 'text-primary-foreground' : 'text-text-primary'
            }`}>
              {renderMessageContent(message.content)}
            </div>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
                    <Icon name="Paperclip" size={14} />
                    <span className="text-xs">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Council Responses (for Deep Think mode) */}
            {message.councilResponses && (
              <div className="mt-4">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-2 text-xs text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
                  <span>Council Deliberation ({message.councilResponses.length})</span>
                </button>
                
                {isExpanded && (
                  <div className="mt-3 space-y-3">
                    {message.councilResponses.map((response, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg border-l-2 border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getModelBadgeColor(response.model)}`}>
                            {response.model}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {response.reasoning}
                          </span>
                        </div>
                        <p className="text-sm text-text-primary">
                          {response.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Actions */}
          {showActions && message.sender !== 'user' && (
            <div className="flex items-center space-x-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(message.content)}
                iconName="Copy"
                iconSize={14}
                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRegenerate(message.id)}
                iconName="RotateCcw"
                iconSize={14}
                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBranch(message.id)}
                iconName="GitBranch"
                iconSize={14}
                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              />
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.sender === 'user' ? 'order-1 ml-3 bg-primary' : 'order-2 mr-3 bg-muted'
        }`}>
          <Icon 
            name={message.sender === 'user' ? "User" : "Bot"} 
            size={16} 
            className={message.sender === 'user' ? 'text-primary-foreground' : 'text-text-secondary'}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;