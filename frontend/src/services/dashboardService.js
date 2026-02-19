const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockTrustScores = [
    { _id: '2', name: 'Priya Sharma', trustScore: 87, status: 'Good' },
    { _id: '3', name: 'Arjun Patel', trustScore: 74, status: 'Watch' },
    { _id: '4', name: 'Sneha Reddy', trustScore: 52, status: 'Flagged' },
    { _id: '5', name: 'Kiran Das', trustScore: 81, status: 'Good' },
];

const generateLast30Days = () => {
    const labels = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
};

const generateCompletionData = () => {
    const labels = generateLast30Days();
    return {
        labels,
        projects: [
            {
                name: 'E-Commerce Platform',
                color: '#6366f1',
                data: labels.map((_, i) => Math.min(100, Math.round(20 + (i / 29) * 50 + Math.random() * 5))),
            },
            {
                name: 'HR Management System',
                color: '#10b981',
                data: labels.map((_, i) => Math.min(100, Math.round(10 + (i / 29) * 40 + Math.random() * 5))),
            },
            {
                name: 'Mobile Banking App',
                color: '#ef4444',
                data: labels.map((_, i) => Math.min(100, Math.round(15 + (i / 29) * 45 + Math.random() * 5))),
            },
        ],
    };
};

const mockAlerts = [
    { _id: 'a1', type: 'deadline_risk', priority: 'Critical', title: 'Mobile Banking App at Critical Risk', taskOrEmployee: 'Mobile Banking App', message: 'Project has 85% probability of missing deadline. Only 5 days remaining with 55% completion.', suggestedAction: 'Reassign resources or extend the deadline immediately.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { _id: 'a2', type: 'fraud_detection', priority: 'High', title: 'Suspicious Report — Sneha Reddy', taskOrEmployee: 'Sneha Reddy', message: 'Reported 14 hours with 45% progress on Transaction Module — flagged as statistically unlikely.', suggestedAction: 'Review Sneha\'s daily reports and schedule a one-on-one.', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), read: false },
    { _id: 'a3', type: 'fraud_detection', priority: 'High', title: 'Inconsistent Work Report — Arjun Patel', taskOrEmployee: 'Arjun Patel', message: 'Claimed 35% progress on Payroll Engine in only 3 hours.', suggestedAction: 'Ask Arjun for a detailed work breakdown.', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), read: false },
    { _id: 'a4', type: 'deadline_risk', priority: 'Medium', title: 'Payment Gateway Delayed', taskOrEmployee: 'Payment Gateway', message: 'Task behind schedule. Current progress 40% vs expected 65%.', suggestedAction: 'Consider assigning an additional developer.', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), read: false },
    { _id: 'a5', type: 'productivity', priority: 'Low', title: 'Low Productivity — Sneha Reddy', taskOrEmployee: 'Sneha Reddy', message: 'Productivity dropped 25% this week compared to 4-week average.', suggestedAction: 'Check for blockers and offer support.', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), read: false },
];

let alertState = mockAlerts.map(a => ({ ...a }));

const dashboardService = {
    getManagerDashboard: async () => {
        await delay(400);
        return {
            totalProjects: 3,
            activeTasks: 8,
            safeCount: 4,
            warningCount: 3,
            highRiskCount: 4,
            trustScores: mockTrustScores,
            alerts: alertState.filter(a => !a.read),
        };
    },

    getProjectCompletion: async () => {
        await delay(300);
        return generateCompletionData();
    },

    dismissAlert: async (alertId) => {
        await delay(200);
        alertState = alertState.filter(a => a._id !== alertId);
        return { success: true };
    },
};

export default dashboardService;
