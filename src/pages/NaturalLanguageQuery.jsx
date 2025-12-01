// src/pages/NaturalLanguageQuery.jsx
// Frontend page integrated with NL-SQL backend API (port 8001) and Agent Coordinator (port 8000)

import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { executeNLQuery, checkHealth } from '../services/nlSqlService.js';
import { executeQuery as executeAgentQuery, checkHealth as checkAgentHealth } from '../services/agentService.js';

function NaturalLanguageQuery() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [serviceStatus, setServiceStatus] = useState('checking');
    const [agentMode, setAgentMode] = useState(false);
    const [agentStatus, setAgentStatus] = useState('checking');

    useEffect(() => {
        const checkServiceHealth = async () => {
            try {
                const health = await checkHealth();
                setServiceStatus(health.status === 'healthy' ? 'online' : 'offline');
            } catch (err) {
                console.error('NL-SQL service health check failed:', err);
                setServiceStatus('offline');
            }

            try {
                const agentHealth = await checkAgentHealth();
                setAgentStatus(agentHealth.status === 'healthy' ? 'online' : 'offline');
            } catch (err) {
                console.error('Agent service health check failed:', err);
                setAgentStatus('offline');
            }
        };

        checkServiceHealth();
    }, []);

    // Parse SQL results string to array of objects
    const parseSqlResults = (resultsStr) => {
        if (!resultsStr) return [];
        try {
            // Handle string that looks like Python list of dicts
            const cleaned = resultsStr
                .replace(/'/g, '"')  // Replace single quotes with double quotes
                .replace(/None/g, 'null')  // Replace Python None with null
                .replace(/True/g, 'true')
                .replace(/False/g, 'false');
            return JSON.parse(cleaned);
        } catch (e) {
            console.error('Failed to parse SQL results:', e);
            return [];
        }
    };

    // Parse agent response to extract structured data
    const parseAgentResponse = (response) => {
        const parsed = {
            sqlQuery: null,
            sqlResults: null,
            sqlResultsData: [],
            ragAnswer: null,
            ragConfidence: null,
            forecastModel: null,
            forecastSummary: null,
            forecastMetrics: null,
            rawParts: []
        };

        if (!response) return parsed;

        const parts = response.split(' | ');
        
        for (const part of parts) {
            const trimmed = part.trim();
            
            if (trimmed.startsWith('SQL:')) {
                parsed.sqlQuery = trimmed.substring(4).trim();
            }
            else if (trimmed.startsWith('Results:')) {
                parsed.sqlResults = trimmed.substring(8).trim();
                parsed.sqlResultsData = parseSqlResults(parsed.sqlResults);
            }
            else if (trimmed.startsWith('[SQL] Query:')) {
                parsed.rawParts.push({ type: 'sql-query', content: trimmed.substring(12).trim() });
            }
            else if (trimmed.startsWith('[RAG] Answer:')) {
                parsed.ragAnswer = trimmed.substring(13).trim();
            }
            else if (trimmed.startsWith('Confidence:')) {
                parsed.ragConfidence = trimmed.substring(11).trim();
            }
            else if (trimmed.startsWith('[Forecast] Best Model:')) {
                parsed.forecastModel = trimmed.substring(22).trim();
            }
            else if (trimmed.startsWith('Summary:')) {
                parsed.forecastSummary = trimmed.substring(8).trim();
            }
            else if (trimmed.startsWith('Metrics:')) {
                parsed.forecastMetrics = trimmed.substring(8).trim();
            }
            else if (trimmed) {
                parsed.rawParts.push({ type: 'other', content: trimmed });
            }
        }

        return parsed;
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!query.trim()) {
            setError('Please enter a query');
            return;
        }

        setError('');
        setIsLoading(true);
        setResults(null);

        try {
            if (agentMode) {
                const response = await executeAgentQuery(query);
                const parsedResponse = parseAgentResponse(response.response);
                setResults({
                    query: query,
                    response: response.response,
                    parsedResponse: parsedResponse,
                    agentsUsed: response.agents_used || [],
                    success: response.success,
                    isAgentResult: true,
                });
            } else {
                const response = await executeNLQuery(query);
                if (response.success) {
                    setResults({
                        query: response.query,
                        sqlGenerated: response.sqlGenerated,
                        data: response.data,
                        rowCount: response.rowCount,
                        isAgentResult: false,
                    });
                } else {
                    setError('Query failed. Please try a different question.');
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to process query. Please try again.');
            console.error('Query error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [query, agentMode]);

    // Render table for data array
    const renderDataTable = (data) => {
        if (!data || data.length === 0) return <p>No data returned.</p>;
        
        const keys = Object.keys(data[0]);
        return (
            <table>
                <thead>
                    <tr>
                        {keys.map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {keys.map((key) => (
                                <td key={key}>{String(row[key] ?? '')}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const currentStatus = agentMode ? agentStatus : serviceStatus;

    return (
        <div className="nl-query-container">
            <nav>
                <Link to="/">← Back to Dashboard</Link>
            </nav>

            <h1>Natural Language Query</h1>
            <p>Ask questions about your rice market data in plain English</p>

            <div className="mode-toggle">
                <label className="toggle-label">
                    <input
                        type="checkbox"
                        checked={agentMode}
                        onChange={(e) => setAgentMode(e.target.checked)}
                    />
                    <span className="toggle-text">
                        {agentMode ? '🤖 Multi-Agent Mode (SQL + RAG + Forecast)' : '📊 SQL-Only Mode'}
                    </span>
                </label>
            </div>

            <div className={`service-status ${currentStatus}`}>
                {agentMode ? 'Agent Coordinator' : 'NL-SQL Service'}: {currentStatus === 'online' ? '🟢 Online' : currentStatus === 'offline' ? '🔴 Offline' : '🟡 Checking...'}
                {agentMode && agentStatus === 'online' && (
                    <span className="agent-info"> (Combines SQL, RAG, Forecasting)</span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="query-form">
                <label htmlFor="query-input">Enter your question:</label>
                <input
                    id="query-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={agentMode ? "Example: How many customers and what is the rice price forecast?" : "Example: Show all customers"}
                    disabled={isLoading || currentStatus === 'offline'}
                />

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading || currentStatus === 'offline'}>
                    {isLoading ? 'Processing...' : 'Submit Query'}
                </button>
            </form>

            {isLoading && (
                <div className="loading-indicator">
                    {agentMode ? 'Processing with multiple AI agents...' : 'Processing your natural language query...'}
                </div>
            )}

            {results && !isLoading && (
                <div className="results-section">
                    {results.isAgentResult ? (
                        <>
                            <h2>Multi-Agent Results</h2>
                            {results.agentsUsed?.length > 0 && (
                                <div className="agents-used">
                                    <strong>Agents Used:</strong> {results.agentsUsed.join(', ')}
                                </div>
                            )}

                            {/* SQL Agent Results */}
                            {results.agentsUsed?.includes('sql_agent') && results.parsedResponse?.sqlQuery && (
                                <div className="sql-display">
                                    <h3>Generated SQL:</h3>
                                    <code>{results.parsedResponse.sqlQuery}</code>
                                </div>
                            )}

                            {results.parsedResponse?.sqlResultsData?.length > 0 && (
                                <div className="data-table">
                                    <h3>Results: ({results.parsedResponse.sqlResultsData.length} rows)</h3>
                                    {renderDataTable(results.parsedResponse.sqlResultsData)}
                                </div>
                            )}

                            {/* RAG Agent Results */}
                            {results.agentsUsed?.includes('rag_agent') && results.parsedResponse?.ragAnswer && (
                                <div className="rag-display">
                                    <h3>RAG Answer:</h3>
                                    <p>{results.parsedResponse.ragAnswer}</p>
                                    {results.parsedResponse.ragConfidence && (
                                        <p className="confidence">Confidence: {results.parsedResponse.ragConfidence}</p>
                                    )}
                                </div>
                            )}

                            {/* Forecast Agent Results */}
                            {results.agentsUsed?.includes('forecast_agent') && results.parsedResponse?.forecastModel && (
                                <div className="forecast-display">
                                    <h3>Forecast Results:</h3>
                                    <p><strong>Best Model:</strong> {results.parsedResponse.forecastModel}</p>
                                    {results.parsedResponse.forecastSummary && (
                                        <p><strong>Summary:</strong> {results.parsedResponse.forecastSummary}</p>
                                    )}
                                    {results.parsedResponse.forecastMetrics && (
                                        <p><strong>Metrics:</strong> {results.parsedResponse.forecastMetrics}</p>
                                    )}
                                </div>
                            )}

                            {/* Fallback for unparsed content */}
                            {results.parsedResponse?.rawParts?.length > 0 && (
                                <div className="raw-response">
                                    {results.parsedResponse.rawParts.map((part, idx) => (
                                        <div key={idx} className="response-part">
                                            {part.content}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2>Query Results ({results.rowCount} rows)</h2>
                            <div className="sql-display">
                                <h3>Generated SQL:</h3>
                                <code>{results.sqlGenerated}</code>
                            </div>
                            {results.data?.length > 0 ? (
                                <div className="data-table">
                                    <h3>Results:</h3>
                                    {renderDataTable(results.data)}
                                </div>
                            ) : (
                                <p>No data returned for this query.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default NaturalLanguageQuery;
