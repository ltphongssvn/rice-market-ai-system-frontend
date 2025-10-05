// src/shared/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner({ message = 'Loading...', size = 'medium' }) {
    // Size mapping for different use cases
    const sizeClasses = {
        small: 'spinner-small',
        medium: 'spinner-medium',
        large: 'spinner-large'
    };

    return (
        <div className="loading-spinner-container">
            <div className={`spinner ${sizeClasses[size]}`}>
                <div className="spinner-circle"></div>
            </div>
            <p className="loading-message">{message}</p>
        </div>
    );
}

export default LoadingSpinner;