export const getRiskLevel = (score) => {
    if (score <= 25) return 'low';
    if (score <= 50) return 'medium';
    if (score <= 75) return 'high';
    return 'critical';
};

export const getRiskColor = (score) => {
    const level = getRiskLevel(score);
    const colors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#dc2626',
    };
    return colors[level];
};

export const getRiskBgColor = (score) => {
    const level = getRiskLevel(score);
    const colors = {
        low: 'rgba(16, 185, 129, 0.12)',
        medium: 'rgba(245, 158, 11, 0.12)',
        high: 'rgba(239, 68, 68, 0.12)',
        critical: 'rgba(220, 38, 38, 0.15)',
    };
    return colors[level];
};

export const getRiskLabel = (score) => {
    const level = getRiskLevel(score);
    return level.charAt(0).toUpperCase() + level.slice(1);
};

export const getRiskBadgeClass = (score) => {
    const level = getRiskLevel(score);
    const classes = {
        low: 'badge-success',
        medium: 'badge-warning',
        high: 'badge-danger',
        critical: 'badge-danger',
    };
    return classes[level];
};

export const getSeverityColor = (severity) => {
    const map = {
        info: '#3b82f6',
        warning: '#f59e0b',
        critical: '#ef4444',
        success: '#10b981',
    };
    return map[severity] || '#94a3b8';
};

export const getSeverityBadgeClass = (severity) => {
    const map = {
        info: 'badge-info',
        warning: 'badge-warning',
        critical: 'badge-danger',
        success: 'badge-success',
    };
    return map[severity] || 'badge-info';
};
