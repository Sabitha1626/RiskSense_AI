import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import projectService from '../services/projectService';
import Loader from '../components/common/Loader';

const TaskAssignment = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [tasks, setTasks] = useState([]);

    const [form, setForm] = useState({
        name: '',
        employee: '',
        description: '',
        deadline: '',
        estimatedHours: '',
        priority: '',
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (!selectedProject) {
            setProjectData(null);
            setTasks([]);
            return;
        }
        const fetchProject = async () => {
            try {
                const data = await projectService.getProjectById(selectedProject);
                setProjectData(data);
                setTasks(data?.tasks || []);
            } catch (err) {
                console.error(err);
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
        if (!form.employee) errs.employee = 'Select an employee';
        if (!form.deadline) errs.deadline = 'Deadline is required';
        else if (projectData && form.deadline > new Date(projectData.deadline).toISOString().split('T')[0]) {
            errs.deadline = 'Deadline cannot be after the project end date';
        }
        if (!form.estimatedHours || parseFloat(form.estimatedHours) <= 0) errs.estimatedHours = 'Estimated hours must be greater than zero';
        if (!form.priority) errs.priority = 'Priority level is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await new Promise(r => setTimeout(r, 400));
            const emp = employees.find(e => e._id === form.employee);
            const newTask = {
                _id: 't' + Date.now(),
                title: form.name,
                assignee: form.employee,
                assigneeName: emp?.name || 'Unknown',
                status: 'pending',
                progress: 0,
                priority: form.priority.toLowerCase(),
                deadline: form.deadline,
                estimatedHours: parseFloat(form.estimatedHours),
            };
            setTasks(prev => [...prev, newTask]);
            setForm({ name: '', employee: '', description: '', deadline: '', estimatedHours: '', priority: '' });
        } catch (err) {
            setErrors({ submit: 'Failed to add task.' });
        } finally {
            setSubmitting(false);
        }
    };

    const employees = projectData?.teamMembers
        ? [
            { _id: '2', name: 'Priya Sharma' },
            { _id: '3', name: 'Arjun Patel' },
            { _id: '4', name: 'Sneha Reddy' },
            { _id: '5', name: 'Kiran Das' },
        ].filter(e => projectData.teamMembers.includes(e._id))
        : [];

    const getEmployeeName = (id) => {
        const names = { '2': 'Priya Sharma', '3': 'Arjun Patel', '4': 'Sneha Reddy', '5': 'Kiran Das' };
        return names[id] || 'Unknown';
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Task Assignment</h1>
                        <p>Create and assign tasks for your projects</p>
                    </div>

                    {loading ? <Loader text="Loading projects..." /> : (
                        <div className="animate-fadeIn">
                            {/* Project Selector */}
                            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '24px' }}>
                                <label className="form-label">Select Project</label>
                                <select className="form-input" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                                    <option value="">-- Choose a project --</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedProject && (
                                <>
                                    {/* Existing Tasks */}
                                    <div className="dashboard-section">
                                        <div className="section-header">
                                            <h2>📋 Existing Tasks</h2>
                                        </div>
                                        {tasks.length === 0 ? (
                                            <div className="empty-state">
                                                <div className="empty-icon">📝</div>
                                                <p>No tasks added yet. Add your first task below.</p>
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
                                                                <td>{getEmployeeName(task.assignee)}</td>
                                                                <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                                                <td>{task.estimatedHours || '—'}</td>
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
                                            <h2>➕ Add New Task</h2>
                                        </div>
                                        <div className="card">
                                            {errors.submit && <div className="auth-error">{errors.submit}</div>}
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Task Name *</label>
                                                        <input type="text" className={`form-input ${errors.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Enter task name" />
                                                        {errors.name && <span className="field-error">{errors.name}</span>}
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Assign Employee *</label>
                                                        <select className={`form-input ${errors.employee ? 'input-error' : ''}`} name="employee" value={form.employee} onChange={handleChange}>
                                                            <option value="">-- Select --</option>
                                                            {employees.map(emp => (
                                                                <option key={emp._id} value={emp._id}>{emp.name}</option>
                                                            ))}
                                                        </select>
                                                        {errors.employee && <span className="field-error">{errors.employee}</span>}
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Task Description</label>
                                                    <textarea className="form-input" name="description" value={form.description} onChange={handleChange} placeholder="Describe the task..." rows="3" />
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
                                                            <option value="">Select</option>
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                        </select>
                                                        {errors.priority && <span className="field-error">{errors.priority}</span>}
                                                    </div>
                                                </div>

                                                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={submitting}>
                                                    {submitting ? 'Adding...' : 'Add Task'}
                                                </button>
                                            </form>
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

export default TaskAssignment;
