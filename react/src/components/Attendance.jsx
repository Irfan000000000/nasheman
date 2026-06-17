// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState(''); // For bulk selection

//   const [viewReport, setViewReport] = useState(false);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialFormData = {
//     from_date: '',
//     to_date: '',
//   };

//   const [editFormData, setEditFormData] = useState(initialFormData);

//   // Fetch employees once when the component loads
//   useEffect(() => {
//     const fetchEmployees = () => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+"/employee-list-for-attendance")
//         .then(res => {
//           setEmployees(res.data.results);
//         })
//         .catch(err => console.log(err));
//     };

//     fetchEmployees();
//   }, []);

//   function getReport() {
//     setViewReport(true);
//   }

//   // Function to fetch attendance data for the selected date when the button is clicked
//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('!Please select a date for attendance');
//       return;
//     }

//     setError(''); // Clear any previous errors

//     axios.get(process.env.REACT_APP_API_BASE_URL+`/attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`)
//       .then(res => {
//         const existingAttendanceData = res.data.results;

//         // Create a map of existing attendance data by employee_id
//         const existingAttendanceMap = new Map(
//           existingAttendanceData.map(item => [item.employee_id, item])
//         );

//         // Create updated attendance data with default values for new employees
//         const updatedAttendanceData = employees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             return {
//               hidden_id: existingAttendanceMap.get(employee.id).id,
//               employee_id: employee.id,
//               status: existingAttendanceMap.get(employee.id).status,
//               remarks: existingAttendanceMap.get(employee.id).remarks
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: 'present', // default value
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => console.log(err));
//   };

//   // Handle bulk status change for all employees
//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status); // Update the bulk status dropdown value
//     setAttendanceData(prevData =>
//       prevData.map(data => ({ ...data, status }))
//     ); // Apply the status to all employees
//   };

//   // Handle individual employee status change
//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   // Handle remarks change for individual employees
//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   // Handle date input change
//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   // Handle attendance submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('!Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         toast.success('Attendance Marked Successfully!');
//         // Success notification or handling here if needed
//       } catch (error) {
//         console.error('There was an error!', error);
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//   }

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'><i className="fas fa-clock"></i> Employee Attendance</h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>
//           <div className="col-3">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}
//           >
//             Fetch Employee
//           </button>

//           <button
//             type="button"
//             className='btn btn-sm btn-danger ml-2'
//             onClick={getReport}
//           >
//             Get Report
//           </button>

//           {/* Bulk attendance status dropdown */}
//           <div className="col-3">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               <option value="absent">Absent</option>
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>

//           {/* Fetch attendance button */}

//         </div>

//         {/* Attendance Table */}
//         <div>
//           <table className='table' style={{ border: '1px solid #dee2e6' }}>
//             <thead>
//               <tr>
//                 <th className='text-center'>Sr.No</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((employee, index) => (
//                 <tr key={employee.id}>
//                   <td className='text-center'>{index + 1}</td> {/* Serial number starting from 1 */}
//                   <td>{employee.full_name}</td>
//                   <td>{employee.employee_post}</td>
//                   <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>

//                   {/* Radio buttons for individual attendance status */}
//                   <td className='text-center'>

//                   <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="present"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'present'}
//                       onChange={() => handleStatusChange(employee.id, 'present')}
//                     /> Present &nbsp;

//                     <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="casual_leave"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'casual_leave'}
//                       onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//                     /> Casual Leave &nbsp;

//                     <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="absent"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'absent'}
//                       onChange={() => handleStatusChange(employee.id, 'absent')}
//                     /> Absent &nbsp;

//                     <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="earned_leave"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'earned_leave'}
//                       onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//                     /> Earned Leave &nbsp;
//                     <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="maternity_leave"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'maternity_leave'}
//                       onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//                     /> Maternity Leave &nbsp;

//                     <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="ex_pakistan_leave"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'ex_pakistan_leave'}
//                       onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//                     /> Ex-Pakistan Leave &nbsp;

//                     <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="holiday"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'holiday'}
//                       onChange={() => handleStatusChange(employee.id, 'holiday')}
//                     /> Holiday &nbsp;

//                     <input
//                       type="radio"
//                       name={`status-${employee.id}`}
//                       value="lwp"
//                       checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'lwp'}
//                       onChange={() => handleStatusChange(employee.id, 'lwp')}
//                     /> LWP &nbsp;

//                   </td>

//                   <td className='text-center'>
//                     <input
//                       type="text"
//                       value={attendanceData.find(data => data.employee_id === employee.id)?.remarks || ''}
//                       onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//                     />
//                   </td>
//                 </tr>
//               ))}

//               <tr>
//                 <td colSpan={5}></td>
//                 <td className='text-center'>
//                   <button type="submit" className='btn btn-sm btn-warning'>Submit Attendance</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </form>

//       {
//         viewReport && (

//           <div
//             style={{
//               border: '1px solid #ddd',
//               padding: '10px',
//               position: 'fixed',
//               left: '50%',
//               top: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: '100',
//               backdropFilter: 'blur(10px)',
//               minWidth: '350px',
//               maxHeight: '80vh',
//               overflowY: 'auto',
//               backgroundColor: 'white',
//               borderRadius: '10px',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               width: '500px'
//             }}
//           >
//             <style>
//               {`
//           /* Custom scrollbar styles */
//           div::-webkit-scrollbar {
//               width: 8px;
//           }
//           div::-webkit-scrollbar-track {
//               background: #f1f1f1;
//               border-radius: 10px;
//           }
//           div::-webkit-scrollbar-thumb {
//               background: #888;
//               border-radius: 10px;
//           }
//           div::-webkit-scrollbar-thumb:hover {
//               background: #555;
//           }
//           table#admission_Summary {
//               border: 1px solid black;
//               border-collapse: collapse;
//           }
//           table#admission_Summary th, table#admission_Summary td {
//               border: 1px solid gray;
//               padding: 10px !important;
//           }
//         `}
//             </style>

//             {/* Close Button */}
//             <button
//               onClick={handleHide}
//               style={{
//                 position: 'absolute',
//                 top: '16px',
//                 right: '16px',
//                 background: 'transparent',
//                 border: 'none',
//                 fontSize: '20px',
//                 cursor: 'pointer',
//                 zIndex: '200', // Ensures it stays on top of other elements
//               }}
//             >
//               &times;
//             </button>

//             {/* Non-Scrollable Heading */}
//             <div
//               style={{
//                 width: '100%',
//                 backgroundColor: '#007bff',
//                 padding: '5px',
//                 borderBottom: '1px solid #ddd',
//                 position: 'sticky',
//                 top: '0',
//                 zIndex: '150',
//                 textAlign: 'center',
//                 fontSize: '18px',
//                 fontWeight: 'bold',
//                 color: '#ffc107',
//               }}
//             >
//               Get Attendance Report
//             </div>

//             {/* Scrollable Content */}
//             <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
//               <form>
//                 <div class="form-group">
//                   <label for="from_date">From</label>
//                   <input type="date" class="form-control" id="from_date"
//                     value={editFormData.from_date}
//                     onChange={(e) => setEditFormData({ ...editFormData, from_date: e.target.value })}
//                   />
//                 </div>
//                 <div class="form-group">
//                   <label for="to_date">To</label>
//                   <input type="date" class="form-control" id="to_date"
//                     value={editFormData.to_date}
//                     onChange={(e) => setEditFormData({ ...editFormData, to_date: e.target.value })}
//                   />
//                 </div>
//                 <div class="form-group">

//                   <button className='btn btn-sm btn-warning'>Get Report</button>
//                 </div>
//               </form>
//             </div>
//           </div>

//         )
//       }

//     </div>

//   );
// };

// export default AttendanceForm;

//below code is 100 percent correct

// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({}); // For storing the counts
//   const [selectedDate, setSelectedDate] = useState('');
//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState(''); // For bulk selection

//   const [viewReport, setViewReport] = useState(false);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialFormData = {
//     from_date: '',
//     to_date: '',
//   };

//   const [editFormData, setEditFormData] = useState(initialFormData);

//   // Fetch employees once when the component loads
//   useEffect(() => {
//     const fetchEmployees = () => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+"/employee-list-for-attendance")
//         .then(res => {
//           setEmployees(res.data.results);
//         })
//         .catch(err => console.log(err));
//     };

//     fetchEmployees();
//   }, []);

//   // Fetch attendance data and counts for the selected date
//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('!Please select a date for attendance');
//       return;
//     }

//     setError(''); // Clear any previous errors

//     axios.get(process.env.REACT_APP_API_BASE_URL+`/attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`)
//       .then(res => {
//         const existingAttendanceData = res.data.results;
//         const counts = res.data.groupedCount; // Assuming groupedCount holds the status count data

//         // Create a map of counts for each employee by status
//         const employeeStatusCounts = counts.reduce((acc, item) => {
//           if (!acc[item.employee_id]) {
//             acc[item.employee_id] = {};
//           }
//           acc[item.employee_id][item.status] = item.count;
//           return acc;
//         }, {});

//         setStatusCounts(employeeStatusCounts);

//         // Create a map of existing attendance data by employee_id
//         const existingAttendanceMap = new Map(
//           existingAttendanceData.map(item => [item.employee_id, item])
//         );

//         // Create updated attendance data with default values for new employees
//         const updatedAttendanceData = employees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             return {
//               hidden_id: existingAttendanceMap.get(employee.id).id,
//               employee_id: employee.id,
//               status: existingAttendanceMap.get(employee.id).status,
//               remarks: existingAttendanceMap.get(employee.id).remarks
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: 'present', // default value
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => console.log(err));
//   };

//   // Handle bulk status change for all employees
//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status); // Update the bulk status dropdown value
//     setAttendanceData(prevData =>
//       prevData.map(data => ({ ...data, status }))
//     ); // Apply the status to all employees
//   };

//   // Handle individual employee status change
//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   // Handle remarks change for individual employees
//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   // Handle date input change
//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   // Handle attendance submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('!Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         toast.success('Attendance Marked Successfully!');
//         // Success notification or handling here if needed
//       } catch (error) {
//         console.error('There was an error!', error);
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//   }

//   const getReport = () => {
//     // Add your logic here to handle fetching the report
//     console.log("Report fetched!");
//     setViewReport(true);  // This shows the report popup
//   };

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'>
//         <i className="fas fa-clock"></i> Employee Attendance
//       </h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>
//           <div className="col-3">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}
//           >
//             Fetch Employee
//           </button>

//           <button
//             type="button"
//             className='btn btn-sm btn-danger ml-2'
//             onClick={getReport}
//           >
//             Get Report
//           </button>

//           {/* Bulk attendance status dropdown */}
//           <div className="col-3">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               {/* <option value="absent">Absent</option> */}
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>
//         </div>

//         {/* Attendance Table */}
//         <div>
//           <table className='table' style={{ border: '1px solid #dee2e6' }}>
//             <thead>
//               <tr>
//                 <th className='text-center'>Sr.No</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((employee, index) => (
//                 <tr key={employee.id}>
//                   <td className='text-center'>{index + 1}</td> {/* Serial number starting from 1 */}
//                   <td>{employee.full_name}</td>
//                   <td>{employee.employee_post}</td>
//                   <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>

//                   {/* Radio buttons for individual attendance status */}

//                   <td className='text-center'>
//                     <span style={{ marginRight: '20px' }}>
//                       <input
//                         type="radio"
//                         name={`status-${employee.id}`}
//                         value="present"
//                         checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'present'}
//                         onChange={() => handleStatusChange(employee.id, 'present')}
//                       /> Present ({statusCounts[employee.id]?.present || 0})
//                     </span>

//                     <span style={{ marginRight: '20px' }}>
//                       <input
//                         type="radio"
//                         name={`status-${employee.id}`}
//                         value="casual_leave"
//                         checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'casual_leave'}
//                         onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//                       /> C.L ({statusCounts[employee.id]?.casual_leave || 0})
//                     </span>

//                     <span style={{ marginRight: '20px' }}>
//                       <input
//                         type="radio"
//                         name={`status-${employee.id}`}
//                         value="earned_leave"
//                         checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'earned_leave'}
//                         onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//                       /> E.L ({statusCounts[employee.id]?.earned_leave || 0})
//                     </span>

//                     <span style={{ marginRight: '20px' }}>
//                       <input
//                         type="radio"
//                         name={`status-${employee.id}`}
//                         value="maternity_leave"
//                         checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'maternity_leave'}
//                         onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//                       /> M.L ({statusCounts[employee.id]?.maternity_leave || 0})
//                     </span>

//                     <span style={{ marginRight: '20px' }}>
//                       <input
//                         type="radio"
//                         name={`status-${employee.id}`}
//                         value="ex_pakistan_leave"
//                         checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'ex_pakistan_leave'}
//                         onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//                       /> Ex-Pak.L ({statusCounts[employee.id]?.ex_pakistan_leave || 0})
//                     </span>

//                     <span style={{ marginRight: '20px' }}>
//                       <input
//                         type="radio"
//                         name={`status-${employee.id}`}
//                         value="holiday"
//                         checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'holiday'}
//                         onChange={() => handleStatusChange(employee.id, 'holiday')}
//                       /> Holiday ({statusCounts[employee.id]?.holiday || 0})
//                     </span>

//                     <span style={{ marginRight: '20px' }}>
//                       <input
//                         type="radio"
//                         name={`status-${employee.id}`}
//                         value="lwp"
//                         checked={attendanceData.find(data => data.employee_id === employee.id)?.status === 'lwp'}
//                         onChange={() => handleStatusChange(employee.id, 'lwp')}
//                       /> LWP ({statusCounts[employee.id]?.lwp || 0})
//                     </span>
//                   </td>

//                   <td className='text-center'>
//                     <input
//                       type="text"
//                       value={attendanceData.find(data => data.employee_id === employee.id)?.remarks || ''}
//                       onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//                     />
//                   </td>
//                 </tr>
//               ))}

//               <tr>
//                 <td colSpan={5}></td>
//                 <td className='text-center'>
//                   <button type="submit" className='btn btn-sm btn-warning'>Submit Attendance</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </form>

//       {viewReport && (
//         <div
//           style={{
//             border: '1px solid #ddd',
//             padding: '10px',
//             position: 'fixed',
//             left: '50%',
//             top: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: '100',
//             backdropFilter: 'blur(10px)',
//             minWidth: '350px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//             backgroundColor: 'white',
//             borderRadius: '10px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             width: '500px'
//           }}
//         >
//           <style>
//             {`
//               div::-webkit-scrollbar {
//                   width: 8px;
//               }
//               div::-webkit-scrollbar-track {
//                   background: #f1f1f1;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb {
//                   background: #888;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb:hover {
//                   background: #555;
//               }
//               table#admission_Summary {
//                   border: 1px solid black;
//                   border-collapse: collapse;
//               }
//               table#admission_Summary th, table#admission_Summary td {
//                   border: 1px solid gray;
//                   padding: 10px !important;
//               }
//             `}
//           </style>

