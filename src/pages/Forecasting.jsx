// src/pages/Forecasting.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import ChartVisualization from '../features/chart-visualization/ChartVisualization';

function Forecasting() {
    const [forecastData, setForecastData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedHorizon, setSelectedHorizon] = useState('6');

    // Second useEffect as required by checklist
    useEffect(() => {
        const fetchForecastData = async () => {
            setIsLoading(true);
            try {
                // Simulate API call to your forecasting service
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Mock forecast data
                setForecastData({
                    currentPrice: 45.50,
                    predictions: [
                        { month: 'Nov 2024', price: 46.20, confidence: 0.85 },
                        { month: 'Dec 2024', price: 47.10, confidence: 0.82 },
                        { month: 'Jan 2025', price: 46.80, confidence: 0.78 },
                        { month: 'Feb 2025', price: 48.30, confidence: 0.75 },
                        { month: 'Mar 2025', price: 49.20, confidence: 0.72 },
                        { month: 'Apr 2025', price: 48.90, confidence: 0.68 },
                        { month: 'Jul 2025', price: 50.10, confidence: 0.65 },
                        { month: 'Aug 2025', price: 51.20, confidence: 0.62 },
                        { month: 'Sep 2025', price: 50.80, confidence: 0.60 },
                        { month: 'Oct 2025', price: 52.30, confidence: 0.58 },
                        { month: 'Nov 2025', price: 53.10, confidence: 0.55 },
                        { month: 'Dec 2025', price: 52.90, confidence: 0.52 },
                    ]
                });
            } catch (error) {
                console.error('Failed to fetch forecast data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForecastData();
    }, [selectedHorizon]); // Dependency array includes selectedHorizon

    // Transform forecast data for chart visualization
    const getChartData = () => {
        if (!forecastData) return [];

        const numMonths = parseInt(selectedHorizon);
        return forecastData.predictions.slice(0, numMonths).map(prediction => ({
            label: prediction.month.substring(0, 3), // Shorten month names for chart
            value: prediction.price
        }));
    };

    // Get confidence data for a second chart
    const getConfidenceData = () => {
        if (!forecastData) return [];

        const numMonths = parseInt(selectedHorizon);
        return forecastData.predictions.slice(0, numMonths).map(prediction => ({
            label: prediction.month.substring(0, 3),
            value: Math.round(prediction.confidence * 100)
        }));
    };

    return (
        <div className="forecasting-container">
            <nav>
                <Link to="/">← Back to Dashboard</Link>
            </nav>

            <h1>Rice Price Forecasting</h1>
            <p>AI-powered price predictions based on historical data and market trends</p>

            <div className="horizon-selector">
                <label htmlFor="horizon">
                    Forecast Horizon (months):
                </label>
                <select
                    id="horizon"
                    value={selectedHorizon}
                    onChange={(e) => setSelectedHorizon(e.target.value)}
                >
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                </select>
            </div>

            {/* Using shared LoadingSpinner component */}
            {isLoading ? (
                <LoadingSpinner
                    message="Loading forecast data..."
                    size="large"
                />
            ) : (
                forecastData && (
                    <>
                        <div className="forecast-display">
                            <div className="current-price">
                                <h2>Current Market Price</h2>
                                <span className="price-value">${forecastData.currentPrice}/kg</span>
                            </div>

                            {/* Using ChartVisualization feature component for price trends */}
                            <ChartVisualization
                                data={getChartData()}
                                title="Predicted Price Trends ($/kg)"
                                type="line"
                            />

                            {/* Using ChartVisualization feature component for confidence levels */}
                            <ChartVisualization
                                data={getConfidenceData()}
                                title="Model Confidence Levels (%)"
                                type="bar"
                            />

                            <div className="predictions-table">
                                <h2>Detailed Price Predictions</h2>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Predicted Price</th>
                                        <th>Confidence</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {forecastData.predictions.slice(0, parseInt(selectedHorizon)).map((prediction, index) => (
                                        <tr key={`${prediction.month}-${index}`}>
                                            <td>{prediction.month}</td>
                                            <td>${prediction.price}/kg</td>
                                            <td>{(prediction.confidence * 100).toFixed(0)}%</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="forecast-notes">
                                <h3>Model Information</h3>
                                <p>Predictions generated using LSTM/Prophet ensemble model</p>
                                <p>Factors considered: Historical prices, weather patterns, exchange rates</p>
                                <p>The confidence level decreases over time as predictions become less certain for distant future periods.</p>
                            </div>
                        </div>
                    </>
                )
            )}
        </div>
    );
}

export default Forecasting;