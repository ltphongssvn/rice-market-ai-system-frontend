// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">Return to Dashboard</Link>
        </div>
    );
}

export default NotFound;