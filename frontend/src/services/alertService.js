import api from './api';

const alertService = {
    getAlerts: async (filters = {}) => {
        const params = {};
        if (filters.severity) params.severity = filters.severity;
        if (filters.type) params.type = filters.type;
        if (filters.unreadOnly) params.unreadOnly = 'true';
        const response = await api.get('/alerts/', { params });
        return response.data.data;
    },

    getUnreadCount: async () => {
        const response = await api.get('/alerts/unread-count');
        return response.data.data.count;
    },

    markAsRead: async (alertId) => {
        const response = await api.put(`/alerts/${alertId}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.put('/alerts/mark-all-read');
        return response.data;
    },
};

export default alertService;
