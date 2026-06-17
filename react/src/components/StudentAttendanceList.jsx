// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Select from "react-select";


// const StudentAttendanceList = (admissionData ='') => {
//   const [students, setStudents] = useState([]);

//   const [showStudent, setShowStudent] = useState(false);

//   const [attendanceData, setAttendanceData] = useState([]);
//   const [statusCounts, setStatusCounts] = useState({}); // For storing the counts
//   const [selectedDate, setSelectedDate] = useState('');


//   const [selectedMonth, setSelectedMonth] = useState('');


//   const [getClasses, setClasses] = useState([]);
//   // const [getSections, setSections] = useState([]);


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
//     class_id:'',
//     section_id:'',
//     shift:'Morning'
//   };

//   const [editFormData, setEditFormData] = useState(initialFormData);

//   // Fetch attendance data from API and map to employees
//   const fetchAttendanceData = () => {
//     if (selectedMonth === "") {
//       alert("Please first select month");
//       return false;
//     }

//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/student-attendance-report-data", {
//         params: {
//           for_the_month: selectedMonth,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//         },
//       })
//       .then((res) => {
//         const data = res.data.results;
//         setAttendanceReport(data);
//         setForTheMonth(res.data.for_the_month);
//         setDaysInMonth(getDaysInMonth(res.data.for_the_month)); // Dynamically get the days for the month
//         mapAttendanceDataToEmployees(data); // Map data by students to avoid duplication
//         setAttendance(true);
//       })
//       .catch((err) => console.log(err));
//   };



//   // useEffect(() => {
//   //   console.log(admissionData,"hitted in attendance");
//   //   const getClasses = (campus_id) => {
//   //     axios
//   //       .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
//   //       .then((res) => {
//   //         console.log(res.data.results);
//   //         setClasses(res.data.results);
//   //       })
//   //       .catch((err) => console.log(err));
//   //   };

//   //   // Ensure user.campus_id is defined before calling fetchClasses
//   //   if (user && user.user.campus_id) {
//   //     getClasses(user.user.campus_id);
//   //   }
//   // }, [user]); // Dependency



//   useEffect(() => {
//   // console.log(admissionData.admissionData, admissionData.admissionData.length, "hitted in attendance");
//   const getClasses = (campus_id) => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
//       .then((res) => {
//         console.log(res.data.results);
        
//         // Extract all unique class_ids from admissionData
//         const admissionClassIds = admissionData.admissionData?.map(item => item.class_id) || [];
//         const uniqueClassIds = [...new Set(admissionClassIds)]; // Remove duplicates
        
//         // Filter classes to only include those that match any class_id from admissionData
//         if (uniqueClassIds.length > 0) {
//           const matchedClasses = res.data.results.filter(
//             (classItem) => uniqueClassIds.includes(classItem.id)
//           );
//           setClasses(matchedClasses);
//         } else {
//           // If no matching class_ids found, set all classes
//           if (admissionData.admissionData?.length <= 0) {
//             setClasses([]);
//           } else {
//             setClasses(res.data.results);
//           }
          
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   // Ensure user.campus_id is defined before calling fetchClasses
//   if (user && user.user.campus_id) {
//     getClasses(user.user.campus_id);
//   }
// }, [user, admissionData]); // Add admissionData to dependencies

//   // useEffect(() => {
//   //   const sections = (campus_id) => {
//   //     axios
//   //       .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
//   //       .then((res) => {
//   //         setSections(res.data.results);
//   //       })
//   //       .catch((err) => console.log(err));
//   //   };

//   //   // Ensure user.campus_id is defined before calling fetchClasses
//   //   if (user && user.user.campus_id) {
//   //     sections(user.user.campus_id);
//   //   }
//   // }, [user]); // Dependency



//   const findClassLabel = () => {
//     if (!editFormData.class_id || !editFormData.section_id) {
//       return "";
//     }
//     const classObj = getClasses.find(
//       (class_get) =>
//         class_get.id === parseInt(editFormData.class_id) &&
//         class_get.section_id === parseInt(editFormData.section_id)
//     );
//     if (classObj) {
//       return `${classObj.class} (${classObj.section_name})`;
//     }
//     return "";
//   };

