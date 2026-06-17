// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import { useAuth } from "./AuthContext";
// import AcademicSessionContext from "./AcademicSessionContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useReactToPrint } from "react-to-print";
// import Barcode from "react-barcode";
// import AttendanceReport from "./AttendanceReport";
// import authService from "./services/authService";

// function StudentProfile() {
//   const [data, setData] = useState([]);
//   const [admissionData, setAdmissionData] = useState(null);
//   const [voucherDataLedger, setVoucherDataLedger] = useState([]);
//   const [timeTableData, setTimeTableData] = useState([]);
//   const [voucherData, setVoucherData] = useState([]);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [totalPages, totalPagesGet] = useState("");
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentFileUrl, setCurrentFileUrl] = useState("");
//   const [totalItem, setTotalItemGet] = useState(10);
//   const [activitiesData, setActivitiesData] = useState([]);
//   const [disciplineData, setDisciplineData] = useState([]);
//   const [eventsData, setEventsData] = useState([]);
//   const [searchCategoryReport, getSearchCategoryReport] = useState({
//     search: "",
//   });

//   const [loading, setLoading] = useState(true);

//   const [validity, setValidity] = useState({
//     section_name: true,
//   });
//   const [editFormData, setEditFormData] = useState({
//     class_id: "",
//     section_id: "",
//     shift: "",
//     session_id: "",
//     campus_id: "",
//     user_id: "",
//     hidden_id: "",
//   });

//   const convertMonth = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${month}-${year}`;
//   };

//   const [viewVoucherId, setViewVoucherId] = useState([]);
//   const [showData, setShowData] = useState(false);
//   const [checkedVouchers, setCheckedVouchers] = useState([]);
//   const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);

//   const [getHeads, setHeads] = useState([]);
//   const [getBankDetails, setBankDetails] = useState([]);
//   const [getBankNotes, setBankNotes] = useState([]);

//   const [attendanceData, setAttendanceData] = useState([]);

//   // const [showAttendance , setShowAttendance ] = useState(false);

//   const componentRef = useRef();

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialState = {
//     session_id: academicSession,
//     campus_id: user.user.campus_id,
//     user_id: user.user.user_id,
//     hidden_id: "",
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const convertDates = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };


//  const convertDatesWithTime = (date) => {
//   const d = new Date(date);
//   const day = d.getDate().toString().padStart(2, "0");
//   const month = (d.getMonth() + 1).toString().padStart(2, "0");
//   const year = d.getFullYear();
//   let hours = d.getHours();
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   const minutes = d.getMinutes().toString().padStart(2, "0");
  
//   return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
// };
// // Example output: "30-05-2024 02:25 PM"

