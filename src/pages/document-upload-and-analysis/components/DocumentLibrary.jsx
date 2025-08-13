import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentLibrary = ({ documents, onPreview, onDelete, onReanalyze, onToggleContext }) => {
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'text-success bg-success/10';
      case 'processing': return 'text-warning bg-warning/10';
      case 'failed': return 'text-error bg-error/10';
      case 'pending': return 'text-text-secondary bg-muted';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed': return 'CheckCircle';
      case 'processing': return 'Loader';
      case 'failed': return 'XCircle';
      case 'pending': return 'Clock';
      default: return 'Clock';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'uploadDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Document Library</h2>
            <p className="text-sm text-text-secondary">
              {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {sortedDocuments.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Icon name="FileText" size={32} className="text-text-secondary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No documents found</h3>
          <p className="text-text-secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('filename')}
                    className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                  >
                    <span>Name</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('size')}
                    className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                  >
                    <span>Size</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('uploadDate')}
                    className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary"
                  >
                    <span>Upload Date</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-sm font-medium text-text-primary">Status</span>
                </th>
                <th className="text-left p-4">
                  <span className="text-sm font-medium text-text-primary">Context</span>
                </th>
                <th className="text-right p-4">
                  <span className="text-sm font-medium text-text-primary">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDocuments.map((doc) => (
                <tr key={doc.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={doc.type === 'pdf' ? 'FileText' : 'File'} 
                        size={20} 
                        className={doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'} 
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary truncate max-w-xs">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {doc.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-text-secondary">
                      {formatFileSize(doc.size)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-text-secondary">
                      {formatDate(doc.uploadDate)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      <Icon 
                        name={getStatusIcon(doc.status)} 
                        size={12} 
                        className={doc.status === 'processing' ? 'animate-spin' : ''} 
                      />
                      <span className="capitalize">{doc.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onToggleContext(doc.id)}
                      className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                        doc.inContext 
                          ? 'bg-primary' :'bg-muted border border-border'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        doc.inContext ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(doc)}
                        iconName="Eye"
                        iconSize={14}
                        className="p-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReanalyze(doc.id)}
                        iconName="RefreshCw"
                        iconSize={14}
                        className="p-2"
                        disabled={doc.status === 'processing'}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(doc.id)}
                        iconName="Trash2"
                        iconSize={14}
                        className="p-2 text-error hover:text-error hover:bg-error/10"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;