//   const handleClassChange = (selectedOption) => {
//     const [class_id, section_id] = selectedOption
//       ? selectedOption.value.split(",")
//       : ["", ""];
//     setEditFormData({ ...editFormData, class_id, section_id });
//   };




//   const getShortForm = (status) => {
//     switch (status) {
//       case "present":
//         return "P";
//       case "absent":
//         return "A";
//       case "holiday":
//         return "H";
//       case "leave":
//         return "L";
//       default:
//         return status; // Fallback to the full status if not matched
//     }
//   };



//   const getStatusClass = (status) => {
//     switch (status) {
//       case "P":
//         return "status-present";
//       case "A":
//         return "status-absent";
//       case "H":
//         return "status-holiday";
//       case "L":
//         return "status-leave";
//       default:
//         return "";
//     }
//   };



//   // Map attendance data to avoid duplicate students rows
//   const mapAttendanceDataToEmployees = (data) => {
//     const employeeAttendanceMap = {};

//     data.forEach((attendance) => {
//       const { student_id, full_name, date, status } = attendance;
//       const day = new Date(date).getDate();

//       if (!employeeAttendanceMap[student_id]) {
//         employeeAttendanceMap[student_id] = {
//           full_name,
//           attendance: {},
//         };
//       }
//       employeeAttendanceMap[student_id].attendance[day] =  getShortForm(status);
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

//   const getEmployeeAttendanceStatus = (students, day) => {
//     return students.attendance[day] || "";
//   };

//   // Fetch students list (if needed)
//   useEffect(() => {

//     const fetchStudents = () => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+"/student-list-for-attendance", {
//         params: {
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           campus_id : user.user.campus_id,
//           session_id : academicSession,
//           shift: editFormData.shift
//         }
//       })
//         .then(res => {
//           setStudents(res.data.results);
//           setShowStudent(false);

//         })
//         .catch(err => console.log(err));
//     };
  
//     if(editFormData.class_id !== '' && editFormData.section_id !== ''){
//       fetchStudents();
//     }
  
//   }, [editFormData.class_id, editFormData.section_id, editFormData.shift]);




//   // const fetchStudents = () => {
//   //   axios.get(process.env.REACT_APP_API_BASE_URL+"/student-list-for-attendance", {
//   //     params: {
//   //       class_id: editFormData.class_id,
//   //       section_id: editFormData.section_id,
//   //       campus_id : user.user.campus_id,
//   //       session_id : academicSession,
//   //       shift: editFormData.shift
//   //     }
//   //   })
//   //     .then(res => {
//   //       setStudents(res.data.results);
//   //       setShowStudent(false);

//   //     })
//   //     .catch(err => console.log(err));
//   // };

 
  

//   const handleFetchAttendance = () => {
//     if (!selectedDate) {
//       alert('Please select a date for attendance');
//       return;
//     }

//     setError('');
    


//     axios.get(process.env.REACT_APP_API_BASE_URL+`/student-attendance/${selectedDate}/${user.user.campus_id}/${academicSession}/${editFormData.class_id}/${editFormData.section_id}/${editFormData.shift}`)
//       .then(res => {

       
//         const existingAttendanceData = res.data.results;
//         const counts = res.data.groupedCount;

//         const employeeStatusCounts = counts.reduce((acc, item) => {
//           if (!acc[item.student_id]) {
//             acc[item.student_id] = {};
//           }
//           acc[item.student_id][item.status] = item.count;
//           return acc;
//         }, {});

//         setStatusCounts(employeeStatusCounts);

//         const existingAttendanceMap = new Map(
//           existingAttendanceData.map(item => [item.student_id, item])
//         );

//         const updatedAttendanceData = students.map(student => {
//           if (existingAttendanceMap.has(student.id)) {
//             return {
//               hidden_id: existingAttendanceMap.get(student.id).id,
//               student_id: student.id,
//               status: existingAttendanceMap.get(student.id).status,
//               remarks: existingAttendanceMap.get(student.id).remarks
//             };
//           } else {
//             return {
//               student_id: student.id,
//               status: 'present',
//               remarks: ''
//             };
//           }
//         });

