import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';

const ManagerHome = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>Manager Dashboard</h1>
                        <p>Monitor project health, team productivity, and risk predictions</p>
                    </div>
                    <ManagerDashboard />
                </div>
            </div>
        </div>
    );
};

export default ManagerHome;
