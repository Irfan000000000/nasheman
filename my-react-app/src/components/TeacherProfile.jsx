// import React, { useEffect, useState, useContext, useRef } from 'react'
// import axios from 'axios'
// import ReactPaginate from 'react-paginate';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useReactToPrint } from "react-to-print";
// import Barcode from "react-barcode";
// import AttendanceReport from './AttendanceReport';
// import authService from './services/authService';
// import StudentAttendanceList from './StudentAttendanceList';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import HomeWork from './HomeWork';

// function TeacherProfile() {

//     const [data, setData] = useState([]);
//     const [admissionData, setAdmissionData] = useState(null);
//     const [voucherDataLedger, setVoucherDataLedger] = useState([]);
//     const [timeTableData, setTimeTableData] = useState([]);
//     const [voucherData, setVoucherData] = useState([]);


//     const [validity, setValidity] = useState({
//         section_name: true,
//     });
//     const [editFormData, setEditFormData] = useState({
//         shift: "",
//         session_id: '',
//         campus_id: '',
//         user_id: '',
//         hidden_id: ''
//     });



//     const convertMonth = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${month}-${year}`;
//   };


//     const [viewVoucherId, setViewVoucherId] = useState([]);
//     const [showData, setShowData] = useState('');
//     const [checkedVouchers, setCheckedVouchers] = useState([]);
//      const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);

//       const [getHeads, setHeads] = useState([]);
//       const [getBankDetails, setBankDetails] = useState([]);
//       const [getBankNotes, setBankNotes] = useState([]);

//       const [attendanceData , setAttendanceData ] = useState([]);


//       // const [showAttendance , setShowAttendance ] = useState(false);


//     const componentRef = useRef();


//     const { user } = useAuth();
//     const { academicSession } = useContext(AcademicSessionContext);

