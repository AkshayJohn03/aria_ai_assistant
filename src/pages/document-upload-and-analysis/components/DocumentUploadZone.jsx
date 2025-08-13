import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentUploadZone = ({ onFileUpload, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const supportedTypes = [
    { type: 'PDF', extension: '.pdf', icon: 'FileText', color: 'text-red-500' },
    { type: 'TXT', extension: '.txt', icon: 'File', color: 'text-blue-500' }
  ];

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || file.type === 'text/plain'
    );
    if (validFiles.length > 0) {
      onFileUpload(validFiles);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Upload Documents</h2>
        <p className="text-sm text-text-secondary">
          Upload PDF and text files to enhance your AI conversations with document context
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : isUploading
            ? 'border-warning bg-warning/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-warning/10 rounded-full flex items-center justify-center">
              <Icon name="Upload" size={24} className="text-warning animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary">Uploading files...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Upload" size={24} className="text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-base font-medium text-text-primary">
                Drag and drop files here, or{' '}
                <button
                  onClick={handleBrowseClick}
                  className="text-primary hover:text-primary/80 underline"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-text-secondary">
                Maximum file size: 10MB per file
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-text-primary mb-3">Supported File Types</h3>
        <div className="grid grid-cols-2 gap-3">
          {supportedTypes.map((type) => (
            <div
              key={type.type}
              className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
            >
              <Icon name={type.icon} size={20} className={type.color} />
              <div>
                <p className="text-sm font-medium text-text-primary">{type.type}</p>
                <p className="text-xs text-text-secondary">{type.extension}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handleBrowseClick}
          iconName="FolderOpen"
          iconPosition="left"
          disabled={isUploading}
          className="flex-1"
        >
          Browse Files
        </Button>
        <Button
          variant="secondary"
          iconName="HardDrive"
          iconPosition="left"
          disabled={isUploading}
          className="flex-1"
        >
          Batch Upload
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadZone;