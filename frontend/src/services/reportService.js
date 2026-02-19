const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const today = new Date();
const daysAgo = (n) => new Date(today - n * 86400000).toISOString();

const mockReports = [
    { _id: 'r1', employeeId: '2', employeeName: 'Priya Sharma', projectId: 'p1', taskId: 't1', date: daysAgo(0), hoursWorked: 8.5, progressPercent: 15, description: 'Implemented REST endpoints for product CRUD operations. Added input validation and error handling.', fraudFlag: false, fraudScore: 0.08 },
    { _id: 'r2', employeeId: '3', employeeName: 'Arjun Patel', projectId: 'p1', taskId: 't2', date: daysAgo(0), hoursWorked: 7, progressPercent: 12, description: 'Integrated Stripe payment gateway. Configured webhook handlers for payment confirmation.', fraudFlag: false, fraudScore: 0.15 },
    { _id: 'r3', employeeId: '4', employeeName: 'Sneha Reddy', projectId: 'p3', taskId: 't9', date: daysAgo(0), hoursWorked: 14, progressPercent: 45, description: 'Completed all transaction modules including transfer, deposit, and withdrawal.', fraudFlag: true, fraudScore: 0.92, fraudReason: 'Reported 14 hours with 45% progress in a single day — statistically unlikely for this task complexity.' },
    { _id: 'r4', employeeId: '5', employeeName: 'Kiran Das', projectId: 'p2', taskId: 't6', date: daysAgo(1), hoursWorked: 6.5, progressPercent: 10, description: 'Built leave request form and approval workflow UI components.', fraudFlag: false, fraudScore: 0.12 },
    { _id: 'r5', employeeId: '2', employeeName: 'Priya Sharma', projectId: 'p3', taskId: 't8', date: daysAgo(1), hoursWorked: 9, progressPercent: 20, description: 'Implemented biometric auth module with fingerprint and face ID support.', fraudFlag: false, fraudScore: 0.22 },
    { _id: 'r6', employeeId: '3', employeeName: 'Arjun Patel', projectId: 'p2', taskId: 't7', date: daysAgo(1), hoursWorked: 3, progressPercent: 35, description: 'Completed entire payroll calculation engine with tax deductions and bonuses.', fraudFlag: true, fraudScore: 0.87, fraudReason: 'Only 3 hours reported but claims 35% progress on a complex payroll engine — inconsistent ratio.' },
    { _id: 'r7', employeeId: '5', employeeName: 'Kiran Das', projectId: 'p3', taskId: 't10', date: daysAgo(2), hoursWorked: 7, progressPercent: 8, description: 'Started UI polish — updated color scheme and typography across main screens.', fraudFlag: false, fraudScore: 0.10 },
    { _id: 'r8', employeeId: '4', employeeName: 'Sneha Reddy', projectId: 'p1', taskId: 't3', date: daysAgo(2), hoursWorked: 8, progressPercent: 18, description: 'Built responsive product listing page with grid/list view toggle and filters.', fraudFlag: false, fraudScore: 0.05 },
    { _id: 'r9', employeeId: '2', employeeName: 'Priya Sharma', projectId: 'p1', taskId: 't1', date: daysAgo(3), hoursWorked: 7.5, progressPercent: 12, description: 'Added authentication middleware and implemented JWT token refresh mechanism.', fraudFlag: false, fraudScore: 0.09 },
    { _id: 'r10', employeeId: '3', employeeName: 'Arjun Patel', projectId: 'p1', taskId: 't2', date: daysAgo(3), hoursWorked: 8, progressPercent: 10, description: 'Set up payment test environment and wrote unit tests for payment flow.', fraudFlag: false, fraudScore: 0.11 },
    { _id: 'r11', employeeId: '5', employeeName: 'Kiran Das', projectId: 'p2', taskId: 't6', date: daysAgo(4), hoursWorked: 12, progressPercent: 30, description: 'Finished leave calendar view and notification system for leave approvals.', fraudFlag: true, fraudScore: 0.78, fraudReason: 'Unusually high hours (12h) with elevated progress claim — pattern deviates from historical averages.' },
];

const reportService = {
    getReports: async (filters = {}) => {
        await delay(400);
        let reports = [...mockReports];
        if (filters.employeeId) reports = reports.filter((r) => r.employeeId === filters.employeeId);
        if (filters.projectId) reports = reports.filter((r) => r.projectId === filters.projectId);
        if (filters.fraudOnly) reports = reports.filter((r) => r.fraudFlag);
        return reports;
    },

    submitReport: async (reportData) => {
        await delay(500);
        return {
            _id: 'r' + (mockReports.length + 1),
            ...reportData,
            date: new Date().toISOString(),
            fraudFlag: false,
            fraudScore: Math.random() * 0.3,
        };
    },

    getFraudReports: async () => {
        await delay(300);
        return mockReports.filter((r) => r.fraudFlag);
    },
};

export default reportService;
