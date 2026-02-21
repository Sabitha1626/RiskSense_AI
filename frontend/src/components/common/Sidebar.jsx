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
    HiOutlineViewBoards,
    HiOutlineLightBulb,
    HiOutlineChartBar,
    HiOutlineChatAlt2,
    HiOutlineCalendar,
    HiOutlineLink,
    HiOutlineCog,
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
        { path: '/kanban', label: 'Kanban Board', icon: <HiOutlineViewBoards /> },
        { path: '/risk-prediction', label: 'Risk Prediction', icon: <HiOutlineShieldCheck /> },
        { path: '/ai-insights', label: 'AI Insights', icon: <HiOutlineLightBulb /> },
        { path: '/employee-performance', label: 'Team Performance', icon: <HiOutlineUserGroup /> },
        { path: '/analytics', label: 'Analytics', icon: <HiOutlineChartBar /> },
        { path: '/reports', label: 'Reports', icon: <HiOutlineDocumentText /> },
        { path: '/alert-center', label: 'Alert Center', icon: <HiOutlineBell /> },
        { path: '/collaboration', label: 'Collaboration', icon: <HiOutlineChatAlt2 /> },
        { path: '/smart-planning', label: 'Smart Planning', icon: <HiOutlineCalendar /> },
        { path: '/jira-integration', label: 'Jira Integration', icon: <HiOutlineLink /> },
        { path: '/settings', label: 'Settings', icon: <HiOutlineCog /> },
    ];

    const employeeLinks = [
        { path: '/employee', label: 'Dashboard', icon: <HiOutlineHome /> },
        { path: '/daily-progress', label: 'Daily Progress', icon: <HiOutlinePencilAlt /> },
        { path: '/projects', label: 'Projects', icon: <HiOutlineFolder /> },
        { path: '/kanban', label: 'Kanban Board', icon: <HiOutlineViewBoards /> },
        { path: '/ai-insights', label: 'AI Insights', icon: <HiOutlineLightBulb /> },
        { path: '/analytics', label: 'Analytics', icon: <HiOutlineChartBar /> },
        { path: '/reports', label: 'Reports', icon: <HiOutlineDocumentText /> },
        { path: '/alert-center', label: 'Alert Center', icon: <HiOutlineBell /> },
        { path: '/collaboration', label: 'Collaboration', icon: <HiOutlineChatAlt2 /> },
        { path: '/settings', label: 'Settings', icon: <HiOutlineCog /> },
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
