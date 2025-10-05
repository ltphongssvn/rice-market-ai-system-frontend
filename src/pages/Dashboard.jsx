// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div className="dashboard-container">
            <h1>Rice Market AI System</h1>
            <p>Welcome to the intelligent ERP system for rice market analysis</p>

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