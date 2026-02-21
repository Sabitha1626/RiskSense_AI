import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { HiOutlineViewBoards, HiOutlinePlus, HiOutlineFilter } from 'react-icons/hi';
import api from '../services/api';
import './KanbanBoard.css';

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: 'var(--color-text-muted)' },
    { id: 'in_progress', title: 'In Progress', color: 'var(--color-risk-medium)' },
    { id: 'in_review', title: 'In Review', color: 'var(--color-primary)' },
    { id: 'done', title: 'Done', color: 'var(--color-risk-low)' },
];

const priorityColors = {
    high: 'var(--color-risk-high)',
    medium: 'var(--color-risk-medium)',
    low: 'var(--color-risk-low)',
};

const KanbanBoard = () => {
    const { user } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedTask, setDraggedTask] = useState(null);
    const [filterPriority, setFilterPriority] = useState('all');
    const [showNewTask, setShowNewTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'todo' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            const mapped = (res.data.tasks || res.data || []).map(t => ({
                ...t,
                id: t._id || t.id,
                status: mapStatus(t.status),
                priority: t.priority || 'medium',
            }));
            setTasks(mapped);
        } catch {
            // Demo data
            setTasks([
                { id: '1', title: 'Design landing page', description: 'Create hero section wireframe', status: 'todo', priority: 'high', assignee: 'John' },
                { id: '2', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions', status: 'in_progress', priority: 'high', assignee: 'Sarah' },
                { id: '3', title: 'Write API tests', description: 'Unit tests for auth endpoints', status: 'in_progress', priority: 'medium', assignee: 'Mike' },
                { id: '4', title: 'Database schema review', description: 'Review MongoDB indexes', status: 'in_review', priority: 'low', assignee: 'Anna' },
                { id: '5', title: 'User auth flow', description: 'JWT login/register complete', status: 'done', priority: 'high', assignee: 'John' },
                { id: '6', title: 'Setup project structure', description: 'Initial boilerplate', status: 'done', priority: 'medium', assignee: 'Sarah' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const mapStatus = (s) => {
        const map = { 'pending': 'todo', 'not_started': 'todo', 'in_progress': 'in_progress', 'review': 'in_review', 'completed': 'done', 'done': 'done' };
        return map[s] || s || 'todo';
    };

    const handleDragStart = (task) => setDraggedTask(task);
    const handleDragEnd = () => setDraggedTask(null);

    const handleDrop = async (columnId) => {
        if (!draggedTask || draggedTask.status === columnId) return;
        setTasks(prev => prev.map(t => t.id === draggedTask.id ? { ...t, status: columnId } : t));
        try {
            await api.put(`/tasks/${draggedTask.id}`, { status: columnId === 'done' ? 'completed' : columnId });
        } catch { /* keep local state */ }
        setDraggedTask(null);
    };

    const handleAddTask = () => {
        const task = { ...newTask, id: Date.now().toString(), assignee: user?.name || 'You' };
        setTasks(prev => [...prev, task]);
        setNewTask({ title: '', description: '', priority: 'medium', status: 'todo' });
        setShowNewTask(false);
    };

    const filteredTasks = filterPriority === 'all' ? tasks : tasks.filter(t => t.priority === filterPriority);

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1><HiOutlineViewBoards style={{ verticalAlign: 'middle' }} /> Task Board</h1>
                            <p>Drag and drop tasks between columns to update status</p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div className="kanban-filter">
                                <HiOutlineFilter />
                                <select className="form-input" style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
                                    value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                                    <option value="all">All Priorities</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowNewTask(true)}>
                                <HiOutlinePlus /> Add Task
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading tasks...</p></div>
                    ) : (
                        <div className="kanban-container">
                            {COLUMNS.map(col => (
                                <div key={col.id} className="kanban-column"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(col.id)}>
                                    <div className="kanban-column-header">
                                        <div className="column-dot" style={{ background: col.color }} />
                                        <h3>{col.title}</h3>
                                        <span className="column-count">{filteredTasks.filter(t => t.status === col.id).length}</span>
                                    </div>
                                    <div className="kanban-cards">
                                        {filteredTasks.filter(t => t.status === col.id).map(task => (
                                            <div key={task.id} className="kanban-card"
                                                draggable onDragStart={() => handleDragStart(task)} onDragEnd={handleDragEnd}>
                                                <div className="kanban-card-priority" style={{ background: priorityColors[task.priority] || 'var(--color-text-muted)' }} />
                                                <h4>{task.title}</h4>
                                                <p>{task.description}</p>
                                                <div className="kanban-card-footer">
                                                    <span className="badge" style={{
                                                        background: `${priorityColors[task.priority]}20`,
                                                        color: priorityColors[task.priority]
                                                    }}>
                                                        {task.priority}
                                                    </span>
                                                    {task.assignee && (
                                                        <span className="kanban-assignee">{task.assignee}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add task modal */}
                    {showNewTask && (
                        <div className="modal-overlay" onClick={() => setShowNewTask(false)}>
                            <div className="modal-content card animate-fadeIn" onClick={e => e.stopPropagation()}>
                                <h3 style={{ marginBottom: 20 }}>Add New Task</h3>
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input className="form-input" placeholder="Task title" value={newTask.title}
                                        onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input" placeholder="Task description" value={newTask.description}
                                        onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select className="form-input" value={newTask.priority}
                                        onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                    <button className="btn btn-secondary" onClick={() => setShowNewTask(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleAddTask} disabled={!newTask.title}>Create Task</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