//           {/* Close Button */}
//           <button
//             onClick={handleHide}
//             style={{
//               position: 'absolute',
//               top: '16px',
//               right: '16px',
//               background: 'transparent',
//               border: 'none',
//               fontSize: '20px',
//               cursor: 'pointer',
//               zIndex: '200', // Ensures it stays on top of other elements
//             }}
//           >
//             &times;
//           </button>

//           {/* Non-Scrollable Heading */}
//           <div
//             style={{
//               width: '100%',
//               backgroundColor: '#007bff',
//               padding: '5px',
//               borderBottom: '1px solid #ddd',
//               position: 'sticky',
//               top: '0',
//               zIndex: '150',
//               textAlign: 'center',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               color: '#ffc107',
//             }}
//           >
//             Get Attendance Report
//           </div>

//           {/* Scrollable Content */}
//           <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
//             <form>
//               <div class="form-group">
//                 <label for="from_date">From</label>
//                 <input type="date" class="form-control" id="from_date"
//                   value={editFormData.from_date}
//                   onChange={(e) => setEditFormData({ ...editFormData, from_date: e.target.value })}
//                 />
//               </div>
//               <div class="form-group">
//                 <label for="to_date">To</label>
//                 <input type="date" class="form-control" id="to_date"
//                   value={editFormData.to_date}
//                   onChange={(e) => setEditFormData({ ...editFormData, to_date: e.target.value })}
//                 />
//               </div>
//               <div class="form-group">
//                 <button className='btn btn-sm btn-warning'>Get Report</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceForm;

// .............................................................................
//this code is 100 percent correct

// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({}); // For storing the counts
//   const [selectedDate, setSelectedDate] = useState('');
//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState(''); // For bulk selection
//   const [viewReport, setViewReport] = useState(false);

//   const [getAttendanceReport, setAttendanceReport] = useState([]);

//   const [viewAttendance, setAttendance] = useState(false);

//   const [getMonth, setForTheMonth] = useState('');

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialFormData = {
//     for_the_month: '',

//   };

//   const [editFormData, setEditFormData] = useState(initialFormData);

//   const fetchAttendanceData = () => {

//     if(editFormData.for_the_month ==''){
//       alert("Please first select month");
//       return false;
//     }

//     axios.get(process.env.REACT_APP_API_BASE_URL+"/attendance-report-data", {
//       params: {
//         for_the_month: editFormData.for_the_month,
//         session_id: academicSession,
//         campus_id:user.user.campus_id
//       }
//     })
//       .then(res => {
//         console.log(res.data.results);
//         setAttendanceReport(res.data.results);
//         setForTheMonth(res.data.for_the_month)
//          setAttendance(true);

//       })
//       .catch(err => console.log(err));
//   };

//   useEffect(() => {
//     const fetchEmployees = () => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+"/employee-list-for-attendance")
//         .then(res => {
//           setEmployees(res.data.results);
//         })
//         .catch(err => console.log(err));
//     };
//     fetchEmployees();
//   }, []);

//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('Please select a date for attendance');
//       return;
//     }
//     setError('');
//     axios.get(process.env.REACT_APP_API_BASE_URL+`/attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`)
//       .then(res => {
//         const existingAttendanceData = res.data.results;
//         const counts = res.data.groupedCount;

//         const employeeStatusCounts = counts.reduce((acc, item) => {
//           if (!acc[item.employee_id]) {
//             acc[item.employee_id] = {};
//           }
//           acc[item.employee_id][item.status] = item.count;
//           return acc;
//         }, {});

//         setStatusCounts(employeeStatusCounts);

//         const existingAttendanceMap = new Map(
//           existingAttendanceData.map(item => [item.employee_id, item])
//         );

//         const updatedAttendanceData = employees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             return {
//               hidden_id: existingAttendanceMap.get(employee.id).id,
//               employee_id: employee.id,
//               status: existingAttendanceMap.get(employee.id).status,
//               remarks: existingAttendanceMap.get(employee.id).remarks
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: 'present',
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => console.log(err));
//   };

//   // const handleBulkStatusChange = (status) => {
//   //   setBulkStatus(status);
//   //   setAttendanceData(prevData =>
//   //     prevData.map(data => ({ ...data, status }))
//   //   );
//   // };

//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status);
//     setAttendanceData(prevData =>
//       prevData.map(data => {
//         const employee = employees.find(emp => emp.id === data.employee_id);

//         // Check if the status can be applied based on disabling logic
//         const casualLeaveCount = statusCounts[employee.id]?.casual_leave || 0;
//         const earnedLeaveCount = statusCounts[employee.id]?.earned_leave || 0;

//         const disableStatus = casualLeaveCount >= 10 && !data.hidden_id;
//         const disableEarnedLeave = !(employee.job_type === 'Regular' && earnedLeaveCount < 10);

//         if ((status === 'earned_leave' && disableEarnedLeave) || disableStatus) {
//           return data; // Do not change the status if it's disabled
//         }

//         return { ...data, status };
//       })
//     );
//   };

//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         toast.success('Attendance Marked Successfully!');
//       } catch (error) {
//         console.error('There was an error!', error);
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//   };

//   const getReport = () => {
//     console.log("Report fetched!");
//     setViewReport(true);
//   };

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'>
//         <i className="fas fa-clock"></i> Employee Attendance
//       </h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>
//           <div className="col-3">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}
//           >
//             Fetch Employee
//           </button>

//           <button
//             type="button"
//             className='btn btn-sm btn-danger ml-2'
//             onClick={getReport}
//           >
//             Get Report
//           </button>

//           <div className="col-3">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <table className='table' style={{ border: '1px solid #dee2e6' }}>
//             <thead>
//               <tr>
//                 <th className='text-center'>Sr.No</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>

// {employees.map((employee, index) => {
//   const casualLeaveCount = statusCounts[employee.id]?.casual_leave || 0;
//   const earnedLeaveCount = statusCounts[employee.id]?.earned_leave || 0;

//   // Check if the employee is already being updated (exists in attendanceData with a non-empty hidden_id)
//   const isUpdating = !!attendanceData.find(data => data.employee_id === employee.id && data.hidden_id);

//   // Disable all status options if casual leave is >= 10 and not updating
//   const disableStatus = casualLeaveCount >= 10 && !isUpdating;

//   // For earned leave (EL), enable only if employee is regular and earned leave count is less than 10
//   const disableEarnedLeave = !(employee.job_type == 'Regular' && earnedLeaveCount < 10)  && !isUpdating;

//   // Determine the current status, defaulting to 'present'
//   const status = attendanceData.find(data => data.employee_id === employee.id)?.status || 'present';

//   return (
//     <tr key={employee.id}>
//       <td className='text-center'>{index + 1}</td>
//       <td>{employee.full_name}</td>
//       <td>{employee.employee_post}</td>
//       <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>

//       <td className='text-center'>
//         <span style={{ marginRight: '20px' }}>
//           <input
//             type="radio"
//             name={`status-${employee.id}`}
//             value="present"
//             checked={status === 'present'}
//             onChange={() => handleStatusChange(employee.id, 'present')}
//             // disabled={disableStatus}
//           /> Present <label style={{color : "#007bff"}}>({statusCounts[employee.id]?.present || 0})</label>
//         </span>

//         <span style={{ marginRight: '20px' }}>
//           <input
//             type="radio"
//             name={`status-${employee.id}`}
//             value="casual_leave"
//             checked={status === 'casual_leave'}
//             onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//             disabled={disableStatus}
//           /> C.L <label style={{color : "#007bff"}}>({casualLeaveCount})</label>
//         </span>

//         <span style={{ marginRight: '20px' }}>
//           <input
//             type="radio"
//             name={`status-${employee.id}`}
//             value="earned_leave"
//             checked={status === 'earned_leave'}
//             onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//             disabled={ disableEarnedLeave}
//           /> E.L <label style={{color : "#007bff"}}>({earnedLeaveCount})</label>
//         </span>

//         <span style={{ marginRight: '20px' }}>
//           <input
//             type="radio"
//             name={`status-${employee.id}`}
//             value="maternity_leave"
//             checked={status === 'maternity_leave'}
//             onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//             // disabled={disableStatus}
//           /> M.L <label style={{color : "#007bff"}}> ({statusCounts[employee.id]?.maternity_leave || 0})</label>
//         </span>

//         <span style={{ marginRight: '20px' }}>
//           <input
//             type="radio"
//             name={`status-${employee.id}`}
//             value="ex_pakistan_leave"
//             checked={status === 'ex_pakistan_leave'}
//             onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//             // disabled={disableStatus}
//           /> Ex-Pak.L <label style={{color : "#007bff"}}>({statusCounts[employee.id]?.ex_pakistan_leave || 0})</label>
//         </span>

//         <span style={{ marginRight: '20px' }}>
//           <input
//             type="radio"
//             name={`status-${employee.id}`}
//             value="holiday"
//             checked={status === 'holiday'}
//             onChange={() => handleStatusChange(employee.id, 'holiday')}
//             // disabled={disableStatus}
//           /> Holiday <label style={{color : "#007bff"}}>({statusCounts[employee.id]?.holiday || 0})</label>
//         </span>

//         <span style={{ marginRight: '20px' }}>
//           <input
//             type="radio"
//             name={`status-${employee.id}`}
//             value="lwp"
//             checked={status === 'lwp'}
//             onChange={() => handleStatusChange(employee.id, 'lwp')}
//           /> LWP <label style={{color : "#007bff"}}>({statusCounts[employee.id]?.lwp || 0})</label>
//         </span>
//       </td>

//       <td className='text-center'>
//         <input
//           type="text"
//           value={attendanceData.find(data => data.employee_id === employee.id)?.remarks || ''}
//           onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//           disabled={disableStatus}
//         />
//       </td>
//     </tr>
//   );
// })}
//               <tr>
//                 <td colSpan={5}></td>
//                 <td className='text-center'>
//                   <button type="submit" className='btn btn-sm btn-warning'>Submit Attendance</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </form>

//       {viewReport && (
//         <div
//           style={{
//             border: '1px solid #ddd',
//             padding: '10px',
//             position: 'fixed',
//             left: '50%',
//             top: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: '100',
//             backdropFilter: 'blur(10px)',
//             minWidth: '350px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//             backgroundColor: 'white',
//             borderRadius: '10px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             width: '500px'
//           }}
//         >
//           <style>
//             {`
//               div::-webkit-scrollbar {
//                   width: 8px;
//               }
//               div::-webkit-scrollbar-track {
//                   background: #f1f1f1;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb {
//                   background: #888;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb:hover {
//                   background: #555;
//               }
//               table#admission_Summary {
//                   border: 1px solid black;
//                   border-collapse: collapse;
//               }
//               table#admission_Summary th, table#admission_Summary td {
//                   border: 1px solid gray;
//                   padding: 10px !important;
//               }
//             `}
//           </style>

//           <button
//             onClick={handleHide}
//             style={{
//               position: 'absolute',
//               top: '16px',
//               right: '16px',
//               background: 'transparent',
//               border: 'none',
//               fontSize: '20px',
//               cursor: 'pointer',
//               zIndex: '200',
//             }}
//           >
//             &times;
//           </button>

//           <div
//             style={{
//               width: '100%',
//               backgroundColor: '#007bff',
//               padding: '5px',
//               borderBottom: '1px solid #ddd',
//               position: 'sticky',
//               top: '0',
//               zIndex: '150',
//               textAlign: 'center',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               color: '#ffc107',
//             }}
//           >
//             Get Attendance Report
//           </div>

//           <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>

//               <div className="form-group">
//                 <label htmlFor="for_the_month">Month</label>
//                 <input type="month" className="form-control" id="for_the_month"
//                   value={editFormData.for_the_month}
//                   onChange={(e) => setEditFormData({ ...editFormData, for_the_month: e.target.value })}
//                 />
//               </div>
//               <div className="form-group">
//                 <button className='btn btn-sm btn-warning' onClick={fetchAttendanceData} >Get Report</button>
//               </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AttendanceForm;

// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({}); // For storing the counts
//   const [selectedDate, setSelectedDate] = useState('');
//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState(''); // For bulk selection
//   const [viewReport, setViewReport] = useState(false);

//   const [attendanceReport, setAttendanceReport] = useState([]);
//   const [forTheMonth, setForTheMonth] = useState("");
//   const [daysInMonth, setDaysInMonth] = useState([]);
//   const [attendance, setAttendance] = useState(false);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialFormData = {
//     for_the_month: '',
//   };

//   const [editFormData, setEditFormData] = useState(initialFormData);

//   const fetchAttendanceData = () => {
//     if (editFormData.for_the_month === "") {
//       alert("Please first select month");
//       return false;
//     }

//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/attendance-report-data", {
//         params: {
//           for_the_month: editFormData.for_the_month,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//         },
//       })
//       .then((res) => {
//         setAttendanceReport(res.data.results);
//         setForTheMonth(res.data.for_the_month);
//         setDaysInMonth(getDaysInMonth(res.data.for_the_month)); // Dynamically get the days for the month
//         setAttendance(true);
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     const fetchEmployees = () => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+"/employee-list-for-attendance")
//         .then(res => {
//           setEmployees(res.data.results);
//         })
//         .catch(err => console.log(err));
//     };
//     fetchEmployees();
//   }, []);

//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('Please select a date for attendance');
//       return;
//     }
//     setError('');
//     axios.get(process.env.REACT_APP_API_BASE_URL+`/attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`)
//       .then(res => {
//         const existingAttendanceData = res.data.results;
//         const counts = res.data.groupedCount;

//         const employeeStatusCounts = counts.reduce((acc, item) => {
//           if (!acc[item.employee_id]) {
//             acc[item.employee_id] = {};
//           }
//           acc[item.employee_id][item.status] = item.count;
//           return acc;
//         }, {});

//         setStatusCounts(employeeStatusCounts);

//         const existingAttendanceMap = new Map(
//           existingAttendanceData.map(item => [item.employee_id, item])
//         );

//         const updatedAttendanceData = employees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             return {
//               hidden_id: existingAttendanceMap.get(employee.id).id,
//               employee_id: employee.id,
//               status: existingAttendanceMap.get(employee.id).status,
//               remarks: existingAttendanceMap.get(employee.id).remarks
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: 'present',
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => console.log(err));
//   };

//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status);
//     setAttendanceData(prevData =>
//       prevData.map(data => {
//         const employee = employees.find(emp => emp.id === data.employee_id);

//         const casualLeaveCount = statusCounts[employee.id]?.casual_leave || 0;
//         const earnedLeaveCount = statusCounts[employee.id]?.earned_leave || 0;

//         const disableStatus = casualLeaveCount >= 10 && !data.hidden_id;
//         const disableEarnedLeave = !(employee.job_type === 'Regular' && earnedLeaveCount < 10);

//         if ((status === 'earned_leave' && disableEarnedLeave) || disableStatus) {
//           return data; // Do not change the status if it's disabled
//         }

//         return { ...data, status };
//       })
//     );
//   };

//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         toast.success('Attendance Marked Successfully!');
//       } catch (error) {
//         console.error('There was an error!', error);
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//     setAttendance(false);
//   };

//   const getReport = () => {
//     setViewReport(true);
//   };

