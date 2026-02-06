import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckCircle2, BarChart3, Settings, Menu, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import useInstitute from '../hooks/useInstitute';
import './InstituteLayout.css';

export default function InstituteLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userFullName, setUserFullName] = useState('User');
  const [userRole, setUserRole] = useState('User');
  
  // Institute context management
  const { instituteId, instituteName, loading: instituteLoading, error: instituteError, clearInstitute } = useInstitute();

  useEffect(() => {
    // Redirect to access gateway if no institute context
    if (!instituteLoading && !instituteId) {
      navigate('/access');
    }
  }, [instituteId, instituteLoading, navigate]);

  useEffect(() => {
    // Get user info from localStorage
    const fullName = localStorage.getItem('nexora_full_name') || 'User';
    setUserFullName(fullName);
    setUserRole('Admin');
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'students', label: 'Students', icon: Users, path: '/students' },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2, path: '/attendance' },
    { id: 'results', label: 'Results', icon: BarChart3, path: '/results' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // Get active item from current location pathname
  const activeItem = navigationItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  const handleNavClick = (item) => {
    navigate(item.path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearInstitute(); // Clear institute context
      localStorage.removeItem('nexora_institution_name');
      localStorage.removeItem('nexora_full_name');
      localStorage.removeItem('nexora_email');
      navigate('/platform');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user initials
  const initials = userFullName 
    ? userFullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  // Show loading state
  if (instituteLoading) {
    return (
      <div className="institute-layout" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
        <div>Loading institute context...</div>
      </div>
    );
  }

  // Show error state (shouldn't happen due to redirect, but good fallback)
  if (instituteError && !instituteId) {
    return (
      <div className="institute-layout" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
        <div>Institute context required. Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="institute-layout">
      {/* Top Header with context awareness */}
      <header className="institute-header">
        <div className="header-left">
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
          <div className="institute-brand">
            <span className="brand-logo">NEXORA</span>
          </div>
          <div className="brand-separator">
            <span>|</span>
          </div>
          <div className="institute-name">
            <span className="institute-name-text">{instituteName || 'Institute'}</span>
            {instituteId && <span className="institute-id-subtitle" style={{fontSize: '0.75rem', opacity: 0.7, marginLeft: '0.5rem'}}>ID: {instituteId}</span>}
          </div>
        </div>

        <div className="header-right">
          <div className="header-context">
            <span className="context-label">Active User</span>
            <span className="context-value">{userRole}</span>
          </div>
          <button className="user-menu-trigger" onClick={handleLogout} title="Logout">
            <span className="user-avatar">{initials}</span>
            <span className="user-name">{userFullName.split(' ')[0]}</span>
            <LogOut size={16} strokeWidth={1.5} className="dropdown-arrow" style={{cursor: 'pointer'}} />
          </button>
        </div>
      </header>

      {/* Sidebar Navigation with active state feedback */}
      <aside className={`institute-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nx-nav-link ${activeItem === item.id ? 'nx-nav-link-active' : ''}`}
                onClick={() => handleNavClick(item)}
                title={item.label}
              >
                <IconComponent size={18} strokeWidth={1.5} className="nav-icon" />
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} strokeWidth={1.5} /> : <ChevronLeft size={18} strokeWidth={1.5} />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={`institute-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {children}
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
