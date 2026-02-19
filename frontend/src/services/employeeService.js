const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const today = new Date();
const daysFromNow = (n) => new Date(today.getTime() + n * 86400000).toISOString();
const daysAgo = (n) => new Date(today.getTime() - n * 86400000).toISOString();

const generateLast30Days = () => {
    const labels = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
};

const mockEmployeeTasks = {
    '2': [
        { _id: 't1', name: 'API Development', projectName: 'E-Commerce Platform', deadline: daysFromNow(7), completionPercent: 75, priority: 'High', status: 'In Progress' },
        { _id: 't4', name: 'Testing & QA', projectName: 'E-Commerce Platform', deadline: daysFromNow(13), completionPercent: 0, priority: 'High', status: 'In Progress' },
        { _id: 't8', name: 'Auth System', projectName: 'Mobile Banking App', deadline: daysAgo(15), completionPercent: 100, priority: 'Critical', status: 'Completed' },
    ],
    '3': [
        { _id: 't2', name: 'Payment Gateway', projectName: 'E-Commerce Platform', deadline: daysFromNow(10), completionPercent: 40, priority: 'Critical', status: 'In Progress' },
        { _id: 't5', name: 'Database Schema', projectName: 'HR Management System', deadline: daysAgo(10), completionPercent: 100, priority: 'High', status: 'Completed' },
        { _id: 't7', name: 'Payroll Engine', projectName: 'HR Management System', deadline: daysFromNow(18), completionPercent: 10, priority: 'High', status: 'In Progress' },
    ],
    '4': [
        { _id: 't3', name: 'Frontend UI', projectName: 'E-Commerce Platform', deadline: daysAgo(2), completionPercent: 100, priority: 'Medium', status: 'Completed' },
        { _id: 't9', name: 'Transaction Module', projectName: 'Mobile Banking App', deadline: daysFromNow(3), completionPercent: 50, priority: 'Critical', status: 'In Progress' },
    ],
    '5': [
        { _id: 't6', name: 'Leave Module', projectName: 'HR Management System', deadline: daysFromNow(8), completionPercent: 60, priority: 'Medium', status: 'In Progress' },
        { _id: 't10', name: 'UI/UX Polish', projectName: 'Mobile Banking App', deadline: daysFromNow(4), completionPercent: 30, priority: 'High', status: 'In Progress' },
    ],
};

const mockScores = {
    '2': { current: 87, history: generateLast30Days().map(() => 80 + Math.floor(Math.random() * 15)) },
    '3': { current: 74, history: generateLast30Days().map(() => 65 + Math.floor(Math.random() * 18)) },
    '4': { current: 52, history: generateLast30Days().map(() => 40 + Math.floor(Math.random() * 20)) },
    '5': { current: 81, history: generateLast30Days().map(() => 75 + Math.floor(Math.random() * 12)) },
};

let submittedReports = {};