//   const getDaysInMonth = (monthYear) => {
//     const [year, month] = monthYear.split("-");
//     return new Array(new Date(year, month, 0).getDate())
//       .fill(null)
//       .map((_, i) => i + 1);
//   };

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'>
//         <i className="fas fa-clock"></i> Employee Attendance
//       </h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>
//           <div className="col-3">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}
//           >
//             Fetch Employee
//           </button>

//           <button
//             type="button"
//             className='btn btn-sm btn-danger ml-2'
//             onClick={getReport}
//           >
//             Get Report
//           </button>

//           <div className="col-3">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <table className='table' style={{ border: '1px solid #dee2e6' }}>
//             <thead>
//               <tr>
//                 <th className='text-center'>Sr.No</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((employee, index) => {
//                 const casualLeaveCount = statusCounts[employee.id]?.casual_leave || 0;
//                 const earnedLeaveCount = statusCounts[employee.id]?.earned_leave || 0;

//                 const isUpdating = !!attendanceData.find(data => data.employee_id === employee.id && data.hidden_id);
//                 const disableStatus = casualLeaveCount >= 10 && !isUpdating;
//                 const disableEarnedLeave = !(employee.job_type == 'Regular' && earnedLeaveCount < 10) && !isUpdating;
//                 const status = attendanceData.find(data => data.employee_id === employee.id)?.status || 'present';

//                 return (
//                   <tr key={employee.id}>
//                     <td className='text-center'>{index + 1}</td>
//                     <td>{employee.full_name}</td>
//                     <td>{employee.employee_post}</td>
//                     <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>

//                     <td className='text-center'>
//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="present"
//                           checked={status === 'present'}
//                           onChange={() => handleStatusChange(employee.id, 'present')}
//                         /> Present <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.present || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="casual_leave"
//                           checked={status === 'casual_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//                           disabled={disableStatus}
//                         /> C.L <label style={{ color: "#007bff" }}>({casualLeaveCount})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="earned_leave"
//                           checked={status === 'earned_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//                           disabled={disableEarnedLeave}
//                         /> E.L <label style={{ color: "#007bff" }}>({earnedLeaveCount})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="maternity_leave"
//                           checked={status === 'maternity_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//                         /> M.L <label style={{ color: "#007bff" }}> ({statusCounts[employee.id]?.maternity_leave || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="ex_pakistan_leave"
//                           checked={status === 'ex_pakistan_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//                         /> Ex-Pak.L <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.ex_pakistan_leave || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="holiday"
//                           checked={status === 'holiday'}
//                           onChange={() => handleStatusChange(employee.id, 'holiday')}
//                         /> Holiday <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.holiday || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="lwp"
//                           checked={status === 'lwp'}
//                           onChange={() => handleStatusChange(employee.id, 'lwp')}
//                         /> LWP <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.lwp || 0})</label>
//                       </span>
//                     </td>

//                     <td className='text-center'>
//                       <input
//                         type="text"
//                         value={attendanceData.find(data => data.employee_id === employee.id)?.remarks || ''}
//                         onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//                         disabled={disableStatus}
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//               <tr>
//                 <td colSpan={5}></td>
//                 <td className='text-center'>
//                   <button type="submit" className='btn btn-sm btn-warning'>Submit Attendance</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </form>

//       {viewReport && (
//         <div
//           style={{
//             border: '1px solid #ddd',
//             padding: '10px',
//             position: 'fixed',
//             left: '50%',
//             top: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: '100',
//             backdropFilter: 'blur(10px)',
//             minWidth: '350px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//             backgroundColor: 'white',
//             borderRadius: '10px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             width: '500px'
//           }}
//         >
//           <style>
//             {`
//               div::-webkit-scrollbar {
//                   width: 8px;
//               }
//               div::-webkit-scrollbar-track {
//                   background: #f1f1f1;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb {
//                   background: #888;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb:hover {
//                   background: #555;
//               }
//               table#admission_Summary {
//                   border: 1px solid black;
//                   border-collapse: collapse;
//               }
//               table#admission_Summary th, table#admission_Summary td {
//                   border: 1px solid gray;
//                   padding: 10px !important;
//               }
//             `}
//           </style>

//           <button
//             onClick={handleHide}
//             style={{
//               position: 'absolute',
//               top: '16px',
//               right: '16px',
//               background: 'transparent',
//               border: 'none',
//               fontSize: '20px',
//               cursor: 'pointer',
//               zIndex: '200',
//             }}
//           >
//             &times;
//           </button>

//           <div
//             style={{
//               width: '100%',
//               backgroundColor: '#007bff',
//               padding: '5px',
//               borderBottom: '1px solid #ddd',
//               position: 'sticky',
//               top: '0',
//               zIndex: '150',
//               textAlign: 'center',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               color: '#ffc107',
//             }}
//           >
//             Get Attendance Report
//           </div>

//           <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
//             <div className="form-group">
//               <label htmlFor="for_the_month">Month</label>
//               <input type="month" className="form-control" id="for_the_month"
//                 value={editFormData.for_the_month}
//                 onChange={(e) => setEditFormData({ ...editFormData, for_the_month: e.target.value })}
//               />
//             </div>
//             <div className="form-group">
//               <button className='btn btn-sm btn-warning' onClick={fetchAttendanceData}>Get Report</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {attendance && (
//         <div
//           style={{
//             border: '1px solid #ddd',
//             padding: '10px',
//             position: 'fixed',
//             left: '50%',
//             top: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: '100',
//             backdropFilter: 'blur(10px)',
//             minWidth: '350px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//             backgroundColor: 'white',
//             borderRadius: '10px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             width: '1800px'
//           }}
//         >
//           <style>
//             {`
//               div::-webkit-scrollbar {
//                   width: 8px;
//               }
//               div::-webkit-scrollbar-track {
//                   background: #f1f1f1;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb {
//                   background: #888;
//                   border-radius: 10px;
//               }
//               div::-webkit-scrollbar-thumb:hover {
//                   background: #555;
//               }
//               table#admission_Summary {
//                   border: 1px solid black;
//                   border-collapse: collapse;
//               }
//               table#admission_Summary th, table#admission_Summary td {
//                   border: 1px solid gray;
//                   padding: 10px !important;
//               }
//             `}
//           </style>

//           <button
//             onClick={handleHide}
//             style={{
//               position: 'absolute',
//               top: '16px',
//               right: '16px',
//               background: 'transparent',
//               border: 'none',
//               fontSize: '20px',
//               cursor: 'pointer',
//               zIndex: '200',
//             }}
//           >
//             &times;
//           </button>

//           <div
//             style={{
//               width: '100%',
//               backgroundColor: '#007bff',
//               padding: '5px',
//               borderBottom: '1px solid #ddd',
//               position: 'sticky',
//               top: '0',
//               zIndex: '150',
//               textAlign: 'center',
//               fontSize: '18px',
//               fontWeight: 'bold',
//               color: '#ffc107',
//             }}
//           >
//             Get Attendance Report
//           </div>

//           <table border="1" style={{width:"100%"}}>
//             <thead>
//               <tr>
//                 <th>Sr#</th>
//                 <th>Employee Name</th>
//                 {daysInMonth.map((day) => (
//                   <th key={day}>{day}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceReport.map((employee, index) => (
//                 <tr key={employee.id}>
//                   <td>{index + 1}</td>
//                   <td>{employee.full_name}</td>
//                   {daysInMonth.map((day) => (
//                     <td key={day}>
//                       {getEmployeeAttendanceStatus(employee, day)}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) }
//     </div>
//   );
// };

// const getEmployeeAttendanceStatus = (employee, day) => {
//   const attendanceDate = new Date(employee.date).getDate();
//   if (attendanceDate === day) {
//     switch (employee.status) {
//       case "present":
//         return "Present";
//       case "casual_leave":
//         return "C.L";
//       case "earned_leave":
//         return "E.L";
//       case "medical_leave":
//         return "M.L";
//       case "ex_pakistan_leave":
//         return "Ex-Pak.L";
//       case "holiday":
//         return "Holiday";
//       case "lwp":
//         return "LWP";
//       default:
//         return ""; // Default value if no specific status
//     }
//   }
//   return ""; // default value for days without record
// };

// export default AttendanceForm;

// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({}); // For storing the counts
//   const [selectedDate, setSelectedDate] = useState('');

//   const [selectedMonth, setSelectedMonth] = useState('');

//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState(''); // For bulk selection
//   const [viewReport, setViewReport] = useState(false);

//   const [attendanceReport, setAttendanceReport] = useState([]);
//   const [forTheMonth, setForTheMonth] = useState("");
//   const [daysInMonth, setDaysInMonth] = useState([]);
//   const [attendanceDataMapped, setAttendanceDataMapped] = useState([]); // For mapped attendance to avoid duplicates
//   const [attendance, setAttendance] = useState(false);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialFormData = {
//     for_the_month: '',
//   };

//   const [editFormData, setEditFormData] = useState(initialFormData);

//   // Fetch attendance data from API and map to employees
//   const fetchAttendanceData = () => {
//     if (selectedMonth === "") {
//       alert("Please first select month");
//       return false;
//     }

//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/attendance-report-data", {
//         params: {
//           for_the_month: selectedMonth,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//         },
//       })
//       .then((res) => {
//         const data = res.data.results;
//         setAttendanceReport(data);
//         setForTheMonth(res.data.for_the_month);
//         setDaysInMonth(getDaysInMonth(res.data.for_the_month)); // Dynamically get the days for the month
//         mapAttendanceDataToEmployees(data); // Map data by employee to avoid duplication
//         setAttendance(true);
//       })
//       .catch((err) => console.log(err));
//   };

//   const getShortForm = (status) => {
//     switch (status) {
//       case "earned_leave":
//         return "EL";
//       case "present":
//         return "P";
//       case "absent":
//         return "A";
//       case "holiday":
//         return "H";
//       case "lwp":
//         return "LWP";
//       case "casual_leave":
//         return "CL";
//       case "ex_pakistan_leave":
//         return "EPL";
//       case "maternity_leave":
//           return "ML";
//       default:
//         return status; // Fallback to the full status if not matched
//     }
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "A":
//         return "status-absent";
//       case "P":
//         return "status-present";
//       case "EL":
//         return "status-earned-leave";
//       case "CL":
//         return "status-casual-leave";
//       case "LWP":
//         return "status-lwp";
//       case "H":
//         return "status-holiday";
//       case "EPL":
//         return "status-ex-pakistan-leave";
//       case "ML":
//           return "status-maternity-leave";
//       default:
//         return "";
//     }
//   };

//   // Map attendance data to avoid duplicate employee rows
//   const mapAttendanceDataToEmployees = (data) => {
//     const employeeAttendanceMap = {};

//     data.forEach((attendance) => {
//       const { employee_id, full_name, date, status } = attendance;
//       const day = new Date(date).getDate();

//       if (!employeeAttendanceMap[employee_id]) {
//         employeeAttendanceMap[employee_id] = {
//           full_name,
//           attendance: {},
//         };
//       }
//       employeeAttendanceMap[employee_id].attendance[day] =  getShortForm(status);
//     });

//     // Convert the map into an array for rendering
//     setAttendanceDataMapped(Object.values(employeeAttendanceMap));
//   };

//   const getDaysInMonth = (monthYear) => {
//     const [year, month] = monthYear.split("-");
//     return new Array(new Date(year, month, 0).getDate())
//       .fill(null)
//       .map((_, i) => i + 1);
//   };

//   const getEmployeeAttendanceStatus = (employee, day) => {
//     return employee.attendance[day] || "";
//   };

//   // Fetch employee list (if needed)
//   useEffect(() => {
//     const fetchEmployees = () => {
//       axios.get(`${process.env.REACT_APP_API_BASE_URL}/employee-list-for-attendance/${user.user.campus_id}`)
//         .then(res => {
//           setEmployees(res.data.results);
//         })
//         .catch(err => console.log(err));
//     };
//     fetchEmployees();
//   }, []);

//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('Please select a date for attendance');
//       return;
//     }
//     setError('');
//     axios.get(process.env.REACT_APP_API_BASE_URL+`/attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`)
//       .then(res => {
//         const existingAttendanceData = res.data.results;
//         const counts = res.data.groupedCount;

//         const employeeStatusCounts = counts.reduce((acc, item) => {
//           if (!acc[item.employee_id]) {
//             acc[item.employee_id] = {};
//           }
//           acc[item.employee_id][item.status] = item.count;
//           return acc;
//         }, {});

//         setStatusCounts(employeeStatusCounts);

//         const existingAttendanceMap = new Map(
//           existingAttendanceData.map(item => [item.employee_id, item])
//         );

//         const updatedAttendanceData = employees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             return {
//               hidden_id: existingAttendanceMap.get(employee.id).id,
//               employee_id: employee.id,
//               status: existingAttendanceMap.get(employee.id).status,
//               remarks: existingAttendanceMap.get(employee.id).remarks
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: 'present',
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => console.log(err));
//   };

//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status);
//     setAttendanceData(prevData =>
//       prevData.map(data => {
//         const employee = employees.find(emp => emp.id === data.employee_id);

//         const casualLeaveCount = statusCounts[employee.id]?.casual_leave || 0;
//         const earnedLeaveCount = statusCounts[employee.id]?.earned_leave || 0;

//         const disableStatus = casualLeaveCount >= 10 && !data.hidden_id;
//         const disableEarnedLeave = !(employee.job_type === 'Regular' && earnedLeaveCount < 10);

//         if ((status === 'earned_leave' && disableEarnedLeave) || disableStatus) {
//           return data; // Do not change the status if it's disabled
//         }

//         return { ...data, status };
//       })
//     );
//   };

//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const handleChangeMonth = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         toast.success('Attendance Marked Successfully!');
//       } catch (error) {
//         console.error('There was an error!', error);
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//     setAttendance(false);
//   };

//   const getReport = () => {
//     fetchAttendanceData();
//     setViewReport(true);
//   };

//   const countTotalPresents = (attendance) => {
//     // return Object.values(attendance).filter((status) => status === "P" || status === "EL" || status === "ML" || status === "H" || status === "CL").length;

//     return Object.values(attendance).filter((status) => status === "P").length;
//   };

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'>
//         <i className="fas fa-clock"></i> Employee Attendance
//       </h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>
//           <div className="col-3">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}
//           >
//             Fetch Employee
//           </button>

//           <div className="col-3">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>

//           <div className="col-3">
//             <input
//               type="month"
//               id="attendance-month"
//               value={selectedMonth}
//               onChange={handleChangeMonth}
//               className='form-control'
//             />
//           </div>

//           <button
//             type="button"
//             className='btn btn-sm btn-danger ml-2'
//             onClick={getReport}
//           >
//             Get Report
//           </button>

//         </div>

//         <div>
//           <table className='table' style={{ border: '1px solid #dee2e6' }}>
//             <thead>
//               <tr>
//                 <th className='text-center'>Sr.No</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.map((employee, index) => {
//                 const casualLeaveCount = statusCounts[employee.id]?.casual_leave || 0;
//                 const earnedLeaveCount = statusCounts[employee.id]?.earned_leave || 0;

