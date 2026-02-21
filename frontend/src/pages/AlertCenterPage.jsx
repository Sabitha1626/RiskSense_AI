import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { HiOutlineBell, HiOutlineFilter, HiOutlineCheck, HiOutlineExclamation, HiOutlineInformationCircle, HiOutlineShieldExclamation } from 'react-icons/hi';
import alertService from '../services/alertService';
import './AlertCenterPage.css';

const SEVERITY_CONFIG = {
    critical: { color: 'var(--color-risk-critical)', bg: 'var(--color-risk-critical-bg)', icon: <HiOutlineShieldExclamation />, label: 'Critical' },
    high: { color: 'var(--color-risk-high)', bg: 'var(--color-risk-high-bg)', icon: <HiOutlineExclamation />, label: 'High' },
    medium: { color: 'var(--color-risk-medium)', bg: 'var(--color-risk-medium-bg)', icon: <HiOutlineExclamation />, label: 'Medium' },
    low: { color: 'var(--color-info)', bg: 'var(--color-info-bg)', icon: <HiOutlineInformationCircle />, label: 'Low' },
};

const AlertCenterPage = () => {
    const { user } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterRead, setFilterRead] = useState('all');
    const [selectedAlert, setSelectedAlert] = useState(null);

    useEffect(() => { fetchAlerts(); }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const res = await alertService.getAlerts();
            setAlerts(res.data.alerts || res.data || []);
        } catch {
            setAlerts([
                { _id: '1', type: 'deadline_risk', severity: 'critical', message: 'Project Alpha deadline at risk — only 40% complete with 5 days remaining', project: 'Project Alpha', created_at: '2026-02-20T10:30:00Z', read: false },
                { _id: '2', type: 'resource', severity: 'high', message: 'Team member Sarah has been overloaded — 120% utilization this sprint', project: 'Project Beta', created_at: '2026-02-20T09:15:00Z', read: false },
                { _id: '3', type: 'anomaly', severity: 'medium', message: 'Unusual spike in task creation — 15 tasks added in the last hour', project: 'Project Alpha', created_at: '2026-02-19T16:45:00Z', read: true },
                { _id: '4', type: 'milestone', severity: 'low', message: 'Milestone "Design Phase" completed successfully', project: 'Project Gamma', created_at: '2026-02-19T14:20:00Z', read: true },
                { _id: '5', type: 'performance', severity: 'high', message: 'Team velocity dropped 30% compared to last sprint', project: 'Project Beta', created_at: '2026-02-18T11:00:00Z', read: false },
                { _id: '6', type: 'escalation', severity: 'critical', message: 'Blocked task T-205 has not been addressed for 5 days', project: 'Project Alpha', created_at: '2026-02-18T09:30:00Z', read: false },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = alerts.filter(a => {
        if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
        if (filterRead === 'unread' && a.read) return false;
        if (filterRead === 'read' && !a.read) return false;
        return true;
    });

    const markAsRead = (id) => {
        setAlerts(prev => prev.map(a => a._id === id ? { ...a, read: true } : a));
    };

    const markAllRead = () => {
        setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    };

    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1><HiOutlineBell style={{ verticalAlign: 'middle' }} /> Alert Center</h1>
                            <p>{unreadCount} unread alerts</p>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={markAllRead} disabled={unreadCount === 0}>
                            <HiOutlineCheck /> Mark All Read
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="alert-filters card" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <HiOutlineFilter style={{ color: 'var(--color-text-muted)' }} />
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Filter:</span>
                            <select className="form-input" style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: '0.85rem' }}
                                value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
                                <option value="all">All Severities</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <select className="form-input" style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: '0.85rem' }}
                                value={filterRead} onChange={e => setFilterRead(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                            </select>
                        </div>
                    </div>

                    {/* Severity summary */}
                    <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
                        {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => {
                            const count = alerts.filter(a => a.severity === key).length;
                            return (
                                <div key={key} className="kpi-card" style={{ borderTop: `3px solid ${cfg.color}`, cursor: 'pointer' }}
                                    onClick={() => setFilterSeverity(filterSeverity === key ? 'all' : key)}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ color: cfg.color, fontSize: '1.2rem' }}>{cfg.icon}</span>
                                        <span className="kpi-label">{cfg.label}</span>
                                    </div>
                                    <div className="kpi-value" style={{ color: cfg.color }}>{count}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Alert list */}
                    {loading ? (
                        <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading alerts...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state card"><div className="empty-icon">🔔</div><p>No alerts match your filter</p></div>
                    ) : (
                        <div className="alert-list">
                            {filtered.map((alert, idx) => {
                                const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.low;
                                return (
                                    <div key={alert._id} className={`alert-center-item card ${!alert.read ? 'unread' : ''} animate-fadeIn`}
                                        style={{ animationDelay: `${idx * 0.05}s` }}
                                        onClick={() => { setSelectedAlert(alert); markAsRead(alert._id); }}>
                                        <div className="alert-item-indicator" style={{ background: cfg.color }} />
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                                            <span style={{ color: cfg.color, fontSize: '1.3rem', marginTop: 2 }}>{cfg.icon}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                                        {new Date(alert.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>{alert.message}</p>
                                                {alert.project && (
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>
                                                        📁 {alert.project}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {!alert.read && <div className="unread-dot" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertCenterPage;