const mockPerformance = {
    '2': {
        trustScore: 87,
        label: 'Reliable',
        completedTasks: [
            { task: 'Auth System', project: 'Mobile Banking App', estimatedHours: 40, actualHours: 38, deadline: daysAgo(15), completionDate: daysAgo(16), onTime: true, accuracy: 95 },
            { task: 'User Module', project: 'HR System', estimatedHours: 24, actualHours: 28, deadline: daysAgo(30), completionDate: daysAgo(28), onTime: true, accuracy: 86 },
        ],
        delays: [],
        productivityData: generateLast30Days().map(() => 75 + Math.floor(Math.random() * 20)),
        teamAverage: generateLast30Days().map(() => 65 + Math.floor(Math.random() * 10)),
    },
    '3': {
        trustScore: 74,
        label: 'Watch',
        completedTasks: [
            { task: 'Database Schema', project: 'HR Management System', estimatedHours: 20, actualHours: 22, deadline: daysAgo(10), completionDate: daysAgo(9), onTime: true, accuracy: 91 },
            { task: 'API Endpoints', project: 'E-Commerce Platform', estimatedHours: 30, actualHours: 40, deadline: daysAgo(20), completionDate: daysAgo(17), onTime: false, accuracy: 75 },
        ],
        delays: [
            { task: 'API Endpoints', daysDelayed: 3, reason: 'Requirements changed mid-sprint, had to refactor most endpoints.' },
        ],
        productivityData: generateLast30Days().map(() => 60 + Math.floor(Math.random() * 25)),
        teamAverage: generateLast30Days().map(() => 65 + Math.floor(Math.random() * 10)),
    },
    '4': {
        trustScore: 52,
        label: 'Flagged',
        completedTasks: [
            { task: 'Frontend UI', project: 'E-Commerce Platform', estimatedHours: 35, actualHours: 50, deadline: daysAgo(2), completionDate: daysAgo(1), onTime: false, accuracy: 70 },
        ],
        delays: [
            { task: 'Frontend UI', daysDelayed: 1, reason: 'Design mockups were changed twice during development.' },
            { task: 'Transaction Module', daysDelayed: 2, reason: 'Integration issues with third-party payment API.' },
        ],
        productivityData: generateLast30Days().map(() => 40 + Math.floor(Math.random() * 25)),
        teamAverage: generateLast30Days().map(() => 65 + Math.floor(Math.random() * 10)),
    },
    '5': {
        trustScore: 81,
        label: 'Reliable',
        completedTasks: [
            { task: 'Leave Form UI', project: 'HR Management System', estimatedHours: 16, actualHours: 15, deadline: daysAgo(7), completionDate: daysAgo(8), onTime: true, accuracy: 94 },
        ],
        delays: [],
        productivityData: generateLast30Days().map(() => 70 + Math.floor(Math.random() * 18)),
        teamAverage: generateLast30Days().map(() => 65 + Math.floor(Math.random() * 10)),
    },
};

const employeeService = {
    getTasks: async (employeeId) => {
        await delay(400);
        return mockEmployeeTasks[employeeId] || [];
    },

    getScore: async (employeeId) => {
        await delay(300);
        const score = mockScores[employeeId] || { current: 70, history: [] };
        return {
            current: score.current,
            labels: generateLast30Days(),
            history: score.history,
        };
    },

    submitDailyReport: async (reportData) => {
        await delay(500);
        const key = `${reportData.taskId}_${new Date().toDateString()}`;
        submittedReports[key] = { ...reportData, submittedAt: new Date().toISOString() };
        return { success: true, message: 'Your daily report has been submitted successfully' };
    },

    getTodayReport: async (employeeId, taskId) => {
        await delay(300);
        const key = `${taskId}_${new Date().toDateString()}`;
        return submittedReports[key] || null;
    },

    getAllTodayReports: async (employeeId) => {
        await delay(300);
        const todayKey = new Date().toDateString();
        const reports = {};
        Object.keys(submittedReports).forEach(key => {
            if (key.endsWith(todayKey)) {
                const taskId = key.split('_')[0];
                reports[taskId] = submittedReports[key];
            }
        });
        return reports;
    },

    getPerformance: async (employeeId) => {
        await delay(400);
        const perf = mockPerformance[employeeId];
        if (!perf) return null;
        return {
            ...perf,
            labels: generateLast30Days(),
        };
    },

    getAllEmployees: async () => {
        await delay(300);
        return [
            { _id: '2', name: 'Priya Sharma', email: 'priya@company.com', role: 'employee' },
            { _id: '3', name: 'Arjun Patel', email: 'arjun@company.com', role: 'employee' },
            { _id: '4', name: 'Sneha Reddy', email: 'sneha@company.com', role: 'employee' },
            { _id: '5', name: 'Kiran Das', email: 'kiran@company.com', role: 'employee' },
        ];
    },

    uploadFile: async (file) => {
        await delay(600);
        return { success: true, url: `/uploads/${file.name}`, filename: file.name };
    },
};

export default employeeService;
