import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { HiOutlineFolder, HiOutlineClipboardList, HiOutlineShieldCheck, HiOutlineExclamation, HiOutlineXCircle, HiOutlineX } from 'react-icons/hi';
import dashboardService from '../../services/dashboardService';
import Loader from '../common/Loader';
import './ManagerDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [completionData, setCompletionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [dashData, compData] = await Promise.all([
                dashboardService.getManagerDashboard(),
                dashboardService.getProjectCompletion(),
            ]);
            setData(dashData);
            setCompletionData(compData);
            setError('');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleDismiss = async (alertId) => {
        try {
            await dashboardService.dismissAlert(alertId);
            setData(prev => ({
                ...prev,
                alerts: prev.alerts.filter(a => a._id !== alertId),
            }));
        } catch (err) {
            console.error('Failed to dismiss alert');
        }
    };

    if (loading) return <Loader text="Loading dashboard..." />;
    if (error) return <div className="error-state"><p>⚠️ {error}</p><button className="btn btn-primary" onClick={fetchData}>Retry</button></div>;
    if (!data) return null;

    const chartData = completionData ? {
        labels: completionData.labels,
        datasets: completionData.projects.map(p => ({
            label: p.name,
            data: p.data,
            borderColor: p.color,
            backgroundColor: p.color + '20',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
        })),
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true, padding: 20 } },
            title: { display: true, text: 'Project Completion Progress', color: '#f1f5f9', font: { size: 14, family: 'Outfit' } },
        },
        scales: {
            x: { ticks: { color: '#64748b', maxTicksLimit: 10 }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { min: 0, max: 100, ticks: { color: '#64748b', callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'var(--color-risk-critical)';
            case 'warning': return 'var(--color-risk-medium)';
            case 'info': return 'var(--color-risk-low)';
            default: return 'var(--color-risk-low)';
        }
    };

    const getScoreClass = (score) => {
        if (score >= 80) return 'good';
        if (score >= 60) return 'watch';
        return 'flagged';
    };

    return (
        <div className="manager-dashboard animate-fadeIn">
            {/* Summary Cards */}
            <div className="kpi-grid kpi-grid-5">
                <div className="kpi-card primary">
                    <div className="kpi-icon"><HiOutlineFolder /></div>
                    <div className="kpi-value">{data.totalProjects}</div>
                    <div className="kpi-label">Total Projects</div>
                </div>
                <div className="kpi-card primary">
                    <div className="kpi-icon"><HiOutlineClipboardList /></div>
                    <div className="kpi-value">{data.activeTasks}</div>
                    <div className="kpi-label">Active Tasks</div>
                </div>
                <div className="kpi-card success">
                    <div className="kpi-icon"><HiOutlineShieldCheck /></div>
                    <div className="kpi-value">{data.safeCount}</div>
                    <div className="kpi-label">Safe</div>
                </div>
                <div className="kpi-card warning">
                    <div className="kpi-icon"><HiOutlineExclamation /></div>
                    <div className="kpi-value">{data.warningCount}</div>
                    <div className="kpi-label">Warning</div>
                </div>
                <div className="kpi-card danger">
                    <div className="kpi-icon"><HiOutlineXCircle /></div>
                    <div className="kpi-value">{data.highRiskCount}</div>
                    <div className="kpi-label">High Risk</div>
                </div>
            </div>

            {/* Employee Trust Scores */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>👥 Employee Trust Scores</h2>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Trust Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.trustScores.map(emp => (
                                <tr key={emp._id} className={`trust-row trust-row-${getScoreClass(emp.trustScore)}`}>
                                    <td className="td-name">{emp.name}</td>
                                    <td>
                                        <div className="trust-score-cell">
                                            <div className="trust-bar">
                                                <div className={`trust-fill ${getScoreClass(emp.trustScore)}`} style={{ width: `${emp.trustScore}%` }} />
                                            </div>
                                            <span>{emp.trustScore}/100</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${getScoreClass(emp.trustScore) === 'good' ? 'success' : getScoreClass(emp.trustScore) === 'watch' ? 'warning' : 'danger'}`}>
                                            {emp.trustScore >= 80 ? 'Good' : emp.trustScore >= 60 ? 'Watch' : 'Flagged'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/employee-performance?id=${emp._id}`)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Project Completion Graph */}
            <div className="dashboard-section">
                <div className="chart-card">
                    <div className="chart-wrapper" style={{ height: '350px' }}>
                        {chartData && <Line data={chartData} options={chartOptions} />}
                    </div>
                </div>
            </div>

            {/* Alert Feed */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>🔔 Alert Feed</h2>
                </div>
                {data.alerts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">✅</div>
                        <p>All projects are on track</p>
                    </div>
                ) : (
                    <div className="alert-feed">
                        {data.alerts
                            .sort((a, b) => {
                                const order = { critical: 0, warning: 1, info: 2, success: 3 };
                                return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
                            })
                            .map(alert => (
                                <div key={alert._id} className="alert-feed-card card">
                                    <div className="alert-feed-top">
                                        <div className="alert-feed-meta">
                                            <span className="badge" style={{ background: getSeverityColor(alert.severity) + '20', color: getSeverityColor(alert.severity) }}>
                                                {(alert.type || '').replace('_', ' ')}
                                            </span>
                                            <span className="alert-feed-name">{alert.title}</span>
                                            <span className="badge" style={{ background: getSeverityColor(alert.severity) + '20', color: getSeverityColor(alert.severity) }}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <span className="alert-feed-time">{new Date(alert.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="alert-feed-message">{alert.message}</p>
                                    <div className="alert-feed-action">
                                        <button className="btn btn-sm btn-ghost" onClick={() => handleDismiss(alert._id)}>
                                            <HiOutlineX /> Dismiss
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
