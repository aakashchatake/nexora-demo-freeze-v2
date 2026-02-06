import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courses';
import { getAttendanceForCourse, getAttendanceSummary } from '../data/attendance';
import { getResultsForCourse } from '../data/results';
import { useAuth } from '../hooks/useAuth';
import useInstitute from '../hooks/useInstitute';
import './InteractiveDashboard.css';

export default function InteractiveDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { instituteId, instituteName, institutionType } = useInstitute();
  
  // State management for interactions
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);
  const [activeTab, setActiveTab] = useState('attendance');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRow, setSelectedRow] = useState(null);

  // Derived data
  const course = courses.find(c => c.id === selectedCourse);
  const attendanceData = getAttendanceForCourse(selectedCourse);
  const attendanceSummary = getAttendanceSummary(selectedCourse);
  const resultsData = getResultsForCourse(selectedCourse);

  // Filter attendance by status
  const filteredAttendance = statusFilter === 'all'
    ? attendanceData
    : attendanceData.filter(record => record.status === statusFilter);

  // Get badge for attendance status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return 'nx-badge nx-badge-success';
      case 'late':
        return 'nx-badge nx-badge-warning';
      case 'absent':
        return 'nx-badge nx-badge-error';
      default:
        return 'nx-badge nx-badge-neutral';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get badge for result status
  const getResultBadge = (status) => {
    switch (status) {
      case 'pass':
        return 'nx-badge nx-badge-success';
      case 'review':
        return 'nx-badge nx-badge-warning';
      default:
        return 'nx-badge nx-badge-neutral';
    }
  };

  // Quick action handlers
  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className="interactive-dashboard">
      {/* Premium Hero Section */}
      <div className="dashboard-hero nx-mb-lg">
        <div className="hero-title-section">
          <h1 className="hero-institute-name" style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: '#1e293b',
            letterSpacing: '-0.02em'
          }}>
            {instituteName || 'Institute Dashboard'}
          </h1>
          <p className="hero-subtitle" style={{
            fontSize: '1.25rem',
            color: '#64748b',
            fontWeight: '500',
            marginBottom: '0.75rem'
          }}>
            Academic Command Center
          </p>
          <div className="hero-meta" style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {instituteId && <span>Institute ID: <strong>{instituteId}</strong></span>}
            <span>•</span>
            <span>Role: <strong>Administrator</strong></span>
            <span>•</span>
            <span>Academic Year: <strong>2025–26</strong></span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="hero-quick-actions" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => handleQuickAction('/students')}
            className="quick-action-btn"
            style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            + Add Student
          </button>
          <button
            onClick={() => handleQuickAction('/attendance')}
            className="quick-action-btn"
            style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            ✓ Mark Attendance
          </button>
          <button
            onClick={() => handleQuickAction('/results')}
            className="quick-action-btn"
            style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📊 Publish Results
          </button>
        </div>
      </div>

      {/* Course Selection - Immediately changes all data */}
      <div className="nx-card nx-card-body nx-mb-lg">
        <label className="nx-block nx-weight-semibold nx-mb-sm">Select Course</label>
        <select
          className="nx-input"
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setSelectedRow(null);
            setStatusFilter('all');
            setActiveTab('attendance');
          }}
        >
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Stats Cards - Update on course/filter change */}
      <div className="nx-grid nx-grid-4 nx-mb-lg">
        <div className="nx-stat-card">
          <div className="nx-stat-label">Enrolled Students</div>
          <div className="nx-stat-value">{course?.enrolledStudents}</div>
          <div className="nx-stat-description">Active enrollment</div>
        </div>

        <div className="nx-stat-card">
          <div className="nx-stat-label">Today's Present</div>
          <div className="nx-stat-value" style={{ color: 'var(--nx-accent)' }}>
            {attendanceSummary.present}
          </div>
          <div className="nx-stat-description">
            {attendanceSummary.total} total marked
          </div>
        </div>

        <div className="nx-stat-card">
          <div className="nx-stat-label">Late Arrivals</div>
          <div className="nx-stat-value" style={{ color: 'var(--nx-warning)' }}>
            {attendanceSummary.late}
          </div>
          <div className="nx-stat-description">Requires follow-up</div>
        </div>

        <div className="nx-stat-card">
          <div className="nx-stat-label">Attendance Rate</div>
          <div
            className="nx-stat-value"
            style={{
              color: attendanceSummary.percentage >= 85 ? 'var(--nx-accent)' : 'var(--nx-warning)',
            }}
          >
            {attendanceSummary.percentage}%
          </div>
          <div className="nx-stat-description">
            {attendanceSummary.percentage >= 85 ? 'Excellent' : 'Needs attention'}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Switches content with visible feedback */}
      <div className="nx-card nx-mb-lg">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('attendance');
              setSelectedRow(null);
            }}
          >
            Attendance
          </button>
          <button
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('results');
              setSelectedRow(null);
            }}
          >
            Assessment Results
          </button>
        </div>

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="tab-content">
            {/* Filter Controls - Changes table immediately */}
            <div className="nx-card-body filter-section">
              <div className="nx-flex nx-gap-md" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <label className="nx-text-sm nx-weight-semibold">Filter by Status</label>
                  <div className="nx-flex nx-gap-xs" style={{ marginTop: 'var(--nx-space-xs)' }}>
                    {['all', 'present', 'late', 'absent'].map(status => (
                      <button
                        key={status}
                        className={`filter-badge ${statusFilter === status ? 'active' : ''}`}
                        onClick={() => {
                          setStatusFilter(status);
                          setSelectedRow(null);
                        }}
                      >
                        {status === 'all' ? 'All' : getStatusLabel(status)}
                        {status === 'all' && ` (${attendanceData.length})`}
                        {status === 'present' && ` (${attendanceData.filter(r => r.status === 'present').length})`}
                        {status === 'late' && ` (${attendanceData.filter(r => r.status === 'late').length})`}
                        {status === 'absent' && ` (${attendanceData.filter(r => r.status === 'absent').length})`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Table - Row selection updates context */}
            <div className="nx-card-body" style={{ overflow: 'auto' }}>
              {filteredAttendance.length > 0 ? (
                <table className="nx-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((record) => (
                      <tr
                        key={record.id}
                        className={`attendance-row ${selectedRow === record.id ? 'selected' : ''}`}
                        onClick={() => setSelectedRow(record.id)}
                      >
                        <td className="student-name">{record.studentName}</td>
                        <td>
                          <span className={getStatusBadge(record.status)}>
                            {getStatusLabel(record.status)}
                          </span>
                        </td>
                        <td>{record.timeIn || '—'}</td>
                        <td className="nx-text-sm nx-text-muted">{record.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p className="nx-text-muted">No attendance records match this filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="tab-content">
            <div className="nx-card-body" style={{ overflow: 'auto' }}>
              {resultsData.length > 0 ? (
                <table className="nx-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Assessment</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsData.map((record) => (
                      <tr
                        key={record.id}
                        className={`result-row ${selectedRow === record.id ? 'selected' : ''}`}
                        onClick={() => setSelectedRow(record.id)}
                      >
                        <td className="student-name">{record.studentName}</td>
                        <td className="nx-text-sm">{record.assessmentType}</td>
                        <td>
                          <span className="nx-weight-semibold">
                            {record.score}/{record.maxScore}
                          </span>
                        </td>
                        <td>
                          <span
                            className="nx-weight-semibold"
                            style={{
                              color:
                                record.grade.startsWith('A') ? 'var(--nx-accent)' :
                                record.grade.startsWith('B') ? 'var(--nx-primary)' :
                                record.grade.startsWith('C') ? 'var(--nx-warning)' :
                                'var(--nx-error)',
                            }}
                          >
                            {record.grade}
                          </span>
                        </td>
                        <td>
                          <span className={getResultBadge(record.status)}>
                            {record.status === 'pass' ? 'Pass' : 'Review'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <p className="nx-text-muted">No assessment records available.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Context Panel - Shows when row is selected */}
      {selectedRow && (
        <div className="nx-card nx-card-body context-panel">
          <h3 className="nx-mb-md">Selected Record Details</h3>
          <div className="nx-grid nx-grid-2 nx-gap-md">
            <div>
              <p className="nx-text-muted nx-text-sm">Student</p>
              <p className="nx-weight-semibold">
                {activeTab === 'attendance'
                  ? filteredAttendance.find(r => r.id === selectedRow)?.studentName
                  : resultsData.find(r => r.id === selectedRow)?.studentName}
              </p>
            </div>
            <div>
              <p className="nx-text-muted nx-text-sm">Record ID</p>
              <p className="nx-weight-semibold">{selectedRow}</p>
            </div>
            {activeTab === 'attendance' && (
              <>
                <div>
                  <p className="nx-text-muted nx-text-sm">Status</p>
                  <p className="nx-weight-semibold">
                    <span className={getStatusBadge(filteredAttendance.find(r => r.id === selectedRow)?.status)}>
                      {getStatusLabel(filteredAttendance.find(r => r.id === selectedRow)?.status)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="nx-text-muted nx-text-sm">Time</p>
                  <p className="nx-weight-semibold">
                    {filteredAttendance.find(r => r.id === selectedRow)?.timeIn || 'Not recorded'}
                  </p>
                </div>
              </>
            )}
            {activeTab === 'results' && (
              <>
                <div>
                  <p className="nx-text-muted nx-text-sm">Assessment</p>
                  <p className="nx-weight-semibold">
                    {resultsData.find(r => r.id === selectedRow)?.assessmentType}
                  </p>
                </div>
                <div>
                  <p className="nx-text-muted nx-text-sm">Score</p>
                  <p className="nx-weight-semibold">
                    {resultsData.find(r => r.id === selectedRow)?.grade}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            className="nx-btn nx-btn-secondary nx-btn-sm nx-mt-md"
            onClick={() => setSelectedRow(null)}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
