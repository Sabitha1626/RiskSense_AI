import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { HiOutlineLink, HiOutlineRefresh, HiOutlineDownload, HiOutlineStatusOnline, HiOutlineExclamation } from 'react-icons/hi';
import jiraService from '../services/jiraService';
import './JiraIntegrationPage.css';

const JiraIntegrationPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('status');
    const [syncStatus, setSyncStatus] = useState({
        connected: true,
        lastSync: '2026-02-20T10:00:00Z',
        projectsSynced: 3,
        tasksSynced: 47,
        errors: 0,
    });
    const [syncLogs, setSyncLogs] = useState([
        { id: 1, timestamp: '2026-02-20T10:00:00Z', type: 'success', message: 'Full sync completed — 47 tasks updated', duration: '12s' },
        { id: 2, timestamp: '2026-02-20T09:00:00Z', type: 'success', message: 'Incremental sync — 3 new tasks imported', duration: '4s' },
        { id: 3, timestamp: '2026-02-19T18:00:00Z', type: 'warning', message: 'Partial sync — 2 tasks failed mapping', duration: '8s' },
        { id: 4, timestamp: '2026-02-19T10:00:00Z', type: 'success', message: 'Full sync completed — 44 tasks updated', duration: '14s' },
        { id: 5, timestamp: '2026-02-18T10:00:00Z', type: 'error', message: 'Sync failed — API rate limit exceeded', duration: '0s' },
    ]);
    const [importProjects, setImportProjects] = useState([
        { key: 'PROJ-A', name: 'Project Alpha', issues: 24, status: 'synced', lastSync: '2 hours ago' },
        { key: 'PROJ-B', name: 'Project Beta', issues: 18, status: 'synced', lastSync: '2 hours ago' },
        { key: 'PROJ-C', name: 'Project Gamma', issues: 12, status: 'not_synced', lastSync: 'Never' },
        { key: 'PROJ-D', name: 'Project Delta', issues: 8, status: 'error', lastSync: '1 day ago' },
    ]);
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        await new Promise(r => setTimeout(r, 2000));
        setSyncStatus(prev => ({ ...prev, lastSync: new Date().toISOString() }));
        setSyncLogs(prev => [{
            id: Date.now(), timestamp: new Date().toISOString(), type: 'success',
            message: 'Manual sync completed successfully', duration: '2s'
        }, ...prev]);
        setSyncing(false);
    };

    const importProject = (key) => {
        setImportProjects(prev => prev.map(p =>
            p.key === key ? { ...p, status: 'synced', lastSync: 'Just now' } : p
        ));
    };

    const logColors = { success: 'var(--color-risk-low)', warning: 'var(--color-risk-medium)', error: 'var(--color-risk-high)' };
    const logIcons = { success: '✅', warning: '⚠️', error: '❌' };
    const statusConfig = {
        synced: { color: 'var(--color-risk-low)', label: 'Synced', bg: 'var(--color-risk-low-bg)' },
        not_synced: { color: 'var(--color-text-muted)', label: 'Not Synced', bg: 'var(--color-surface)' },
        error: { color: 'var(--color-risk-high)', label: 'Error', bg: 'var(--color-risk-high-bg)' },
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1><HiOutlineLink style={{ verticalAlign: 'middle' }} /> Jira Integration</h1>
                            <p>Sync projects and tasks from Jira</p>
                        </div>
                        <button className="btn btn-primary" onClick={handleSync} disabled={syncing}>
                            <HiOutlineRefresh className={syncing ? 'spin' : ''} /> {syncing ? 'Syncing...' : 'Sync Now'}
                        </button>
                    </div>

                    {/* Connection Status */}
                    <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
                        <div className="kpi-card primary">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <HiOutlineStatusOnline style={{ color: syncStatus.connected ? 'var(--color-risk-low)' : 'var(--color-risk-high)', fontSize: '1.2rem' }} />
                                <span className="kpi-label">Status</span>
                            </div>
                            <div className="kpi-value" style={{ color: syncStatus.connected ? 'var(--color-risk-low)' : 'var(--color-risk-high)', fontSize: '1.2rem' }}>
                                {syncStatus.connected ? 'Connected' : 'Disconnected'}
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-label">Last Sync</div>
                            <div className="kpi-value" style={{ fontSize: '1rem' }}>{new Date(syncStatus.lastSync).toLocaleTimeString()}</div>
                        </div>
                        <div className="kpi-card success">
                            <div className="kpi-label">Projects Synced</div>
                            <div className="kpi-value">{syncStatus.projectsSynced}</div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-label">Tasks Synced</div>
                            <div className="kpi-value">{syncStatus.tasksSynced}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="analytics-tabs" style={{ marginBottom: 20 }}>
                        {[{ id: 'status', label: '📊 Sync Status' }, { id: 'import', label: '📥 Import Projects' }, { id: 'logs', label: '📋 Sync Logs' }].map(tab => (
                            <button key={tab.id} className={`analytics-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
                        ))}
                    </div>

                    <div className="animate-fadeIn" key={activeTab}>
                        {activeTab === 'import' && (
                            <div className="card">
                                <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>Import Jira Projects</h3>
                                <div className="table-container">
                                    <table className="table">
                                        <thead><tr><th>Key</th><th>Project Name</th><th>Issues</th><th>Status</th><th>Last Sync</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {importProjects.map(p => {
                                                const cfg = statusConfig[p.status];
                                                return (
                                                    <tr key={p.key}>
                                                        <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{p.key}</td>
                                                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                                                        <td>{p.issues}</td>
                                                        <td><span className="badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                                                        <td style={{ color: 'var(--color-text-muted)' }}>{p.lastSync}</td>
                                                        <td>
                                                            {p.status !== 'synced' ? (
                                                                <button className="btn btn-primary btn-sm" onClick={() => importProject(p.key)}>
                                                                    <HiOutlineDownload /> Import
                                                                </button>
                                                            ) : (
                                                                <button className="btn btn-secondary btn-sm" onClick={() => importProject(p.key)}>
                                                                    <HiOutlineRefresh /> Re-sync
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'logs' && (
                            <div className="card">
                                <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>Sync Logs</h3>
                                <div className="sync-log-list">
                                    {syncLogs.map((log, idx) => (
                                        <div key={log.id} className="sync-log-item animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                                            <span style={{ fontSize: '1.1rem' }}>{logIcons[log.type]}</span>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.88rem', color: logColors[log.type], fontWeight: 500 }}>{log.message}</p>
                                                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                                    {new Date(log.timestamp).toLocaleString()} • Duration: {log.duration}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'status' && (
                            <div className="card">
                                <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>Sync Overview</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>Synced Projects</h4>
                                        {importProjects.filter(p => p.status === 'synced').map(p => (
                                            <div key={p.key} style={{
                                                padding: '12px 16px', border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-md)', marginBottom: 8, display: 'flex', justifyContent: 'space-between'
                                            }}>
                                                <div>
                                                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: 8 }}>{p.key}</span>
                                                </div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-low)' }}>✔ Synced</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 12 }}>Recent Activity</h4>
                                        {syncLogs.slice(0, 3).map(log => (
                                            <div key={log.id} style={{
                                                padding: '10px 14px', marginBottom: 8,
                                                background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-md)'
                                            }}>
                                                <span style={{ fontSize: '0.85rem' }}>{logIcons[log.type]} {log.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JiraIntegrationPage;
