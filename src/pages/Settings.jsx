import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useInstitute from '../hooks/useInstitute';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

export default function Settings() {
  const { user } = useAuth();
  const { instituteId, instituteName, institutionType } = useInstitute();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailOnAttendance, setEmailOnAttendance] = useState(true);
  const [emailOnResults, setEmailOnResults] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/platform');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-header nx-mb-lg">
        <h1>Settings</h1>
        <p className="nx-text-muted">Manage system preferences and notifications</p>
      </div>

      <div className="settings-container">
        {/* Notification Settings */}
        <div className="nx-card nx-mb-lg">
          <div className="nx-card-header">
            <h3>Notifications</h3>
          </div>
          <div className="nx-card-body">
            <div className="setting-row">
              <div>
                <p className="setting-title">Enable Notifications</p>
                <p className="setting-description">Receive system alerts and updates</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="toggle-switch"
              />
            </div>

            {notificationsEnabled && (
              <>
                <div className="setting-row">
                  <div>
                    <p className="setting-title">Email on Attendance Changes</p>
                    <p className="setting-description">Get notified when attendance records are updated</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailOnAttendance}
                    onChange={(e) => setEmailOnAttendance(e.target.checked)}
                    className="toggle-switch"
                  />
                </div>

                <div className="setting-row">
                  <div>
                    <p className="setting-title">Email on Results Published</p>
                    <p className="setting-description">Get notified when new grades are posted</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailOnResults}
                    onChange={(e) => setEmailOnResults(e.target.checked)}
                    className="toggle-switch"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Display Settings */}
        <div className="nx-card nx-mb-lg">
          <div className="nx-card-header">
            <h3>Display</h3>
          </div>
          <div className="nx-card-body">
            <div className="setting-field">
              <label className="setting-label">
                <span className="setting-title">Theme</span>
                <select
                  className="nx-input"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </label>
            </div>

            <div className="setting-field">
              <label className="setting-label">
                <span className="setting-title">Language</span>
                <select
                  className="nx-input"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="nx-card nx-mb-lg">
          <div className="nx-card-header">
            <h3>Account</h3>
          </div>
          <div className="nx-card-body">
            <div className="setting-row">
              <div>
                <p className="setting-title">Institution Name</p>
                <p className="setting-value">{instituteName || 'Not specified'}</p>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <p className="setting-title">Institution ID</p>
                <p className="setting-value" style={{fontFamily: 'monospace', fontWeight: '600'}}>{instituteId || 'Not specified'}</p>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <p className="setting-title">Institution Type</p>
                <p className="setting-value">{institutionType || 'Not specified'}</p>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <p className="setting-title">Account Email</p>
                <p className="setting-value">{user?.email || 'Not specified'}</p>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <p className="setting-title">Account Status</p>
                <span className="nx-badge nx-badge-success">Active</span>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <p className="setting-title">Role</p>
                <p className="setting-value">Administrator</p>
              </div>
            </div>

            <div className="setting-row" style={{ borderTop: '1px solid var(--nx-border-light)', paddingTop: 'var(--nx-space-lg)', marginTop: 'var(--nx-space-lg)' }}>
              <button className="nx-btn nx-btn-secondary">Change Password</button>
              <button className="nx-btn nx-btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>

        {/* Institution Governance */}
        <div className="nx-card nx-mb-lg">
          <div className="nx-card-header">
            <h3>Institution Governance</h3>
          </div>
          <div className="nx-card-body">
            <div className="governance-info">
              <p className="nx-mb-md" style={{lineHeight: '1.6'}}>
                Certain institutional details are governed by Nexora for audit, compliance, and billing integrity. 
                Changes to institutional name, ID, or type require administrative approval through our support team.
              </p>
              
              <a
                href={`mailto:nexora@chatakeinnoworks.com?subject=${encodeURIComponent(`Institution Detail Change Request - ${instituteId || 'N/A'}`)}&body=${encodeURIComponent(`Institution ID: ${instituteId || 'N/A'}\nInstitution Name: ${instituteName || 'N/A'}\nRequester Email: ${user?.email || 'N/A'}\n\nChange Request Details:\n[Please describe the changes you need]\n`)}`}
                className="nx-btn nx-btn-secondary"
                style={{display: 'inline-block'}}
              >
                Request Institutional Change
              </a>

              <p className="nx-text-muted nx-text-sm nx-mt-md">
                For urgent issues or escalation, contact{' '}
                <a href="mailto:admin@chatakeinnoworks.com" className="support-link">
                  admin@chatakeinnoworks.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="nx-card nx-mb-lg">
          <div className="nx-card-header">
            <h3>Support & Contact</h3>
          </div>
          <div className="nx-card-body">
            <div className="support-info">
              <p className="setting-title">Need help or want to update critical information?</p>
              <p className="nx-text-muted nx-text-sm nx-mb-md">Our support team is here to assist you with account changes, technical issues, and billing inquiries.</p>
              
              <div className="support-contacts nx-mb-md">
                <div className="support-item">
                  <p className="nx-text-sm"><strong>NEXORA Support</strong></p>
                  <a href="mailto:nexora@chatakeinnoworks.com" className="support-link">nexora@chatakeinnoworks.com</a>
                </div>
                <div className="support-item">
                  <p className="nx-text-sm"><strong>General Inquiries</strong></p>
                  <a href="mailto:admin@chatakeinnoworks.com" className="support-link">admin@chatakeinnoworks.com</a>
                </div>
              </div>

              <p className="nx-text-muted nx-text-sm">
                <strong>Note:</strong> Changes to institution name, ID, or type require verification and must be requested through support.
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="nx-card nx-mb-lg">
          <div className="nx-card-header">
            <h3>About</h3>
          </div>
          <div className="nx-card-body">
            <div className="about-info">
              <p><strong>NEXORA Platform v1.0</strong></p>
              <p className="nx-text-muted nx-text-sm">Enterprise Academic Management System</p>
              <p className="nx-text-muted nx-text-sm">Developed by Chatake Innoworks</p>
              <p className="nx-text-muted nx-text-sm">© 2026 Chatake Innoworks. All rights reserved.</p>
              <div className="nx-mt-md">
                <a href="https://nexora-be4467.webflow.io/" target="_blank" rel="noopener noreferrer" className="support-link">
                  Visit NEXORA Website
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button className="nx-btn nx-btn-primary" onClick={handleSave}>
            Save Settings
          </button>
          <button className="nx-btn nx-btn-secondary">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