//         setAttendanceData(updatedAttendanceData);
//         setShowStudent(true);

//       })
//       .catch(err => console.log(err));
//   };

  



//   const handleBulkStatusChange = (status) => {
//     setBulkStatus(status);
  
//     // Update attendance data with the new status, ensuring compatibility with conditions
//     const updatedData = attendanceData.map((data) => {
//       const student = students.find((s) => s.id === data.student_id);
//       if (!student) return data;
  
//       const casualLeaveCount = statusCounts[student.id]?.casual_leave || 0;
//       const earnedLeaveCount = statusCounts[student.id]?.earned_leave || 0;
  
//       const disableStatus = casualLeaveCount >= 10 && !data.hidden_id;
//       const disableEarnedLeave = !(student.job_type === 'Regular' && earnedLeaveCount < 10) && !data.hidden_id;
  
//       // Avoid updating if disabled due to conditions
//       if ((status === 'earned_leave' && disableEarnedLeave) || disableStatus) {
//         return data;
//       }
  
//       return { ...data, status };
//     });
  
//     setAttendanceData(updatedData);
//   };
  

//   const handleStatusChange = (student_id, status) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.student_id === student_id ? { ...data, status } : data
//       )
//     );
//   };

//   const handleRemarksChange = (student_id, remarks) => {
//     setAttendanceData(prevData =>
//       prevData.map(data =>
//         data.student_id === student_id ? { ...data, remarks } : data
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
//         await axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-student-attendance', {
//           date: selectedDate,
//           attendanceData,
//           user_id: user.user.user_id,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift
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
//     return Object.values(attendance).filter((status) => status === "P").length;
//   };

//    const countTotalAbsents = (attendance) => {
//     return Object.values(attendance).filter((status) => status === "A").length;
//   };


//   const countTotalLeave = (attendance) => {
//     return Object.values(attendance).filter((status) => status === "L").length;
//   };

//   return (
//     <div className='p-2'>
//       <h6 className='text-warning bg-primary p-2 card-header border'>
//         <i className="fas fa-clock"></i> Student Attendance
//       </h6>
//       <form onSubmit={handleSubmit}>
//         <div className='row p-1 d-flex justify-content-center align-items-center'>


    
//           <div className="col-md-2">
//             <input
//               type="date"
//               id="attendance-date"
//               value={selectedDate}
//               onChange={handleDateChange}
//               className='form-control'
//             />
//           </div>

//           {error && <p style={{ color: 'red' }}>{error}</p>}



//           <div className="me-2 mr-2 col-md-2">
//                   <Select
//                     options={getClasses.map((class_get) => ({
//                       value: `${class_get.id},${class_get.section_id}`,
//                       label: `${class_get.class} (${class_get.section_name})`,
//                     }))}
//                     value={
//                       editFormData.class_id && editFormData.section_id
//                         ? {
//                             value: `${editFormData.class_id},${editFormData.section_id}`,
//                             label: findClassLabel(),
//                           }
//                         : null
//                     }
//                     onChange={handleClassChange}
//                     placeholder="Select Class"
//                   />
//                 </div>


//                 <div className="col-2 pl-1 pr-1">
//                                 <select
//                                     name="shift"
//                                     id="shift"
//                                     className={'form-control'}
//                                     value={editFormData.shift} onChange={(e) => setEditFormData({ ...editFormData, shift: e.target.value })} 
//                                 >
//                                     {/* <option value="">Select Shift</option> */}
//                                     <option>Morning</option>
//                                     <option>Evening</option>
                                    
//                                 </select>
//                                 </div>

//           <button
//             type="button"
//             className='btn btn-sm btn-warning'
//             onClick={handleFetchAttendance}>
//             Fetch Students
//           </button>


//           <div className="col-2">
//             <select
//               value={bulkStatus}
//               onChange={(e) => handleBulkStatusChange(e.target.value)}
//               className="form-control"
//             >
//               <option value="">Select Attendance Status for All</option>
//               <option value="present">Present</option>
//               <option value="absent">Absent</option>
//               <option value="leave">Leave</option>
//               <option value="holiday">Holiday</option>
//             </select>
//           </div>

