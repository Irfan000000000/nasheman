

import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './components/AuthContext'; // Import AuthProvider and useAuth
import { SessionsProvider } from './components/SessionContext';
import { AcademicSessionProvider } from './components/AcademicSessionContext';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import Login from './components/Login';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from './components/Sidebar'; // Import Sidebar here
import SessionNavbar from './components/SessionNavbar'; // Import SessionNavbar here
import FeeHeadDetails from './components/FeeHeadDetails';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import axios from 'axios';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { ROLES } from './constants/roles';
import ScrollToTopButton from "./components/ScrollToTopButton";


const AddCampusInformation = lazy(() => import('./components/AddCampusInformation'));
const EmployeeDisciplineForm = lazy(() => import('./components/EmployeeDisciplineForm'));
const StudentDisciplineForm = lazy(() => import('./components/StudentDisciplineForm'));
const StudentProfile = lazy(() => import('./components/StudentProfile'));
const TeacherProfile = lazy(() => import('./components/TeacherProfile'));
const Home = lazy(() => import('./Home'));
const Invoice = lazy(() => import('./components/Invoice'));
const Stock = lazy(() => import('./components/Stock'));
const BarcodeGenerator = lazy(() => import('./components/BarcodeGenerator'));
const ScanBarcode = lazy(() => import('./components/ScanBarcode'));
const Expense = lazy(() => import('./components/Expense'));
const ExpenseHead = lazy(() => import('./components/ExpenseHead'));
const SaleReport = lazy(() => import('./components/SaleReport'));
const Category = lazy(() => import('./components/Category'));
const Employee = lazy(() => import('./components/Employee'));
const Attendance = lazy(() => import('./components/Attendance'));
const EventPhotos = lazy(() => import('./components/EventPhotos'));
const StudentVouchersTest = lazy(() => import('./components/StudentVouchersTest'));

const ApplyNow = lazy(() => import('./components/ApplyNow'));

const RealTimeAttendanceDashboard = lazy(() => import('./components/RealTimeAttendanceDashboard'));

const StudentAttendanceList = lazy(() => import('./components/StudentAttendanceList'));

const Salary = lazy(() => import('./components/Salary'));
const CreateSalary = lazy(() => import('./components/CreateSalary'));
const Dashboards = lazy(() => import('./components/Dashboards'));
const AdmissionForm = lazy(() => import('./components/AdmissionForm'));
const AdmissionList = lazy(() => import('./components/AdmissionList'));
const BanksDetail = lazy(() => import('./components/BanksDetail'));
const Heads = lazy(() => import('./components/Heads'));
const FeeGenerate = lazy(() => import('./components/FeeGenerate'));
const SingleFeeGenerate = lazy(() => import('./components/SingleFeeGenerate'));
const EditFeeVoucher = lazy(() => import('./components/EditFeeVoucher'));
const FeeVouchers = lazy(() => import('./components/FeeVouchers'));
const ViewVoucher = lazy(() => import('./components/ViewVoucher'));
const BankNotes = lazy(() => import('./components/BankNotes'));
const CreateClass = lazy(() => import('./components/CreateClass'));
const CreateHouseAndClub = lazy(() => import('./components/CreateHouseAndClub'));
const SelectCategories = lazy(() => import('./components/SelectCategories'));
const Notification = lazy(() => import('./components/Notification'));



const CreateSection = lazy(() => import('./components/CreateSection'));
const CreateSubject = lazy(() => import('./components/CreateSubject'));
const CreateFeeGroups = lazy(() => import('./components/CreateFeeGroups'));
const FeePost = lazy(() => import('./components/FeePost'));
const FeePostAll = lazy(() => import('./components/FeePostAll'));
const PromoteStudent = lazy(() => import('./components/PromoteStudent'));
const ViewLogs = lazy(() => import('./components/ViewLogs'));

// const EventModal = lazy(() => import('./components/EventModal'));

const Calendar = lazy(() => import('./components/Calendar'));


// const Test = lazy(() => import('./components/Test'));

const SalaryOfEmployee = lazy(() => import('./components/SalaryOfEmployee'));
const SchoolSalaryList = lazy(() => import('./components/SchoolSalaryList'));

const ViewSalarySlips = lazy(() => import('./components/ViewSalarySlips'));

const SalaryList = lazy(() => import('./components/SalaryList'));


const Overtime = lazy(() => import('./components/Overtime'));


const EmployeeForm = lazy(() => import('./components/EmployeeForm'));

const EmployeeList = lazy(() => import('./components/EmployeeList'));

const FeeReports = lazy(() => import('./components/FeeReports'));

const SalaryReports = lazy(() => import('./components/SalaryReports'));

const FeeFine = lazy(() => import('./components/FeeFine'));

const PayScaleWiseBasicSalary = lazy(() => import('./components/PayScaleWiseBasicSalary'));

const IncrementsPayScaleWise = lazy(() => import('./components/IncrementsPayScaleWise'));


const StudentIdCardGenerate = lazy(() => import('./components/StudentIdCardGenerate'));

const EmployeeIdCardGenerate = lazy(() => import('./components/EmployeeIdCardGenerate'));


const ChartsOfAccount = lazy(() => import('./components/ChartsOfAccount'));
const ChartsOfAccountHead = lazy(() => import('./components/ChartsOfAccountHead'));

const CreateVoucher = lazy(() => import('./components/CreateVoucher'));
const FinanceReport = lazy(() => import('./components/FinanceReport'));


const AssignSubjects = lazy(() => import('./components/AssignSubjects'));

const AssignSubjectTeacher = lazy(() => import('./components/AssignSubjectTeacher'));

const CreateTimeTable = lazy(() => import('./components/CreateTimeTable'));

const CreateAccount = lazy(() => import('./components/CreateAccount'));


const CreateTeacherAccount = lazy(() => import('./components/CreateTeacherAccount'));


const StudentActivities = lazy(() => import('./components/StudentActivities'));

// ........dont delete it.............
// NProgress.configure({ showSpinner: false });
// // Axios interceptors to use nprogress
// axios.interceptors.request.use(config => {
//   NProgress.start();
//   return config;
// }, error => {
//   NProgress.done();
//   return Promise.reject(error);
// });

// axios.interceptors.response.use(response => {
//   NProgress.done();
//   return response;
// }, error => {
//   NProgress.done();
//   return Promise.reject(error);
// });



NProgress.configure({
  showSpinner: false, // Hide the spinner
});


// Disable buttons
function disableButtons() {
  const buttons = document.querySelectorAll('input[type="button"], button, input[type="submit"]');
  buttons.forEach(button => button.disabled = true);
}

// Enable buttons
function enableButtons() {
  const buttons = document.querySelectorAll('input[type="button"], button, input[type="submit"]');
  buttons.forEach(button => button.disabled = false);
}

// Axios interceptors to use nprogress and disable/enable buttons
axios.interceptors.request.use(config => {
  NProgress.start();
  disableButtons(); // Disable buttons when request starts
  // toast.loading('Processing...');
  return config;
}, error => {
  NProgress.done();
  enableButtons(); // Enable buttons if there was an error
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  NProgress.done();
  enableButtons(); // Enable buttons after request completes
  // toast.dismiss();
  return response;
}, error => {
  NProgress.done();
  enableButtons(); // Enable buttons if there was an error
  return Promise.reject(error);
});











