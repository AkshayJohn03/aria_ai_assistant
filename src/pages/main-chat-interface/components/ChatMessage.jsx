import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../../../components/ui/Button';
import { Download, FileText, FileUp, Copy, RefreshCw, GitBranch } from 'lucide-react';

const ChatMessage = ({ 
  message, 
  onBranch, 
  onCopy, 
  onMessageRegenerate,
  onCreatePDF,
  onCreateWord
}) => {
  const getModelBadgeColor = (model) => {
    const colors = {
      'aria-gemma3-1b:latest': 'bg-blue-100 text-blue-800',
      'gemma3:1b': 'bg-green-100 text-green-800',
      'HammerAI/openhermes-2.5-mistral:latest': 'bg-purple-100 text-purple-800',
      'Qwen2.5': 'bg-blue-100 text-blue-800',
      'DeepSeek': 'bg-green-100 text-green-800',
      'Mythomax': 'bg-purple-100 text-purple-800',
      'DeepSeek R1': 'bg-orange-100 text-orange-800',
      'Dark Champion': 'bg-red-100 text-red-800',
      'system': 'bg-gray-100 text-gray-800',
      'error': 'bg-red-100 text-red-800'
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

  const renderFileExportButtons = () => {
    if (!message.isFileOffer || !message.originalContent) return null;

    return (
      <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Export Response</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreatePDF(message.originalContent, `aria_response_${Date.now()}.pdf`)}
            className="flex items-center space-x-2"
          >
            <FileText size={16} />
            <span>PDF</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateWord(message.originalContent, `aria_response_${Date.now()}.docx`)}
            className="flex items-center space-x-2"
          >
            <FileText size={16} />
            <span>Word</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderFileUploadInfo = () => {
    if (!message.isFileUpload) return null;

    return (
      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800">
          <FileUp size={16} />
          <span className="text-sm font-medium">File uploaded: {message.fileName}</span>
        </div>
      </div>
    );
  };

  const renderSearchIndicator = () => {
    if (!message.usedSearch) return null;

    return (
      <div className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium ml-2">
        <span>🔍</span>
        <span>Web Search</span>
      </div>
    );
  };

  const renderDeepThinkIndicator = () => {
    if (!message.deepThink) return null;

    return (
      <div className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium ml-2">
        <span>🧠</span>
        <span>Deep Think</span>
      </div>
    );
  };

  return (
    <div className="flex space-x-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          message.sender === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-text-secondary'
        }`}>
          {message.sender === 'user' ? 'U' : 'A'}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Message Header */}
        <div className="flex items-center space-x-2 mb-2">
          <span className={`text-sm font-medium ${
            message.sender === 'user' ? 'text-primary' : 'text-text-primary'
          }`}>
            {message.sender === 'user' ? 'You' : 'Aria'}
          </span>
          
          {message.model && message.model !== 'system' && message.model !== 'error' && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModelBadgeColor(message.model)}`}>
              {message.model}
            </span>
          )}
          
          {renderSearchIndicator()}
          {renderDeepThinkIndicator()}
          
          <span className="text-xs text-text-secondary">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>

        {/* Message Bubble */}
        <div className={`relative p-5 rounded-2xl shadow-soft ${
          message.sender === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-surface border border-border'
        }`}>
          {/* Message Content */}
          <div className={`text-[15px] leading-7 ${
            message.sender === 'user' ? 'text-primary-foreground' : 'text-text-primary'
          }`}>
            {renderMessageContent(message.content)}
          </div>

          {/* File Export Buttons */}
          {renderFileExportButtons()}

          {/* File Upload Info */}
          {renderFileUploadInfo()}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCopy(message.content)}
            className="text-text-secondary hover:text-text-primary"
          >
            <Copy size={14} />
            <span className="ml-1">Copy</span>
          </Button>
          
          {message.sender === 'assistant' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMessageRegenerate(message.id)}
                className="text-text-secondary hover:text-text-primary"
              >
                <RefreshCw size={14} />
                <span className="ml-1">Regenerate</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBranch(message.id)}
                className="text-text-secondary hover:text-text-primary"
              >
                <GitBranch size={14} />
                <span className="ml-1">Branch</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;