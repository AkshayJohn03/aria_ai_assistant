import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SessionToolbar = ({
  selectedSessions,
  onCreateSession,
  onBulkDelete,
  onBulkArchive,
  onBulkExport,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  viewMode,
  onViewModeChange
}) => {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const sortOptions = [
    { value: 'lastActivity', label: 'Last Activity' },
    { value: 'created', label: 'Date Created' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'messageCount', label: 'Message Count' },
    { value: 'duration', label: 'Duration' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Sessions' },
    { value: 'recent', label: 'Recent (7 days)' },
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
    { value: 'long', label: 'Long Conversations (50+ messages)' },
    { value: 'short', label: 'Short Conversations (<10 messages)' }
  ];

  const viewModeOptions = [
    { value: 'tree', label: 'Tree View', icon: 'List' },
    { value: 'grid', label: 'Grid View', icon: 'Grid3X3' },
    { value: 'timeline', label: 'Timeline', icon: 'Clock' }
  ];

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        onBulkDelete(selectedSessions);
        break;
      case 'archive':
        onBulkArchive(selectedSessions);
        break;
      case 'export':
        onBulkExport(selectedSessions);
        break;
    }
    setShowBulkActions(false);
  };

  return (
    <div className="bg-surface border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Primary Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateSession}
          >
            New Session
          </Button>
          
          {selectedSessions.length > 0 && (
            <div className="relative">
              <Button
                variant="outline"
                iconName="MoreHorizontal"
                iconPosition="left"
                onClick={() => setShowBulkActions(!showBulkActions)}
              >
                Bulk Actions ({selectedSessions.length})
              </Button>
              
              {showBulkActions && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowBulkActions(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleBulkAction('export')}
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Icon name="Download" size={14} className="mr-2" />
                        Export Selected
                      </button>
                      <button
                        onClick={() => handleBulkAction('archive')}
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Icon name="Archive" size={14} className="mr-2" />
                        Archive Selected
                      </button>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Icon name="Trash2" size={14} className="mr-2" />
                        Delete Selected
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Section - Filters and View Options */}
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-text-secondary" />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Sort by..."
              className="w-40"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-text-secondary" />
            <Select
              options={filterOptions}
              value={filterBy}
              onChange={onFilterChange}
              placeholder="Filter..."
              className="w-40"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            {viewModeOptions.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onViewModeChange(mode.value)}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === mode.value
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title={mode.label}
              >
                <Icon name={mode.icon} size={16} />
              </button>
            ))}
          </div>

          {/* Advanced Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Search"
            iconSize={16}
            title="Advanced Search"
          />

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={16}
            title="Session Settings"
          />
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="MessageSquare" size={14} />
            <span>Total Sessions: 24</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Active Today: 3</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Archive" size={14} />
            <span>Archived: 8</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={14}
            title="Refresh"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="HelpCircle"
            iconSize={14}
            title="Help"
          />
        </div>
      </div>
    </div>
  );
};

export default SessionToolbar;