import api from './api';

const jiraService = {
    getSyncStatus: () => api.get('/jira/status'),
    importProjects: (config) => api.post('/jira/import', config),
    syncNow: () => api.post('/jira/sync'),
    getSyncLogs: (params) => api.get('/jira/logs', { params }),
    getConnectionSettings: () => api.get('/jira/settings'),
    updateConnectionSettings: (data) => api.put('/jira/settings', data),
    testConnection: (data) => api.post('/jira/test-connection', data),
    disconnectJira: () => api.delete('/jira/disconnect'),
};

export default jiraService;
