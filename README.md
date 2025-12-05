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


---

## Backend API Integration (GKE)

### 2025-12-04 - Integration Planning

**GKE Backend Service Endpoints:**
| Service | Port | External IP |
|---------|------|-------------|
| agent-coordinator | 8000 | 35.226.33.213 |
| nl-sql-service | 8001 | 34.9.217.251 |
| rag-orchestrator | 8002 | 136.114.222.124 |
| ts-forecasting | 8003 | 34.42.16.142 |

**Current Frontend Config (.env.local):**
- VITE_NL_SQL_SERVICE_URL=http://localhost:8001
- VITE_RAG_SERVICE_URL=http://localhost:8002
- VITE_FORECAST_SERVICE_URL=http://localhost:8003

**Required Updates:**
- Update .env.local to point to GKE external IPs
- Create .env.production for production deployment

### 2025-12-04 - API Configuration Verified

**src/services/api.js Analysis:**
- Uses Vite env vars: `import.meta.env.VITE_*`
- Fallback to localhost if env vars not set
- JWT authentication with HMAC-SHA256
- API_CONFIG exports: NL_SQL_URL, RAG_URL, FORECAST_URL

**Vite Behavior:**
- `.env.local` → used in `npm run dev`
- `.env.production` → used in `npm run build`

### 2025-12-04 - Build Failed - Missing recharts
**Command:** `npm run build`
**Error:**
```
Could not resolve entry module "recharts".
```
**Root Cause:** vite.config.js references 'recharts' in manualChunks but it's not installed
**Next Step:** Check package.json for actual dependencies before configuring chunks

### 2025-12-04 - Build Success with Code Splitting
**Command:** `npm run build`
**Output:**
```
dist/assets/vendor-BSL7p1-v.js   34.10 kB │ gzip: 12.12 kB
dist/assets/index-CKL9RFHb.js   208.67 kB │ gzip: 64.99 kB
dist/assets/crypto-DCDEN_Jk.js  302.42 kB │ gzip: 83.57 kB
✓ built in 1.44s
```
**Result:** ✅ Build successful, all chunks under 500KB, no warnings

### 2025-12-04 - GKE URLs Verified in Production Build
**Command:** `grep -r "34.9.217.251" dist/`
**Output:** Found in `dist/assets/index-CKL9RFHb.js`
**Result:** ✅ GKE backend URLs successfully embedded in production build
**Verified URLs:**
- NL_SQL_URL: http://34.9.217.251:8001
- RAG_URL: http://136.114.222.124:8002
- FORECAST_URL: http://34.42.16.142:8003

### 2025-12-04 - GKE Backend Health Check
**Command:** `curl -s http://34.9.217.251:8001/health`
**Output:** `{"status":"healthy","service":"nl-sql"}`
**Result:** ✅ GKE backend nl-sql-service accessible and healthy

### 2025-12-04 - All GKE Backend Services Healthy
**Commands:**
```bash
curl -s http://136.114.222.124:8002/health
curl -s http://34.42.16.142:8003/health
```
**Outputs:**
```
{"status":"healthy","service":"agentic-graph-rag","version":"2.1.0"}
{"status":"healthy","service":"ts-forecasting","version":"2.1.0"}
```
**Result:** ✅ All 3 GKE backend services accessible and healthy
- nl-sql-service: ✅
- rag-orchestrator: ✅
- ts-forecasting: ✅

### 2025-12-04 - Production Build Preview Server
**Command:** `npm run preview`
**Output:** `Local: http://localhost:4173/`
**Result:** ✅ Production build served locally for testing
**Note:** Open http://localhost:4173 in browser to test frontend-to-GKE integration

### 2025-12-04 - Manual Browser Test Queries

**Test URL:** http://localhost:4173

#### NL-SQL Service Tests (SQL-Only Mode)
1. `Show all customers`
2. `How many contracts are in the database?`
3. `What is the average unit price from all contracts?`
4. `List the top 5 suppliers by total shipments`
5. `Show inventory movements from the last month`
6. `What is the total quantity of rice in inventory?`
7. `Count shipments by status`
8. `Show all warehouses and their locations`

#### RAG Service Tests (Document Search page)
1. `What are the rice export regulations in Vietnam?`
2. `Explain rice quality grading standards`
3. `What factors affect rice prices?`
4. `Summarize rice storage best practices`
5. `What is the current market trend for jasmine rice?`

#### Forecasting Service Tests (Forecasting page)
1. Select 3-month horizon → verify chart renders
2. Select 6-month horizon → verify predictions update
3. Select 12-month horizon → verify confidence decreases for longer periods

#### Multi-Agent Mode Tests (NL Query page - toggle ON)
1. `How many customers and what is the rice price forecast?`
2. `Show inventory levels and explain storage policies`
3. `What is the average contract price and market outlook?`
4. `List suppliers and summarize supply chain risks`

**Test Checklist:**
- [ ] Dashboard loads with stats from GKE
- [ ] NL Query SQL mode returns data
- [ ] NL Query Multi-Agent mode combines services
- [ ] Document Search returns RAG answers
- [ ] Forecasting displays charts and predictions
- [ ] All service status indicators show green

### 2025-12-04 - Squash Merge to Develop Complete
**Commands:**
```bash
git checkout develop && git merge --squash feature/integrate_frontend_to_backend_onGKE
git branch -d feature/integrate_frontend_to_backend_onGKE
git push origin --delete feature/integrate_frontend_to_backend_onGKE
git fetch --prune
git commit -m "feat: integrate frontend with GKE backend APIs" && git push origin develop
```
**Result:** ✅ Feature branch squash-merged to develop and pushed
**Deployed Files:**
- .env.production (GKE backend URLs)
- vite.config.js (code splitting)
- README.md (documentation)
**GitHub Pages:** Deployment triggered at http://kiwi.thanhphongle.net

### 2025-12-04 - GitHub Pages Deployment Success
**Command:** `gh run list --repo ltphongssvn/rice-market-ai-system-frontend --limit 3`
**Output:**
```
✓  docs: document squash merge completion  Deploy to GitHub Pages  develop  29s
✓  feat: integrate frontend with GKE backend APIs  Deploy to GitHub Pages  develop  31s
```
**Result:** ✅ GitHub Pages deployment successful
**Live URL:** http://kiwi.thanhphongle.net
**Next:** Manual browser testing against GKE backends
