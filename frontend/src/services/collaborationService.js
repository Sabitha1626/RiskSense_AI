import api from './api';

const collaborationService = {
    getComments: (projectId) => api.get(`/collaboration/comments`, { params: { project_id: projectId } }),
    addComment: (data) => api.post('/collaboration/comments', data),
    deleteComment: (id) => api.delete(`/collaboration/comments/${id}`),
    getThreads: (projectId) => api.get(`/collaboration/threads`, { params: { project_id: projectId } }),
    createThread: (data) => api.post('/collaboration/threads', data),
    replyToThread: (threadId, data) => api.post(`/collaboration/threads/${threadId}/reply`, data),
    uploadFile: (formData) => api.post('/collaboration/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getFiles: (projectId) => api.get(`/collaboration/files`, { params: { project_id: projectId } }),
    deleteFile: (id) => api.delete(`/collaboration/files/${id}`),
    searchUsers: (query) => api.get('/collaboration/users/search', { params: { q: query } }),
};

export default collaborationService;
