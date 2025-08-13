import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import SessionTree from './components/SessionTree';
import SessionDetails from './components/SessionDetails';
import SessionToolbar from './components/SessionToolbar';
import SessionGridView from './components/SessionGridView';
import Icon from '../../components/AppIcon';


const SessionManagementDashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('tree');
  const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock session data
  const mockSessions = [
    {
      id: 'session-001',
      title: 'Strategic Planning Discussion',
      summary: `Comprehensive analysis of Q4 business strategy involving multiple AI models for strategic thinking, logical analysis, and philosophical insights. Discussion covered market expansion, resource allocation, and competitive positioning.`,
      folder: 'projects',
      status: 'active',
      messageCount: 127,
      duration: 185, // minutes
      size: 2048576, // bytes
      createdAt: '2025-01-20T09:30:00Z',
      lastActivity: '2025-01-27T13:45:00Z',
      models: [
        { name: 'Mythomax', type: 'Strategic', responseCount: 42, totalTime: 65 },
        { name: 'DeepSeek R1', type: 'Logical', responseCount: 38, totalTime: 58 },
        { name: 'Dark Champion', type: 'Philosophical', responseCount: 47, totalTime: 62 }
      ],
      tags: ['business', 'strategy', 'planning', 'Q4'],
      insights: [
        {
          title: 'Market Opportunity Analysis',
          content: `The council identified three key market opportunities with high potential ROI. Focus should be on digital transformation services and AI integration consulting.`,
          model: 'Mythomax'
        },
        {
          title: 'Resource Optimization Strategy',
          content: `Logical analysis suggests reallocating 30% of current resources to high-growth segments while maintaining operational efficiency.`,
          model: 'DeepSeek R1'
        }
      ]
    },
    {
      id: 'session-002',
      title: 'Technical Architecture Review',
      summary: `Deep technical discussion about system architecture, scalability concerns, and implementation strategies for the new AI assistant platform.`,
      folder: 'projects',
      status: 'completed',
      messageCount: 89,
      duration: 142,
      size: 1536000,
      createdAt: '2025-01-25T14:20:00Z',
      lastActivity: '2025-01-26T16:30:00Z',
      models: [
        { name: 'DeepSeek R1', type: 'Logical', responseCount: 45, totalTime: 78 },
        { name: 'Qwen2.5', type: 'Technical', responseCount: 44, totalTime: 64 }
      ],
      tags: ['technical', 'architecture', 'scalability'],
      insights: [
        {
          title: 'Scalability Recommendations',
          content: `Microservices architecture with containerization will provide the flexibility needed for future growth and feature additions.`,
          model: 'DeepSeek R1'
        }
      ]
    },
    {
      id: 'session-003',
      title: 'Creative Brainstorming Session',
      summary: `Collaborative ideation session exploring innovative features and user experience improvements for the AI assistant interface.`,
      folder: 'recent',
      status: 'active',
      messageCount: 156,
      duration: 203,
      size: 2867200,
      createdAt: '2025-01-26T10:15:00Z',
      lastActivity: '2025-01-27T14:20:00Z',
      models: [
        { name: 'Dark Champion', type: 'Philosophical', responseCount: 52, totalTime: 89 },
        { name: 'Mythomax', type: 'Strategic', responseCount: 48, totalTime: 67 },
        { name: 'DeepSeek R1', type: 'Logical', responseCount: 56, totalTime: 47 }
      ],
      tags: ['creative', 'brainstorming', 'UX', 'innovation'],
      insights: [
        {
          title: 'User Experience Innovation',
          content: `The philosophical perspective suggests implementing adaptive UI that learns from user behavior patterns and preferences.`,
          model: 'Dark Champion'
        }
      ]
    },
    {
      id: 'session-004',
      title: 'Document Analysis - Research Papers',
      summary: `Analysis of multiple research papers on AI ethics, model alignment, and responsible AI development practices.`,
      folder: 'recent',
      status: 'paused',
      messageCount: 73,
      duration: 98,
      size: 1234567,
      createdAt: '2025-01-27T08:00:00Z',
      lastActivity: '2025-01-27T11:30:00Z',
      models: [
        { name: 'DeepSeek R1', type: 'Logical', responseCount: 35, totalTime: 52 },
        { name: 'Dark Champion', type: 'Philosophical', responseCount: 38, totalTime: 46 }
      ],
      tags: ['research', 'ethics', 'AI', 'analysis']
    },
    {
      id: 'session-005',
      title: 'Quick Code Review',
      summary: `Fast mode session for reviewing React components and providing optimization suggestions.`,
      folder: 'recent',
      status: 'completed',
      messageCount: 23,
      duration: 35,
      size: 456789,
      createdAt: '2025-01-27T12:00:00Z',
      lastActivity: '2025-01-27T12:35:00Z',
      models: [
        { name: 'Qwen2.5', type: 'Technical', responseCount: 23, totalTime: 35 }
      ],
      tags: ['code', 'review', 'react', 'optimization']
    },
    {
      id: 'session-006',
      title: 'Business Model Innovation',
      summary: `Strategic discussion about new revenue streams and business model innovations for AI-powered services.`,
      folder: 'archived',
      status: 'completed',
      messageCount: 94,
      duration: 167,
      size: 1789012,
      createdAt: '2025-01-15T16:45:00Z',
      lastActivity: '2025-01-16T19:30:00Z',
      models: [
        { name: 'Mythomax', type: 'Strategic', responseCount: 47, totalTime: 89 },
        { name: 'Dark Champion', type: 'Philosophical', responseCount: 47, totalTime: 78 }
      ],
      tags: ['business', 'innovation', 'revenue', 'strategy']
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setSessions(mockSessions);
      setSelectedSession(mockSessions[0]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
  };

  const handleCreateSession = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      title: 'New Session',
      summary: 'A new conversation session ready for AI collaboration.',
      folder: 'recent',
      status: 'active',
      messageCount: 0,
      duration: 0,
      size: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      models: [],
      tags: [],
      insights: []
    };
    
    setSessions(prev => [newSession, ...prev]);
    setSelectedSession(newSession);
  };

  const handleDeleteSession = (session) => {
    if (window.confirm(`Are you sure you want to delete "${session.title}"?`)) {
      setSessions(prev => prev.filter(s => s.id !== session.id));
      if (selectedSession?.id === session.id) {
        setSelectedSession(sessions[0] || null);
      }
    }
  };

  const handleRenameSession = (session) => {
    const newTitle = prompt('Enter new session title:', session.title);
    if (newTitle && newTitle.trim()) {
      setSessions(prev => prev.map(s => 
        s.id === session.id ? { ...s, title: newTitle.trim() } : s
      ));
    }
  };

  const handleArchiveSession = (session) => {
    setSessions(prev => prev.map(s => 
      s.id === session.id ? { ...s, folder: 'archived', status: 'completed' } : s
    ));
  };

  const handleDuplicateSession = (session) => {
    const duplicatedSession = {
      ...session,
      id: `session-${Date.now()}`,
      title: `${session.title} (Copy)`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active'
    };
    
    setSessions(prev => [duplicatedSession, ...prev]);
    setSelectedSession(duplicatedSession);
  };

  const handleExportSession = (sessionId, format) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const exportData = {
      session,
      exportedAt: new Date().toISOString(),
      format
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: format === 'json' ? 'application/json' : 'text/plain'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateSession = (sessionId, updates) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, ...updates } : s
    ));
  };

  const handleBulkDelete = (sessionIds) => {
    if (window.confirm(`Are you sure you want to delete ${sessionIds.length} sessions?`)) {
      setSessions(prev => prev.filter(s => !sessionIds.includes(s.id)));
      setSelectedSessions([]);
    }
  };

  const handleBulkArchive = (sessionIds) => {
    setSessions(prev => prev.map(s => 
      sessionIds.includes(s.id) ? { ...s, folder: 'archived', status: 'completed' } : s
    ));
    setSelectedSessions([]);
  };

  const handleBulkExport = (sessionIds) => {
    const sessionsToExport = sessions.filter(s => sessionIds.includes(s.id));
    const exportData = {
      sessions: sessionsToExport,
      exportedAt: new Date().toISOString(),
      count: sessionsToExport.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_sessions_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMergeSessions = (sessionIds) => {
    // Implementation for merging sessions
    console.log('Merging sessions:', sessionIds);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-60 pt-16">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
                <p className="text-text-secondary">Loading sessions...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-60 pt-16">
          {/* Breadcrumb */}
          <div className="bg-surface border-b border-border px-6 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate('/main-chat-interface')}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                Home
              </button>
              <Icon name="ChevronRight" size={14} className="text-text-secondary" />
              <span className="text-text-primary font-medium">Session Management</span>
            </div>
          </div>

          {/* Toolbar */}
          <SessionToolbar
            selectedSessions={selectedSessions}
            onCreateSession={handleCreateSession}
            onBulkDelete={handleBulkDelete}
            onBulkArchive={handleBulkArchive}
            onBulkExport={handleBulkExport}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <div className="flex h-[calc(100vh-180px)]">
            {/* Left Panel - Session Tree or Grid */}
            {viewMode === 'tree' ? (
              <div className={`transition-all duration-300 ${isTreeCollapsed ? 'w-0' : 'w-80'} border-r border-border`}>
                <SessionTree
                  sessions={sessions}
                  selectedSession={selectedSession}
                  onSessionSelect={handleSessionSelect}
                  onCreateSession={handleCreateSession}
                  onDeleteSession={handleDeleteSession}
                  onRenameSession={handleRenameSession}
                  onArchiveSession={handleArchiveSession}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  isCollapsed={isTreeCollapsed}
                  onToggleCollapse={() => setIsTreeCollapsed(!isTreeCollapsed)}
                />
              </div>
            ) : null}

            {/* Main Content Area */}
            <div className="flex-1 flex">
              {viewMode === 'grid' ? (
                <div className="flex-1 overflow-y-auto">
                  <SessionGridView
                    sessions={sessions}
                    selectedSession={selectedSession}
                    onSessionSelect={handleSessionSelect}
                    onDeleteSession={handleDeleteSession}
                    onArchiveSession={handleArchiveSession}
                    onDuplicateSession={handleDuplicateSession}
                    searchQuery={searchQuery}
                  />
                </div>
              ) : (
                <SessionDetails
                  session={selectedSession}
                  onExportSession={handleExportSession}
                  onDuplicateSession={handleDuplicateSession}
                  onMergeSessions={handleMergeSessions}
                  onUpdateSession={handleUpdateSession}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SessionManagementDashboard;