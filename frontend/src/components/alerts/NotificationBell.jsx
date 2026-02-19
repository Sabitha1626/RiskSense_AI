import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBell } from 'react-icons/hi';
import { AlertContext } from '../../context/AlertContext';
import AlertBadge from '../common/AlertBadge';
import { formatTimeAgo } from '../../utils/dateUtils';
import './NotificationBell.css';

const NotificationBell = () => {
    const { alerts, unreadCount, markAsRead } = useContext(AlertContext);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const ref = useRef(null);

    const recentAlerts = alerts.slice(0, 5);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="notification-bell" ref={ref}>
            <button className="bell-btn" onClick={() => setOpen(!open)}>
                <HiOutlineBell className={unreadCount > 0 ? 'bell-ring' : ''} />
                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
            </button>

            {open && (
                <div className="bell-dropdown animate-fadeIn">
                    <div className="bell-dropdown-header">
                        <h4>Notifications</h4>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => navigate('/alerts')}
                        >
                            View All
                        </button>
                    </div>

                    <div className="bell-dropdown-list">
                        {recentAlerts.length === 0 ? (
                            <div className="bell-empty">No notifications</div>
                        ) : (
                            recentAlerts.map((alert) => (
                                <div
                                    key={alert._id}
                                    className={`bell-item ${!alert.read ? 'unread' : ''}`}
                                    onClick={() => {
                                        markAsRead(alert._id);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="bell-item-top">
                                        <AlertBadge severity={alert.severity} />
                                        <span className="bell-item-time">{formatTimeAgo(alert.timestamp)}</span>
                                    </div>
                                    <p className="bell-item-title">{alert.title}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
