// src/shared/DataTable.jsx
import React from 'react';

function DataTable({ data, columns, emptyMessage = 'No data available', onRowClick }) {
    // If no data is provided, show empty state
    if (!data || data.length === 0) {
        return (
            <div className="data-table-empty">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={column.key || index} className={column.className}>
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                        key={row.id || rowIndex}
                        onClick={() => onRowClick && onRowClick(row)}
                        className={onRowClick ? 'clickable-row' : ''}
                    >
                        {columns.map((column, colIndex) => (
                            <td key={`${rowIndex}-${column.key || colIndex}`}>
                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;