import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ReportViewer from '../components/reports/ReportViewer';
import ExportButtons from '../components/reports/ExportButtons';
import { HiOutlineDocumentReport, HiOutlineCalendar } from 'react-icons/hi';

const WeeklySummaryPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState('current');

    const summary = {
        period: 'Feb 14 - Feb 20, 2026',
        highlights: [
            { label: 'Tasks Completed', value: 47, change: '+12%', positive: true },
            { label: 'Hours Logged', value: 186, change: '+5%', positive: true },
            { label: 'Avg Risk Score', value: '38%', change: '-8%', positive: true },
            { label: 'Blockers Resolved', value: 6, change: '+3', positive: true },
        ],
        topPerformers: [
            { name: 'Alice Chen', tasks: 12, hours: 42 },
            { name: 'Bob Williams', tasks: 10, hours: 38 },
            { name: 'Diana Ross', tasks: 9, hours: 40 },
        ],
        risksIdentified: [
            'Project Alpha deadline approaching with 3 critical tasks incomplete',
            'Resource bottleneck in QA team — 2 members on leave next week',
        ],
        completedMilestones: ['Design Phase — Project Beta', 'Sprint 4 — Project Alpha'],
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1><HiOutlineDocumentReport style={{ verticalAlign: 'middle' }} /> Weekly Summary</h1>
                            <p>{summary.period}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <select className="form-input" style={{ width: 'auto', padding: '8px 32px 8px 12px' }}
                                value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)}>
                                <option value="current">Current Week</option>
                                <option value="last">Last Week</option>
                                <option value="2weeks">2 Weeks Ago</option>
                            </select>
                            <ExportButtons data={summary} filename="weekly-summary" />
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="kpi-grid">
                        {summary.highlights.map((h, i) => (
                            <div key={i} className={`kpi-card ${i === 0 ? 'primary' : i === 1 ? 'success' : i === 2 ? 'warning' : 'primary'}`}>
                                <div className="kpi-label">{h.label}</div>
                                <div className="kpi-value">{h.value}</div>
                                <span style={{ fontSize: '0.8rem', color: h.positive ? 'var(--color-risk-low)' : 'var(--color-risk-high)' }}>
                                    {h.change}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="charts-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        {/* Top Performers */}
                        <div className="card">
                            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>🏆 Top Performers</h3>
                            {summary.topPerformers.map((p, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '12px 0', borderBottom: i < summary.topPerformers.length - 1 ? '1px solid var(--border-color)' : 'none'
                                }}>
                                    <span style={{ fontSize: '1.3rem' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.tasks} tasks • {p.hours}h logged</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Risks & Milestones */}
                        <div className="card">
                            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>⚠️ Risks & Milestones</h3>
                            <div style={{ marginBottom: 16 }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-risk-high)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Risks Identified
                                </span>
                                {summary.risksIdentified.map((r, i) => (
                                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                        🔴 {r}
                                    </p>
                                ))}
                            </div>
                            <div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-risk-low)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Completed Milestones
                                </span>
                                {summary.completedMilestones.map((m, i) => (
                                    <p key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', padding: '8px 0' }}>
                                        ✅ {m}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklySummaryPage;
