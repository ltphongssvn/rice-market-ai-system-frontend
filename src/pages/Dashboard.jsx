// src/pages/Dashboard.jsx
// Dashboard page with real data from NL-SQL backend
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import { getDashboardStats } from '../services/dashboardService.js';

function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [marketStats, setMarketStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Check localStorage first for cached data (5 minute cache)
                const cachedData = localStorage.getItem('dashboardStats');
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    if (parsedData.timestamp > Date.now() - 300000) { // 5 minutes
                        setMarketStats(parsedData.stats);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch real data from NL-SQL service
                const freshStats = await getDashboardStats();

                // Store in localStorage for caching
                localStorage.setItem('dashboardStats', JSON.stringify({
                    stats: freshStats,
                    timestamp: Date.now()
                }));

                setMarketStats(freshStats);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                setError('Failed to load dashboard data. Please check if services are running.');
                // Fallback to cached data if available
                const cachedData = localStorage.getItem('dashboardStats');
                if (cachedData) {
                    setMarketStats(JSON.parse(cachedData).stats);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <LoadingSpinner message="Loading market dashboard..." size="large" />
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Rice Market AI System</h1>
            <p>Welcome to the intelligent ERP system for rice market analysis</p>

            {error && (
                <div className="error-message">{error}</div>
            )}

            {marketStats && (
                <div className="market-overview">
                    <h2>Market Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Current Price</h3>
                            <p className="stat-value">${marketStats.currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}/kg</p>
                            <p className="stat-change">
                                {marketStats.priceChange > 0 ? '↑' : '↓'} {Math.abs(marketStats.priceChange)}%
                            </p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Inventory</h3>
                            <p className="stat-value">{marketStats.totalInventory.toLocaleString()} records</p>
                        </div>
                        <div className="stat-card">
                            <h3>Active Customers</h3>
                            <p className="stat-value">{marketStats.activeSuppliers}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Shipments</h3>
                            <p className="stat-value">{marketStats.recentTransactions}</p>
                        </div>
                    </div>
                    <p className="last-updated">Last updated: {marketStats.lastUpdated}</p>
                </div>
            )}

            <div className="feature-cards">
                <div className="feature-card">
                    <h2>Natural Language SQL</h2>
                    <p>Query your database using plain English</p>
                    <Link to="/nl-query">Open Query Interface</Link>
                </div>

                <div className="feature-card">
                    <h2>Document Search (RAG)</h2>
                    <p>Search and summarize market documents</p>
                    <Link to="/document-search">Search Documents</Link>
                </div>

                <div className="feature-card">
                    <h2>Price Forecasting</h2>
                    <p>View AI-powered price predictions</p>
                    <Link to="/forecasting">View Forecasts</Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
