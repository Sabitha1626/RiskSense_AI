import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import SimulationControls from '../components/planning/SimulationControls';
import ResourceRecommendation from '../components/planning/ResourceRecommendation';
import { HiOutlineCalendar, HiOutlineLightBulb } from 'react-icons/hi';
import './SmartPlanningPage.css';

const SmartPlanningPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [simResult, setSimResult] = useState(null);

    const deadlineSuggestions = [
        { project: 'Project Alpha', currentDeadline: '2026-03-15', suggestedDeadline: '2026-03-22', confidence: 0.85, reason: 'Based on current velocity and remaining scope' },
        { project: 'Project Beta', currentDeadline: '2026-04-01', suggestedDeadline: '2026-03-28', confidence: 0.92, reason: 'Team is ahead of schedule' },
        { project: 'Project Gamma', currentDeadline: '2026-03-30', suggestedDeadline: '2026-04-10', confidence: 0.72, reason: 'Scope increased by 20% without team adjustment' },
    ];

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1><HiOutlineCalendar style={{ verticalAlign: 'middle' }} /> Smart Planning</h1>
                        <p>AI-powered project planning, deadline simulations, and resource optimization</p>
                    </div>

                    {/* Deadline Suggestions */}
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>
                            <HiOutlineLightBulb style={{ verticalAlign: 'middle', color: 'var(--color-risk-medium)' }} /> Deadline Suggestions
                        </h3>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Project</th><th>Current Deadline</th><th>Suggested</th><th>Confidence</th><th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deadlineSuggestions.map((s, i) => {
                                        const isLater = new Date(s.suggestedDeadline) > new Date(s.currentDeadline);
                                        return (
                                            <tr key={i}>
                                                <td style={{ fontWeight: 600 }}>{s.project}</td>
                                                <td>{s.currentDeadline}</td>
                                                <td style={{ color: isLater ? 'var(--color-risk-high)' : 'var(--color-risk-low)', fontWeight: 600 }}>
                                                    {isLater ? '↗ ' : '↘ '}{s.suggestedDeadline}
                                                </td>
                                                <td>
                                                    <span className={`badge ${s.confidence >= 0.8 ? 'badge-success' : s.confidence >= 0.6 ? 'badge-warning' : 'badge-danger'}`}>
                                                        {(s.confidence * 100).toFixed(0)}%
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.85rem' }}>{s.reason}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="planning-grid">
                        <SimulationControls onSimulate={setSimResult} />
                        <ResourceRecommendation simResult={simResult} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartPlanningPage;
