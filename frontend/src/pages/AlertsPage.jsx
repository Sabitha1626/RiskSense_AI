import { useState, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import AlertPanel from '../components/alerts/AlertPanel';

const AlertsPage = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container animate-fadeIn">
                    <div className="page-header">
                        <h1>Alerts & Notifications</h1>
                        <p>Monitor deadline risks, fraud detections, and productivity alerts</p>
                    </div>
                    <AlertPanel />
                </div>
            </div>
        </div>
    );
};

export default AlertsPage;
