import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import riskService from '../services/riskService';
import Loader from '../components/common/Loader';

const RiskPrediction = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [riskLoading, setRiskLoading] = useState(false);
    const [expandedTask, setExpandedTask] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await riskService.getProjects();
                setProjects(data);
            } catch (err) {
                setError('Failed to load projects.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProject) {
            setRiskData(null);
            return;
        }
        const fetchRisk = async () => {
            setRiskLoading(true);
            setExpandedTask(null);
            try {
                const data = await riskService.getProjectRisk(selectedProject);
                setRiskData(data);
                setError('');
            } catch (err) {
                setError('Failed to load risk data.');
            } finally {
                setRiskLoading(false);
            }
        };
        fetchRisk();
    }, [selectedProject]);

    const getRiskColor = (level) => {
        switch (level) {
            case 'Critical': return 'var(--color-risk-critical)';
            case 'High': return 'var(--color-risk-high)';
            case 'Medium': return 'var(--color-risk-medium)';
            default: return 'var(--color-risk-low)';
        }
    };

    const getRiskBg = (level) => {
        switch (level) {
            case 'Critical': return 'var(--color-risk-critical-bg)';
            case 'High': return 'var(--color-risk-high-bg)';
            case 'Medium': return 'var(--color-risk-medium-bg)';
            default: return 'var(--color-risk-low-bg)';
        }
    };

    const getBadgeColor = (risk) => {
        if (risk === 'Safe') return 'var(--color-risk-low)';
        if (risk === 'Warning') return 'var(--color-risk-medium)';
        return 'var(--color-risk-high)';
    };

    const riskOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const sortedTasks = riskData?.tasks ? [...riskData.tasks].sort((a, b) => (riskOrder[a.riskLevel] ?? 4) - (riskOrder[b.riskLevel] ?? 4)) : [];

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Risk Prediction</h1>
                        <p>AI-powered risk analysis for your projects</p>
                    </div>

                    {loading ? <Loader text="Loading..." /> : (
                        <div className="animate-fadeIn">
                            {error && <div className="auth-error">{error}</div>}

                            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '28px' }}>
                                <label className="form-label">Select Project</label>
                                <select className="form-input" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                                    <option value="">-- Choose a project --</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {riskLoading && <Loader text="Analyzing risks..." />}

                            {riskData && !riskLoading && (
                                <>
                                    {/* Risk Badge */}
                                    <div className="risk-summary-banner">
                                        <div className="risk-badge-large" style={{ background: getBadgeColor(riskData.overallRisk) + '20', color: getBadgeColor(riskData.overallRisk), borderColor: getBadgeColor(riskData.overallRisk) }}>
                                            {riskData.overallRisk}
                                        </div>
                                        <div className="risk-percent">{riskData.riskPercent}% at risk</div>
                                        <div className="risk-confidence">Prediction confidence: {riskData.confidence}%</div>
                                    </div>

                                    {/* Task-Level Breakdown */}
                                    <div className="dashboard-section" style={{ marginTop: '28px' }}>
                                        <div className="section-header">
                                            <h2>📊 Task-Level Risk Breakdown</h2>
                                        </div>
                                        <div className="table-container">
                                            <table className="table risk-table">
                                                <thead>
                                                    <tr>
                                                        <th>Task Name</th>
                                                        <th>Assigned To</th>
                                                        <th>Completion</th>
                                                        <th>Days Left</th>
                                                        <th>Predicted Completion</th>
                                                        <th>Risk Level</th>
                                                        <th>Reason</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedTasks.map(task => (
                                                        <>
                                                            <tr
                                                                key={task._id}
                                                                className="risk-row clickable"
                                                                style={{ background: getRiskBg(task.riskLevel) }}
                                                                onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                                                            >
                                                                <td className="td-name">{task.name}</td>
                                                                <td>{task.employee}</td>
                                                                <td>
                                                                    <div className="progress-bar" style={{ width: '80px', display: 'inline-block' }}>
                                                                        <div className="progress-fill" style={{ width: `${task.completionPercent}%` }} />
                                                                    </div>
                                                                    <span style={{ marginLeft: '8px' }}>{task.completionPercent}%</span>
                                                                </td>
                                                                <td>{task.daysRemaining}</td>
                                                                <td>{new Date(task.predictedCompletion).toLocaleDateString()}</td>
                                                                <td>
                                                                    <span className="badge" style={{ background: getRiskColor(task.riskLevel) + '20', color: getRiskColor(task.riskLevel) }}>
                                                                        {task.riskLevel}
                                                                    </span>
                                                                </td>
                                                                <td className="td-reason">{task.reason.substring(0, 60)}...</td>
                                                            </tr>
                                                            {expandedTask === task._id && (
                                                                <tr key={task._id + '-detail'} className="risk-detail-row">
                                                                    <td colSpan="7">
                                                                        <div className="risk-detail-panel animate-fadeIn">
                                                                            <h4>🔍 Risk Analysis</h4>
                                                                            <p>{task.reason}</p>
                                                                            {task.suggestedActions.length > 0 && (
                                                                                <>
                                                                                    <h4 style={{ marginTop: '16px' }}>💡 Suggested Actions</h4>
                                                                                    <div className="suggested-actions">
                                                                                        {task.suggestedActions.map((action, i) => (
                                                                                            <div key={i} className="action-item">
                                                                                                <span>{action}</span>
                                                                                                <button className="btn btn-sm btn-secondary" onClick={(e) => {
                                                                                                    e.stopPropagation();
                                                                                                    if (window.confirm(`Are you sure you want to: "${action}"?`)) {
                                                                                                        alert('Action confirmed. This would be executed via the backend.');
                                                                                                    }
                                                                                                }}>
                                                                                                    Apply
                                                                                                </button>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiskPrediction;
