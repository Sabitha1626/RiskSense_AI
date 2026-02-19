import { useContext, useState } from 'react';
import { AlertContext } from '../../context/AlertContext';
import AlertBadge from '../common/AlertBadge';
import Loader from '../common/Loader';
import { formatDateTime } from '../../utils/dateUtils';
import './AlertPanel.css';

const AlertPanel = () => {
    const { alerts, loading, markAsRead, markAllAsRead } = useContext(AlertContext);
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredAlerts = alerts.filter((a) => {
        if (filter === 'unread' && a.read) return false;
        if (typeFilter !== 'all' && a.type !== typeFilter) return false;
        return true;
    });

    const getTypeIcon = (type) => {
        const icons = {
            deadline_risk: '⏰',
            fraud_detection: '🔍',
            productivity: '📊',
            milestone: '🏆',
        };
        return icons[type] || '🔔';
    };

    const getTypeLabel = (type) => {
        const labels = {
            deadline_risk: 'Deadline Risk',
            fraud_detection: 'Fraud Detection',
            productivity: 'Productivity',
            milestone: 'Milestone',
        };
        return labels[type] || type;
    };

    if (loading) return <Loader text="Loading alerts..." />;

    return (
        <div className="alert-panel">
            <div className="alert-panel-controls">
                <div className="alert-filter-group">
                    <button
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({alerts.length})
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread ({alerts.filter((a) => !a.read).length})
                    </button>
                </div>

                <div className="alert-filter-group">
                    {['all', 'deadline_risk', 'fraud_detection', 'productivity', 'milestone'].map((type) => (
                        <button
                            key={type}
                            className={`btn btn-sm ${typeFilter === type ? 'btn-secondary' : 'btn-ghost'}`}
                            onClick={() => setTypeFilter(type)}
                        >
                            {type === 'all' ? '🔔 All Types' : `${getTypeIcon(type)} ${getTypeLabel(type)}`}
                        </button>
                    ))}
                </div>

                <button className="btn btn-sm btn-ghost" onClick={markAllAsRead}>
                    Mark all read
                </button>
            </div>

            <div className="alert-panel-list">
                {filteredAlerts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔔</div>
                        <p>No alerts match your filters</p>
                    </div>
                ) : (
                    filteredAlerts.map((alert) => (
                        <div
                            key={alert._id}
                            className={`alert-panel-item card ${!alert.read ? 'unread' : ''}`}
                            onClick={() => markAsRead(alert._id)}
                        >
                            <div className="alert-panel-item-top">
                                <div className="alert-panel-item-meta">
                                    <span className="alert-type-icon">{getTypeIcon(alert.type)}</span>
                                    <span className="alert-type-label">{getTypeLabel(alert.type)}</span>
                                    <AlertBadge severity={alert.severity} />
                                </div>
                                <span className="alert-panel-time">{formatDateTime(alert.timestamp)}</span>
                            </div>
                            <h4 className="alert-panel-title">{alert.title}</h4>
                            <p className="alert-panel-message">{alert.message}</p>
                            {!alert.read && <span className="unread-dot" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertPanel;
