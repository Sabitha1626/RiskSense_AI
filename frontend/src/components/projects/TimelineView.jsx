import { useMemo } from 'react';

const TimelineView = ({ tasks = [], projectStart, projectEnd }) => {
    const demoTasks = tasks.length ? tasks : [
        { id: 1, title: 'Requirements Gathering', startDate: '2026-01-10', endDate: '2026-01-25', progress: 100, color: 'var(--color-risk-low)' },
        { id: 2, title: 'UI/UX Design', startDate: '2026-01-20', endDate: '2026-02-10', progress: 100, color: 'var(--color-risk-low)' },
        { id: 3, title: 'Backend Development', startDate: '2026-02-01', endDate: '2026-03-10', progress: 65, color: 'var(--color-primary)' },
        { id: 4, title: 'Frontend Development', startDate: '2026-02-10', endDate: '2026-03-15', progress: 50, color: 'var(--color-risk-medium)' },
        { id: 5, title: 'Testing & QA', startDate: '2026-03-05', endDate: '2026-03-25', progress: 10, color: 'var(--color-accent)' },
        { id: 6, title: 'Deployment', startDate: '2026-03-20', endDate: '2026-04-01', progress: 0, color: 'var(--color-text-muted)' },
    ];

    const { months, totalDays, startMs } = useMemo(() => {
        const dates = demoTasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]);
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        minDate.setDate(1);
        maxDate.setMonth(maxDate.getMonth() + 1, 0);
        const ms = maxDate.getTime() - minDate.getTime();
        const days = ms / (1000 * 60 * 60 * 24);
        const mons = [];
        const cur = new Date(minDate);
        while (cur <= maxDate) {
            mons.push({ label: cur.toLocaleString('default', { month: 'short', year: 'numeric' }), date: new Date(cur) });
            cur.setMonth(cur.getMonth() + 1);
        }
        return { months: mons, totalDays: days, startMs: minDate.getTime() };
    }, [demoTasks]);

    const getBarStyle = (task) => {
        const s = new Date(task.startDate).getTime();
        const e = new Date(task.endDate).getTime();
        const left = ((s - startMs) / (totalDays * 86400000)) * 100;
        const width = ((e - s) / (totalDays * 86400000)) * 100;
        return { left: `${left}%`, width: `${width}%` };
    };

    return (
        <div className="timeline-view">
            <div className="section-header">
                <h2>Project Timeline</h2>
            </div>
            <div className="card" style={{ overflow: 'auto' }}>
                <div style={{ minWidth: 800 }}>
                    {/* Month headers */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: 8, paddingLeft: 200 }}>
                        {months.map((m, i) => (
                            <div key={i} style={{
                                flex: 1, padding: '8px 4px', fontSize: '0.75rem',
                                color: 'var(--color-text-muted)', fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                {m.label}
                            </div>
                        ))}
                    </div>

                    {/* Task bars */}
                    {demoTasks.map((task, idx) => (
                        <div key={task.id} className="timeline-row animate-fadeIn" style={{
                            display: 'flex', alignItems: 'center', padding: '6px 0',
                            animationDelay: `${idx * 0.05}s`
                        }}>
                            <div style={{
                                width: 200, flexShrink: 0, paddingRight: 16,
                                fontSize: '0.85rem', color: 'var(--color-text-secondary)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {task.title}
                            </div>
                            <div style={{ flex: 1, position: 'relative', height: 28 }}>
                                <div style={{
                                    position: 'absolute', ...getBarStyle(task),
                                    height: '100%', borderRadius: 'var(--radius-sm)',
                                    background: `${task.color}30`, border: `1px solid ${task.color}50`,
                                    overflow: 'hidden', transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        height: '100%', width: `${task.progress}%`,
                                        background: task.color, borderRadius: 'var(--radius-sm)',
                                        transition: 'width 0.5s ease'
                                    }} />
                                    <span style={{
                                        position: 'absolute', right: 8, top: '50%',
                                        transform: 'translateY(-50%)', fontSize: '0.7rem',
                                        fontWeight: 600, color: 'var(--color-text)'
                                    }}>
                                        {task.progress}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
