// src/features/query-builder/QueryBuilder.jsx
import { useState } from 'react';

function QueryBuilder({ onQuerySubmit, disabled = false }) {
    const [selectedTable, setSelectedTable] = useState('inventory');
    const [selectedColumns, setSelectedColumns] = useState(['*']);
    const [whereClause, setWhereClause] = useState('');
    const [orderBy, setOrderBy] = useState('');

    // Available tables and columns in the rice market database
    const schema = {
        inventory: ['id', 'item', 'quantity', 'unit', 'date', 'warehouse'],
        prices: ['id', 'item', 'price', 'currency', 'market', 'date'],
        suppliers: ['id', 'name', 'country', 'rating', 'contact'],
        forecasts: ['id', 'item', 'period', 'predicted_price', 'confidence']
    };

    const handleBuildQuery = () => {
        // Build SQL query from visual components
        let query = `SELECT ${selectedColumns.join(', ')} FROM ${selectedTable}`;

        if (whereClause.trim()) {
            query += ` WHERE ${whereClause}`;
        }

        if (orderBy.trim()) {
            query += ` ORDER BY ${orderBy}`;
        }

        onQuerySubmit(query);
    };

    const toggleColumn = (column) => {
        if (selectedColumns.includes('*')) {
            setSelectedColumns([column]);
        } else if (selectedColumns.includes(column)) {
            const filtered = selectedColumns.filter(col => col !== column);
            setSelectedColumns(filtered.length > 0 ? filtered : ['*']);
        } else {
            setSelectedColumns([...selectedColumns, column]);
        }
    };

    return (
        <div className="query-builder">
            <h3>Visual Query Builder</h3>

            <div className="query-section">
                <label>Select Table:</label>
                <select
                    value={selectedTable}
                    onChange={(e) => {
                        setSelectedTable(e.target.value);
                        setSelectedColumns(['*']);
                    }}
                    disabled={disabled}
                >
                    {Object.keys(schema).map(table => (
                        <option key={table} value={table}>{table}</option>
                    ))}
                </select>
            </div>

            <div className="query-section">
                <label>Select Columns:</label>
                <div className="column-checkboxes">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedColumns.includes('*')}
                            onChange={() => setSelectedColumns(['*'])}
                            disabled={disabled}
                        />
                        All Columns (*)
                    </label>
                    {schema[selectedTable].map(column => (
                        <label key={column}>
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(column)}
                                onChange={() => toggleColumn(column)}
                                disabled={disabled || selectedColumns.includes('*')}
                            />
                            {column}
                        </label>
                    ))}
                </div>
            </div>

            <div className="query-section">
                <label htmlFor="where-clause">WHERE Clause (optional):</label>
                <input
                    id="where-clause"
                    type="text"
                    value={whereClause}
                    onChange={(e) => setWhereClause(e.target.value)}
                    placeholder="e.g., quantity > 500 AND item LIKE '%Rice%'"
                    disabled={disabled}
                />
            </div>

            <div className="query-section">
                <label htmlFor="order-by">ORDER BY (optional):</label>
                <input
                    id="order-by"
                    type="text"
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    placeholder="e.g., date DESC"
                    disabled={disabled}
                />
            </div>

            <button
                onClick={handleBuildQuery}
                disabled={disabled}
                className="build-query-btn"
            >
                Build & Execute Query
            </button>
        </div>
    );
}

export default QueryBuilder;