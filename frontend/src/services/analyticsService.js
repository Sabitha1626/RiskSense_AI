import api from './api';

const analyticsService = {
    getProductivityData: (params) => api.get('/employees/productivity', { params }),
    getHeatmapData: (params) => api.get('/employees/heatmap', { params }),
    getForecastData: (projectId) => api.get(`/risk/predict/${projectId}`),
    getTeamComparison: (params) => api.get('/employees/comparison', { params }),
    getOverviewStats: () => api.get('/employees/stats'),
};

export default analyticsService;
