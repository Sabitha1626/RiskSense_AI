import { useState } from 'react';
import { HiOutlineFlag, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

const MilestonesView = ({ milestones = [] }) => {
    const [filter, setFilter] = useState('all');

    const demoMilestones = milestones.length ? milestones : [
        { id: 1, title: 'Project Kickoff', status: 'completed', dueDate: '2026-01-15', description: 'Initial planning and team setup' },
        { id: 2, title: 'Design Phase Complete', status: 'completed', dueDate: '2026-02-01', description: 'UI/UX designs finalized and approved' },
        { id: 3, title: 'MVP Development', status: 'in_progress', dueDate: '2026-03-01', description: 'Core features implemented and tested' },
        { id: 4, title: 'Beta Release', status: 'upcoming', dueDate: '2026-03-20', description: 'Beta version released to test users' },
        { id: 5, title: 'Production Launch', status: 'upcoming', dueDate: '2026-04-15', description: 'Full production deployment' },
    ];

    const filtered = filter === 'all' ? demoMilestones : demoMilestones.filter(m => m.status === filter);

    const statusConfig = {
        completed: { color: 'var(--color-risk-low)', bg: 'var(--color-risk-low-bg)', icon: <HiOutlineCheckCircle />, label: 'Completed' },
        in_progress: { color: 'var(--color-risk-medium)', bg: 'var(--color-risk-medium-bg)', icon: <HiOutlineClock />, label: 'In Progress' },
        upcoming: { color: 'var(--color-text-muted)', bg: 'var(--color-bg-glass)', icon: <HiOutlineFlag />, label: 'Upcoming' },
    };

    return (
        <div className="milestones-view">
            <div className="section-header">
                <h2>Milestones</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['all', 'completed', 'in_progress', 'upcoming'].map(f => (
                        <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(f)}>
                            {f === 'all' ? 'All' : f === 'in_progress' ? 'Active' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="milestone-timeline">
                {filtered.map((m, idx) => {
                    const cfg = statusConfig[m.status] || statusConfig.upcoming;
                    return (
                        <div key={m.id} className="milestone-item animate-fadeIn" style={{ animationDelay: `${idx * 0.08}s` }}>
                            <div className="milestone-connector">
                                <div className="milestone-dot" style={{ background: cfg.color, boxShadow: `0 0 12px ${cfg.color}40` }} />
                                {idx < filtered.length - 1 && <div className="milestone-line" />}
                            </div>
                            <div className="milestone-content card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ marginBottom: 4, color: 'var(--color-text)' }}>{m.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>{m.description}</p>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Due: {m.dueDate}</span>
                                    </div>
                                    <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                                        {cfg.icon} {cfg.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MilestonesView;
