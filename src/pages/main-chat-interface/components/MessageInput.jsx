import React, { useState, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Send, Paperclip, X } from 'lucide-react';

const MessageInput = ({ onSendMessage, isLoading, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSendMessage({ content: message.trim() });
      setMessage('');
      setSelectedFile(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-border bg-surface p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* File Upload Area */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Paperclip size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{selectedFile.name}</span>
              <span className="text-xs text-blue-600">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-blue-600 hover:text-blue-800 p-1"
            >
              <X size={16} />
            </Button>
          </div>
        )}

        {/* Message Input */}
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Shift+Enter for new line)"
              className="w-full p-3 pr-12 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>

          {/* File Upload Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            className="flex-shrink-0 p-3"
            title="Attach file"
          >
            <Paperclip size={16} />
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={(!message.trim() && !selectedFile) || isLoading}
            className="flex-shrink-0 p-3"
          >
            <Send size={16} />
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        {/* Help Text */}
        <div className="text-xs text-text-secondary text-center">
          <span>📎 Supported: Images (OCR), PDFs, Word, Excel, Text files</span>
          <br />
          <span>💡 Use Shift+Enter for new lines, Enter to send</span>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;