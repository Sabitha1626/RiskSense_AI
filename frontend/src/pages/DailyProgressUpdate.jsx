import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import employeeService from '../services/employeeService';
import Loader from '../components/common/Loader';

const DailyProgressUpdate = () => {
    const { user } = useContext(AuthContext);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [todayReports, setTodayReports] = useState({});
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [errors, setErrors] = useState({});
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        hoursWorked: '',
        completionPercent: 0,
        issuesFaced: '',
        status: 'In Progress',
        blockerDesc: '',
    });
    const [uploadFile, setUploadFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) return;
            try {
                const [taskData, reports] = await Promise.all([
                    employeeService.getTasks(user._id),
                    employeeService.getAllTodayReports(),
                ]);
                setTasks(taskData || []);
                setTodayReports(reports || {});
            } catch (err) {
                console.error('Failed to load tasks:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleSelect = (task) => {
        setSelectedTask(task);
        setSubmitMsg('');
        setSubmitError('');
        setErrors({});
        setUploadFile(null);
        if (fileRef.current) fileRef.current.value = '';

        // Pre-fill form from today's report if already submitted
        const taskKey = task._id;
        if (todayReports[taskKey]) {
            const r = todayReports[taskKey];
            setForm({
                hoursWorked: r.hours_worked || '',
                completionPercent: r.completion_percent || 0,
                issuesFaced: r.issues_faced || '',
                status: r.status || 'In Progress',
                blockerDesc: r.blocker_desc || '',
            });
        } else {
            setForm({
                hoursWorked: '',
                completionPercent: task.progress || 0,
                issuesFaced: '',
                status: 'In Progress',
                blockerDesc: '',
            });
        }
    };

    const validate = () => {
        const errs = {};
        const hours = parseFloat(form.hoursWorked);
        if (isNaN(hours) || hours < 0 || hours > 24) errs.hoursWorked = 'Hours must be between 0 and 24';
        if (selectedTask && form.completionPercent < (selectedTask.progress || 0)) {
            errs.completionPercent = `Cannot be lower than previous value (${selectedTask.progress || 0}%)`;
        }
        if (form.status === 'Blocked' && !form.blockerDesc.trim()) errs.blockerDesc = 'Please describe the blocker';
        if (uploadFile) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
            if (!validTypes.includes(uploadFile.type)) errs.file = 'File must be an image or PDF';
            if (uploadFile.size > 5 * 1024 * 1024) errs.file = 'File must not exceed 5MB';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setSubmitMsg('');
        setSubmitError('');
        try {
            // Upload file first if provided
            if (uploadFile) {
                await employeeService.uploadFile(uploadFile);
            }

            // Submit progress report to the real backend
            const result = await employeeService.submitDailyReport({
                taskId: selectedTask._id,
                hoursWorked: parseFloat(form.hoursWorked),
                completionPercent: form.completionPercent,
                issuesFaced: form.issuesFaced,
                status: form.status,
                blockerDesc: form.blockerDesc,
                employeeName: user?.name || '',
            });

            setSubmitMsg(result?.message || 'Report submitted successfully! ✅');

            // Update today's report cache
            setTodayReports(prev => ({
                ...prev,
                [selectedTask._id]: {
                    hours_worked: form.hoursWorked,
                    completion_percent: form.completionPercent,
                    issues_faced: form.issuesFaced,
                    status: form.status,
                    blocker_desc: form.blockerDesc,
                }
            }));

            // Update task's progress locally
            setTasks(prev => prev.map(t =>
                t._id === selectedTask._id ? { ...t, progress: form.completionPercent } : t
            ));
        } catch (err) {
            const serverMsg = err.response?.data?.message || 'Failed to submit report. Please try again.';
            setSubmitError(serverMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const isSubmitted = selectedTask && todayReports[selectedTask._id];
    const todayStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'Completed');

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Daily Progress Update</h1>
                        <p>📅 {todayStr} — Submit your daily progress report before end of day</p>
                    </div>

                    {loading ? <Loader text="Loading your tasks..." /> : (
                        <div className="animate-fadeIn">
                            {submitMsg && <div className="auth-success animate-fadeIn" style={{ marginBottom: '20px' }}>{submitMsg}</div>}
                            {submitError && <div className="auth-error animate-fadeIn" style={{ marginBottom: '20px' }}>{submitError}</div>}

                            {/* Task Cards */}
                            <div className="section-header"><h2>📋 Your Assigned Tasks</h2></div>

                            {activeTasks.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📭</div>
                                    <p>No active tasks assigned to you yet.<br />Your manager will assign tasks to you once a project is set up.</p>
                                </div>
                            ) : (
                                <div className="task-select-grid">
                                    {activeTasks.map(task => (
                                        <div
                                            key={task._id}
                                            className={`task-select-card card ${selectedTask?._id === task._id ? 'selected' : ''} ${todayReports[task._id] ? 'submitted' : ''}`}
                                            onClick={() => handleSelect(task)}
                                        >
                                            <div className="task-select-header">
                                                <h4>{task.title || task.name}</h4>
                                                {todayReports[task._id] && <span className="badge badge-success">✓ Submitted</span>}
                                            </div>
                                            <p className="task-project">{task.projectName || '—'}</p>
                                            <div className="progress-bar" style={{ marginTop: '8px' }}>
                                                <div className="progress-fill" style={{ width: `${task.progress || 0}%` }} />
                                            </div>
                                            <div className="task-select-meta">
                                                <span>{task.progress || 0}% complete</span>
                                                <span>Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Progress Report Form */}
                            {selectedTask && (
                                <div className="dashboard-section" style={{ marginTop: '28px' }}>
                                    <div className="section-header">
                                        <h2>📝 Progress for: {selectedTask.title || selectedTask.name}</h2>
                                    </div>
                                    <div className="card">
                                        {isSubmitted ? (
                                            <div className="submitted-readonly">
                                                <p className="submitted-label">✅ Report already submitted for this task today</p>
                                                <div className="submitted-data-grid">
                                                    <div><strong>Hours:</strong> {todayReports[selectedTask._id].hours_worked}h</div>
                                                    <div><strong>Completion:</strong> {todayReports[selectedTask._id].completion_percent}%</div>
                                                    <div><strong>Status:</strong> {todayReports[selectedTask._id].status}</div>
                                                    {todayReports[selectedTask._id].issues_faced && (
                                                        <div><strong>Issues:</strong> {todayReports[selectedTask._id].issues_faced}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Hours Worked Today *</label>
                                                        <input
                                                            type="number"
                                                            className={`form-input ${errors.hoursWorked ? 'input-error' : ''}`}
                                                            min="0" max="24" step="0.5"
                                                            value={form.hoursWorked}
                                                            onChange={e => setForm(p => ({ ...p, hoursWorked: e.target.value }))}
                                                            placeholder="e.g. 6"
                                                            required
                                                        />
                                                        {errors.hoursWorked && <span className="field-error">{errors.hoursWorked}</span>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Task Completion: {form.completionPercent}%</label>
                                                        <input
                                                            type="range"
                                                            className="slider"
                                                            min={selectedTask.progress || 0}
                                                            max="100"
                                                            value={form.completionPercent}
                                                            onChange={e => {
                                                                const val = parseInt(e.target.value);
                                                                setForm(p => ({
                                                                    ...p,
                                                                    completionPercent: val,
                                                                    status: val === 100 ? 'Completed' : p.status
                                                                }));
                                                            }}
                                                        />
                                                        {errors.completionPercent && <span className="field-error">{errors.completionPercent}</span>}
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Issues Faced (optional)</label>
                                                    <textarea
                                                        className="form-input"
                                                        value={form.issuesFaced}
                                                        onChange={e => setForm(p => ({ ...p, issuesFaced: e.target.value }))}
                                                        placeholder="Describe any blockers or problems..."
                                                        rows="3"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Task Status *</label>
                                                    <div className="radio-group">
                                                        {['In Progress', 'Completed', 'Blocked'].map(s => (
                                                            <label key={s} className={`radio-pill ${form.status === s ? 'active' : ''}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="status"
                                                                    value={s}
                                                                    checked={form.status === s}
                                                                    onChange={e => {
                                                                        const val = e.target.value;
                                                                        setForm(p => ({
                                                                            ...p,
                                                                            status: val,
                                                                            completionPercent: val === 'Completed' ? 100 : p.completionPercent
                                                                        }));
                                                                    }}
                                                                />
                                                                {s}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {form.status === 'Blocked' && (
                                                    <div className="form-group">
                                                        <label className="form-label">Describe the Blocker *</label>
                                                        <textarea
                                                            className={`form-input ${errors.blockerDesc ? 'input-error' : ''}`}
                                                            value={form.blockerDesc}
                                                            onChange={e => setForm(p => ({ ...p, blockerDesc: e.target.value }))}
                                                            placeholder="What is blocking you?"
                                                            rows="2"
                                                            required
                                                        />
                                                        {errors.blockerDesc && <span className="field-error">{errors.blockerDesc}</span>}
                                                    </div>
                                                )}

                                                <div className="form-group">
                                                    <label className="form-label">Upload Proof (optional — images or PDF, max 5MB)</label>
                                                    <input
                                                        type="file"
                                                        ref={fileRef}
                                                        accept="image/*,.pdf"
                                                        className="form-input file-input"
                                                        onChange={e => setUploadFile(e.target.files?.[0] || null)}
                                                    />
                                                    {uploadFile && <span style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '4px', display: 'block' }}>📎 {uploadFile.name}</span>}
                                                    {errors.file && <span className="field-error">{errors.file}</span>}
                                                </div>

                                                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={submitting}>
                                                    {submitting ? 'Submitting...' : 'Submit Report'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyProgressUpdate;
