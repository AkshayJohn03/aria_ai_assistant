import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationHistory = ({ conversations, activeConversationId, onSelectConversation, onNewConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary">Conversations</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewConversation}
            iconName="Plus"
            iconSize={16}
            className="p-2"
          />
        </div>
        
        {/* Search */}
        <div className={`relative transition-all duration-200 ${isSearchFocused ? 'ring-2 ring-primary/20' : ''}`}>
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="MessageSquare" size={32} className="mx-auto mb-2 text-text-secondary opacity-50" />
            <p className="text-sm text-text-secondary">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-3 mb-2 rounded-lg text-left transition-all duration-150 hover:bg-muted group ${
                  activeConversationId === conversation.id 
                    ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className={`text-sm font-medium truncate pr-2 ${
                    activeConversationId === conversation.id ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {conversation.title}
                  </h3>
                  <span className="text-xs text-text-secondary flex-shrink-0">
                    {formatDate(conversation.lastActivity)}
                  </span>
                </div>
                
                <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                  {conversation.preview}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {conversation.mode === 'deep' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent">
                        <Icon name="Users" size={10} className="mr-1" />
                        Deep
                      </span>
                    )}
                    {conversation.hasFiles && (
                      <Icon name="Paperclip" size={12} className="text-text-secondary" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-text-secondary">
                      {conversation.messageCount}
                    </span>
                    <Icon name="MessageCircle" size={12} className="text-text-secondary" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;