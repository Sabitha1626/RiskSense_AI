import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard';

const EmployeeHome = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Navbar sidebarCollapsed={sidebarCollapsed} />
                <div className="page-container">
                    <div className="page-header">
                        <h1>My Dashboard</h1>
                        <p>Track your tasks, productivity, and work reports</p>
                    </div>
                    <EmployeeDashboard />
                </div>
            </div>
        </div>
    );
};

export default EmployeeHome;
