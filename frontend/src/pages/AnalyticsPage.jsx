import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { HiOutlineChartBar, HiOutlineCalendar } from 'react-icons/hi';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Filler, Tooltip, Legend } from 'chart.js';
import HeatmapChart from '../components/charts/HeatmapChart';
import ForecastChart from '../components/charts/ForecastChart';
import TeamComparison from '../components/charts/TeamComparison';
import './AnalyticsPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Filler, Tooltip, Legend);

const AnalyticsPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('productivity');

    const tabs = [
        { id: 'productivity', label: 'Productivity', icon: '📊' },
        { id: 'heatmap', label: 'Activity Heatmap', icon: '🗓️' },
        { id: 'forecast', label: 'Forecast', icon: '📈' },
        { id: 'comparison', label: 'Team Comparison', icon: '👥' },
    ];

    const productivityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Tasks Completed',
                data: [8, 12, 6, 14, 10, 3, 2],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Hours Logged',
                data: [7, 8, 6, 9, 8, 2, 1],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
        },
        scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1><HiOutlineChartBar style={{ verticalAlign: 'middle' }} /> Analytics</h1>
                        <p>Deep dive into team productivity and project metrics</p>
                    </div>

                    {/* KPI summary */}
                    <div className="kpi-grid">
                        <div className="kpi-card primary">
                            <div className="kpi-label">Avg. Daily Output</div>
                            <div className="kpi-value">7.8</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-low)' }}>↑ 12% from last week</span>
                        </div>
                        <div className="kpi-card success">
                            <div className="kpi-label">Sprint Velocity</div>
                            <div className="kpi-value">42</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-low)' }}>story points</span>
                        </div>
                        <div className="kpi-card warning">
                            <div className="kpi-label">Avg. Cycle Time</div>
                            <div className="kpi-value">3.2d</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-medium)' }}>↑ 0.5d from last sprint</span>
                        </div>
                        <div className="kpi-card danger">
                            <div className="kpi-label">Blocked Tasks</div>
                            <div className="kpi-value">4</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-high)' }}>needs attention</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="analytics-tabs">
                        {tabs.map(tab => (
                            <button key={tab.id}
                                className={`analytics-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}>
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="analytics-content animate-fadeIn" key={activeTab}>
                        {activeTab === 'productivity' && (
                            <div className="charts-grid">
                                <div className="chart-card">
                                    <h3>Weekly Productivity</h3>
                                    <Line data={productivityData} options={chartOptions} />
                                </div>
                                <div className="chart-card">
                                    <h3>Task Distribution</h3>
                                    <Bar data={{
                                        labels: ['Frontend', 'Backend', 'Testing', 'Design', 'DevOps'],
                                        datasets: [{
                                            label: 'Tasks',
                                            data: [24, 18, 12, 8, 6],
                                            backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
                                            borderRadius: 6,
                                        }]
                                    }} options={chartOptions} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'heatmap' && <HeatmapChart />}
                        {activeTab === 'forecast' && <ForecastChart />}
                        {activeTab === 'comparison' && <TeamComparison />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
