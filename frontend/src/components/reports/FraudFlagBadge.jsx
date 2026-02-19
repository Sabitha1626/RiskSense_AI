import './FraudFlagBadge.css';

const FraudFlagBadge = ({ score, reason }) => {
    if (!score || score < 0.6) return null;

    const severity = score >= 0.85 ? 'critical' : 'warning';

    return (
        <div className={`fraud-flag ${severity}`}>
            <div className="fraud-flag-header">
                <span className="fraud-flag-icon">⚠</span>
                <span className="fraud-flag-label">
                    {severity === 'critical' ? 'High Fraud Risk' : 'Suspicious Activity'}
                </span>
                <span className="fraud-flag-score">{Math.round(score * 100)}%</span>
            </div>
            {reason && <p className="fraud-flag-reason">{reason}</p>}
        </div>
    );
};

export default FraudFlagBadge;
