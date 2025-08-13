import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySettings = () => {
  const [dataRetention, setDataRetention] = useState('30');
  const [autoDelete, setAutoDelete] = useState(true);
  const [encryptStorage, setEncryptStorage] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(false);
  const [remoteBackup, setRemoteBackup] = useState(false);
  const [sessionPersistence, setSessionPersistence] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);
  const [totalConversations, setTotalConversations] = useState(0);

  const retentionOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' },
    { value: 'never', label: 'Never delete' }
  ];

  useEffect(() => {
    // Load privacy settings
    const savedRetention = localStorage.getItem('aria-data-retention') || '30';
    const savedAutoDelete = localStorage.getItem('aria-auto-delete') !== 'false';
    const savedEncrypt = localStorage.getItem('aria-encrypt-storage') !== 'false';
    const savedAnalytics = localStorage.getItem('aria-share-analytics') === 'true';
    const savedBackup = localStorage.getItem('aria-remote-backup') === 'true';
    const savedPersistence = localStorage.getItem('aria-session-persistence') !== 'false';

    setDataRetention(savedRetention);
    setAutoDelete(savedAutoDelete);
    setEncryptStorage(savedEncrypt);
    setShareAnalytics(savedAnalytics);
    setRemoteBackup(savedBackup);
    setSessionPersistence(savedPersistence);

    // Calculate storage usage
    calculateStorageUsage();
  }, []);

  const calculateStorageUsage = () => {
    let totalSize = 0;
    let conversationCount = 0;

    // Calculate localStorage usage
    for (let key in localStorage) {
      if (key.startsWith('aria-')) {
        totalSize += localStorage[key].length;
        if (key.startsWith('aria-conversation-')) {
          conversationCount++;
        }
      }
    }

    setStorageUsed(Math.round(totalSize / 1024)); // Convert to KB
    setTotalConversations(conversationCount);
  };

  const saveSetting = (key, value) => {
    localStorage.setItem(`aria-${key}`, value.toString());
  };

  const handleExportData = () => {
    const data = {};
    
    // Collect all ARIA data
    for (let key in localStorage) {
      if (key.startsWith('aria-')) {
        data[key] = localStorage[key];
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aria-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Import data to localStorage
        Object.keys(data).forEach(key => {
          if (key.startsWith('aria-')) {
            localStorage.setItem(key, data[key]);
          }
        });

        calculateStorageUsage();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete all conversation data? This action cannot be undone.')) {
      // Remove all ARIA data
      const keysToRemove = [];
      for (let key in localStorage) {
        if (key.startsWith('aria-conversation-') || key.startsWith('aria-session-')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      calculateStorageUsage();
      alert('All conversation data has been deleted.');
    }
  };

  const handleClearOldData = () => {
    const retentionDays = parseInt(dataRetention);
    if (retentionDays === 0) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    let deletedCount = 0;
    const keysToRemove = [];

    for (let key in localStorage) {
      if (key.startsWith('aria-conversation-')) {
        try {
          const data = JSON.parse(localStorage[key]);
          const createdDate = new Date(data.createdAt || 0);
          
          if (createdDate < cutoffDate) {
            keysToRemove.push(key);
            deletedCount++;
          }
        } catch (error) {
          // Invalid data, remove it
          keysToRemove.push(key);
          deletedCount++;
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    calculateStorageUsage();
    
    if (deletedCount > 0) {
      alert(`Deleted ${deletedCount} old conversations.`);
    } else {
      alert('No old conversations found to delete.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Data Storage */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Data Storage</h3>
        <p className="text-sm text-text-secondary mb-4">Manage how your conversation data is stored</p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="HardDrive" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">Storage Used</span>
              </div>
              <p className="text-lg font-semibold text-text-primary">{storageUsed} KB</p>
              <p className="text-xs text-text-secondary">{totalConversations} conversations stored</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm font-medium text-text-primary">Security Status</span>
              </div>
              <p className="text-sm text-success">Local Storage Only</p>
              <p className="text-xs text-text-secondary">Data never leaves your device</p>
            </div>
          </div>

          <Select
            label="Data Retention Period"
            description="Automatically delete conversations older than this period"
            options={retentionOptions}
            value={dataRetention}
            onChange={(value) => {
              setDataRetention(value);
              saveSetting('data-retention', value);
            }}
          />

          <Checkbox
            label="Auto-delete old conversations"
            description="Automatically remove conversations based on retention period"
            checked={autoDelete}
            onChange={(e) => {
              setAutoDelete(e.target.checked);
              saveSetting('auto-delete', e.target.checked);
            }}
          />

          <Checkbox
            label="Encrypt local storage"
            description="Encrypt conversation data stored on your device"
            checked={encryptStorage}
            onChange={(e) => {
              setEncryptStorage(e.target.checked);
              saveSetting('encrypt-storage', e.target.checked);
            }}
          />
        </div>
      </div>

      {/* Session Management */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Session Management</h3>
        <p className="text-sm text-text-secondary mb-4">Control how sessions are handled</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Persist sessions across browser restarts"
            description="Remember your conversation context when you close and reopen the browser"
            checked={sessionPersistence}
            onChange={(e) => {
              setSessionPersistence(e.target.checked);
              saveSetting('session-persistence', e.target.checked);
            }}
          />
        </div>
      </div>

      {/* Data Sharing */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Data Sharing</h3>
        <p className="text-sm text-text-secondary mb-4">Control what data is shared for improvement</p>
        
        <div className="space-y-4">
          <Checkbox
            label="Share anonymous usage analytics"
            description="Help improve ARIA by sharing anonymous usage statistics"
            checked={shareAnalytics}
            onChange={(e) => {
              setShareAnalytics(e.target.checked);
              saveSetting('share-analytics', e.target.checked);
            }}
          />

          <Checkbox
            label="Enable remote backup"
            description="Backup conversations to encrypted cloud storage (requires account)"
            checked={remoteBackup}
            onChange={(e) => {
              setRemoteBackup(e.target.checked);
              saveSetting('remote-backup', e.target.checked);
            }}
          />
        </div>
      </div>

      {/* Data Management Actions */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Data Management</h3>
        <p className="text-sm text-text-secondary mb-4">Export, import, or delete your data</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              iconName="Download"
              iconPosition="left"
              fullWidth
            >
              Export All Data
            </Button>
            
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-data"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-data').click()}
                iconName="Upload"
                iconPosition="left"
                fullWidth
              >
                Import Data
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleClearOldData}
              iconName="Trash2"
              iconPosition="left"
              fullWidth
            >
              Clear Old Data
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleClearAllData}
              iconName="AlertTriangle"
              iconPosition="left"
              fullWidth
            >
              Delete All Data
            </Button>
          </div>
        </div>
      </div>

      {/* Ollama Connection Security */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Connection Security</h3>
        <p className="text-sm text-text-secondary mb-4">Ollama backend connection settings</p>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Server" size={16} className="text-success" />
            <span className="text-sm font-medium text-text-primary">Local Connection</span>
          </div>
          <p className="text-xs text-text-secondary mb-2">
            Connected to Ollama at localhost:11434
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-success">Secure local connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;