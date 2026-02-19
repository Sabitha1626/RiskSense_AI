import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Loader from '../components/common/Loader';
import ReportList from '../components/reports/ReportList';
import projectService from '../services/projectService';
import { formatDate, getDaysRemaining, isOverdue } from '../utils/dateUtils';
import './TaskDetail.css';

const TaskDetail = () => {
    const { id: projectId, taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projData, taskData] = await Promise.all([
                    projectService.getProjectById(projectId),
                    projectService.getTaskById(projectId, taskId),
                ]);
                setProject(projData);
                setTask(taskData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId, taskId]);

    const getStatusColor = (status) => {
        const map = { completed: 'badge-success', in_progress: 'badge-info', pending: 'badge-warning' };
        return map[status] || 'badge-info';
    };

    const getPriorityColor = (priority) => {
        const map = { critical: 'badge-danger', high: 'badge-warning', medium: 'badge-info', low: 'badge-success' };
        return map[priority] || 'badge-info';
    };

    const renderContent = () => {
        if (loading) return <Loader text="Loading task..." />;
        if (!task) return (
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>Task not found</p>
                    <button className="btn btn-primary" onClick={() => navigate(`/projects/${projectId}`)}>Back to Project</button>
                </div>
            </div>
        );

        const daysLeft = getDaysRemaining(task.deadline);
        const overdue = isOverdue(task.deadline);

        return (
            <div className="page-container animate-fadeIn">
                <button className="btn btn-ghost" onClick={() => navigate(`/projects/${projectId}`)} style={{ marginBottom: '16px' }}>
                    ← Back to {project?.name || 'Project'}
                </button>

                <div className="task-detail-header card">
                    <div className="task-detail-title-row">
                        <h1>{task.title}</h1>
                        <div className="task-badges">
                            <span className={`badge ${getStatusColor(task.status)}`}>
                                {task.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <span className={`badge ${getPriorityColor(task.priority)}`}>
                                {task.priority} priority
                            </span>
                        </div>
                    </div>

                    <div className="task-detail-grid">
                        <div className="task-detail-stat">
                            <span className="stat-label">Progress</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="progress-bar" style={{ flex: 1, height: '10px' }}>
                                    <div className={`progress-fill ${task.progress === 100 ? 'low' : 'medium'}`} style={{ width: `${task.progress}%` }} />
                                </div>
                                <span className="stat-value">{task.progress}%</span>
                            </div>
                        </div>
                        <div className="task-detail-stat">
                            <span className="stat-label">Deadline</span>
                            <span className={`stat-value ${overdue ? 'overdue' : ''}`}>{formatDate(task.deadline)}</span>
                        </div>
                        <div className="task-detail-stat">
                            <span className="stat-label">Time Remaining</span>
                            <span className={`stat-value ${overdue ? 'overdue' : daysLeft <= 3 ? 'urgent' : ''}`}>
                                {overdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}
                            </span>
                        </div>
                        <div className="task-detail-stat">
                            <span className="stat-label">Project</span>
                            <span className="stat-value">{project?.name || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                {/* Report History */}
                <div style={{ marginTop: '28px' }}>
                    <ReportList projectId={projectId} />
                </div>
            </div>
        );
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                {renderContent()}
            </div>
        </div>
    );
};

export default TaskDetail;
