import { useState } from 'react';
import { HiOutlinePlusCircle, HiOutlineX, HiOutlineCalendar, HiOutlineUser, HiOutlineFlag } from 'react-icons/hi';

const TaskForm = ({ onSubmit, onClose, initialData = null, teamMembers = [] }) => {
    const [form, setForm] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        priority: initialData?.priority || 'medium',
        assignee: initialData?.assignee || '',
        deadline: initialData?.deadline || '',
        dependencies: initialData?.dependencies || [],
        estimated_hours: initialData?.estimated_hours || '',
        tags: initialData?.tags?.join(', ') || '',
    });

    const handleChange = (field, value) => setForm(p => ({ ...p, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3>{initialData ? 'Edit Task' : 'Create New Task'}</h3>
                    <button className="btn btn-ghost" onClick={onClose}><HiOutlineX /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Task Title *</label>
                        <input className="form-input" placeholder="Enter task title" required
                            value={form.title} onChange={e => handleChange('title', e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-input" placeholder="Describe the task..." rows={3}
                            value={form.description} onChange={e => handleChange('description', e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label"><HiOutlineFlag style={{ verticalAlign: 'middle' }} /> Priority</label>
                            <select className="form-input" value={form.priority}
                                onChange={e => handleChange('priority', e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label"><HiOutlineCalendar style={{ verticalAlign: 'middle' }} /> Deadline</label>
                            <input type="date" className="form-input"
                                value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label"><HiOutlineUser style={{ verticalAlign: 'middle' }} /> Assignee</label>
                            <input className="form-input" placeholder="Assignee name"
                                value={form.assignee} onChange={e => handleChange('assignee', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estimated Hours</label>
                            <input type="number" className="form-input" placeholder="e.g. 8" min={0}
                                value={form.estimated_hours} onChange={e => handleChange('estimated_hours', e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tags (comma-separated)</label>
                        <input className="form-input" placeholder="e.g. frontend, urgent, bugfix"
                            value={form.tags} onChange={e => handleChange('tags', e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={!form.title}>
                            <HiOutlinePlusCircle /> {initialData ? 'Update' : 'Create'} Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
