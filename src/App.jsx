// src/App.jsx
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NaturalLanguageQuery from './pages/NaturalLanguageQuery';
import DocumentSearch from './pages/DocumentSearch';
import Forecasting from './pages/Forecasting';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
    return (
        <div className="app">
            {/* Global navigation header with NavLink for active route highlighting */}
            <header className="app-header">
                <div className="app-title">
                    <h1>Rice Market AI System</h1>
                </div>
                <nav className="main-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/nl-query"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        NL Query
                    </NavLink>
                    <NavLink
                        to="/document-search"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        Document Search
                    </NavLink>
                    <NavLink
                        to="/forecasting"
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        Forecasting
                    </NavLink>
                </nav>
            </header>

            {/* Main content area where different page components render based on current route */}
            <main className="app-main">
                <Routes>
                    {/* Each Route maps a URL path to a specific page component */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/nl-query" element={<NaturalLanguageQuery />} />
                    <Route path="/document-search" element={<DocumentSearch />} />
                    <Route path="/forecasting" element={<Forecasting />} />
                    {/* Wildcard route catches all unmatched paths and shows 404 page */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;