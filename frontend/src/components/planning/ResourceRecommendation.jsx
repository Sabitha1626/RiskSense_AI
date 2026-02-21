import { HiOutlineUserGroup, HiOutlineLightBulb } from 'react-icons/hi';

const ResourceRecommendation = ({ simResult }) => {
    const recommendations = [
        {
            type: 'add_resource',
            title: 'Add Frontend Developer',
            description: 'Adding 1 frontend developer could reduce delivery time by 5 days and decrease risk by 15%.',
            impact: 'high',
            icon: '👩‍💻',
        },
        {
            type: 'redistribute',
            title: 'Redistribute QA Tasks',
            description: 'Move 3 testing tasks from overloaded QA to development team members with testing experience.',
            impact: 'medium',
            icon: '🔄',
        },
        {
            type: 'priority',
            title: 'Reprioritize Critical Path',
            description: 'Focus on tasks T-301, T-302, T-305 which are on the critical path. Defer T-310, T-312 to next sprint.',
            impact: 'high',
            icon: '🎯',
        },
        {
            type: 'automation',
            title: 'Automate Regression Tests',
            description: 'Setting up automated regression tests could save 8 hours/week of manual testing effort.',
            impact: 'low',
            icon: '🤖',
        },
    ];

    const impactColors = {
        high: 'var(--color-risk-high)',
        medium: 'var(--color-risk-medium)',
        low: 'var(--color-risk-low)',
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 6, fontFamily: 'var(--font-display)' }}>
                <HiOutlineUserGroup style={{ verticalAlign: 'middle' }} /> Resource Recommendations
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                AI-suggested optimizations for your team
            </p>

            {recommendations.map((rec, idx) => (
                <div key={idx} className="resource-card animate-fadeIn" style={{ animationDelay: `${idx * 0.08}s` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <span style={{ fontSize: '1.5rem' }}>{rec.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rec.title}</h4>
                                <span className="badge" style={{
                                    background: impactColors[rec.impact] + '20',
                                    color: impactColors[rec.impact]
                                }}>{rec.impact} impact</span>
                            </div>
                            <p style={{ fontSize: '0.83rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                                {rec.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {simResult && (
                <div style={{
                    marginTop: 16, padding: 14, background: 'var(--color-bg-glass)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <HiOutlineLightBulb style={{ color: 'var(--color-risk-medium)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Based on Your Simulation</span>
                    </div>
                    <p style={{ fontSize: '0.83rem', color: 'var(--color-text-secondary)' }}>
                        With the current parameters, consider adjusting team allocation to maintain
                        efficiency above {simResult.teamEfficiency}%.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResourceRecommendation;
