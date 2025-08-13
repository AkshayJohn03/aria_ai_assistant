import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionTree = ({ 
  sessions, 
  selectedSession, 
  onSessionSelect, 
  onCreateSession, 
  onDeleteSession,
  onRenameSession,
  onArchiveSession,
  searchQuery,
  onSearchChange,
  isCollapsed,
  onToggleCollapse 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['recent', 'projects']));
  const [draggedSession, setDraggedSession] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e, session) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      session
    });
  };

  const handleDragStart = (e, session) => {
    setDraggedSession(session);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetFolder) => {
    e.preventDefault();
    if (draggedSession && draggedSession.folder !== targetFolder) {
      // Handle folder change logic here
      console.log(`Moving session ${draggedSession.id} to ${targetFolder}`);
    }
    setDraggedSession(null);
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedSessions = filteredSessions.reduce((acc, session) => {
    const folder = session.folder || 'uncategorized';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(session);
    return acc;
  }, {});

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

  const SessionItem = ({ session }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, session)}
      onContextMenu={(e) => handleContextMenu(e, session)}
      onClick={() => onSessionSelect(session)}
      className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted ${
        selectedSession?.id === session.id ? 'bg-primary/10 border-l-2 border-primary' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-text-primary truncate flex-1 mr-2">
          {session.title}
        </h4>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="xs"
            iconName="MoreHorizontal"
            iconSize={12}
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, session);
            }}
          />
        </div>
      </div>
      
      <p className="text-xs text-text-secondary mb-2 line-clamp-2">
        {session.summary}
      </p>
      
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-2">
          <Icon name="MessageSquare" size={12} />
          <span>{session.messageCount}</span>
          <Icon name="Users" size={12} />
          <span>{session.models.length}</span>
        </div>
        <span>{formatDate(session.lastActivity)}</span>
      </div>
      
      {session.tags && session.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
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
      )}
    </div>
  );

  const FolderSection = ({ folderId, title, icon, sessions }) => (
    <div className="mb-4">
      <button
        onClick={() => toggleFolder(folderId)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, folderId)}
        className="w-full flex items-center justify-between p-2 text-sm font-medium text-text-primary hover:bg-muted rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Icon 
            name={expandedFolders.has(folderId) ? "ChevronDown" : "ChevronRight"} 
            size={14} 
          />
          <Icon name={icon} size={14} />
          <span>{title}</span>
          <span className="text-xs text-text-secondary">({sessions.length})</span>
        </div>
      </button>
      
      {expandedFolders.has(folderId) && (
        <div className="ml-4 mt-2 space-y-2">
          {sessions.map(session => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`bg-surface border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-0 overflow-hidden' : 'w-full'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text-primary">Sessions</h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              iconSize={16}
              onClick={onCreateSession}
              title="Create new session"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              iconSize={16}
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand" : "Collapse"}
            />
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Session Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedSessions).map(([folder, sessions]) => {
          const folderConfig = {
            recent: { title: 'Recent', icon: 'Clock' },
            projects: { title: 'Projects', icon: 'Folder' },
            archived: { title: 'Archived', icon: 'Archive' },
            uncategorized: { title: 'Uncategorized', icon: 'FileText' }
          };
          
          const config = folderConfig[folder] || { title: folder, icon: 'Folder' };
          
          return (
            <FolderSection
              key={folder}
              folderId={folder}
              title={config.title}
              icon={config.icon}
              sessions={sessions}
            />
          );
        })}
        
        {filteredSessions.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No sessions found</p>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={onCreateSession}
              className="mt-4"
            >
              Create New Session
            </Button>
          </div>
        )}
      </div>

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
                onRenameSession(contextMenu.session);
                setContextMenu(null);
              }}
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Icon name="Edit" size={14} className="mr-2" />
              Rename
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
            <div className="border-t border-border my-1" />
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

export default SessionTree;