const ExplainableAI = ({ factors = [] }) => {
    const getColor = (direction) => {
        if (direction === 'positive') return 'var(--color-risk-low)';
        if (direction === 'negative') return 'var(--color-risk-high)';
        return 'var(--color-risk-medium)';
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>
                🔍 Risk Factor Analysis
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                These factors contribute to the overall risk score. Green factors reduce risk, red factors increase it.
            </p>
            {factors.map((factor, idx) => {
                const color = getColor(factor.direction);
                const absImpact = Math.abs(factor.impact);
                return (
                    <div key={idx} className="factor-bar-container animate-fadeIn" style={{ animationDelay: `${idx * 0.08}s` }}>
                        <div className="factor-header">
                            <span className="factor-name">
                                {factor.direction === 'positive' ? '↗' : factor.direction === 'negative' ? '↘' : '→'}{' '}
                                {factor.name}
                            </span>
                            <span className="factor-value" style={{ color }}>{factor.value}</span>
                        </div>
                        <div className="factor-bar">
                            <div className="factor-fill" style={{
                                width: `${absImpact * 100}%`,
                                background: color,
                            }} />
                        </div>
                        <span style={{
                            fontSize: '0.75rem', color: 'var(--color-text-muted)',
                            display: 'block', marginTop: 2
                        }}>
                            Impact: {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(0)}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ExplainableAI;
