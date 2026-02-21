import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ConfidenceScore from '../components/ai/ConfidenceScore';
import RecommendationsPanel from '../components/ai/RecommendationsPanel';
import ExplainableAI from '../components/ai/ExplainableAI';
import { HiOutlineLightBulb, HiOutlineRefresh } from 'react-icons/hi';
import riskService from '../services/riskService';
import './AIInsightsPage.css';

const AIInsightsPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState(null);
    const [selectedProject, setSelectedProject] = useState('all');

    useEffect(() => { fetchInsights(); }, []);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const res = await riskService.getPredictions();
            setInsights(res.data);
        } catch {
            setInsights({
                overallRisk: 0.42,
                confidence: 0.87,
                factors: [
                    { name: 'Task Completion Rate', impact: 0.35, direction: 'positive', value: '72%' },
                    { name: 'Team Velocity', impact: 0.25, direction: 'positive', value: '15 pts/sprint' },
                    { name: 'Deadline Proximity', impact: -0.30, direction: 'negative', value: '18 days' },
                    { name: 'Scope Changes', impact: -0.20, direction: 'negative', value: '3 this week' },
                    { name: 'Resource Utilization', impact: 0.15, direction: 'neutral', value: '85%' },
                ],
                recommendations: [
                    { id: 1, priority: 'high', title: 'Reassign blocked tasks', description: 'Tasks T-105 and T-108 have been blocked for 3+ days. Consider reassigning or removing blockers.', impact: 'Could improve delivery by 2 days' },
                    { id: 2, priority: 'medium', title: 'Increase testing capacity', description: 'QA backlog has grown 40% this sprint. Add temporary QA support.', impact: 'Reduces bug escape rate by 25%' },
                    { id: 3, priority: 'low', title: 'Update project documentation', description: 'Architecture docs are 2 sprints behind. Schedule a documentation sprint.', impact: 'Improves onboarding time by 30%' },
                ],
                riskTrend: [0.55, 0.52, 0.48, 0.45, 0.42],
            });
        } finally {
            setLoading(false);
        }
    };

    const riskLevel = insights?.overallRisk < 0.3 ? 'low' : insights?.overallRisk < 0.6 ? 'medium' : 'high';
    const riskColors = { low: 'var(--color-risk-low)', medium: 'var(--color-risk-medium)', high: 'var(--color-risk-high)' };

    return (
        <div className="app-layout">
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={collapsed} />
                <div className="page-container">
                    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1><HiOutlineLightBulb style={{ verticalAlign: 'middle' }} /> AI Insights</h1>
                            <p>Machine learning-powered risk analysis and recommendations</p>
                        </div>
                        <button className="btn btn-secondary" onClick={fetchInsights}>
                            <HiOutlineRefresh /> Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty-state"><div className="empty-icon">🤖</div><p>Analyzing project data...</p></div>
                    ) : insights && (
                        <>
                            {/* Risk Overview */}
                            <div className="ai-risk-overview kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                <div className="kpi-card" style={{ borderTop: `3px solid ${riskColors[riskLevel]}` }}>
                                    <div className="kpi-label">Overall Risk</div>
                                    <div className="kpi-value" style={{ color: riskColors[riskLevel] }}>
                                        {(insights.overallRisk * 100).toFixed(0)}%
                                    </div>
                                    <span className="badge" style={{
                                        background: `${riskColors[riskLevel]}20`, color: riskColors[riskLevel]
                                    }}>{riskLevel.toUpperCase()} RISK</span>
                                </div>

                                <ConfidenceScore score={insights.confidence} />

                                <div className="kpi-card primary">
                                    <div className="kpi-label">Risk Trend</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50, marginTop: 8 }}>
                                        {(insights.riskTrend || []).map((v, i) => (
                                            <div key={i} style={{
                                                flex: 1, height: `${v * 100}%`, borderRadius: '4px 4px 0 0',
                                                background: i === (insights.riskTrend?.length || 0) - 1
                                                    ? 'var(--gradient-primary)' : 'var(--color-surface-light)',
                                                transition: 'height 0.5s ease'
                                            }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-low)', marginTop: 8, display: 'block' }}>
                                        ↓ Trending down
                                    </span>
                                </div>
                            </div>

                            {/* Main content grid */}
                            <div className="ai-content-grid">
                                <ExplainableAI factors={insights.factors} />
                                <RecommendationsPanel recommendations={insights.recommendations} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIInsightsPage;
