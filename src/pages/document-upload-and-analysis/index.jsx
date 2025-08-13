import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DocumentUploadZone from './components/DocumentUploadZone';
import DocumentLibrary from './components/DocumentLibrary';
import ProcessingStatus from './components/ProcessingStatus';
import DocumentPreview from './components/DocumentPreview';
import ContextManager from './components/ContextManager';

const DocumentUploadAndAnalysis = () => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [currentProcessing, setCurrentProcessing] = useState(null);
  const [processingQueue, setProcessingQueue] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    pdfParser: 'online',
    textExtractor: 'online',
    ragIndexer: 'online'
  });

  // Mock data for documents
  const mockDocuments = [
    {
      id: 1,
      filename: "AI_Research_Paper_2024.pdf",
      type: "pdf",
      size: 2457600,
      uploadDate: "2025-01-27T10:30:00Z",
      status: "processed",
      inContext: true,
      ragIndexed: true,
      processedDate: "2025-01-27T10:35:00Z",
      metadata: {
        pageCount: 24,
        wordCount: 8500,
        tokenCount: 12750,
        summary: `This research paper explores the latest developments in artificial intelligence, focusing on large language models and their applications in various domains. The study presents novel approaches to model training, fine-tuning techniques, and performance optimization strategies that have shown significant improvements in both accuracy and efficiency.`
      },
      extractedContent: [
        {
          heading: "Abstract",
          text: `Recent advances in artificial intelligence have led to the development of increasingly sophisticated language models capable of understanding and generating human-like text. This paper presents a comprehensive analysis of current AI methodologies, examining their strengths, limitations, and potential applications across various industries.\n\nOur research focuses on three key areas: model architecture improvements, training optimization techniques, and real-world deployment strategies. Through extensive experimentation and analysis, we demonstrate significant performance gains in natural language processing tasks while maintaining computational efficiency.`,
          pageNumber: 1
        },
        {
          heading: "Introduction",
          text: `The field of artificial intelligence has experienced unprecedented growth in recent years, with language models becoming increasingly central to numerous applications. From chatbots and virtual assistants to content generation and code completion, AI systems are transforming how we interact with technology.\n\nThis transformation has been driven by several key factors: the availability of large-scale datasets, improvements in computational infrastructure, and breakthrough developments in neural network architectures. However, challenges remain in areas such as model interpretability, bias mitigation, and efficient deployment at scale.`,
          pageNumber: 2
        },
        {
          heading: "Methodology",
          text: `Our research methodology combines theoretical analysis with practical experimentation. We evaluated multiple model architectures using standardized benchmarks and real-world datasets to assess performance across various metrics including accuracy, latency, and resource utilization.\n\nThe experimental setup included controlled testing environments with consistent hardware configurations to ensure reproducible results. We also implemented comprehensive logging and monitoring systems to track model behavior during training and inference phases.`,
          pageNumber: 5
        }
      ]
    },
    {
      id: 2,
      filename: "Project_Requirements.txt",
      type: "txt",
      size: 15360,
      uploadDate: "2025-01-27T09:15:00Z",
      status: "processed",
      inContext: false,
      ragIndexed: true,
      processedDate: "2025-01-27T09:16:00Z",
      metadata: {
        pageCount: 1,
        wordCount: 2400,
        tokenCount: 3600,
        summary: "Detailed project requirements document outlining system specifications, functional requirements, and technical constraints for the ARIA AI Assistant development project."
      },
      extractedContent: [
        {
          text: `ARIA AI Assistant - Project Requirements Document\n\nVersion: 1.0\nDate: January 27, 2025\nAuthor: Development Team\n\n1. PROJECT OVERVIEW\nThe ARIA AI Assistant is an advanced conversational AI system designed to provide users with powerful, uncensored, locally-running AI assistance. The system offers both instant responses and deep collaborative thinking through multiple AI model consultation while maintaining complete privacy and customization control.\n\n2. FUNCTIONAL REQUIREMENTS\n- Speech-to-text microphone input with real-time transcription\n- File upload system supporting PDF and text document parsing\n- Fast Mode toggle using lightweight models for instant responses\n- Deep Think Mode enabling council-based deliberation with 3 AI personalities\n- Conversational memory persistence across browser sessions\n- Temperature slider for adjustable AI creativity levels\n- Custom system instruction editor with session-specific prompt customization`,
          pageNumber: 1
        }
      ]
    },
    {
      id: 3,
      filename: "Technical_Specifications.pdf",
      type: "pdf",
      size: 1843200,
      uploadDate: "2025-01-27T08:45:00Z",
      status: "processing",
      inContext: false,
      ragIndexed: false,
      processedDate: null,
      metadata: {
        pageCount: 18,
        wordCount: 6200,
        tokenCount: 9300,
        summary: null
      },
      extractedContent: []
    },
    {
      id: 4,
      filename: "Meeting_Notes_Jan_2025.txt",
      type: "txt",
      size: 8192,
      uploadDate: "2025-01-26T16:20:00Z",
      status: "failed",
      inContext: false,
      ragIndexed: false,
      processedDate: null,
      metadata: {
        pageCount: 1,
        wordCount: 1200,
        tokenCount: 1800,
        summary: null
      },
      extractedContent: []
    }
  ];

  // Mock processing queue
  const mockProcessingQueue = [
    {
      id: 3,
      filename: "Technical_Specifications.pdf",
      status: "processing"
    },
    {
      id: 5,
      filename: "User_Manual_Draft.pdf",
      status: "pending"
    }
  ];

  // Mock current processing
  const mockCurrentProcessing = {
    filename: "Technical_Specifications.pdf",
    stage: "Extracting text content",
    progress: 65,
    eta: "2 minutes"
  };

  // Initialize mock data
  useEffect(() => {
    setDocuments(mockDocuments);
    setProcessingQueue(mockProcessingQueue);
    setCurrentProcessing(mockCurrentProcessing);
    setSelectedDocuments([1]); // Pre-select first document
  }, []);

  // Calculate context statistics
  const contextStats = {
    totalTokens: documents
      .filter(doc => selectedDocuments.includes(doc.id))
      .reduce((sum, doc) => sum + (doc.metadata?.tokenCount || 0), 0),
    totalSize: documents
      .filter(doc => selectedDocuments.includes(doc.id))
      .reduce((sum, doc) => sum + doc.size, 0),
    maxTokens: 32000 // Mock context limit
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          
          // Add new documents to the list
          const newDocuments = files.map((file, index) => ({
            id: Date.now() + index,
            filename: file.name,
            type: file.type === 'application/pdf' ? 'pdf' : 'txt',
            size: file.size,
            uploadDate: new Date().toISOString(),
            status: 'pending',
            inContext: false,
            ragIndexed: false,
            processedDate: null,
            metadata: {
              pageCount: 0,
              wordCount: 0,
              tokenCount: 0,
              summary: null
            },
            extractedContent: []
          }));
          
          setDocuments(prev => [...prev, ...newDocuments]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePreview = (document) => {
    setSelectedDocument(document);
  };

  const handleDelete = (documentId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setSelectedDocuments(prev => prev.filter(id => id !== documentId));
  };

  const handleReanalyze = (documentId) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, status: 'processing', ragIndexed: false }
        : doc
    ));
  };

  const handleToggleContext = (documentId) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, inContext: !doc.inContext }
        : doc
    ));
    
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedDocuments(newSelection);
    setDocuments(prev => prev.map(doc => ({
      ...doc,
      inContext: newSelection.includes(doc.id)
    })));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="ml-60 pt-16">
        <div className="p-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Icon name="Home" size={16} className="text-text-secondary" />
              <Icon name="ChevronRight" size={14} className="text-text-secondary" />
              <span className="text-text-secondary">Tools</span>
              <Icon name="ChevronRight" size={14} className="text-text-secondary" />
              <span className="text-text-primary font-medium">Document Upload & Analysis</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  Document Upload & Analysis
                </h1>
                <p className="text-text-secondary">
                  Upload and process documents to enhance your AI conversations with contextual information
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  iconSize={16}
                >
                  Refresh Status
                </Button>
                <Button
                  variant="default"
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={16}
                >
                  Configure RAG
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Upload and Library */}
            <div className="lg:col-span-2 space-y-6">
              <DocumentUploadZone
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
              
              <DocumentLibrary
                documents={documents}
                onPreview={handlePreview}
                onDelete={handleDelete}
                onReanalyze={handleReanalyze}
                onToggleContext={handleToggleContext}
              />
            </div>

            {/* Right Column - Processing Status and Context */}
            <div className="space-y-6">
              <ProcessingStatus
                currentProcessing={currentProcessing}
                processingQueue={processingQueue}
                systemStatus={systemStatus}
              />
              
              <ContextManager
                documents={documents}
                selectedDocuments={selectedDocuments}
                onSelectionChange={handleSelectionChange}
                contextStats={contextStats}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default DocumentUploadAndAnalysis;