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
            try {
                const userId = user?._id || '2';
                const [taskData, reports] = await Promise.all([
                    employeeService.getTasks(userId),
                    employeeService.getAllTodayReports(userId),
                ]);
                setTasks(taskData);
                setTodayReports(reports);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleSelect = (task) => {
        setSelectedTask(task);
        setSubmitMsg('');
        setErrors({});
        setUploadFile(null);
        if (todayReports[task._id]) {
            const r = todayReports[task._id];
            setForm({
                hoursWorked: r.hoursWorked || '',
                completionPercent: r.completionPercent || 0,
                issuesFaced: r.issuesFaced || '',
                status: r.status || 'In Progress',
                blockerDesc: r.blockerDesc || '',
            });
        } else {
            setForm({
                hoursWorked: '',
                completionPercent: task.completionPercent || 0,
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
        if (selectedTask && form.completionPercent < selectedTask.completionPercent) {
            errs.completionPercent = `Cannot be lower than previous value (${selectedTask.completionPercent}%)`;
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
        try {
            if (uploadFile) {
                await employeeService.uploadFile(uploadFile);
            }
            const result = await employeeService.submitDailyReport({
                taskId: selectedTask._id,
                hoursWorked: parseFloat(form.hoursWorked),
                completionPercent: form.completionPercent,
                issuesFaced: form.issuesFaced,
                status: form.status,
                blockerDesc: form.blockerDesc,
            });
            setSubmitMsg(result.message);
            setTodayReports(prev => ({ ...prev, [selectedTask._id]: { ...form } }));
            // Update task card
            setTasks(prev => prev.map(t => t._id === selectedTask._id ? { ...t, completionPercent: form.completionPercent } : t));

            const allSubmitted = tasks.filter(t => t.status !== 'Completed').every(t => todayReports[t._id] || t._id === selectedTask._id);
            if (allSubmitted) {
                setSubmitMsg('All tasks updated for today. Great work! 🎉');
            }
        } catch (err) {
            setSubmitMsg('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const isSubmitted = selectedTask && todayReports[selectedTask._id];
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Daily Progress Update</h1>
                        <p>📅 {todayStr} — Please submit your daily progress report before end of day</p>
                    </div>

                    {loading ? <Loader text="Loading tasks..." /> : (
                        <div className="animate-fadeIn">
                            {submitMsg && <div className="auth-success animate-fadeIn" style={{ marginBottom: '20px' }}>{submitMsg}</div>}

                            {/* Task Cards */}
                            <div className="section-header"><h2>📋 Select a Task</h2></div>
                            <div className="task-select-grid">
                                {tasks.filter(t => t.status !== 'Completed').map(task => (
                                    <div
                                        key={task._id}
                                        className={`task-select-card card ${selectedTask?._id === task._id ? 'selected' : ''} ${todayReports[task._id] ? 'submitted' : ''}`}
                                        onClick={() => handleSelect(task)}
                                    >
                                        <div className="task-select-header">
                                            <h4>{task.name}</h4>
                                            {todayReports[task._id] && <span className="badge badge-success">✓ Submitted</span>}
                                        </div>
                                        <p className="task-project">{task.projectName}</p>
                                        <div className="progress-bar" style={{ marginTop: '8px' }}>
                                            <div className="progress-fill" style={{ width: `${task.completionPercent}%` }} />
                                        </div>
                                        <div className="task-select-meta">
                                            <span>{task.completionPercent}% complete</span>
                                            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress Form */}
                            {selectedTask && (
                                <div className="dashboard-section" style={{ marginTop: '28px' }}>
                                    <div className="section-header">
                                        <h2>📝 Progress for: {selectedTask.name}</h2>
                                    </div>
                                    <div className="card">
                                        {isSubmitted ? (
                                            <div className="submitted-readonly">
                                                <p className="submitted-label">✅ Report already submitted for this task today</p>
                                                <div className="submitted-data-grid">
                                                    <div><strong>Hours:</strong> {todayReports[selectedTask._id].hoursWorked}h</div>
                                                    <div><strong>Completion:</strong> {todayReports[selectedTask._id].completionPercent}%</div>
                                                    <div><strong>Status:</strong> {todayReports[selectedTask._id].status}</div>
                                                    {todayReports[selectedTask._id].issuesFaced && <div><strong>Issues:</strong> {todayReports[selectedTask._id].issuesFaced}</div>}
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Hours Worked Today *</label>
                                                        <input type="number" className={`form-input ${errors.hoursWorked ? 'input-error' : ''}`} min="0" max="24" step="0.5" value={form.hoursWorked} onChange={e => setForm(p => ({ ...p, hoursWorked: e.target.value }))} required />
                                                        {errors.hoursWorked && <span className="field-error">{errors.hoursWorked}</span>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Completion: {form.completionPercent}%</label>
                                                        <input type="range" className="slider" min={selectedTask.completionPercent} max="100" value={form.completionPercent} onChange={e => {
                                                            const val = parseInt(e.target.value);
                                                            setForm(p => ({ ...p, completionPercent: val, status: val === 100 ? 'Completed' : p.status }));
                                                        }} />
                                                        {errors.completionPercent && <span className="field-error">{errors.completionPercent}</span>}
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Issues Faced (optional)</label>
                                                    <textarea className="form-input" value={form.issuesFaced} onChange={e => setForm(p => ({ ...p, issuesFaced: e.target.value }))} placeholder="Describe any blockers or problems..." rows="3" />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Task Status *</label>
                                                    <div className="radio-group">
                                                        {['In Progress', 'Completed', 'Blocked'].map(s => (
                                                            <label key={s} className={`radio-pill ${form.status === s ? 'active' : ''}`}>
                                                                <input type="radio" name="status" value={s} checked={form.status === s} onChange={e => {
                                                                    const val = e.target.value;
                                                                    setForm(p => ({ ...p, status: val, completionPercent: val === 'Completed' ? 100 : p.completionPercent }));
                                                                }} />
                                                                {s}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {form.status === 'Blocked' && (
                                                    <div className="form-group">
                                                        <label className="form-label">Describe the Blocker *</label>
                                                        <textarea className={`form-input ${errors.blockerDesc ? 'input-error' : ''}`} value={form.blockerDesc} onChange={e => setForm(p => ({ ...p, blockerDesc: e.target.value }))} placeholder="What is blocking you?" rows="2" required />
                                                        {errors.blockerDesc && <span className="field-error">{errors.blockerDesc}</span>}
                                                    </div>
                                                )}

                                                <div className="form-group">
                                                    <label className="form-label">Upload Proof (optional — images or PDF, max 5MB)</label>
                                                    <input type="file" ref={fileRef} accept="image/*,.pdf" className="form-input file-input" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
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
