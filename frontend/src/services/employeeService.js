import api from './api';

const employeeService = {
    // Get all registered employees (role=employee) — used in CreateProject & TaskAssignment
    getAllEmployees: async () => {
        const response = await api.get('/employees/');
        return response.data.data;
    },

    // Get tasks assigned to a specific employee
    getTasks: async (employeeId) => {
        const response = await api.get('/tasks/', { params: { employee_id: employeeId } });
        return response.data.data;
    },

    // Get productivity score for an employee
    getScore: async (employeeId) => {
        const response = await api.get(`/employees/${employeeId}/score`);
        return response.data.data;
    },

    // Submit daily progress report
    submitDailyReport: async (reportData) => {
        const response = await api.post('/progress/submit', {
            task_id: reportData.taskId,
            hours_worked: reportData.hoursWorked,
            completion_percent: reportData.completionPercent,
            issues_faced: reportData.issuesFaced,
            status: reportData.status,
            blocker_desc: reportData.blockerDesc,
            employee_name: reportData.employeeName,
        });
        return response.data;
    },

    // Get today's report for a specific task
    getTodayReport: async (employeeId, taskId) => {
        const response = await api.get('/progress/today', { params: { task_id: taskId } });
        return response.data.data;
    },

    // Get all of today's submitted reports for the logged-in employee
    // Backend returns a dict keyed by task_id: { "task_id": { progress_doc } }
    getAllTodayReports: async () => {
        const response = await api.get('/progress/today/all');
        const data = response.data.data;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            return data; // already a dict keyed by task_id
        }
        // Fallback: handle array shape
        const reports = {};
        if (Array.isArray(data)) {
            data.forEach((r) => {
                reports[r.task_id] = r;
            });
        }
        return reports;
    },

    // Get employee performance data
    getPerformance: async (employeeId) => {
        const response = await api.get(`/employees/${employeeId}/performance`);
        return response.data.data;
    },

    // Get employee work hours data
    getWorkHoursData: async (employeeId) => {
        const response = await api.get(`/employees/${employeeId}/work-hours`);
        return response.data.data;
    },

    // Upload a proof file for a task (multipart/form-data)
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/employees/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },
};

export default employeeService;
