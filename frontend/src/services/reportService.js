import api from './api';

const reportService = {
    // Fetch all generated reports, optionally filtered by project
    getReports: async (filters = {}) => {
        const params = {};
        if (filters.projectId) params.project_id = filters.projectId;
        const response = await api.get('/reports/', { params });
        return response.data.data;
    },

    // Ask the backend to generate a new PDF report for a project
    generateReport: async (projectId) => {
        const response = await api.post('/reports/generate', { project_id: projectId });
        return response.data.data;
    },

    // Download a generated PDF report as a blob and trigger browser download
    downloadReport: async (reportId) => {
        const response = await api.get(`/reports/${reportId}/download`, {
            responseType: 'blob',
        });
        return response.data; // Blob
    },
};

export default reportService;
