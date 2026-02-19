import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import employeeService from '../services/employeeService';
import Loader from '../components/common/Loader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EmployeePerformance = () => {
    const [searchParams] = useSearchParams();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(searchParams.get('id') || '');
    const [perfData, setPerfData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [perfLoading, setPerfLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await employeeService.getAllEmployees();
                setEmployees(data);
            } catch (err) {
                setError('Failed to load employees.');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (!selectedEmployee) {
            setPerfData(null);
            return;
        }
        const fetchPerformance = async () => {
            setPerfLoading(true);
            try {
                const data = await employeeService.getPerformance(selectedEmployee);
                setPerfData(data);
                setError('');
            } catch (err) {
                setError('Failed to load performance data.');
            } finally {
                setPerfLoading(false);
            }
        };
        fetchPerformance();
    }, [selectedEmployee]);

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--color-risk-low)';
        if (score >= 60) return 'var(--color-risk-medium)';
        return 'var(--color-risk-high)';
    };

    const chartData = perfData ? {
        labels: perfData.labels,
        datasets: [
            {
                label: 'Employee',
                data: perfData.productivityData,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'Team Average',
                data: perfData.teamAverage,
                borderColor: '#64748b',
                borderDash: [5, 5],
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', usePointStyle: true, padding: 20 } },
            title: { display: true, text: 'Productivity Trend — Last 30 Days', color: '#f1f5f9', font: { size: 14, family: 'Outfit' } },
        },
        scales: {
            x: { ticks: { color: '#64748b', maxTicksLimit: 10 }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { min: 0, max: 100, ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
    };

    const avgAccuracy = perfData?.completedTasks?.length > 0
        ? Math.round(perfData.completedTasks.reduce((s, t) => s + t.accuracy, 0) / perfData.completedTasks.length)
        : 0;

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Employee Performance</h1>
                        <p>Detailed performance profile for individual employees</p>
                    </div>

                    {loading ? <Loader text="Loading..." /> : (
                        <div className="animate-fadeIn">
                            {error && <div className="auth-error">{error}</div>}

                            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '28px' }}>
                                <label className="form-label">Select Employee</label>
                                <select className="form-input" value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
                                    <option value="">-- Choose an employee --</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>

                            {perfLoading && <Loader text="Loading performance..." />}

                            {perfData && !perfLoading && (
                                <>
                                    {/* Trust Score */}
                                    <div className="dashboard-section">
                                        <div className="perf-trust-section">
                                            <div className="reliability-circle-wrap">
                                                <div className="reliability-circle" style={{ '--score-color': getScoreColor(perfData.trustScore) }}>
                                                    <svg viewBox="0 0 120 120" className="circle-svg">
                                                        <circle cx="60" cy="60" r="52" className="circle-bg" />
                                                        <circle cx="60" cy="60" r="52" className="circle-fill" style={{ strokeDashoffset: 326.7 - (326.7 * perfData.trustScore / 100), stroke: getScoreColor(perfData.trustScore) }} />
                                                    </svg>
                                                    <div className="circle-text">
                                                        <span className="circle-value">{perfData.trustScore}</span>
                                                        <span className="circle-max">/100</span>
                                                    </div>
                                                </div>
                                                <span className="reliability-label" style={{ color: getScoreColor(perfData.trustScore) }}>{perfData.label}</span>
                                                <p className="trust-explain">The trust score measures reliability based on on-time delivery, report consistency, and daily productivity patterns.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Past Task Accuracy */}
                                    <div className="dashboard-section">
                                        <div className="section-header">
                                            <h2>📋 Past Task Accuracy</h2>
                                        </div>
                                        {perfData.completedTasks.length === 0 ? (
                                            <div className="empty-state"><div className="empty-icon">📭</div><p>No completed tasks yet.</p></div>
                                        ) : (
                                            <>
                                                <div className="table-container">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Task</th>
                                                                <th>Project</th>
                                                                <th>Est. Hours</th>
                                                                <th>Actual Hours</th>
                                                                <th>Deadline</th>
                                                                <th>Completed</th>
                                                                <th>On Time</th>
                                                                <th>Accuracy</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {perfData.completedTasks.map((task, i) => (
                                                                <tr key={i}>
                                                                    <td className="td-name">{task.task}</td>
                                                                    <td>{task.project}</td>
                                                                    <td>{task.estimatedHours}h</td>
                                                                    <td>{task.actualHours}h</td>
                                                                    <td>{new Date(task.deadline).toLocaleDateString()}</td>
                                                                    <td>{new Date(task.completionDate).toLocaleDateString()}</td>
                                                                    <td>
                                                                        <span className={`badge badge-${task.onTime ? 'success' : 'danger'}`}>
                                                                            {task.onTime ? 'Yes' : 'No'}
                                                                        </span>
                                                                    </td>
                                                                    <td>{task.accuracy}%</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="accuracy-avg">Overall Accuracy Average: <strong>{avgAccuracy}%</strong></div>
                                            </>
                                        )}
                                    </div>

                                    {/* Delay History */}
                                    <div className="dashboard-section">
                                        <div className="section-header">
                                            <h2>⏰ Delay History</h2>
                                        </div>
                                        {perfData.delays.length === 0 ? (
                                            <div className="empty-state">
                                                <div className="empty-icon">✅</div>
                                                <p>No delays recorded. Excellent track record!</p>
                                            </div>
                                        ) : (
                                            <div className="delay-list">
                                                {perfData.delays.map((d, i) => (
                                                    <div key={i} className="delay-item card">
                                                        <div className="delay-header">
                                                            <h4>{d.task}</h4>
                                                            <span className="badge badge-danger">{d.daysDelayed} day{d.daysDelayed > 1 ? 's' : ''} delayed</span>
                                                        </div>
                                                        <p className="delay-reason">{d.reason}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Productivity Trend */}
                                    <div className="dashboard-section">
                                        <div className="chart-card">
                                            <div className="chart-wrapper" style={{ height: '350px' }}>
                                                {chartData && <Line data={chartData} options={chartOptions} />}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeePerformance;
