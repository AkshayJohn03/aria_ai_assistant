import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionDetails = ({ 
  session, 
  onExportSession, 
  onDuplicateSession, 
  onMergeSessions,
  onUpdateSession 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(session?.title || '');
  const [editedTags, setEditedTags] = useState(session?.tags?.join(', ') || '');

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface">
        <div className="text-center">
          <Icon name="MessageSquare" size={64} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Session Selected</h3>
          <p className="text-text-secondary">Select a session from the sidebar to view details</p>
        </div>
      </div>
    );
  }

  const handleSaveEdit = () => {
    onUpdateSession(session.id, {
      title: editedTitle,
      tags: editedTags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(session.title);
    setEditedTags(session.tags?.join(', ') || '');
    setIsEditing(false);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'insights', label: 'Key Insights', icon: 'Lightbulb' },
    { id: 'models', label: 'Model Usage', icon: 'Bot' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full text-xl font-semibold bg-surface border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  value={editedTags}
                  onChange={(e) => setEditedTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex space-x-2">
                  <Button variant="default" size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-text-primary mb-2">{session.title}</h1>
                {session.tags && session.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {session.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/20 text-accent text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              iconSize={16}
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
        
        <p className="text-text-secondary text-sm leading-relaxed">{session.summary}</p>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MessageSquare" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-secondary">Messages</span>
          </div>
          <p className="text-2xl font-semibold text-text-primary">{session.messageCount}</p>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-success" />
            <span className="text-sm font-medium text-text-secondary">Duration</span>
          </div>
          <p className="text-2xl font-semibold text-text-primary">{formatDuration(session.duration)}</p>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-warning" />
            <span className="text-sm font-medium text-text-secondary">Models</span>
          </div>
          <p className="text-2xl font-semibold text-text-primary">{session.models.length}</p>
        </div>
        
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="HardDrive" size={16} className="text-accent" />
            <span className="text-sm font-medium text-text-secondary">Size</span>
          </div>
          <p className="text-2xl font-semibold text-text-primary">{formatFileSize(session.size)}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-medium text-text-primary mb-4">Session Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-sm text-text-secondary">Created: {new Date(session.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-text-secondary">Last Activity: {new Date(session.lastActivity).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-sm text-text-secondary">Status: {session.status}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const InsightsTab = () => (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-medium text-text-primary mb-4">Key Insights</h3>
        <div className="space-y-4">
          {session.insights?.map((insight, index) => (
            <div key={index} className="border-l-4 border-primary pl-4">
              <h4 className="font-medium text-text-primary mb-1">{insight.title}</h4>
              <p className="text-sm text-text-secondary">{insight.content}</p>
              <span className="text-xs text-text-secondary mt-2 block">
                Generated by {insight.model}
              </span>
            </div>
          )) || (
            <p className="text-text-secondary">No insights generated for this session yet.</p>
          )}
        </div>
      </div>
    </div>
  );

  const ModelsTab = () => (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-medium text-text-primary mb-4">Model Usage Statistics</h3>
        <div className="space-y-4">
          {session.models.map((model, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon name="Bot" size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{model.name}</h4>
                  <p className="text-sm text-text-secondary">{model.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{model.responseCount} responses</p>
                <p className="text-xs text-text-secondary">{formatDuration(model.totalTime)} total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ExportTab = () => (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-medium text-text-primary mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => onExportSession(session.id, 'json')}
            iconName="FileText"
            iconPosition="left"
            className="justify-start"
          >
            Export as JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => onExportSession(session.id, 'pdf')}
            iconName="FileText"
            iconPosition="left"
            className="justify-start"
          >
            Export as PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => onExportSession(session.id, 'txt')}
            iconName="FileText"
            iconPosition="left"
            className="justify-start"
          >
            Export as Text
          </Button>
        </div>
      </div>
      
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-medium text-text-primary mb-4">Session Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => onDuplicateSession(session.id)}
            iconName="Copy"
            iconPosition="left"
          >
            Duplicate Session
          </Button>
          <Button
            variant="outline"
            onClick={() => onMergeSessions([session.id])}
            iconName="Merge"
            iconPosition="left"
          >
            Merge with Another
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'insights': return <InsightsTab />;
      case 'models': return <ModelsTab />;
      case 'export': return <ExportTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex-1 bg-surface">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="MessageSquare" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Session Details</h2>
              <p className="text-sm text-text-secondary">Manage and analyze your conversation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1 p-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SessionDetails;