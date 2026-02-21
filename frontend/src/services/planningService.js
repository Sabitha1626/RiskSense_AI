import api from './api';

const planningService = {
    runSimulation: (params) => api.post('/risk/simulate', params),
    getDeadlineSuggestions: (projectId) => api.get(`/risk/deadline-suggestions/${projectId}`),
    getResourceRecommendations: (projectId) => api.get(`/risk/resource-recommendations/${projectId}`),
    getProjectsForPlanning: () => api.get('/projects'),
};

export default planningService;
