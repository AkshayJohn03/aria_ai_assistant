import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContextManager = ({ documents, selectedDocuments, onSelectionChange, contextStats }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const availableDocuments = documents.filter(doc => 
    doc.status === 'processed' && 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    const allIds = availableDocuments.map(doc => doc.id);
    onSelectionChange(allIds);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleToggleDocument = (docId) => {
    const newSelection = selectedDocuments.includes(docId)
      ? selectedDocuments.filter(id => id !== docId)
      : [...selectedDocuments, docId];
    onSelectionChange(newSelection);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Context Manager</h3>
            <p className="text-xs text-text-secondary">
              {selectedDocuments.length} of {availableDocuments.length} documents selected
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            className="p-2"
          />
        </div>
      </div>

      {/* Context Statistics */}
      <div className="p-4 bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {contextStats.totalTokens.toLocaleString()}
            </div>
            <div className="text-xs text-text-secondary">Total Tokens</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {formatBytes(contextStats.totalSize)}
            </div>
            <div className="text-xs text-text-secondary">Context Size</div>
          </div>
        </div>
        
        {contextStats.totalTokens > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <span>Context Usage</span>
              <span>{Math.round((contextStats.totalTokens / contextStats.maxTokens) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  contextStats.totalTokens / contextStats.maxTokens > 0.8
                    ? 'bg-error'
                    : contextStats.totalTokens / contextStats.maxTokens > 0.6
                    ? 'bg-warning' :'bg-success'
                }`}
                style={{ width: `${Math.min((contextStats.totalTokens / contextStats.maxTokens) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search and Controls */}
          <div className="space-y-3">
            <div className="relative">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={availableDocuments.length === 0}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={selectedDocuments.length === 0}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
              <span className="text-xs text-text-secondary">
                {availableDocuments.length} available
              </span>
            </div>
          </div>

          {/* Document List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableDocuments.length === 0 ? (
              <div className="text-center py-6">
                <Icon name="FileText" size={24} className="text-text-secondary mx-auto mb-2" />
                <p className="text-sm text-text-secondary">
                  {searchTerm ? 'No documents match your search' : 'No processed documents available'}
                </p>
              </div>
            ) : (
              availableDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-150 cursor-pointer hover:bg-muted/30 ${
                    selectedDocuments.includes(doc.id)
                      ? 'border-primary bg-primary/5' :'border-border'
                  }`}
                  onClick={() => handleToggleDocument(doc.id)}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedDocuments.includes(doc.id)
                        ? 'border-primary bg-primary' :'border-border bg-background'
                    }`}>
                      {selectedDocuments.includes(doc.id) && (
                        <Icon name="Check" size={10} className="text-white" />
                      )}
                    </div>
                  </div>
                  
                  <Icon 
                    name={doc.type === 'pdf' ? 'FileText' : 'File'} 
                    size={16} 
                    className={doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'} 
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {doc.filename}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <span>{doc.metadata?.pageCount} pages</span>
                      <span>•</span>
                      <span>{doc.metadata?.wordCount} words</span>
                      <span>•</span>
                      <span>{formatBytes(doc.size)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="text-xs text-text-secondary">
                      ~{Math.round(doc.metadata?.tokenCount / 1000)}k tokens
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextManager;