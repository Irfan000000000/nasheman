import React, { lazy, Suspense, useEffect, useState } from 'react';
import '../Sidebar.css';
import authService from './services/authService';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SessionNavbar from './SessionNavbar';

const CreateAccount = lazy(() => import('./CreateAccount'));

const Sidebar = () => {
  const [dropdowns, setDropdowns] = useState({
    admission: false,
    attendance: false,
    exam: false,
    fee: false,
    hr: false,
    website: false,
    academics: false,
    finance: false,
    lms: false,
    auth: false,
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const { user } = useAuth();

  const openAccountModal = () => {
    setIsAccountModalOpen(true);
    setIsSidebarVisible(false); // close drawer on mobile so modal is visible
  };

  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  const toggleDropdown = (name) => {
    setDropdowns((prevState) => {
      const newState = {
        admission: false,
        attendance: false,
        exam: false,
        fee: false,
        hr: false,
        website: false,
        academics: false,
        finance: false,
        lms: false,
        auth: false,
      };
      newState[name] = !prevState[name];
      return newState;
    });
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((v) => !v);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  // Close drawer on resize back to desktop so state stays consistent
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 992 && isSidebarVisible) {
        setIsSidebarVisible(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isSidebarVisible]);

  // Lock body scroll while drawer is open on mobile
  useEffect(() => {
    if (isSidebarVisible && window.innerWidth <= 992) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarVisible]);

  const isStudent = user && user.user.user_type === 'Student';
  const isTeacher = user && user.user.user_type === 'Teacher';
  const hideSidebar = isStudent || isTeacher;

  return (
    <>
      {/* Mobile hamburger toggle — visible on tablet/phone */}
      {!hideSidebar && (
        <button
          type="button"
          className={`sidebar-toggle ${isSidebarVisible ? 'is-open' : ''}`}
          onClick={toggleSidebar}
          aria-label={isSidebarVisible ? 'Close menu' : 'Open menu'}
        >
          <i className={`fas ${isSidebarVisible ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      )}

      {/* Backdrop overlay (mobile only) */}
      {!hideSidebar && (
        <div
          className={`sidebar-backdrop ${isSidebarVisible ? 'is-visible' : ''}`}
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      <aside
        className={`sidebar ${isSidebarVisible ? 'show' : 'hide'} ${
          hideSidebar ? 'd-none' : ''
        }`}
      >
        <div className="sidebar-brand">
          <Link
            to="/"
            className="sidebar-brand__link"
            onClick={closeSidebar}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {user && user.user.user_type === 'Admin' && (
            <div className="sidebar-section">
              <div className="sidebar-item" onClick={() => toggleDropdown('admission')}>
                <i className="fas fa-graduation-cap"></i>
                <span className="sidebar-item__label">Student Information</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.admission ? 'open' : ''}`}></i>
              </div>
              {dropdowns.admission && (
                <div className="dropdown">
                  <Link to="/admission-form" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-user-plus"></i> Create Admission</Link>
                  <Link to="/promote-students" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-arrow-up"></i> Promote Students</Link>
                  <Link to="/admission-list" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-list"></i> Admission List</Link>
                  <Link to="/create-class" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-chalkboard"></i> Create Class</Link>
                  <Link to="/create-section" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-object-group"></i> Create Section</Link>
                  <Link to="/create-fee-group" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-money-bill"></i> Create Fee Group</Link>
                  <Link to="/select-categories" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-tags"></i> Create Categories</Link>
                  <Link to="/student-id-card-generate" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-id-card"></i> Student ID Card</Link>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={(e) => { e.preventDefault(); openAccountModal(); }}
                  ><i className="fas fa-user-shield"></i> Student Accounts</a>
                  <Link to="/create-house-and-club" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-home"></i> Create House/Club</Link>
                </div>
              )}

              <div className="sidebar-item" onClick={() => toggleDropdown('attendance')}>
                <i className="fas fa-chalkboard-teacher"></i>
                <span className="sidebar-item__label">Attendance</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.attendance ? 'open' : ''}`}></i>
              </div>
              {dropdowns.attendance && (
                <div className="dropdown">
                  <Link to="/student-attendance-list" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-user-check"></i> Student Attendance</Link>
                  <Link to="/attendance-list" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-users"></i> Employee Attendance</Link>
                  <Link to="/real-time-attendance-dashboard" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-users"></i> Biometric (DB)</Link>
                </div>
              )}

              <div className="sidebar-item" onClick={() => toggleDropdown('exam')}>
                <i className="fas fa-book"></i>
                <span className="sidebar-item__label">Exam</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.exam ? 'open' : ''}`}></i>
              </div>
              {dropdowns.exam && (
                <div className="dropdown">
                  <a href="#" className="dropdown-item"><i className="fas fa-plus-circle"></i> Create Exam</a>
                  <a href="#" className="dropdown-item"><i className="fas fa-marker"></i> Add Marks</a>
                  <a href="#" className="dropdown-item"><i className="fas fa-file-alt"></i> Exam Report</a>
                </div>
              )}

              <div className="sidebar-item" onClick={() => toggleDropdown('fee')}>
                <i className="fas fa-receipt"></i>
                <span className="sidebar-item__label">Fee</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.fee ? 'open' : ''}`}></i>
              </div>
              {dropdowns.fee && (
                <div className="dropdown">
                  <Link to="/bank-details-form" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-university"></i> Bank Detail</Link>
                  <Link to="/bank-notes" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-sticky-note"></i> Voucher Notes</Link>
                  <Link to="/heads" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-money-check-alt"></i> Fee Head</Link>
                  <Link to="/fee-head-details" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-info-circle"></i> Fee Head Details</Link>
                  <Link to="/fee-generate" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-file-invoice-dollar"></i> Fee Generate</Link>
                  <Link to="/fee-vouchers" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-ticket-alt"></i> Fee Vouchers</Link>
                  <Link to="/fee-post" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-upload"></i> Fee Post</Link>
                  <Link to="/fee-post-all" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-cloud-upload-alt"></i> Fee Post All</Link>
                  <Link to="/fee-reports" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-chart-bar"></i> Fee Reports</Link>
                </div>
              )}

              <div className="sidebar-item" onClick={() => toggleDropdown('hr')}>
                <i className="fas fa-users"></i>
                <span className="sidebar-item__label">HR</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.hr ? 'open' : ''}`}></i>
              </div>
              {dropdowns.hr && (
                <div className="dropdown">
                  <Link to="/employee-form" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-user-plus"></i> Add Employee</Link>
                  <Link to="/employee-list" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-users"></i> Employee List</Link>
                  <Link to="/employee-id-card-generate" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-id-card"></i> Employee ID Card</Link>
                  <Link to="/increments-pay-scale-wise" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-arrow-up"></i> Increments</Link>
                  <Link to="/overtime" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-clock"></i> Overtime</Link>
                  <Link to="/salary-of-employee" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-money-check"></i> Generate Salary</Link>
                  <Link to="/school-salary-list" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-list-alt"></i> Salary List</Link>
                  <Link to="/employee-discipline-form" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-user-shield"></i> Employee Discipline</Link>
                  <Link to="/salary-reports" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-chart-line"></i> Salary Report</Link>
                </div>
              )}

              <div className="sidebar-item" onClick={() => toggleDropdown('website')}>
                <i className="fas fa-globe"></i>
                <span className="sidebar-item__label">Website</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.website ? 'open' : ''}`}></i>
              </div>
              {dropdowns.website && (
                <div className="dropdown">
                  <Link to="/notification" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-bell"></i> Notification</Link>
                  <Link to="/event-photos-get" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-images"></i> Events Photo</Link>
                  <Link to="/apply-now-list" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-list"></i> Apply Now List</Link>
                </div>
              )}

              <div className="sidebar-item" onClick={() => toggleDropdown('academics')}>
                <i className="fas fa-pen"></i>
                <span className="sidebar-item__label">Academics</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.academics ? 'open' : ''}`}></i>
              </div>
              {dropdowns.academics && (
                <div className="dropdown">
                  <Link to="/create-subject" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-book-open"></i> Create Subject</Link>
                  <Link to="/assign-subjects" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-tasks"></i> Assign Subject</Link>
                  <Link to="/assign-subject-teacher" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-chalkboard-teacher"></i> Assign Subject Teacher</Link>
                  <Link to="/create-timetable" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-calendar-alt"></i> Create Time Table</Link>
                  <Link to="/student-activities" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-running"></i> Student Activities</Link>
                  <Link to="/student-discipline-form" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-user-shield"></i> Student Discipline</Link>
                </div>
              )}

              <div className="sidebar-item" onClick={() => toggleDropdown('finance')}>
                <i className="fas fa-balance-scale"></i>
                <span className="sidebar-item__label">Finance</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.finance ? 'open' : ''}`}></i>
              </div>
              {dropdowns.finance && (
                <div className="dropdown">
                  <Link to="/charts-of-account-head" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-sitemap"></i> COA (Head)</Link>
                  <Link to="/charts-of-account" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-stream"></i> Charts Of Account</Link>
                  <Link to="/create-voucher" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-file-invoice"></i> Create Voucher</Link>
                  <Link to="/finance-report" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-chart-pie"></i> Finance Report</Link>
                </div>
              )}
            </div>
          )}

          {user && user.user.user_type === 'Student' && (
            <div className="sidebar-section">
              <div className="sidebar-item" onClick={() => toggleDropdown('lms')}>
                <i className="fas fa-graduation-cap"></i>
                <span className="sidebar-item__label">LMS</span>
                <i className={`icon-arrow fas fa-chevron-right ${dropdowns.lms ? 'open' : ''}`}></i>
              </div>
              {dropdowns.lms && (
                <div className="dropdown">
                  <Link to="/student-profile" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-user"></i> Student Profile</Link>
                  <Link to="/promote-students" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-calendar-alt"></i> Time Table</Link>
                  <Link to="/admission-list" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-book"></i> Class Syllabus</Link>
                  <Link to="/create-class" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-ticket-alt"></i> Fee Vouchers</Link>
                  <Link to="/create-section" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-book-open"></i> Home Work</Link>
                </div>
              )}
            </div>
          )}

          <div className="sidebar-section">
            <div className="sidebar-item" onClick={() => toggleDropdown('auth')}>
              <i className="fas fa-lock"></i>
              <span className="sidebar-item__label">Auth</span>
              <i className={`icon-arrow fas fa-chevron-right ${dropdowns.auth ? 'open' : ''}`}></i>
            </div>
            {dropdowns.auth && (
              <div className="dropdown">
                <Link to="/add-campus-information" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-school"></i> Campus Information</Link>
                <Link to="/view-logs" className="dropdown-item" onClick={closeSidebar}><i className="fas fa-history"></i> Logs</Link>
                <a href="#" className="dropdown-item" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</a>
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-foot">
          <SessionNavbar />
        </div>
      </aside>

      {/* Create Student Account modal — opens from sidebar */}
      {isAccountModalOpen && (
        <>
          <div className="account-modal__backdrop" onClick={closeAccountModal}></div>
          <div className="account-modal">
            <div className="account-modal__header">
              <i className="fas fa-user-shield"></i>
              <span>Student Account</span>
              <button
                className="account-modal__close"
                onClick={closeAccountModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="account-modal__body">
              <Suspense fallback={<div className="account-modal__loading">Loading…</div>}>
                <CreateAccount />
              </Suspense>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