//           <div className="col-2">
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
//                 <th>Class</th>
//                 <th>Section</th>
//                 <th className='text-center'>Status</th>
//                 <th className='text-center'>Remarks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {showStudent && students.map((student, index) => {
//                 const casualLeaveCount = statusCounts[student.id]?.casual_leave || 0;
//                 const earnedLeaveCount = statusCounts[student.id]?.earned_leave || 0;

//                 const isUpdating = !!attendanceData.find(data => data.student_id === student.id && data.hidden_id);
//                 const disableStatus = casualLeaveCount >= 10 && !isUpdating;
//                 const disableEarnedLeave = !(student.job_type == 'Regular' && earnedLeaveCount < 10) && !isUpdating;
//                 const status = attendanceData.find(data => data.student_id === student.id)?.status || 'present';

//                 return (
//                   <tr key={student.id}>
//                     <td className='text-center'>{index + 1}</td>
//                     <td>{student.full_name}</td>
//                     <td>{student.class}</td>
//                     <td>{student.section_name}</td>

//                     <td className='text-center'>
//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${student.id}`}
//                           value="present"
//                           checked={status === 'present'}
//                           onChange={() => handleStatusChange(student.id, 'present')}
//                         /> Present <label style={{ color: "#007bff" }}>({statusCounts[student.id]?.present || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${student.id}`}
//                           value="absent"
//                           checked={status == 'absent'}
//                           onChange={() => handleStatusChange(student.id, 'absent')}
//                         /> Absent <label style={{ color: "#007bff" }}> ({statusCounts[student.id]?.absent || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${student.id}`}
//                           value="holiday"
//                           checked={status === 'holiday'}
//                           onChange={() => handleStatusChange(student.id, 'holiday')}
//                         /> Holiday <label style={{ color: "#007bff" }}>({statusCounts[student.id]?.holiday || 0})</label>
//                       </span>

//                       <span style={{ marginRight: '20px' }}>
//                         <input
//                           type="radio"
//                           name={`status-${student.id}`}
//                           value="leave"
//                           checked={status === 'leave'}
//                           onChange={() => handleStatusChange(student.id, 'leave')}
//                         /> Leave <label style={{ color: "#007bff" }}>({statusCounts[student.id]?.leave || 0})</label>
//                       </span>

//                     </td>

//                     <td className='text-center'>
//                       <input
//                         type="text"
//                         value={attendanceData.find(data => data.student_id === student.id)?.remarks || ''}
//                         onChange={(e) => handleRemarksChange(student.id, e.target.value)}
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

//             <h5 style={{ margin: 0 }}>View Students Attendance</h5>
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
//                 <th>Student Name</th>
//                 {daysInMonth.map((day) => (
//                   <th key={day}>{day}</th>
//                 ))}
//                 <th className='text-center' style={{fontWeight:"bolder"}}>T.Present</th>
//                  <th className='text-center' style={{fontWeight:"bolder"}}>T.Absent</th>
//                  <th className='text-center' style={{fontWeight:"bolder"}}>T.Leave</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceDataMapped.map((students, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{students.full_name}</td>
//                   {daysInMonth.map((day) => (
//                     <td key={day} className={getStatusClass(students.attendance[day])}>
//                       {getEmployeeAttendanceStatus(students, day) }
//                     </td>
//                   ))}
//                   <td style={{color:"green", textAlign:"center", fontWeight:"bolder"}}>{countTotalPresents(students.attendance) == 0 ? "-" : countTotalPresents(students.attendance)}</td>
//                   <td style={{color:"red",  textAlign:"center", fontWeight:"bolder"}}>{countTotalAbsents(students.attendance) == 0 ? "-" : countTotalAbsents(students.attendance)}</td>
//                   <td  className='text-warning text-center' style={{fontWeight:"bolder"}}>{countTotalLeave(students.attendance) == 0 ? "-" : countTotalLeave(students.attendance)}</td>
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

// export default StudentAttendanceList;



import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

