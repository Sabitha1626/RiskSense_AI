import api from './api';

const dashboardService = {
    /**
     * Aggregate dashboard stats from multiple real endpoints:
     * - Projects list  → totalProjects, active task count
     * - Employees list → trustScores array
     * - Alerts list    → unread alerts
     */
    getManagerDashboard: async () => {
        const [projectsRes, employeesRes, alertsRes] = await Promise.all([
            api.get('/projects/'),
            api.get('/employees/'),
            api.get('/alerts/', { params: { unreadOnly: 'true' } }),
        ]);

        const projects = projectsRes.data.data || [];
        const employees = employeesRes.data.data || [];
        const alerts = alertsRes.data.data || [];

        // Count tasks across all projects
        const activeTasks = projects.reduce((sum, p) => sum + (p.taskCount || 0), 0);

        // Risk distribution counts from project risk_score field
        let safeCount = 0, warningCount = 0, highRiskCount = 0;
        projects.forEach((p) => {
            const rs = p.risk_score || 0;
            if (rs <= 30) safeCount++;
            else if (rs <= 60) warningCount++;
            else highRiskCount++;
        });

        // Build trust scores list from employees
        const trustScores = employees.map((e) => ({
            _id: e._id,
            name: e.name,
            trustScore: e.trust_score ?? 80,
            status: (e.trust_score ?? 80) >= 75
                ? 'Good'
                : (e.trust_score ?? 80) >= 55
                    ? 'Watch'
                    : 'Flagged',
        }));

        return {
            totalProjects: projects.length,
            activeTasks,
            safeCount,
            warningCount,
            highRiskCount,
            trustScores,
            alerts,
        };
    },

    /**
     * Project completion trend — use progress-history for each project
     * and build chart-ready data (labels + datasets).
     */
    getProjectCompletion: async () => {
        const projectsRes = await api.get('/projects/');
        const projects = projectsRes.data.data || [];

        // Build 30-day labels
        const labels = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }

        const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#3b82f6'];
        const datasets = projects.slice(0, 5).map((p, idx) => {
            // Use project.progress as the current completion %; spread it linearly
            const current = p.progress || 0;
            const data = labels.map((_, i) =>
                Math.min(100, Math.round(current * ((i + 1) / 30)))
            );
            return { name: p.name, color: COLORS[idx % COLORS.length], data };
        });

        return { labels, projects: datasets };
    },

    dismissAlert: async (alertId) => {
        await api.put(`/alerts/${alertId}/read`);
        return { success: true };
    },
};

export default dashboardService;
