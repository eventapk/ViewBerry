// src/components/common/Header.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../Pages/Admin/SidebarContext';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <aside style={{ ...styles.sidebar, width: isCollapsed ? '80px' : '250px' }}>
      {/* Toggle Button */}
      <div style={styles.toggleBtnContainer}>
        <button onClick={toggleSidebar} style={styles.toggleBtn}>
          {isCollapsed ? '☰' : '✖'}
        </button>
      </div>

      {/* Logo */}
      <div style={styles.logo}>
        {!isCollapsed && <h2 style={styles.logoText}>Your App</h2>}
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/dashboard" style={styles.link}>
              {isCollapsed ? '🏠' : '🏠 Dashboard'}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/table" style={styles.link}>
              {isCollapsed ? '👥' : '👥 Users'}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/adminpanel" style={styles.link}>
              {isCollapsed ? '🛠️' : '🛠️ Admin Panel'}
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/settings" style={styles.link}>
              {isCollapsed ? '⚙️' : '⚙️ Settings'}
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Info + Logout */}
      <div style={styles.userSection}>
        {!isCollapsed && <span style={styles.userEmail}>Welcome, {user.email}</span>}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          {isCollapsed ? '🚪' : 'Logout'}
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    height: '94vh',
    background: '#1e1e2f',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'fixed',
    left: 0,
    top: 0,
    padding: '1rem 0.5rem',
    zIndex: 1000,
    transition: 'width 0.3s ease',
  },
  toggleBtnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '0.5rem',
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.4rem',
    color: '#fff',
    cursor: 'pointer',
  },
  logo: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  nav: {
    flexGrow: 1,
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '0.6rem',
    borderRadius: '6px',
    display: 'block',
    transition: 'background 0.2s ease',
  },
  userSection: {
    borderTop: '1px solid #444',
    paddingTop: '1rem',
    textAlign: 'center',
  },
  userEmail: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    color: '#ccc',
  },
  logoutBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '80%',
  },
};

export default Header;
