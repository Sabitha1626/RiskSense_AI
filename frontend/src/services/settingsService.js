import api from './api';

const settingsService = {
    getProfile: () => api.get('/settings/profile'),
    updateProfile: (data) => api.put('/settings/profile', data),
    changePassword: (data) => api.put('/settings/password', data),
    getNotificationPreferences: () => api.get('/settings/notifications'),
    updateNotificationPreferences: (data) => api.put('/settings/notifications', data),
    getRoles: () => api.get('/settings/roles'),
    updateRole: (userId, role) => api.put(`/settings/roles/${userId}`, { role }),
    getIntegrations: () => api.get('/settings/integrations'),
    updateIntegration: (id, data) => api.put(`/settings/integrations/${id}`, data),
};

export default settingsService;
