import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingStatus = ({ currentProcessing, processingQueue, systemStatus }) => {
  const getQueueStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-warning bg-warning/10';
      case 'completed': return 'text-success bg-success/10';
      case 'failed': return 'text-error bg-error/10';
      case 'pending': return 'text-text-secondary bg-muted';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getQueueStatusIcon = (status) => {
    switch (status) {
      case 'processing': return 'Loader';
      case 'completed': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'pending': return 'Clock';
      default: return 'Clock';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">PDF Parser</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                systemStatus.pdfParser === 'online' ? 'bg-success' : 'bg-error'
              }`} />
              <span className={`text-xs font-medium ${
                systemStatus.pdfParser === 'online' ? 'text-success' : 'text-error'
              }`}>
                {systemStatus.pdfParser === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Text Extractor</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                systemStatus.textExtractor === 'online' ? 'bg-success' : 'bg-error'
              }`} />
              <span className={`text-xs font-medium ${
                systemStatus.textExtractor === 'online' ? 'text-success' : 'text-error'
              }`}>
                {systemStatus.textExtractor === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">RAG Indexer</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                systemStatus.ragIndexer === 'online' ? 'bg-success' : 'bg-error'
              }`} />
              <span className={`text-xs font-medium ${
                systemStatus.ragIndexer === 'online' ? 'text-success' : 'text-error'
              }`}>
                {systemStatus.ragIndexer === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Processing */}
      {currentProcessing && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Currently Processing</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={16} className="text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {currentProcessing.filename}
                </p>
                <p className="text-xs text-text-secondary">
                  {currentProcessing.stage}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Progress</span>
                <span className="text-xs font-medium text-text-primary">
                  {currentProcessing.progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentProcessing.progress}%` }}
                />
              </div>
            </div>
            <div className="text-xs text-text-secondary">
              ETA: {currentProcessing.eta}
            </div>
          </div>
        </div>
      )}

      {/* Processing Queue */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Processing Queue ({processingQueue.length})
        </h3>
        {processingQueue.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No files in queue</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {processingQueue.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30"
              >
                <div className="flex-shrink-0">
                  <Icon 
                    name={getQueueStatusIcon(item.status)} 
                    size={14} 
                    className={`${item.status === 'processing' ? 'animate-spin' : ''} ${
                      item.status === 'processing' ? 'text-warning' :
                      item.status === 'completed' ? 'text-success' :
                      item.status === 'failed' ? 'text-error' : 'text-text-secondary'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {item.filename}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Position: {index + 1}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getQueueStatusColor(item.status)}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processing Statistics */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              {processingQueue.filter(item => item.status === 'completed').length}
            </div>
            <div className="text-xs text-text-secondary">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-warning">
              {processingQueue.filter(item => item.status === 'processing').length}
            </div>
            <div className="text-xs text-text-secondary">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-secondary">
              {processingQueue.filter(item => item.status === 'pending').length}
            </div>
            <div className="text-xs text-text-secondary">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-error">
              {processingQueue.filter(item => item.status === 'failed').length}
            </div>
            <div className="text-xs text-text-secondary">Failed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;