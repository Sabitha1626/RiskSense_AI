const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const today = new Date();
const hoursAgo = (n) => new Date(today - n * 3600000).toISOString();
const daysAgo = (n) => new Date(today - n * 86400000).toISOString();

const mockAlerts = [
    { _id: 'a1', type: 'deadline_risk', severity: 'critical', title: 'Mobile Banking App at Critical Risk', message: 'Project "Mobile Banking App" has 85% probability of missing its deadline. Only 5 days remaining with 55% completion.', projectId: 'p3', timestamp: hoursAgo(1), read: false },
    { _id: 'a2', type: 'fraud_detection', severity: 'warning', title: 'Suspicious Report Detected', message: 'Sneha Reddy reported 14 hours with 45% progress on Transaction Module — flagged as statistically unlikely.', reportId: 'r3', employeeId: '4', timestamp: hoursAgo(3), read: false },
    { _id: 'a3', type: 'fraud_detection', severity: 'warning', title: 'Inconsistent Work Report', message: 'Arjun Patel claimed 35% progress on Payroll Engine in only 3 hours — ratio significantly deviates from norms.', reportId: 'r6', employeeId: '3', timestamp: hoursAgo(8), read: false },
    { _id: 'a4', type: 'deadline_risk', severity: 'warning', title: 'E-Commerce Payment Gateway Delayed', message: 'Payment Gateway task is behind schedule. Current progress (40%) significantly below expected (65%) for this date.', projectId: 'p1', taskId: 't2', timestamp: hoursAgo(12), read: true },
    { _id: 'a5', type: 'productivity', severity: 'info', title: 'Low Productivity Alert', message: 'Sneha Reddy\'s productivity score dropped 25% this week compared to her 4-week average.', employeeId: '4', timestamp: daysAgo(1), read: true },
    { _id: 'a6', type: 'fraud_detection', severity: 'warning', title: 'Unusual Hours Pattern', message: 'Kiran Das reported 12 hours with 30% progress on Leave Module — deviates from historical patterns.', reportId: 'r11', employeeId: '5', timestamp: daysAgo(1), read: true },
    { _id: 'a7', type: 'deadline_risk', severity: 'critical', title: 'Security Audit Not Started', message: 'Security Audit task for Mobile Banking App has 0% progress with only 5 days until deadline.', projectId: 'p3', taskId: 't11', timestamp: daysAgo(1), read: true },
    { _id: 'a8', type: 'milestone', severity: 'success', title: 'Frontend UI Completed', message: 'Task "Frontend UI" in E-Commerce Platform has been marked as completed by Sneha Reddy.', projectId: 'p1', taskId: 't3', timestamp: daysAgo(2), read: true },
    { _id: 'a9', type: 'productivity', severity: 'info', title: 'Arjun Patel Exceeding Targets', message: 'Arjun Patel has maintained 85%+ productivity for 3 consecutive weeks. Consider for additional responsibilities.', employeeId: '3', timestamp: daysAgo(3), read: true },
    { _id: 'a10', type: 'deadline_risk', severity: 'info', title: 'HR System On Track', message: 'HR Management System is progressing as planned with 25 days remaining and low risk score (35%).', projectId: 'p2', timestamp: daysAgo(3), read: true },
];

const alertService = {
    getAlerts: async (filters = {}) => {
        await delay(300);
        let alerts = [...mockAlerts];
        if (filters.severity) alerts = alerts.filter((a) => a.severity === filters.severity);
        if (filters.type) alerts = alerts.filter((a) => a.type === filters.type);
        if (filters.unreadOnly) alerts = alerts.filter((a) => !a.read);
        return alerts;
    },

    getUnreadCount: async () => {
        await delay(200);
        return mockAlerts.filter((a) => !a.read).length;
    },

    markAsRead: async (alertId) => {
        await delay(200);
        const alert = mockAlerts.find((a) => a._id === alertId);
        if (alert) alert.read = true;
        return { success: true };
    },

    markAllAsRead: async () => {
        await delay(300);
        mockAlerts.forEach((a) => (a.read = true));
        return { success: true };
    },
};

export default alertService;
