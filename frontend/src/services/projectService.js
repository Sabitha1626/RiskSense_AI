const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const today = new Date();
const daysAgo = (n) => new Date(today - n * 86400000).toISOString();
const daysFromNow = (n) => new Date(today.getTime() + n * 86400000).toISOString();

const mockProjects = [
    {
        _id: 'p1',
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration, inventory management, and analytics dashboard.',
        status: 'in_progress',
        startDate: daysAgo(45),
        deadline: daysFromNow(15),
        progress: 62,
        riskScore: 68,
        teamMembers: ['2', '3', '4'],
        managerId: '1',
        tasks: [
            { _id: 't1', title: 'API Development', assignee: '2', status: 'in_progress', progress: 75, priority: 'high', deadline: daysFromNow(7) },
            { _id: 't2', title: 'Payment Gateway', assignee: '3', status: 'in_progress', progress: 40, priority: 'critical', deadline: daysFromNow(10) },
            { _id: 't3', title: 'Frontend UI', assignee: '4', status: 'completed', progress: 100, priority: 'medium', deadline: daysAgo(2) },
            { _id: 't4', title: 'Testing & QA', assignee: '2', status: 'pending', progress: 0, priority: 'high', deadline: daysFromNow(13) },
        ],
    },
    {
        _id: 'p2',
        name: 'HR Management System',
        description: 'Employee management with leave tracking, payroll, and performance reviews.',
        status: 'in_progress',
        startDate: daysAgo(30),
        deadline: daysFromNow(25),
        progress: 45,
        riskScore: 35,
        teamMembers: ['3', '5'],
        managerId: '1',
        tasks: [
            { _id: 't5', title: 'Database Schema', assignee: '3', status: 'completed', progress: 100, priority: 'high', deadline: daysAgo(10) },
            { _id: 't6', title: 'Leave Module', assignee: '5', status: 'in_progress', progress: 60, priority: 'medium', deadline: daysFromNow(8) },
            { _id: 't7', title: 'Payroll Engine', assignee: '3', status: 'pending', progress: 10, priority: 'high', deadline: daysFromNow(18) },
        ],
    },
    {
        _id: 'p3',
        name: 'Mobile Banking App',
        description: 'Cross-platform mobile app for banking services with biometric auth and real-time transactions.',
        status: 'at_risk',
        startDate: daysAgo(60),
        deadline: daysFromNow(5),
        progress: 55,
        riskScore: 85,
        teamMembers: ['2', '4', '5'],
        managerId: '1',
        tasks: [
            { _id: 't8', title: 'Auth System', assignee: '2', status: 'completed', progress: 100, priority: 'critical', deadline: daysAgo(15) },
            { _id: 't9', title: 'Transaction Module', assignee: '4', status: 'in_progress', progress: 50, priority: 'critical', deadline: daysFromNow(3) },
            { _id: 't10', title: 'UI/UX Polish', assignee: '5', status: 'in_progress', progress: 30, priority: 'high', deadline: daysFromNow(4) },
            { _id: 't11', title: 'Security Audit', assignee: '2', status: 'pending', progress: 0, priority: 'critical', deadline: daysFromNow(5) },
        ],
    },
];

const mockProgressHistory = {
    p1: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        planned: [10, 25, 40, 55, 72, 85],
        actual: [8, 20, 35, 48, 58, 62],
    },
    p2: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        planned: [15, 30, 50, 70],
        actual: [12, 28, 40, 45],
    },
    p3: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        planned: [8, 18, 30, 42, 55, 68, 82, 95],
        actual: [6, 14, 22, 30, 38, 44, 50, 55],
    },
};

const mockProductivity = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: {
        '2': [78, 82, 75, 88, 70, 30, 0],
        '3': [85, 90, 88, 92, 80, 45, 10],
        '4': [60, 65, 55, 70, 62, 20, 0],
        '5': [72, 78, 80, 75, 68, 35, 5],
    },
};

const mockWorkHours = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    expected: [8, 8, 8, 8, 8, 4, 0],
    datasets: {
        '2': [7.5, 8.5, 7, 9, 6.5, 2, 0],
        '3': [8, 9, 8.5, 9.5, 8, 4, 1],
        '4': [6, 7, 5.5, 7.5, 6, 2, 0],
        '5': [7, 8, 8, 7.5, 6.5, 3, 0],
    },
};

const projectService = {
    getProjects: async () => {
        await delay(400);
        return mockProjects;
    },

    getProjectById: async (id) => {
        await delay(300);
        return mockProjects.find((p) => p._id === id) || null;
    },

    getTaskById: async (projectId, taskId) => {
        await delay(300);
        const project = mockProjects.find((p) => p._id === projectId);
        if (!project) return null;
        return project.tasks.find((t) => t._id === taskId) || null;
    },

    getProgressHistory: async (projectId) => {
        await delay(300);
        return mockProgressHistory[projectId] || mockProgressHistory.p1;
    },

    getProductivityData: async (employeeId) => {
        await delay(300);
        return {
            labels: mockProductivity.labels,
            data: mockProductivity.datasets[employeeId] || mockProductivity.datasets['2'],
        };
    },

    getWorkHoursData: async (employeeId) => {
        await delay(300);
        return {
            labels: mockWorkHours.labels,
            expected: mockWorkHours.expected,
            actual: mockWorkHours.datasets[employeeId] || mockWorkHours.datasets['2'],
        };
    },

    getRiskDistribution: async () => {
        await delay(200);
        const low = mockProjects.filter((p) => p.riskScore <= 25).length;
        const medium = mockProjects.filter((p) => p.riskScore > 25 && p.riskScore <= 50).length;
        const high = mockProjects.filter((p) => p.riskScore > 50 && p.riskScore <= 75).length;
        const critical = mockProjects.filter((p) => p.riskScore > 75).length;
        return { low, medium, high, critical };
    },

    getProjects: async () => {
        await delay(200);
        return mockProjects.map(p => ({ _id: p._id, name: p.name }));
    },
};

export default projectService;