//                 const isUpdating = !!attendanceData.find(data => data.employee_id === employee.id && data.hidden_id);
//                 const disableStatus = casualLeaveCount >= 10 && !isUpdating;
//                 const disableEarnedLeave = !(employee.job_type == 'Regular' && earnedLeaveCount < 10) && !isUpdating;
//                 const status = attendanceData.find(data => data.employee_id === employee.id)?.status || 'present';

//                 return (
//                   <tr key={employee.id}>
//                     <td className='text-center'>{index + 1}</td>
//                     <td>{employee.full_name}</td>
//                     <td>{employee.employee_post}</td>
//                     <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>

//                     <td className='text-center'>
//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="present"
//                           checked={status === 'present'}
//                           onChange={() => handleStatusChange(employee.id, 'present')}
//                         /> Present <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.present || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="casual_leave"
//                           checked={status === 'casual_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//                           disabled={disableStatus}
//                         /> C.L <label style={{ color: "#007bff" }}>({casualLeaveCount})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="earned_leave"
//                           checked={status === 'earned_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//                           disabled={disableEarnedLeave}
//                         /> E.L <label style={{ color: "#007bff" }}>({earnedLeaveCount})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="maternity_leave"
//                           checked={status === 'maternity_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//                         /> M.L <label style={{ color: "#007bff" }}> ({statusCounts[employee.id]?.maternity_leave || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="ex_pakistan_leave"
//                           checked={status === 'ex_pakistan_leave'}
//                           onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//                         /> Ex-Pak.L <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.ex_pakistan_leave || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="holiday"
//                           checked={status === 'holiday'}
//                           onChange={() => handleStatusChange(employee.id, 'holiday')}
//                         /> Holiday <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.holiday || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${employee.id}`}
//                           value="lwp"
//                           checked={status === 'lwp'}
//                           onChange={() => handleStatusChange(employee.id, 'lwp')}
//                         /> LWP <label style={{ color: "#007bff" }}>({statusCounts[employee.id]?.lwp || 0})</label>
//                       </span>
//                     </td>

//                     <td className='text-center'>
//                       <input
//                         type="text"
//                         value={attendanceData.find(data => data.employee_id === employee.id)?.remarks || ''}
//                         onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//                         disabled={disableStatus}
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//               <tr>
//                 <td colSpan={5}></td>
//                 <td className='text-center'>
//                   <button type="submit" className='btn btn-sm btn-warning'>Submit Attendance</button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </form>

// {viewReport && (

//           <div style={{
//                position: "fixed", // Fix to the viewport
//                top: "50%",
//                left: "50%",
//                transform: "translate(-50%, -50%)", // Center horizontally and vertically
//                zIndex: "100", // Ensure it's above other elements
//                backdropFilter: "blur(10px)", // Optional: adds blur to the background
//                width: "90%",
//                maxWidth: "1800px",
//                maxHeight: "90vh",
//                backgroundColor: "white",
//               // borderRadius: "10px",
//                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                padding: "10px", // Remove padding for header part
//                overflow: "hidden", // Prevent entire modal from scrolling
//             }}
//           >
//             {/* Header section */}
//             <div
//               style={{
//                 position: "sticky", // Sticky position to keep the title fixed
//                 top: 0, // Stick to the top of the modal
//                 zIndex: 101, // Ensure it's above other content in the modal
//                 backgroundColor: "#007bff", // Background color for header
//                 color: "#ffc107",
//                 padding: "8px 16px", // Padding for header content
//               }}
//             >

//             <h5 style={{ margin: 0 }}>View Employee Attendance</h5>
//               <button
//                 onClick={() => handleHide()}
//                 style={{
//                   position: "absolute",
//                   top: "5px",
//                   right: "15px",
//                   background: "transparent",
//                   border: "none",
//                   fontSize: "20px",
//                   cursor: "pointer",
//                   color: "#ffc107",
//                 }}
//               >
//                 &times;
//               </button>
//             </div>

//             <div
//               style={{
//                 padding: "20px", // Padding for content
//                 marginTop: "10px", // Margin between header and content
//                 width: "100%",
//                 overflowY: "auto", // Make content scrollable
//                 maxHeight: "calc(90vh - 80px)", // Adjust height relative to viewport
//                 paddingTop: "5px",
//               }}
//             >

//           <table border="1" style={{ width:"100%" }} className='table'>
//             <thead>
//               <tr>
//                 <th>Sr#</th>
//                 <th>Employee Name</th>
//                 {daysInMonth.map((day) => (
//                   <th key={day}>{day}</th>
//                 ))}
//                 <th>Total.Present</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceDataMapped.map((employee, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{employee.full_name}</td>
//                   {daysInMonth.map((day) => (
//                     <td key={day} className={getStatusClass(employee.attendance[day])}>
//                       {getEmployeeAttendanceStatus(employee, day) }
//                     </td>
//                   ))}
//                   <td>{countTotalPresents(employee.attendance)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceForm;

// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState('');
//   const [viewReport, setViewReport] = useState(false);
//   const [attendanceReport, setAttendanceReport] = useState([]);
//   const [forTheMonth, setForTheMonth] = useState("");
//   const [daysInMonth, setDaysInMonth] = useState([]);
//   const [attendanceDataMapped, setAttendanceDataMapped] = useState([]);
//   const [attendance, setAttendance] = useState(false);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialFormData = {
//     for_the_month: '',
//   };

//   const [editFormData, setEditFormData] = useState(initialFormData);

//   // Fetch attendance data from API and map to employees
//   const fetchAttendanceData = () => {
//     if (selectedMonth === "") {
//       alert("Please first select month");
//       return false;
//     }

//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/attendance-report-data", {
//         params: {
//           for_the_month: selectedMonth,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//         },
//       })
//       .then((res) => {
//         const data = res.data.results;
//         setAttendanceReport(data);
//         setForTheMonth(res.data.for_the_month);
//         setDaysInMonth(getDaysInMonth(res.data.for_the_month));
//         mapAttendanceDataToEmployees(data);
//         setAttendance(true);
//       })
//       .catch((err) => console.log(err));
//   };

//   const getShortForm = (status) => {
//     switch (status) {
//       case "earned_leave":
//         return "EL";
//       case "present":
//         return "P";
//       case "absent":
//         return "A";
//       case "holiday":
//         return "H";
//       case "lwp":
//         return "LWP";
//       case "casual_leave":
//         return "CL";
//       case "ex_pakistan_leave":
//         return "EPL";
//       case "maternity_leave":
//         return "ML";
//       default:
//         return status;
//     }
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "A":
//         return "status-absent";
//       case "P":
//         return "status-present";
//       case "EL":
//         return "status-earned-leave";
//       case "CL":
//         return "status-casual-leave";
//       case "LWP":
//         return "status-lwp";
//       case "H":
//         return "status-holiday";
//       case "EPL":
//         return "status-ex-pakistan-leave";
//       case "ML":
//         return "status-maternity-leave";
//       default:
//         return "";
//     }
//   };

//   // Map attendance data to avoid duplicate employee rows
//   const mapAttendanceDataToEmployees = (data) => {
//     const employeeAttendanceMap = {};

//     data.forEach((attendance) => {
//       const { employee_id, full_name, date, status } = attendance;
//       const day = new Date(date).getDate();

//       if (!employeeAttendanceMap[employee_id]) {
//         employeeAttendanceMap[employee_id] = {
//           full_name,
//           attendance: {},
//         };
//       }
//       employeeAttendanceMap[employee_id].attendance[day] = getShortForm(status);
//     });

//     setAttendanceDataMapped(Object.values(employeeAttendanceMap));
//   };

//   const getDaysInMonth = (monthYear) => {
//     const [year, month] = monthYear.split("-");
//     return new Array(new Date(year, month, 0).getDate())
//       .fill(null)
//       .map((_, i) => i + 1);
//   };

//   const getEmployeeAttendanceStatus = (employee, day) => {
//     return employee.attendance[day] || "";
//   };

//   // Fetch employees and attendance together
//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('Please select a date for attendance');
//       return;
//     }

//     setError('');

//     // Single API call that fetches everything
//     axios.get(
//       `${process.env.REACT_APP_API_BASE_URL}/employee-attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`
//     )
//       .then(res => {
//         const { employees: fetchedEmployees, attendance: existingAttendance } = res.data;

//         // Set employees
//         setEmployees(fetchedEmployees);

//         // Map existing attendance
//         const existingAttendanceMap = new Map(
//           existingAttendance.map(item => [item.employee_id, item])
//         );

