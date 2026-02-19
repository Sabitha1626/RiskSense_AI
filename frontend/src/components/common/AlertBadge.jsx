import { getSeverityBadgeClass } from '../../utils/riskColorMapper';

const AlertBadge = ({ severity, children }) => {
    const badgeClass = getSeverityBadgeClass(severity);
    return (
        <span className={`badge ${badgeClass}`}>
            {severity === 'critical' && '⚠ '}
            {severity === 'warning' && '⚡ '}
            {severity === 'info' && 'ℹ '}
            {severity === 'success' && '✓ '}
            {children || severity}
        </span>
    );
};

export default AlertBadge;
