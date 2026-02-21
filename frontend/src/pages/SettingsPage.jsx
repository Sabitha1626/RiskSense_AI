import { useState, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { HiOutlineCog, HiOutlineUser, HiOutlineBell, HiOutlineShieldCheck, HiOutlineLink, HiOutlineMoon, HiOutlineSun, HiOutlineSave } from 'react-icons/hi';
import './SettingsPage.css';

const SettingsPage = () => {
    const { user } = useContext(AuthContext);
    const { theme, toggleTheme, accentColor, setAccentColor } = useContext(ThemeContext);
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || '',
        phone: '',
        bio: '',
    });

    const [notifPrefs, setNotifPrefs] = useState({
        emailAlerts: true,
        pushAlerts: true,
        riskAlerts: true,
        deadlineReminders: true,
        teamUpdates: false,
        weeklyDigest: true,
    });

    const [integrations, setIntegrations] = useState({
        jira: true,
        slack: false,
        github: false,
        teams: true,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <HiOutlineUser /> },
        { id: 'notifications', label: 'Notifications', icon: <HiOutlineBell /> },
        { id: 'roles', label: 'Roles & Access', icon: <HiOutlineShieldCheck /> },
        { id: 'integrations', label: 'Integrations', icon: <HiOutlineLink /> },
        { id: 'appearance', label: 'Appearance', icon: <HiOutlineMoon /> },
    ];

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1><HiOutlineCog style={{ verticalAlign: 'middle' }} /> Settings</h1>
                        <p>Manage your profile, preferences, and integrations</p>
                    </div>

                    <div className="settings-layout">
                        {/* Settings sidebar */}
                        <div className="settings-nav card">
                            {tabs.map(tab => (
                                <button key={tab.id}
                                    className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}>
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Settings content */}
                        <div className="settings-content animate-fadeIn" key={activeTab}>
                            {activeTab === 'profile' && (
                                <div className="card">
                                    <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-display)' }}>Profile Settings</h3>

                                    <div className="settings-avatar" style={{ marginBottom: 24 }}>
                                        <div style={{
                                            width: 72, height: 72, borderRadius: '50%', background: 'var(--gradient-primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 800, fontSize: '1.5rem', color: '#fff', fontFamily: 'var(--font-display)'
                                        }}>
                                            {(profile.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 700 }}>{profile.name || 'User'}</h3>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{user?.role || 'Member'}</span>
                                        </div>
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <input className="form-input" value={profile.name}
                                                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input className="form-input" type="email" value={profile.email}
                                                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Department</label>
                                            <input className="form-input" value={profile.department}
                                                onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input className="form-input" type="tel" value={profile.phone}
                                                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: 16 }}>
                                        <label className="form-label">Bio</label>
                                        <textarea className="form-input" rows={3} value={profile.bio}
                                            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                            placeholder="Tell us about yourself..." />
                                    </div>
                                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSave}>
                                        <HiOutlineSave /> {saved ? '✓ Saved!' : 'Save Profile'}
                                    </button>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="card">
                                    <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-display)' }}>Notification Preferences</h3>
                                    {Object.entries({
                                        emailAlerts: { label: 'Email Alerts', desc: 'Receive risk alerts and updates via email' },
                                        pushAlerts: { label: 'Push Notifications', desc: 'Browser push notifications for urgent alerts' },
                                        riskAlerts: { label: 'Risk Threshold Alerts', desc: 'Notify when risk score exceeds 70%' },
                                        deadlineReminders: { label: 'Deadline Reminders', desc: 'Get reminders 3, 7, and 14 days before deadlines' },
                                        teamUpdates: { label: 'Team Activity Updates', desc: 'Daily summary of team member activities' },
                                        weeklyDigest: { label: 'Weekly Digest', desc: 'Comprehensive weekly report delivered every Monday' },
                                    }).map(([key, { label, desc }]) => (
                                        <div key={key} className="settings-toggle-row">
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{desc}</div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" checked={notifPrefs[key]}
                                                    onChange={e => setNotifPrefs(p => ({ ...p, [key]: e.target.checked }))} />
                                                <span className="toggle-slider" />
                                            </label>
                                        </div>
                                    ))}
                                    <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleSave}>
                                        <HiOutlineSave /> {saved ? '✓ Saved!' : 'Save Preferences'}
                                    </button>
                                </div>
                            )}

                            {activeTab === 'roles' && (
                                <div className="card">
                                    <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-display)' }}>Roles & Access Control</h3>
                                    <div className="table-container">
                                        <table className="table">
                                            <thead><tr><th>Role</th><th>Members</th><th>Permissions</th></tr></thead>
                                            <tbody>
                                                {[
                                                    { role: 'Admin', members: 1, perms: 'Full access — all modules and settings' },
                                                    { role: 'Manager', members: 3, perms: 'Projects, tasks, reports, analytics, team management' },
                                                    { role: 'Employee', members: 12, perms: 'Own tasks, daily progress, limited reports' },
                                                    { role: 'Viewer', members: 5, perms: 'Read-only dashboard and report access' },
                                                ].map((r, i) => (
                                                    <tr key={i}>
                                                        <td style={{ fontWeight: 700 }}>{r.role}</td>
                                                        <td><span className="badge badge-primary">{r.members}</span></td>
                                                        <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{r.perms}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'integrations' && (
                                <div className="card">
                                    <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-display)' }}>Integration Settings</h3>
                                    {Object.entries({
                                        jira: { label: 'Jira', desc: 'Sync projects and tasks from Atlassian Jira', icon: '🔗' },
                                        slack: { label: 'Slack', desc: 'Send notifications and alerts to Slack channels', icon: '💬' },
                                        github: { label: 'GitHub', desc: 'Link commits and PRs to tasks', icon: '🐙' },
                                        teams: { label: 'MS Teams', desc: 'Microsoft Teams integration for notifications', icon: '📱' },
                                    }).map(([key, { label, desc, icon }]) => (
                                        <div key={key} className="settings-toggle-row">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                                                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{desc}</div>
                                                </div>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" checked={integrations[key]}
                                                    onChange={e => setIntegrations(p => ({ ...p, [key]: e.target.checked }))} />
                                                <span className="toggle-slider" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="card">
                                    <h3 style={{ marginBottom: 20, fontFamily: 'var(--font-display)' }}>Appearance</h3>
                                    <div className="settings-toggle-row">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {theme === 'dark' ? <HiOutlineMoon style={{ fontSize: '1.3rem' }} /> : <HiOutlineSun style={{ fontSize: '1.3rem' }} />}
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dark Mode</div>
                                                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Switch between dark and light theme</div>
                                            </div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                                            <span className="toggle-slider" />
                                        </label>
                                    </div>

                                    <div style={{ marginTop: 24 }}>
                                        <h4 style={{ fontSize: '0.9rem', marginBottom: 12, color: 'var(--color-text-secondary)' }}>Accent Color</h4>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            {['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                                                <div key={c}
                                                    onClick={() => setAccentColor(c)}
                                                    style={{
                                                        width: 36, height: 36, borderRadius: '50%', background: c,
                                                        cursor: 'pointer',
                                                        border: accentColor === c ? '3px solid #fff' : '3px solid transparent',
                                                        transform: accentColor === c ? 'scale(1.2)' : 'scale(1)',
                                                        transition: 'all 0.2s',
                                                        boxShadow: accentColor === c ? `0 0 12px ${c}` : 'none',
                                                    }} title={c} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save toast */}
                    {saved && (
                        <div className="save-toast animate-fadeIn">
                            ✓ Settings saved successfully!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
