import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
    HiOutlineHome,
    HiOutlineFolder,
    HiOutlineDocumentText,
    HiOutlineBell,
    HiOutlinePlusCircle,
    HiOutlineClipboardList,
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiOutlinePencilAlt,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
} from 'react-icons/hi';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
    const { user } = useContext(AuthContext);
    const isManager = user?.role === 'manager';

    const managerLinks = [
        { path: '/manager', label: 'Dashboard', icon: <HiOutlineHome /> },
        { path: '/projects', label: 'Projects', icon: <HiOutlineFolder /> },
        { path: '/create-project', label: 'Create Project', icon: <HiOutlinePlusCircle /> },
        { path: '/task-assignment', label: 'Task Assignment', icon: <HiOutlineClipboardList /> },
        { path: '/risk-prediction', label: 'Risk Prediction', icon: <HiOutlineShieldCheck /> },
        { path: '/employee-performance', label: 'Employee Performance', icon: <HiOutlineUserGroup /> },
        { path: '/reports', label: 'Reports', icon: <HiOutlineDocumentText /> },
        { path: '/alerts', label: 'Alerts', icon: <HiOutlineBell /> },
    ];

    const employeeLinks = [
        { path: '/employee', label: 'Dashboard', icon: <HiOutlineHome /> },
        { path: '/daily-progress', label: 'Daily Progress', icon: <HiOutlinePencilAlt /> },
        { path: '/projects', label: 'Projects', icon: <HiOutlineFolder /> },
        { path: '/reports', label: 'Reports', icon: <HiOutlineDocumentText /> },
        { path: '/alerts', label: 'Alerts', icon: <HiOutlineBell /> },
    ];

    const navItems = isManager ? managerLinks : employeeLinks;

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-icon">◈</span>
                    {!collapsed && <span className="sidebar-logo-text">RiskSense</span>}
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/manager' || item.path === '/employee'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        title={collapsed ? item.label : ''}
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button className="sidebar-toggle" onClick={onToggle}>
                    {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
                    {!collapsed && <span>Collapse</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
