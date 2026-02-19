import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import employeeService from '../services/employeeService';
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
                setEmployees(data);
            } catch (err) {
                console.error(err);
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

    const handleTeamChange = (e) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setForm(prev => ({ ...prev, teamMembers: options }));
        setErrors(prev => ({ ...prev, teamMembers: '' }));
    };

    const validate = () => {
        const errs = {};
        const today = new Date().toISOString().split('T')[0];

        if (!form.name.trim()) errs.name = 'Project name is required';
        if (!form.startDate) errs.startDate = 'Start date is required';
        else if (form.startDate < today) errs.startDate = 'Start date cannot be in the past';
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
        try {
            // Mock API call
            await new Promise(r => setTimeout(r, 600));
            setSuccessMsg('Project created successfully!');
            setTimeout(() => {
                navigate('/task-assignment');
            }, 2000);
        } catch (err) {
            setErrors({ submit: 'Failed to create project. Please try again.' });
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
                        <p>Define your project details and assign team members</p>
                    </div>

                    {loading ? <Loader text="Loading..." /> : (
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

                                <div className="form-group">
                                    <label className="form-label">Team Members * <span className="form-hint">(Hold Ctrl/Cmd to select multiple)</span></label>
                                    <select multiple className={`form-input multi-select ${errors.teamMembers ? 'input-error' : ''}`} value={form.teamMembers} onChange={handleTeamChange} size={Math.min(employees.length, 5)}>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                                        ))}
                                    </select>
                                    {errors.teamMembers && <span className="field-error">{errors.teamMembers}</span>}
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Complexity Level *</label>
                                        <select className={`form-input ${errors.complexity ? 'input-error' : ''}`} name="complexity" value={form.complexity} onChange={handleChange}>
                                            <option value="">Select complexity</option>
                                            <option value="Simple">Simple</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Complex">Complex</option>
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
                                    {submitting ? 'Creating...' : 'Create Project'}
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
