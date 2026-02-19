import { useState, useEffect, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { AuthContext } from '../context/AuthContext';
import reportService from '../services/reportService';
import Loader from '../components/common/Loader';

const ReportsPage = () => {
    const { user } = useContext(AuthContext);
    const isManager = user?.role === 'manager';
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('risk');
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [fraudReports, setFraudReports] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const [allReports, fraudData] = await Promise.all([
                    reportService.getReports(),
                    reportService.getFraudReports ? reportService.getFraudReports() : Promise.resolve([]),
                ]);
                setReports(allReports);
                setFraudReports(fraudData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(r => {
        if (dateFilter && new Date(r.date).toISOString().split('T')[0] !== dateFilter) return false;
        return true;
    });

    const handleDownloadPDF = () => {
        // Mock PDF download
        const content = activeTab === 'risk'
            ? 'Project Risk Summary Report\n\n' + filteredReports.map(r => `${r.employeeName || r.employee}: ${r.hoursWorked || 0}h - ${r.task || 'General'}`).join('\n')
            : 'Employee Productivity Summary Report\n\n' + filteredReports.map(r => `${r.employeeName || r.employee}: ${r.hoursWorked || 0}h`).join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Reports</h1>
                        <p>View project risk summaries and employee productivity data</p>
                    </div>

                    {loading ? <Loader text="Loading reports..." /> : (
                        <div className="animate-fadeIn">
                            {/* Tab Navigation */}
                            <div className="tab-nav">
                                <button className={`tab-btn ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')}>
                                    📊 Project Risk Summary
                                </button>
                                <button className={`tab-btn ${activeTab === 'productivity' ? 'active' : ''}`} onClick={() => setActiveTab('productivity')}>
                                    📈 Employee Productivity
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="filter-bar">
                                <div className="form-group" style={{ margin: 0 }}>
                                    <input type="date" className="form-input filter-input" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
                                </div>
                                {dateFilter && (
                                    <button className="btn btn-sm btn-ghost" onClick={() => setDateFilter('')}>Clear</button>
                                )}
                                <button className="btn btn-sm btn-primary" onClick={handleDownloadPDF} style={{ marginLeft: 'auto' }}>
                                    📥 Download Report
                                </button>
                            </div>

                            {/* Report Content */}
                            {activeTab === 'risk' ? (
                                <div className="dashboard-section">
                                    <div className="section-header">
                                        <h2>Project Risk Summary</h2>
                                    </div>
                                    {filteredReports.length === 0 ? (
                                        <div className="empty-state"><div className="empty-icon">📄</div><p>No reports found.</p></div>
                                    ) : (
                                        <div className="table-container">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Employee</th>
                                                        <th>Task</th>
                                                        <th>Date</th>
                                                        <th>Hours Worked</th>
                                                        <th>Completion %</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredReports.map((r, i) => (
                                                        <tr key={i}>
                                                            <td className="td-name">{r.employeeName || r.employee}</td>
                                                            <td>{r.task || '—'}</td>
                                                            <td>{new Date(r.date).toLocaleDateString()}</td>
                                                            <td>{r.hoursWorked || '—'}</td>
                                                            <td>
                                                                <div className="progress-bar" style={{ width: '80px', display: 'inline-block' }}>
                                                                    <div className="progress-fill" style={{ width: `${r.completionPercent || 0}%` }} />
                                                                </div>
                                                                <span style={{ marginLeft: '8px' }}>{r.completionPercent || 0}%</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="dashboard-section">
                                    <div className="section-header">
                                        <h2>Employee Productivity Summary</h2>
                                    </div>
                                    {filteredReports.length === 0 ? (
                                        <div className="empty-state"><div className="empty-icon">📄</div><p>No reports found.</p></div>
                                    ) : (
                                        <div className="table-container">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Employee</th>
                                                        <th>Date</th>
                                                        <th>Hours Worked</th>
                                                        <th>Tasks Reported</th>
                                                        <th>Issues</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredReports.map((r, i) => (
                                                        <tr key={i}>
                                                            <td className="td-name">{r.employeeName || r.employee}</td>
                                                            <td>{new Date(r.date).toLocaleDateString()}</td>
                                                            <td>{r.hoursWorked || '—'}</td>
                                                            <td>{r.task || '—'}</td>
                                                            <td>{r.issuesFaced || 'None'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fraud Reports (Manager Only) */}
                            {isManager && fraudReports.length > 0 && (
                                <div className="dashboard-section" style={{ marginTop: '28px' }}>
                                    <div className="section-header">
                                        <h2>🚨 Flagged Reports</h2>
                                    </div>
                                    <div className="table-container">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Employee</th>
                                                    <th>Task</th>
                                                    <th>Date</th>
                                                    <th>Flag Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fraudReports.map((r, i) => (
                                                    <tr key={i} style={{ background: 'rgba(239,68,68,0.05)' }}>
                                                        <td className="td-name">{r.employeeName || r.employee}</td>
                                                        <td>{r.task || '—'}</td>
                                                        <td>{new Date(r.date).toLocaleDateString()}</td>
                                                        <td className="td-reason">{r.flagReason || r.reason || 'Suspicious activity detected'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
