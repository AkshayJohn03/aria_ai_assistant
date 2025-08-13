import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentPreview = ({ document, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  if (!document) return null;

  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-warning/30 text-warning-foreground">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredContent = document.extractedContent?.filter(section =>
    section.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon 
              name={document.type === 'pdf' ? 'FileText' : 'File'} 
              size={24} 
              className={document.type === 'pdf' ? 'text-red-500' : 'text-blue-500'} 
            />
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {document.filename}
              </h2>
              <p className="text-sm text-text-secondary">
                {document.metadata?.pageCount} pages • {document.metadata?.wordCount} words
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="p-2"
          />
        </div>

        {/* Search and Controls */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search in document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                iconPosition="left"
                iconSize={16}
              >
                Copy Text
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {document.metadata?.summary && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="text-sm font-semibold text-primary mb-2">Document Summary</h3>
                <p className="text-sm text-text-primary leading-relaxed">
                  {document.metadata.summary}
                </p>
              </div>
            )}

            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {searchTerm ? 'No matches found' : 'No content available'}
                </h3>
                <p className="text-text-secondary">
                  {searchTerm 
                    ? 'Try adjusting your search terms' :'Document content is still being processed'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredContent.map((section, index) => (
                  <div key={index} className="space-y-3">
                    {section.heading && (
                      <h3 className="text-base font-semibold text-text-primary border-b border-border pb-2">
                        {highlightText(section.heading, searchTerm)}
                      </h3>
                    )}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                        {highlightText(section.text, searchTerm)}
                      </p>
                    </div>
                    {section.pageNumber && (
                      <div className="text-xs text-text-secondary">
                        Page {section.pageNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              {searchTerm && (
                <span>
                  {filteredContent.length} result{filteredContent.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                Processed: {new Date(document.processedDate).toLocaleDateString()}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                document.ragIndexed ? 'bg-success' : 'bg-warning'
              }`} />
              <span className="text-xs text-text-secondary">
                {document.ragIndexed ? 'Indexed' : 'Indexing...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;