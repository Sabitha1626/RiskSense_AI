import { HiOutlineLightningBolt, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';

const RecommendationsPanel = ({ recommendations = [] }) => {
    const priorityIcons = {
        high: <HiOutlineLightningBolt />,
        medium: <HiOutlineArrowUp />,
        low: <HiOutlineArrowDown />,
    };

    const priorityColors = {
        high: 'var(--color-risk-high)',
        medium: 'var(--color-risk-medium)',
        low: 'var(--color-risk-low)',
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>
                💡 AI Recommendations
            </h3>
            {recommendations.length === 0 ? (
                <div className="empty-state" style={{ padding: 24 }}>
                    <p>No recommendations at this time</p>
                </div>
            ) : (
                recommendations.map((rec, idx) => (
                    <div key={rec.id || idx} className={`recommendation-item ${rec.priority}`}
                        style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ color: priorityColors[rec.priority], fontSize: '1.1rem' }}>
                                {priorityIcons[rec.priority]}
                            </span>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>{rec.title}</h4>
                            <span className="badge" style={{
                                background: `${priorityColors[rec.priority]}20`,
                                color: priorityColors[rec.priority]
                            }}>
                                {rec.priority}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 8, paddingLeft: 28 }}>
                            {rec.description}
                        </p>
                        {rec.impact && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', paddingLeft: 28 }}>
                                📈 Impact: {rec.impact}
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default RecommendationsPanel;