function App() {

  // const node_api_base_url = process.env.REACT_APP_API_BASE_URL;
  return (
    <AuthProvider>
      <ToastContainer
       position="top-right"
       autoClose={2000}  // Closes in 2 seconds globally
       hideProgressBar={false} 
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss={false}
      //  draggable
       pauseOnHover={false} // Prevents toast from staying longer if hovered
       theme="light"
      />
      <AcademicSessionProvider>
        <SessionsProvider>
          <BrowserRouter>
            <AppContent />
              <ScrollToTopButton  />
          </BrowserRouter>
        </SessionsProvider>
      </AcademicSessionProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {

    console.log(location.pathname);
    if (location.pathname !== "/" && location.pathname != "/login") {
      NProgress.start();
      console.log("start");

      const timeoutId = setTimeout(() => {
        NProgress.done(); // Ensure NProgress finishes after route change
        console.log("done (timeout)");
      }, 300); // Adjust the delay as needed (500ms is a reasonable default)

      return () => {
        NProgress.done();
        console.log("done");
      };
    }

  }, [location.pathname]);

  const isStudentOrTeacher =
    user && (user.user.user_type === "Student" || user.user.user_type === "Teacher");

  return (
    <div className={`app-shell ${user ? "is-authenticated" : "is-guest"}`}>
      {user && <Sidebar />} {/* Render Sidebar only if user is authenticated */}

      {/* Render SessionNavbar only if user is authenticated */}
      <div className="app-layout">

        <div className={`app-side-routes ${user ? "is-collapsed" : ""}`}>
          <Routes>
            <Route path="/register-sses-user" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <div
          className={`app-main ${user ? "has-sidebar-offset" : ""} ${
            isStudentOrTeacher ? "app-main--full" : ""
          }`}
        >
          <Suspense fallback={<div className="app-suspense-fallback">Loading...</div>}>
            <Routes>
              {/* <Route
    path="/"
    element={
      user ? (
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Dashboards />
          </RoleProtectedRoute>
        </ProtectedRoute>
      ) : (
        <Navigate to="/login" replace />
      )
    }
  /> */}

              <Route
                path="/"
                element={
                  user ? (
                    <ProtectedRoute>
                      { (user &&  user.user.user_type) === "Admin" ? (
                        <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                          <Dashboards />
                        </RoleProtectedRoute>
                      ) : (user &&  user.user.user_type) === "Student" ? (
                        <RoleProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                          <StudentProfile />
                        </RoleProtectedRoute>
                      ) : (user &&  user.user.user_type) === "Teacher" ? (
                        <RoleProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                          <TeacherProfile />
                        </RoleProtectedRoute>
                      ) : (
                        <Navigate to="/login" replace />
                      )}
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />



               <Route path="/student-vouchers" element={<StudentVouchersTest />} />


              <Route
                path="/admission-form"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdmissionForm />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/admission-form-edit"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdmissionForm />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/pay-scale-wise-basic-salary"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <PayScaleWiseBasicSalary />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/attendance-list"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Attendance />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


              <Route
                path="/notification"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Notification />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


                <Route
                path="/event-photos-get"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <EventPhotos />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


               <Route
                path="/apply-now-list"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ApplyNow />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


              <Route
                path="/student-attendance-list"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <StudentAttendanceList />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/overtime"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Overtime />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/school-salary-list"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <SchoolSalaryList />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/view-salary-slips"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ViewSalarySlips />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/employee-salary"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <IncrementsPayScaleWise />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salary-of-employee"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <SalaryOfEmployee />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salary-list"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <SalaryList />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/increments-pay-scale-wise"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <IncrementsPayScaleWise />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/employee-form/:form?"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <EmployeeForm />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/employee-list"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <EmployeeList />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/promote-students"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <PromoteStudent />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/fee-fine"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FeeFine />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

               <Route
                path="/real-time-attendance-dashboard"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <RealTimeAttendanceDashboard />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/create-class"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateClass />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


               <Route
                path="/create-house-and-club"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateHouseAndClub />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/create-section"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateSection />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


               <Route
                path="/add-campus-information"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AddCampusInformation />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


               <Route
                path="/view-logs"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ViewLogs/>
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/student-accounts"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateAccount />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />



              <Route
                path="/events"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Calendar />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


               <Route
                path="/teacher-account"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateTeacherAccount />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


              <Route
                path="/create-subject"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateSubject />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/assign-subjects"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AssignSubjects />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


              <Route
                path="/assign-subject-teacher"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AssignSubjectTeacher />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/create-timetable"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateTimeTable />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/create-fee-group"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateFeeGroups />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/select-categories"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <SelectCategories />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/admission-list"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdmissionList />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/student-id-card-generate"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <StudentIdCardGenerate />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/employee-id-card-generate"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <EmployeeIdCardGenerate />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/item-form"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Home />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/bank-details-form"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <BanksDetail />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/heads"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Heads />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/fee-head-details"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FeeHeadDetails />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/fee-generate"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FeeGenerate />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/single-fee-generate"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <SingleFeeGenerate />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/edit-fee-voucher"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <EditFeeVoucher />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/fee-vouchers"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FeeVouchers />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


               <Route
                path="/student-activities"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <StudentActivities />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

               <Route
                path="/student-discipline-form"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <StudentDisciplineForm />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />


               <Route
                path="/employee-discipline-form"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <EmployeeDisciplineForm />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />



              <Route
                path="/fee-post"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FeePost />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/fee-post-all"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FeePostAll />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/view-vouchers"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ViewVoucher />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/bank-notes"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <BankNotes />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/fee-reports"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FeeReports />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salary-reports"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <SalaryReports />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/category-form"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Category />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/invoice"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Invoice />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/stock"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Stock />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/barcode"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <BarcodeGenerator />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/scan-barcode"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ScanBarcode />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/add-expense"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Expense />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/expense-head"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ExpenseHead />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/sale-report"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <SaleReport />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/add-employee"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Employee />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/attendance"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Attendance />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salary"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Salary />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/create-salary/:yearMonth/:id"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateSalary />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/charts-of-account"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ChartsOfAccount />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/charts-of-account-head"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ChartsOfAccountHead />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/create-voucher"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <CreateVoucher />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/finance-report"
                element={
                  user ? (
                    <ProtectedRoute>
                      <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <FinanceReport />
                      </RoleProtectedRoute>
                    </ProtectedRoute>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* ......student routes.............. */}
              {/* <Route
                  path="/student-profile"
                  element={
                    user ? (
                      <ProtectedRoute>
                        <RoleProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                          <StudentProfile/>
                        </RoleProtectedRoute>
                      </ProtectedRoute>
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                /> */}
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;