const StudentAttendanceList = (admissionData = '') => {
  const [students, setStudents] = useState([]);
  const [showStudent, setShowStudent] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [getClasses, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [viewReport, setViewReport] = useState(false);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [forTheMonth, setForTheMonth] = useState("");
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [attendanceDataMapped, setAttendanceDataMapped] = useState([]);
  const [attendance, setAttendance] = useState(false);

  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const initialFormData = {
    for_the_month: '',
    class_id: '',
    section_id: '',
    shift: 'Morning'
  };

  const [editFormData, setEditFormData] = useState(initialFormData);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    },
    header: {
      backgroundColor: '#EBD197',
      color: 'black',
      padding: '15px 20px',
      borderRadius: '8px 8px 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '0',
      fontWeight: 'bold',
      fontSize: '16px'
    },
    formContainer: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    formRow: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    formGroup: {
      flex: '1',
      minWidth: '200px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    button: {
      backgroundColor: '#ffc107',
      color: '#000',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
    },
    buttonDanger: {
      backgroundColor: '#dc3545',
      color: '#fff'
    },
    buttonPrimary: {
      backgroundColor: '#007bff',
      color: '#fff'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    th: {
      backgroundColor: '#EBD197',
      color: 'black',
      padding: '12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '14px',
      borderRight: '1px solid #444'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px'
    },
    radioGroup: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center'
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    statusCount: {
      color: '#007bff',
      fontWeight: '500',
      marginLeft: '3px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      width: '95%',
      maxWidth: '1800px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column'
    },
    modalHeader: {
      backgroundColor: '#EBD197',
      color: 'black',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 101
    },
    modalBody: {
      padding: '20px',
      overflowY: 'auto',
      flex: 1
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '28px',
      lineHeight: '1',
      padding: '0'
    },
    statusPresent: {
      backgroundColor: '#d4edda',
      color: '#155724',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    statusAbsent: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    statusHoliday: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    statusLeave: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  };

  const fetchAttendanceData = () => {
    if (selectedMonth === "") {
      alert("Please first select month");
      return false;
    }

    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/student-attendance-report-data", {
        params: {
          for_the_month: selectedMonth,
          session_id: academicSession,
          campus_id: user.user.campus_id,
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
        },
      })
      .then((res) => {
        const data = res.data.results;
        setAttendanceReport(data);
        setForTheMonth(res.data.for_the_month);
        setDaysInMonth(getDaysInMonth(res.data.for_the_month));
        mapAttendanceDataToEmployees(data);
        setAttendance(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const getClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL + `/get-classes/${campus_id}`)
        .then((res) => {
          const admissionClassIds = admissionData.admissionData?.map(item => item.class_id) || [];
          const uniqueClassIds = [...new Set(admissionClassIds)];

          if (uniqueClassIds.length > 0) {
            const matchedClasses = res.data.results.filter(
              (classItem) => uniqueClassIds.includes(classItem.id)
            );
            setClasses(matchedClasses);
          } else {
            if (admissionData.admissionData?.length <= 0) {
              setClasses([]);
            } else {
              setClasses(res.data.results);
            }
          }
        })
        .catch((err) => console.log(err));
    };

    if (user && user.user.campus_id) {
      getClasses(user.user.campus_id);
    }
  }, [user, admissionData]);

  const findClassLabel = () => {
    if (!editFormData.class_id || !editFormData.section_id) {
      return "";
    }
    const classObj = getClasses.find(
      (class_get) =>
        class_get.id === parseInt(editFormData.class_id) &&
        class_get.section_id === parseInt(editFormData.section_id)
    );
    if (classObj) {
      return `${classObj.class} (${classObj.section_name})`;
    }
    return "";
  };

  const handleClassChange = (selectedOption) => {
    const [class_id, section_id] = selectedOption
      ? selectedOption.value.split(",")
      : ["", ""];
    setEditFormData({ ...editFormData, class_id, section_id });
  };

  const getShortForm = (status) => {
    switch (status) {
      case "present":
        return "P";
      case "absent":
        return "A";
      case "holiday":
        return "H";
      case "leave":
        return "L";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "P":
        return styles.statusPresent;
      case "A":
        return styles.statusAbsent;
      case "H":
        return styles.statusHoliday;
      case "L":
        return styles.statusLeave;
      default:
        return {};
    }
  };

  const mapAttendanceDataToEmployees = (data) => {
    const employeeAttendanceMap = {};

    data.forEach((attendance) => {
      const { student_id, full_name, date, status } = attendance;
      const day = new Date(date).getDate();

      if (!employeeAttendanceMap[student_id]) {
        employeeAttendanceMap[student_id] = {
          full_name,
          attendance: {},
        };
      }
      employeeAttendanceMap[student_id].attendance[day] = getShortForm(status);
    });

    setAttendanceDataMapped(Object.values(employeeAttendanceMap));
  };

  const getDaysInMonth = (monthYear) => {
    const [year, month] = monthYear.split("-");
    return new Array(new Date(year, month, 0).getDate())
      .fill(null)
      .map((_, i) => i + 1);
  };

  const getEmployeeAttendanceStatus = (students, day) => {
    return students.attendance[day] || "";
  };

  useEffect(() => {
    const fetchStudents = () => {
      axios.get(process.env.REACT_APP_API_BASE_URL + "/student-list-for-attendance", {
        params: {
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
          campus_id: user.user.campus_id,
          session_id: academicSession,
          shift: editFormData.shift
        }
      })
        .then(res => {
          setStudents(res.data.results);
          setShowStudent(false);
        })
        .catch(err => console.log(err));
    };

    if (editFormData.class_id !== '' && editFormData.section_id !== '') {
      fetchStudents();
    }
  }, [editFormData.class_id, editFormData.section_id, editFormData.shift]);

  const handleFetchAttendance = () => {
    if (!selectedDate) {
      alert('Please select a date for attendance');
      return;
    }

    setError('');

    axios.get(process.env.REACT_APP_API_BASE_URL + `/student-attendance/${selectedDate}/${user.user.campus_id}/${academicSession}/${editFormData.class_id}/${editFormData.section_id}/${editFormData.shift}`)
      .then(res => {
        const existingAttendanceData = res.data.results;
        const counts = res.data.groupedCount;

        const employeeStatusCounts = counts.reduce((acc, item) => {
          if (!acc[item.student_id]) {
            acc[item.student_id] = {};
          }
          acc[item.student_id][item.status] = item.count;
          return acc;
        }, {});

        setStatusCounts(employeeStatusCounts);

        const existingAttendanceMap = new Map(
          existingAttendanceData.map(item => [item.student_id, item])
        );

        const updatedAttendanceData = students.map(student => {
          if (existingAttendanceMap.has(student.id)) {
            return {
              hidden_id: existingAttendanceMap.get(student.id).id,
              student_id: student.id,
              status: existingAttendanceMap.get(student.id).status,
              remarks: existingAttendanceMap.get(student.id).remarks
            };
          } else {
            return {
              student_id: student.id,
              status: 'present',
              remarks: ''
            };
          }
        });

        setAttendanceData(updatedAttendanceData);
        setShowStudent(true);
      })
      .catch(err => console.log(err));
  };

  const handleBulkStatusChange = (status) => {
    setBulkStatus(status);

    const updatedData = attendanceData.map((data) => {
      const student = students.find((s) => s.id === data.student_id);
      if (!student) return data;

      const casualLeaveCount = statusCounts[student.id]?.casual_leave || 0;
      const earnedLeaveCount = statusCounts[student.id]?.earned_leave || 0;

      const disableStatus = casualLeaveCount >= 10 && !data.hidden_id;
      const disableEarnedLeave = !(student.job_type === 'Regular' && earnedLeaveCount < 10) && !data.hidden_id;

      if ((status === 'earned_leave' && disableEarnedLeave) || disableStatus) {
        return data;
      }

      return { ...data, status };
    });

    setAttendanceData(updatedData);
  };

  const handleStatusChange = (student_id, status) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.student_id === student_id ? { ...data, status } : data
      )
    );
  };

  const handleRemarksChange = (student_id, remarks) => {
    setAttendanceData(prevData =>
      prevData.map(data =>
        data.student_id === student_id ? { ...data, remarks } : data
      )
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

    let confirmed = window.confirm("Are you sure you want to mark attendance?");

    if (confirmed) {
      if (!selectedDate) {
        alert('Please select a date for attendance');
        return;
      }

      try {
        await axios.post(process.env.REACT_APP_API_BASE_URL + '/submit-student-attendance', {
          date: selectedDate,
          attendanceData,
          user_id: user.user.user_id,
          session_id: academicSession,
          campus_id: user.user.campus_id,
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
          shift: editFormData.shift
        });
        setSelectedDate('');
        setAttendanceData([]);
        toast.success('Attendance Marked Successfully!');
      } catch (error) {
        console.error('There was an error!', error);
      }
    }
  };

  const handleHide = () => {
    setViewReport(false);
    setAttendance(false);
  };

  const getReport = () => {
    fetchAttendanceData();
    setViewReport(true);
  };

  const countTotalPresents = (attendance) => {
    return Object.values(attendance).filter((status) => status === "P").length;
  };

  const countTotalAbsents = (attendance) => {
    return Object.values(attendance).filter((status) => status === "A").length;
  };

  const countTotalLeave = (attendance) => {
    return Object.values(attendance).filter((status) => status === "L").length;
  };

  const classSelectOptions = getClasses.map((class_get) => ({
    value: `${class_get.id},${class_get.section_id}`,
    label: `${class_get.class} (${class_get.section_name})`,
  }));

  const statusCellClass = (statusChar) => {
    switch (statusChar) {
      case 'P': return 'student-attn__cell student-attn__cell--p';
      case 'A': return 'student-attn__cell student-attn__cell--a';
      case 'H': return 'student-attn__cell student-attn__cell--h';
      case 'L': return 'student-attn__cell student-attn__cell--l';
      default: return 'student-attn__cell';
    }
  };

  return (
    <div className="student-attn">
      <div className="student-attn__header">
        <i className="fas fa-clock"></i>
        <span>Student Attendance</span>
      </div>

      <form className="student-attn__form" onSubmit={handleSubmit}>
        <div className="student-attn__filters">
          <div className="student-attn__field">
            <label className="student-attn__label">Date</label>
            <input
              type="date"
              className="form-control student-attn__input"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="student-attn__field">
            <label className="student-attn__label">Class</label>
            <Select
              options={classSelectOptions}
              value={
                editFormData.class_id && editFormData.section_id
                  ? {
                      value: `${editFormData.class_id},${editFormData.section_id}`,
                      label: findClassLabel(),
                    }
                  : null
              }
              onChange={handleClassChange}
              placeholder="Select Class"
              classNamePrefix="react-select"
            />
          </div>

          <div className="student-attn__field">
            <label className="student-attn__label">Shift</label>
            <select
              name="shift"
              className="form-control student-attn__input"
              value={editFormData.shift}
              onChange={(e) => setEditFormData({ ...editFormData, shift: e.target.value })}
            >
              <option>Morning</option>
              <option>Evening</option>
            </select>
          </div>

          <div className="student-attn__field">
            <label className="student-attn__label">Bulk Status</label>
            <select
              className="form-control student-attn__input"
              value={bulkStatus}
              onChange={(e) => handleBulkStatusChange(e.target.value)}
            >
              <option value="">Select Status for All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>

          <div className="student-attn__field">
            <label className="student-attn__label">Report Month</label>
            <input
              type="month"
              className="form-control student-attn__input"
              value={selectedMonth}
              onChange={handleChangeMonth}
            />
          </div>

          <div className="student-attn__actions">
            <button
              type="button"
              className="btn btn-warning student-attn__btn"
              onClick={handleFetchAttendance}
            >
              <i className="fas fa-users"></i> Fetch Students
            </button>
            <button
              type="button"
              className="btn btn-danger student-attn__btn"
              onClick={getReport}
            >
              <i className="fas fa-file-alt"></i> Get Report
            </button>
          </div>
        </div>

        {error && <p className="student-attn__error">{error}</p>}

        {showStudent && (
          <div className="table-responsive student-attn__table-wrap">
            <table className="table student-attn__table">
              <thead>
                <tr>
                  <th className="text-center">Sr.No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const casualLeaveCount = statusCounts[student.id]?.casual_leave || 0;
                  const earnedLeaveCount = statusCounts[student.id]?.earned_leave || 0;

                  const isUpdating = !!attendanceData.find(data => data.student_id === student.id && data.hidden_id);
                  const disableStatus = casualLeaveCount >= 10 && !isUpdating;
                  const status = attendanceData.find(data => data.student_id === student.id)?.status || 'present';

                  return (
                    <tr key={student.id}>
                      <td className="text-center" data-label="Sr.No">{index + 1}</td>
                      <td data-label="Name">{student.full_name}</td>
                      <td data-label="Class">{student.class}</td>
                      <td data-label="Section">{student.section_name}</td>

                      <td data-label="Status">
                        <div className="student-attn__radios">
                          <label className="student-attn__radio" aria-label="Present">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              value="present"
                              checked={status === 'present'}
                              onChange={() => handleStatusChange(student.id, 'present')}
                            />
                            <span className="student-attn__radio-label">Present</span>
                            <em>{statusCounts[student.id]?.present || 0}</em>
                          </label>

                          <label className="student-attn__radio" aria-label="Absent">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              value="absent"
                              checked={status === 'absent'}
                              onChange={() => handleStatusChange(student.id, 'absent')}
                            />
                            <span className="student-attn__radio-label">Absent</span>
                            <em>{statusCounts[student.id]?.absent || 0}</em>
                          </label>

                          <label className="student-attn__radio" aria-label="Holiday">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              value="holiday"
                              checked={status === 'holiday'}
                              onChange={() => handleStatusChange(student.id, 'holiday')}
                            />
                            <span className="student-attn__radio-label">Holiday</span>
                            <em>{statusCounts[student.id]?.holiday || 0}</em>
                          </label>

                          <label className="student-attn__radio" aria-label="Leave">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              value="leave"
                              checked={status === 'leave'}
                              onChange={() => handleStatusChange(student.id, 'leave')}
                            />
                            <span className="student-attn__radio-label">Leave</span>
                            <em>{statusCounts[student.id]?.leave || 0}</em>
                          </label>
                        </div>
                      </td>

                      <td className="text-center" data-label="Remarks">
                        <input
                          type="text"
                          className="form-control student-attn__remarks"
                          value={attendanceData.find(data => data.student_id === student.id)?.remarks || ''}
                          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                          disabled={disableStatus}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="student-attn__submit-row">
              <button type="submit" className="btn btn-warning student-attn__btn">
                <i className="fas fa-check"></i> Submit Attendance
              </button>
            </div>
          </div>
        )}
      </form>

      {viewReport && (
        <>
          <div className="student-attn__backdrop" onClick={handleHide}></div>
          <div className="student-attn__modal">
            <div className="student-attn__modal-header">
              <h5>
                <i className="fas fa-chart-bar"></i> Student Attendance Report
              </h5>
              <button
                type="button"
                className="student-attn__close"
                onClick={handleHide}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="student-attn__modal-body">
              <div className="table-responsive">
                <table className="table student-attn__report-table">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Student Name</th>
                      {daysInMonth.map((day) => (
                        <th key={day} className="text-center">{day}</th>
                      ))}
                      <th className="text-center">T.P</th>
                      <th className="text-center">T.A</th>
                      <th className="text-center">T.L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceDataMapped.map((students, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{students.full_name}</td>
                        {daysInMonth.map((day) => (
                          <td key={day} className={statusCellClass(students.attendance[day])}>
                            {getEmployeeAttendanceStatus(students, day)}
                          </td>
                        ))}
                        <td className="text-center student-attn__total student-attn__total--p">
                          {countTotalPresents(students.attendance) === 0 ? "-" : countTotalPresents(students.attendance)}
                        </td>
                        <td className="text-center student-attn__total student-attn__total--a">
                          {countTotalAbsents(students.attendance) === 0 ? "-" : countTotalAbsents(students.attendance)}
                        </td>
                        <td className="text-center student-attn__total student-attn__total--l">
                          {countTotalLeave(students.attendance) === 0 ? "-" : countTotalLeave(students.attendance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAttendanceList;
