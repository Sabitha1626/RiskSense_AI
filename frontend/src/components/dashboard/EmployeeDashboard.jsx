import { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { AuthContext } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';
import Loader from '../common/Loader';
import './EmployeeDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [score, setScore] = useState(null);
    const [todayReports, setTodayReports] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Daily progress form state
    const [selectedTask, setSelectedTask] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [completionPercent, setCompletionPercent] = useState(0);
    const [issuesFaced, setIssuesFaced] = useState('');
    const [taskStatus, setTaskStatus] = useState('In Progress');
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const userId = user?._id || '2';
                const [taskData, scoreData, reports] = await Promise.all([
                    employeeService.getTasks(userId),
                    employeeService.getScore(userId),
                    employeeService.getAllTodayReports(userId),
                ]);
                setTasks(taskData);
                setScore(scoreData);
                setTodayReports(reports);
                setError('');
            } catch (err) {
                setError('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [user]);

    const getCountdown = (deadline) => {
        const diff = new Date(deadline) - new Date();
        if (diff <= 0) return { text: 'Overdue', color: 'var(--color-risk-high)' };
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        let color = 'var(--color-risk-low)';
        if (days < 2) color = 'var(--color-risk-high)';
        else if (days <= 7) color = 'var(--color-risk-medium)';
        return { text: `${days}d ${hours}h`, color };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTask) return;
        setSubmitting(true);
        setSubmitMsg('');
        try {
            const result = await employeeService.submitDailyReport({
                taskId: selectedTask,
                hoursWorked: parseFloat(hoursWorked),
                completionPercent,
                issuesFaced,
                status: taskStatus,
            });
            setSubmitMsg(result.message);
            setTodayReports(prev => ({ ...prev, [selectedTask]: { hoursWorked, completionPercent, issuesFaced, status: taskStatus } }));
            setSelectedTask('');
            setHoursWorked('');
            setCompletionPercent(0);
            setIssuesFaced('');
            setTaskStatus('In Progress');
        } catch (err) {
            setSubmitMsg('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader text="Loading your dashboard..." />;
    if (error) return <div className="error-state"><p>⚠️ {error}</p></div>;

    const scoreLabel = score?.current >= 80 ? 'Good' : score?.current >= 60 ? 'Watch' : 'Needs Improvement';
    const scoreColor = score?.current >= 80 ? 'var(--color-risk-low)' : score?.current >= 60 ? 'var(--color-risk-medium)' : 'var(--color-risk-high)';

    const scoreChartData = score ? {
        labels: score.labels,
        datasets: [{
            label: 'Trust Score',
            data: score.history,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
        }],
    } : null;

    const scoreChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { ticks: { color: '#64748b', maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { min: 0, max: 100, ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
    };

    const activeTasks = tasks.filter(t => t.status !== 'Completed');
    const selectedTaskData = tasks.find(t => t._id === selectedTask);
    const alreadySubmitted = selectedTask && todayReports[selectedTask];

    return (
        <div className="employee-dashboard animate-fadeIn">
            {/* Assigned Tasks */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>📋 My Assigned Tasks</h2>
                </div>
                {tasks.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">📭</div><p>No tasks assigned yet.</p></div>
                ) : (
                    <div className="task-cards-grid">
                        {tasks.map(task => (
                            <div key={task._id} className="task-card card">
                                <div className="task-card-header">
                                    <h4>{task.name}</h4>
                                    <span className={`badge badge-${task.priority === 'Critical' ? 'danger' : task.priority === 'High' ? 'warning' : task.priority === 'Medium' ? 'info' : 'success'}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                <p className="task-project">{task.projectName}</p>
                                <div className="task-meta">
                                    <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                                    <span className={`badge badge-${task.status === 'Completed' ? 'success' : task.status === 'Overdue' ? 'danger' : 'info'}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="progress-bar" style={{ marginTop: '10px' }}>
                                    <div className="progress-fill" style={{ width: `${task.completionPercent}%`, background: task.completionPercent === 100 ? 'var(--color-risk-low)' : 'var(--gradient-primary)' }} />
                                </div>
                                <span className="progress-text">{task.completionPercent}% complete</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Deadline Countdown */}
            {activeTasks.length > 0 && (
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>⏳ Deadline Countdown</h2>
                    </div>
                    <div className="countdown-grid">
                        {activeTasks.map(task => {
                            const cd = getCountdown(task.deadline);
                            return (
                                <div key={task._id} className="countdown-card card">
                                    <h4>{task.name}</h4>
                                    <div className="countdown-time" style={{ color: cd.color }}>{cd.text}</div>
                                    <span className="countdown-label">remaining</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Daily Progress Entry */}
            <div className="dashboard-section">
                <div className="section-header">
                    <h2>📝 Daily Progress Entry</h2>
                </div>
                {submitMsg && <div className="auth-success animate-fadeIn" style={{ marginBottom: '16px' }}>{submitMsg}</div>}
                <div className="card daily-progress-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Task</label>
                            <select className="form-input" value={selectedTask} onChange={e => setSelectedTask(e.target.value)} required>
                                <option value="">-- Choose a task --</option>
                                {activeTasks.map(t => (
                                    <option key={t._id} value={t._id}>{t.name} ({t.projectName})</option>
                                ))}
                            </select>
                        </div>

                        {alreadySubmitted ? (
                            <div className="submitted-readonly">
                                <p className="submitted-label">✅ Report already submitted for this task today</p>
                                <div className="submitted-data">
                                    <span>Hours: {todayReports[selectedTask].hoursWorked}h</span>
                                    <span>Completion: {todayReports[selectedTask].completionPercent}%</span>
                                    <span>Status: {todayReports[selectedTask].status}</span>
                                </div>
                            </div>
                        ) : selectedTask && (
                            <>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Hours Worked Today</label>
                                        <input type="number" className="form-input" min="0" max="24" step="0.5" value={hoursWorked} onChange={e => setHoursWorked(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Completion: {completionPercent}%</label>
                                        <input type="range" className="slider" min={selectedTaskData?.completionPercent || 0} max="100" value={completionPercent} onChange={e => {
                                            setCompletionPercent(parseInt(e.target.value));
                                            if (parseInt(e.target.value) === 100) setTaskStatus('Completed');
                                        }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Issues Faced (optional)</label>
                                    <textarea className="form-input" value={issuesFaced} onChange={e => setIssuesFaced(e.target.value)} placeholder="Describe any blockers..." rows="3" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Task Status</label>
                                    <div className="radio-group">
                                        {['In Progress', 'Completed', 'Blocked'].map(s => (
                                            <label key={s} className={`radio-pill ${taskStatus === s ? 'active' : ''}`}>
                                                <input type="radio" name="status" value={s} checked={taskStatus === s} onChange={e => {
                                                    setTaskStatus(e.target.value);
                                                    if (e.target.value === 'Completed') setCompletionPercent(100);
                                                }} />
                                                {s}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>

            {/* Personal Reliability Score */}
            {score && (
                <div className="dashboard-section">
                    <div className="section-header">
                        <h2>🎯 Personal Reliability Score</h2>
                    </div>
                    <div className="reliability-section">
                        <div className="reliability-circle-wrap">
                            <div className="reliability-circle" style={{ '--score-color': scoreColor }}>
                                <svg viewBox="0 0 120 120" className="circle-svg">
                                    <circle cx="60" cy="60" r="52" className="circle-bg" />
                                    <circle cx="60" cy="60" r="52" className="circle-fill" style={{ strokeDashoffset: 326.7 - (326.7 * score.current / 100), stroke: scoreColor }} />
                                </svg>
                                <div className="circle-text">
                                    <span className="circle-value">{score.current}</span>
                                    <span className="circle-max">/100</span>
                                </div>
                            </div>
                            <span className="reliability-label" style={{ color: scoreColor }}>{scoreLabel}</span>
                        </div>
                        <div className="reliability-chart card">
                            <h4>Trust Score — Last 30 Days</h4>
                            <div style={{ height: '200px' }}>
                                {scoreChartData && <Line data={scoreChartData} options={scoreChartOptions} />}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
