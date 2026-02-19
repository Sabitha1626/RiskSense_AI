const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const today = new Date();
const daysFromNow = (n) => new Date(today.getTime() + n * 86400000).toISOString();
const daysAgo = (n) => new Date(today.getTime() - n * 86400000).toISOString();

const mockRiskData = {
    p1: {
        projectName: 'E-Commerce Platform',
        overallRisk: 'Warning',
        riskPercent: 68,
        confidence: 84,
        tasks: [
            {
                _id: 't2', name: 'Payment Gateway', employee: 'Arjun Patel', completionPercent: 40,
                daysRemaining: 10, predictedCompletion: daysFromNow(14), riskLevel: 'High',
                reason: 'Current velocity is 4% per day but needs 6% to meet deadline. Payment integration tasks historically take 30% longer than estimated.',
                suggestedActions: ['Reassign a senior developer to assist', 'Extend deadline by 4 days', 'Break task into smaller sub-tasks'],
            },
            {
                _id: 't4', name: 'Testing & QA', employee: 'Priya Sharma', completionPercent: 0,
                daysRemaining: 13, predictedCompletion: daysFromNow(18), riskLevel: 'High',
                reason: 'Task has not started yet and depends on Payment Gateway completion. Cascading delay risk detected.',
                suggestedActions: ['Start writing test cases in parallel', 'Assign additional QA resources'],
            },
            {
                _id: 't1', name: 'API Development', employee: 'Priya Sharma', completionPercent: 75,
                daysRemaining: 7, predictedCompletion: daysFromNow(5), riskLevel: 'Medium',
                reason: 'On track but remaining endpoints are complex. Slight risk of 2-day overrun based on current velocity.',
                suggestedActions: ['Monitor daily progress closely', 'Prepare rollback plan for critical endpoints'],
            },
            {
                _id: 't3', name: 'Frontend UI', employee: 'Sneha Reddy', completionPercent: 100,
                daysRemaining: 0, predictedCompletion: daysAgo(2), riskLevel: 'Low',
                reason: 'Task completed on time. No risk.',
                suggestedActions: [],
            },
        ],
    },
    p2: {
        projectName: 'HR Management System',
        overallRisk: 'Safe',
        riskPercent: 35,
        confidence: 91,
        tasks: [
            {
                _id: 't7', name: 'Payroll Engine', employee: 'Arjun Patel', completionPercent: 10,
                daysRemaining: 18, predictedCompletion: daysFromNow(20), riskLevel: 'Medium',
                reason: 'Low progress but ample time remaining. Arjun has flagged concerns in daily reports about complex tax calculations.',
                suggestedActions: ['Schedule a technical review session', 'Provide reference documentation for tax rules'],
            },
            {
                _id: 't6', name: 'Leave Module', employee: 'Kiran Das', completionPercent: 60,
                daysRemaining: 8, predictedCompletion: daysFromNow(6), riskLevel: 'Low',
                reason: 'On track for early completion. Kiran maintains consistent daily progress.',
                suggestedActions: [],
            },
            {
                _id: 't5', name: 'Database Schema', employee: 'Arjun Patel', completionPercent: 100,
                daysRemaining: 0, predictedCompletion: daysAgo(10), riskLevel: 'Low',
                reason: 'Completed ahead of schedule.',
                suggestedActions: [],
            },
        ],
    },
    p3: {
        projectName: 'Mobile Banking App',
        overallRisk: 'High Risk',
        riskPercent: 85,
        confidence: 79,
        tasks: [
            {
                _id: 't11', name: 'Security Audit', employee: 'Priya Sharma', completionPercent: 0,
                daysRemaining: 5, predictedCompletion: daysFromNow(15), riskLevel: 'Critical',
                reason: 'Not started with only 5 days left. Security audits typically require 10-15 days. This task will almost certainly miss its deadline.',
                suggestedActions: ['Hire external security consultants', 'Extend project deadline by 2 weeks', 'Prioritize critical security checks only'],
            },
            {
                _id: 't9', name: 'Transaction Module', employee: 'Sneha Reddy', completionPercent: 50,
                daysRemaining: 3, predictedCompletion: daysFromNow(6), riskLevel: 'Critical',
                reason: 'Sneha\'s trust score is flagged (52). Progress reports show inconsistencies. At current pace, 3 more days needed beyond deadline.',
                suggestedActions: ['Reassign task to a more reliable developer', 'Conduct code review immediately', 'Add resources to accelerate'],
            },
            {
                _id: 't10', name: 'UI/UX Polish', employee: 'Kiran Das', completionPercent: 30,
                daysRemaining: 4, predictedCompletion: daysFromNow(7), riskLevel: 'High',
                reason: 'Velocity is 7.5% per day but needs 17.5% to complete on time. Likely 3 days late.',
                suggestedActions: ['Reduce scope to critical UI fixes only', 'Deprioritize nice-to-have animations'],
            },
            {
                _id: 't8', name: 'Auth System', employee: 'Priya Sharma', completionPercent: 100,
                daysRemaining: 0, predictedCompletion: daysAgo(15), riskLevel: 'Low',
                reason: 'Completed on schedule.',
                suggestedActions: [],
            },
        ],
    },
};

const riskService = {
    getProjects: async () => {
        await delay(300);
        return [
            { _id: 'p1', name: 'E-Commerce Platform' },
            { _id: 'p2', name: 'HR Management System' },
            { _id: 'p3', name: 'Mobile Banking App' },
        ];
    },

    getProjectRisk: async (projectId) => {
        await delay(500);
        return mockRiskData[projectId] || null;
    },
};

export default riskService;
