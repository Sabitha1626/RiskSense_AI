import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import projectService from '../services/projectService';
import api from '../services/api';
import Loader from '../components/common/Loader';

const TaskAssignment = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projectLoading, setProjectLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [tasks, setTasks] = useState([]);

    const [form, setForm] = useState({
        name: '',
        employeeId: '',
        description: '',
        deadline: '',
        estimatedHours: '',
        priority: '',
    });

    // Load projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (err) {
                console.error('Failed to load projects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Load project details (including team members) when a project is selected
    useEffect(() => {
        if (!selectedProject) {
            setProjectData(null);
            setTasks([]);
            return;
        }
        const fetchProject = async () => {
            setProjectLoading(true);
            try {
                const data = await projectService.getProjectById(selectedProject);
                setProjectData(data);
                setTasks(data?.tasks || []);
            } catch (err) {
                console.error('Failed to load project details:', err);
            } finally {
                setProjectLoading(false);
            }
        };
        fetchProject();
    }, [selectedProject]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Task name is required';
        if (!form.employeeId) errs.employeeId = 'Select a team member to assign';
        if (!form.deadline) errs.deadline = 'Deadline is required';
        else if (projectData?.deadline && form.deadline > projectData.deadline.split('T')[0]) {
            errs.deadline = 'Deadline cannot be after the project end date';
        }
        if (!form.estimatedHours || parseFloat(form.estimatedHours) <= 0)
            errs.estimatedHours = 'Estimated hours must be greater than zero';
        if (!form.priority) errs.priority = 'Priority level is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setSuccessMsg('');
        try {
            const payload = {
                title: form.name,
                project_id: selectedProject,
                assignee_id: form.employeeId,
                description: form.description,
                deadline: form.deadline,
                estimated_hours: parseFloat(form.estimatedHours),
                priority: form.priority.toLowerCase(),
                status: 'pending',
            };
            const response = await api.post('/tasks/', payload);
            const newTask = response.data.data;
            setTasks(prev => [...prev, newTask]);
            setSuccessMsg('✅ Task assigned successfully!');
            setForm({ name: '', employeeId: '', description: '', deadline: '', estimatedHours: '', priority: '' });
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add task. Please try again.';
            setErrors({ submit: msg });
        } finally {
            setSubmitting(false);
        }
    };

    // Team members come from the real project data (people who were manually added during project creation)
    const teamMembers = projectData?.teamMemberDetails || [];

    const getMemberName = (memberId) => {
        const m = teamMembers.find(m => m._id === memberId);
        return m?.name || memberId || 'Unknown';
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Task Assignment</h1>
                        <p>Create and assign tasks to project team members</p>
                    </div>

                    {loading ? <Loader text="Loading projects..." /> : (
                        <div className="animate-fadeIn">
                            {/* Project Selector */}
                            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '24px' }}>
                                <label className="form-label">Select Project</label>
                                <select className="form-input" value={selectedProject} onChange={e => {
                                    setSelectedProject(e.target.value);
                                    setForm({ name: '', employeeId: '', description: '', deadline: '', estimatedHours: '', priority: '' });
                                    setErrors({});
                                    setSuccessMsg('');
                                }}>
                                    <option value="">-- Choose a project --</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {projects.length === 0 && (
                                <div className="empty-state">
                                    <div className="empty-icon">📁</div>
                                    <p>No projects found. <a href="/create-project" style={{ color: 'var(--primary)' }}>Create a project first</a>.</p>
                                </div>
                            )}

                            {selectedProject && (
                                <>
                                    {projectLoading ? <Loader text="Loading project..." /> : (
                                        <>
                                            {/* Team Members Info */}
                                            {teamMembers.length > 0 && (
                                                <div className="dashboard-section" style={{ marginBottom: '20px' }}>
                                                    <div className="section-header">
                                                        <h2>👥 Team Members ({teamMembers.length})</h2>
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {teamMembers.map(m => (
                                                            <span key={m._id} className="badge badge-info" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                                                {m.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Existing Tasks */}
                                            <div className="dashboard-section">
                                                <div className="section-header">
                                                    <h2>📋 Assigned Tasks ({tasks.length})</h2>
                                                </div>
                                                {tasks.length === 0 ? (
                                                    <div className="empty-state">
                                                        <div className="empty-icon">📝</div>
                                                        <p>No tasks assigned yet. Use the form below to add tasks.</p>
                                                    </div>
                                                ) : (
                                                    <div className="table-container">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Task Name</th>
                                                                    <th>Assigned To</th>
                                                                    <th>Deadline</th>
                                                                    <th>Est. Hours</th>
                                                                    <th>Priority</th>
                                                                    <th>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tasks.map(task => (
                                                                    <tr key={task._id}>
                                                                        <td className="td-name">{task.title || task.name}</td>
                                                                        <td>{getMemberName(task.assignee_id)}</td>
                                                                        <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</td>
                                                                        <td>{task.estimated_hours || '—'}</td>
                                                                        <td>
                                                                            <span className={`badge badge-${task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'info' : 'success'}`}>
                                                                                {task.priority}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <span className={`badge badge-${task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'info' : 'warning'}`}>
                                                                                {task.status}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add Task Form */}
                                            <div className="dashboard-section" style={{ marginTop: '28px' }}>
                                                <div className="section-header">
                                                    <h2>➕ Assign New Task</h2>
                                                </div>
                                                <div className="card">
                                                    {successMsg && <div className="auth-success animate-fadeIn" style={{ marginBottom: '16px' }}>{successMsg}</div>}
                                                    {errors.submit && <div className="auth-error" style={{ marginBottom: '16px' }}>{errors.submit}</div>}

                                                    {teamMembers.length === 0 ? (
                                                        <div className="empty-state" style={{ padding: '20px' }}>
                                                            <p>⚠️ This project has no team members. <a href="/create-project" style={{ color: 'var(--primary)' }}>Add team members to the project</a> first.</p>
                                                        </div>
                                                    ) : (
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="form-row">
                                                                <div className="form-group">
                                                                    <label className="form-label">Task Name *</label>
                                                                    <input type="text" className={`form-input ${errors.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Enter task name" />
                                                                    {errors.name && <span className="field-error">{errors.name}</span>}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="form-label">Assign To *</label>
                                                                    <select className={`form-input ${errors.employeeId ? 'input-error' : ''}`} name="employeeId" value={form.employeeId} onChange={handleChange}>
                                                                        <option value="">-- Select team member --</option>
                                                                        {teamMembers.map(m => (
                                                                            <option key={m._id} value={m._id}>{m.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    {errors.employeeId && <span className="field-error">{errors.employeeId}</span>}
                                                                </div>
                                                            </div>

                                                            <div className="form-group">
                                                                <label className="form-label">Task Description</label>
                                                                <textarea className="form-input" name="description" value={form.description} onChange={handleChange} placeholder="Describe what needs to be done..." rows="3" />
                                                            </div>

                                                            <div className="form-row">
                                                                <div className="form-group">
                                                                    <label className="form-label">Deadline *</label>
                                                                    <input type="date" className={`form-input ${errors.deadline ? 'input-error' : ''}`} name="deadline" value={form.deadline} onChange={handleChange} />
                                                                    {errors.deadline && <span className="field-error">{errors.deadline}</span>}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="form-label">Estimated Hours *</label>
                                                                    <input type="number" className={`form-input ${errors.estimatedHours ? 'input-error' : ''}`} name="estimatedHours" value={form.estimatedHours} onChange={handleChange} min="1" placeholder="e.g. 20" />
                                                                    {errors.estimatedHours && <span className="field-error">{errors.estimatedHours}</span>}
                                                                </div>
                                                                <div className="form-group">
                                                                    <label className="form-label">Priority *</label>
                                                                    <select className={`form-input ${errors.priority ? 'input-error' : ''}`} name="priority" value={form.priority} onChange={handleChange}>
                                                                        <option value="">Select priority</option>
                                                                        <option value="low">Low</option>
                                                                        <option value="medium">Medium</option>
                                                                        <option value="high">High</option>
                                                                        <option value="critical">Critical</option>
                                                                    </select>
                                                                    {errors.priority && <span className="field-error">{errors.priority}</span>}
                                                                </div>
                                                            </div>

                                                            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={submitting}>
                                                                {submitting ? 'Assigning...' : 'Assign Task'}
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskAssignment;
