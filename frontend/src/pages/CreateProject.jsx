import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import employeeService from '../services/employeeService';
import projectService from '../services/projectService';
import Loader from '../components/common/Loader';

const CreateProject = () => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');

    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        teamMembers: [],
        complexity: '',
        estimatedHours: '',
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await employeeService.getAllEmployees();
                // Show only employees (not managers)
                setEmployees(data.filter(u => u.role === 'employee'));
            } catch (err) {
                console.error('Failed to load employees:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Toggle a team member on/off (checkbox style)
    const toggleMember = (id) => {
        setForm(prev => {
            const already = prev.teamMembers.includes(id);
            return {
                ...prev,
                teamMembers: already
                    ? prev.teamMembers.filter(m => m !== id)
                    : [...prev.teamMembers, id],
            };
        });
        setErrors(prev => ({ ...prev, teamMembers: '' }));
    };

    const validate = () => {
        const errs = {};
        const today = new Date().toISOString().split('T')[0];
        if (!form.name.trim()) errs.name = 'Project name is required';
        if (!form.startDate) errs.startDate = 'Start date is required';
        if (!form.endDate) errs.endDate = 'End date is required';
        else if (form.startDate && form.endDate <= form.startDate) errs.endDate = 'End date must be after start date';
        if (form.teamMembers.length === 0) errs.teamMembers = 'Select at least one team member';
        if (!form.complexity) errs.complexity = 'Complexity level is required';
        if (!form.estimatedHours || parseFloat(form.estimatedHours) <= 0) errs.estimatedHours = 'Estimated hours must be greater than zero';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setErrors({});
        try {
            await projectService.createProject(form);
            setSuccessMsg('✅ Project created successfully! Redirecting to Task Assignment...');
            setTimeout(() => navigate('/task-assignment'), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create project. Please try again.';
            setErrors({ submit: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Create New Project</h1>
                        <p>Fill in project details and manually select team members</p>
                    </div>

                    {loading ? <Loader text="Loading employees..." /> : (
                        <div className="create-form-card card animate-fadeIn">
                            {successMsg && <div className="auth-success animate-fadeIn">{successMsg}</div>}
                            {errors.submit && <div className="auth-error animate-fadeIn">{errors.submit}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Project Name *</label>
                                    <input type="text" className={`form-input ${errors.name ? 'input-error' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Enter project name" />
                                    {errors.name && <span className="field-error">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Project Description</label>
                                    <textarea className="form-input" name="description" value={form.description} onChange={handleChange} placeholder="Describe the project..." rows="3" />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Start Date *</label>
                                        <input type="date" className={`form-input ${errors.startDate ? 'input-error' : ''}`} name="startDate" value={form.startDate} onChange={handleChange} />
                                        {errors.startDate && <span className="field-error">{errors.startDate}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Date *</label>
                                        <input type="date" className={`form-input ${errors.endDate ? 'input-error' : ''}`} name="endDate" value={form.endDate} onChange={handleChange} />
                                        {errors.endDate && <span className="field-error">{errors.endDate}</span>}
                                    </div>
                                </div>

                                {/* Team Members — Manual Checkbox Selection */}
                                <div className="form-group">
                                    <label className="form-label">
                                        Team Members * <span className="form-hint">({form.teamMembers.length} selected)</span>
                                    </label>
                                    {employees.length === 0 ? (
                                        <div className="empty-state" style={{ padding: '16px', textAlign: 'left' }}>
                                            <p style={{ color: 'var(--text-muted)' }}>⚠️ No employees registered yet. Ask employees to register first.</p>
                                        </div>
                                    ) : (
                                        <div className="team-member-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                            {employees.map(emp => (
                                                <label
                                                    key={emp._id}
                                                    className="team-member-row"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '10px 14px',
                                                        borderRadius: '8px',
                                                        border: `1.5px solid ${form.teamMembers.includes(emp._id) ? 'var(--primary)' : 'var(--border)'}`,
                                                        background: form.teamMembers.includes(emp._id) ? 'rgba(99,102,241,0.08)' : 'var(--surface)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={form.teamMembers.includes(emp._id)}
                                                        onChange={() => toggleMember(emp._id)}
                                                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{emp.name}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.email}</div>
                                                    </div>
                                                    {form.teamMembers.includes(emp._id) && (
                                                        <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Selected</span>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {errors.teamMembers && <span className="field-error">{errors.teamMembers}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Complexity Level *</label>
                                        <select className={`form-input ${errors.complexity ? 'input-error' : ''}`} name="complexity" value={form.complexity} onChange={handleChange}>
                                            <option value="">Select complexity</option>
                                            <option value="simple">Simple</option>
                                            <option value="moderate">Moderate</option>
                                            <option value="complex">Complex</option>
                                        </select>
                                        {errors.complexity && <span className="field-error">{errors.complexity}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Estimated Hours *</label>
                                        <input type="number" className={`form-input ${errors.estimatedHours ? 'input-error' : ''}`} name="estimatedHours" value={form.estimatedHours} onChange={handleChange} placeholder="e.g. 120" min="1" />
                                        {errors.estimatedHours && <span className="field-error">{errors.estimatedHours}</span>}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }} disabled={submitting}>
                                    {submitting ? 'Creating Project...' : 'Create Project'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
