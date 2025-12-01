// src/services/dashboardService.js
// Dashboard Service - Fetches real data from NL-SQL backend (Port 8001)
import API_CONFIG, { apiFetch } from './api.js';

/**
 * Fetch dashboard statistics from database
 * @returns {Promise<Object>} - Dashboard stats object
 */
export const getDashboardStats = async () => {
    const stats = {
        currentPrice: 0,
        priceChange: 0,
        totalInventory: 0,
        activeSuppliers: 0,
        recentTransactions: 0,
        lastUpdated: new Date().toLocaleString()
    };

    try {
        // Get average unit price from contracts
        const priceQuery = await apiFetch(`${API_CONFIG.NL_SQL_URL}/query`, {
            method: 'POST',
            body: JSON.stringify({ question: 'What is the average unit price from all contracts?' })
        });
        if (priceQuery.success && priceQuery.results?.length > 0) {
            const avgPrice = Object.values(priceQuery.results[0])[0];
            stats.currentPrice = parseFloat(avgPrice) || 0;
        }

        // Get customer count (as suppliers)
        const suppliersQuery = await apiFetch(`${API_CONFIG.NL_SQL_URL}/query`, {
            method: 'POST',
            body: JSON.stringify({ question: 'How many customers are in the database?' })
        });
        if (suppliersQuery.success && suppliersQuery.results?.length > 0) {
            const count = Object.values(suppliersQuery.results[0])[0];
            stats.activeSuppliers = parseInt(count) || 0;
        }

        // Get shipment count
        const shipmentsQuery = await apiFetch(`${API_CONFIG.NL_SQL_URL}/query`, {
            method: 'POST',
            body: JSON.stringify({ question: 'How many shipments are there?' })
        });
        if (shipmentsQuery.success && shipmentsQuery.results?.length > 0) {
            const count = Object.values(shipmentsQuery.results[0])[0];
            stats.recentTransactions = parseInt(count) || 0;
        }

        // Get inventory count
        const inventoryQuery = await apiFetch(`${API_CONFIG.NL_SQL_URL}/query`, {
            method: 'POST',
            body: JSON.stringify({ question: 'How many inventory movements are there?' })
        });
        if (inventoryQuery.success && inventoryQuery.results?.length > 0) {
            const count = Object.values(inventoryQuery.results[0])[0];
            stats.totalInventory = parseInt(count) || 0;
        }

        // Calculate a mock price change (can be enhanced with real historical data)
        stats.priceChange = 2.3;

    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        throw error;
    }

    return stats;
};

export default { getDashboardStats };
