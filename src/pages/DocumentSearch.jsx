// src/pages/DocumentSearch.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';

function DocumentSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [documents, setDocuments] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [summary, setSummary] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Component that takes children props as required by checklist
    const DocumentCard = ({ children, document, onSelect }) => (
        <div className="document-card" onClick={() => onSelect(document)}>
            {children}
            <h3>{document.title}</h3>
            <p>{document.excerpt}</p>
            <span className="relevance">Relevance: {(document.relevance * 100).toFixed(0)}%</span>
        </div>
    );

    // Handle drag events for file upload
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle file drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Handle file selection from input
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    // Process uploaded files
    const handleFiles = async (files) => {
        setIsUploading(true);
        const newFiles = [];

        for (let file of files) {
            // Validate file type
            const validTypes = ['application/pdf', 'text/plain', 'text/markdown',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'audio/mpeg', 'audio/mp3'];

            if (!validTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
                console.warn(`Unsupported file type: ${file.type}`);
                continue;
            }

            // In production, this would upload to your backend
            // For now, we'll simulate the upload process
            await new Promise(resolve => setTimeout(resolve, 500));

            newFiles.push({
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                status: 'processing', // processing, ready, error
                embeddings: null
            });
        }

        setUploadedFiles([...uploadedFiles, ...newFiles]);

        // Simulate processing delay (creating embeddings)
        setTimeout(() => {
            setUploadedFiles(prev => prev.map(f =>
                newFiles.find(nf => nf.id === f.id)
                    ? {...f, status: 'ready'}
                    : f
            ));
            setIsUploading(false);
            setShowUploadModal(false);
        }, 2000);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Simulate RAG vector search across both uploaded docs and database
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock search results combining uploaded docs and database
            setDocuments([
                {
                    id: 1,
                    title: 'Q3 Rice Market Analysis Report',
                    excerpt: 'Comprehensive analysis of rice market trends in Q3 2024...',
                    relevance: 0.95,
                    source: 'database',
                    content: 'Full document content would be retrieved here...'
                },
                {
                    id: 2,
                    title: uploadedFiles.length > 0 ? uploadedFiles[0].name : 'Uploaded Market Report',
                    excerpt: 'User-uploaded document with relevant rice market insights...',
                    relevance: 0.92,
                    source: 'uploaded',
                    content: 'Content from uploaded document...'
                },
                {
                    id: 3,
                    title: 'Rice Import/Export Regulations Update',
                    excerpt: 'Latest changes to international rice trade regulations...',
                    relevance: 0.87,
                    source: 'database',
                    content: 'Detailed regulatory information...'
                }
            ]);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSummarize = async (document) => {
        setSelectedDoc(document);
        setIsSummarizing(true);

        try {
            // Simulate RAG summarization combining context from multiple sources
            await new Promise(resolve => setTimeout(resolve, 1200));

            setSummary(`AI-Generated Summary: ${document.title}\n\n` +
                `Source: ${document.source === 'uploaded' ? 'User Document' : 'Company Database'}\n\n` +
                `Key Points:\n` +
                `• Market trends indicate positive growth in Southeast Asian markets\n` +
                `• Regulatory changes favor increased imports from verified suppliers\n` +
                `• Weather conditions remain stable for next quarter production\n` +
                `• Price volatility expected to decrease based on futures market analysis\n\n` +
                `This summary was generated using RAG-based document analysis, combining information from ` +
                `${document.source === 'uploaded' ? 'your uploaded documents' : 'the company knowledge base'} ` +
                `with contextual understanding from the Rice Market AI System.`);
        } catch (error) {
            console.error('Summarization failed:', error);
        } finally {
            setIsSummarizing(false);
        }
    };

    const removeUploadedFile = (fileId) => {
        setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
    };

    return (
        <div className="document-search-container">
            <nav>
                <Link to="/">← Back to Dashboard</Link>
            </nav>

            <h1>Document Search (RAG)</h1>
            <p>Search and summarize rice market documents using AI</p>

            {/* Document Management Section */}
            <div className="document-management">
                <div className="uploaded-files-section">
                    <h3>Knowledge Base Sources</h3>
                    <div className="source-info">
                        <div className="source-item">
                            <span className="source-icon">🗄️</span>
                            <div>
                                <strong>Company Database</strong>
                                <p>Rice market data, prices, inventory, suppliers</p>
                            </div>
                        </div>
                        {uploadedFiles.length > 0 && (
                            <div className="uploaded-docs">
                                <h4>Your Documents ({uploadedFiles.length})</h4>
                                {uploadedFiles.map(file => (
                                    <div key={file.id} className="uploaded-file-item">
                                        <span className="file-icon">📄</span>
                                        <div className="file-info">
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-status">
                                                {file.status === 'processing' ? (
                                                    <LoadingSpinner size="small" message="Processing..." />
                                                ) : (
                                                    <span className="status-ready">✓ Ready</span>
                                                )}
                                            </span>
                                        </div>
                                        <button
                                            className="remove-file"
                                            onClick={() => removeUploadedFile(file.id)}
                                            aria-label="Remove file"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        className="upload-btn"
                        onClick={() => setShowUploadModal(true)}
                    >
                        + Add Documents
                    </button>
                </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search across company database and your documents..."
                    disabled={isSearching}
                />
                <button type="submit" disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="upload-modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Sources</h2>
                            <button
                                className="close-modal"
                                onClick={() => setShowUploadModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <p className="modal-description">
                            Sources let the AI base its responses on the information that matters most to you.
                            (Examples: marketing plans, course reading, research notes, meeting transcripts, sales documents, etc.)
                        </p>

                        <div
                            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="drop-zone-content">
                                <span className="upload-icon">📤</span>
                                <h3>Upload sources</h3>
                                <p>
                                    Drag & drop or{' '}
                                    <label className="file-input-label">
                                        choose file
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileSelect}
                                            accept=".pdf,.txt,.md,.docx,.mp3"
                                            style={{
                                                position: 'absolute',
                                                left: '-9999px',
                                                visibility: 'hidden'
                                            }}
                                        />
                                    </label>
                                    {' '}to upload
                                </p>
                                <p className="file-types">
                                    Supported file types: PDF, .txt, Markdown, Audio (e.g. mp3)
                                </p>
                            </div>
                        </div>

                        {isUploading && (
                            <LoadingSpinner message="Processing documents..." size="medium" />
                        )}
                    </div>
                </div>
            )}

            {/* Search results */}
            {isSearching && (
                <LoadingSpinner message="Searching across all sources..." size="medium" />
            )}

            {documents.length > 0 && !selectedDoc && !isSearching && (
                <div className="search-results">
                    <h2>Search Results ({documents.length})</h2>
                    <p className="results-description">
                        Results from company database and uploaded documents
                    </p>
                    <div className="documents-grid">
                        {documents.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                document={doc}
                                onSelect={handleSummarize}
                            >
                                <span className="doc-icon">
                                    {doc.source === 'uploaded' ? '📎' : '📄'}
                                </span>
                            </DocumentCard>
                        ))}
                    </div>
                </div>
            )}

            {/* Summary display */}
            {selectedDoc && (
                <div className="summary-section">
                    <button onClick={() => {
                        setSelectedDoc(null);
                        setSummary('');
                    }}>← Back to Results</button>

                    <h2>{selectedDoc.title}</h2>

                    {isSummarizing ? (
                        <LoadingSpinner message="Generating AI summary with RAG..." size="medium" />
                    ) : (
                        summary && (
                            <div className="summary-content">
                                <pre>{summary}</pre>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default DocumentSearch;