//   const fetchData = () => {
//     axios
//       .get(
//         `${process.env.REACT_APP_API_BASE_URL}/get-student-profile/${academicSession}/${user.user.campus_id}/${user.user.student_unique_id}`
//       )
//       .then((response) => {
//         // console.log(response.data.results[0]);
//         setAdmissionData(response.data.results[0]);
//         setVoucherDataLedger(response.data.results);
//         setActivitiesData(response.data.activities);
//         setDisciplineData(response.data.discipline);
//         setEventsData(response.data.events);
//       })
//       .catch((err) => {
//         toast.error("Error fetching data");
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     if (academicSession) {
//       fetchData();
//     }
//   }, [academicSession]);

//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected + 1);
//   };

//   // Fetch fee vouchers for viewing when viewVoucherId changes
//   useEffect(() => {
//     const fetchFeeVouchers = async (invoices, campus_id, session_id) => {
//       try {
//         const response = await axios.post(
//           process.env.REACT_APP_API_BASE_URL + "/view-fee-vouchers",
//           {
//             invoices,
//             campus_id,
//             session_id,
//           }
//         );

//         let vouchers = response.data.vouchers;
//         let heads = response.data.heads;
//         let bank_details = response.data.bankDetails;
//         let arrears = response.data.arrears;
//         let bank_notes = response.data.bankNotes;
//         setVoucherData(vouchers);
//         setHeads(heads);
//         setBankDetails(bank_details);
//         setBankNotes(bank_notes);

//         const vouchersWithArrears = vouchers.map((voucher) => {
//           const arrear = arrears.find((a) => a.id === voucher.id);
//           return {
//             ...voucher,
//             arrears_not_cleared: arrear ? arrear.arrears_not_cleared : "",
//           };
//         });

//         setVoucherData(vouchersWithArrears);
//       } catch (error) {
//         console.error("Error fetching fee vouchers:", error);
//       }
//     };

//     if (viewVoucherId && viewVoucherId.length > 0) {
//       fetchFeeVouchers(viewVoucherId, user.user.campus_id, academicSession);
//     }
//   }, [viewVoucherId, user.user.campus_id, academicSession]);

//   // Add head names to voucher fee_head details when heads are available
//   useEffect(() => {
//     if (getHeads && voucherData && voucherData.length > 0) {
//       function addHeadNameToFeeHead(heads, voucher_data) {
//         voucher_data.forEach((item) => {
//           item.fee_head = JSON.parse(item.fee_head);
//           item.fee_head.forEach((head) => {
//             const match = heads.find((headItem) => headItem.id === head.id);
//             if (match) {
//               head.head_name = match.head_name;
//             }
//           });
//           item.fee_head = JSON.stringify(item.fee_head);
//         });
//         return voucher_data;
//       }

//       const updatedData = addHeadNameToFeeHead(getHeads, voucherData);
//       setUpdatedVouchersWithHead(updatedData);
//     }
//   }, [getHeads, voucherData]);

//   useEffect(() => {
//     function addHeadNameToFeeHead(heads, voucher_data) {
//       voucher_data.forEach((item) => {
//         item.fee_head = JSON.parse(item.fee_head);
//         item.fee_head.forEach((head) => {
//           const match = heads.find((headItem) => headItem.id === head.id);
//           if (match) {
//             head.head_name = match.head_name;
//           }
//         });
//         item.fee_head = JSON.stringify(item.fee_head);
//       });
//       return voucher_data;
//     }

//     const updatedData = addHeadNameToFeeHead(getHeads, data);
//     setUpdatedVouchersWithHead(updatedData);
//   }, [viewVoucherId]);

//   // For printing voucher view
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   // View voucher data (for printing/viewing)
//   const viewData = (id_get) => {
//     setViewVoucherId([id_get]);
//     setData([]);
//     setShowData("view_voucher");
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
//     acc[day] = timeTableData.filter((item) => item.day === day);
//     return acc;
//   }, {});

//   const viewHomeWork = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL + "/homework-list", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           search_date: editFormData.search_date,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift,
//         },
//       })
//       .then((res) => {
//         setData(res.data.data);
//         setTotalCount(0);
//         totalPagesGet(res.data.totalPages);
//         setLoading(false);
//         setShowData("view_home_work_list");
//       })
//       .catch((err) => console.log(err));
//   };

//   const viewSyllabus = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL + "/view-syllabus-list", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           search_date: editFormData.search_date,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift,
//         },
//       })
//       .then((res) => {
//         setData(res.data.data);
//         setTotalCount(0);
//         totalPagesGet(res.data.totalPages);
//         setLoading(false);
//         setShowData("view_home_work_list");
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     if (admissionData) {
//       setEditFormData({
//         ...editFormData,
//         class_id: admissionData.class_id,
//         section_id: admissionData.section_id,
//         shift: admissionData.shift,
//       });
//     }
//   }, [admissionData]); // This effect runs whenever admissionData changes

//   const viewTimeTable = (class_id, section_id, shift) => {
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-timetable`, {
//         params: {
//           // Axios automatically formats this as query params
//           class_id: class_id, // optional
//           section_id: section_id, // optional
//           campus_id: user.user.campus_id, // required
//           session_id: academicSession,
//           shift: shift, // required
//         },
//       })
//       .then((response) => {
//         // Handle success response
//         setTimeTableData(response.data.results); //
//         setShowData("time_table");
//         // console.log("Timetable fetched successfully:", response.data.results);
//         // You can do something with the response data here, like updating the state to display the timetable
//       })
//       .catch((error) => {
//         // Handle error response
//         console.error("Error fetching timetable:", error);
//         toast.error("Error fetching timetable!"); // You can use toast to show an error message to the user
//       });
//   };

//   const viewAttendance = (student_id) => {
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-student-attendance`, {
//         params: {
//           // Axios automatically formats this as query params
//           student_id: student_id, // optional
//           campus_id: user.user.campus_id, // required
//           session_id: academicSession, // required
//         },
//       })
//       .then((response) => {
//         setAttendanceData(response.data.results);

//         // console.log(response.data.results);
//       })
//       .catch((error) => {
//         // Handle error response
//         console.error("Error fetching timetable:", error);
//         toast.error("Error fetching timetable!"); // You can use toast to show an error message to the user
//       });
//   };

//   const logout = () => {
//     authService.logout();
//     window.location.reload();
//   };

//   const handleHide = () => {
//     setTimeTableData([]);
//     setAttendanceData([]);
//     setShowData([]);
//     setData([]);
//   };

//   const handleTotalItemChange = (event) => {
//     const newValue = event.target.value;
//     setTotalItemGet(newValue);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       getSearchCategoryReport(searchCategoryReport);
//       viewHomeWork();
//     }
//   };

//   function searchCategory() {
//     viewHomeWork();
//   }

//   const [report, getAllReports] = useState({
//     from_date: "",
//     to_date: "",
//     report_type: "",
//   });

//   function getReport() {
//     if (report.report_type == "pdf") {
//       // pdfReport();
//     } else if (report.report_type == "excel") {
//       // excelReport();
//     }
//   }

//   return (
//     <>
//       {attendanceData.length > 0 && (
//         <>
//           <div
//             style={{
//               border: "1px solid #ddd",
//               padding: "10px",
//               position: "fixed",
//               left: "50%",
//               top: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: "100",
//               backdropFilter: "blur(10px)",
//               width: "90%",
//               maxHeight: "80vh",
//               overflowY: "auto",
//               backgroundColor: "white",
//               borderRadius: "10px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               // width: '1800px'
//             }}
//           >
//             <style>
//               {`
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

//             {/* Non-Scrollable Heading */}
//             <div
//               style={{
//                 width: "100%",
//                 backgroundColor: "#007bff",
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
//               Student Attendance Report
//             </div>

//             {/* Scrollable Content */}
//             <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
//               <AttendanceReport attendanceData={attendanceData} />
//             </div>
//           </div>
//         </>
//       )}

//       {timeTableData.length > 0 && showData === "time_table" && (
//         <div
//           style={{
//             border: "1px solid rgba(0, 0, 0, 0.1)",
//             padding: "0",
//             position: "fixed",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "1000",
//             backdropFilter: "blur(5px)",
//             width: "95%",
//             maxWidth: "1200px",
//             maxHeight: "90vh",
//             overflow: "hidden",
//             backgroundColor: "rgba(255, 255, 255, 0.98)",
//             borderRadius: "12px",
//             boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <style>
//             {`
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
//           background: #007bff;
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
//           </style>

//           {/* Header with close button */}
//           <div
//             style={{
//               width: "100%",
//               background: "linear-gradient(135deg, #007bff 0%, #0062cc 100%)",
//               padding: "15px 20px",
//               borderTopLeftRadius: "12px",
//               borderTopRightRadius: "12px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               position: "sticky",
//               top: 0,
//               zIndex: 100,
//               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//             }}
//           >
//             <h3 style={{ margin: 0, color: "white", fontSize: "20px" }}>
//               Weekly Timetable
//             </h3>
//             <button
//               onClick={handleHide}
//               style={{
//                 background: "rgba(255,255,255,0.2)",
//                 border: "none",
//                 width: "30px",
//                 height: "30px",
//                 borderRadius: "50%",
//                 color: "white",
//                 fontSize: "18px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "background 0.2s",
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
//               }
//             >
//               &times;
//             </button>
//           </div>

//           {/* Timetable content */}
//           <div style={{ padding: "10px", overflowY: "auto", flex: 1 }}>
//             <div className="timetable-container">
//               {days.map((day) => (
//                 <div className="day-column" key={day}>
//                   <h5>{day}</h5>
//                   {groupedData[day]?.length > 0 ? (
//                     groupedData[day].map((item, index) => (
//                       <div key={index} className="shift-box">
//                         <h5>Shift: {item.shift}</h5>
//                         <h5>Period: {item.period}</h5>
//                         <h5>Teacher: {item.full_name}</h5>
//                         <p>
//                           <strong>Class:</strong> {item.class}
//                         </p>
//                         <p>
//                           <strong>Subject:</strong> {item.subjects}
//                         </p>
//                         <p>
//                           <strong>Time:</strong> {item.time_from} -{" "}
//                           {item.time_to}
//                         </p>
//                         <p>
//                           <strong>Room:</strong> {item.room_no}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <div
//                       className="shift-box"
//                       style={{ textAlign: "center", color: "#6c757d" }}
//                     >
//                       No classes scheduled
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="d-flex">
//         <div className="col-md-12 p-2">
//           <h5 className="text-warning bg-primary p-2 card-header border">
//             <i className="fas fa-graduation-cap"></i>Student Profile
//           </h5>

//           <div className="mt-2 row d-flex justify-content-center">
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1 mt-1"
//               onClick={() =>
//                 viewTimeTable(
//                   admissionData.class_id,
//                   admissionData.section_id,
//                   admissionData.shift
//                 )
//               }
//             >
//               <i className="fas fa-calendar-alt"></i> View Time Table
//             </button>
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1  mt-1"
//               onClick={() => viewAttendance(admissionData.id)}
//             >
//               <i className="fas fa-clipboard-check"></i> View Attendance
//             </button>
//             {/* <button className='btn btn-warning mr-2 col-sm-12 col-md-2  mt-1' onClick={() => viewSyllabus(admissionData.id)} ><i className='fas fa-book-open'></i> View Class Syllabus</button> */}
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1  mt-1"
//               onClick={() =>
//                 viewHomeWork(
//                   admissionData.class_id,
//                   admissionData.section_id,
//                   admissionData.shift
//                 )
//               }
//             >
//               <i className="fas fa-tasks"></i> Home Work
//             </button>
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1  mt-1"
//               onClick={() => logout()}
//             >
//               <i className="fas fa-sign-out-alt"></i> Logout
//             </button>
//           </div>
//           <style>
//             {`
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
//           </style>

//           {admissionData ? (
//             <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
//               <div
//                 style={{
//                   marginBottom: "20px",
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     border: "2px solid #ccc",
//                     borderRadius: "10px",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                     width: "200px",
//                     height: "200px",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {admissionData.student_image &&
//                     admissionData.student_image !== "" &&
//                     admissionData.student_image !== "-" && (
//                       <div style={{ marginTop: "10px" }}>
//                         <img
//                           src={
//                             process.env.REACT_APP_API_BASE_URL +
//                             `/uploads/${admissionData.student_image}`
//                           }
//                           alt="Student"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             borderRadius: "5px",
//                           }}
//                         />
//                       </div>
//                     )}
//                 </div>
//               </div>

//               <table
//                 className="admission_detail"
//                 style={{ minWidth: "1000px" }}
//               >
//                 <thead>
//                   <tr>
//                     <th colSpan="6" style={{ background: "#ddd" }}>
//                       Student Details
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th>Session</th>
//                     <td>{admissionData.session_name}</td>
//                     <th>Reg#</th>
//                     <td>{admissionData.register_no}</td>
//                     <th>Old_Reg#</th>
//                     <td>{admissionData.old_register_no}</td>
//                   </tr>
//                   <tr>
//                     <th>Name</th>
//                     <td>{admissionData.full_name}</td>
//                     <th>Class</th>
//                     <td>{`${admissionData.class_name} (${admissionData.section_name})`}</td>
//                     <th className="text-primary">Category</th>
//                     <td className="text-primary">
//                       {admissionData.category_name}
//                     </td>
//                   </tr>
//                   <tr>
//                     <th>Adm Date</th>
//                     <td>{formatDate(admissionData.admission_date)}</td>
//                     <th>Shift</th>
//                     <td>{admissionData.shift}</td>
//                     <th>Gender</th>
//                     <td>{admissionData.gender}</td>
//                   </tr>
//                   <tr>
//                     <th>DOB</th>
//                     <td>{formatDate(admissionData.dob)}</td>
//                     <th>Religion</th>
//                     <td>{admissionData.religion}</td>
//                     <th>Cast</th>
//                     <td>{admissionData.cast}</td>
//                   </tr>
//                   <tr>
//                     <th>BG</th>
//                     <td>{admissionData.blood_group}</td>
//                     <th>M_Tongue</th>
//                     <td>{admissionData.mother_tongue}</td>
//                     <th>C_Address</th>
//                     <td>{admissionData.current_address}</td>
//                   </tr>
//                   <tr>
//                     <th>P_Address</th>
//                     <td>{admissionData.permanent_address}</td>
//                     <th>Mobile No</th>
//                     <td>{admissionData.mobile_no}</td>
//                     <th>Student CNIC</th>
//                     <td>{admissionData.student_cnic}</td>
//                   </tr>
//                   <tr>
//                     <th>Status</th>
//                     <td>{admissionData.status}</td>
//                     <th>Father CNIC</th>
//                     <td>{admissionData.father_cnic}</td>
//                     <th>Bus Status</th>
//                     <td>{admissionData.bus_status || "-"}</td>
//                   </tr>
//                   <tr>
//                     <th>Bus Fee</th>
//                     <td>{admissionData.bus_fee || 0}</td>
//                     <th>Pendency Status</th>
//                     <td>{admissionData.status_for_pendings || "-"}</td>
//                   </tr>
//                 </tbody>
//                 <thead>
//                   <tr>
//                     <th colSpan="6" style={{ background: "#ddd" }}>
//                       Guardian Details
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th>Name</th>
//                     <td>{admissionData.guardian_name}</td>
//                     <th>Relation</th>
//                     <td>{admissionData.relation}</td>
//                     <th>Occupation</th>
//                     <td>{admissionData.occupation}</td>
//                   </tr>
//                   <tr>
//                     <th>Mobile No</th>
//                     <td>{admissionData.guardian_mobile_no}</td>
//                     <th>Address</th>
//                     <td>{admissionData.guardian_address}</td>
//                     <th>CNIC</th>
//                     <td>{admissionData.guardian_cnic}</td>
//                   </tr>
//                   {admissionData.pl_no && (
//                     <tr>
//                       <th>PL No</th>
//                       <td>{admissionData.pl_no}</td>
//                       <th>Designation</th>
//                       <td>{admissionData.designation}</td>
//                       <th>Department</th>
//                       <td>{admissionData.department}</td>
//                     </tr>
//                   )}
//                 </tbody>
//                 <thead>
//                   <tr>
//                     <th colSpan="6" style={{ background: "#ddd" }}>
//                       Father Job Detail (If POF)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th>PL No</th>
//                     <td>{admissionData.pl_no || "-"}</td>
//                     <th>Designation</th>
//                     <td>{admissionData.designation || "-"}</td>
//                     <th>Department</th>
//                     <td>{admissionData.department || "-"}</td>
//                   </tr>

//                   <tr>
//                     <th>House</th>
//                     <td>{admissionData.house_name || "-"}</td>
//                     <th>Club</th>
//                     <td>{admissionData.club_name || "-"}</td>
//                   </tr>
//                 </tbody>
//               </table>

//               <table
//                 className="admission_detail"
//                 style={{ minWidth: "1000px" }}
//               >
//                 <thead>
//                   <tr>
//                     <th colSpan="11" style={{ background: "#ddd" }}>
//                       Student Voucher Ledger
//                     </th>
//                   </tr>
//                   <tr>
//                     <th>Sr.No</th>
//                     <th>Month</th>
//                     <th>Advance</th>
//                     <th>T.Amount</th>
//                     <th>Due Date</th>
//                     <th>Received Payment</th>
//                     <th>Payment Date</th>
//                     <th>Status</th>
//                     <th>Remaining</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {voucherDataLedger.length > 0 ? (
//                     voucherDataLedger.map(
//                       (voucher, index) =>
//                         voucher.for_the_month !== null &&
//                         voucher.for_the_month !== undefined && (
//                           <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{convertMonth(voucher.for_the_month)}</td>
//                             <td>{voucher.first_advance_payment || 0}</td>
//                             <td>{voucher.total_amount || 0}</td>
//                             <td>
//                               {voucher.due_date
//                                 ? convertDates(voucher.due_date)
//                                 : "-"}
//                             </td>
//                             <td>{voucher.recieved_payment || 0}</td>
//                             <td>
//                               {voucher.payment_date
//                                 ? convertDates(voucher.payment_date)
//                                 : "-"}
//                             </td>
//                             <td
//                               style={{
//                                 color:
//                                   voucher.fee_status === "paid"
//                                     ? "green"
//                                     : "red",
//                               }}
//                             >
//                               {voucher.fee_status || "-"}
//                             </td>
//                             <td>
//                               {voucher.fee_status === "paid"
//                                 ? 0
//                                 : voucher.total_amount}
//                             </td>
//                             <td>
//                               <button
//                                 className="btn btn-secondary btn-sm"
//                                 onClick={() => viewData(voucher.voucher_id)}
//                               >
//                                 <i className="fas fa-eye"></i>
//                               </button>
//                             </td>
//                           </tr>
//                         )
//                     )
//                   ) : (
//                     <tr>
//                       <td colSpan="9" style={{ textAlign: "center" }}>
//                         No vouchers exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               <table class="admission_detail" style={{ width: "100%" }}>
//                 <thead>
//                   <tr>
//                     <th colSpan="10" style={{ background: "#ddd" }}>
//                       Student Activities
//                     </th>
//                   </tr>
//                   <tr>
//                     <th>Sr.No</th>
//                     <th>Date</th>
//                     <th>Name</th>
//                     <th>Activity Type</th>
//                     <th>Position</th>
//                     <th>Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {activitiesData.length > 0 ? (
//                     <>
//                       {activitiesData.map((voucher, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td>{convertDates(voucher.activity_date)}</td>{" "}
//                           {/* Display for_the_month since we know it's valid */}
//                           <td>{voucher.name}</td>
//                           <td>{voucher.activity_type}</td>
//                           <td>{voucher.position}</td>
//                           <td>{voucher.remarks}</td>
//                         </tr>
//                       ))}
//                     </>
//                   ) : (
//                     <tr>
//                       <td colSpan="6" style={{ textAlign: "center" }}>
//                         No Activity exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               <table class="admission_detail" style={{ width: "100%" }}>
//                 <thead>
//                   <tr>
//                     <th colSpan="10" style={{ background: "#ddd" }}>
//                       Student Discipline
//                     </th>
//                   </tr>
//                   <tr>
//                     <th>Sr.No</th>
//                     <th>Date.Of.Incident</th>
//                     <th>Type.of.Incident</th>
//                     <th>Action</th>
//                     <th>Description</th>
//                     <th>Reporting.Teacher</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {disciplineData.length > 0 ? (
//                     <>
//                       {disciplineData.map((voucher, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td>{convertDates(voucher.date_of_incident)}</td>{" "}
//                           {/* Display for_the_month since we know it's valid */}
//                           <td>{voucher.type_of_incident}</td>
//                           <td>{voucher.action_taken}</td>
//                           <td>{voucher.description}</td>
//                           <td>{voucher.reporting_teacher}</td>
//                         </tr>
//                       ))}
//                     </>
//                   ) : (
//                     <tr>
//                       <td colSpan="6" style={{ textAlign: "center" }}>
//                         No Disciplinary Action Exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               <table class="admission_detail" style={{ width: "100%" }}>
//                 <thead>
//                   <tr>
//                     <th colSpan="10" style={{ background: "#ddd" }}>
//                       Events
//                     </th>
//                   </tr>
//                   <tr>
//                     <th>Sr.No</th>
//                     <th>Event</th>
//                     <th>Description</th>
//                     <th>Start</th>
//                     <th>End</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {eventsData.length > 0 ? (
//                     <>
//                       {eventsData.map((event, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td>{event.title}</td>
//                           <td>{event.description}</td>
//                           <td>{convertDatesWithTime(event.start)}</td>
//                           <td>{convertDatesWithTime(event.end)}</td>
//                         </tr>
//                       ))}
//                     </>
//                   ) : (
//                     <tr>
//                       <td colSpan="6" style={{ textAlign: "center" }}>
//                         No Events Exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div>Loading data...</div>
//           )}
//         </div>
//       </div>

//       {showData == "view_home_work_list" && (
//         <div
//           style={{
//             border: "1px solid #ddd",
//             padding: "10px",
//             position: "fixed",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "200",
//             backdropFilter: "blur(10px)",
//             width: "100%",
//             height: "100%",
//             overflowY: "auto",
//             backgroundColor: "white",
//             borderRadius: "10px",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             // display: 'flex',
//             flexDirection: "column",
//             alignItems: "center",
//             // width: '1500px'
//           }}
//         >
//           <style>
//             {`
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
//           </style>

//           {/* Close Button */}
//           <button
//             onClick={handleHide}
//             style={{
//               position: "absolute",
//               top: "16px",
//               right: "16px",
//               background: "transparent",
//               border: "none",
//               fontSize: "20px",
//               cursor: "pointer",
//               zIndex: "200", // Ensures it stays on top of other elements
//             }}
//           >
//             &times;
//           </button>

//           <div
//             style={{
//               width: "100%",
//               backgroundColor: "#007bff",
//               padding: "5px",
//               borderBottom: "1px solid #ddd",
//               position: "sticky",
//               top: "0",
//               zIndex: "150",
//               textAlign: "center",
//               fontSize: "18px",
//               fontWeight: "bold",
//               color: "#ffc107",
//             }}
//           >
//             Home Work
//           </div>

//           <div className="col-md-12 p-2 mx-auto">
//             <div className="card-header text-warning bg-primary p-2">
//               <div className="d-flex justify-content-between align-items-center">
//                 {" "}
//                 <div>
//                   <i className="fas fa-list"></i> Home Work List{" "}
//                 </div>
//                 {/* search category */}
//                 <div className="row pr-1">
//                   <div className="col-md-5 col-sm-12 mb-2 mt-2">
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="search_date"
//                       onKeyDown={handleKeyDown}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           search_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>

//                   <div className="col-md-5 col-sm-12 mt-2">
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="search_category"
//                       onKeyDown={handleKeyDown}
//                       onChange={(e) =>
//                         getSearchCategoryReport({
//                           ...searchCategoryReport,
//                           search: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <button
//                       className="btn btn-danger mt-2"
//                       onClick={searchCategory}
//                     >
//                       Search
//                     </button>
//                   </div>
//                 </div>
//                 <div className="d-none">
//                   <div className="me-2 mr-2">
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="from_date"
//                       onChange={(e) =>
//                         getAllReports({ ...report, from_date: e.target.value })
//                       }
//                     />
//                   </div>

//                   <div className="me-2 mr-2">
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="to_date"
//                       onChange={(e) =>
//                         getAllReports({ ...report, to_date: e.target.value })
//                       }
//                     />
//                   </div>

//                   <div className="me-2 mr-2">
//                     <select
//                       name="type"
//                       id="type"
//                       className="form-control"
//                       onChange={(e) =>
//                         getAllReports({
//                           ...report,
//                           report_type: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">Select Type</option>
//                       <option value="excel">Excel</option>
//                       <option value="pdf">PDF</option>
//                     </select>
//                   </div>

//                   <button className="btn btn-sm btn-danger" onClick={getReport}>
//                     Get Report
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="border p-2">
//               <div className="pb-3">
//                 <select value={totalItem} onChange={handleTotalItemChange}>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="30">30</option>
//                   <option value="40">40</option>
//                   <option value="50">50</option>
//                 </select>
//               </div>
//               <div className="table-responsive">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Class</th>
//                       <th>Subject</th>
//                       <th>Shift</th>
//                       <th>Descrip.</th>
//                       <th>Download.File</th>
//                       {/* <th>Action</th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       <tr>
//                         <td colSpan="4">Loading...</td>
//                       </tr>
//                     ) : (
//                       data.map((subhead, index) => (
//                         <tr key={index}>
//                           {/* <td>{bank_detail.id}</td> */}
//                           <td>{subhead.home_work_date}</td>
//                           <td>
//                             {subhead.class_name +
//                               "(" +
//                               subhead.section_name +
//                               ")"}
//                           </td>
//                           <td>{subhead.subjects}</td>
//                           <td>{subhead.shift}</td>

//                           <td
//                             dangerouslySetInnerHTML={{
//                               __html: subhead.description,
//                             }}
//                           ></td>
//                           <td>
//                             {subhead.homework_file ? (
//                               <a
//                                 href={`${process.env.REACT_APP_API_BASE_URL}/uploads/${subhead.homework_file}`}
//                                 rel="noopener noreferrer"
//                                 className="btn btn-sm btn-success"
//                                 download
//                                 title={`Download ${subhead.homework_file
//                                   .split("/")
//                                   .pop()}`}
//                               >
//                                 <i className="fas fa-download"></i>{" "}
//                                 {subhead.homework_file.split("/").pop()}
//                               </a>
//                             ) : (
//                               <span className="text-muted">No file</span>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <ReactPaginate
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 breakLabel={"..."}
//                 pageCount={totalPages}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={3}
//                 onPageChange={handlePageChange}
//                 containerClassName={"pagination"}
//                 pageClassName={"page-item"}
//                 activeClassName={"active"}
//                 pageLinkClassName={"page-link"}
//                 previousClassName={"page-item"}
//                 previousLinkClassName={"page-link"}
//                 nextClassName={"page-item"}
//                 nextLinkClassName={"page-link"}
//                 breakClassName={"page-item"}
//                 breakLinkClassName={"page-link"}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {showData == "view_voucher" && (
//         <>
//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               zIndex: "100",
//               backdropFilter: "blur(10px)",
//               width: "90%",
//               maxWidth: "1800px",
//               maxHeight: "90vh",
//               backgroundColor: "white",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               padding: "10px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 position: "sticky",
//                 top: 0,
//                 zIndex: 101,
//                 backgroundColor: "#007bff",
//                 color: "#ffc107",
//                 padding: "8px 16px",
//               }}
//             >
//               <h5 style={{ margin: 0 }}>View Voucher</h5>
//               <button
//                 onClick={() => setShowData(false)}
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
//                 padding: "20px",
//                 marginTop: "10px",
//                 width: "100%",
//                 overflowY: "auto",
//                 maxHeight: "calc(90vh - 80px)",
//                 paddingTop: "5px",
//               }}
//             >
//               <button
//                 onClick={handlePrint}
//                 className="btn btn-warning btn-sm ml-4 mt-0"
//               >
//                 <i className="fa fa-print" aria-hidden="true"></i> Print
//               </button>

//               <div className="data" ref={componentRef}>
//                 {voucherData.map((voucher, index) => (
//                   <SingleVoucher
//                     key={index}
//                     data={voucher}
//                     bankDetails={getBankDetails}
//                     bankNotes={getBankNotes}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// {
//   /* Voucher view modal */
// }

// const formatNumber = (amount) => {
//   // console.log("yes test");
//   return new Intl.NumberFormat("en-US").format(amount);
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
//     attendance_amount,
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
//                 {formatNumber(
//                   total_amount_data + arrears + parseInt(first_advance_payment)
//                 )}
//               </th>
//             </tr>
//             <tr>
//               <th colSpan={2}>Payable (After Due Date) :</th>
//               <th colSpan={2}>
//                 {formatNumber(
//                   after_due_date_amount +
//                     arrears +
//                     parseInt(first_advance_payment)
//                 )}
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
//         {status && status === "paid" && (
//           <div
//             style={{
//               position: "absolute",
//               top: "350px",
//               right: "30px",
//               opacity: "0.2",
//               zIndex: "2000",
//             }}
//           >
//             <img
//               src={process.env.REACT_APP_BASE_URL + `/uploads/paid stamp.png`}
//               alt="stamp picture"
//               style={{
//                 width: "150px",
//                 objectFit: "cover",
//                 borderRadius: "5px",
//                 zIndex: "2000",
//               }}
//             />
//           </div>
//         )}

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
// };

// export default StudentProfile;




// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import { useAuth } from "./AuthContext";
// import AcademicSessionContext from "./AcademicSessionContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useReactToPrint } from "react-to-print";
// import Barcode from "react-barcode";
// import AttendanceReport from "./AttendanceReport";
// import authService from "./services/authService";

// function StudentProfile() {
//   const [data, setData] = useState([]);
//   const [admissionData, setAdmissionData] = useState(null);
//   const [voucherDataLedger, setVoucherDataLedger] = useState([]);
//   const [timeTableData, setTimeTableData] = useState([]);
//   const [voucherData, setVoucherData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [totalPages, totalPagesGet] = useState("");
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentFileUrl, setCurrentFileUrl] = useState("");
//   const [totalItem, setTotalItemGet] = useState(10);
//   const [activitiesData, setActivitiesData] = useState([]);
//   const [disciplineData, setDisciplineData] = useState([]);
//   const [eventsData, setEventsData] = useState([]);
//   const [searchCategoryReport, getSearchCategoryReport] = useState({
//     search: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [validity, setValidity] = useState({
//     section_name: true,
//   });
//   const [editFormData, setEditFormData] = useState({
//     class_id: "",
//     section_id: "",
//     shift: "",
//     session_id: "",
//     campus_id: "",
//     user_id: "",
//     hidden_id: "",
//   });
//   const [viewVoucherId, setViewVoucherId] = useState([]);
//   const [showData, setShowData] = useState(false);
//   const [checkedVouchers, setCheckedVouchers] = useState([]);
//   const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);
//   const [getHeads, setHeads] = useState([]);
//   const [getBankDetails, setBankDetails] = useState([]);
//   const [getBankNotes, setBankNotes] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [showEvents, setShowEvents] = useState(false); // New state for toggling events

//   const componentRef = useRef();
//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const initialState = {
//     session_id: academicSession,
//     campus_id: user.user.campus_id,
//     user_id: user.user.user_id,
//     hidden_id: "",
//   };

//   const convertMonth = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${month}-${year}`;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const convertDates = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const convertDatesWithTime = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     let hours = d.getHours();
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     const minutes = d.getMinutes().toString().padStart(2, "0");
//     return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
//   };

//   const fetchData = () => {
//     axios
//       .get(
//         `${process.env.REACT_APP_API_BASE_URL}/get-student-profile/${academicSession}/${user.user.campus_id}/${user.user.student_unique_id}`
//       )
//       .then((response) => {
//         setAdmissionData(response.data.results[0]);
//         setVoucherDataLedger(response.data.results);
//         setActivitiesData(response.data.activities);
//         setDisciplineData(response.data.discipline);
//         setEventsData(response.data.events);
//       })
//       .catch((err) => {
//         toast.error("Error fetching data");
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     if (academicSession) {
//       fetchData();
//     }
//   }, [academicSession]);

//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected + 1);
//   };

//   useEffect(() => {
//     const fetchFeeVouchers = async (invoices, campus_id, session_id) => {
//       try {
//         const response = await axios.post(
//           process.env.REACT_APP_API_BASE_URL + "/view-fee-vouchers",
//           {
//             invoices,
//             campus_id,
//             session_id,
//           }
//         );

//         let vouchers = response.data.vouchers;
//         let heads = response.data.heads;
//         let bank_details = response.data.bankDetails;
//         let arrears = response.data.arrears;
//         let bank_notes = response.data.bankNotes;
//         setVoucherData(vouchers);
//         setHeads(heads);
//         setBankDetails(bank_details);
//         setBankNotes(bank_notes);

//         const vouchersWithArrears = vouchers.map((voucher) => {
//           const arrear = arrears.find((a) => a.id === voucher.id);
//           return {
//             ...voucher,
//             arrears_not_cleared: arrear ? arrear.arrears_not_cleared : "",
//           };
//         });

//         setVoucherData(vouchersWithArrears);
//       } catch (error) {
//         console.error("Error fetching fee vouchers:", error);
//       }
//     };

//     if (viewVoucherId && viewVoucherId.length > 0) {
//       fetchFeeVouchers(viewVoucherId, user.user.campus_id, academicSession);
//     }
//   }, [viewVoucherId, user.user.campus_id, academicSession]);

//   useEffect(() => {
//     if (getHeads && voucherData && voucherData.length > 0) {
//       function addHeadNameToFeeHead(heads, voucher_data) {
//         voucher_data.forEach((item) => {
//           item.fee_head = JSON.parse(item.fee_head);
//           item.fee_head.forEach((head) => {
//             const match = heads.find((headItem) => headItem.id === head.id);
//             if (match) {
//               head.head_name = match.head_name;
//             }
//           });
//           item.fee_head = JSON.stringify(item.fee_head);
//         });
//         return voucher_data;
//       }

//       const updatedData = addHeadNameToFeeHead(getHeads, voucherData);
//       setUpdatedVouchersWithHead(updatedData);
//     }
//   }, [getHeads, voucherData]);

//   useEffect(() => {
//     function addHeadNameToFeeHead(heads, voucher_data) {
//       voucher_data.forEach((item) => {
//         item.fee_head = JSON.parse(item.fee_head);
//         item.fee_head.forEach((head) => {
//           const match = heads.find((headItem) => headItem.id === head.id);
//           if (match) {
//             head.head_name = match.head_name;
//           }
//         });
//         item.fee_head = JSON.stringify(item.fee_head);
//       });
//       return voucher_data;
//     }

//     const updatedData = addHeadNameToFeeHead(getHeads, data);
//     setUpdatedVouchersWithHead(updatedData);
//   }, [viewVoucherId]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const viewData = (id_get) => {
//     setViewVoucherId([id_get]);
//     setData([]);
//     setShowData("view_voucher");
//   };

//   const days = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];

//   const groupedData = days.reduce((acc, day) => {
//     acc[day] = timeTableData.filter((item) => item.day === day);
//     return acc;
//   }, {});

//   const viewHomeWork = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL + "/homework-list", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           search_date: editFormData.search_date,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift,
//         },
//       })
//       .then((res) => {
//         setData(res.data.data);
//         setTotalCount(0);
//         totalPagesGet(res.data.totalPages);
//         setLoading(false);
//         setShowData("view_home_work_list");
//       })
//       .catch((err) => console.log(err));
//   };

//   const viewSyllabus = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL + "/view-syllabus-list", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           search_date: editFormData.search_date,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift,
//         },
//       })
//       .then((res) => {
//         setData(res.data.data);
//         setTotalCount(0);
//         totalPagesGet(res.data.totalPages);
//         setLoading(false);
//         setShowData("view_home_work_list");
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     if (admissionData) {
//       setEditFormData({
//         ...editFormData,
//         class_id: admissionData.class_id,
//         section_id: admissionData.section_id,
//         shift: admissionData.shift,
//       });
//     }
//   }, [admissionData]);

//   const viewTimeTable = (class_id, section_id, shift) => {
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-timetable`, {
//         params: {
//           class_id: class_id,
//           section_id: section_id,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           shift: shift,
//         },
//       })
//       .then((response) => {
//         setTimeTableData(response.data.results);
//         setShowData("time_table");
//       })
//       .catch((error) => {
//         console.error("Error fetching timetable:", error);
//         toast.error("Error fetching timetable!");
//       });
//   };

//   const viewAttendance = (student_id) => {
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-student-attendance`, {
//         params: {
//           student_id: student_id,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//         },
//       })
//       .then((response) => {
//         setAttendanceData(response.data.results);
//       })
//       .catch((error) => {
//         console.error("Error fetching timetable:", error);
//         toast.error("Error fetching timetable!");
//       });
//   };

//   const logout = () => {
//     authService.logout();
//     window.location.reload();
//   };

//   const handleHide = () => {
//     setTimeTableData([]);
//     setAttendanceData([]);
//     setShowData([]);
//     setData([]);
//     setShowEvents(false); // Hide events when closing other modals
//   };

//   const handleTotalItemChange = (event) => {
//     const newValue = event.target.value;
//     setTotalItemGet(newValue);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       getSearchCategoryReport(searchCategoryReport);
//       viewHomeWork();
//     }
//   };

//   const searchCategory = () => {
//     viewHomeWork();
//   };

//   const [report, getAllReports] = useState({
//     from_date: "",
//     to_date: "",
//     report_type: "",
//   });

//   const getReport = () => {
//     if (report.report_type == "pdf") {
//       // pdfReport();
//     } else if (report.report_type == "excel") {
//       // excelReport();
//     }
//   };

//   // Toggle events visibility
//   const toggleEvents = () => {
//     setShowEvents(!showEvents);
//     setShowData(false); // Ensure other modals are closed
//     setTimeTableData([]);
//     setAttendanceData([]);
//     setData([]);
//   };

//   return (
//     <>
//       <style>
//         {`
//           .animated-button {
           
//           }
//           .animated-button:hover {
            
//           }

//            .btn-event {
//       background-color: #28a745; /* Green for events */
//       border-color: #28a745;
//       color: white;
//     }
//     .btn-event:hover {
//       background-color: #218838; /* Darker green on hover */
//       border-color: #1e7e34;
//     }
//     .btn-event.event-pulse {
//       animation: eventPulse 1.5s ease-in-out infinite;
//     }
//     @keyframes eventPulse {
//       0% {
//         transform: scale(1);
//         box-shadow: 0 2px 5px rgba(0,0,0,0.2), 0 0 10px rgba(40, 167, 69, 0.3);
//         background-color: #28a745; /* Base green */
//       }
//       50% {
//         transform: scale(1.03);
//         box-shadow: 0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(40, 167, 69, 0.5);
//         background-color: rgb(33, 136, 96); /* Reddish hue */
//       }
//       100% {
//         transform: scale(1);
//         box-shadow: 0 2px 5px rgba(0,0,0,0.2), 0 0 10px rgba(40, 167, 69, 0.3);
//         background-color: #28a745; /* Back to base green */
//       }
//         }
//           .events-container {
//             animation: slideIn 0.5s ease-in-out;
//             max-height: 80vh;
//             overflow-y: auto;
//             width: 100%;
//             max-width: 1200px;
//             background: rgba(255, 255, 255, 0.98);
//             border-radius: 12px;
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
//           }
//           @keyframes slideIn {
//             from {
              
//               opacity: 0;
//             }
//             to {
//               opacity: 1;
//             }
//           }
//           .events-table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 20px;
//           }
//           .events-table th, .events-table td {
//             border: 1px solid gray;
//             padding: 10px;
//             text-align: left;
//           }
//           .events-table th {
//             background: #ddd;
//             font-weight: bold;
//           }
//           /* Custom scrollbar styles */
//           .events-container::-webkit-scrollbar {
//             width: 8px;
//           }
//           .events-container::-webkit-scrollbar-track {
//             background: #f1f1f1;
//             border-radius: 10px;
//           }
//           .events-container::-webkit-scrollbar-thumb {
//             background: #888;
//             border-radius: 10px;
//           }
//           .events-container::-webkit-scrollbar-thumb:hover {
//             background: #555;
//           }
//         `}
//       </style>

//       {attendanceData.length > 0 && (
//         <div
//           style={{
//             border: "1px solid #ddd",
//             padding: "10px",
//             position: "fixed",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "100",
//             backdropFilter: "blur(10px)",
//             width: "90%",
//             maxHeight: "80vh",
//             overflowY: "auto",
//             backgroundColor: "white",
//             borderRadius: "10px",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <button
//             onClick={handleHide}
//             style={{
//               position: "absolute",
//               top: "16px",
//               right: "16px",
//               background: "transparent",
//               border: "none",
//               fontSize: "20px",
//               cursor: "pointer",
//               zIndex: "200",
//             }}
//           >
//             ×
//           </button>
//           <div
//             style={{
//               width: "100%",
//               backgroundColor: "#007bff",
//               padding: "5px",
//               borderBottom: "1px solid #ddd",
//               position: "sticky",
//               top: "0",
//               zIndex: "150",
//               textAlign: "center",
//               fontSize: "18px",
//               fontWeight: "bold",
//               color: "#ffc107",
//             }}
//           >
//             Student Attendance Report
//           </div>
//           <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
//             <AttendanceReport attendanceData={attendanceData} />
//           </div>
//         </div>
//       )}

//       {timeTableData.length > 0 && showData === "time_table" && (
//         <div
//           style={{
//             border: "1px solid rgba(0, 0, 0, 0.1)",
//             padding: "0",
//             position: "fixed",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "1000",
//             backdropFilter: "blur(5px)",
//             width: "95%",
//             maxWidth: "1200px",
//             maxHeight: "90vh",
//             overflow: "hidden",
//             backgroundColor: "rgba(255, 255, 255, 0.98)",
//             borderRadius: "12px",
//             boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               background: "linear-gradient(135deg, ##EBD197 0%, ##EBD197 100%)",
//               padding: "15px 20px",
//               borderTopLeftRadius: "12px",
//               borderTopRightRadius: "12px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               position: "sticky",
//               top: 0,
//               zIndex: 100,
//               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//             }}
//           >
//             <h3 style={{ margin: 0, color: "white", fontSize: "20px" }}>
//               Weekly Timetable
//             </h3>
//             <button
//               onClick={handleHide}
//               style={{
//                 background: "rgba(255,255,255,0.2)",
//                 border: "none",
//                 width: "30px",
//                 height: "30px",
//                 borderRadius: "50%",
//                 color: "white",
//                 fontSize: "18px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "background 0.2s",
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
//               }
//             >
//               ×
//             </button>
//           </div>
//           <div style={{ padding: "10px", overflowY: "auto", flex: 1 }}>
//             <div className="timetable-container">
//               {days.map((day) => (
//                 <div className="day-column" key={day}>
//                   <h5>{day}</h5>
//                   {groupedData[day]?.length > 0 ? (
//                     groupedData[day].map((item, index) => (
//                       <div key={index} className="shift-box">
//                         <h5>Shift: {item.shift}</h5>
//                         <h5>Period: {item.period}</h5>
//                         <h5>Teacher: {item.full_name}</h5>
//                         <p>
//                           <strong>Class:</strong> {item.class}
//                         </p>
//                         <p>
//                           <strong>Subject:</strong> {item.subjects}
//                         </p>
//                         <p>
//                           <strong>Time:</strong> {item.time_from} - {item.time_to}
//                         </p>
//                         <p>
//                           <strong>Room:</strong> {item.room_no}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <div
//                       className="shift-box"
//                       style={{ textAlign: "center", color: "#6c757d" }}
//                     >
//                       No classes scheduled
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {showEvents && (
//         <div
//           className="events-container"
//           style={{
//             border: "1px solid rgba(0, 0, 0, 0.1)",
//             padding: "0",
//             position: "fixed",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "1000",
//             backdropFilter: "blur(5px)",
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               background: "linear-gradient(135deg, ##EBD197 0%, ##EBD197 100%)",
//               padding: "15px 20px",
//               borderTopLeftRadius: "12px",
//               borderTopRightRadius: "12px",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               position: "sticky",
//               top: 0,
//               zIndex: 100,
//               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//             }}
//           >
//             <h3 style={{ margin: 0, color: "black", fontSize: "20px" }}>
//               Events
//             </h3>
//             <button
//               onClick={handleHide}
//               style={{
//                 background: "rgba(255,255,255,0.2)",
//                 border: "none",
//                 width: "30px",
//                 height: "30px",
//                 borderRadius: "50%",
//                 color: "black",
//                 fontSize: "18px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "background 0.2s",
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
//               }
//             >
//               ×
//             </button>
//           </div>
//           <div style={{ padding: "20px" }}>
//             <table className="events-table">
//               <thead>
//                 <tr>
//                   <th>Sr.No</th>
//                   <th>Event</th>
//                   <th>Description</th>
//                   <th>Start</th>
//                   <th>End</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {eventsData.length > 0 ? (
//                   eventsData.map((event, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{event.title}</td>
//                       <td>{event.description}</td>
//                       <td>{convertDatesWithTime(event.start)}</td>
//                       <td>{convertDatesWithTime(event.end)}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" style={{ textAlign: "center" }}>
//                       No Events Exist
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       <div className="d-flex">
//         <div className="col-md-12 p-2">
//           <h5 className="text-warning bg-primary p-2 card-header border">
//             <i className="fas fa-graduation-cap"></i> Student Profile
//           </h5>
//           <div className="mt-2 row d-flex justify-content-center">
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1 mt-1 animated-button"
//               onClick={() =>
//                 viewTimeTable(
//                   admissionData?.class_id,
//                   admissionData?.section_id,
//                   admissionData?.shift
//                 )
//               }
//             >
//               <i className="fas fa-calendar-alt"></i> View Time Table
//             </button>
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1 mt-1 animated-button"
//               onClick={() => viewAttendance(admissionData?.id)}
//             >
//               <i className="fas fa-clipboard-check"></i> View Attendance
//             </button>
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1 mt-1 animated-button"
//               onClick={() =>
//                 viewHomeWork(
//                   admissionData?.class_id,
//                   admissionData?.section_id,
//                   admissionData?.shift
//                 )
//               }
//             >
//               <i className="fas fa-tasks"></i> Home Work
//             </button>
//          <button
//   className={`btn mr-2 col-sm-12 col-md-1 mt-1 animated-button ${
//     eventsData.length > 0 ? "btn-event event-pulse" : "btn-warning"
//   }`}
//   onClick={toggleEvents}
// >
//   <i className="fas fa-calendar-day"></i> View Events
// </button>
//             <button
//               className="btn btn-warning mr-2 col-sm-12 col-md-1 mt-1 animated-button"
//               onClick={logout}
//             >
//               <i className="fas fa-sign-out-alt"></i> Logout
//             </button>
//           </div>

//           {admissionData ? (
//             <div style={{ width: "100%", padding: "20px", overflowY: "auto" }}>
//               <div
//                 style={{
//                   marginBottom: "20px",
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     border: "2px solid #ccc",
//                     borderRadius: "10px",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                     width: "200px",
//                     height: "200px",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {admissionData.student_image &&
//                     admissionData.student_image !== "" &&
//                     admissionData.student_image !== "-" && (
//                       <div style={{ marginTop: "10px" }}>
//                         <img
//                           src={
//                             process.env.REACT_APP_API_BASE_URL +
//                             `/Uploads/${admissionData.student_image}`
//                           }
//                           alt="Student"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             borderRadius: "5px",
//                           }}
//                         />
//                       </div>
//                     )}
//                 </div>
//               </div>

//               <table
//                 className="admission_detail"
//                 style={{ minWidth: "1000px" }}
//               >
//                 <thead>
//                   <tr>
//                     <th colSpan="6" style={{ background: "#ddd" }}>
//                     <i className="fa-user-graduate"></i>  Student Details
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th>Session</th>
//                     <td>{admissionData.session_name}</td>
//                     <th>Reg#</th>
//                     <td>{admissionData.register_no}</td>
//                     <th>Old_Reg#</th>
//                     <td>{admissionData.old_register_no}</td>
//                   </tr>
//                   <tr>
//                     <th>Name</th>
//                     <td>{admissionData.full_name}</td>
//                     <th>Class</th>
//                     <td>{`${admissionData.class_name} (${admissionData.section_name})`}</td>
//                     <th className="text-primary">Category</th>
//                     <td className="text-primary">
//                       {admissionData.category_name}
//                     </td>
//                   </tr>
//                   <tr>
//                     <th>Adm Date</th>
//                     <td>{formatDate(admissionData.admission_date)}</td>
//                     <th>Shift</th>
//                     <td>{admissionData.shift}</td>
//                     <th>Gender</th>
//                     <td>{admissionData.gender}</td>
//                   </tr>
//                   <tr>
//                     <th>DOB</th>
//                     <td>{formatDate(admissionData.dob)}</td>
//                     <th>Religion</th>
//                     <td>{admissionData.religion}</td>
//                     <th>Cast</th>
//                     <td>{admissionData.cast}</td>
//                   </tr>
//                   <tr>
//                     <th>BG</th>
//                     <td>{admissionData.blood_group}</td>
//                     <th>M_Tongue</th>
//                     <td>{admissionData.mother_tongue}</td>
//                     <th>C_Address</th>
//                     <td>{admissionData.current_address}</td>
//                   </tr>
//                   <tr>
//                     <th>P_Address</th>
//                     <td>{admissionData.permanent_address}</td>
//                     <th>Mobile No</th>
//                     <td>{admissionData.mobile_no}</td>
//                     <th>Student CNIC</th>
//                     <td>{admissionData.student_cnic}</td>
//                   </tr>
//                   <tr>
//                     <th>Status</th>
//                     <td>{admissionData.status}</td>
//                     <th>Father CNIC</th>
//                     <td>{admissionData.father_cnic}</td>
//                     <th>Bus Status</th>
//                     <td>{admissionData.bus_status || "-"}</td>
//                   </tr>
//                   <tr>
//                     <th>Bus Fee</th>
//                     <td>{admissionData.bus_fee || 0}</td>
//                     <th>Pendency Status</th>
//                     <td>{admissionData.status_for_pendings || "-"}</td>
//                   </tr>
//                 </tbody>
//                 <thead>
//                   <tr>
//                     <th colSpan="6" style={{ background: "#ddd" }}>
//                       Guardian Details
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th>Name</th>
//                     <td>{admissionData.guardian_name}</td>
//                     <th>Relation</th>
//                     <td>{admissionData.relation}</td>
//                     <th>Occupation</th>
//                     <td>{admissionData.occupation}</td>
//                   </tr>
//                   <tr>
//                     <th>Mobile No</th>
//                     <td>{admissionData.guardian_mobile_no}</td>
//                     <th>Address</th>
//                     <td>{admissionData.guardian_address}</td>
//                     <th>CNIC</th>
//                     <td>{admissionData.guardian_cnic}</td>
//                   </tr>
//                   {admissionData.pl_no && (
//                     <tr>
//                       <th>PL No</th>
//                       <td>{admissionData.pl_no}</td>
//                       <th>Designation</th>
//                       <td>{admissionData.designation}</td>
//                       <th>Department</th>
//                       <td>{admissionData.department}</td>
//                     </tr>
//                   )}
//                 </tbody>
//                 <thead>
//                   <tr>
//                     <th colSpan="6" style={{ background: "#ddd" }}>
//                       Father Job Detail (If POF)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <th>PL No</th>
//                     <td>{admissionData.pl_no || "-"}</td>
//                     <th>Designation</th>
//                     <td>{admissionData.designation || "-"}</td>
//                     <th>Department</th>
//                     <td>{admissionData.department || "-"}</td>
//                   </tr>
//                   <tr>
//                     <th>House</th>
//                     <td>{admissionData.house_name || "-"}</td>
//                     <th>Club</th>
//                     <td>{admissionData.club_name || "-"}</td>
//                   </tr>
//                 </tbody>
//               </table>

//               <table
//                 className="admission_detail"
//                 style={{ minWidth: "1000px" }}
//               >
//                 <thead>
//                   <tr>
//                     <th colSpan="11" style={{ background: "#ddd" }}>
//                      <i className="fas fa-file-invoice-dollar mr-2"></i> Student Voucher Ledger
//                     </th>
//                   </tr>
//                   <tr>
//                     <th>Sr.No</th>
//                     <th>Month</th>
//                     <th>Advance</th>
//                     <th>T.Amount</th>
//                     <th>Due Date</th>
//                     <th>Received Payment</th>
//                     <th>Payment Date</th>
//                     <th>Status</th>
//                     <th>Remaining</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {voucherDataLedger.length > 0 ? (
//                     voucherDataLedger.map(
//                       (voucher, index) =>
//                         voucher.for_the_month !== null &&
//                         voucher.for_the_month !== undefined && (
//                           <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{convertMonth(voucher.for_the_month)}</td>
//                             <td>{voucher.first_advance_payment || 0}</td>
//                             <td>{voucher.total_amount || 0}</td>
//                             <td>
//                               {voucher.due_date
//                                 ? convertDates(voucher.due_date)
//                                 : "-"}
//                             </td>
//                             <td>{voucher.recieved_payment || 0}</td>
//                             <td>
//                               {voucher.payment_date
//                                 ? convertDates(voucher.payment_date)
//                                 : "-"}
//                             </td>
//                             <td
//                               style={{
//                                 color:
//                                   voucher.fee_status === "paid"
//                                     ? "green"
//                                     : "red",
//                               }}
//                             >
//                               {voucher.fee_status || "-"}
//                             </td>
//                             <td>
//                               {voucher.fee_status === "paid"
//                                 ? 0
//                                 : voucher.total_amount}
//                             </td>
//                             <td>
//                               <button
//                                 className="btn btn-secondary btn-sm"
//                                 onClick={() => viewData(voucher.voucher_id)}
//                               >
//                                 <i className="fas fa-eye"></i>
//                               </button>
//                             </td>
//                           </tr>
//                         )
//                     )
//                   ) : (
//                     <tr>
//                       <td colSpan="9" style={{ textAlign: "center" }}>
//                         No vouchers exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               <table className="admission_detail" style={{ width: "100%" }}>
//                 <thead>
//                   <tr>
//                     <th colSpan="10" style={{ background: "#ddd" }}>
//                     <i className="fas fa-running mr-2"></i>  Student Activities
//                     </th>
//                   </tr>
//                   <tr>
//                     <th>Sr.No</th>
//                     <th>Date</th>
//                     <th>Name</th>
//                     <th>Activity Type</th>
//                     <th>Position</th>
//                     <th>Remarks</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {activitiesData.length > 0 ? (
//                     activitiesData.map((voucher, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{convertDates(voucher.activity_date)}</td>
//                         <td>{voucher.name}</td>
//                         <td>{voucher.activity_type}</td>
//                         <td>{voucher.position}</td>
//                         <td>{voucher.remarks}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" style={{ textAlign: "center" }}>
//                         No Activity exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               <table className="admission_detail" style={{ width: "100%" }}>
//                 <thead>
//                   <tr>
//                     <th colSpan="10" style={{ background: "#ddd" }}>
//                      <i className="fas fa-gavel mr-2"></i> Student Discipline
//                     </th>
//                   </tr>
//                   <tr>
//                     <th>Sr.No</th>
//                     <th>Date.Of.Incident</th>
//                     <th>Type.of.Incident</th>
//                     <th>Action</th>
//                     <th>Description</th>
//                     <th>Reporting.Teacher</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {disciplineData.length > 0 ? (
//                     disciplineData.map((voucher, index) => (
//                       <tr key={index}>
//                         <td>{index + 1}</td>
//                         <td>{convertDates(voucher.date_of_incident)}</td>
//                         <td>{voucher.type_of_incident}</td>
//                         <td>{voucher.action_taken}</td>
//                         <td>{voucher.description}</td>
//                         <td>{voucher.reporting_teacher}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" style={{ textAlign: "center" }}>
//                         No Disciplinary Action Exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div>Loading data...</div>
//           )}
//         </div>
//       </div>

//       {showData === "view_home_work_list" && (
//         <div
//           style={{
//             border: "1px solid #ddd",
//             padding: "10px",
//             position: "fixed",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "200",
//             backdropFilter: "blur(10px)",
//             width: "100%",
//             height: "100%",
//             overflowY: "auto",
//             backgroundColor: "white",
//             borderRadius: "10px",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         >
//           <button
//             onClick={handleHide}
//             style={{
//               position: "absolute",
//               top: "16px",
//               right: "16px",
//               background: "transparent",
//               border: "none",
//               fontSize: "20px",
//               cursor: "pointer",
//               zIndex: "200",
//             }}
//           >
//             ×
//           </button>
//           <div
//             style={{
//               width: "100%",
              
//               padding: "20px",
//               zIndex: "150",
//               fontSize: "18px",
//               fontWeight: "bold",
//               color: "black",
//             }}
//           >
          
//           </div>
//           <div className="col-md-12 p-2 mx-auto">
//             <div className="card-header text-warning bg-primary p-2">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <i className="fas fa-list"></i> Home Work List
//                 </div>
//                 <div className="row pr-1">
//                   <div className="col-md-5 col-sm-12 mb-2 mt-2">
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="search_date"
//                       onKeyDown={handleKeyDown}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           search_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div className="col-md-5 col-sm-12 mt-2">
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="search_category"
//                       onKeyDown={handleKeyDown}
//                       onChange={(e) =>
//                         getSearchCategoryReport({
//                           ...searchCategoryReport,
//                           search: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <button
//                       className="btn btn-danger mt-2"
//                       onClick={searchCategory}
//                     >
//                       Search
//                     </button>
//                   </div>
//                 </div>
//                 <div className="d-none">
//                   <div className="me-2 mr-2">
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="from_date"
//                       onChange={(e) =>
//                         getAllReports({ ...report, from_date: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="me-2 mr-2">
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="to_date"
//                       onChange={(e) =>
//                         getAllReports({ ...report, to_date: e.target.value })
//                       }
//                     />
//                   </div>
//                   <div className="me-2 mr-2">
//                     <select
//                       name="type"
//                       id="type"
//                       className="form-control"
//                       onChange={(e) =>
//                         getAllReports({
//                           ...report,
//                           report_type: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">Select Type</option>
//                       <option value="excel">Excel</option>
//                       <option value="pdf">PDF</option>
//                     </select>
//                   </div>
//                   <button className="btn btn-sm btn-danger" onClick={getReport}>
//                     Get Report
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="border p-2">
//               <div className="pb-3">
//                 <select value={totalItem} onChange={handleTotalItemChange}>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="30">30</option>
//                   <option value="40">40</option>
//                   <option value="50">50</option>
//                 </select>
//               </div>
//               <div className="table-responsive">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Class</th>
//                       <th>Subject</th>
//                       <th>Shift</th>
//                       <th>Descrip.</th>
//                       <th>Download.File</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       <tr>
//                         <td colSpan="4">Loading...</td>
//                       </tr>
//                     ) : (
//                       data.map((subhead, index) => (
//                         <tr key={index}>
//                           <td>{subhead.home_work_date}</td>
//                           <td>
//                             {subhead.class_name + "(" + subhead.section_name + ")"}
//                           </td>
//                           <td>{subhead.subjects}</td>
//                           <td>{subhead.shift}</td>
//                           <td
//                             dangerouslySetInnerHTML={{
//                               __html: subhead.description,
//                             }}
//                           ></td>
//                           <td>
//                             {subhead.homework_file ? (
//                               <a
//                                 href={`${process.env.REACT_APP_API_BASE_URL}/Uploads/${subhead.homework_file}`}
//                                 rel="noopener noreferrer"
//                                 className="btn btn-sm btn-success"
//                                 download
//                                 title={`Download ${subhead.homework_file
//                                   .split("/")
//                                   .pop()}`}
//                               >
//                                 <i className="fas fa-download"></i>{" "}
//                                 {subhead.homework_file.split("/").pop()}
//                               </a>
//                             ) : (
//                               <span className="text-muted">No file</span>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//               <ReactPaginate
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 breakLabel={"..."}
//                 pageCount={totalPages}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={3}
//                 onPageChange={handlePageChange}
//                 containerClassName={"pagination"}
//                 pageClassName={"page-item"}
//                 activeClassName={"active"}
//                 pageLinkClassName={"page-link"}
//                 previousClassName={"page-item"}
//                 previousLinkClassName={"page-link"}
//                 nextClassName={"page-item"}
//                 nextLinkClassName={"page-link"}
//                 breakClassName={"page-item"}
//                 breakLinkClassName={"page-link"}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {showData === "view_voucher" && (
//         <div
//           style={{
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: "100",
//             backdropFilter: "blur(10px)",
//             width: "90%",
//             maxWidth: "1800px",
//             maxHeight: "90vh",
//             backgroundColor: "white",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             padding: "10px",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               position: "sticky",
//               top: 0,
//               zIndex: 101,
//               backgroundColor: "#007bff",
//               color: "#ffc107",
//               padding: "8px 16px",
//             }}
//           >
//             <h5 style={{ margin: 0 }}>View Voucher</h5>
//             <button
//               onClick={() => setShowData(false)}
//               style={{
//                 position: "absolute",
//                 top: "5px",
//                 right: "15px",
//                 background: "transparent",
//                 border: "none",
//                 fontSize: "20px",
//                 cursor: "pointer",
//                 color: "#ffc107",
//               }}
//             >
//               ×
//             </button>
//           </div>
//           <div
//             style={{
//               padding: "20px",
//               marginTop: "10px",
//               width: "100%",
//               overflowY: "auto",
//               maxHeight: "calc(90vh - 80px)",
//               paddingTop: "5px",
//             }}
//           >
//             <button
//               onClick={handlePrint}
//               className="btn btn-warning btn-sm ml-4 mt-0"
//             >
//               <i className="fa fa-print" aria-hidden="true"></i> Print
//             </button>
//             <div className="data" ref={componentRef}>
//               {voucherData.map((voucher, index) => (
//                 <SingleVoucher
//                   key={index}
//                   data={voucher}
//                   bankDetails={getBankDetails}
//                   bankNotes={getBankNotes}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// const formatNumber = (amount) => {
//   return new Intl.NumberFormat("en-US").format(amount);
// };

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
//     attendance_amount,
//   } = data;

//   const feeHeadDetails = JSON.parse(fee_head);
//   const voucherBankDetails = JSON.parse(data.bank_details)
//     .map((bankId) => {
//       return bankDetails.find((detail) => detail.id === bankId);
//     })
//     .filter((detail) => detail !== undefined);

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
//                 <th colSpan={2}>Absent Fine :</th>
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
//                 {formatNumber(
//                   total_amount_data + arrears + parseInt(first_advance_payment)
//                 )}
//               </th>
//             </tr>
//             <tr>
//               <th colSpan={2}>Payable (After Due Date) :</th>
//               <th colSpan={2}>
//                 {formatNumber(
//                   after_due_date_amount +
//                     arrears +
//                     parseInt(first_advance_payment)
//                 )}
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
//         {status && status === "paid" && (
//           <div
//             style={{
//               position: "absolute",
//               top: "350px",
//               right: "30px",
//               opacity: "0.2",
//               zIndex: "2000",
//             }}
//           >
//             <img
//               src={process.env.REACT_APP_BASE_URL + `/Uploads/paid stamp.png`}
//               alt="stamp picture"
//               style={{
//                 width: "150px",
//                 objectFit: "cover",
//                 borderRadius: "5px",
//                 zIndex: "2000",
//               }}
//             />
//           </div>
//         )}
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
// };

// export default StudentProfile;





// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import { useAuth } from "./AuthContext";
// import AcademicSessionContext from "./AcademicSessionContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useReactToPrint } from "react-to-print";
// import Barcode from "react-barcode";
// import AttendanceReport from "./AttendanceReport";
// import authService from "./services/authService";

// function StudentProfile() {
//   const [data, setData] = useState([]);
//   const [admissionData, setAdmissionData] = useState(null);
//   const [voucherDataLedger, setVoucherDataLedger] = useState([]);
//   const [timeTableData, setTimeTableData] = useState([]);
//   const [voucherData, setVoucherData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [totalPages, totalPagesGet] = useState("");
//   const [totalItem, setTotalItemGet] = useState(10);
//   const [activitiesData, setActivitiesData] = useState([]);
//   const [disciplineData, setDisciplineData] = useState([]);
//   const [eventsData, setEventsData] = useState([]);
//   const [searchCategoryReport, getSearchCategoryReport] = useState({
//     search: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [editFormData, setEditFormData] = useState({
//     class_id: "",
//     section_id: "",
//     shift: "",
//     session_id: "",
//     campus_id: "",
//     user_id: "",
//     hidden_id: "",
//     search_date: ""
//   });
//   const [viewVoucherId, setViewVoucherId] = useState([]);
//   const [showData, setShowData] = useState('');
//   const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);
//   const [getHeads, setHeads] = useState([]);
//   const [getBankDetails, setBankDetails] = useState([]);
//   const [getBankNotes, setBankNotes] = useState([]);
//   const [attendanceData, setAttendanceData] = useState([]);

//   const componentRef = useRef();
//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);

//   const styles = {
//     container: {
//       fontFamily: 'Arial, sans-serif',
//       padding: '20px',
//       margin: '0 auto',
//       backgroundColor: '#f5f5f5'
//     },
//     header: {
//       backgroundColor: '#2c3e50',
//       color: '#ffc107',
//       padding: '20px',
//       borderRadius: '8px',
//       marginBottom: '20px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     },
//     headerTitle: {
//       margin: '0',
//       fontSize: '24px',
//       fontWeight: 'bold',
//       display: 'flex',
//       alignItems: 'center',
//       gap: '10px'
//     },
//     buttonContainer: {
//       display: 'flex',
//       flexWrap: 'wrap',
//       gap: '10px',
//       marginTop: '20px',
//       justifyContent: 'center'
//     },
//     button: {
//       backgroundColor: '#ffc107',
//       color: '#000',
//       border: 'none',
//       padding: '12px 20px',
//       borderRadius: '6px',
//       cursor: 'pointer',
//       fontSize: '14px',
//       fontWeight: '500',
//       transition: 'all 0.3s ease',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     },
//     eventButton: {
//       backgroundColor: '#28a745',
//       color: '#fff',
//       animation: 'eventPulse 1.5s ease-in-out infinite'
//     },
//     logoutButton: {
//       backgroundColor: '#dc3545',
//       color: '#fff'
//     },
//     modal: {
//       position: 'fixed',
//       top: '0',
//       left: '0',
//       right: '0',
//       bottom: '0',
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: '1000',
//       padding: '20px'
//     },
//     modalContent: {
//       backgroundColor: '#fff',
//       borderRadius: '12px',
//       width: '95%',
//       maxWidth: '1200px',
//       maxHeight: '90vh',
//       overflow: 'hidden',
//       boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
//       display: 'flex',
//       flexDirection: 'column'
//     },
//     modalHeader: {
//       backgroundColor: '#2c3e50',
//       color: '#ffc107',
//       padding: '20px',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     modalTitle: {
//       margin: '0',
//       fontSize: '20px',
//       fontWeight: 'bold'
//     },
//     closeButton: {
//       backgroundColor: 'transparent',
//       border: 'none',
//       color: '#fff',
//       cursor: 'pointer',
//       padding: '5px',
//       fontSize: '28px',
//       lineHeight: '1'
//     },
//     modalBody: {
//       padding: '20px',
//       overflowY: 'auto',
//       flex: '1'
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       marginTop: '20px',
//       backgroundColor: '#fff',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     },
//     th: {
//       backgroundColor: '#2c3e50',
//       color: '#ffc107',
//       padding: '12px',
//       textAlign: 'left',
//       fontWeight: 'bold',
//       border: '1px solid #ddd'
//     },
//     td: {
//       padding: '12px',
//       border: '1px solid #ddd',
//       textAlign: 'left'
//     },
//     timetableCell: {
//       padding: '10px',
//       textAlign: 'center',
//       border: '1px solid #ddd'
//     },
//     subjectCell: {
//       backgroundColor: '#e3f2fd',
//       fontWeight: '500'
//     },
//     freeCell: {
//       backgroundColor: '#f5f5f5',
//       color: '#999',
//       fontStyle: 'italic'
//     },
//     breakCell: {
//       backgroundColor: '#fff3cd',
//       fontWeight: 'bold'
//     },
//     profileCard: {
//       backgroundColor: '#fff',
//       borderRadius: '8px',
//       padding: '20px',
//       marginTop: '20px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     },
//     imageContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       marginBottom: '20px'
//     },
//     studentImage: {
//       width: '200px',
//       height: '200px',
//       borderRadius: '10px',
//       objectFit: 'cover',
//       border: '2px solid #ccc',
//       boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
//     }
//   };

//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   const convertMonth = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${month}-${year}`;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const convertDates = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const convertDatesWithTime = (date) => {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     let hours = d.getHours();
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     const minutes = d.getMinutes().toString().padStart(2, "0");
//     return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
//   };

//   const fetchData = () => {
//     axios
//       .get(
//         `${process.env.REACT_APP_API_BASE_URL}/get-student-profile/${academicSession}/${user.user.campus_id}/${user.user.student_unique_id}`
//       )
//       .then((response) => {
//         setAdmissionData(response.data.results[0]);
//         setVoucherDataLedger(response.data.results);
//         setActivitiesData(response.data.activities);
//         setDisciplineData(response.data.discipline);
//         setEventsData(response.data.events);
//       })
//       .catch((err) => {
//         toast.error("Error fetching data");
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     if (academicSession) {
//       fetchData();
//     }
//   }, [academicSession]);

//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected + 1);
//   };

//   useEffect(() => {
//     const fetchFeeVouchers = async (invoices, campus_id, session_id) => {
//       try {
//         const response = await axios.post(
//           process.env.REACT_APP_API_BASE_URL + "/view-fee-vouchers",
//           {
//             invoices,
//             campus_id,
//             session_id,
//           }
//         );

//         let vouchers = response.data.vouchers;
//         let heads = response.data.heads;
//         let bank_details = response.data.bankDetails;
//         let arrears = response.data.arrears;
//         let bank_notes = response.data.bankNotes;
//         setVoucherData(vouchers);
//         setHeads(heads);
//         setBankDetails(bank_details);
//         setBankNotes(bank_notes);

//         const vouchersWithArrears = vouchers.map((voucher) => {
//           const arrear = arrears.find((a) => a.id === voucher.id);
//           return {
//             ...voucher,
//             arrears_not_cleared: arrear ? arrear.arrears_not_cleared : "",
//           };
//         });

//         setVoucherData(vouchersWithArrears);
//       } catch (error) {
//         console.error("Error fetching fee vouchers:", error);
//       }
//     };

//     if (viewVoucherId && viewVoucherId.length > 0) {
//       fetchFeeVouchers(viewVoucherId, user.user.campus_id, academicSession);
//     }
//   }, [viewVoucherId, user.user.campus_id, academicSession]);

//   useEffect(() => {
//     if (getHeads && voucherData && voucherData.length > 0) {
//       function addHeadNameToFeeHead(heads, voucher_data) {
//         voucher_data.forEach((item) => {
//           item.fee_head = JSON.parse(item.fee_head);
//           item.fee_head.forEach((head) => {
//             const match = heads.find((headItem) => headItem.id === head.id);
//             if (match) {
//               head.head_name = match.head_name;
//             }
//           });
//           item.fee_head = JSON.stringify(item.fee_head);
//         });
//         return voucher_data;
//       }

//       const updatedData = addHeadNameToFeeHead(getHeads, voucherData);
//       setUpdatedVouchersWithHead(updatedData);
//     }
//   }, [getHeads, voucherData]);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const viewData = (id_get) => {
//     setViewVoucherId([id_get]);
//     setShowData("view_voucher");
//   };

//   const viewHomeWork = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL + "/homework-list", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           search_date: editFormData.search_date,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift,
//         },
//       })
//       .then((res) => {
//         setData(res.data.data);
//         setTotalCount(0);
//         totalPagesGet(res.data.totalPages);
//         setLoading(false);
//         setShowData("view_home_work_list");
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     if (admissionData) {
//       setEditFormData({
//         ...editFormData,
//         class_id: admissionData.class_id,
//         section_id: admissionData.section_id,
//         shift: admissionData.shift,
//       });
//     }
//   }, [admissionData]);

//   const viewTimeTable = () => {
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-timetable`, {
//         params: {
//           class_id: admissionData.class_id,
//           section_id: admissionData.section_id,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           shift: admissionData.shift,
//         },
//       })
//       .then((response) => {
//         setTimeTableData(response.data.results);
//         setShowData("time_table");
//       })
//       .catch((error) => {
//         console.error("Error fetching timetable:", error);
//         toast.error("Error fetching timetable!");
//       });
//   };

//   const viewAttendance = () => {
//     axios
//       .get(`${process.env.REACT_APP_API_BASE_URL}/view-student-attendance`, {
//         params: {
//           student_id: admissionData.id,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//         },
//       })
//       .then((response) => {
//         setAttendanceData(response.data.results);
//       })
//       .catch((error) => {
//         console.error("Error fetching attendance:", error);
//         toast.error("Error fetching attendance!");
//       });
//   };

//   const viewEvents = () => {
//     setShowData("view_events");
//   };

//   const logout = () => {
//     authService.logout();
//     window.location.reload();
//   };

//   const handleHide = () => {
//     setTimeTableData([]);
//     setAttendanceData([]);
//     setShowData('');
//     setData([]);
//   };

//   const handleTotalItemChange = (event) => {
//     const newValue = event.target.value;
//     setTotalItemGet(newValue);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       viewHomeWork();
//     }
//   };

//   const searchCategory = () => {
//     viewHomeWork();
//   };

//   const renderTimetable = () => {
//     const groupedData = {};
//     days.forEach(day => {
//       groupedData[day] = {};
//     });

//     timeTableData.forEach(item => {
//       if (!groupedData[item.day]) {
//         groupedData[item.day] = {};
//       }
//       groupedData[item.day][item.period] = item;
//     });

//     const maxPeriod = Math.max(...timeTableData.map(item => parseInt(item.period) || 0), 8);
//     const periods = [];
//     for (let i = 1; i <= maxPeriod; i++) {
//       periods.push(i);
//       if (i === 4) periods.push('Break');
//     }

//     return (
//       <table style={styles.table}>
//         <thead>
//           <tr>
//             <th style={styles.th}>Day/Period</th>
//             {periods.map((period, index) => (
//               <th key={index} style={styles.th}>
//                 {period === 'Break' ? 'Break' : period}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {days.map(day => (
//             <tr key={day}>
//               <td style={{ ...styles.td, fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
//                 {day}
//               </td>
//               {periods.map((period, index) => {
//                 if (period === 'Break') {
//                   return (
//                     <td key={index} style={{ ...styles.timetableCell, ...styles.breakCell }}>
//                       Break
//                     </td>
//                   );
//                 }

//                 const cellData = groupedData[day][period];

//                 if (!cellData) {
//                   return (
//                     <td key={index} style={{ ...styles.timetableCell, ...styles.freeCell }}>
//                       Free
//                     </td>
//                   );
//                 }

//                 if (cellData.subjects === "BREAK" || cellData.subject_id === "break") {
//                   return (
//                     <td key={index} style={{ ...styles.timetableCell, ...styles.breakCell }}>
//                       Break
//                     </td>
//                   );
//                 }

//                 return (
//                   <td key={index} style={{ ...styles.timetableCell, ...styles.subjectCell }}>
//                     <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>
//                       {cellData.subjects || 'Subject'}
//                     </div>
//                     <div style={{ fontSize: '10px', color: '#666' }}>
//                       Teacher: {cellData.full_name}
//                     </div>
//                     {cellData.room_no && (
//                       <div style={{ fontSize: '10px', color: '#666' }}>
//                         Room: {cellData.room_no}
//                       </div>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <>
//       <style>
//         {`
//           @keyframes eventPulse {
//             0% {
//               transform: scale(1);
//               box-shadow: 0 2px 5px rgba(0,0,0,0.2), 0 0 10px rgba(40, 167, 69, 0.3);
//             }
//             50% {
//               transform: scale(1.03);
//               box-shadow: 0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(40, 167, 69, 0.5);
//             }
//             100% {
//               transform: scale(1);
//               box-shadow: 0 2px 5px rgba(0,0,0,0.2), 0 0 10px rgba(40, 167, 69, 0.3);
//             }
//           }
//         `}
//       </style>

//       {attendanceData.length > 0 && (
//         <div style={styles.modal}>
//           <div style={{ ...styles.modalContent, width: '1800px' }}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>Student Attendance Report</h2>
//               <button style={styles.closeButton} onClick={handleHide}>×</button>
//             </div>
//             <div style={styles.modalBody}>
//               <AttendanceReport attendanceData={attendanceData} />
//             </div>
//           </div>
//         </div>
//       )}

//       {showData === "time_table" && (
//         <div style={styles.modal}>
//           <div style={styles.modalContent}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>Weekly Timetable</h2>
//               <button style={styles.closeButton} onClick={handleHide}>×</button>
//             </div>
//             <div style={styles.modalBody}>
//               {renderTimetable()}
//             </div>
//           </div>
//         </div>
//       )}

//       {showData === "view_events" && (
//         <div style={styles.modal}>
//           <div style={styles.modalContent}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>Events</h2>
//               <button style={styles.closeButton} onClick={handleHide}>×</button>
//             </div>
//             <div style={styles.modalBody}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Sr.No</th>
//                     <th style={styles.th}>Event</th>
//                     <th style={styles.th}>Description</th>
//                     <th style={styles.th}>Start</th>
//                     <th style={styles.th}>End</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {eventsData.length > 0 ? (
//                     eventsData.map((event, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={styles.td}>{event.title}</td>
//                         <td style={styles.td}>{event.description}</td>
//                         <td style={styles.td}>{convertDatesWithTime(event.start)}</td>
//                         <td style={styles.td}>{convertDatesWithTime(event.end)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" style={{ ...styles.td, textAlign: "center" }}>
//                         No Events Exist
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {showData === "view_home_work_list" && (
//         <div style={styles.modal}>
//           <div style={{ ...styles.modalContent, width: '100%', height: '100%' }}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>Home Work List</h2>
//               <button style={styles.closeButton} onClick={handleHide}>×</button>
//             </div>
//             <div style={styles.modalBody}>
//               <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
//                 <input
//                   type="date"
//                   style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
//                   onChange={(e) => setEditFormData({ ...editFormData, search_date: e.target.value })}
//                   onKeyDown={handleKeyDown}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: '1', minWidth: '200px' }}
//                   onChange={(e) => getSearchCategoryReport({ ...searchCategoryReport, search: e.target.value })}
//                   onKeyDown={handleKeyDown}
//                 />
//                 <button
//                   style={{ ...styles.button, backgroundColor: '#dc3545', color: '#fff' }}
//                   onClick={searchCategory}
//                 >
//                   Search
//                 </button>
//               </div>
              
//               <div style={{ marginBottom: '10px' }}>
//                 <select 
//                   value={totalItem} 
//                   onChange={handleTotalItemChange}
//                   style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
//                 >
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="30">30</option>
//                   <option value="40">40</option>
//                   <option value="50">50</option>
//                 </select>
//               </div>

//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Class</th>
//                     <th style={styles.th}>Subject</th>
//                     <th style={styles.th}>Shift</th>
//                     <th style={styles.th}>Description</th>
//                     <th style={styles.th}>Download File</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan="6" style={{ ...styles.td, textAlign: 'center' }}>Loading...</td>
//                     </tr>
//                   ) : data.length > 0 ? (
//                     data.map((item, index) => (
//                       <tr key={index}>
//                         <td style={styles.td}>{item.home_work_date}</td>
//                         <td style={styles.td}>{item.class_name} ({item.section_name})</td>
//                         <td style={styles.td}>{item.subjects}</td>
//                         <td style={styles.td}>{item.shift}</td>
//                         <td style={styles.td} dangerouslySetInnerHTML={{ __html: item.description }}></td>
//                         <td style={styles.td}>
//                           {item.homework_file ? (
//                             <a
//                               href={`${process.env.REACT_APP_API_BASE_URL}/Uploads/${item.homework_file}`}
//                               download
//                               style={{ color: '#28a745', textDecoration: 'none' }}
//                             >
//                               <i className="fas fa-download"></i> Download
//                             </a>
//                           ) : (
//                             <span style={{ color: '#999' }}>No file</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" style={{ ...styles.td, textAlign: 'center' }}>No homework found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               <ReactPaginate
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 breakLabel={"..."}
//                 pageCount={totalPages}
//                 marginPagesDisplayed={2}
//                 pageRangeDisplayed={3}
//                 onPageChange={handlePageChange}
//                 containerClassName={"pagination"}
//                 pageClassName={"page-item"}
//                 activeClassName={"active"}
//                 pageLinkClassName={"page-link"}
//                 previousClassName={"page-item"}
//                 previousLinkClassName={"page-link"}
//                 nextClassName={"page-item"}
//                 nextLinkClassName={"page-link"}
//                 breakClassName={"page-item"}
//                 breakLinkClassName={"page-link"}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {showData === "view_voucher" && (
//         <div style={styles.modal}>
//           <div style={{ ...styles.modalContent, maxWidth: '1800px' }}>
//             <div style={styles.modalHeader}>
//               <h2 style={styles.modalTitle}>View Voucher</h2>
//               <button style={styles.closeButton} onClick={handleHide}>×</button>
//             </div>
//             <div style={styles.modalBody}>
//               <button
//                 onClick={handlePrint}
//                 style={{ ...styles.button, marginBottom: '20px' }}
//               >
//                 <i className="fa fa-print"></i> Print
//               </button>
//               <div ref={componentRef}>
//                 {voucherData.map((voucher, index) => (
//                   <SingleVoucher
//                     key={index}
//                     data={voucher}
//                     bankDetails={getBankDetails}
//                     bankNotes={getBankNotes}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div style={styles.container}>
//         <div style={styles.header}>
//           <h1 style={styles.headerTitle}>
//             <i className="fas fa-user-graduate"></i> Student Profile
//           </h1>
//         </div>

//         <div style={styles.buttonContainer}>
//           <button
//             style={styles.button}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffb300'}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
//             onClick={viewTimeTable}
//           >
//             <i className="fas fa-calendar-alt"></i> View Time Table
//           </button>

//           <button
//             style={styles.button}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffb300'}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
//             onClick={viewAttendance}
//           >
//             <i className="fas fa-clipboard-check"></i> View Attendance
//           </button>

//           <button
//             style={styles.button}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffb300'}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
//             onClick={viewHomeWork}
//           >
//             <i className="fas fa-tasks"></i> Home Work
//           </button>

//           <button
//             style={eventsData.length > 0 ? { ...styles.button, ...styles.eventButton } : styles.button}
//             onMouseOver={(e) => {
//               if (eventsData.length === 0) {
//                 e.currentTarget.style.backgroundColor = '#ffb300';
//               }
//             }}
//             onMouseOut={(e) => {
//               if (eventsData.length === 0) {
//                 e.currentTarget.style.backgroundColor = '#ffc107';
//               }
//             }}
//             onClick={viewEvents}
//           >
//             <i className="fas fa-calendar-day"></i> View Events
//           </button>

//           <button
//             style={{ ...styles.button, ...styles.logoutButton }}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
//             onClick={logout}
//           >
//             <i className="fas fa-sign-out-alt"></i> Logout
//           </button>
//         </div>

//         {admissionData && (
//           <div style={styles.profileCard}>
//             <div style={styles.imageContainer}>
//               {admissionData.student_image &&
//                 admissionData.student_image !== "" &&
//                 admissionData.student_image !== "-" && (
//                   <img
//                     src={`${process.env.REACT_APP_API_BASE_URL}/Uploads/${admissionData.student_image}`}
//                     alt="Student"
//                     style={styles.studentImage}
//                   />
//                 )}
//             </div>

//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th colSpan="6" style={{ ...styles.th, backgroundColor: '#ddd', color: '#000', fontSize: '16px' }}>
//                     <i className="fas fa-user-graduate"></i> Student Details
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <th style={styles.th}>Session</th>
//                   <td style={styles.td}>{admissionData.session_name}</td>
//                   <th style={styles.th}>Reg#</th>
//                   <td style={styles.td}>{admissionData.register_no}</td>
//                   <th style={styles.th}>Old Reg#</th>
//                   <td style={styles.td}>{admissionData.old_register_no}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Name</th>
//                   <td style={styles.td}>{admissionData.full_name}</td>
//                   <th style={styles.th}>Class</th>
//                   <td style={styles.td}>{`${admissionData.class_name} (${admissionData.section_name})`}</td>
//                   <th style={styles.th}>Category</th>
//                   <td style={styles.td}>{admissionData.category_name}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Adm Date</th>
//                   <td style={styles.td}>{formatDate(admissionData.admission_date)}</td>
//                   <th style={styles.th}>Shift</th>
//                   <td style={styles.td}>{admissionData.shift}</td>
//                   <th style={styles.th}>Gender</th>
//                   <td style={styles.td}>{admissionData.gender}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>DOB</th>
//                   <td style={styles.td}>{formatDate(admissionData.dob)}</td>
//                   <th style={styles.th}>Religion</th>
//                   <td style={styles.td}>{admissionData.religion}</td>
//                   <th style={styles.th}>Cast</th>
//                   <td style={styles.td}>{admissionData.cast}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Blood Group</th>
//                   <td style={styles.td}>{admissionData.blood_group}</td>
//                   <th style={styles.th}>Mother Tongue</th>
//                   <td style={styles.td}>{admissionData.mother_tongue}</td>
//                   <th style={styles.th}>Current Address</th>
//                   <td style={styles.td}>{admissionData.current_address}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Permanent Address</th>
//                   <td style={styles.td}>{admissionData.permanent_address}</td>
//                   <th style={styles.th}>Mobile No</th>
//                   <td style={styles.td}>{admissionData.mobile_no}</td>
//                   <th style={styles.th}>Student CNIC</th>
//                   <td style={styles.td}>{admissionData.student_cnic}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Status</th>
//                   <td style={styles.td}>{admissionData.status}</td>
//                   <th style={styles.th}>Father CNIC</th>
//                   <td style={styles.td}>{admissionData.father_cnic}</td>
//                   <th style={styles.th}>Bus Status</th>
//                   <td style={styles.td}>{admissionData.bus_status || "-"}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Bus Fee</th>
//                   <td style={styles.td}>{admissionData.bus_fee || 0}</td>
//                   <th style={styles.th}>Pendency Status</th>
//                   <td style={styles.td}>{admissionData.status_for_pendings || "-"}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th colSpan="6" style={{ ...styles.th, backgroundColor: '#ddd', color: '#000', fontSize: '16px' }}>
//                     <i className="fas fa-users"></i> Guardian Details
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <th style={styles.th}>Name</th>
//                   <td style={styles.td}>{admissionData.guardian_name}</td>
//                   <th style={styles.th}>Relation</th>
//                   <td style={styles.td}>{admissionData.relation}</td>
//                   <th style={styles.th}>Occupation</th>
//                   <td style={styles.td}>{admissionData.occupation}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Mobile No</th>
//                   <td style={styles.td}>{admissionData.guardian_mobile_no}</td>
//                   <th style={styles.th}>Address</th>
//                   <td style={styles.td}>{admissionData.guardian_address}</td>
//                   <th style={styles.th}>CNIC</th>
//                   <td style={styles.td}>{admissionData.guardian_cnic}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th colSpan="6" style={{ ...styles.th, backgroundColor: '#ddd', color: '#000', fontSize: '16px' }}>
//                     <i className="fas fa-briefcase"></i> Father Job Detail (If POF)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <th style={styles.th}>PL No</th>
//                   <td style={styles.td}>{admissionData.pl_no || "-"}</td>
//                   <th style={styles.th}>Designation</th>
//                   <td style={styles.td}>{admissionData.designation || "-"}</td>
//                   <th style={styles.th}>Department</th>
//                   <td style={styles.td}>{admissionData.department || "-"}</td>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>House</th>
//                   <td style={styles.td}>{admissionData.house_name || "-"}</td>
//                   <th style={styles.th}>Club</th>
//                   <td style={styles.td}>{admissionData.club_name || "-"}</td>
//                 </tr>
//               </tbody>
//             </table>

//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th colSpan="10" style={{ ...styles.th, backgroundColor: '#ddd', color: '#000', fontSize: '16px' }}>
//                     <i className="fas fa-file-invoice-dollar"></i> Student Voucher Ledger
//                   </th>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Sr.No</th>
//                   <th style={styles.th}>Month</th>
//                   <th style={styles.th}>Advance</th>
//                   <th style={styles.th}>Total Amount</th>
//                   <th style={styles.th}>Due Date</th>
//                   <th style={styles.th}>Received Payment</th>
//                   <th style={styles.th}>Payment Date</th>
//                   <th style={styles.th}>Status</th>
//                   <th style={styles.th}>Remaining</th>
//                   <th style={styles.th}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {voucherDataLedger.length > 0 ? (
//                   voucherDataLedger.map((voucher, index) =>
//                     voucher.for_the_month !== null && voucher.for_the_month !== undefined && (
//                       <tr key={index}>
//                         <td style={styles.td}>{index + 1}</td>
//                         <td style={styles.td}>{convertMonth(voucher.for_the_month)}</td>
//                         <td style={styles.td}>{voucher.first_advance_payment || 0}</td>
//                         <td style={styles.td}>{voucher.total_amount || 0}</td>
//                         <td style={styles.td}>{voucher.due_date ? convertDates(voucher.due_date) : "-"}</td>
//                         <td style={styles.td}>{voucher.recieved_payment || 0}</td>
//                         <td style={styles.td}>{voucher.payment_date ? convertDates(voucher.payment_date) : "-"}</td>
//                         <td style={{ ...styles.td, color: voucher.fee_status === "paid" ? "green" : "red" }}>
//                           {voucher.fee_status || "-"}
//                         </td>
//                         <td style={styles.td}>{voucher.fee_status === "paid" ? 0 : voucher.total_amount}</td>
//                         <td style={styles.td}>
//                           <button
//                             onClick={() => viewData(voucher.voucher_id)}
//                             style={{ ...styles.button, padding: '6px 12px', fontSize: '12px' }}
//                           >
//                             <i className="fas fa-eye"></i> View
//                           </button>
//                         </td>
//                       </tr>
//                     )
//                   )
//                 ) : (
//                   <tr>
//                     <td colSpan="10" style={{ ...styles.td, textAlign: "center" }}>
//                       No vouchers exist
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th colSpan="6" style={{ ...styles.th, backgroundColor: '#ddd', color: '#000', fontSize: '16px' }}>
//                     <i className="fas fa-running"></i> Student Activities
//                   </th>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Sr.No</th>
//                   <th style={styles.th}>Date</th>
//                   <th style={styles.th}>Name</th>
//                   <th style={styles.th}>Activity Type</th>
//                   <th style={styles.th}>Position</th>
//                   <th style={styles.th}>Remarks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {activitiesData.length > 0 ? (
//                   activitiesData.map((activity, index) => (
//                     <tr key={index}>
//                       <td style={styles.td}>{index + 1}</td>
//                       <td style={styles.td}>{convertDates(activity.activity_date)}</td>
//                       <td style={styles.td}>{activity.name}</td>
//                       <td style={styles.td}>{activity.activity_type}</td>
//                       <td style={styles.td}>{activity.position}</td>
//                       <td style={styles.td}>{activity.remarks}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" style={{ ...styles.td, textAlign: "center" }}>
//                       No Activity exist
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>

//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th colSpan="6" style={{ ...styles.th, backgroundColor: '#ddd', color: '#000', fontSize: '16px' }}>
//                     <i className="fas fa-gavel"></i> Student Discipline
//                   </th>
//                 </tr>
//                 <tr>
//                   <th style={styles.th}>Sr.No</th>
//                   <th style={styles.th}>Date of Incident</th>
//                   <th style={styles.th}>Type of Incident</th>
//                   <th style={styles.th}>Action</th>
//                   <th style={styles.th}>Description</th>
//                   <th style={styles.th}>Reporting Teacher</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {disciplineData.length > 0 ? (
//                   disciplineData.map((discipline, index) => (
//                     <tr key={index}>
//                       <td style={styles.td}>{index + 1}</td>
//                       <td style={styles.td}>{convertDates(discipline.date_of_incident)}</td>
//                       <td style={styles.td}>{discipline.type_of_incident}</td>
//                       <td style={styles.td}>{discipline.action_taken}</td>
//                       <td style={styles.td}>{discipline.description}</td>
//                       <td style={styles.td}>{discipline.reporting_teacher}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" style={{ ...styles.td, textAlign: "center" }}>
//                       No Disciplinary Action Exist
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// const formatNumber = (amount) => {
//   return new Intl.NumberFormat("en-US").format(amount);
// };

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
//     attendance_amount,
//   } = data;

//   const feeHeadDetails = JSON.parse(fee_head);
//   const voucherBankDetails = JSON.parse(data.bank_details)
//     .map((bankId) => {
//       return bankDetails.find((detail) => detail.id === bankId);
//     })
//     .filter((detail) => detail !== undefined);

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
//                 <th colSpan={2}>Absent Fine :</th>
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
//                 {formatNumber(
//                   total_amount_data + arrears + parseInt(first_advance_payment)
//                 )}
//               </th>
//             </tr>
//             <tr>
//               <th colSpan={2}>Payable (After Due Date) :</th>
//               <th colSpan={2}>
//                 {formatNumber(
//                   after_due_date_amount +
//                     arrears +
//                     parseInt(first_advance_payment)
//                 )}
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
//         {status && status === "paid" && (
//           <div
//             style={{
//               position: "absolute",
//               top: "350px",
//               right: "30px",
//               opacity: "0.2",
//               zIndex: "2000",
//             }}
//           >
//             <img
//               src={process.env.REACT_APP_BASE_URL + `/Uploads/paid stamp.png`}
//               alt="stamp picture"
//               style={{
//                 width: "150px",
//                 objectFit: "cover",
//                 borderRadius: "5px",
//                 zIndex: "2000",
//               }}
//             />
//           </div>
//         )}
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
// };

// export default StudentProfile;

import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useAuth } from "./AuthContext";
import { useSessions } from "./SessionContext";
import AcademicSessionContext from "./AcademicSessionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import AttendanceReport from "./AttendanceReport";
import authService from "./services/authService";

function StudentProfile() {
  const [data, setData] = useState([]);
  const [admissionData, setAdmissionData] = useState(null);
  const [voucherDataLedger, setVoucherDataLedger] = useState([]);
  const [timeTableData, setTimeTableData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, totalPagesGet] = useState("");
  const [totalItem, setTotalItemGet] = useState(10);
  const [activitiesData, setActivitiesData] = useState([]);
  const [disciplineData, setDisciplineData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [updatedVouchersWithHeads, setUpdatedVouchersWithHead] = useState([]);
  const [searchCategoryReport, getSearchCategoryReport] = useState({
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    class_id: "",
    section_id: "",
    shift: "",
    session_id: "",
    campus_id: "",
    user_id: "",
    hidden_id: "",
    search_date: ""
  });
  const [viewVoucherId, setViewVoucherId] = useState([]);
  const [showData, setShowData] = useState('');
  const [getHeads, setHeads] = useState([]);
  const [getBankDetails, setBankDetails] = useState([]);
  const [getBankNotes, setBankNotes] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const componentRef = useRef();
  const { user } = useAuth();
  const { getSessions } = useSessions();
  const { academicSession, setAcademicSession } = useContext(AcademicSessionContext);

  // Auto-pick first available session if none selected yet
  useEffect(() => {
    if (!academicSession && getSessions && getSessions.length > 0) {
      const defaultSession = getSessions.find((s) => s.status === "On") || getSessions[getSessions.length - 1];
      if (defaultSession) setAcademicSession(defaultSession.id);
    }
  }, [getSessions, academicSession, setAcademicSession]);

  // Theme tokens — navy #111418/#1a1f25 + gold #EBD197, matching Sidebar.css
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f4f6fa 0%, #eef1f6 100%)',
      fontFamily: '"Segoe UI", system-ui, -apple-system, sans-serif',
      paddingBottom: '24px',
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '14px',
      boxSizing: 'border-box',
    },
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
      position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
      background: 'linear-gradient(90deg, #EBD197 0%, #d4b674 100%)',
    },
    profileTopRow: {
      display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
    },
    avatar: {
      width: '72px', height: '72px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #EBD197 0%, #d4b674 100%)',
      color: '#1f2329',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '26px', fontWeight: 800, flexShrink: 0,
      boxShadow: '0 4px 12px rgba(235, 209, 151, 0.35)', letterSpacing: '0.5px',
      overflow: 'hidden', border: '3px solid #EBD197',
    },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    profileMeta: { flex: 1, minWidth: 0 },
    profileName: {
      margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff',
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    },
    profileRole: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '12px', color: '#1f2329', background: '#EBD197',
      padding: '2px 10px', borderRadius: '999px', marginTop: '6px', fontWeight: 600,
    },
    profileMetaRow: {
      margin: '8px 0 0 0', fontSize: '13px', color: '#adb5bd',
      display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap',
    },
    sessionBlock: {
      marginTop: '14px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(235,209,151,0.18)',
      borderRadius: '10px',
      padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
    },
    sessionLabel: {
      display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px',
      color: '#EBD197', fontWeight: 700, marginBottom: '6px',
    },
    sessionValue: { color: '#fff', fontSize: '14px', fontWeight: 600 },
    sessionSelect: {
      width: '100%', padding: '10px 12px', borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.18)', background: '#1a1f25',
      color: '#fff', fontSize: '14px', fontWeight: 500, outline: 'none',
      appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23EBD197'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
      backgroundSize: '20px', paddingRight: '36px',
    },
    actionGrid: {
      marginTop: '16px', display: 'grid', gap: '12px',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    actionCard: {
      background: '#ffffff', borderRadius: '14px', padding: '18px 14px',
      border: '1px solid #e8ecf2', boxShadow: '0 2px 8px rgba(17,20,24,0.05)',
      cursor: 'pointer', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '10px',
      textAlign: 'center',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
      minHeight: '110px', WebkitTapHighlightColor: 'transparent', position: 'relative',
    },
    actionIconWrap: {
      width: '46px', height: '46px', borderRadius: '12px',
      background: 'linear-gradient(135deg, #EBD197 0%, #d4b674 100%)',
      color: '#1f2329',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '20px',
      boxShadow: '0 4px 10px rgba(235,209,151,0.35)',
    },
    actionLabel: { fontSize: '13px', fontWeight: 600, color: '#1f2329', lineHeight: 1.25 },
    actionBadge: {
      position: 'absolute', top: '8px', right: '8px',
      background: '#dc3545', color: '#fff',
      fontSize: '10px', fontWeight: 700,
      padding: '2px 7px', borderRadius: '999px', minWidth: '20px', textAlign: 'center',
    },
    logoutCard: { background: '#fff5f5', border: '1px solid #fed7d7' },
    logoutIconWrap: {
      background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
      color: '#fff', boxShadow: '0 4px 10px rgba(229,62,62,0.3)',
    },
    logoutLabel: { color: '#c53030' },

    // Section card (Personal / Guardian / Job / Vouchers / etc.)
    sectionCard: {
      background: '#fff', borderRadius: '14px',
      boxShadow: '0 2px 8px rgba(17,20,24,0.06)',
      border: '1px solid #e8ecf2', marginTop: '16px', overflow: 'hidden',
    },
    sectionHeader: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197', padding: '12px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '10px', borderBottom: '3px solid #EBD197', cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
    },
    sectionTitle: {
      margin: 0, fontSize: '15px', fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: '10px',
    },
    sectionBody: { padding: '14px' },
    detailGrid: {
      display: 'grid', gap: '10px',
      gridTemplateColumns: '1fr',
    },
    detailItem: {
      background: '#f7f9fc', borderRadius: '8px', padding: '10px 12px',
      borderLeft: '3px solid #EBD197',
    },
    detailLabel: {
      fontSize: '11px', fontWeight: 700, color: '#6c757d',
      textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px',
    },
    detailValue: {
      fontSize: '13px', fontWeight: 600, color: '#1f2329', wordBreak: 'break-word',
    },

    // Modal (fullscreen)
    modalFull: {
      position: 'fixed', inset: 0,
      backgroundColor: '#fff',
      display: 'flex', alignItems: 'stretch', justifyContent: 'stretch',
      zIndex: 9999, padding: 0,
    },
    modalContentFull: {
      backgroundColor: '#fff', borderRadius: 0,
      width: '100vw', height: '100vh', maxWidth: 'none',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197', padding: '14px 16px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '3px solid #EBD197', flexShrink: 0,
    },
    modalTitle: {
      margin: 0, fontSize: '16px', fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: '8px',
    },
    closeButton: {
      backgroundColor: 'rgba(235,209,151,0.15)',
      border: '1px solid rgba(235,209,151,0.3)',
      color: '#EBD197', cursor: 'pointer',
      width: '34px', height: '34px', borderRadius: '50%',
      fontSize: '20px', lineHeight: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    modalBody: {
      padding: '14px', overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch',
    },

    // Compact tables (used on desktop only via .sp-desk-table CSS)
    table: {
      width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff',
      borderRadius: '10px', overflow: 'hidden', fontSize: '13px',
    },
    th: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197', padding: '10px 12px',
      textAlign: 'left', fontWeight: 700, fontSize: '12px',
      border: '1px solid #2a3038', whiteSpace: 'nowrap',
    },
    td: {
      padding: '10px 12px', border: '1px solid #e8ecf2',
      textAlign: 'left', fontSize: '12px',
    },

    // Timetable cells
    timetableCell: {
      padding: '8px', textAlign: 'center', border: '1px solid #e8ecf2',
      minWidth: '90px', fontSize: '11px',
    },
    subjectCell: { backgroundColor: '#fff8e6', borderLeft: '3px solid #EBD197' },
    freeCell: { backgroundColor: '#f7f9fc', color: '#9aa3af', fontStyle: 'italic' },
    breakCell: { backgroundColor: '#fffbeb', color: '#92400e', fontWeight: 700 },

    searchInput: {
      padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d7e2',
      fontSize: '14px', width: '100%', minHeight: '44px', background: '#fff',
    },
    selectInput: {
      padding: '10px 12px', borderRadius: '8px', border: '1px solid #d0d7e2',
      fontSize: '14px', minHeight: '44px', background: '#fff',
    },
    primaryBtn: {
      background: '#111418', color: '#EBD197',
      border: 'none', padding: '10px 16px', borderRadius: '8px',
      fontSize: '13px', fontWeight: 600, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: '6px', minHeight: '44px',
    },
  };

  // Mobile-first CSS that wraps the inline styles above
  const mobileStyles = `
    * { -webkit-tap-highlight-color: transparent; }
    button { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }

    .sp-action-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(17,20,24,0.10) !important; border-color: #EBD197 !important; }
    .sp-action-card:active { transform: scale(0.98); }
    .sp-session-select option { background: #1a1f25; color: #fff; }

    @media (min-width: 600px) {
      .sp-action-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
      .sp-detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }
    @media (min-width: 900px) {
      .sp-action-grid { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
      .sp-detail-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
    }

    /* Mobile vs desktop view toggle for tables that become card lists */
    .sp-mobile-cards { display: block; }
    .sp-desktop-table { display: none; }
    @media (min-width: 768px) {
      .sp-mobile-cards { display: none; }
      .sp-desktop-table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    }

    /* Voucher / Activity / Discipline card */
    .sp-row-card {
      background: #fff; border: 1px solid #e8ecf2; border-left: 4px solid #EBD197;
      border-radius: 10px; padding: 12px; margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .sp-row-card__top {
      display: flex; justify-content: space-between; align-items: center;
      gap: 8px; flex-wrap: wrap; margin-bottom: 8px;
    }
    .sp-row-card__chip {
      background: #fff8e6; color: #1f2329; font-size: 11px; font-weight: 700;
      padding: 3px 9px; border-radius: 999px;
    }
    .sp-row-card__status--paid { background: #d4edda; color: #155724; }
    .sp-row-card__status--unpaid { background: #f8d7da; color: #842029; }
    .sp-kv { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px dashed #eef0f3; }
    .sp-kv:last-child { border-bottom: none; }
    .sp-kv__k { color: #6c757d; font-weight: 600; }
    .sp-kv__v { color: #1f2329; font-weight: 600; text-align: right; }

    /* Calendar (attendance) */
    .sp-cal { background: #fff; border-radius: 12px; padding: 14px; border: 1px solid #e8ecf2; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-bottom: 14px; }
    .sp-cal__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 10px; flex-wrap: wrap; }
    .sp-cal__title { font-size: 15px; font-weight: 700; color: #111418; }
    .sp-cal__nav { display: flex; gap: 6px; }
    .sp-cal__nav button { background: #111418; color: #EBD197; border: none; width: 60px; height: 32px; border-radius: 8px; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
    .sp-cal__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
    .sp-cal__dow { font-size: 10px; font-weight: 700; color: #6c757d; text-transform: uppercase; text-align: center; padding: 6px 0; }
    .sp-cal__day {
      aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: #f7f9fc; color: #1f2329; border-radius: 8px; font-size: 12px; font-weight: 600;
      position: relative; min-height: 38px;
    }
    .sp-cal__day--empty { background: transparent; }
    .sp-cal__day--p { background: #d4edda; color: #155724; }
    .sp-cal__day--a { background: #f8d7da; color: #721c24; }
    .sp-cal__day--l { background: #d1ecf1; color: #0c5460; }
    .sp-cal__day--h { background: #fff3cd; color: #856404; }
    .sp-cal__day--today { box-shadow: inset 0 0 0 2px #EBD197; }
    .sp-cal__legend { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; font-size: 11px; color: #6c757d; }
    .sp-cal__legend-dot { display: inline-block; width: 12px; height: 12px; border-radius: 4px; margin-right: 4px; vertical-align: middle; }
    .sp-cal__stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
    .sp-cal__stat { background: #f7f9fc; padding: 8px; border-radius: 8px; text-align: center; }
    .sp-cal__stat-num { font-size: 18px; font-weight: 700; line-height: 1; }
    .sp-cal__stat-lbl { font-size: 10px; color: #6c757d; text-transform: uppercase; font-weight: 600; margin-top: 2px; }

    /* Event card */
    .sp-event {
      background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 12px;
      border: 1px solid #e8ecf2; border-left: 5px solid #EBD197;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex; gap: 12px;
    }
    .sp-event__date {
      flex-shrink: 0; width: 60px; text-align: center;
      background: linear-gradient(135deg, #111418, #1a1f25); color: #EBD197;
      border-radius: 10px; padding: 8px 4px;
    }
    .sp-event__date-d { font-size: 22px; font-weight: 800; line-height: 1; }
    .sp-event__date-m { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
    .sp-event__body { flex: 1; min-width: 0; }
    .sp-event__title { font-size: 15px; font-weight: 700; color: #1f2329; margin-bottom: 4px; }
    .sp-event__time { font-size: 11px; color: #6c757d; margin-bottom: 6px; }
    .sp-event__desc { font-size: 13px; color: #495057; line-height: 1.5; }

    /* Homework card */
    .sp-hw {
      background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 12px;
      border: 1px solid #e8ecf2; border-left: 4px solid #EBD197;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .sp-hw__top { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
    .sp-hw__date { background: #fff8e6; color: #1f2329; font-weight: 700; font-size: 12px; padding: 3px 10px; border-radius: 999px; }
    .sp-hw__shift { font-size: 11px; color: #6c757d; font-weight: 600; text-transform: uppercase; }
    .sp-hw__subject { display: inline-block; background: #111418; color: #EBD197; font-size: 11px; padding: 3px 9px; border-radius: 4px; font-weight: 600; margin-bottom: 8px; }
    .sp-hw__class { font-size: 12px; color: #6c757d; margin-bottom: 6px; }
    .sp-hw__desc { font-size: 13px; color: #495057; line-height: 1.5; }
    .sp-hw__desc p { margin: 0 0 6px 0; }
    .sp-hw__download {
      display: inline-flex; align-items: center; gap: 6px;
      background: #d4edda; color: #155724;
      padding: 8px 12px; border-radius: 8px; text-decoration: none;
      font-size: 13px; font-weight: 600; margin-top: 8px;
    }

    /* Empty states */
    .sp-empty { text-align: center; padding: 40px 16px; color: #6c757d; font-size: 14px; }
    .sp-empty i { font-size: 32px; color: #d0d7e2; display: block; margin-bottom: 10px; }

    /* Timetable mobile cards */
    .sp-tt-mobile { display: block; }
    .sp-tt-desktop { display: none; }
    @media (min-width: 768px) {
      .sp-tt-mobile { display: none; }
      .sp-tt-desktop { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    }
    .sp-tt-day { background: #fff; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e8ecf2; }
    .sp-tt-day__h { background: linear-gradient(135deg, #111418, #1a1f25); color: #EBD197; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
    .sp-tt-period { background: #fff8e6; border-left: 3px solid #EBD197; border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; font-size: 13px; }
    .sp-tt-period--free { background: #f7f9fc; border-left-color: #d0d7e2; color: #6c757d; font-style: italic; }
    .sp-tt-period--break { background: #fffbeb; border-left-color: #f59e0b; color: #92400e; font-weight: 700; text-align: center; }
    .sp-tt-pnum { display: inline-block; background: #111418; color: #EBD197; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700; margin-right: 8px; }

    /* Accordion */
    .sp-acc__icon { transition: transform 0.2s ease; }
    .sp-acc--open .sp-acc__icon { transform: rotate(180deg); }
  `;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const convertMonth = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${year}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertDates = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertDatesWithTime = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const fetchData = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/get-student-profile/${academicSession}/${user.user.campus_id}/${user.user.student_unique_id}`
      )
      .then((response) => {
        setAdmissionData(response.data.results[0]);
        setVoucherDataLedger(response.data.results);
        setActivitiesData(response.data.activities);
        setDisciplineData(response.data.discipline);
        setEventsData(response.data.events);
      })
      .catch((err) => {
        toast.error("Error fetching data");
        console.log(err);
      });
  };

  useEffect(() => {
    if (academicSession) {
      fetchData();
    }
  }, [academicSession]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

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

  // Original code (Document 1) - CORRECT ✅
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
    const updatedData = addHeadNameToFeeHead(getHeads, voucherData); // ✅ Result store ho rahi hai
    setUpdatedVouchersWithHead(updatedData); // ✅ State update ho rahi hai
  }
}, [getHeads, voucherData]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const viewData = (id_get) => {
    setViewVoucherId([id_get]);
    setShowData("view_voucher");
  };

  const viewHomeWork = () => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL + "/homework-list", {
        params: {
          page: currentPage,
          limit: totalItem,
          search: searchCategoryReport.search,
          campus_id: user.user.campus_id,
          session_id: academicSession,
          search_date: editFormData.search_date,
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
          shift: editFormData.shift,
        },
      })
      .then((res) => {
        setData(res.data.data);
        totalPagesGet(res.data.totalPages);
        setLoading(false);
        setShowData("view_home_work_list");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (admissionData) {
      setEditFormData({
        ...editFormData,
        class_id: admissionData.class_id,
        section_id: admissionData.section_id,
        shift: admissionData.shift,
      });
    }
  }, [admissionData]);

  const viewTimeTable = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/view-timetable`, {
        params: {
          class_id: admissionData.class_id,
          section_id: admissionData.section_id,
          campus_id: user.user.campus_id,
          session_id: academicSession,
          shift: admissionData.shift,
        },
      })
      .then((response) => {
        setTimeTableData(response.data.results);
        setShowData("time_table");
      })
      .catch((error) => {
        console.error("Error fetching timetable:", error);
        toast.error("Error fetching timetable!");
      });
  };

  const viewAttendance = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/view-student-attendance`, {
        params: {
          student_id: admissionData.id,
          campus_id: user.user.campus_id,
          session_id: academicSession,
        },
      })
      .then((response) => {
        setAttendanceData(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching attendance:", error);
        toast.error("Error fetching attendance!");
      });
  };

  const viewEvents = () => {
    setShowData("view_events");
  };

  const logout = () => {
    authService.logout();
    window.location.reload();
  };

  const handleHide = () => {
    setTimeTableData([]);
    setAttendanceData([]);
    setShowData('');
    setData([]);
  };

  const handleTotalItemChange = (event) => {
    setTotalItemGet(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      viewHomeWork();
    }
  };

  const searchCategory = () => {
    viewHomeWork();
  };

  // Accordion sections (mobile collapsible)
  const [openSections, setOpenSections] = useState({
    student: true, guardian: false, job: false, vouchers: true, activities: false, discipline: false,
  });
  const toggleSection = (k) => setOpenSections((s) => ({ ...s, [k]: !s[k] }));

  // Calendar month state for attendance view
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const renderTimetable = () => {
    if (!timeTableData || timeTableData.length === 0) {
      return (
        <div className="sp-empty">
          <i className="fas fa-calendar-times"></i>
          No timetable available yet.
        </div>
      );
    }

    const groupedData = {};
    days.forEach((day) => { groupedData[day] = {}; });
    timeTableData.forEach((item) => {
      if (!groupedData[item.day]) groupedData[item.day] = {};
      groupedData[item.day][item.period] = item;
    });

    const maxPeriod = Math.max(...timeTableData.map((i) => parseInt(i.period) || 0), 8);
    const periods = [];
    for (let i = 1; i <= maxPeriod; i++) {
      periods.push(i);
      if (i === 4) periods.push('Break');
    }

    return (
      <>
        {/* Mobile card view */}
        <div className="sp-tt-mobile">
          {days.map((day) => {
            const dayPeriods = Object.keys(groupedData[day] || {})
              .map((p) => ({ period: p, ...groupedData[day][p] }))
              .sort((a, b) => parseInt(a.period) - parseInt(b.period));
            return (
              <div key={day} className="sp-tt-day">
                <div className="sp-tt-day__h"><i className="fas fa-calendar-day"></i> {day}</div>
                {dayPeriods.length === 0 ? (
                  <div className="sp-tt-period sp-tt-period--free">No classes scheduled</div>
                ) : (
                  dayPeriods.map((it, idx) => {
                    const isBreak = it.subjects === 'BREAK' || it.subject_id === 'break';
                    if (isBreak) {
                      return <div key={idx} className="sp-tt-period sp-tt-period--break"><i className="fas fa-coffee"></i> Break</div>;
                    }
                    return (
                      <div key={idx} className="sp-tt-period">
                        <div style={{ marginBottom: '4px' }}>
                          <span className="sp-tt-pnum">P{it.period}</span>
                          <strong>{it.subjects || 'Subject'}</strong>
                        </div>
                        {it.full_name && <div style={{ fontSize: '12px', color: '#495057' }}><i className="fas fa-user" style={{ marginRight: 5, color: '#EBD197' }}></i>{it.full_name}</div>}
                        {(it.time_from || it.time_to) && <div style={{ fontSize: '12px', color: '#495057' }}><i className="far fa-clock" style={{ marginRight: 5, color: '#EBD197' }}></i>{it.time_from} - {it.time_to}</div>}
                        {it.room_no && <div style={{ fontSize: '12px', color: '#495057' }}><i className="fas fa-door-open" style={{ marginRight: 5, color: '#EBD197' }}></i>Room {it.room_no}</div>}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="sp-tt-desktop">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Day / Period</th>
                {periods.map((p, i) => <th key={i} style={styles.th}>{p === 'Break' ? 'Break' : `P${p}`}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td style={{ ...styles.td, fontWeight: 700, background: '#f7f9fc', color: '#1f2329' }}>{day}</td>
                  {periods.map((period, idx) => {
                    if (period === 'Break') return <td key={idx} style={{ ...styles.timetableCell, ...styles.breakCell }}>Break</td>;
                    const cd = groupedData[day][period];
                    if (!cd) return <td key={idx} style={{ ...styles.timetableCell, ...styles.freeCell }}>Free</td>;
                    if (cd.subjects === 'BREAK' || cd.subject_id === 'break') return <td key={idx} style={{ ...styles.timetableCell, ...styles.breakCell }}>Break</td>;
                    return (
                      <td key={idx} style={{ ...styles.timetableCell, ...styles.subjectCell }}>
                        <div style={{ fontWeight: 700, fontSize: '12px' }}>{cd.subjects || 'Subject'}</div>
                        <div style={{ fontSize: '10px', color: '#6c757d' }}>{cd.full_name}</div>
                        {cd.room_no && <div style={{ fontSize: '10px', color: '#6c757d' }}>Room: {cd.room_no}</div>}
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

  // ── Calendar renderer for attendance ──
  const renderAttendanceCalendar = () => {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const { y, m } = calMonth;
    const firstDay = new Date(y, m, 1).getDay(); // 0..6 (Sun..Sat)
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // Map { 'YYYY-MM-DD': status }
    const statusByDate = {};
    (attendanceData || []).forEach((row) => {
      if (!row || !row.date) return;
      const d = new Date(row.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      statusByDate[key] = (row.status || '').toLowerCase();
    });

    // Stats for current month
    let p = 0, a = 0, l = 0, h = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const s = statusByDate[key];
      if (s === 'present') p++;
      else if (s === 'absent') a++;
      else if (s === 'leave') l++;
      else if (s === 'holiday') h++;
    }

    const today = new Date();
    const isToday = (d) => today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;

    const prevMonth = () => setCalMonth(({ y, m }) => m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 });
    const nextMonth = () => setCalMonth(({ y, m }) => m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });
    const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="sp-cal">
        <div className="sp-cal__head">
          <div className="sp-cal__title">{monthNames[m]} {y}</div>
          <div className="sp-cal__nav">
            <button type="button" onClick={prevMonth} aria-label="Previous month"><i className="fas fa-chevron-left"></i></button>
            <button type="button" onClick={() => setCalMonth({ y: today.getFullYear(), m: today.getMonth() })} aria-label="Today">Today</button>
            <button type="button" onClick={nextMonth} aria-label="Next month"><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div className="sp-cal__stats">
          <div className="sp-cal__stat" style={{ background: '#d4edda' }}><div className="sp-cal__stat-num" style={{ color: '#155724' }}>{p}</div><div className="sp-cal__stat-lbl" style={{ color: '#155724' }}>Present</div></div>
          <div className="sp-cal__stat" style={{ background: '#f8d7da' }}><div className="sp-cal__stat-num" style={{ color: '#721c24' }}>{a}</div><div className="sp-cal__stat-lbl" style={{ color: '#721c24' }}>Absent</div></div>
          <div className="sp-cal__stat" style={{ background: '#d1ecf1' }}><div className="sp-cal__stat-num" style={{ color: '#0c5460' }}>{l}</div><div className="sp-cal__stat-lbl" style={{ color: '#0c5460' }}>Leave</div></div>
          <div className="sp-cal__stat" style={{ background: '#fff3cd' }}><div className="sp-cal__stat-num" style={{ color: '#856404' }}>{h}</div><div className="sp-cal__stat-lbl" style={{ color: '#856404' }}>Holiday</div></div>
        </div>

        <div className="sp-cal__grid">
          {dow.map((d) => <div key={d} className="sp-cal__dow">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="sp-cal__day sp-cal__day--empty"></div>)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const s = statusByDate[key];
            const statusClass =
              s === 'present' ? 'sp-cal__day--p' :
              s === 'absent' ? 'sp-cal__day--a' :
              s === 'leave' ? 'sp-cal__day--l' :
              s === 'holiday' ? 'sp-cal__day--h' : '';
            const todayClass = isToday(day) ? 'sp-cal__day--today' : '';
            const initial = s ? s[0].toUpperCase() : '';
            return (
              <div key={day} className={`sp-cal__day ${statusClass} ${todayClass}`} title={s || ''}>
                <div>{day}</div>
                {initial && <div style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px' }}>{initial}</div>}
              </div>
            );
          })}
        </div>

        <div className="sp-cal__legend">
          <span><span className="sp-cal__legend-dot" style={{ background: '#d4edda' }}></span>Present (P)</span>
          <span><span className="sp-cal__legend-dot" style={{ background: '#f8d7da' }}></span>Absent (A)</span>
          <span><span className="sp-cal__legend-dot" style={{ background: '#d1ecf1' }}></span>Leave (L)</span>
          <span><span className="sp-cal__legend-dot" style={{ background: '#fff3cd' }}></span>Holiday (H)</span>
        </div>
      </div>
    );
  };

  // Helper: render a key-value detail row item (for profile section cards)
  const DetailItem = ({ label, value }) => (
    <div style={styles.detailItem}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>{value || '-'}</div>
    </div>
  );

  // Helper: collapsible section
  const Section = ({ id, icon, title, children }) => {
    const isOpen = openSections[id];
    return (
      <div style={styles.sectionCard}>
        <div
          className={`sp-acc ${isOpen ? 'sp-acc--open' : ''}`}
          style={styles.sectionHeader}
          onClick={() => toggleSection(id)}
          role="button"
          tabIndex={0}
        >
          <h3 style={styles.sectionTitle}><i className={`fas ${icon}`}></i> {title}</h3>
          <i className="fas fa-chevron-down sp-acc__icon"></i>
        </div>
        {isOpen && <div style={styles.sectionBody}>{children}</div>}
      </div>
    );
  };

  // Initials for avatar fallback
  const initials = admissionData && admissionData.full_name
    ? admissionData.full_name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '';

  const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const eventDateParts = (d) => {
    const dt = new Date(d);
    return { day: dt.getDate(), mon: monthShort[dt.getMonth()] };
  };

  return (
    <>
      <style>{mobileStyles}</style>

      {/* ── Attendance Calendar Modal ── */}
      {attendanceData.length > 0 && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-clipboard-check"></i> Attendance</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={styles.modalBody}>
              {renderAttendanceCalendar()}
              <details style={{ marginTop: '12px' }}>
                <summary style={{ cursor: 'pointer', fontSize: '13px', color: '#6c757d', padding: '8px' }}>
                  <i className="fas fa-chart-bar" style={{ color: '#EBD197', marginRight: '6px' }}></i>
                  Show full monthly report (table)
                </summary>
                <div style={{ marginTop: '10px' }}>
                  <AttendanceReport attendanceData={attendanceData} />
                </div>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* ── Timetable Modal ── */}
      {showData === "time_table" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-calendar-alt"></i> Weekly Timetable</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={styles.modalBody}>
              {renderTimetable()}
            </div>
          </div>
        </div>
      )}

      {/* ── Events Modal ── */}
      {showData === "view_events" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-calendar-day"></i> Events</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={styles.modalBody}>
              {eventsData.length > 0 ? (
                eventsData.map((event, index) => {
                  const { day, mon } = eventDateParts(event.start);
                  return (
                    <div key={index} className="sp-event">
                      <div className="sp-event__date">
                        <div className="sp-event__date-d">{day}</div>
                        <div className="sp-event__date-m">{mon}</div>
                      </div>
                      <div className="sp-event__body">
                        <div className="sp-event__title">{event.title}</div>
                        <div className="sp-event__time">
                          <i className="far fa-clock" style={{ color: '#EBD197', marginRight: '4px' }}></i>
                          {convertDatesWithTime(event.start)}
                          {event.end ? ` → ${convertDatesWithTime(event.end)}` : ''}
                        </div>
                        {event.description && <div className="sp-event__desc">{event.description}</div>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="sp-empty">
                  <i className="fas fa-calendar-times"></i>
                  No events scheduled at this time.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Homework Modal ── */}
      {showData === "view_home_work_list" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-book-open"></i> Home Work</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={styles.modalBody}>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="date"
                    style={{ ...styles.searchInput, flex: '1 1 150px' }}
                    onChange={(e) => setEditFormData({ ...editFormData, search_date: e.target.value })}
                    onKeyDown={handleKeyDown}
                    aria-label="Filter by date"
                  />
                  <input
                    type="text"
                    placeholder="Search homework…"
                    style={{ ...styles.searchInput, flex: '2 1 200px' }}
                    onChange={(e) => getSearchCategoryReport({ ...searchCategoryReport, search: e.target.value })}
                    onKeyDown={handleKeyDown}
                  />
                  <button style={styles.primaryBtn} onClick={searchCategory}>
                    <i className="fas fa-search"></i> Search
                  </button>
                </div>
                <select value={totalItem} onChange={handleTotalItemChange} style={{ ...styles.selectInput, maxWidth: '200px' }}>
                  <option value="10">Show 10 entries</option>
                  <option value="20">Show 20 entries</option>
                  <option value="30">Show 30 entries</option>
                  <option value="40">Show 40 entries</option>
                  <option value="50">Show 50 entries</option>
                </select>
              </div>

              {loading ? (
                <div className="sp-empty"><i className="fas fa-spinner fa-spin"></i>Loading homework…</div>
              ) : data.length === 0 ? (
                <div className="sp-empty"><i className="fas fa-inbox"></i>No homework found.</div>
              ) : (
                data.map((item, index) => (
                  <div key={index} className="sp-hw">
                    <div className="sp-hw__top">
                      <span className="sp-hw__date"><i className="far fa-calendar-alt"></i> {item.home_work_date}</span>
                      <span className="sp-hw__shift">{item.shift}</span>
                    </div>
                    <span className="sp-hw__subject">{item.subjects}</span>
                    <div className="sp-hw__class">
                      <i className="fas fa-users" style={{ color: '#EBD197', marginRight: '4px' }}></i>
                      {item.class_name} ({item.section_name})
                    </div>
                    <div className="sp-hw__desc" dangerouslySetInnerHTML={{ __html: item.description }}></div>
                    {item.homework_file ? (
                      <a
                        className="sp-hw__download"
                        href={`${process.env.REACT_APP_API_BASE_URL}/Uploads/${item.homework_file}`}
                        download
                      >
                        <i className="fas fa-download"></i> Download Attachment
                      </a>
                    ) : null}
                  </div>
                ))
              )}

              {totalPages > 1 && (
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                  <ReactPaginate
                    previousLabel={"‹"}
                    nextLabel={"›"}
                    breakLabel={"…"}
                    pageCount={totalPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    activeClassName={"active"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Voucher View Modal ── */}
      {showData === "view_voucher" && (
        <div style={styles.modalFull}>
          <div style={styles.modalContentFull}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}><i className="fas fa-file-invoice-dollar"></i> Voucher</h2>
              <button style={styles.closeButton} onClick={handleHide} aria-label="Close">×</button>
            </div>
            <div style={styles.modalBody}>
              <button onClick={handlePrint} style={{ ...styles.primaryBtn, marginBottom: '14px', width: '100%', justifyContent: 'center' }}>
                <i className="fa fa-print"></i> Print Voucher
              </button>
              <div ref={componentRef}>
                {voucherData.map((voucher, index) => (
                  <SingleVoucher
                    key={index}
                    data={voucher}
                    bankDetails={getBankDetails}
                    bankNotes={getBankNotes}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.page}>
        <div style={styles.container}>
          {/* ── Profile Card (avatar, name, class, session) ── */}
          <div style={styles.profileCard}>
            <div style={styles.profileAccentBar}></div>
            <div style={styles.profileTopRow}>
              <div style={styles.avatar}>
                {admissionData && admissionData.student_image && admissionData.student_image !== '' && admissionData.student_image !== '-' ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/Uploads/${admissionData.student_image}`}
                    alt={admissionData.full_name || 'Student'}
                    style={styles.avatarImg}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  initials || <i className="fas fa-user-graduate"></i>
                )}
              </div>
              <div style={styles.profileMeta}>
                <h1 style={styles.profileName} title={admissionData && admissionData.full_name}>
                  {admissionData ? admissionData.full_name : 'Loading…'}
                </h1>
                <span style={styles.profileRole}><i className="fas fa-user-graduate"></i> Student</span>
                {admissionData && (
                  <>
                    <p style={styles.profileMetaRow}>
                      <i className="fas fa-id-card" style={{ color: '#EBD197' }}></i>
                      Reg# <strong style={{ color: '#fff' }}>{admissionData.register_no}</strong>
                      <span style={{ margin: '0 4px', color: '#4a5568' }}>·</span>
                      <i className="fas fa-school" style={{ color: '#EBD197' }}></i>
                      {admissionData.class_name} ({admissionData.section_name})
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Session selector — always visible so student/parent can switch */}
            <div style={{ ...styles.sessionBlock, display: 'block' }}>
              <div style={styles.sessionLabel}>
                <i className="fas fa-calendar-alt"></i> Academic Session
              </div>
              <select
                className="sp-session-select"
                style={styles.sessionSelect}
                value={academicSession || ''}
                onChange={(e) => setAcademicSession(e.target.value)}
              >
                <option value="">Select Session</option>
                {(getSessions || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.session_name}{s.status === 'On' ? ' (Active)' : ''}
                  </option>
                ))}
              </select>
              {admissionData && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {admissionData.shift && (
                    <span style={{ ...styles.profileRole, background: 'rgba(235,209,151,0.15)', color: '#EBD197', border: '1px solid rgba(235,209,151,0.3)' }}>
                      <i className="fas fa-sun"></i> {admissionData.shift}
                    </span>
                  )}
                  {admissionData.category_name && (
                    <span style={{ ...styles.profileRole, background: 'rgba(235,209,151,0.15)', color: '#EBD197', border: '1px solid rgba(235,209,151,0.3)' }}>
                      <i className="fas fa-tag"></i> {admissionData.category_name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Action Cards ── */}
          <div className="sp-action-grid" style={styles.actionGrid}>
            <div className="sp-action-card" style={styles.actionCard} onClick={viewTimeTable} role="button" tabIndex={0}>
              <div style={styles.actionIconWrap}><i className="fas fa-calendar-alt"></i></div>
              <div style={styles.actionLabel}>Time Table</div>
            </div>
            <div className="sp-action-card" style={styles.actionCard} onClick={viewAttendance} role="button" tabIndex={0}>
              <div style={styles.actionIconWrap}><i className="fas fa-clipboard-check"></i></div>
              <div style={styles.actionLabel}>Attendance</div>
            </div>
            <div className="sp-action-card" style={styles.actionCard} onClick={viewHomeWork} role="button" tabIndex={0}>
              <div style={styles.actionIconWrap}><i className="fas fa-book-open"></i></div>
              <div style={styles.actionLabel}>Home Work</div>
            </div>
            <div className="sp-action-card" style={styles.actionCard} onClick={viewEvents} role="button" tabIndex={0}>
              <div style={styles.actionIconWrap}><i className="fas fa-calendar-day"></i></div>
              <div style={styles.actionLabel}>Events</div>
              {eventsData && eventsData.length > 0 && (
                <span style={styles.actionBadge}>{eventsData.length}</span>
              )}
            </div>
            <div className="sp-action-card" style={{ ...styles.actionCard, ...styles.logoutCard }} onClick={logout} role="button" tabIndex={0}>
              <div style={{ ...styles.actionIconWrap, ...styles.logoutIconWrap }}><i className="fas fa-sign-out-alt"></i></div>
              <div style={{ ...styles.actionLabel, ...styles.logoutLabel }}>Logout</div>
            </div>
          </div>

          {/* ── Sections (collapsible on click) ── */}
          {admissionData && (
            <>
              <Section id="student" icon="fa-user-graduate" title="Student Details">
                <div className="sp-detail-grid" style={styles.detailGrid}>
                  <DetailItem label="Full Name" value={admissionData.full_name} />
                  <DetailItem label="Register #" value={admissionData.register_no} />
                  <DetailItem label="Old Register #" value={admissionData.old_register_no} />
                  <DetailItem label="Class" value={`${admissionData.class_name} (${admissionData.section_name})`} />
                  <DetailItem label="Shift" value={admissionData.shift} />
                  <DetailItem label="Category" value={admissionData.category_name} />
                  <DetailItem label="Admission Date" value={formatDate(admissionData.admission_date)} />
                  <DetailItem label="Date of Birth" value={formatDate(admissionData.dob)} />
                  <DetailItem label="Gender" value={admissionData.gender} />
                  <DetailItem label="Religion" value={admissionData.religion} />
                  <DetailItem label="Cast" value={admissionData.cast} />
                  <DetailItem label="Blood Group" value={admissionData.blood_group} />
                  <DetailItem label="Mother Tongue" value={admissionData.mother_tongue} />
                  <DetailItem label="Mobile #" value={admissionData.mobile_no} />
                  <DetailItem label="Student CNIC" value={admissionData.student_cnic} />
                  <DetailItem label="Father CNIC" value={admissionData.father_cnic} />
                  <DetailItem label="Current Address" value={admissionData.current_address} />
                  <DetailItem label="Permanent Address" value={admissionData.permanent_address} />
                  <DetailItem label="Status" value={admissionData.status} />
                  <DetailItem label="Bus Status" value={admissionData.bus_status} />
                  <DetailItem label="Bus Fee" value={admissionData.bus_fee || 0} />
                  <DetailItem label="Pendency Status" value={admissionData.status_for_pendings} />
                </div>
              </Section>

              <Section id="guardian" icon="fa-users" title="Guardian Details">
                <div className="sp-detail-grid" style={styles.detailGrid}>
                  <DetailItem label="Name" value={admissionData.guardian_name} />
                  <DetailItem label="Relation" value={admissionData.relation} />
                  <DetailItem label="Occupation" value={admissionData.occupation} />
                  <DetailItem label="Mobile #" value={admissionData.guardian_mobile_no} />
                  <DetailItem label="CNIC" value={admissionData.guardian_cnic} />
                  <DetailItem label="Address" value={admissionData.guardian_address} />
                </div>
              </Section>

              <Section id="job" icon="fa-briefcase" title="Father Job Detail (If POF)">
                <div className="sp-detail-grid" style={styles.detailGrid}>
                  <DetailItem label="PL No" value={admissionData.pl_no} />
                  <DetailItem label="Designation" value={admissionData.designation} />
                  <DetailItem label="Department" value={admissionData.department} />
                  <DetailItem label="House" value={admissionData.house_name} />
                  <DetailItem label="Club" value={admissionData.club_name} />
                </div>
              </Section>

              <Section id="vouchers" icon="fa-file-invoice-dollar" title="Fee Voucher Ledger">
                {voucherDataLedger.filter((v) => v.for_the_month).length > 0 ? (
                  <>
                    {/* Mobile cards */}
                    <div className="sp-mobile-cards">
                      {voucherDataLedger.map((v, index) => v.for_the_month && (
                        <div key={index} className="sp-row-card">
                          <div className="sp-row-card__top">
                            <span className="sp-row-card__chip"><i className="far fa-calendar"></i> {convertMonth(v.for_the_month)}</span>
                            <span className={`sp-row-card__chip ${v.fee_status === 'paid' ? 'sp-row-card__status--paid' : 'sp-row-card__status--unpaid'}`}>
                              {v.fee_status === 'paid' ? '✓ Paid' : '● Unpaid'}
                            </span>
                          </div>
                          <div className="sp-kv"><span className="sp-kv__k">Amount</span><span className="sp-kv__v">Rs. {v.total_amount || 0}</span></div>
                          {v.first_advance_payment ? <div className="sp-kv"><span className="sp-kv__k">Advance</span><span className="sp-kv__v">Rs. {v.first_advance_payment}</span></div> : null}
                          <div className="sp-kv"><span className="sp-kv__k">Due Date</span><span className="sp-kv__v">{v.due_date ? convertDates(v.due_date) : '-'}</span></div>
                          <div className="sp-kv"><span className="sp-kv__k">Received</span><span className="sp-kv__v">Rs. {v.recieved_payment || 0}</span></div>
                          <div className="sp-kv"><span className="sp-kv__k">Pay Date</span><span className="sp-kv__v">{v.payment_date ? convertDates(v.payment_date) : '-'}</span></div>
                          <div className="sp-kv"><span className="sp-kv__k">Remaining</span><span className="sp-kv__v" style={{ color: v.fee_status === 'paid' ? '#155724' : '#842029' }}>Rs. {v.fee_status === 'paid' ? 0 : v.total_amount}</span></div>
                          <button
                            type="button"
                            onClick={() => viewData(v.voucher_id)}
                            style={{ ...styles.primaryBtn, width: '100%', justifyContent: 'center', marginTop: '8px' }}
                          >
                            <i className="fas fa-eye"></i> View Voucher
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Desktop table */}
                    <div className="sp-desktop-table">
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Sr</th>
                            <th style={styles.th}>Month</th>
                            <th style={styles.th}>Adv</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Due</th>
                            <th style={styles.th}>Received</th>
                            <th style={styles.th}>Pay Date</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Remaining</th>
                            <th style={styles.th}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {voucherDataLedger.map((v, index) => v.for_the_month && (
                            <tr key={index}>
                              <td style={styles.td}>{index + 1}</td>
                              <td style={styles.td}>{convertMonth(v.for_the_month)}</td>
                              <td style={styles.td}>{v.first_advance_payment || 0}</td>
                              <td style={styles.td}>{v.total_amount || 0}</td>
                              <td style={styles.td}>{v.due_date ? convertDates(v.due_date) : '-'}</td>
                              <td style={styles.td}>{v.recieved_payment || 0}</td>
                              <td style={styles.td}>{v.payment_date ? convertDates(v.payment_date) : '-'}</td>
                              <td style={{ ...styles.td, color: v.fee_status === 'paid' ? '#198754' : '#dc3545', fontWeight: 700 }}>{v.fee_status || '-'}</td>
                              <td style={styles.td}>{v.fee_status === 'paid' ? 0 : v.total_amount}</td>
                              <td style={styles.td}>
                                <button onClick={() => viewData(v.voucher_id)} style={{ ...styles.primaryBtn, padding: '6px 10px', minHeight: 'auto' }}>
                                  <i className="fas fa-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="sp-empty"><i className="fas fa-receipt"></i>No vouchers yet.</div>
                )}
              </Section>

              <Section id="activities" icon="fa-running" title="Activities">
                {activitiesData.length > 0 ? (
                  <>
                    <div className="sp-mobile-cards">
                      {activitiesData.map((a, idx) => (
                        <div key={idx} className="sp-row-card">
                          <div className="sp-row-card__top">
                            <strong style={{ color: '#1f2329' }}>{a.name}</strong>
                            <span className="sp-row-card__chip"><i className="far fa-calendar"></i> {convertDates(a.activity_date)}</span>
                          </div>
                          <div className="sp-kv"><span className="sp-kv__k">Type</span><span className="sp-kv__v">{a.activity_type}</span></div>
                          <div className="sp-kv"><span className="sp-kv__k">Position</span><span className="sp-kv__v">{a.position}</span></div>
                          {a.remarks && <div className="sp-kv"><span className="sp-kv__k">Remarks</span><span className="sp-kv__v">{a.remarks}</span></div>}
                        </div>
                      ))}
                    </div>
                    <div className="sp-desktop-table">
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Sr</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Position</th>
                            <th style={styles.th}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activitiesData.map((a, idx) => (
                            <tr key={idx}>
                              <td style={styles.td}>{idx + 1}</td>
                              <td style={styles.td}>{convertDates(a.activity_date)}</td>
                              <td style={styles.td}>{a.name}</td>
                              <td style={styles.td}>{a.activity_type}</td>
                              <td style={styles.td}>{a.position}</td>
                              <td style={styles.td}>{a.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="sp-empty"><i className="fas fa-running"></i>No activities yet.</div>
                )}
              </Section>

              <Section id="discipline" icon="fa-gavel" title="Discipline">
                {disciplineData.length > 0 ? (
                  <>
                    <div className="sp-mobile-cards">
                      {disciplineData.map((d, idx) => (
                        <div key={idx} className="sp-row-card">
                          <div className="sp-row-card__top">
                            <strong style={{ color: '#1f2329' }}>{d.type_of_incident}</strong>
                            <span className="sp-row-card__chip"><i className="far fa-calendar"></i> {convertDates(d.date_of_incident)}</span>
                          </div>
                          <div className="sp-kv"><span className="sp-kv__k">Action</span><span className="sp-kv__v">{d.action_taken}</span></div>
                          {d.description && <div className="sp-kv"><span className="sp-kv__k">Description</span><span className="sp-kv__v">{d.description}</span></div>}
                          <div className="sp-kv"><span className="sp-kv__k">Reporting Teacher</span><span className="sp-kv__v">{d.reporting_teacher}</span></div>
                        </div>
                      ))}
                    </div>
                    <div className="sp-desktop-table">
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Sr</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Action</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Teacher</th>
                          </tr>
                        </thead>
                        <tbody>
                          {disciplineData.map((d, idx) => (
                            <tr key={idx}>
                              <td style={styles.td}>{idx + 1}</td>
                              <td style={styles.td}>{convertDates(d.date_of_incident)}</td>
                              <td style={styles.td}>{d.type_of_incident}</td>
                              <td style={styles.td}>{d.action_taken}</td>
                              <td style={styles.td}>{d.description}</td>
                              <td style={styles.td}>{d.reporting_teacher}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="sp-empty"><i className="fas fa-check-circle" style={{ color: '#7bc47f' }}></i>No disciplinary actions. Clean record!</div>
                )}
              </Section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const formatNumber = (amount) => {
  return new Intl.NumberFormat("en-US").format(amount);
};

const SingleVoucher = ({ data, bankDetails, bankNotes }) => {
  const {
    invoice_no,
    full_name,
    register_no,
    father_name,
    class_name,
    section_name,
    category,
    for_the_month,
    fee_head,
    total_amount_data,
    due_date,
    actual_due_date,
    remarks,
    after_due_date_amount,
    status,
    arrears,
    arrears_not_cleared,
    session_name,
    campus_name,
    first_advance_payment,
    bus_fee,
    attendance_amount,
  } = data;

  const feeHeadDetails = JSON.parse(fee_head);
  const voucherBankDetails = JSON.parse(data.bank_details)
    .map((bankId) => {
      return bankDetails.find((detail) => detail.id === bankId);
    })
    .filter((detail) => detail !== undefined);

  const convertDates = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertMonth = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${year}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderVoucherCopy = (title) => (
    <div className="voucher" style={{ position: "relative" }}>
      <div className="voucher-header">
        <h5>{campus_name}</h5>
        <h5 className="title">{title}</h5>
      </div>
      <div className="voucher-fee">
        <table className="voucher_table">
          <thead>
            <tr>
              <th>Voucher#</th>
              <td>{invoice_no}</td>
              <th>Month</th>
              <td>{convertMonth(for_the_month)}</td>
            </tr>
            <tr>
              <th>Iss.Date</th>
              <td>{getCurrentDate()}</td>
              <th>Due.Date</th>
              <td>{convertDates(actual_due_date)}</td>
            </tr>
            <tr>
              <th>Reg#</th>
              <td>{register_no}</td>
              <th>Session</th>
              <td>{session_name}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{full_name}</td>
              <th>Father</th>
              <td>{father_name}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td>{category}</td>
              <th>Class</th>
              <td>{class_name + " (" + section_name + ")"}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
            <tr>
              <th colSpan={2}>Particulars</th>
              <th colSpan={2}>Amount (Rs)</th>
            </tr>
            {feeHeadDetails.map((item, index) => (
              <tr key={index}>
                <td colSpan={2}>{item.head_name}</td>
                <td colSpan={2}>{formatNumber(item.amount)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}></td>
            </tr>
            {first_advance_payment > 0 && (
              <tr>
                <th colSpan={2}>Advance :</th>
                <td colSpan={2}>{formatNumber(first_advance_payment)}</td>
              </tr>
            )}
            {bus_fee > 0 && (
              <tr>
                <th colSpan={2}>Bus Fee :</th>
                <td colSpan={2}>{formatNumber(bus_fee)}</td>
              </tr>
            )}
            {attendance_amount > 0 && (
              <tr>
                <th colSpan={2}>Absent Fine :</th>
                <td colSpan={2}>{attendance_amount}</td>
              </tr>
            )}
            {arrears && arrears !== 0 ? (
              <tr>
                <th colSpan={2}>Arrears :</th>
                <td colSpan={2}>{formatNumber(arrears)}</td>
              </tr>
            ) : null}
            <tr>
              <th colSpan={2}>Payable :</th>
              <th colSpan={2}>
                {formatNumber(
                  total_amount_data + arrears + parseInt(first_advance_payment)
                )}
              </th>
            </tr>
            <tr>
              <th colSpan={2}>Payable (After Due Date) :</th>
              <th colSpan={2}>
                {formatNumber(
                  after_due_date_amount +
                    arrears +
                    parseInt(first_advance_payment)
                )}
              </th>
            </tr>
            {arrears_not_cleared && (
              <tr>
                <th colSpan={2}>Arrears Months :</th>
                <td colSpan={2}>{arrears_not_cleared}</td>
              </tr>
            )}
            {remarks && (
              <tr>
                <th colSpan={4}>Remarks: {remarks}</th>
              </tr>
            )}
            {voucherBankDetails.map((bankDetail, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td colSpan={4}>Bank: {bankDetail.bank_name}</td>
                </tr>
                <tr>
                  <td colSpan={4}>A/C Title: {bankDetail.account_title}</td>
                </tr>
                <tr>
                  <td colSpan={4}>A/C No: {bankDetail.account_no}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="voucher-notes">
        <h5>Notes:</h5>
        <ul>
          {bankNotes.map((note, index) => (
            <div key={index}>
              <p dangerouslySetInnerHTML={{ __html: note.note_description }} />
            </div>
          ))}
        </ul>
      </div>
      <div
        style={{
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {status && status === "paid" && (
          <div
            style={{
              position: "absolute",
              top: "350px",
              right: "30px",
              opacity: "0.2",
              zIndex: "2000",
            }}
          >
            <img
              src={process.env.REACT_APP_BASE_URL + `/uploads/paid stamp.png`}
              alt="stamp picture"
              style={{
                width: "150px",
                objectFit: "cover",
                borderRadius: "5px",
                zIndex: "2000",
              }}
            />
          </div>
        )}
        <Barcode value={invoice_no.toString()} height={40} width={2} />
      </div>
    </div>
  );

  return (
    <div className="voucher-container">

       <style>
    {`
@media print {
  
  .voucher-container {
    width: 100vw !important;
    height: 100% !important;
    page-break-after: always;
    page-break-inside: avoid;
    /* transform: scale(0.95); */
    transform-origin: top left;
    /* padding: 5mm !important; */
    box-sizing: border-box;
    position: relative;
  }

  .voucher {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-after: always;
    page-break-inside: avoid;
  }

  .voucher_table {
    width: 100% !important;
    border-collapse: collapse !important;
     font-size: 10px !important; /* Reduced from 12px for compactness */
    /* margin: 5px 0 !important; */
  }

  .voucher_table th, 
  .voucher_table td {
    padding: 2px 4px !important;
    border: 1px solid #000 !important;
    text-align: left;
    vertical-align: top;
  }

  .voucher-header h5 {
    margin: 2px 0 !important;
    font-size: 12px !important;
    /* text-align: center; */
  }

  .voucher-header .title {
    font-weight: bold;
    text-decoration: underline;
  }

  .voucher-notes {
    font-size: 9px !important;
    margin-top: 5px !important;
  }

  .voucher-notes h5 {
    margin: 2px 0 !important;
    font-size: 10px !important;
  }

  .last-vouchers {
    font-size: 9px !important;
    margin: 5px 0 !important;
  }

  .last-vouchers h6 {
    margin: 2px 0 !important;
    font-size: 10px !important;
  }

  @page { 
    size: A4 landscape !important;
    /* transform: 90%; */
    margin: 0 !important;
  }

  * {
    max-width: 100% !important;
    overflow: hidden !important;
  }
}
`}
  </style>
      {renderVoucherCopy("Bank Copy")}
      {renderVoucherCopy("School Copy")}
      {renderVoucherCopy("Student Copy")}
    </div>
  );
};

export default StudentProfile;