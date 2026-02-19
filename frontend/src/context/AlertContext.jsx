import { createContext, useState, useEffect, useCallback } from 'react';
import alertService from '../services/alertService';

export const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await alertService.getAlerts();
            setAlerts(data);
            setUnreadCount(data.filter((a) => !a.read).length);
        } catch (err) {
            console.error('Failed to fetch alerts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();
        // Poll for new alerts every 30 seconds
        const interval = setInterval(fetchAlerts, 30000);
        return () => clearInterval(interval);
    }, [fetchAlerts]);

    const markAsRead = async (alertId) => {
        await alertService.markAsRead(alertId);
        setAlerts((prev) => prev.map((a) => (a._id === alertId ? { ...a, read: true } : a)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await alertService.markAllAsRead();
        setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
        setUnreadCount(0);
    };

    const value = {
        alerts,
        unreadCount,
        loading,
        fetchAlerts,
        markAsRead,
        markAllAsRead,
    };

    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