//     const initialState = {
//         session_id: academicSession,
//         campus_id: user.user.campus_id,
//         user_id: user.user.user_id,
//         hidden_id: ''
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     const convertDates = (date) => {
//         const d = new Date(date);
//         const day = d.getDate().toString().padStart(2, '0');
//         const month = (d.getMonth() + 1).toString().padStart(2, '0');
//         const year = d.getFullYear();
//         return `${day}-${month}-${year}`;
//     };

//     const fetchData = () => {
//         axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-teacher-assign-classes/${academicSession}/${user.user.campus_id}/${user.user.student_unique_id}`)
//             .then(response => {
//               // console.log(response.data.results[0]);
//                 setAdmissionData(response.data.results);

//                 console.log(response.data.results);
//             })
//             .catch(err => {
//                 toast.error("Error fetching data");
//                 console.log(err);
//             });
//     };

//     useEffect(() => {
//         if (academicSession) {
//             fetchData();
//         }
//     }, [academicSession]);






    
    
//       // Fetch fee vouchers for viewing when viewVoucherId changes
//       useEffect(() => {
//         const fetchFeeVouchers = async (invoices, campus_id, session_id) => {
//           try {
//             const response = await axios.post(
//               process.env.REACT_APP_API_BASE_URL+"/view-fee-vouchers",
//               {
//                 invoices,
//                 campus_id,
//                 session_id,
//               }
//             );
    
//             let vouchers = response.data.vouchers;
//             let heads = response.data.heads;
//             let bank_details = response.data.bankDetails;
//             let arrears = response.data.arrears;
//             let bank_notes = response.data.bankNotes;
//             setVoucherData(vouchers);
//             setHeads(heads);
//             setBankDetails(bank_details);
//             setBankNotes(bank_notes);
    
//             const vouchersWithArrears = vouchers.map((voucher) => {
//               const arrear = arrears.find((a) => a.id === voucher.id);
//               return {
//                 ...voucher,
//                 arrears_not_cleared: arrear ? arrear.arrears_not_cleared : "",
//               };
//             });
    
//             setVoucherData(vouchersWithArrears);
//           } catch (error) {
//             console.error("Error fetching fee vouchers:", error);
//           }
//         };
    
//         if (viewVoucherId && viewVoucherId.length > 0) {
//           fetchFeeVouchers(viewVoucherId, user.user.campus_id, academicSession);
//         }
//       }, [viewVoucherId, user.user.campus_id, academicSession]);
    
//       // Add head names to voucher fee_head details when heads are available
//       useEffect(() => {
//         if (getHeads && voucherData && voucherData.length > 0) {
//           function addHeadNameToFeeHead(heads, voucher_data) {
//             voucher_data.forEach((item) => {
//               item.fee_head = JSON.parse(item.fee_head);
//               item.fee_head.forEach((head) => {
//                 const match = heads.find((headItem) => headItem.id === head.id);
//                 if (match) {
//                   head.head_name = match.head_name;
//                 }
//               });
//               item.fee_head = JSON.stringify(item.fee_head);
//             });
//             return voucher_data;
//           }
    
//           const updatedData = addHeadNameToFeeHead(getHeads, voucherData);
//           setUpdatedVouchersWithHead(updatedData);
//         }
//       }, [getHeads, voucherData]);
    
    
    
    
    
//       useEffect(() => {
//         function addHeadNameToFeeHead(heads, voucher_data) {
//           voucher_data.forEach((item) => {
//             item.fee_head = JSON.parse(item.fee_head);
//             item.fee_head.forEach((head) => {
//               const match = heads.find((headItem) => headItem.id === head.id);
//               if (match) {
//                 head.head_name = match.head_name;
//               }
//             });
//             item.fee_head = JSON.stringify(item.fee_head);
//           });
//           return voucher_data;
//         }
    
//         const updatedData = addHeadNameToFeeHead(getHeads, data);
//         setUpdatedVouchersWithHead(updatedData);
//       }, [viewVoucherId]);
    
//       // For printing voucher view
//       const handlePrint = useReactToPrint({
//         content: () => componentRef.current,
//       });
    


    
//   // View voucher data (for printing/viewing)
//   const viewData = (id_get) => {
//     setViewVoucherId([id_get]);
//     setShowData(true);
//   };



//   const days = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     // "Sunday",
//   ];
  
  
//   const groupedData = days.reduce((acc, day) => {
//     acc[day] = timeTableData.filter(item => item.day === day);
//     return acc;
//   }, {});

  


//   const viewTimeTable = () => {
//     axios.get(`${process.env.REACT_APP_API_BASE_URL}/view-timetable`, {
//     params: {  // Axios automatically formats this as query params
//     teacher_id_get: user.user.student_unique_id,       // optiona
//     campus_id: user.user.campus_id,        // required
//     session_id: academicSession,
//     shift:editFormData.shift           // required
//   }
//   }).then((response) => {
//         // Handle success response
//         setTimeTableData(response.data.results); //
//         setShowData('time_table');
//         // console.log("Timetable fetched successfully:", response.data.results);
//         // You can do something with the response data here, like updating the state to display the timetable
//       })
//       .catch((error) => {
//         // Handle error response
//         console.error("Error fetching timetable:", error);
//         toast.error("Error fetching timetable!");  // You can use toast to show an error message to the user
//       });
//   };


//   function uploadHomeWork(){
//     setShowData('upload_home_work');
//   }



  
// useEffect(() => {
//   if(editFormData.shift!==''){
//   viewTimeTable();
//   }
//   }, [editFormData.shift]); // Dependencies array to re-run the effect when user changes


  
//   const viewAttendance = () => {
//     setShowData('mark_attendance')
//   }

//   const logout = () => {
//      authService.logout();
//         window.location.reload();
//   }


//   const handleHide = () => {
//     setTimeTableData([]);
//     setAttendanceData([]);
//     setShowData('');
//   }

  
//     return (
//       <>
//         {attendanceData.length > 0 && (
//           <>
//             <div
//               style={{
//                 border: "1px solid #ddd",
//                 padding: "10px",
//                 position: "fixed",
//                 left: "50%",
//                 top: "50%",
//                 transform: "translate(-50%, -50%)",
//                 zIndex: "100",
//                 backdropFilter: "blur(10px)",
//                 minWidth: "350px",
//                 maxHeight: "80vh",
//                 overflowY: "auto",
//                 backgroundColor: "white",
//                 borderRadius: "10px",
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 width: "1800px",
//               }}
//             >
//               <style>
//                 {`
//                     /* Custom scrollbar styles */
//                     div::-webkit-scrollbar {
//                         width: 8px;
//                     }

//                     div::-webkit-scrollbar-track {
//                         background: #f1f1f1;
//                         border-radius: 10px;
//                     }

//                     div::-webkit-scrollbar-thumb {
//                         background: #888;
//                         border-radius: 10px;
//                     }

//                     div::-webkit-scrollbar-thumb:hover {
//                         background: #555;
//                     }

//                     table#category_summary {
//                         border: 1px solid black;
//                         border-collapse: collapse;
//                     }

//                     table#category_summary th, table#category_summary td {
//                         border: 1px solid gray;
//                         padding: 10px !important;
//                     }
//                 `}
//               </style>

//               {/* Close Button */}
//               <button
//                 onClick={handleHide}
//                 style={{
//                   position: "absolute",
//                   top: "16px",
//                   right: "16px",
//                   background: "transparent",
//                   border: "none",
//                   fontSize: "20px",
//                   cursor: "pointer",
//                   zIndex: "200", // Ensures it stays on top of other elements
//                 }}
//               >
//                 &times;
//               </button>

//               {/* Non-Scrollable Heading */}
//               <div
//                 style={{
//                   width: "100%",
//                   backgroundColor: "#EBD197 ",
//                   padding: "5px",
//                   borderBottom: "1px solid #ddd",
//                   position: "sticky",
//                   top: "0",
//                   zIndex: "150",
//                   textAlign: "center",
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   color: "#ffc107",
//                 }}
//               >
//                 Student Attendance Report
//               </div>

//               {/* Scrollable Content */}
//               <div
//                 style={{ width: "100%", padding: "20px", overflowY: "auto" }}
//               >
//                 <AttendanceReport attendanceData={attendanceData} />
//               </div>
//             </div>
//           </>
//         )}

//         {showData == "upload_home_work" && (
//           <div
//             style={{
//               border: "1px solid #ddd",
//               padding: "10px",
//               position: "fixed",
//               left: "50%",
//               top: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: "150",
//               backdropFilter: "blur(10px)",
//               width: "100%",
//               height: "100%",
//               overflowY: "auto",
//               backgroundColor: "white",
//               borderRadius: "10px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               // display: 'flex',
//               flexDirection: "column",
//               alignItems: "center",
//               // width: '1500px'
//             }}
//           >
//             <style>
//               {`
//   /* Custom scrollbar styles */
//   div::-webkit-scrollbar {
//       width: 8px;
//   }

//   div::-webkit-scrollbar-track {
//       background: #f1f1f1;
//       border-radius: 10px;
//   }

//   div::-webkit-scrollbar-thumb {
//       background: #888;
//       border-radius: 10px;
//   }

//   div::-webkit-scrollbar-thumb:hover {
//       background: #555;
//   }

//   table#category_summary {
//       border: 1px solid black;
//       border-collapse: collapse;
//   }

//   table#category_summary th, table#category_summary td {
//       border: 1px solid gray;
//       padding: 10px !important;
//   }
// `}
//             </style>

//             {/* Close Button */}
//             <button
//               onClick={handleHide}
//               style={{
//                 position: "absolute",
//                 top: "16px",
//                 right: "16px",
//                 background: "transparent",
//                 border: "none",
//                 fontSize: "20px",
//                 cursor: "pointer",
//                 zIndex: "200", // Ensures it stays on top of other elements
//               }}
//             >
//               &times;
//             </button>

//             <div
//               style={{
//                 width: "100%",
//                 backgroundColor: "#EBD197 ",
//                 padding: "5px",
//                 borderBottom: "1px solid #ddd",
//                 position: "sticky",
//                 top: "0",
//                 zIndex: "150",
//                 textAlign: "center",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//                 color: "black",
//               }}
//             >
//               Upload Home Work
//             </div>

//             {admissionData && <HomeWork admissionData={admissionData} />}
//           </div>
//         )}

//         {showData === "time_table" && (
//           <div
//             style={{
//               border: "1px solid rgba(0, 0, 0, 0.1)",
//               padding: "0",
//               position: "fixed",
//               left: "50%",
//               top: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: "1000",
//               backdropFilter: "blur(5px)",
//               width: "95%",
//               maxWidth: "1200px",
//               maxHeight: "90vh",
//               overflow: "hidden",
//               backgroundColor: "rgba(255, 255, 255, 0.98)",
//               borderRadius: "12px",
//               boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <style>
//               {`
//         .timetable-container {
//           display: flex;
//           gap: 10px;
//           padding: 15px;
//           overflow-x: auto;
//         }
        
//         .day-column {
//           min-width: 200px;
//           flex: 1;
//           background: #f8f9fa;
//           border-radius: 8px;
//           padding: 10px;
//           box-shadow: 0 2px 5px rgba(0,0,0,0.05);
//         }
        
//         .day-column h5 {
//           margin: 0 0 10px 0;
//           padding: 8px;
//           background: #EBD197;
//           color: white;
//           border-radius: 6px;
//           text-align: center;
//           font-size: 16px;
//         }
        
//         .shift-box {
//           background: white;
//           border-radius: 8px;
//           padding: 12px;
//           margin-bottom: 10px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//           border-left: 4px solid #ffc107;
//           transition: transform 0.2s, box-shadow 0.2s;
//         }
        
//         .shift-box:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         }
        
//         .shift-box h5 {
//           margin: 5px 0;
//           color: #343a40;
//           font-size: 14px;
//           padding: 0;
//           background: none;
//           text-align: left;
//         }
        
//         .shift-box p {
//           margin: 4px 0;
//           font-size: 13px;
//           color: #495057;
//         }
        
//         .shift-box p strong {
//           color: #212529;
//         }
        
//         /* Custom scrollbar styles */
//         ::-webkit-scrollbar {
//           height: 8px;
//           width: 8px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
        
//         @media (max-width: 768px) {
//           .day-column {
//             min-width: 160px;
//           }
//         }
        
//         @media (max-width: 576px) {
//           .day-column {
//             min-width: 140px;
//           }
          
//           .day-column h5 {
//             font-size: 14px;
//           }
          
//           .shift-box {
//             padding: 8px;
//           }
//         }
//       `}
//             </style>

//             {/* Header with close button */}
//             <div
//               style={{
//                 width: "100%",
//                 background: "linear-gradient(135deg, ##EBD197  0%, #EBD197  100%)",
//                 padding: "15px 20px",
//                 borderTopLeftRadius: "12px",
//                 borderTopRightRadius: "12px",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 position: "sticky",
//                 top: 0,
//                 zIndex: 100,
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//               }}
//             >
//               <h3 style={{ margin: 0, color: "white", fontSize: "20px" }}>
//                 Weekly Timetable
//               </h3>
//               <button
//                 onClick={handleHide}
//                 style={{
//                   background: "rgba(255,255,255,0.2)",
//                   border: "none",
//                   width: "30px",
//                   height: "30px",
//                   borderRadius: "50%",
//                   color: "white",
//                   fontSize: "18px",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   transition: "background 0.2s",
//                 }}
//                 onMouseOver={(e) =>
//                   (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
//                 }
//                 onMouseOut={(e) =>
//                   (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
//                 }
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="row d-flex justify-content-center">
//               <div className="col-md-2">
//                 {/* <label htmlFor="shift">Select Shift</label> */}
//                 <select
//                   id="shift"
//                   className="form-control mt-4"
//                   value={editFormData.shift}
//                   onChange={(e) => {
//                     setEditFormData({ ...editFormData, shift: e.target.value });
//                   }}
//                 >
//                   <option>Select Shift</option>
//                   <option>Morning</option>
//                   <option>Evening</option>
//                 </select>
//               </div>
//             </div>

//             {/* Timetable content */}
//             <div style={{ padding: "10px", overflowY: "auto", flex: 1 }}>
//               <div className="timetable-container">
//                 {days.map((day) => (
//                   <div className="day-column" key={day}>
//                     <h5>{day}</h5>
//                     {groupedData[day]?.length > 0 ? (
//                       groupedData[day].map((item, index) => (
//                         <div key={index} className="shift-box">
//                           <h5>Shift: {item.shift}</h5>
//                           <h5>Period: {item.period}</h5>
//                           <h5>Teacher: {item.full_name}</h5>
//                           <p>
//                             <strong>Class:</strong> {item.class}
//                           </p>
//                           <p>
//                             <strong>Subject:</strong> {item.subjects}
//                           </p>
//                           <p>
//                             <strong>Time:</strong> {item.time_from} -{" "}
//                             {item.time_to}
//                           </p>
//                           <p>
//                             <strong>Room:</strong> {item.room_no}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <div
//                         className="shift-box"
//                         style={{ textAlign: "center", color: "#6c757d" }}
//                       >
//                         No classes scheduled
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {showData == "mark_attendance" && (
//           <div
//             style={{
//               border: "1px solid #ddd",
//               padding: "10px",
//               position: "fixed",
//               left: "50%",
//               top: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: "150",
//               backdropFilter: "blur(10px)",
//               width: "100%",
//               height: "100%",
//               overflowY: "auto",
//               backgroundColor: "white",
//               borderRadius: "10px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               // display: 'flex',
//               flexDirection: "column",
//               alignItems: "center",
//               // width: '1500px'
//             }}
//           >
//             <style>
//               {`
//   /* Custom scrollbar styles */
//   div::-webkit-scrollbar {
//       width: 8px;
//   }

//   div::-webkit-scrollbar-track {
//       background: #f1f1f1;
//       border-radius: 10px;
//   }

//   div::-webkit-scrollbar-thumb {
//       background: #888;
//       border-radius: 10px;
//   }

//   div::-webkit-scrollbar-thumb:hover {
//       background: #555;
//   }

//   table#category_summary {
//       border: 1px solid black;
//       border-collapse: collapse;
//   }

//   table#category_summary th, table#category_summary td {
//       border: 1px solid gray;
//       padding: 10px !important;
//   }
// `}
//             </style>

//             {/* Close Button */}
//             <button
//               onClick={handleHide}
//               style={{
//                 position: "absolute",
//                 top: "16px",
//                 right: "16px",
//                 background: "transparent",
//                 border: "none",
//                 fontSize: "20px",
//                 cursor: "pointer",
//                 zIndex: "200", // Ensures it stays on top of other elements
//               }}
//             >
//               &times;
//             </button>

//             <div
//               style={{
//                 width: "100%",
//                 backgroundColor: "#EBD197 ",
//                 padding: "5px",
//                 borderBottom: "1px solid #ddd",
//                 position: "sticky",
//                 top: "0",
//                 zIndex: "150",
//                 textAlign: "center",
//                 fontSize: "18px",
//                 fontWeight: "bold",
//                 color: "#ffc107",
//               }}
//             >
//               Mark Attendance
//             </div>

//             {admissionData && (
//               <StudentAttendanceList admissionData={admissionData} />
//             )}
//           </div>
//         )}

//         <div className="d-flex">
//           <div className="col-md-12 p-2">
//             <h5 className="text-warning bg-primary p-2 card-header border">
//               <i className="fas fa-graduation-cap"></i>Teacher Profile
//             </h5>

//             <div className="mt-2 row d-flex justify-content-center">
//               <button
//                 className="btn btn-sm btn-warning mr-2 col-sm-12 col-md-1 mt-1"
//                 onClick={() => viewTimeTable()}
//               >
//                 <i className="fas fa-calendar-alt"></i> View Time Table
//               </button>
//               <button
//                 className="btn btn-sm btn-warning mr-2 col-sm-12 col-md-1  mt-1"
//                 onClick={() => viewAttendance()}
//               >
//                 <i className="fas fa-clipboard-check"></i> Mark Attendance
//               </button>
//               {/* <button className='btn btn-sm btn-warning mr-2 col-sm-12 col-md-2  mt-1'><i className='fas fa-book-open'></i> View Class Syllabus</button> */}
//               <button
//                 className="btn btn-sm btn-warning mr-2 col-sm-12 col-md-2  mt-1"
//                 onClick={() => uploadHomeWork()}
//               >
//                 <i className="fas fa-book-open"></i> Upload Class Home Work
//               </button>
//               <button
//                 className="btn btn-sm btn-warning mr-2 col-sm-12 col-md-1  mt-1"
//                 onClick={() => logout()}
//               >
//                 <i className="fas fa-sign-out-alt"></i>Logout
//               </button>
//             </div>
//             <style>
//               {`
//           /* Custom scrollbar styles */
//           div::-webkit-scrollbar {
//             width: 8px;
//           }

//           div::-webkit-scrollbar-track {
//             background: #f1f1f1;
//             border-radius: 10px;
//           }

//           div::-webkit-scrollbar-thumb {
//             background: #888;
//             border-radius: 10px;
//           }

//           div::-webkit-scrollbar-thumb:hover {
//             background: #555;
//           }
          
//           .admission_detail {
//             border: 1px solid black;
//             border-collapse: collapse;
//           }

//           .admission_detail th, .admission_detail td {
//             border: 1px solid gray;
//             padding: 10px !important;
//           }
//           `}
//             </style>
//           </div>
//         </div>
//       </>
//     );
// }



//  {/* Voucher view modal */}
    


// const formatNumber = (amount) => {
//   // console.log("yes test");
//   return new Intl.NumberFormat('en-US').format(amount);
// };

// // SingleVoucher Component for rendering each voucher in the view modal
// const SingleVoucher = ({ data, bankDetails, bankNotes }) => {
//   const {
//     invoice_no,
//     full_name,
//     register_no,
//     father_name,
//     class_name,
//     section_name,
//     category,
//     for_the_month,
//     fee_head,
//     total_amount_data,
//     due_date,
//     actual_due_date,
//     remarks,
//     after_due_date_amount,
//     status,
//     arrears,
//     arrears_not_cleared,
//     session_name,
//     campus_name,
//     first_advance_payment,
//     bus_fee,
//     attendance_amount
//     // last_three_vouchers
//   } = data;

//   const feeHeadDetails = JSON.parse(fee_head);

//   //this is correct code dont delete it (place after Bank details)
//   // const lastThreeFeeVoucher =  JSON.parse(last_three_vouchers);


//   const convertDates = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };


//   const convertMonth = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${month}-${year}`;
//   };

//   const getCurrentDate = () => {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const year = today.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const voucherBankDetails = JSON.parse(data.bank_details)
//     .map((bankId) => {
//       return bankDetails.find((detail) => detail.id === bankId);
//     })
//     .filter((detail) => detail !== undefined);

//   const renderVoucherCopy = (title) => (
//     <div className="voucher" style={{ position: "relative" }}>
//       <div className="voucher-header">
//         <h5>{campus_name}</h5>
//         <h5 className="title">{title}</h5>
//       </div>
//       <div className="voucher-fee">
//         <table className="voucher_table">
//           <thead>
//             <tr>
//               <th>Voucher#</th>
//               <td>{invoice_no}</td>
//               <th>Month</th>
//               <td>{convertMonth(for_the_month)}</td>
//             </tr>
//             <tr>
//               <th>Iss.Date</th>
//               <td>{getCurrentDate()}</td>
//               <th>Due.Date</th>
//               <td>{convertDates(actual_due_date)}</td>
//             </tr>
//             <tr>
//               <th>Reg#</th>
//               <td>{register_no}</td>
//               <th>Session</th>
//               <td>{session_name}</td>
//             </tr>
//             <tr>
//               <th>Name</th>
//               <td>{full_name}</td>
//               <th>Father</th>
//               <td>{father_name}</td>
//             </tr>
//             <tr>
//               <th>Category</th>
//               <td>{category}</td>
//               <th>Class</th>
//               <td>{class_name + " (" + section_name + ")"}</td>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td></td>
//             </tr>
//             <tr>
//               <th colSpan={2}>Particulars</th>
//               <th colSpan={2}>Amount (Rs)</th>
//             </tr>
//             {feeHeadDetails.map((item, index) => (
//               <tr key={index}>
//                 <td colSpan={2}>{item.head_name}</td>
//                 <td colSpan={2}>{formatNumber(item.amount)}</td>
//               </tr>
//             ))}
//             <tr>
//               <td colSpan={4}></td>
//             </tr>
//             {first_advance_payment > 0 && (
//               <tr>
//                 <th colSpan={2}>Advance :</th>
//                 <td colSpan={2}>{formatNumber(first_advance_payment)}</td>
//               </tr>
//             )}
//             {bus_fee > 0 && (
//               <tr>
//                 <th colSpan={2}>Bus Fee :</th>
//                 <td colSpan={2}>{formatNumber(bus_fee)}</td>
//               </tr>
//             )}
            
//             {attendance_amount > 0 && (
//               <tr>
//                 <th colSpan={2}>Absent&nbsp;Fine :</th>
//                 <td colSpan={2}>{attendance_amount}</td>
//               </tr>
//             )}
//             {arrears && arrears !== 0 ? (
//               <tr>
//                 <th colSpan={2}>Arrears :</th>
//                 <td colSpan={2}>{formatNumber(arrears)}</td>
//               </tr>
//             ) : null}
//             <tr>
//               <th colSpan={2}>Payable :</th>
//               <th colSpan={2}>
//                 {formatNumber(total_amount_data + arrears + parseInt(first_advance_payment))}
//               </th>
//             </tr>
//             <tr>
//               <th colSpan={2}>Payable (After Due Date) :</th>
//               <th colSpan={2}>
//                 {formatNumber(after_due_date_amount + arrears + parseInt(first_advance_payment))}
//               </th>
//             </tr>
//             {arrears_not_cleared && (
//               <tr>
//                 <th colSpan={2}>Arrears Months :</th>
//                 <td colSpan={2}>{arrears_not_cleared}</td>
//               </tr>
//             )}

//             {remarks && (
//               <tr>
//                 <th colSpan={4}>Remarks: {remarks}</th>
//               </tr>
//             )}
            
//             {voucherBankDetails.map((bankDetail, index) => (
//               <React.Fragment key={index}>
//                 <tr>
//                   <td colSpan={4}>Bank: {bankDetail.bank_name}</td>
//                 </tr>
//                 <tr>
//                   <td colSpan={4}>A/C Title: {bankDetail.account_title}</td>
//                 </tr>
//                 <tr>
//                   <td colSpan={4}>A/C No: {bankDetail.account_no}</td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="voucher-notes">
//         <h5>Notes:</h5>
//         <ul>
//           {bankNotes.map((note, index) => (
//             <div key={index}>
//               <p dangerouslySetInnerHTML={{ __html: note.note_description }} />
//             </div>
//           ))}
//         </ul>
//       </div>
//       <div
//         style={{
//           border: "1px solid black",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >

// {status && status === 'paid' && (
//   <div 
//     style={{
//       position: "absolute",
//       top: '350px',
//       right: '30px',
//       opacity: '0.2',
//       zIndex: '2000',

//     }}
//   >
//     <img
//       src={process.env.REACT_APP_BASE_URL + `/uploads/paid stamp.png`}
//       alt="stamp picture"
//       style={{
//         width: '150px',
//         objectFit: 'cover',
//         borderRadius: '5px',
//         zIndex: '2000'
//       }}
//     />
//   </div>
// )}

//         <Barcode value={invoice_no.toString()} height={40} width={2} />
//       </div>
//     </div>
//   );

//   return (
//     <div className="voucher-container">
//       {renderVoucherCopy("Bank Copy")}
//       {renderVoucherCopy("School Copy")}
//       {renderVoucherCopy("Student Copy")}
//     </div>
//   );
// }







// export default TeacherProfile;



import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useSessions } from './SessionContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import AttendanceReport from './AttendanceReport';
import authService from './services/authService';
import StudentAttendanceList from './StudentAttendanceList';
import HomeWork from './HomeWork';
import AdmissionList from './AdmissionList';
import EventPhotos from './EventPhotos';
import Notification from './Notification';
// import AddExamMarks from './components/AddExamMarks';

const TeacherProfile = () => {
  const [data, setData] = useState([]);
  const [admissionData, setAdmissionData] = useState(null);
  const [voucherDataLedger, setVoucherDataLedger] = useState([]);
  const [timeTableData, setTimeTableData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [activeView, setActiveView] = useState('');
  const [selectedShift, setSelectedShift] = useState('');

  const [validity, setValidity] = useState({
    section_name: true,
  });

  const [editFormData, setEditFormData] = useState({
    shift: "",
    session_id: '',
    campus_id: '',
    user_id: '',
    hidden_id: ''
  });

  const [viewVoucherId, setViewVoucherId] = useState([]);
  const [showData, setShowData] = useState('');
  const [checkedVouchers, setCheckedVouchers] = useState([]);
  const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);
  const [getHeads, setHeads] = useState([]);
  const [getBankDetails, setBankDetails] = useState([]);
  const [getBankNotes, setBankNotes] = useState([]);

  const componentRef = useRef();

  const { user } = useAuth();
  const { getSessions } = useSessions();
  const { academicSession, setAcademicSession } = useContext(AcademicSessionContext);

  // Auto-pick the active session if none selected yet
  useEffect(() => {
    if (!academicSession && getSessions && getSessions.length > 0) {
      const defaultSession = getSessions.find((s) => s.status === "On") || getSessions[getSessions.length - 1];
      if (defaultSession) setAcademicSession(defaultSession.id);
    }
  }, [getSessions, academicSession, setAcademicSession]);

  const teacherName = (user && (user.user.full_name || user.user.username)) || 'Teacher';
  const campusName = (user && user.user.campus_name) || '';
  const selectedSessionObj = getSessions && getSessions.find((s) => String(s.id) === String(academicSession));
  const initials = teacherName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  // Theme tokens — match Sidebar.css (navy #111418 / #1a1f25 + gold #EBD197)
  const styles = {
    page: {
      minHeight: 'calc(100vh - 0px)',
      background: 'linear-gradient(180deg, #f4f6fa 0%, #eef1f6 100%)',
      padding: '0',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '14px',
      boxSizing: 'border-box',
    },
    // Profile card with avatar + name + campus + session dropdown
    profileCard: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 60%, #232a33 100%)',
      borderRadius: '14px',
      boxShadow: '0 8px 24px rgba(17, 20, 24, 0.18)',
      padding: '18px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    },
    profileAccentBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #EBD197 0%, #d4b674 100%)',
    },
    profileTopRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      flexWrap: 'wrap',
    },
    avatar: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #EBD197 0%, #d4b674 100%)',
      color: '#1f2329',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 800,
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(235, 209, 151, 0.35)',
      letterSpacing: '0.5px',
    },
    profileMeta: { flex: 1, minWidth: 0 },
    profileName: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 700,
      color: '#fff',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    profileRole: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#1f2329',
      background: '#EBD197',
      padding: '2px 10px',
      borderRadius: '999px',
      marginTop: '6px',
      fontWeight: 600,
    },
    profileCampus: {
      margin: '8px 0 0 0',
      fontSize: '13px',
      color: '#adb5bd',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    sessionBlock: {
      marginTop: '14px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(235,209,151,0.18)',
      borderRadius: '10px',
      padding: '10px 12px',
    },
    sessionLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      color: '#EBD197',
      fontWeight: 700,
      marginBottom: '6px',
    },
    sessionSelect: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.18)',
      background: '#1a1f25',
      color: '#fff',
      fontSize: '14px',
      fontWeight: 500,
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      cursor: 'pointer',
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EBD197'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '20px',
      paddingRight: '36px',
    },
    // Action grid – mobile-first big tappable cards
    actionGrid: {
      marginTop: '16px',
      display: 'grid',
      gap: '12px',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    actionCard: {
      background: '#ffffff',
      borderRadius: '14px',
      padding: '18px 14px',
      border: '1px solid #e8ecf2',
      boxShadow: '0 2px 8px rgba(17,20,24,0.05)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      textAlign: 'center',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
      minHeight: '110px',
      WebkitTapHighlightColor: 'transparent',
    },
    actionIconWrap: {
      width: '46px',
      height: '46px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #EBD197 0%, #d4b674 100%)',
      color: '#1f2329',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      boxShadow: '0 4px 10px rgba(235,209,151,0.35)',
    },
    actionLabel: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#1f2329',
      lineHeight: 1.25,
    },
    logoutCard: {
      background: '#fff5f5',
      border: '1px solid #fed7d7',
    },
    logoutIconWrap: {
      background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
      color: '#fff',
      boxShadow: '0 4px 10px rgba(229,62,62,0.3)',
    },
    logoutLabel: { color: '#c53030' },

    // Modal
    modal: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(17,20,24,0.55)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 1050,
      padding: 0,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      width: '100%',
      maxWidth: '1100px',
      height: '92vh',
      overflow: 'hidden',
      boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'column',
    },
    // True full-screen variant — used for mark_attendance so teachers get max workspace
    modalFull: {
      position: 'fixed',
      inset: 0,
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'stretch',
      zIndex: 1050,
      padding: 0,
    },
    modalContentFull: {
      backgroundColor: '#fff',
      borderRadius: 0,
      width: '100vw',
      height: '100vh',
      maxWidth: 'none',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197',
      padding: '14px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #EBD197',
      flexShrink: 0,
    },
    modalTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    closeButton: {
      backgroundColor: 'rgba(235,209,151,0.15)',
      border: '1px solid rgba(235,209,151,0.3)',
      color: '#EBD197',
      cursor: 'pointer',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      fontSize: '20px',
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBody: {
      padding: '14px',
      overflowY: 'auto',
      flex: 1,
      WebkitOverflowScrolling: 'touch',
    },
    // Shift selector inside timetable modal
    shiftSelectWrap: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '14px',
    },
    shiftLabel: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#1f2329',
    },
    shiftSelect: {
      flex: '1 1 200px',
      maxWidth: '260px',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid #d0d7e2',
      background: '#fff',
      fontSize: '14px',
      outline: 'none',
    },
    // Desktop timetable table
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    th: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197',
      padding: '12px',
      textAlign: 'center',
      fontWeight: 700,
      fontSize: '13px',
      border: '1px solid #2a3038',
    },
    td: {
      padding: '10px',
      border: '1px solid #e8ecf2',
      textAlign: 'center',
      fontSize: '12px',
    },
    timetableCell: {
      padding: '8px',
      textAlign: 'center',
      border: '1px solid #e8ecf2',
      minWidth: '90px',
    },
    subjectCell: {
      backgroundColor: '#fff8e6',
      borderLeft: '3px solid #EBD197',
    },
    freeCell: {
      backgroundColor: '#f7f9fc',
      color: '#9aa3af',
      fontStyle: 'italic',
    },
    breakCell: {
      backgroundColor: '#fffbeb',
      color: '#92400e',
      fontWeight: 700,
    },
    // Mobile timetable card view
    mobileDayCard: {
      background: '#fff',
      borderRadius: '12px',
      padding: '12px',
      marginBottom: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      border: '1px solid #e8ecf2',
    },
    mobileDayHeader: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197',
      padding: '8px 12px',
      borderRadius: '8px',
      fontWeight: 700,
      fontSize: '14px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    periodChip: {
      background: '#fff8e6',
      borderLeft: '3px solid #EBD197',
      borderRadius: '8px',
      padding: '10px 12px',
      marginBottom: '8px',
      fontSize: '13px',
    },
    periodChipFree: {
      background: '#f7f9fc',
      borderLeft: '3px solid #d0d7e2',
      color: '#6c757d',
      fontStyle: 'italic',
    },
    periodChipBreak: {
      background: '#fffbeb',
      borderLeft: '3px solid #f59e0b',
      color: '#92400e',
      fontWeight: 700,
      textAlign: 'center',
    },
    periodNum: {
      display: 'inline-block',
      background: '#111418',
      color: '#EBD197',
      borderRadius: '6px',
      padding: '2px 8px',
      fontSize: '11px',
      fontWeight: 700,
      marginRight: '8px',
    },
    helperText: {
      textAlign: 'center',
      color: '#6c757d',
      padding: '40px 16px',
      fontSize: '14px',
    },
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const convertMonth = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${year}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertDates = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchData = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/get-teacher-assign-classes/${academicSession}/${user.user.campus_id}/${user.user.student_unique_id}`)
      .then(response => {
        setAdmissionData(response.data.results);
      })
      .catch(err => {
        toast.error("Error fetching data");
        console.log(err);
      });
  };

  useEffect(() => {
    if (academicSession) {
      fetchData();
    }
  }, [academicSession]);

  useEffect(() => {
    const fetchFeeVouchers = async (invoices, campus_id, session_id) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/view-fee-vouchers",
          {
            invoices,
            campus_id,
            session_id,
          }
        );

        let vouchers = response.data.vouchers;
        let heads = response.data.heads;
        let bank_details = response.data.bankDetails;
        let arrears = response.data.arrears;
        let bank_notes = response.data.bankNotes;
        setVoucherData(vouchers);
        setHeads(heads);
        setBankDetails(bank_details);
        setBankNotes(bank_notes);

        const vouchersWithArrears = vouchers.map((voucher) => {
          const arrear = arrears.find((a) => a.id === voucher.id);
          return {
            ...voucher,
            arrears_not_cleared: arrear ? arrear.arrears_not_cleared : "",
          };
        });

        setVoucherData(vouchersWithArrears);
      } catch (error) {
        console.error("Error fetching fee vouchers:", error);
      }
    };

    if (viewVoucherId && viewVoucherId.length > 0) {
      fetchFeeVouchers(viewVoucherId, user.user.campus_id, academicSession);
    }
  }, [viewVoucherId, user.user.campus_id, academicSession]);

  useEffect(() => {
    if (getHeads && voucherData && voucherData.length > 0) {
      function addHeadNameToFeeHead(heads, voucher_data) {
        voucher_data.forEach((item) => {
          item.fee_head = JSON.parse(item.fee_head);
          item.fee_head.forEach((head) => {
            const match = heads.find((headItem) => headItem.id === head.id);
            if (match) {
              head.head_name = match.head_name;
            }
          });
          item.fee_head = JSON.stringify(item.fee_head);
        });
        return voucher_data;
      }

      const updatedData = addHeadNameToFeeHead(getHeads, voucherData);
      setUpdatedVouchersWithHead(updatedData);
    }
  }, [getHeads, voucherData]);

  useEffect(() => {
    function addHeadNameToFeeHead(heads, voucher_data) {
      voucher_data.forEach((item) => {
        item.fee_head = JSON.parse(item.fee_head);
        item.fee_head.forEach((head) => {
          const match = heads.find((headItem) => headItem.id === head.id);
          if (match) {
            head.head_name = match.head_name;
          }
        });
        item.fee_head = JSON.stringify(item.fee_head);
      });
      return voucher_data;
    }

    const updatedData = addHeadNameToFeeHead(getHeads, data);
    setUpdatedVouchersWithHead(updatedData);
  }, [viewVoucherId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const viewData = (id_get) => {
    setViewVoucherId([id_get]);
    setShowData(true);
  };

  const viewTimeTable = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/view-timetable`, {
      params: {
        teacher_id_get: user.user.student_unique_id,
        campus_id: user.user.campus_id,
        session_id: academicSession,
        shift: editFormData.shift
      }
    }).then((response) => {
      setTimeTableData(response.data.results);
      setShowData('time_table');
    }).catch((error) => {
      console.error("Error fetching timetable:", error);
      toast.error("Error fetching timetable!");
    });
  };

  function uploadHomeWork() {
    setShowData('upload_home_work');
  }

  useEffect(() => {
    if (editFormData.shift !== '') {
      viewTimeTable();
    }
  }, [editFormData.shift]);

  const viewAttendance = () => {
    setShowData('mark_attendance')
  }

  const addExamMarks = () => {
    setShowData('add_exam_marks')
  }

  const logout = () => {
    authService.logout();
    window.location.reload();
  }

  const handleHide = () => {
    setTimeTableData([]);
    setAttendanceData([]);
    setShowData('');
  }

  const renderTimetable = () => {
    if (!editFormData.shift) {
      return (
        <div style={styles.helperText}>
          <i className="fas fa-info-circle" style={{ fontSize: '24px', color: '#EBD197', marginBottom: '8px', display: 'block' }}></i>
          Please select a shift to view your timetable.
        </div>
      );
    }

    if (!timeTableData || timeTableData.length === 0) {
      return (
        <div style={styles.helperText}>
          <i className="fas fa-calendar-times" style={{ fontSize: '24px', color: '#9aa3af', marginBottom: '8px', display: 'block' }}></i>
          No classes scheduled for the selected shift.
        </div>
      );
    }

    const groupedData = {};
    days.forEach(day => { groupedData[day] = {}; });
    timeTableData.forEach(item => {
      if (!groupedData[item.day]) groupedData[item.day] = {};
      groupedData[item.day][item.period] = item;
    });

    const maxPeriod = Math.max(...timeTableData.map(item => parseInt(item.period) || 0), 8);
    const periods = [];
    for (let i = 1; i <= maxPeriod; i++) {
      periods.push(i);
      if (i === 4) periods.push('Break');
    }

    return (
      <>
        {/* Mobile-friendly card view */}
        <div className="tp-mobile-timetable">
          {days.map(day => {
            const dayPeriods = Object.keys(groupedData[day] || {})
              .map(p => ({ period: p, ...groupedData[day][p] }))
              .sort((a, b) => parseInt(a.period) - parseInt(b.period));

            return (
              <div key={day} style={styles.mobileDayCard}>
                <div style={styles.mobileDayHeader}>
                  <i className="fas fa-calendar-day"></i> {day}
                </div>
                {dayPeriods.length === 0 ? (
                  <div style={{ ...styles.periodChip, ...styles.periodChipFree }}>
                    No classes scheduled
                  </div>
                ) : (
                  dayPeriods.map((item, idx) => {
                    const isBreak = item.subjects === 'BREAK' || item.subject_id === 'break';
                    if (isBreak) {
                      return (
                        <div key={idx} style={{ ...styles.periodChip, ...styles.periodChipBreak }}>
                          <i className="fas fa-coffee"></i> Break
                        </div>
                      );
                    }
                    return (
                      <div key={idx} style={styles.periodChip}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={styles.periodNum}>P{item.period}</span>
                          <strong style={{ color: '#1f2329' }}>{item.subjects || 'Subject'}</strong>
                        </div>
                        <div style={{ fontSize: '12px', color: '#495057' }}>
                          <i className="fas fa-users" style={{ marginRight: '5px', color: '#EBD197' }}></i>
                          {item.class} ({item.section_name})
                        </div>
                        {(item.time_from || item.time_to) && (
                          <div style={{ fontSize: '12px', color: '#495057' }}>
                            <i className="far fa-clock" style={{ marginRight: '5px', color: '#EBD197' }}></i>
                            {item.time_from} - {item.time_to}
                          </div>
                        )}
                        {item.room_no && (
                          <div style={{ fontSize: '12px', color: '#495057' }}>
                            <i className="fas fa-door-open" style={{ marginRight: '5px', color: '#EBD197' }}></i>
                            Room {item.room_no}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop table view */}
        <div className="tp-desktop-timetable" style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Day / Period</th>
                {periods.map((period, index) => (
                  <th key={index} style={styles.th}>
                    {period === 'Break' ? 'Break' : `P${period}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td style={{ ...styles.td, fontWeight: 700, background: '#f7f9fc', color: '#1f2329' }}>
                    {day}
                  </td>
                  {periods.map((period, index) => {
                    if (period === 'Break') {
                      return (
                        <td key={index} style={{ ...styles.timetableCell, ...styles.breakCell }}>
                          Break
                        </td>
                      );
                    }
                    const cellData = groupedData[day][period];
                    if (!cellData) {
                      return (
                        <td key={index} style={{ ...styles.timetableCell, ...styles.freeCell }}>
                          Free
                        </td>
                      );
                    }
                    if (cellData.subjects === "BREAK" || cellData.subject_id === "break") {
                      return (
                        <td key={index} style={{ ...styles.timetableCell, ...styles.breakCell }}>
                          Break
                        </td>
                      );
                    }
                    return (
                      <td key={index} style={{ ...styles.timetableCell, ...styles.subjectCell }}>
                        <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '12px', color: '#1f2329' }}>
                          {cellData.subjects || 'Subject'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6c757d' }}>
                          {cellData.class} ({cellData.section_name})
                        </div>
                        {cellData.room_no && (
                          <div style={{ fontSize: '11px', color: '#6c757d' }}>
                            Room: {cellData.room_no}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Inline responsive helpers + show/hide for mobile vs desktop timetable */}
      <style>{`
        .tp-mobile-timetable { display: block; }
        .tp-desktop-timetable { display: none; }
        @media (min-width: 768px) {
          .tp-mobile-timetable { display: none; }
          .tp-desktop-timetable { display: block; }
        }
        .tp-action-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(17,20,24,0.10) !important; border-color: #EBD197 !important; }
        .tp-action-card:active { transform: scale(0.98); }
        @media (min-width: 600px) {
          .tp-action-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
        @media (min-width: 900px) {
          .tp-action-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
        }
        @media (min-width: 1200px) {
          .tp-action-grid { grid-template-columns: repeat(7, minmax(0, 1fr)) !important; }
        }
        @media (min-width: 992px) {
          .tp-modal { align-items: center !important; padding: 20px !important; }
          .tp-modal-content { border-radius: 16px !important; height: auto !important; max-height: 92vh !important; }
        }
        .tp-modal-body::-webkit-scrollbar { width: 6px; }
        .tp-modal-body::-webkit-scrollbar-thumb { background: #d0d7e2; border-radius: 3px; }
        .tp-session-select option { background: #1a1f25; color: #fff; }
      `}</style>

      {attendanceData.length > 0 && (
        <div style={styles.modal} className="tp-modal">
          <div style={styles.modalContent} className="tp-modal-content">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-clipboard-list"></i> Attendance Report</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={styles.modalBody} className="tp-modal-body">
              <AttendanceReport attendanceData={attendanceData} />
            </div>
          </div>
        </div>
      )}

      {showData === "upload_home_work" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-book-open"></i> Home Work</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={{ ...styles.modalBody, padding: 0 }} className="tp-modal-body">
              {admissionData && <HomeWork admissionData={admissionData} />}
            </div>
          </div>
        </div>
      )}

      {showData === "time_table" && (
        <div style={styles.modal} className="tp-modal">
          <div style={styles.modalContent} className="tp-modal-content">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                <i className="fas fa-calendar-alt"></i> Weekly Timetable
                {editFormData.shift ? ` — ${editFormData.shift}` : ''}
              </h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={styles.modalBody} className="tp-modal-body">
              <div style={styles.shiftSelectWrap}>
                <label style={styles.shiftLabel} htmlFor="tp-shift">Shift:</label>
                <select
                  id="tp-shift"
                  style={styles.shiftSelect}
                  value={editFormData.shift}
                  onChange={(e) => setEditFormData({ ...editFormData, shift: e.target.value })}
                >
                  <option value="">Select Shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
              {renderTimetable()}
            </div>
          </div>
        </div>
      )}

      {showData === "mark_attendance" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-clipboard-check"></i> Mark Attendance</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={{ ...styles.modalBody, padding: 0 }} className="tp-modal-body">
              {admissionData && <StudentAttendanceList admissionData={admissionData} />}
            </div>
          </div>
        </div>
      )}

      {showData === "admission_list" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-users"></i> Admission List</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={{ ...styles.modalBody, padding: 0 }} className="tp-modal-body">
              {Array.isArray(admissionData) ? (
                <AdmissionList teacherAssignments={admissionData} />
              ) : (
                <div style={{ padding: '40px 16px', textAlign: 'center', color: '#6c757d' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#EBD197', marginBottom: '8px', display: 'block' }}></i>
                  Loading your assigned classes…
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showData === "event_photos" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-images"></i> Event Photos</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={{ ...styles.modalBody, padding: 0 }} className="tp-modal-body">
              <EventPhotos />
            </div>
          </div>
        </div>
      )}

      {showData === "notifications" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-bell"></i> Notifications</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={{ ...styles.modalBody, padding: 0 }} className="tp-modal-body">
              <Notification />
            </div>
          </div>
        </div>
      )}

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Profile card — avatar, name, campus, session dropdown */}
          <div style={styles.profileCard}>
            <div style={styles.profileAccentBar} />
            <div style={styles.profileTopRow}>
              <div style={styles.avatar}>{initials || <i className="fas fa-user"></i>}</div>
              <div style={styles.profileMeta}>
                <h1 style={styles.profileName} title={teacherName}>{teacherName}</h1>
                <span style={styles.profileRole}>
                  <i className="fas fa-graduation-cap"></i> Teacher
                </span>
                {campusName && (
                  <p style={styles.profileCampus} title={campusName}>
                    <i className="fas fa-school" style={{ color: '#EBD197' }}></i>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {campusName}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Session dropdown */}
            <div style={styles.sessionBlock}>
              <div style={styles.sessionLabel}>
                <i className="fas fa-calendar-alt"></i> Academic Session
              </div>
              <select
                className="tp-session-select"
                style={styles.sessionSelect}
                value={academicSession || ''}
                onChange={(e) => setAcademicSession(e.target.value)}
              >
                <option value="">Select Session</option>
                {(getSessions || []).map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.session_name}{session.status === 'On' ? ' (Active)' : ''}
                  </option>
                ))}
              </select>
              {selectedSessionObj && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#adb5bd' }}>
                  <i className="fas fa-check-circle" style={{ color: '#7bc47f' }}></i>
                  &nbsp;Showing data for <strong style={{ color: '#fff' }}>{selectedSessionObj.session_name}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Action cards — 2 cols on mobile, 4 cols on tablet+ */}
          <div className="tp-action-grid" style={styles.actionGrid}>
            <div
              className="tp-action-card"
              style={styles.actionCard}
              onClick={() => viewTimeTable()}
              role="button"
              tabIndex={0}
            >
              <div style={styles.actionIconWrap}>
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div style={styles.actionLabel}>Time Table</div>
            </div>

            <div
              className="tp-action-card"
              style={styles.actionCard}
              onClick={() => viewAttendance()}
              role="button"
              tabIndex={0}
            >
              <div style={styles.actionIconWrap}>
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div style={styles.actionLabel}>Mark Attendance</div>
            </div>

            <div
              className="tp-action-card"
              style={styles.actionCard}
              onClick={() => uploadHomeWork()}
              role="button"
              tabIndex={0}
            >
              <div style={styles.actionIconWrap}>
                <i className="fas fa-book-open"></i>
              </div>
              <div style={styles.actionLabel}>Home Work</div>
            </div>

            <div
              className="tp-action-card"
              style={styles.actionCard}
              onClick={() => setShowData('admission_list')}
              role="button"
              tabIndex={0}
            >
              <div style={styles.actionIconWrap}>
                <i className="fas fa-users"></i>
              </div>
              <div style={styles.actionLabel}>Admission List</div>
            </div>

            <div
              className="tp-action-card"
              style={styles.actionCard}
              onClick={() => setShowData('event_photos')}
              role="button"
              tabIndex={0}
            >
              <div style={styles.actionIconWrap}>
                <i className="fas fa-images"></i>
              </div>
              <div style={styles.actionLabel}>Event Photos</div>
            </div>

            <div
              className="tp-action-card"
              style={styles.actionCard}
              onClick={() => setShowData('notifications')}
              role="button"
              tabIndex={0}
            >
              <div style={styles.actionIconWrap}>
                <i className="fas fa-bell"></i>
              </div>
              <div style={styles.actionLabel}>Notifications</div>
            </div>

            <div
              className="tp-action-card"
              style={{ ...styles.actionCard, ...styles.logoutCard }}
              onClick={() => logout()}
              role="button"
              tabIndex={0}
            >
              <div style={{ ...styles.actionIconWrap, ...styles.logoutIconWrap }}>
                <i className="fas fa-sign-out-alt"></i>
              </div>
              <div style={{ ...styles.actionLabel, ...styles.logoutLabel }}>Logout</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherProfile;
