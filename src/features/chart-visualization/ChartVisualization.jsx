// src/features/chart-visualization/ChartVisualization.jsx
import { useState, useEffect } from 'react';

function ChartVisualization({ data, title, type = 'bar' }) {
    const [maxValue, setMaxValue] = useState(0);

    useEffect(() => {
        // Calculate the maximum value for scaling
        if (data && data.length > 0) {
            const max = Math.max(...data.map(item => item.value));
            setMaxValue(max);
        }
    }, [data]);

    // Component that takes children as props
    const ChartBar = ({ children, height, label }) => (
        <div className="chart-bar-wrapper">
            <div
                className="chart-bar"
                style={{ height: `${height}%` }}
                title={`${label}: ${children}`}
            >
                <span className="bar-value">{children}</span>
            </div>
            <div className="bar-label">{label}</div>
        </div>
    );

    const renderBarChart = () => {
        if (!data || data.length === 0) {
            return <p className="no-data">No data available for visualization</p>;
        }

        return (
            <div className="bar-chart">
                {data.map((item, index) => {
                    const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                    return (
                        <ChartBar
                            key={item.label || index}
                            height={height}
                            label={item.label}
                        >
                            {item.value}
                        </ChartBar>
                    );
                })}
            </div>
        );
    };

    const renderLineChart = () => {
        if (!data || data.length === 0) {
            return <p className="no-data">No data available for visualization</p>;
        }

        // Simple line chart visualization using SVG
        const width = 600;
        const height = 300;
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        const points = data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth + padding;
            const y = height - padding - (item.value / maxValue) * chartHeight;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="line-chart">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(percent => {
                    const y = padding + (chartHeight * (100 - percent)) / 100;
                    return (
                        <g key={percent}>
                            <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />
                            <text
                                x={padding - 10}
                                y={y + 5}
                                textAnchor="end"
                                fontSize="12"
                                fill="#666"
                            >
                                {Math.round(maxValue * percent / 100)}
                            </text>
                        </g>
                    );
                })}

                {/* Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="2"
                />

                {/* Data points */}
                {data.map((item, index) => {
                    const x = (index / (data.length - 1)) * chartWidth + padding;
                    const y = height - padding - (item.value / maxValue) * chartHeight;
                    return (
                        <g key={item.label || index}>
                            <circle
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#667eea"
                            />
                            <text
                                x={x}
                                y={height - 10}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#666"
                            >
                                {item.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="chart-visualization">
            <h3>{title}</h3>
            <div className="chart-container">
                {type === 'bar' ? renderBarChart() : renderLineChart()}
            </div>
        </div>
    );
}

export default ChartVisualization;