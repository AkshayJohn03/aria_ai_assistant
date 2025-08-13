import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionGridView = ({ 
  sessions, 
  selectedSession, 
  onSessionSelect, 
  onDeleteSession,
  onArchiveSession,
  onDuplicateSession,
  searchQuery 
}) => {
  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const [contextMenu, setContextMenu] = useState(null);

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContextMenu = (e, session) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      session
    });
  };

  const handleSessionSelect = (session, isMultiSelect = false) => {
    if (isMultiSelect) {
      const newSelected = new Set(selectedSessions);
      if (newSelected.has(session.id)) {
        newSelected.delete(session.id);
      } else {
        newSelected.add(session.id);
      }
      setSelectedSessions(newSelected);
    } else {
      onSessionSelect(session);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffTime = Math.abs(now - sessionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return sessionDate.toLocaleDateString();
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'completed': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'Play';
      case 'paused': return 'Pause';
      case 'completed': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const SessionCard = ({ session }) => {
    const isSelected = selectedSession?.id === session.id;
    const isMultiSelected = selectedSessions.has(session.id);

    return (
      <div
        className={`bg-surface border border-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 ${
          isSelected ? 'ring-2 ring-primary border-primary' : ''
        } ${isMultiSelected ? 'bg-primary/5' : ''}`}
        onClick={(e) => handleSessionSelect(session, e.ctrlKey || e.metaKey)}
        onContextMenu={(e) => handleContextMenu(e, session)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-text-primary truncate mb-1">
              {session.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name={getStatusIcon(session.status)} size={12} className={getStatusColor(session.status)} />
              <span className="capitalize">{session.status}</span>
              <span>•</span>
              <span>{formatDate(session.lastActivity)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="xs"
              iconName="MoreHorizontal"
              iconSize={14}
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, session);
              }}
            />
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
          {session.summary}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="MessageSquare" size={14} className="text-primary" />
            <span className="text-sm text-text-secondary">{session.messageCount} messages</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-success" />
            <span className="text-sm text-text-secondary">{formatDuration(session.duration)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={14} className="text-warning" />
            <span className="text-sm text-text-secondary">{session.models.length} models</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} className="text-accent" />
            <span className="text-sm text-text-secondary">{new Date(session.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Models Used */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Bot" size={12} className="text-text-secondary" />
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Models Used</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {session.models.slice(0, 3).map((model, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full"
              >
                {model.name}
              </span>
            ))}
            {session.models.length > 3 && (
              <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                +{session.models.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {session.tags && session.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {session.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {session.tags.length > 2 && (
                <span className="text-xs text-text-secondary">+{session.tags.length - 2}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="xs"
              iconName="Play"
              iconSize={12}
              onClick={(e) => {
                e.stopPropagation();
                onSessionSelect(session);
              }}
              title="Open Session"
            />
            <Button
              variant="ghost"
              size="xs"
              iconName="Copy"
              iconSize={12}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateSession(session);
              }}
              title="Duplicate"
            />
          </div>
          
          <div className="text-xs text-text-secondary">
            {session.folder && (
              <div className="flex items-center space-x-1">
                <Icon name="Folder" size={10} />
                <span>{session.folder}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={64} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Sessions Found</h3>
          <p className="text-text-secondary mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first session to get started'}
          </p>
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => onSessionSelect(null)}
          >
            Create New Session
          </Button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-48"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                onSessionSelect(contextMenu.session);
                setContextMenu(null);
              }}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Icon name="Play" size={14} className="mr-2" />
              Open Session
            </button>
            <button
              onClick={() => {
                onDuplicateSession(contextMenu.session);
                setContextMenu(null);
              }}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Icon name="Copy" size={14} className="mr-2" />
              Duplicate
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + '/session/' + contextMenu.session.id);
                setContextMenu(null);
              }}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Icon name="Share" size={14} className="mr-2" />
              Share
            </button>
            <div className="border-t border-border my-1" />
            <button
              onClick={() => {
                onArchiveSession(contextMenu.session);
                setContextMenu(null);
              }}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Icon name="Archive" size={14} className="mr-2" />
              Archive
            </button>
            <button
              onClick={() => {
                onDeleteSession(contextMenu.session);
                setContextMenu(null);
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Icon name="Trash2" size={14} className="mr-2" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SessionGridView;