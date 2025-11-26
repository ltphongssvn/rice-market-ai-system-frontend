// src/pages/NaturalLanguageQuery.jsx
// Frontend page integrated with NL-SQL backend API (port 8001)

import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { executeNLQuery, checkHealth } from '../services/nlSqlService.js';

function NaturalLanguageQuery() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [serviceStatus, setServiceStatus] = useState('checking');

    // Check service health on mount
    useEffect(() => {
        const checkServiceHealth = async () => {
            try {
                const health = await checkHealth();
                setServiceStatus(health.status === 'healthy' ? 'online' : 'offline');
            } catch (err) {
                console.error('Service health check failed:', err);
                setServiceStatus('offline');
            }
        };

        checkServiceHealth();

        return () => {
            console.log('NL Query component unmounted');
        };
    }, []);

    // Handle form submission with real API call
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
            // Real API call to NL-SQL service
            const response = await executeNLQuery(query);

            if (response.success) {
                setResults({
                    query: response.query,
                    sqlGenerated: response.sqlGenerated,
                    data: response.data,
                    rowCount: response.rowCount,
                });
            } else {
                setError('Query failed. Please try a different question.');
            }
        } catch (err) {
            setError(err.message || 'Failed to process query. Please try again.');
            console.error('Query error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    // Dynamically render table headers based on data
    const renderTableHeaders = () => {
        if (!results?.data?.length) return null;
        const keys = Object.keys(results.data[0]);
        return (
            <tr>
                {keys.map((key) => (
                    <th key={key}>{key}</th>
                ))}
            </tr>
        );
    };

    // Dynamically render table rows based on data
    const renderTableRows = () => {
        if (!results?.data?.length) return null;
        const keys = Object.keys(results.data[0]);
        return results.data.map((row, index) => (
            <tr key={index}>
                {keys.map((key) => (
                    <td key={key}>{String(row[key])}</td>
                ))}
            </tr>
        ));
    };

    return (
        <div className="nl-query-container">
            <nav>
                <Link to="/">← Back to Dashboard</Link>
            </nav>

            <h1>Natural Language SQL Query</h1>
            <p>Ask questions about your rice market database in plain English</p>

            {/* Service status indicator */}
            <div className={`service-status ${serviceStatus}`}>
                Service: {serviceStatus === 'online' ? '🟢 Online' : serviceStatus === 'offline' ? '🔴 Offline' : '🟡 Checking...'}
            </div>

            {/* Query form */}
            <form onSubmit={handleSubmit} className="query-form">
                <label htmlFor="query-input">Enter your question:</label>
                <input
                    id="query-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Example: Show all customers"
                    disabled={isLoading || serviceStatus === 'offline'}
                />

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading || serviceStatus === 'offline'}>
                    {isLoading ? 'Processing...' : 'Submit Query'}
                </button>
            </form>

            {/* Loading state */}
            {isLoading && (
                <div className="loading-indicator">
                    Processing your natural language query...
                </div>
            )}

            {/* Results display */}
            {results && !isLoading && (
                <div className="results-section">
                    <h2>Query Results ({results.rowCount} rows)</h2>
                    
                    <div className="sql-display">
                        <h3>Generated SQL:</h3>
                        <code>{results.sqlGenerated}</code>
                    </div>

                    {results.data?.length > 0 ? (
                        <div className="data-table">
                            <h3>Results:</h3>
                            <table>
                                <thead>{renderTableHeaders()}</thead>
                                <tbody>{renderTableRows()}</tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No data returned for this query.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default NaturalLanguageQuery;
