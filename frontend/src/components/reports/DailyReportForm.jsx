import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import reportService from '../../services/reportService';
import './DailyReportForm.css';

const DailyReportForm = ({ onSubmit }) => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        projectId: '',
        taskId: '',
        hoursWorked: '',
        progressPercent: '',
        description: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const projects = [
        {
            _id: 'p1', name: 'E-Commerce Platform', tasks: [
                { _id: 't1', title: 'API Development' },
                { _id: 't2', title: 'Payment Gateway' },
                { _id: 't4', title: 'Testing & QA' },
            ]
        },
        {
            _id: 'p2', name: 'HR Management System', tasks: [
                { _id: 't6', title: 'Leave Module' },
                { _id: 't7', title: 'Payroll Engine' },
            ]
        },
        {
            _id: 'p3', name: 'Mobile Banking App', tasks: [
                { _id: 't9', title: 'Transaction Module' },
                { _id: 't10', title: 'UI/UX Polish' },
                { _id: 't11', title: 'Security Audit' },
            ]
        },
    ];

    const selectedProject = projects.find((p) => p._id === formData.projectId);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === 'projectId') {
            setFormData((prev) => ({ ...prev, taskId: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const report = await reportService.submitReport({
                ...formData,
                employeeId: user?._id,
                employeeName: user?.name,
                hoursWorked: parseFloat(formData.hoursWorked),
                progressPercent: parseInt(formData.progressPercent),
            });
            setSubmitted(true);
            setFormData({ projectId: '', taskId: '', hoursWorked: '', progressPercent: '', description: '' });
            if (onSubmit) onSubmit(report);
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="daily-report-form card">
            <h3 className="form-title">📝 Submit Daily Report</h3>
            <p className="form-subtitle">Log your work progress for today</p>

            {submitted && (
                <div className="success-banner animate-fadeIn">
                    ✅ Report submitted successfully!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Project</label>
                        <select
                            className="form-input"
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a project</option>
                            {projects.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Task</label>
                        <select
                            className="form-input"
                            name="taskId"
                            value={formData.taskId}
                            onChange={handleChange}
                            required
                            disabled={!formData.projectId}
                        >
                            <option value="">Select a task</option>
                            {selectedProject?.tasks.map((t) => (
                                <option key={t._id} value={t._id}>{t.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Hours Worked</label>
                        <input
                            type="number"
                            className="form-input"
                            name="hoursWorked"
                            value={formData.hoursWorked}
                            onChange={handleChange}
                            placeholder="e.g., 7.5"
                            min="0"
                            max="24"
                            step="0.5"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Progress (%)</label>
                        <input
                            type="number"
                            className="form-input"
                            name="progressPercent"
                            value={formData.progressPercent}
                            onChange={handleChange}
                            placeholder="e.g., 15"
                            min="0"
                            max="100"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Work Description</label>
                    <textarea
                        className="form-input"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe what you accomplished today..."
                        rows="4"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : '📤 Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default DailyReportForm;
