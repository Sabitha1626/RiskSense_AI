import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../alerts/NotificationBell';
import './Navbar.css';

const Navbar = ({ sidebarCollapsed }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={`navbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div className="navbar-left">
                <div className="navbar-brand">
                    <span className="brand-icon">◈</span>
                    <span className="brand-text">RiskSense AI</span>
                </div>
            </div>

            <div className="navbar-right">
                <NotificationBell />

                <div className="navbar-user" ref={menuRef}>
                    <button className="user-btn" onClick={() => setShowMenu(!showMenu)}>
                        <div className="user-avatar">
                            <HiOutlineUser />
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name || 'User'}</span>
                            <span className={`badge badge-role ${user?.role === 'manager' ? 'badge-info' : 'badge-success'}`}>
                                {user?.role || 'Role'}
                            </span>
                        </div>
                    </button>

                    {showMenu && (
                        <div className="user-dropdown animate-fadeIn">
                            <div className="dropdown-header">
                                <span className="dropdown-name">{user?.name}</span>
                                <span className="dropdown-email">{user?.email}</span>
                            </div>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item" onClick={handleLogout}>
                                <HiOutlineLogout />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
