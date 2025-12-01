// src/pages/DocumentSearch.jsx
// Frontend page integrated with RAG Orchestrator API (port 8002)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import { queryRAG, checkHealth, uploadDocument, getDocuments } from '../services/ragService.js';

function DocumentSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const [serviceStatus, setServiceStatus] = useState('checking');

    // Check service health and load existing documents on mount
    useEffect(() => {
        const initializeService = async () => {
            try {
                const health = await checkHealth();
                setServiceStatus(health.status === 'healthy' ? 'online' : 'offline');

                // Load existing indexed documents from backend
                if (health.status === 'healthy') {
                    const docs = await getDocuments();
                    if (docs.sources && docs.sources.length > 0) {
                        setUploadedFiles(docs.sources.map((source, idx) => ({
                            id: `existing-${idx}`,
                            name: source,
                            status: 'ready',
                            fromBackend: true,
                        })));
                    }
                }
            } catch (err) {
                console.error('RAG service initialization failed:', err);
                setServiceStatus('offline');
            }
        };

        initializeService();
    }, []);

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

    // Handle file selection
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    // Process and upload files to RAG backend
    const handleFiles = async (files) => {
        setIsUploading(true);
        setError('');

        for (let file of files) {
            const validTypes = ['application/pdf', 'text/plain', 'text/markdown',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!validTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
                console.warn(`Unsupported file type: ${file.type}`);
                setError(`Unsupported file type: ${file.name}`);
                continue;
            }

            // Add file with uploading status
            const fileId = Date.now() + Math.random();
            setUploadedFiles(prev => [...prev, {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                status: 'uploading',
            }]);

            try {
                // Upload to RAG backend
                const result = await uploadDocument(file);

                if (result.success) {
                    // Update status to ready
                    setUploadedFiles(prev => prev.map(f =>
                        f.id === fileId ? { ...f, status: 'ready', chunksIndexed: result.chunks_indexed } : f
                    ));
                } else {
                    // Update status to failed
                    setUploadedFiles(prev => prev.map(f =>
                        f.id === fileId ? { ...f, status: 'failed' } : f
                    ));
                    setError(`Failed to index: ${file.name}`);
                }
            } catch (err) {
                console.error('Upload failed:', err);
                setUploadedFiles(prev => prev.map(f =>
                    f.id === fileId ? { ...f, status: 'failed' } : f
                ));
                setError(`Upload failed: ${err.message}`);
            }
        }

        setIsUploading(false);
        setShowUploadModal(false);
    };

    // Handle search with real RAG API call
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError('');
        setSearchResult(null);

        try {
            // Real API call to RAG service
            const response = await queryRAG(searchQuery, 5);
            setSearchResult({
                query: searchQuery,
                answer: response.answer,
                sources: response.sources,
                confidence: response.confidence,
            });
        } catch (err) {
            setError(err.message || 'Search failed. Please try again.');
            console.error('RAG search failed:', err);
        } finally {
            setIsSearching(false);
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
            <p>Search and query rice market documents using AI</p>

            {/* Service status indicator */}
            <div className={`service-status ${serviceStatus}`}>
                RAG Service: {serviceStatus === 'online' ? '🟢 Online' : serviceStatus === 'offline' ? '🔴 Offline' : '🟡 Checking...'}
            </div>

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
                                            {file.status === 'uploading' && <span className="status-uploading">⏳ Uploading...</span>}
                                            {file.status === 'ready' && <span className="status-ready">✓ Ready</span>}
                                            {file.status === 'failed' && <span className="status-failed">✗ Failed</span>}
                                        </div>
                                        {!file.fromBackend && (
                                            <button
                                                className="remove-file"
                                                onClick={() => removeUploadedFile(file.id)}
                                                aria-label="Remove file"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
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
                    placeholder="Ask a question about rice market documents..."
                    disabled={isSearching || serviceStatus === 'offline'}
                />
                <button type="submit" disabled={isSearching || serviceStatus === 'offline'}>
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="upload-modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Sources</h2>
                            <button className="close-modal" onClick={() => setShowUploadModal(false)}>×</button>
                        </div>
                        <p className="modal-description">
                            Upload documents to include in your knowledge base for RAG queries.
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
                                            accept=".pdf,.txt,.md,.docx"
                                            style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
                                        />
                                    </label>
                                    {' '}to upload
                                </p>
                                <p className="file-types">Supported: PDF, .txt, Markdown, .docx</p>
                            </div>
                        </div>
                        {isUploading && <LoadingSpinner message="Processing and indexing documents..." size="medium" />}
                    </div>
                </div>
            )}

            {/* Search Loading */}
            {isSearching && <LoadingSpinner message="Searching knowledge base..." size="medium" />}

            {/* Search Results */}
            {searchResult && !isSearching && (
                <div className="results-section">
                    <h2>Answer</h2>
                    <div className="rag-answer">
                        <p>{searchResult.answer}</p>
                        {searchResult.confidence > 0 && (
                            <span className="confidence">
                                Confidence: {(searchResult.confidence * 100).toFixed(0)}%
                            </span>
                        )}
                    </div>
                    {searchResult.sources?.length > 0 && (
                        <div className="sources-section">
                            <h3>Sources ({searchResult.sources.length})</h3>
                            <ul>
                                {searchResult.sources.map((source, idx) => (
                                    <li key={idx}>
                                        <strong>{source.metadata?.source || 'Unknown'}</strong>
                                        {source.score && <span className="source-score"> (Score: {(source.score * 100).toFixed(0)}%)</span>}
                                        {source.metadata?.content && (
                                            <p className="source-content">{source.metadata.content.substring(0, 200)}...</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DocumentSearch;
