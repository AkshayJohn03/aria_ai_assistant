import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { Button } from '../../../components/ui/Button';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

const ChatArea = ({ 
  messages, 
  isLoading, 
  onMessageBranch, 
  onCopy, 
  onMessageRegenerate,
  onCreatePDF,
  onCreateWord,
  chatContainerRef 
}) => {
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, chatContainerRef]);

  const handleCopy = (text) => {
    onCopy(text);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-2xl">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot size={32} className="text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Welcome to Aria AI Assistant
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Your personal AI strategist, second brain, and problem solver. 
                  I'm here to help you think unconventionally, creatively, and strategically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-surface border border-border rounded-lg text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">Smart Conversations</h3>
                  <p className="text-sm text-text-secondary">
                    Engage in meaningful discussions with context awareness and memory
                  </p>
                </div>

                <div className="p-4 bg-surface border border-border rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">Deep Think Mode</h3>
                  <p className="text-sm text-text-secondary">
                    Multi-model council deliberation for complex problem-solving
                  </p>
                </div>

                <div className="p-4 bg-surface border border-border rounded-lg text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">File Intelligence</h3>
                  <p className="text-sm text-text-secondary">
                    Upload, analyze, and export documents with AI assistance
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-text-secondary">
                    <strong>Web Search:</strong> Toggle to include real-time information
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-text-secondary">
                    <strong>Deep Think:</strong> Enable multi-model council deliberation
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-text-secondary">
                    <strong>File Upload:</strong> Support for images, PDFs, Word, Excel, and text files
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="max-w-3xl">
                <ChatMessage
                  message={message}
                  onBranch={onMessageBranch}
                  onCopy={handleCopy}
                  onMessageRegenerate={onMessageRegenerate}
                  onCreatePDF={onCreatePDF}
                  onCreateWord={onCreateWord}
                />
              </div>
            ))}
            
            {isLoading && (
              <div className="max-w-3xl">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot size={16} className="text-text-secondary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="p-5 rounded-2xl bg-surface border border-border">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-text-secondary">Aria is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatArea;