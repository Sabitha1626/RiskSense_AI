import api from './api';

const projectService = {
    // Get all projects (manager sees all, employee sees their own)
    getProjects: async () => {
        const response = await api.get('/projects/');
        return response.data.data;
    },

    // Get a single project with tasks and team member details
    getProjectById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data.data;
    },

    // Create a new project (manager only)
    createProject: async (projectData) => {
        const payload = {
            name: projectData.name,
            description: projectData.description,
            start_date: projectData.startDate,
            deadline: projectData.endDate,
            team_members: projectData.teamMembers,
            complexity: projectData.complexity,
            estimated_hours: parseFloat(projectData.estimatedHours),
        };
        const response = await api.post('/projects/', payload);
        return response.data.data;
    },

    // Get progress history for a project
    getProgressHistory: async (projectId) => {
        const response = await api.get(`/projects/${projectId}/progress-history`);
        return response.data.data;
    },

    // Get productivity data for an employee on a project
    getProductivityData: async (employeeId, projectId) => {
        const response = await api.get(`/projects/${projectId}/productivity`, {
            params: { employee_id: employeeId },
        });
        return response.data.data;
    },

    // Get risk distribution across all projects
    getRiskDistribution: async () => {
        const response = await api.get('/projects/risk-distribution');
        return response.data.data;
    },

    // Get work hours data for an employee
    getWorkHoursData: async (employeeId) => {
        const response = await api.get(`/employees/${employeeId}/work-hours`);
        return response.data.data;
    },
};

export default projectService;
