import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageInput = ({ onSendMessage, isProcessing, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() || attachedFiles.length > 0) {
      onSendMessage({
        content: message.trim(),
        attachments: attachedFiles
      });
      setMessage('');
      setAttachedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setAttachedFiles(prev => [...prev, ...newFiles]);
    onFileUpload(newFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll just simulate transcription
        setTimeout(() => {
          setMessage(prev => prev + " [Transcribed audio content would appear here]");
        }, 1000);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border-t border-border bg-surface p-4">
      {/* File Attachments */}
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedFiles.map((file) => (
            <div key={file.id} className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
              <Icon name="Paperclip" size={14} className="text-text-secondary" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text-primary truncate max-w-32">
                  {file.name}
                </span>
                <span className="text-xs text-text-secondary">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
                iconName="X"
                iconSize={12}
                className="p-1 hover:bg-destructive/10 hover:text-destructive"
              />
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-3">
        {/* File Upload Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          iconName="Paperclip"
          iconSize={18}
          className="p-2 flex-shrink-0"
          disabled={isProcessing}
        />
        
        {/* Voice Recording Button */}
        <Button
          variant={isRecording ? "destructive" : "ghost"}
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          iconName={isRecording ? "Square" : "Mic"}
          iconSize={18}
          className={`p-2 flex-shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
          disabled={isProcessing}
        />

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isProcessing ? "AI is thinking..." : "Type your message... (Shift+Enter for new line)"}
            disabled={isProcessing}
            className="w-full px-4 py-3 pr-12 text-sm bg-muted border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-200 disabled:opacity-50"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Character Count */}
          {message.length > 0 && (
            <div className="absolute bottom-2 right-14 text-xs text-text-secondary">
              {message.length}
            </div>
          )}
        </div>

        {/* Send Button */}
        <Button
          variant="default"
          size="sm"
          onClick={handleSend}
          disabled={(!message.trim() && attachedFiles.length === 0) || isProcessing}
          loading={isProcessing}
          iconName="Send"
          iconSize={18}
          className="p-3 flex-shrink-0"
        />
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.doc,.docx,.md"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center space-x-2 text-sm text-destructive">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
          <span>Recording... Click stop when finished</span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;