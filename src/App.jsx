import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccessGateway from './pages/AccessGateway';
import PlatformGateway from './pages/PlatformGateway';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import DesignSystemDemo from './pages/DesignSystemDemo';
import InteractiveDashboard from './pages/InteractiveDashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Settings from './pages/Settings';
import InstituteLayout from './layouts/InstituteLayout';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App Component
 * 
 * Main React application entry point.
 * Routes:
 * - /access - Institutional Gateway (verify institute ID)
 * - /platform - Institutional Platform Gateway (login page)
 * - /demo-design - Design System Demo (visual showcase)
 * - /dashboard - Interactive Institute Dashboard (post-login)
 * - /students - Student Management (post-login)
 * - /attendance - Attendance Management (post-login)
 * - /results - Results Management (post-login)
 * - /settings - System Settings (post-login)
 * - / - Redirects to /platform
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/access" element={<AccessGateway />} />
          <Route path="/platform" element={<PlatformGateway />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/demo-design" element={<DesignSystemDemo />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <InstituteLayout>
                  <div className="nx-container-fluid">
                    <InteractiveDashboard />
                  </div>
                </InstituteLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <InstituteLayout>
                  <div className="nx-container-fluid">
                    <Students />
                  </div>
                </InstituteLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <InstituteLayout>
                  <div className="nx-container-fluid">
                    <Attendance />
                  </div>
                </InstituteLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <InstituteLayout>
                  <div className="nx-container-fluid">
                    <Results />
                  </div>
                </InstituteLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <InstituteLayout>
                  <div className="nx-container-fluid">
                    <Settings />
                  </div>
                </InstituteLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/platform" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
