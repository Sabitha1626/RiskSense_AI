import api from './api';

const riskService = {
    // List all projects (name + _id only) for the dropdown
    getProjects: async () => {
        const response = await api.get('/risk/projects');
        return response.data.data;
    },

    // Get full ML risk analysis for a specific project
    getProjectRisk: async (projectId) => {
        const response = await api.get(`/risk/${projectId}`);
        return response.data.data;
    },
};

export default riskService;
