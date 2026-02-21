const ConfidenceScore = ({ score = 0.87 }) => {
    const percentage = Math.round(score * 100);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score * circumference);
    const color = score >= 0.8 ? 'var(--color-risk-low)' : score >= 0.5 ? 'var(--color-risk-medium)' : 'var(--color-risk-high)';

    return (
        <div className="kpi-card" style={{ textAlign: 'center' }}>
            <div className="kpi-label">Model Confidence</div>
            <div className="confidence-gauge">
                <svg width={80} height={80}>
                    <circle cx={40} cy={40} r={radius} fill="none"
                        stroke="var(--color-surface)" strokeWidth={6} />
                    <circle cx={40} cy={40} r={radius} fill="none"
                        stroke={color} strokeWidth={6}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div className="confidence-value" style={{ color }}>{percentage}%</div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {score >= 0.8 ? 'High confidence' : score >= 0.5 ? 'Moderate confidence' : 'Low confidence'}
            </span>
        </div>
    );
};

export default ConfidenceScore;
