import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import RiskMeter from '../components/dashboard/RiskMeter';
import ProgressChart from '../components/charts/ProgressChart';
import WorkHoursChart from '../components/charts/WorkHoursChart';
import ReportList from '../components/reports/ReportList';
import Loader from '../components/common/Loader';
import AlertBadge from '../components/common/AlertBadge';
import projectService from '../services/projectService';
import { formatDate, getDaysRemaining, isOverdue } from '../utils/dateUtils';
import { getRiskBadgeClass, getRiskLabel } from '../utils/riskColorMapper';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await projectService.getProjectById(id);
                setProject(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <Navbar sidebarCollapsed={sidebarCollapsed} />
                    <Loader text="Loading project..." />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="app-layout">
                <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <Navbar sidebarCollapsed={sidebarCollapsed} />
                    <div className="page-container">
                        <div className="empty-state">
                            <div className="empty-icon">📂</div>
                            <p>Project not found</p>
                            <button className="btn btn-primary" onClick={() => navigate('/manager')}>Back to Dashboard</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const daysLeft = getDaysRemaining(project.deadline);
    const overdue = isOverdue(project.deadline);

    const getPriorityBadge = (priority) => {
        const map = { critical: 'badge-danger', high: 'badge-warning', medium: 'badge-info', low: 'badge-success' };
        return map[priority] || 'badge-info';
    };

    const getStatusBadge = (status) => {
        const map = { completed: 'badge-success', in_progress: 'badge-info', pending: 'badge-warning' };
        return map[status] || 'badge-info';
    };

    const getStatusLabel = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container animate-fadeIn">
                    {/* Header */}
                    <div className="project-detail-header">
                        <div className="project-detail-info">
                            <div className="project-detail-title-row">
                                <h1>{project.name}</h1>
                                <span className={`badge ${getRiskBadgeClass(project.riskScore)}`}>
                                    {getRiskLabel(project.riskScore)} Risk
                                </span>
                            </div>
                            <p className="project-detail-desc">{project.description}</p>
                            <div className="project-detail-meta">
                                <span>📅 Start: {formatDate(project.startDate)}</span>
                                <span>🏁 Deadline: {formatDate(project.deadline)}</span>
                                <span className={overdue ? 'overdue' : daysLeft <= 7 ? 'urgent' : ''}>
                                    ⏳ {overdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d remaining`}
                                </span>
                                <span>👥 {project.teamMembers?.length || 0} members</span>
                            </div>
                        </div>
                        <RiskMeter score={project.riskScore} size={140} />
                    </div>

                    {/* Progress */}
                    <div className="project-progress-section card">
                        <div className="progress-header">
                            <span>Overall Progress</span>
                            <span className="progress-value">{project.progress}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: '12px' }}>
                            <div
                                className={`progress-fill ${project.riskScore > 50 ? 'high' : project.riskScore > 25 ? 'medium' : 'low'}`}
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>📊 Progress: Planned vs Actual</h3>
                            <ProgressChart projectId={project._id} />
                        </div>
                        <div className="chart-card">
                            <h3>⏱️ Team Work Hours</h3>
                            <WorkHoursChart employeeId={project.teamMembers?.[0] || '2'} />
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="section-header">
                        <h2>📋 Tasks</h2>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Progress</th>
                                    <th>Deadline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.tasks?.map((task) => (
                                    <tr
                                        key={task._id}
                                        className="task-row"
                                        onClick={() => navigate(`/projects/${project._id}/tasks/${task._id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td style={{ color: 'var(--color-text)', fontWeight: 500 }}>{task.title}</td>
                                        <td><span className={`badge ${getStatusBadge(task.status)}`}>{getStatusLabel(task.status)}</span></td>
                                        <td><span className={`badge ${getPriorityBadge(task.priority)}`}>{task.priority}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className="progress-bar" style={{ width: '80px', height: '6px' }}>
                                                    <div className={`progress-fill ${task.progress === 100 ? 'low' : task.progress > 50 ? 'medium' : 'high'}`} style={{ width: `${task.progress}%` }} />
                                                </div>
                                                <span style={{ fontSize: '0.82rem' }}>{task.progress}%</span>
                                            </div>
                                        </td>
                                        <td>{formatDate(task.deadline)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Reports */}
                    <div style={{ marginTop: '28px' }}>
                        <ReportList projectId={project._id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