//         // Create attendance data for all employees
//         const updatedAttendanceData = fetchedEmployees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             return {
//               hidden_id: existingAttendanceMap.get(employee.id).id,
//               employee_id: employee.id,
//               status: existingAttendanceMap.get(employee.id).status,
//               remarks: existingAttendanceMap.get(employee.id).remarks
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: 'present',
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => {
//         console.error('Error fetching attendance:', err);
//         setError('Failed to fetch attendance data');
//       });
//   };

//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status);
//     setAttendanceData(prevData =>
//       prevData.map(data => ({ ...data, status }))
//     );
//   };

//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const handleChangeMonth = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         setEmployees([]);
//         toast.success('Attendance Marked Successfully!');
//       } catch (error) {
//         console.error('There was an error!', error);
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//     setAttendance(false);
//   };

//   const getReport = () => {
//     fetchAttendanceData();
//     setViewReport(true);
//   };

//   const countTotalPresents = (attendance) => {
//     return Object.values(attendance).filter((status) => status === "P").length;
//   };

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'>
//         <i className="fas fa-clock"></i> Employee Attendance
//       </h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>
//           <div className="col-3">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}
//           >
//             Fetch Employee
//           </button>

//           <div className="col-3">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>

//           <div className="col-3">
//             <input
//               type="month"
//               id="attendance-month"
//               value={selectedMonth}
//               onChange={handleChangeMonth}
//               className='form-control'
//             />
//           </div>

//           <button
//             type="button"
//             className='btn btn-sm btn-danger ml-2'
//             onClick={getReport}
//           >
//             Get Report
//           </button>
//         </div>

//         <div>
//           <table className='table' style={{ border: '1px solid #dee2e6' }}>
//             <thead>
//               <tr>
//                 <th className='text-center'>Sr.No</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.length > 0 ? (
//                 employees.map((employee, index) => {
//                   const status = attendanceData.find(data => data.employee_id === employee.id)?.status || '';

//                   return (
//                     <tr key={employee.id}>
//                       <td className='text-center'>{index + 1}</td>
//                       <td>{employee.full_name}</td>
//                       <td>{employee.employee_post}</td>
//                       <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>

//                       <td className='text-center'>
//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="present"
//                             checked={status === 'present'}
//                             onChange={() => handleStatusChange(employee.id, 'present')}
//                           /> Present
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="casual_leave"
//                             checked={status === 'casual_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//                           /> C.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="earned_leave"
//                             checked={status === 'earned_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//                           /> E.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="maternity_leave"
//                             checked={status === 'maternity_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//                           /> M.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="ex_pakistan_leave"
//                             checked={status === 'ex_pakistan_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//                           /> Ex-Pak.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="holiday"
//                             checked={status === 'holiday'}
//                             onChange={() => handleStatusChange(employee.id, 'holiday')}
//                           /> Holiday
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="lwp"
//                             checked={status === 'lwp'}
//                             onChange={() => handleStatusChange(employee.id, 'lwp')}
//                           /> LWP
//                         </span>
//                       </td>

//                       <td className='text-center'>
//                         <input
//                           type="text"
//                           value={attendanceData.find(data => data.employee_id === employee.id)?.remarks || ''}
//                           onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={6} className='text-center'>
//                     Please select a date and click "Fetch Employee" to load attendance
//                   </td>
//                 </tr>
//               )}
//               {employees.length > 0 && (
//                 <tr>
//                   <td colSpan={5}></td>
//                   <td className='text-center'>
//                     <button type="submit" className='btn btn-sm btn-warning'>Submit Attendance</button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </form>

//       {viewReport && (
//         <div style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           zIndex: "100",
//           backdropFilter: "blur(10px)",
//           width: "90%",
//           maxWidth: "1800px",
//           maxHeight: "90vh",
//           backgroundColor: "white",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           padding: "10px",
//           overflow: "hidden",
//         }}>
//           <div style={{
//             position: "sticky",
//             top: 0,
//             zIndex: 101,
//             backgroundColor: "#ebd197",
//             color: "black",
//             padding: "8px 16px",
//           }}>
//             <h5 style={{ margin: 0 }}>View Employee Attendance</h5>
//             <button
//               onClick={() => handleHide()}
//               style={{
//                 position: "absolute",
//                 top: "5px",
//                 right: "15px",
//                 background: "transparent",
//                 border: "none",
//                 fontSize: "20px",
//                 cursor: "pointer",
//                 color: "black",
//               }}
//             >
//               &times;
//             </button>
//           </div>

//           <div style={{
//             padding: "20px",
//             marginTop: "10px",
//             width: "100%",
//             overflowY: "auto",
//             maxHeight: "calc(90vh - 80px)",
//             paddingTop: "5px",
//           }}>
//             <table border="1" style={{ width:"100%", fontSize: "12px" }} className='table table-bordered'>
//               <thead style={{ backgroundColor: "#007bff", color: "white", position: "sticky", top: 0, zIndex: 10 }}>
//                 <tr>
//                   <th>Sr#</th>
//                   <th>Employee Name</th>
//                   {daysInMonth.map((day) => (
//                     <th key={day} style={{ minWidth: "35px", textAlign: "center" }}>{day}</th>
//                   ))}
//                   <th>P</th>
//                   <th>CL</th>
//                   <th>EL</th>
//                   <th>ML</th>
//                   <th>EPL</th>
//                   <th>H</th>
//                   <th>LWP</th>
//                   <th>Total Days</th>
//                   <th>Working Hours</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendanceDataMapped.map((employee, index) => {
//                   const attendanceValues = Object.values(employee.attendance);
//                   const presentCount = attendanceValues.filter(s => s === "P").length;
//                   const casualLeaveCount = attendanceValues.filter(s => s === "CL").length;
//                   const earnedLeaveCount = attendanceValues.filter(s => s === "EL").length;
//                   const maternityLeaveCount = attendanceValues.filter(s => s === "ML").length;
//                   const exPakLeaveCount = attendanceValues.filter(s => s === "EPL").length;
//                   const holidayCount = attendanceValues.filter(s => s === "H").length;
//                   const lwpCount = attendanceValues.filter(s => s === "LWP").length;
//                   const totalDays = presentCount + casualLeaveCount + earnedLeaveCount + maternityLeaveCount + exPakLeaveCount + holidayCount + lwpCount;
//                   const workingHours = (presentCount * 8).toFixed(2);

//                   return (
//                     <tr key={index}>
//                       <td style={{ textAlign: "center" }}>{index + 1}</td>
//                       <td style={{ minWidth: "150px", whiteSpace: "nowrap" }}>{employee.full_name}</td>
//                       {daysInMonth.map((day) => (
//                         <td key={day} className={getStatusClass(employee.attendance[day])} style={{ textAlign: "center", padding: "5px" }}>
//                           {getEmployeeAttendanceStatus(employee, day)}
//                         </td>
//                       ))}
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{presentCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{casualLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{earnedLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{maternityLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{exPakLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{holidayCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{lwpCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>{totalDays}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>{workingHours}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>

//   );
// };

// export default AttendanceForm;

// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState('');
//   const [viewReport, setViewReport] = useState(false);
//   const [attendanceReport, setAttendanceReport] = useState([]);
//   const [forTheMonth, setForTheMonth] = useState("");
//   const [daysInMonth, setDaysInMonth] = useState([]);
//   const [attendanceDataMapped, setAttendanceDataMapped] = useState([]);
//   const [attendance, setAttendance] = useState(false);
//   const [detailedReport, setDetailedReport] = useState(false);
//   const [detailedData, setDetailedData] = useState([]);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   // Format timestamp to 12-hour format
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'N/A';
//     const date = new Date(timestamp);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   // Fetch attendance data from API and map to employees
//   const fetchAttendanceData = () => {
//     if (selectedMonth === "") {
//       alert("Please first select month");
//       return false;
//     }

//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/attendance-report-data", {
//         params: {
//           for_the_month: selectedMonth,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//         },
//       })
//       .then((res) => {
//         const data = res.data.results;
//         setAttendanceReport(data);
//         setForTheMonth(res.data.for_the_month);
//         setDaysInMonth(getDaysInMonth(res.data.for_the_month));
//         mapAttendanceDataToEmployees(data);
//         setDetailedData(data);
//         setAttendance(true);
//       })
//       .catch((err) => console.log(err));
//   };

//   const getShortForm = (status) => {
//     switch (status) {
//       case "earned_leave":
//         return "EL";
//       case "present":
//         return "P";
//       case "absent":
//         return "A";
//       case "holiday":
//         return "H";
//       case "lwp":
//         return "LWP";
//       case "casual_leave":
//         return "CL";
//       case "ex_pakistan_leave":
//         return "EPL";
//       case "maternity_leave":
//         return "ML";
//       default:
//         return status;
//     }
//   };

//   const getFullStatus = (status) => {
//     switch (status) {
//       case "earned_leave":
//         return "Earned Leave";
//       case "present":
//         return "Present";
//       case "absent":
//         return "Absent";
//       case "holiday":
//         return "Holiday";
//       case "lwp":
//         return "Leave Without Pay";
//       case "casual_leave":
//         return "Casual Leave";
//       case "ex_pakistan_leave":
//         return "Ex-Pakistan Leave";
//       case "maternity_leave":
//         return "Maternity Leave";
//       default:
//         return status;
//     }
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "A":
//         return "status-absent";
//       case "P":
//         return "status-present";
//       case "EL":
//         return "status-earned-leave";
//       case "CL":
//         return "status-casual-leave";
//       case "LWP":
//         return "status-lwp";
//       case "H":
//         return "status-holiday";
//       case "EPL":
//         return "status-ex-pakistan-leave";
//       case "ML":
//         return "status-maternity-leave";
//       default:
//         return "";
//     }
//   };

//   // Map attendance data to avoid duplicate employee rows
//   const mapAttendanceDataToEmployees = (data) => {
//     const employeeAttendanceMap = {};

//     data.forEach((attendance) => {
//       const { employee_id, full_name, date, status } = attendance;
//       const day = new Date(date).getDate();

//       if (!employeeAttendanceMap[employee_id]) {
//         employeeAttendanceMap[employee_id] = {
//           full_name,
//           attendance: {},
//         };
//       }
//       employeeAttendanceMap[employee_id].attendance[day] = getShortForm(status);
//     });

//     setAttendanceDataMapped(Object.values(employeeAttendanceMap));
//   };

//   const getDaysInMonth = (monthYear) => {
//     const [year, month] = monthYear.split("-");
//     return new Array(new Date(year, month, 0).getDate())
//       .fill(null)
//       .map((_, i) => i + 1);
//   };

//   const getEmployeeAttendanceStatus = (employee, day) => {
//     return employee.attendance[day] || "";
//   };

//   // Fetch employees and attendance together
//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('Please select a date for attendance');
//       return;
//     }

//     setError('');

//     axios.get(
//       `${process.env.REACT_APP_API_BASE_URL}/employee-attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`
//     )
//       .then(res => {
//         const { employees: fetchedEmployees, attendance: existingAttendance } = res.data;

//         setEmployees(fetchedEmployees);

//         const existingAttendanceMap = new Map(
//           existingAttendance.map(item => [item.employee_id, item])
//         );

//         const updatedAttendanceData = fetchedEmployees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             const existingRecord = existingAttendanceMap.get(employee.id);
//             return {
//               hidden_id: existingRecord.id,
//               employee_id: employee.id,
//               status: existingRecord.status || '',
//               remarks: existingRecord.remarks || ''
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: '',
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => {
//         console.error('Error fetching attendance:', err);
//         setError('Failed to fetch attendance data');
//       });
//   };

//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status);
//     setAttendanceData(prevData =>
//       prevData.map(data => ({ ...data, status }))
//     );
//   };

//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const handleChangeMonth = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate that all employees have a status selected
//     const unselectedEmployees = attendanceData.filter(data => !data.status || data.status === '');

//     if (unselectedEmployees.length > 0) {
//       alert(`Please select attendance status for all employees. ${unselectedEmployees.length} employee(s) have no status selected.`);
//       return;
//     }

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         setEmployees([]);
//         toast.success('Attendance Marked Successfully!');
//       } catch (error) {
//         console.error('There was an error!', error);
//         toast.error('Failed to submit attendance');
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//     setAttendance(false);
//   };

//   const handleHideDetailed = () => {
//     setDetailedReport(false);
//   };

//   const getReport = () => {
//     fetchAttendanceData();
//     setViewReport(true);
//   };

//   const getDetailedReport = () => {
//     if (!detailedData || detailedData.length === 0) {
//       alert("Please generate the monthly report first");
//       return;
//     }
//     setDetailedReport(true);
//   };

//   const countTotalPresents = (attendance) => {
//     return Object.values(attendance).filter((status) => status === "P").length;
//   };

//   // Group detailed data by employee
//   const getGroupedDetailedData = () => {
//     const grouped = {};
//     detailedData.forEach(record => {
//       if (!grouped[record.employee_id]) {
//         grouped[record.employee_id] = {
//           full_name: record.full_name,
//           records: []
//         };
//       }
//       grouped[record.employee_id].records.push(record);
//     });
//     return grouped;
//   };

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'>
//         <i className="fas fa-clock"></i> Employee Attendance
//       </h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>
//           <div className="col-3">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}
//           >
//             Fetch Employee
//           </button>

//           <div className="col-3">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>

//           <div className="col-3">
//             <input
//               type="month"
//               id="attendance-month"
//               value={selectedMonth}
//               onChange={handleChangeMonth}
//               className='form-control'
//             />
//           </div>

//           <button
//             type="button"
//             className='btn btn-sm btn-danger ml-2'
//             onClick={getReport}
//           >
//             Get Report
//           </button>
//         </div>

//         <div>
//           <table className='table' style={{ border: '1px solid #dee2e6' }}>
//             <thead>
//               <tr>
//                 <th className='text-center'>Sr.No</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.length > 0 ? (
//                 employees.map((employee, index) => {
//                   const attendanceRecord = attendanceData.find(data => data.employee_id === employee.id);
//                   const status = attendanceRecord?.status || '';

//                   return (
//                     <tr key={employee.id}>
//                       <td className='text-center'>{index + 1}</td>
//                       <td>{employee.full_name}</td>
//                       <td>{employee.employee_post}</td>
//                       <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>

//                       <td className='text-center'>
//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="present"
//                             checked={status === 'present'}
//                             onChange={() => handleStatusChange(employee.id, 'present')}
//                           /> Present
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="casual_leave"
//                             checked={status === 'casual_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//                           /> C.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="earned_leave"
//                             checked={status === 'earned_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//                           /> E.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="maternity_leave"
//                             checked={status === 'maternity_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//                           /> M.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="ex_pakistan_leave"
//                             checked={status === 'ex_pakistan_leave'}
//                             onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//                           /> Ex-Pak.L
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="holiday"
//                             checked={status === 'holiday'}
//                             onChange={() => handleStatusChange(employee.id, 'holiday')}
//                           /> Holiday
//                         </span>

//                         <span style={{ marginRight: '20px' }}>
//                           <input
//                             type="radio"
//                             name={`status-${employee.id}`}
//                             value="lwp"
//                             checked={status === 'lwp'}
//                             onChange={() => handleStatusChange(employee.id, 'lwp')}
//                           /> LWP
//                         </span>
//                       </td>

//                       <td className='text-center'>
//                         <input
//                           type="text"
//                           value={attendanceRecord?.remarks || ''}
//                           onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={6} className='text-center'>
//                     Please select a date and click "Fetch Employee" to load attendance
//                   </td>
//                 </tr>
//               )}
//               {employees.length > 0 && (
//                 <tr>
//                   <td colSpan={5}></td>
//                   <td className='text-center'>
//                     <button type="submit" className='btn btn-sm btn-warning'>Submit Attendance</button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </form>

//       {/* Monthly Summary Report */}
//       {viewReport && (
//         <div style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           zIndex: "100",
//           backdropFilter: "blur(10px)",
//           width: "90%",
//           maxWidth: "1800px",
//           maxHeight: "90vh",
//           backgroundColor: "white",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           padding: "10px",
//           overflow: "hidden",
//         }}>
//           <div style={{
//             position: "sticky",
//             top: 0,
//             zIndex: 101,
//             backgroundColor: "#ebd197",
//             color: "black",
//             padding: "8px 16px",
//           }}>
//             <h5 style={{ margin: 0 }}>Monthly Attendance Summary - {forTheMonth} </h5>
//             <button
//               onClick={() => handleHide()}
//               style={{
//                 position: "absolute",
//                 top: "5px",
//                 right: "15px",
//                 background: "transparent",
//                 border: "none",
//                 fontSize: "20px",
//                 cursor: "pointer",
//                 color: "black",
//               }}
//             >
//               &times;
//             </button>

//           </div>
//               <div className='p-1 d-flex justify-content-end'>
//                  <button
//             type="button"
//             className='btn btn-sm btn-info ml-2'
//             onClick={getDetailedReport}
//           >
//             Detailed Report
//           </button>
//               </div>
//           <div style={{
//             padding: "20px",
//             marginTop: "10px",
//             width: "100%",
//             overflowY: "auto",
//             maxHeight: "calc(90vh - 80px)",
//             paddingTop: "5px",
//           }}>
//             <table border="1" style={{ width:"100%", fontSize: "12px" }} className='table table-bordered'>
//               <thead style={{ backgroundColor: "rgb(235, 209, 151)", color: "black", position: "sticky", top: 0, zIndex: 10 }}>
//                 <tr>
//                   <th>Sr#</th>
//                   <th>Employee Name</th>
//                   {daysInMonth.map((day) => (
//                     <th key={day} style={{ minWidth: "35px", textAlign: "center" }}>{day}</th>
//                   ))}
//                   <th>P</th>
//                   <th>CL</th>
//                   <th>EL</th>
//                   <th>ML</th>
//                   <th>EPL</th>
//                   <th>H</th>
//                   <th>LWP</th>
//                   {/* <th>Total Days</th>
//                   <th>Working Hours</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendanceDataMapped.map((employee, index) => {
//                   const attendanceValues = Object.values(employee.attendance);
//                   const presentCount = attendanceValues.filter(s => s === "P").length;
//                   const casualLeaveCount = attendanceValues.filter(s => s === "CL").length;
//                   const earnedLeaveCount = attendanceValues.filter(s => s === "EL").length;
//                   const maternityLeaveCount = attendanceValues.filter(s => s === "ML").length;
//                   const exPakLeaveCount = attendanceValues.filter(s => s === "EPL").length;
//                   const holidayCount = attendanceValues.filter(s => s === "H").length;
//                   const lwpCount = attendanceValues.filter(s => s === "LWP").length;
//                   const totalDays = presentCount + casualLeaveCount + earnedLeaveCount + maternityLeaveCount + exPakLeaveCount + holidayCount + lwpCount;
//                   const workingHours = (presentCount * 8).toFixed(2);

//                   return (
//                     <tr key={index}>
//                       <td style={{ textAlign: "center" }}>{index + 1}</td>
//                       <td style={{ minWidth: "150px", whiteSpace: "nowrap" }}>{employee.full_name}</td>
//                       {daysInMonth.map((day) => (
//                         <td key={day} className={getStatusClass(employee.attendance[day])} style={{ textAlign: "center", padding: "5px" }}>
//                           {getEmployeeAttendanceStatus(employee, day)}
//                         </td>
//                       ))}
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{presentCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{casualLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{earnedLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{maternityLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{exPakLeaveCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{holidayCount}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold" }}>{lwpCount}</td>
//                       {/* <td style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>{totalDays}</td>
//                       <td style={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#f0f0f0" }}>{workingHours}</td> */}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Detailed Report with Timestamps */}
//       {detailedReport && (
//         <div style={{
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           zIndex: "100",
//           backdropFilter: "blur(10px)",
//           width: "90%",
//           maxWidth: "1800px",
//           maxHeight: "90vh",
//           backgroundColor: "white",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           padding: "10px",
//           overflow: "hidden",
//         }}>
//           <div style={{
//             position: "sticky",
//             top: 0,
//             zIndex: 101,
//             backgroundColor: "rgb(235, 209, 151)",
//             color: "black",
//             padding: "8px 16px",
//           }}>
//             <h5 style={{ margin: 0 }}>Detailed Attendance Report - {forTheMonth}</h5>
//             <button
//               onClick={() => handleHideDetailed()}
//               style={{
//                 position: "absolute",
//                 top: "5px",
//                 right: "15px",
//                 background: "transparent",
//                 border: "none",
//                 fontSize: "20px",
//                 cursor: "pointer",
//                 color: "white",
//               }}
//             >
//               &times;
//             </button>
//           </div>

//           <div style={{
//             padding: "20px",
//             marginTop: "10px",
//             width: "100%",
//             overflowY: "auto",
//             maxHeight: "calc(90vh - 80px)",
//             paddingTop: "5px",
//           }}>
//             {Object.entries(getGroupedDetailedData()).map(([employeeId, employeeData], empIndex) => (
//               <div key={employeeId} style={{ marginBottom: "30px" }}>
//                 <h6 style={{
//                   backgroundColor: "rgb(235, 209, 151)",
//                   color: "black",
//                   padding: "10px",
//                   borderRadius: "5px"
//                 }}>
//                   {empIndex + 1}. {employeeData.full_name}
//                 </h6>
//                 <table className='table table-bordered table-sm' style={{ fontSize: "11px" }}>
//                   <thead style={{ backgroundColor: "#f8f9fa" }}>
//                     <tr>
//                       <th style={{ width: "5%" }}>Sr#</th>
//                       <th style={{ width: "12%" }}>Date</th>
//                       <th style={{ width: "15%" }}>Status</th>
//                       <th style={{ width: "20%" }}>Remarks</th>
//                       <th style={{ width: "24%" }}>First Punch (Check-in)</th>
//                       <th style={{ width: "24%" }}>Last Punch (Check-out)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {employeeData.records
//                       .sort((a, b) => new Date(a.date) - new Date(b.date))
//                       .map((record, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td>{new Date(record.date).toLocaleDateString('en-GB')}</td>
//                           <td>
//                             <span style={{
//                               padding: "3px 8px",
//                               borderRadius: "3px",
//                               backgroundColor: record.status === 'present' ? '#28a745' :
//                                              record.status === 'casual_leave' ? '#ffc107' :
//                                              record.status === 'earned_leave' ? '#17a2b8' :
//                                              record.status === 'holiday' ? '#6c757d' : '#dc3545',
//                               color: 'white',
//                               fontSize: "10px",
//                               fontWeight: "bold"
//                             }}>
//                               {getFullStatus(record.status)}
//                             </span>
//                           </td>
//                           <td>{record.remarks || '-'}</td>
//                           <td style={{ color: "#28a745", fontWeight: "500" }}>
//                             {formatTimestamp(record.first_punch)}
//                           </td>
//                           <td style={{ color: "#dc3545", fontWeight: "500" }}>
//                             {formatTimestamp(record.last_punch)}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .status-absent { background-color: #ffcccc; }
//         .status-present { background-color: #ccffcc; }
//         .status-earned-leave { background-color: #f4bc8fff; }
//         .status-casual-leave { background-color: #fff3cd; }
//         .status-lwp { background-color: #f8d7da; }
//         .status-holiday { background-color: #d1ecf1; }
//         .status-ex-pakistan-leave { background-color: #e7e7ff; }
//         .status-maternity-leave { background-color: #ffe5e5; }
//       `}</style>
//     </div>
//   );
// };

// export default AttendanceForm;

// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AttendanceForm = () => {
//   const [employees, setEmployees] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [error, setError] = useState('');
//   const [bulkStatus, setBulkStatus] = useState('');
//   const [viewReport, setViewReport] = useState(false);
//   const [attendanceReport, setAttendanceReport] = useState([]);
//   const [forTheMonth, setForTheMonth] = useState("");
//   const [daysInMonth, setDaysInMonth] = useState([]);
//   const [attendanceDataMapped, setAttendanceDataMapped] = useState([]);
//   const [attendance, setAttendance] = useState(false);
//   const [detailedReport, setDetailedReport] = useState(false);
//   const [detailedData, setDetailedData] = useState([]);

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'N/A';
//     const date = new Date(timestamp);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });
//   };

//   const fetchAttendanceData = () => {
//     if (selectedMonth === "") {
//       alert("Please first select month");
//       return false;
//     }

//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/attendance-report-data", {
//         params: {
//           for_the_month: selectedMonth,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//         },
//       })
//       .then((res) => {
//         const data = res.data.results;
//         setAttendanceReport(data);
//         setForTheMonth(res.data.for_the_month);
//         setDaysInMonth(getDaysInMonth(res.data.for_the_month));
//         mapAttendanceDataToEmployees(data);
//         setDetailedData(data);
//         setAttendance(true);
//       })
//       .catch((err) => console.log(err));
//   };

//   const getShortForm = (status) => {
//     switch (status) {
//       case "earned_leave": return "EL";
//       case "present": return "P";
//       case "absent": return "A";
//       case "holiday": return "H";
//       case "lwp": return "LWP";
//       case "casual_leave": return "CL";
//       case "ex_pakistan_leave": return "EPL";
//       case "maternity_leave": return "ML";
//       default: return status;
//     }
//   };

//   const getFullStatus = (status) => {
//     switch (status) {
//       case "earned_leave": return "Earned Leave";
//       case "present": return "Present";
//       case "absent": return "Absent";
//       case "holiday": return "Holiday";
//       case "lwp": return "Leave Without Pay";
//       case "casual_leave": return "Casual Leave";
//       case "ex_pakistan_leave": return "Ex-Pakistan Leave";
//       case "maternity_leave": return "Maternity Leave";
//       default: return status;
//     }
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "A": return "status-absent";
//       case "P": return "status-present";
//       case "EL": return "status-earned-leave";
//       case "CL": return "status-casual-leave";
//       case "LWP": return "status-lwp";
//       case "H": return "status-holiday";
//       case "EPL": return "status-ex-pakistan-leave";
//       case "ML": return "status-maternity-leave";
//       default: return "";
//     }
//   };

//   const mapAttendanceDataToEmployees = (data) => {
//     const employeeAttendanceMap = {};

//     data.forEach((attendance) => {
//       const { employee_id, full_name, date, status } = attendance;
//       const day = new Date(date).getDate();

//       if (!employeeAttendanceMap[employee_id]) {
//         employeeAttendanceMap[employee_id] = {
//           full_name,
//           attendance: {},
//         };
//       }
//       employeeAttendanceMap[employee_id].attendance[day] = getShortForm(status);
//     });

//     setAttendanceDataMapped(Object.values(employeeAttendanceMap));
//   };

//   const getDaysInMonth = (monthYear) => {
//     const [year, month] = monthYear.split("-");
//     return new Array(new Date(year, month, 0).getDate())
//       .fill(null)
//       .map((_, i) => i + 1);
//   };

//   const getEmployeeAttendanceStatus = (employee, day) => {
//     return employee.attendance[day] || "";
//   };

//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('Please select a date for attendance');
//       return;
//     }

//     setError('');

//     axios.get(
//       `${process.env.REACT_APP_API_BASE_URL}/employee-attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`
//     )
//       .then(res => {
//         const { employees: fetchedEmployees, attendance: existingAttendance } = res.data;

//         setEmployees(fetchedEmployees);

//         const existingAttendanceMap = new Map(
//           existingAttendance.map(item => [item.employee_id, item])
//         );

//         const updatedAttendanceData = fetchedEmployees.map(employee => {
//           if (existingAttendanceMap.has(employee.id)) {
//             const existingRecord = existingAttendanceMap.get(employee.id);
//             return {
//               hidden_id: existingRecord.id,
//               employee_id: employee.id,
//               status: existingRecord.status || '',
//               remarks: existingRecord.remarks || ''
//             };
//           } else {
//             return {
//               employee_id: employee.id,
//               status: '',
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//       })
//       .catch(err => {
//         console.error('Error fetching attendance:', err);
//         setError('Failed to fetch attendance data');
//       });
//   };

//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status);
//     setAttendanceData(prevData =>
//       prevData.map(data => ({ ...data, status }))
//     );
//   };

//   const handleStatusChange = (employee_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, status } : data
//       )
//     );
//   };

//   const handleRemarksChange = (employee_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.employee_id === employee_id ? { ...data, remarks } : data
//       )
//     );
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   const handleChangeMonth = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const unselectedEmployees = attendanceData.filter(data => !data.status || data.status === '');

//     if (unselectedEmployees.length > 0) {
//       alert(`Please select attendance status for all employees. ${unselectedEmployees.length} employee(s) have no status selected.`);
//       return;
//     }

//     let confirmed = window.confirm("Are you sure you want to mark attendance?");

//     if (confirmed) {
//       if (!selectedDate) {
//         alert('Please select a date for attendance');
//         return;
//       }

//       try {
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id
//         });
//         setSelectedDate('');
//         setAttendanceData([]);
//         setEmployees([]);
//         toast.success('Attendance Marked Successfully!');
//       } catch (error) {
//         console.error('There was an error!', error);
//         toast.error('Failed to submit attendance');
//       }
//     }
//   };

//   const handleHide = () => {
//     setViewReport(false);
//     setAttendance(false);
//   };

//   const handleHideDetailed = () => {
//     setDetailedReport(false);
//   };

//   const getReport = () => {
//     fetchAttendanceData();
//     setViewReport(true);
//   };

//   const getDetailedReport = () => {
//     if (!detailedData || detailedData.length === 0) {
//       alert("Please generate the monthly report first");
//       return;
//     }
//     setDetailedReport(true);
//   };

//   const getGroupedDetailedData = () => {
//     const grouped = {};
//     detailedData.forEach(record => {
//       if (!grouped[record.employee_id]) {
//         grouped[record.employee_id] = {
//           full_name: record.full_name,
//           records: []
//         };
//       }
//       grouped[record.employee_id].records.push(record);
//     });
//     return grouped;
//   };

//   return (
//     <div className='attendance-wrapper'>
//       <div className='page-header'>
//         <h5>Employee Attendance</h5>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className='controls-row'>
//           <div className='form-field'>
//             <label>Select Date</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-input'
//             />
//           </div>

//           <button type="button" className='btn btn-fetch' onClick={handleFetchAttendance}>
//             Fetch Employee
//           </button>

//           <div className='form-field'>
//             <label>Bulk Status</label>
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-select"
//             >
//               <option value="">Select Status for All</option>
//               <option value="present">Present</option>
//               <option value="casual_leave">Casual Leave</option>
//               <option value="earned_leave">Earned Leave</option>
//               <option value="maternity_leave">Maternity Leave</option>
//               <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
//               <option value="holiday">Holiday</option>
//               <option value="lwp">Leave Without Pay</option>
//             </select>
//           </div>

//           <div className='form-field'>
//             <label>Select Month</label>
//             <input
//               type="month"
//               value={selectedMonth}
//               onChange={handleChangeMonth}
//               className='form-input'
//             />
//           </div>

//           <button type="button" className='btn btn-report' onClick={getReport}>
//             Get Report
//           </button>
//         </div>

//         {error && <div className="error-msg">{error}</div>}

//         <div className='table-wrapper'>
//           <table className='simple-table'>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Job Type</th>
//                 <th>Status</th>
//                 <th>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employees.length > 0 ? (
//                 employees.map((employee, index) => {
//                   const attendanceRecord = attendanceData.find(data => data.employee_id === employee.id);
//                   const status = attendanceRecord?.status || '';

//                   return (
//                     <tr key={employee.id}>
//                       {/* <td>{index + 1}</td> */}
//                         <td>{employee.id}</td>
//                       <td>{employee.full_name}</td>
//                       <td>{employee.employee_post}</td>
//                       <td>{employee.pay_scale + " (" + employee.job_type + ")"}</td>
//                       <td>
//                         <div className='status-options'>
//                           <label className='radio-option'>
//                             <input
//                               type="radio"
//                               name={`status-${employee.id}`}
//                               value="present"
//                               checked={status === 'present'}
//                               onChange={() => handleStatusChange(employee.id, 'present')}
//                             />
//                             <span>Present</span>
//                           </label>

//                           <label className='radio-option'>
//                             <input
//                               type="radio"
//                               name={`status-${employee.id}`}
//                               value="casual_leave"
//                               checked={status === 'casual_leave'}
//                               onChange={() => handleStatusChange(employee.id, 'casual_leave')}
//                             />
//                             <span>C.L</span>
//                           </label>

//                           <label className='radio-option'>
//                             <input
//                               type="radio"
//                               name={`status-${employee.id}`}
//                               value="earned_leave"
//                               checked={status === 'earned_leave'}
//                               onChange={() => handleStatusChange(employee.id, 'earned_leave')}
//                             />
//                             <span>E.L</span>
//                           </label>

//                           <label className='radio-option'>
//                             <input
//                               type="radio"
//                               name={`status-${employee.id}`}
//                               value="maternity_leave"
//                               checked={status === 'maternity_leave'}
//                               onChange={() => handleStatusChange(employee.id, 'maternity_leave')}
//                             />
//                             <span>M.L</span>
//                           </label>

//                           <label className='radio-option'>
//                             <input
//                               type="radio"
//                               name={`status-${employee.id}`}
//                               value="ex_pakistan_leave"
//                               checked={status === 'ex_pakistan_leave'}
//                               onChange={() => handleStatusChange(employee.id, 'ex_pakistan_leave')}
//                             />
//                             <span>Ex-Pak.L</span>
//                           </label>

//                           <label className='radio-option'>
//                             <input
//                               type="radio"
//                               name={`status-${employee.id}`}
//                               value="holiday"
//                               checked={status === 'holiday'}
//                               onChange={() => handleStatusChange(employee.id, 'holiday')}
//                             />
//                             <span>Holiday</span>
//                           </label>

//                           <label className='radio-option'>
//                             <input
//                               type="radio"
//                               name={`status-${employee.id}`}
//                               value="lwp"
//                               checked={status === 'lwp'}
//                               onChange={() => handleStatusChange(employee.id, 'lwp')}
//                             />
//                             <span>LWP</span>
//                           </label>
//                         </div>
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           className='remarks-field'
//                           placeholder='Remarks'
//                           value={attendanceRecord?.remarks || ''}
//                           onChange={(e) => handleRemarksChange(employee.id, e.target.value)}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={6} style={{textAlign: 'center', padding: '30px', color: '#666'}}>
//                     Please select a date and click "Fetch Employee" to load attendance
//                   </td>
//                 </tr>
//               )}
//               {employees.length > 0 && (
//                 <tr>
//                   <td colSpan={6} style={{textAlign: 'center', padding: '15px'}}>
//                     <button type="submit" className='btn btn-submit'>Submit Attendance</button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </form>

//       {/* Monthly Report */}
//       {viewReport && (
//         <div className='modal-back'>
//           <div className='modal-box'>
//             <div className='modal-top'>
//               <h6>Monthly Attendance Summary - {forTheMonth}</h6>
//               <button onClick={handleHide} className='close-btn'>&times;</button>
//             </div>

//             <div style={{padding: '10px', textAlign: 'right'}}>
//               <button className='btn btn-detail' onClick={getDetailedReport}>
//                 Detailed Report
//               </button>
//             </div>

//             <div className='modal-body'>
//               <table className='report-table'>
//                 <thead>
//                   <tr>
//                     <th>Sr#</th>
//                     <th>Employee Name</th>
//                     {daysInMonth.map((day) => (
//                       <th key={day}>{day}</th>
//                     ))}
//                     <th>P</th>
//                     <th>CL</th>
//                     <th>EL</th>
//                     <th>ML</th>
//                     <th>EPL</th>
//                     <th>H</th>
//                     <th>LWP</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendanceDataMapped.map((employee, index) => {
//                     const attendanceValues = Object.values(employee.attendance);
//                     const presentCount = attendanceValues.filter(s => s === "P").length;
//                     const casualLeaveCount = attendanceValues.filter(s => s === "CL").length;
//                     const earnedLeaveCount = attendanceValues.filter(s => s === "EL").length;
//                     const maternityLeaveCount = attendanceValues.filter(s => s === "ML").length;
//                     const exPakLeaveCount = attendanceValues.filter(s => s === "EPL").length;
//                     const holidayCount = attendanceValues.filter(s => s === "H").length;
//                     const lwpCount = attendanceValues.filter(s => s === "LWP").length;

//                     return (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td style={{textAlign: 'left'}}>{employee.full_name}</td>
//                         {daysInMonth.map((day) => (
//                           <td key={day} className={getStatusClass(employee.attendance[day])}>
//                             {getEmployeeAttendanceStatus(employee, day)}
//                           </td>
//                         ))}
//                         <td><strong>{presentCount}</strong></td>
//                         <td><strong>{casualLeaveCount}</strong></td>
//                         <td><strong>{earnedLeaveCount}</strong></td>
//                         <td><strong>{maternityLeaveCount}</strong></td>
//                         <td><strong>{exPakLeaveCount}</strong></td>
//                         <td><strong>{holidayCount}</strong></td>
//                         <td><strong>{lwpCount}</strong></td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Detailed Report */}
//       {detailedReport && (
//         <div className='modal-back'>
//           <div className='modal-box'>
//             <div className='modal-top'>
//               <h6>Detailed Attendance Report - {forTheMonth}</h6>
//               <button onClick={handleHideDetailed} className='close-btn'>&times;</button>
//             </div>

//             <div className='modal-body'>
//               {Object.entries(getGroupedDetailedData()).map(([employeeId, employeeData], empIndex) => (
//                 <div key={employeeId} style={{marginBottom: '25px'}}>
//                   <div style={{
//                     background: '#f5f5f5',
//                     padding: '10px',
//                     borderRadius: '4px',
//                     marginBottom: '10px',
//                     fontWeight: '600'
//                   }}>
//                     {empIndex + 1}. {employeeData.full_name}
//                   </div>
//                   <table className='detail-table'>
//                     <thead>
//                       <tr>
//                         <th>Sr#</th>
//                         <th>Date</th>
//                         <th>Status</th>
//                         <th>Remarks</th>
//                         <th>Check-in</th>
//                         <th>Check-out</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {employeeData.records
//                         .sort((a, b) => new Date(a.date) - new Date(b.date))
//                         .map((record, index) => (
//                           <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{new Date(record.date).toLocaleDateString('en-GB')}</td>
//                             <td>{getFullStatus(record.status)}</td>
//                             <td>{record.remarks || '-'}</td>
//                             <td>{formatTimestamp(record.first_punch)}</td>
//                             <td>{formatTimestamp(record.last_punch)}</td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//        <style jsx>{`
//        .status-absent { background-color: #ffcccc; }
//         .status-present { background-color: #ccffcc; }
//         .status-earned-leave { background-color: #f4bc8fff; }
//         .status-casual-leave { background-color: #fff3cd; }
//        .status-lwp { background-color: #f8d7da; }
//        .status-holiday { background-color: #d1ecf1; }
//         .status-ex-pakistan-leave { background-color: #e7e7ff; }
//        .status-maternity-leave { background-color: #ffe5e5; }
//        /* Simple and Professional Attendance Form CSS */

// .attendance-wrapper {
//   padding: 20px;
//   max-width: 100%;
// }

// /* Header */
// .page-header {
//   background: rgb(235, 209, 151);
//   color: black;
//   padding: 15px 20px;
//   border-radius: 4px;
//   margin-bottom: 20px;
// }

// .page-header h5 {
//   margin: 0;
//   font-size: 18px;
//   font-weight: 500;
// }

// /* Controls Row */
// .controls-row {
//   display: flex;
//   gap: 15px;
//   margin-bottom: 20px;
//   align-items: flex-end;
//   flex-wrap: wrap;
//   background: #f8f9fa;
//   padding: 15px;
//   border-radius: 4px;
// }

// .form-field {
//   display: flex;
//   flex-direction: column;
//   gap: 5px;
//   min-width: 180px;
// }

// .form-field label {
//   font-size: 13px;
//   font-weight: 500;
//   color: #333;
// }

// .form-input,
// .form-select {
//   padding: 8px 10px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 14px;
// }

// .form-input:focus,
// .form-select:focus {
//   outline: none;
//   border-color: rgb(235, 209, 151);
// }

// /* Buttons */
// .btn {
//   padding: 8px 20px;
//   border: none;
//   border-radius: 4px;
//   font-size: 14px;
//   cursor: pointer;
//   font-weight: 500;
// }

// .btn-fetch {
//   background: #3498db;
//   color: black;
// }

// .btn-fetch:hover {
//   background: #2980b9;
// }

// .btn-report {
//   background: #e74c3c;
//   color: black;
// }

// .btn-report:hover {
//   background: #c0392b;
// }

// .btn-submit {
//   background: rgb(235, 209, 151);
//   color: black;
//   padding: 10px 30px;
// }

// .btn-submit:hover {
//   background: #229954;
// }

// .btn-detail {
//   background: #3498db;
//   color: black;
//   padding: 8px 16px;
//   border: none;
//   border-radius: 4px;
//   font-size: 13px;
//   cursor: pointer;
// }

// .btn-detail:hover {
//   background: #2980b9;
// }

// /* Error Message */
// .error-msg {
//   background: #fee;
//   color: #c33;
//   padding: 10px;
//   border-radius: 4px;
//   margin-bottom: 15px;
//   border-left: 3px solid #c33;
// }

// /* Table */
// .table-wrapper {
//   background: white;
//   border-radius: 4px;
//   overflow-x: auto;
// }

// .simple-table {
//   width: 100%;
//   border-collapse: collapse;
// }

// .simple-table thead {
//   background: rgb(235, 209, 151);
//   color: black;
// }

// .simple-table th {
//   padding: 12px;
//   text-align: left;
//   font-weight: 500;
//   font-size: 14px;
// }

// .simple-table td {
//   padding: 12px;
//   border-bottom: 1px solid #eee;
//   font-size: 14px;
// }

// .simple-table tbody tr:hover {
//   background: #f8f9fa;
// }

// /* Status Radio Options */
// .status-options {
//   display: flex;
//   gap: 12px;
//   flex-wrap: wrap;
// }

// .radio-option {
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   cursor: pointer;
//   font-size: 13px;
// }

// .radio-option input[type="radio"] {
//   cursor: pointer;
// }

// .radio-option span {
//   user-select: none;
// }

// /* Remarks Field */
// .remarks-field {
//   width: 100%;
//   padding: 6px 10px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   font-size: 13px;
// }

// .remarks-field:focus {
//   outline: none;
//   border-color: rgb(235, 209, 151);
// }

// /* Modal */
// .modal-back {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0, 0, 0, 0.5);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
//   padding: 20px;
// }

// .modal-box {
//   background: white;
//   border-radius: 4px;
//   width: 95%;
//   max-width: 1600px;
//   max-height: 90vh;
//   display: flex;
//   flex-direction: column;
// }

// .modal-top {
//   background: #34495e;
//   color: black;
//   padding: 15px 20px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }

// .modal-top h6 {
//   margin: 0;
//   font-size: 16px;
//   font-weight: 500;
// }

// .close-btn {
//   background: none;
//   border: none;
//   color: black;
//   font-size: 28px;
//   cursor: pointer;
//   line-height: 1;
//   padding: 0;
//   width: 30px;
//   height: 30px;
// }

// .close-btn:hover {
//   opacity: 0.8;
// }

// .modal-body {
//   padding: 20px;
//   overflow-y: auto;
//   flex: 1;
// }

// /* Report Table */
// .report-table {
//   width: 100%;
//   border-collapse: collapse;
//   font-size: 12px;
//   border: 1px solid #ddd;
// }

// .report-table thead {
//   position: sticky;
//   top: 0;
//   background: #34495e;
//   color: black;
// }

// .report-table th {
//   padding: 10px 5px;
//   text-align: center;
//   border: 1px solid #ddd;
//   font-weight: 500;
// }

// .report-table td {
//   padding: 8px 5px;
//   text-align: center;
//   border: 1px solid #ddd;
// }

// /* Status Colors */
// .status-present {
//   background: #d4edda;
// }

// .status-casual-leave {
//   background: #fff3cd;
// }

// .status-earned-leave {
//   background: #d1ecf1;
// }

// .status-maternity-leave {
//   background: #f8d7da;
// }

// .status-ex-pakistan-leave {
//   background: #e2e3e5;
// }

// .status-holiday {
//   background: #cce5ff;
// }

// .status-lwp {
//   background: #f5c6cb;
// }

// /* Detail Table */
// .detail-table {
//   width: 100%;
//   border-collapse: collapse;
//   font-size: 12px;
//   border: 1px solid #ddd;
// }

// .detail-table thead {
//   background: #ecf0f1;
// }

// .detail-table th {
//   padding: 10px;
//   text-align: left;
//   border: 1px solid #ddd;
//   font-weight: 500;
// }

// .detail-table td {
//   padding: 10px;
//   border: 1px solid #ddd;
// }

// .detail-table tbody tr:hover {
//   background: #f8f9fa;
// }

// /* Responsive */
// @media (max-width: 768px) {
//   .controls-row {
//     flex-direction: column;
//   }

//   .form-field {
//     width: 100%;
//   }

//   .btn {
//     width: 100%;
//   }

//   .status-options {
//     flex-direction: column;
//     gap: 8px;
//   }

//   .modal-box {
//     width: 100%;
//     max-height: 95vh;
//   }
// }
//      `}</style>
//     </div>
//   );
// };

// export default AttendanceForm;

import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AcademicSessionContext from "./AcademicSessionContext";
import { useAuth } from "./AuthContext";

const AttendanceForm = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [error, setError] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [viewReport, setViewReport] = useState(false);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [forTheMonth, setForTheMonth] = useState("");
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [attendanceDataMapped, setAttendanceDataMapped] = useState([]);
  const [attendance, setAttendance] = useState(false);
  const [detailedReport, setDetailedReport] = useState(false);
  const [detailedData, setDetailedData] = useState([]);

  // New state for status count report
  const [showStatusCount, setShowStatusCount] = useState(false);
  const [statusCountData, setStatusCountData] = useState([]);
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");

  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const fetchAttendanceData = () => {
    if (selectedMonth === "") {
      alert("Please first select month");
      return false;
    }

    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/attendance-report-data", {
        params: {
          for_the_month: selectedMonth,
          session_id: academicSession,
          campus_id: user.user.campus_id,
        },
      })
      .then((res) => {
        const data = res.data.results;
        setAttendanceReport(data);
        setForTheMonth(res.data.for_the_month);
        setDaysInMonth(getDaysInMonth(res.data.for_the_month));
        mapAttendanceDataToEmployees(data);
        setDetailedData(data);
        setAttendance(true);
      })
      .catch((err) => console.log(err));
  };

  // New function to fetch status count data
  const fetchStatusCountData = () => {
    if (!fromMonth || !toMonth) {
      alert("Please select both From Month and To Month");
      return;
    }

    if (fromMonth > toMonth) {
      alert("From Month cannot be greater than To Month");
      return;
    }

    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/attendance-status-count", {
        params: {
          from_month: fromMonth,
          to_month: toMonth,
          session_id: academicSession,
          campus_id: user.user.campus_id,
        },
      })
      .then((res) => {
        setStatusCountData(res.data.results);
        setShowStatusCount(true);
      })
      .catch((err) => {
        console.error("Error fetching status count:", err);
        alert("Failed to fetch status count data");
      });
  };

  const getShortForm = (status) => {
    switch (status) {
      case "earned_leave":
        return "EL";
      case "present":
        return "P";
      case "absent":
        return "A";
      case "holiday":
        return "H";
      case "lwp":
        return "LWP";
      case "casual_leave":
        return "CL";
      case "ex_pakistan_leave":
        return "EPL";
      case "maternity_leave":
        return "ML";
      default:
        return status;
    }
  };

  const getFullStatus = (status) => {
    switch (status) {
      case "earned_leave":
        return "Earned Leave";
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "holiday":
        return "Holiday";
      case "lwp":
        return "Leave Without Pay";
      case "casual_leave":
        return "Casual Leave";
      case "ex_pakistan_leave":
        return "Ex-Pakistan Leave";
      case "maternity_leave":
        return "Maternity Leave";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "A":
        return "status-absent";
      case "P":
        return "status-present";
      case "EL":
        return "status-earned-leave";
      case "CL":
        return "status-casual-leave";
      case "LWP":
        return "status-lwp";
      case "H":
        return "status-holiday";
      case "EPL":
        return "status-ex-pakistan-leave";
      case "ML":
        return "status-maternity-leave";
      default:
        return "";
    }
  };

  const mapAttendanceDataToEmployees = (data) => {
    const employeeAttendanceMap = {};

    data.forEach((attendance) => {
      const { employee_id, full_name, date, status } = attendance;
      const day = new Date(date).getDate();

      if (!employeeAttendanceMap[employee_id]) {
        employeeAttendanceMap[employee_id] = {
          full_name,
          attendance: {},
        };
      }
      employeeAttendanceMap[employee_id].attendance[day] = getShortForm(status);
    });

    setAttendanceDataMapped(Object.values(employeeAttendanceMap));
  };

  const getDaysInMonth = (monthYear) => {
    const [year, month] = monthYear.split("-");
    return new Array(new Date(year, month, 0).getDate())
      .fill(null)
      .map((_, i) => i + 1);
  };

  const getEmployeeAttendanceStatus = (employee, day) => {
    return employee.attendance[day] || "";
  };

  const handleFetchAttendance = () => {
    if (!selectedDate) {
      alert("Please select a date for attendance");
      return;
    }

    setError("");

    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/employee-attendance/${selectedDate}/${user.user.campus_id}/${academicSession}`,
      )
      .then((res) => {
        const { employees: fetchedEmployees, attendance: existingAttendance } =
          res.data;

        setEmployees(fetchedEmployees);

        const existingAttendanceMap = new Map(
          existingAttendance.map((item) => [item.employee_id, item]),
        );

        const updatedAttendanceData = fetchedEmployees.map((employee) => {
          if (existingAttendanceMap.has(employee.id)) {
            const existingRecord = existingAttendanceMap.get(employee.id);
            return {
              hidden_id: existingRecord.id,
              employee_id: employee.id,
              status: existingRecord.status || "",
              remarks: existingRecord.remarks || "",
            };
          } else {
            return {
              employee_id: employee.id,
              status: "",
              remarks: "",
            };
          }
        });

        setAttendanceData(updatedAttendanceData);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setError("Failed to fetch attendance data");
      });
  };

  const handleBulkStatusChange = (status) => {
    setBulkStatus(status);
    setAttendanceData((prevData) =>
      prevData.map((data) => ({ ...data, status })),
    );
  };

  const handleStatusChange = (employee_id, status) => {
    setAttendanceData((prevData) =>
      prevData.map((data) =>
        data.employee_id === employee_id ? { ...data, status } : data,
      ),
    );
  };

  const handleRemarksChange = (employee_id, remarks) => {
    setAttendanceData((prevData) =>
      prevData.map((data) =>
        data.employee_id === employee_id ? { ...data, remarks } : data,
      ),
    );
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleChangeMonth = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unselectedEmployees = attendanceData.filter(
      (data) => !data.status || data.status === "",
    );

    // if (unselectedEmployees.length > 0) {
    //   alert(`Please select attendance status for all employees. ${unselectedEmployees.length} employee(s) have no status selected.`);
    //   return;
    // }

    let confirmed = window.confirm("Are you sure you want to mark attendance?");

    if (confirmed) {
      if (!selectedDate) {
        alert("Please select a date for attendance");
        return;
      }

      try {
        await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/submit-attendance",
          {
            date: selectedDate,
            attendanceData,
            user_id: user.user.user_id,
            session_id: academicSession,
            campus_id: user.user.campus_id,
          },
        );
        setSelectedDate("");
        setAttendanceData([]);
        setEmployees([]);
        toast.success("Attendance Marked Successfully!");
      } catch (error) {
        console.error("There was an error!", error);
        toast.error("Failed to submit attendance");
      }
    }
  };

  const handleHide = () => {
    setViewReport(false);
    setAttendance(false);
  };

  const handleHideDetailed = () => {
    setDetailedReport(false);
  };

  const handleHideStatusCount = () => {
    setShowStatusCount(false);
  };

  const getReport = () => {
    fetchAttendanceData();
    setViewReport(true);
  };

  const getDetailedReport = () => {
    if (!detailedData || detailedData.length === 0) {
      alert("Please generate the monthly report first");
      return;
    }
    setDetailedReport(true);
  };

  const getGroupedDetailedData = () => {
    const grouped = {};
    detailedData.forEach((record) => {
      if (!grouped[record.employee_id]) {
        grouped[record.employee_id] = {
          full_name: record.full_name,
          records: [],
        };
      }
      grouped[record.employee_id].records.push(record);
    });
    return grouped;
  };

  return (
    <div className="attendance-wrapper">
      <div className="page-header">
        <h5>Employee Attendance</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="controls-row">
          <div className="form-field">
            <label>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="form-input"
            />
          </div>

          <button
            type="button"
            className="btn btn-fetch"
            onClick={handleFetchAttendance}
          >
            Fetch Employee
          </button>

          <div className="form-field">
            <label>Bulk Status</label>
            <select
              value={bulkStatus}
              onChange={(e) => handleBulkStatusChange(e.target.value)}
              className="form-select"
            >
              <option value="">Select Status for All</option>
              <option value="present">Present</option>
              <option value="casual_leave">Casual Leave</option>
              <option value="earned_leave">Earned Leave</option>
              <option value="maternity_leave">Maternity Leave</option>
              <option value="ex_pakistan_leave">Ex-Pakistan Leave</option>
              <option value="holiday">Holiday</option>
              <option value="lwp">Leave Without Pay</option>
            </select>
          </div>

          <div className="form-field">
            <label>Select Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleChangeMonth}
              className="form-input"
            />
          </div>

          <button type="button" className="btn btn-report" onClick={getReport}>
            Get Report
          </button>
        </div>

        {/* New Status Count Section */}
        <div
          className="controls-row"
          style={{ marginTop: "10px", background: "#e8f4f8" }}
        >
          <div className="form-field">
            <label>From Month</label>
            <input
              type="month"
              value={fromMonth}
              onChange={(e) => setFromMonth(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label>To Month</label>
            <input
              type="month"
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="button"
            className="btn btn-status-count"
            onClick={fetchStatusCountData}
          >
            Get Status Count Report
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="table-wrapper">
          <table className="simple-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Job Type</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee, index) => {
                  const attendanceRecord = attendanceData.find(
                    (data) => data.employee_id === employee.id,
                  );
                  const status = attendanceRecord?.status || "";

                  return (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.full_name}</td>
                      <td>{employee.employee_post}</td>
                      <td>
                        {employee.pay_scale + " (" + employee.job_type + ")"}
                      </td>
                      <td>
                        <div className="status-options">
                          <label className="radio-option">
                            <input
                              type="radio"
                              name={`status-${employee.id}`}
                              value="present"
                              checked={status === "present"}
                              onChange={() =>
                                handleStatusChange(employee.id, "present")
                              }
                            />
                            <span>Present</span>
                          </label>

                          <label className="radio-option">
                            <input
                              type="radio"
                              name={`status-${employee.id}`}
                              value="casual_leave"
                              checked={status === "casual_leave"}
                              onChange={() =>
                                handleStatusChange(employee.id, "casual_leave")
                              }
                            />
                            <span>C.L</span>
                          </label>

                          <label className="radio-option">
                            <input
                              type="radio"
                              name={`status-${employee.id}`}
                              value="earned_leave"
                              checked={status === "earned_leave"}
                              onChange={() =>
                                handleStatusChange(employee.id, "earned_leave")
                              }
                            />
                            <span>E.L</span>
                          </label>

                          <label className="radio-option">
                            <input
                              type="radio"
                              name={`status-${employee.id}`}
                              value="maternity_leave"
                              checked={status === "maternity_leave"}
                              onChange={() =>
                                handleStatusChange(
                                  employee.id,
                                  "maternity_leave",
                                )
                              }
                            />
                            <span>M.L</span>
                          </label>

                          <label className="radio-option">
                            <input
                              type="radio"
                              name={`status-${employee.id}`}
                              value="ex_pakistan_leave"
                              checked={status === "ex_pakistan_leave"}
                              onChange={() =>
                                handleStatusChange(
                                  employee.id,
                                  "ex_pakistan_leave",
                                )
                              }
                            />
                            <span>Ex-Pak.L</span>
                          </label>

                          <label className="radio-option">
                            <input
                              type="radio"
                              name={`status-${employee.id}`}
                              value="holiday"
                              checked={status === "holiday"}
                              onChange={() =>
                                handleStatusChange(employee.id, "holiday")
                              }
                            />
                            <span>Holiday</span>
                          </label>

                          <label className="radio-option">
                            <input
                              type="radio"
                              name={`status-${employee.id}`}
                              value="lwp"
                              checked={status === "lwp"}
                              onChange={() =>
                                handleStatusChange(employee.id, "lwp")
                              }
                            />
                            <span>LWP</span>
                          </label>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="remarks-field"
                          placeholder="Remarks"
                          value={attendanceRecord?.remarks || ""}
                          onChange={(e) =>
                            handleRemarksChange(employee.id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#666",
                    }}
                  >
                    Please select a date and click "Fetch Employee" to load
                    attendance
                  </td>
                </tr>
              )}
              {employees.length > 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "15px" }}
                  >
                    <button type="submit" className="btn btn-submit">
                      Submit Attendance
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>

      {/* Status Count Report Modal */}
      {showStatusCount && (
        <div className="modal-back">
          <div className="modal-box">
            <div className="modal-top">
              <h6>
                Employee Status Count Report ({fromMonth} to {toMonth})
              </h6>
              <button onClick={handleHideStatusCount} className="close-btn">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <table className="status-count-table">
                <thead>
                  <tr>
                    <th>Sr#</th>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Designation</th>
                    <th>Present (P)</th>
                    <th>Casual Leave (CL)</th>
                    <th>Earned Leave (EL)</th>
                    <th>Maternity Leave (ML)</th>
                    <th>Ex-Pak Leave (EPL)</th>
                    <th>Holiday (H)</th>
                    <th>LWP</th>
                    <th>Total Days</th>
                  </tr>
                </thead>
                <tbody>
                  {statusCountData.map((employee, index) => (
                    <tr key={employee.employee_id}>
                      <td>{index + 1}</td>
                      <td>{employee.employee_id}</td>
                      <td style={{ textAlign: "left" }}>
                        {employee.full_name}
                      </td>
                      <td>{employee.employee_post}</td>
                      <td className="status-present">
                        {employee.present_count || 0}
                      </td>
                      <td className="status-casual-leave">
                        {employee.casual_leave_count || 0}
                      </td>
                      <td className="status-earned-leave">
                        {employee.earned_leave_count || 0}
                      </td>
                      <td className="status-maternity-leave">
                        {employee.maternity_leave_count || 0}
                      </td>
                      <td className="status-ex-pakistan-leave">
                        {employee.ex_pakistan_leave_count || 0}
                      </td>
                      <td className="status-holiday">
                        {employee.holiday_count || 0}
                      </td>
                      <td className="status-lwp">{employee.lwp_count || 0}</td>
                      <td>
                        <strong>{employee.total_days || 0}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Report */}
      {viewReport && (
        <div className="modal-back">
          <div className="modal-box">
            <div className="modal-top">
              <h6>Monthly Attendance Summary - {forTheMonth}</h6>
              <button onClick={handleHide} className="close-btn">
                &times;
              </button>
            </div>

            <div style={{ padding: "10px", textAlign: "right" }}>
              <button className="btn btn-detail" onClick={getDetailedReport}>
                Detailed Report
              </button>
            </div>

            <div className="modal-body">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Sr#</th>
                    <th>Employee Name</th>
                    {daysInMonth.map((day) => (
                      <th key={day}>{day}</th>
                    ))}
                    <th>P</th>
                    <th>CL</th>
                    <th>EL</th>
                    <th>ML</th>
                    <th>EPL</th>
                    <th>H</th>
                    <th>LWP</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceDataMapped.map((employee, index) => {
                    const attendanceValues = Object.values(employee.attendance);
                    const presentCount = attendanceValues.filter(
                      (s) => s === "P",
                    ).length;
                    const casualLeaveCount = attendanceValues.filter(
                      (s) => s === "CL",
                    ).length;
                    const earnedLeaveCount = attendanceValues.filter(
                      (s) => s === "EL",
                    ).length;
                    const maternityLeaveCount = attendanceValues.filter(
                      (s) => s === "ML",
                    ).length;
                    const exPakLeaveCount = attendanceValues.filter(
                      (s) => s === "EPL",
                    ).length;
                    const holidayCount = attendanceValues.filter(
                      (s) => s === "H",
                    ).length;
                    const lwpCount = attendanceValues.filter(
                      (s) => s === "LWP",
                    ).length;

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td style={{ textAlign: "left" }}>
                          {employee.full_name}
                        </td>
                        {daysInMonth.map((day) => (
                          <td
                            key={day}
                            className={getStatusClass(employee.attendance[day])}
                          >
                            {getEmployeeAttendanceStatus(employee, day)}
                          </td>
                        ))}
                        <td>
                          <strong>{presentCount}</strong>
                        </td>
                        <td>
                          <strong>{casualLeaveCount}</strong>
                        </td>
                        <td>
                          <strong>{earnedLeaveCount}</strong>
                        </td>
                        <td>
                          <strong>{maternityLeaveCount}</strong>
                        </td>
                        <td>
                          <strong>{exPakLeaveCount}</strong>
                        </td>
                        <td>
                          <strong>{holidayCount}</strong>
                        </td>
                        <td>
                          <strong>{lwpCount}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Report */}
      {detailedReport && (
        <div className="modal-back">
          <div className="modal-box">
            <div className="modal-top">
              <h6>Detailed Attendance Report - {forTheMonth}</h6>
              <button onClick={handleHideDetailed} className="close-btn">
                &times;
              </button>
            </div>

            <div className="modal-body">
              {Object.entries(getGroupedDetailedData()).map(
                ([employeeId, employeeData], empIndex) => (
                  <div key={employeeId} style={{ marginBottom: "25px" }}>
                    <div
                      style={{
                        background: "#f5f5f5",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {empIndex + 1}. {employeeData.full_name}
                    </div>
                    <table className="detail-table">
                      <thead>
                        <tr>
                          <th>Sr#</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Remarks</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeData.records
                          .sort((a, b) => new Date(a.date) - new Date(b.date))
                          .map((record, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {new Date(record.date).toLocaleDateString(
                                  "en-GB",
                                )}
                              </td>
                              <td>{getFullStatus(record.status)}</td>
                              <td>{record.remarks || "-"}</td>
                              <td>{formatTimestamp(record.first_punch)}</td>
                              <td>{formatTimestamp(record.last_punch)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .status-absent {
          background-color: #ffcccc;
        }
        .status-present {
          background-color: #ccffcc;
        }
        .status-earned-leave {
          background-color: #f4bc8fff;
        }
        .status-casual-leave {
          background-color: #fff3cd;
        }
        .status-lwp {
          background-color: #f8d7da;
        }
        .status-holiday {
          background-color: #d1ecf1;
        }
        .status-ex-pakistan-leave {
          background-color: #e7e7ff;
        }
        .status-maternity-leave {
          background-color: #ffe5e5;
        }

        .attendance-wrapper {
          padding: 20px;
          max-width: 100%;
        }

        .page-header {
          background: rgb(235, 209, 151);
          color: black;
          padding: 15px 20px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .page-header h5 {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
        }

        .controls-row {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          align-items: flex-end;
          flex-wrap: wrap;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 180px;
        }

        .form-field label {
          font-size: 13px;
          font-weight: 500;
          color: #333;
        }

        .form-input,
        .form-select {
          padding: 8px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: rgb(235, 209, 151);
        }

        .btn {
          padding: 8px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-fetch {
          background: #3498db;
          color: white;
        }

        .btn-fetch:hover {
          background: #2980b9;
        }

        .btn-report {
          background: #e74c3c;
          color: white;
        }

        .btn-report:hover {
          background: #c0392b;
        }

        .btn-status-count {
          background: #9b59b6;
          color: white;
        }

        .btn-status-count:hover {
          background: #8e44ad;
        }

        .btn-submit {
          background: rgb(235, 209, 151);
          color: black;
          padding: 10px 30px;
        }

        .btn-submit:hover {
          background: #229954;
        }

        .btn-detail {
          background: #3498db;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-detail:hover {
          background: #2980b9;
        }

        .error-msg {
          background: #fee;
          color: #c33;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border-left: 3px solid #c33;
        }

        .table-wrapper {
          background: white;
          border-radius: 4px;
          overflow-x: auto;
        }

        .simple-table {
          width: 100%;
          border-collapse: collapse;
        }

        .simple-table thead {
          background: rgb(235, 209, 151);
          color: black;
        }

        .simple-table th {
          padding: 12px;
          text-align: left;
          font-weight: 500;
          font-size: 14px;
        }

        .simple-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        .simple-table tbody tr:hover {
          background: #f8f9fa;
        }

        .status-options {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-size: 13px;
        }

        .radio-option input[type="radio"] {
          cursor: pointer;
        }

        .radio-option span {
          user-select: none;
        }

        .remarks-field {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 13px;
        }

        .remarks-field:focus {
          outline: none;
          border-color: rgb(235, 209, 151);
        }

        .modal-back {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-box {
          background: white;
          border-radius: 4px;
          width: 95%;
          max-width: 1600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .modal-top {
          background: rgb(235, 209, 151);
          color: black;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-top h6 {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 30px;
          height: 30px;
        }

        .close-btn:hover {
          opacity: 0.8;
        }

        .modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .report-table,
        .status-count-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          border: 1px solid #ddd;
        }

        .report-table thead,
        .status-count-table thead {
          position: sticky;
          top: 0;
          background: rgb(235, 209, 151);
          color: black;
        }

        .report-table th,
        .status-count-table th {
          padding: 10px 5px;
          text-align: center;
          border: 1px solid #ddd;
          font-weight: 500;
        }

        .report-table td,
        .status-count-table td {
          padding: 8px 5px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .detail-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          border: 1px solid #ddd;
        }

        .detail-table thead {
          background: #ecf0f1;
        }

        .detail-table th {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
          font-weight: 500;
        }

        .detail-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }

        .detail-table tbody tr:hover {
          background: #f8f9fa;
        }

        @media (max-width: 768px) {
          .controls-row {
            flex-direction: column;
          }

          .form-field {
            width: 100%;
          }

          .btn {
            width: 100%;
          }

          .status-options {
            flex-direction: column;
            gap: 8px;
          }

          .modal-box {
            width: 100%;
            max-height: 95vh;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendanceForm;
