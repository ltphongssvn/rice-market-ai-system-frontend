# Rice Market AI System Frontend

Live Demo: https://kiwi.thanhphongle.net/

## Project Description

This React-based web application is for the frontend UI for the Rice Market AI System - Natural Language SQL, RAG, and Time-Series Forecasting application designed to provide intelligent analysis and forecasting capabilities for rice market operations. You can refer to the Rice Market AI System - Natural Language SQL, RAG, and Time-Series Forecasting here:

GitHub: https://github.com/ltphongssvn/ac215e115groupproject <br>
Website: https://ac215e115groupproject.thanhphongle.net/ <br>

This single-page application demonstrates modern React development practices while simulating integration with a microservices architecture that would typically include Natural Language SQL processing, Document Search with RAG (Retrieval-Augmented Generation), and Time-Series Forecasting capabilities.

This React frontend project was developed as a final project for a React development course, showcasing proficiency in React hooks, routing, component composition, state management, and modern JavaScript practices. The application features a responsive design with multiple interconnected pages, reusable components, and a professional user interface suitable for enterprise deployment.

## Key Features

- **Natural Language SQL Query Interface**: Allows users to query rice market databases using plain English, which would be converted to SQL queries through a backend NL processing service
- **Document Search with RAG**: Implements a document upload and search interface similar to Google's NotebookLM, designed to integrate with vector similarity search for intelligent document retrieval
- **Price Forecasting Dashboard**: Displays AI-powered price predictions with interactive visualizations and confidence metrics
- **Responsive Design**: Fully responsive layout that adapts to different screen sizes from mobile to desktop
- **Component-Based Architecture**: Modular design with reusable components following React best practices

## Technology Stack

### Core Dependencies
- **React 18.3.1**: The core JavaScript library for building the user interface
- **React DOM 18.3.1**: React package for DOM-specific methods
- **React Router DOM 6.29.1**: Declarative routing for React applications
- **Vite 7.1.9**: Next-generation frontend build tool for faster development

### Development Dependencies
- **@vitejs/plugin-react 4.3.4**: Official Vite plugin for React Fast Refresh
- **@types/react 18.3.18**: TypeScript definitions for React (used for IDE support)
- **@types/react-dom 18.3.5**: TypeScript definitions for React DOM

## Installation Instructions

1. **Prerequisites**
    - Node.js (version 16 or higher recommended)
    - npm (comes with Node.js) or yarn package manager
    - Git for version control

2. **Clone the Repository**
   ```bash
   git clone https://github.com/ltphongssvn/rice-market-ai-system-frontend.git
   cd rice-market-ai-system-frontend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

   If you encounter any issues with dependency versions, you can clean install:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5173/` by default. Vite will display the local and network addresses in the terminal.

5. **Build for Production**
   ```bash
   npm run build
   ```

   This creates an optimized production build in the `dist` directory.

6. **Preview Production Build**
   ```bash
   npm run preview
   ```

   This serves the production build locally for testing before deployment.

## Project Structure

```
rice-market-ai-system-frontend/
├── src/
│   ├── pages/                 # Page components for different routes
│   │   ├── Dashboard.jsx       # Main landing page with feature cards
│   │   ├── NaturalLanguageQuery.jsx  # NL to SQL interface
│   │   ├── DocumentSearch.jsx  # RAG document search interface
│   │   ├── Forecasting.jsx     # Price prediction dashboard
│   │   └── NotFound.jsx        # 404 error page
│   ├── features/              # Feature-specific components
│   │   ├── query-builder/      # Visual SQL query builder
│   │   └── chart-visualization/ # Data visualization components
│   ├── shared/                # Reusable components
│   │   ├── LoadingSpinner.jsx  # Loading state indicator
│   │   ├── ErrorBoundary.jsx   # Error handling wrapper
│   │   └── DataTable.jsx       # Reusable data table
│   ├── App.jsx                # Main application component with routing
│   ├── App.css                # Application styles
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── index.html                 # HTML template
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## API Configuration

The frontend is designed to connect to three microservices that would typically be deployed on Google Cloud Platform:

### 1. Natural Language to SQL Service
- **Expected Endpoint**: `https://nl-sql-service-[project-id].run.app`
- **Purpose**: Converts natural language queries to SQL statements
- **Integration Point**: `src/pages/NaturalLanguageQuery.jsx`

### 2. Document Search RAG Service
- **Expected Endpoint**: `https://rag-service-[project-id].run.app`
- **Purpose**: Handles document upload, embedding generation, and vector similarity search
- **Integration Point**: `src/pages/DocumentSearch.jsx`
- **Storage**: Designed to work with Cloud SQL (PostgreSQL with pgvector extension) and Vertex AI Vector Search

### 3. Forecasting Service
- **Expected Endpoint**: `https://forecast-service-[project-id].run.app`
- **Purpose**: Provides time-series predictions using LSTM/Prophet models
- **Integration Point**: `src/pages/Forecasting.jsx`

### Environment Configuration

To connect to actual backend services, create a `.env` file in the project root:

```env
VITE_API_GATEWAY_URL=https://your-api-gateway-url.com
VITE_NL_SQL_SERVICE_URL=https://nl-sql-service.run.app
VITE_RAG_SERVICE_URL=https://rag-service.run.app
VITE_FORECAST_SERVICE_URL=https://forecast-service.run.app
```

Currently, the application uses mock data to simulate backend responses, allowing for frontend development and testing without requiring active backend services.

## Authentication and Credentials

In a production deployment, this application would typically require:

1. **Google Cloud Identity Platform** or **Firebase Authentication** for user authentication
2. **API Keys** for service-to-service communication
3. **OAuth 2.0** tokens for accessing Google Cloud services

For development purposes, the application currently operates without authentication. When deploying to production, implement proper authentication using environment variables and secure token storage.

## Browser Compatibility

The application is built using modern JavaScript features and is compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This project was developed as an academic exercise. If you'd like to contribute or have suggestions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is created for educational purposes as part of a React development course.

## Acknowledgments

- Developed as a final project demonstrating React proficiency
- Inspired by modern enterprise applications and Google's NotebookLM interface
- Built with Vite for optimal development experience
- Designed to showcase integration with Google Cloud Platform services

