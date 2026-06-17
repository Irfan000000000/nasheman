// // import React, { useEffect, useState, useContext, useRef } from "react";
// // import axios from "axios";
// // import { useAuth } from "./AuthContext";
// // import AcademicSessionContext from "./AcademicSessionContext";
// // import "react-toastify/dist/ReactToastify.css";
// // import { useNavigate } from "react-router-dom";
// // import Select from "react-select";
// // import "react-toastify/dist/ReactToastify.css";
// // import { useReactToPrint } from "react-to-print";
// // import { QRCodeCanvas } from "qrcode.react";


// // function StudentIdCardGenerate() {
// //   const ITEMS_PER_PAGE = 10;
// //   const [data, setData] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [totalItem, setTotalItem] = useState(10); // State to manage items per page
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const [lastMonth, setLastMonth] = useState("");

// //   // const [searchCheck, setSearchCheck] = useState(true);

// //   const [getBanks, setBanks] = useState([]);
// //   const { user } = useAuth();
// //   const { academicSession } = useContext(AcademicSessionContext);
// //   const [checkedVouchers, setCheckedVouchers] = useState([]);
// //   const [allChecked, setAllChecked] = useState(true);
// //   const [getClasses, setClasses] = useState([]);
// //   const [getSections, setSections] = useState([]);
// //   const navigate = useNavigate();

// //   const [showBackground, setShowBackground] = useState(false)


// //   const [voucherData, setVoucherData] = useState([]);

// //   const [viewVoucherId, setViewVoucherId] = useState([]);
// //   const [showData, setShowData] = useState(false);

// //   const componentRef = useRef();

// //   function convertDates(date) {
// //     const d = new Date(date);

// //     // Get day, month, and year
// //     const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
// //     const year = d.getFullYear();

// //     // Return formatted date as dd-mm-yyyy
// //     return `${day}-${month}-${year}`;
// //   }

// //   const findClassLabel = () => {
// //     if (!editFormData.class_id || !editFormData.section_id) {
// //       return "";
// //     }
// //     const classObj = getClasses.find(
// //       (class_get) =>
// //         class_get.id === parseInt(editFormData.class_id) &&
// //         class_get.section_id === parseInt(editFormData.section_id)
// //     );
// //     if (classObj) {
// //       return `${classObj.class} (${classObj.section_name})`;
// //     }
// //     return "";
// //   };

// //   const handleClassChange = (selectedOption) => {
// //     const [class_id, section_id] = selectedOption
// //       ? selectedOption.value.split(",")
// //       : ["", ""];
// //     setEditFormData({ ...editFormData, class_id, section_id });
// //   };

// //   const initialState = {
// //     class_id: "",
// //     section_id: "",
// //     shift: "",
// //     search: "",
// //     from_month: "",
// //     to_month: "",
// //     session_id: academicSession,
// //     campus_id: user.user.campus_id,
// //     user_id: user.user.user_id,
// //     hidden_id: "",
// //   };

// //   const [validity, setValidity] = useState({
// //     class_id: true,
// //     section_id: true,
// //     shift: true,
// //     from_month: true,
// //     to_month: true,
// //   });

// //   const [editFormData, setEditFormData] = useState(initialState);

// //   useEffect(() => {
// //     if (academicSession) {
// //       setEditFormData((prevFormData) => ({
// //         ...prevFormData,
// //         session_id: parseInt(academicSession),
// //       }));
// //     }
// //   }, [academicSession]);

// //   useEffect(() => {
// //     const getClasses = (campus_id) => {
// //       axios
// //         .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
// //         .then((res) => {
// //           setClasses(res.data.results);
// //         })
// //         .catch((err) => console.log(err));
// //     };

// //     // Ensure user.campus_id is defined before calling fetchClasses
// //     if (user && user.user.campus_id) {
// //       getClasses(user.user.campus_id);
// //     }
// //   }, [user]); // Dependency

// //   useEffect(() => {
// //     const sections = (campus_id) => {
// //       axios
// //         .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
// //         .then((res) => {
// //           setSections(res.data.results);
// //         })
// //         .catch((err) => console.log(err));
// //     };

// //     // Ensure user.campus_id is defined before calling fetchClasses
// //     if (user && user.user.campus_id) {
// //       sections(user.user.campus_id);
// //     }
// //   }, [user]); // Dependency

// //   const validateForm = () => {
// //     let isValid = true;
// //     // Basic validation rules (customize as per your requirements)
// //     if (!editFormData.class_id && !editFormData.class_id.trim()) {
// //       setValidity((prevState) => ({ ...prevState, class_id: false }));
// //       isValid = false;
// //     }
// //     if (!editFormData.section_id.trim()) {
// //       setValidity((prevState) => ({ ...prevState, section_id: false }));
// //       isValid = false;
// //     }
// //     if (!editFormData.shift.trim()) {
// //       setValidity((prevState) => ({ ...prevState, shift: false }));
// //       isValid = false;
// //     }

// //     return isValid;
// //   };

// //   const [report, getAllReports] = useState({
// //     from_date: "",
// //     to_date: "",
// //     report_type: "",
// //   });

// //   const [searchCategoryReport, getSearchCategoryReport] = useState({
// //     search: "",
// //   });

// //   function getSearchData() {
// //     if (
// //       editFormData.search.length > 1 ||
// //       (editFormData.class_id !== "" && editFormData.shift !== "")
// //     ) {
// //       fetchData();
// //     }
// //   }

// //   const handleKeyDown = (e) => {
// //     if (e.key === "Enter") {
// //       if (editFormData.search.length > 1) {
// //         fetchData();
// //       }
// //     }
// //   };



// //   useEffect(() => {
// //     if (academicSession) {
// //       const initialChecked = data.map((voucher) => voucher.id);
// //       setCheckedVouchers(initialChecked);
// //     }
// //   }, [data, academicSession, user]);

// //   const handleCheckboxChange = (id) => {
// //     setCheckedVouchers((prevState) =>
// //       prevState.includes(id)
// //         ? prevState.filter((voucherId) => voucherId !== id)
// //         : [...prevState, id]
// //     );
// //   };

// //   const handleToggleAll = () => {
// //     if (allChecked) {
// //       // Uncheck all
// //       setCheckedVouchers([]);
// //     } else {
// //       // Check all
// //       const allIds = data.map((voucher) => voucher.id);
// //       setCheckedVouchers(allIds);
// //     }
// //     setAllChecked(!allChecked);
// //   };

// //   useEffect(() => {
// //     if (editFormData.class_id !== "" && editFormData.shift !== "") {
// //       fetchData();
// //     }
// //   }, [editFormData]);

// //   const fetchData = () => {
// //     axios
// //       .get(process.env.REACT_APP_API_BASE_URL+"/student-id-card-generate", {
// //         params: {
// //           page: currentPage,
// //           limit: totalItem,
// //           search: searchCategoryReport.search,
// //           campus_id: user.user.campus_id,
// //           session_id: academicSession,
// //           class_id: editFormData.class_id,
// //           section_id: editFormData.section_id,
// //           shift: editFormData.shift,
// //         },
// //       })
// //       .then((res) => {
// //         // console.log(res.data.total);
// //         // console.log(res.data.results);
// //         setFilteredData(res.data.results);
// //         setData(res.data.results);
// //         setLastMonth(res.data.last_month);
// //         // setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);
// //         // console.log(res.data.totalPayable);

// //         // dele(res.data.totalArrears);
// //         // setTotalPayable(res.data.totalPayable);
// //       })
// //       .catch((err) => console.log(err));
// //   };

// //   const displayData = filteredData;

  

// //   const viewData = (id_get) => {
// //     setViewVoucherId([id_get]);
// //     setShowData(true);
// //   };

// //   const handleSubmit = (id_get) => {
// //     setViewVoucherId(checkedVouchers);
// //     setShowData(true);
// //   };

// //   const handleSearch = (e) => {
// //     const query = e.target.value.toLowerCase();
// //     setSearchQuery(query);

// //     if (query.trim() === "") {
// //       setFilteredData(data); // Reset to original data when search is empty
// //     } else {
// //       // Filter the data based on the searchQuery across all fields
// //       const filteredData = data.filter((item) => {
// //         return Object.keys(item).some((key) => {
// //           const value = item[key];
// //           return (
// //             value !== null &&
// //             value !== undefined &&
// //             value.toString().toLowerCase().includes(query)
// //           );
// //         });
// //       });
// //       setFilteredData(filteredData);
// //     }
// //   };

// //   useEffect(() => {
// //     // Fetch fee vouchers when viewVoucherId changes
// //     const fetchFeeVouchers = async (
// //       invoices,
// //       campus_id,
// //       session_id,
// //       class_id,
// //       section_id,
// //       user_id
// //     ) => {
// //       try {
// //         const response = await axios.post(
// //           process.env.REACT_APP_API_BASE_URL+"/view-students-id-card",
// //           {
// //             invoices,
// //             campus_id,
// //             session_id,
// //             class_id,
// //             section_id,
// //             user_id
// //           }
// //         );

// //         let vouchers = response.data.vouchers;
// //         setVoucherData(vouchers);
// //       } catch (error) {
// //         console.error("Error fetching fee vouchers:", error);
// //         // Handle error states as needed
// //       }
// //     };

// //     if (viewVoucherId && viewVoucherId.length > 0) {
// //       fetchFeeVouchers(
// //         viewVoucherId,
// //         user.user.campus_id,
// //         academicSession,
// //         editFormData.class_id,
// //         editFormData.section_id,
// //         user.user.user_id,
// //       );
// //     }
// //   }, [viewVoucherId, user.user.campus_id, academicSession]);

// //   const handlePrint = useReactToPrint({
// //     content: () => componentRef.current,
// //     pageStyle: `
// //             @media print {
// //                 body { -webkit-print-color-adjust: exact; }
// //                 @page { size: portrait !important; margin: 1cm; }
// //                   .data-grid {
// //         display: grid;
// //         grid-template-columns: repeat(2, 1fr); /* Number of columns */
// //         grid-gap: 10px;
// //         padding: 10px;
// //         margin: auto;
// //       }
// //      .idcard-container {
// //         page-break-inside: avoid;
// //         break-inside: avoid;
// //     }
// //     .data-grid {
// //         display: grid;
// //         grid-template-columns: 1fr 1fr; /* Adjust columns if needed */
// //     }
// //     /* Force a page break after every certain number of cards */
// //     .data-grid > div:nth-child(6n) {
// //         page-break-after: always;
// //     }
// //             }
// //         `,
// //   });

// //   return (
// //     <>
// //       <div className="d-flex">
// //         <div className="col-md-12 p-2">
// //           <div className="card-header text-warning bg-primary p-2">
// //             <div className="d-flex justify-content-between align-items-center">
// //               <div>
// //                 <i className="fas fa-list"></i> Students ID Card Generate
// //               </div>

// //               <div className="d-flex">
// //                 <div className="me-2 mr-2">
// //                   <Select
// //                     options={getClasses.map((class_get) => ({
// //                       value: `${class_get.id},${class_get.section_id}`,
// //                       label: `${class_get.class} (${class_get.section_name})`,
// //                     }))}
// //                     value={
// //                       editFormData.class_id && editFormData.section_id
// //                         ? {
// //                             value: `${editFormData.class_id},${editFormData.section_id}`,
// //                             label: findClassLabel(),
// //                           }
// //                         : null
// //                     }
// //                     onChange={handleClassChange}
// //                     placeholder="Select Class"
// //                   />
// //                 </div>

// //                 <div className="me-2 mr-2">
// //                   <select
// //                     name="shift"
// //                     value={editFormData.shift}
// //                     onChange={(e) => {
// //                       setEditFormData({
// //                         ...editFormData,
// //                         shift: e.target.value,
// //                       });
// //                       setValidity({ ...validity, shift: true });
// //                     }}
// //                     className={
// //                       validity.shift
// //                         ? "form-control"
// //                         : "form-control invalid-input"
// //                     }
// //                   >
// //                     <option value="">Select Shift</option>
// //                     <option>Morning</option>
// //                     <option>Evening</option>
// //                   </select>
// //                 </div>
// //               </div>

// //             </div>
// //           </div>

// //           <div className="border p-2">
// //             <div className="d-flex justify-content-between pb-1">
// //               <div className="d-flex">
// //                 <div>
// //                   <button
// //                     onClick={handleToggleAll}
// //                     className="mr-2 btn btn-warning btn-sm"
// //                   >
// //                     {allChecked ? (
// //                       <i className="far fa-check-square"></i>
// //                     ) : (
// //                       <i className="far fa-square"></i>
// //                     )}
// //                   </button>
// //                 </div>
// //                 <div>
// //                   <button
// //                     onClick={handleSubmit}
// //                     className="btn btn-warning btn-sm"
// //                   >
// //                     {" "}
// //                     <i className="fa fa-eye" aria-hidden="true"></i> View
// //                     ID Cards
// //                   </button>
// //                 </div>
// //               </div>

// //               <div className="pb-0 d-flex justify-content-end">
// //                 <div>
// //                   <input
// //                     type="text"
// //                     className="form-control"
// //                     placeholder="Search......."
// //                     onChange={handleSearch}
// //                     value={searchQuery}
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <table className="table m-0">
// //               <thead>
// //                 <tr>
// //                   <th>Check</th>
// //                   <th>Reg#</th>
// //                   <th>Name</th>
// //                   <th>Class</th>
// //                   <th>Section</th>
// //                   <th>Category</th>
// //                   <th>Status</th>
// //                   <th className="text-center">View ID Card</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {displayData.map((voucher, index) => (
// //                   <tr key={index}>
// //                     <td>
// //                       <input
// //                         type="checkbox"
// //                         checked={checkedVouchers.includes(voucher.id)}
// //                         onChange={() => handleCheckboxChange(voucher.id)}
// //                         value={voucher.id}
// //                       />
// //                     </td>
// //                     <td>
// //                       {voucher.register_no == ""
// //                         ? voucher.old_register_no
// //                         : voucher.register_no}
// //                     </td>
// //                     <td>{voucher.full_name}</td>
// //                     <td>{voucher.class}</td>
// //                     <td>{voucher.section_name}</td>
// //                     <td>{voucher.category}</td>
// //                     <td>{voucher.status}</td>
// //                     <td className="text-center">
// //                       <div>
// //                         <a
// //                           href="#"
// //                           className={`btn btn-warning btn-sm`}
// //                           onClick={() => viewData(voucher.id)}
// //                         >
// //                           <i className="fas fa-eye"></i>
// //                         </a>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>

// //           </div>
// //         </div>
// //       </div>

// //       {showData && (
// //         <>
// //           <div
// //             style={{
// //               position: "fixed", // Fix to the viewport
// //               top: "50%",
// //               left: "50%",
// //               transform: "translate(-50%, -50%)", // Center horizontally and vertically
// //               zIndex: "100", // Ensure it's above other elements
// //               backdropFilter: "blur(10px)", // Optional: adds blur to the background
// //               width: "90%",
// //               maxWidth: "1800px",
// //               maxHeight: "90vh",
// //               backgroundColor: "white",
// //               // borderRadius: "10px",
// //               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //               padding: "10px", // Remove padding for header part
// //               overflow: "hidden", // Prevent entire modal from scrolling
// //             }}
// //           >
// //             {/* Header section */}
// //             <div
// //               style={{
// //                 position: "sticky", // Sticky position to keep the title fixed
// //                 top: 0, // Stick to the top of the modal
// //                 zIndex: 101, // Ensure it's above other content in the modal
// //                 backgroundColor: "#007bff", // Background color for header
// //                 color: "#ffc107",
// //                 padding: "8px 16px", // Padding for header content
// //               }}
// //             >
// //               <h5 style={{ margin: 0 }}>View Students Id Card</h5>
// //               <button
// //                 onClick={() => setShowData(false)}
// //                 style={{
// //                   position: "absolute",
// //                   top: "5px",
// //                   right: "15px",
// //                   background: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   cursor: "pointer",
// //                   color: "#ffc107",
// //                 }}
// //               >
// //                 &times;
// //               </button>
// //             </div>

// //             {/* Scrollable content */}
// //             <div
// //               style={{
// //                 padding: "20px", // Padding for content
// //                 marginTop: "10px", // Margin between header and content
// //                 width: "100%",
// //                 overflowY: "auto", // Make content scrollable
// //                 maxHeight: "calc(90vh - 80px)", // Adjust height relative to viewport
// //                 paddingTop: "5px",
// //               }}
// //             >
// //               <button
// //                 onClick={handlePrint}
// //                 className="btn btn-warning btn-sm ml-4 mt-0"
// //               >
// //                 <i className="fa fa-print" aria-hidden="true"></i> Print
// //               </button>

// //               <button
// //               onClick={() => setShowBackground((prev) => !prev)} // Toggle function
// //               className="btn btn-warning btn-sm ml-4 mt-0"
// //             >
// //               <i className="fa fa-eye" aria-hidden="true"></i> 
// //               {showBackground ? " View ID Card" : " View Background"}
// //             </button>


// //               <div 
// //                     className="data-grid"
// //                     ref={componentRef}
// //                     style={{
// //                         display: "grid",
// //                         gridTemplateColumns: "repeat(2, 1fr)", // 3 columns
// //                         gridTemplateRows: "repeat(2, auto)", // 2 rows
// //                         gap: "5px", // Space between cards
// //                         width: "1004px", // A4 width in pixels at 96 DPI
// //                         height: "1123px", // A4 height in pixels at 96 DPI
// //                         padding: "20px", // Padding around the grid
// //                         margin: "auto",
// //                     }}
// //                     >
// //                     {voucherData.map((voucher, index) => (
// //                         <IdCard key={index} data={voucher} showBackground={showBackground} />
// //                     ))}
// //                     </div>

// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </>
// //   );
// // }

// // const IdCard = ({ data, showBackground  }) => {
// //   const {
// //     register_no,
// //     old_register_no,
// //     full_name,
// //     father_name,
// //     class_name,
// //     section_name,
// //     category,
// //     current_address,
// //     guardian_mobile_no,
// //     campus_name,
// //     student_image,
// //     blood_group,
// //     bus_route,
// //     dob
// //   } = data;

// //   function convertDates(date) {
// //     const d = new Date(date);
// //     const day = d.getDate().toString().padStart(2, "0");
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0");
// //     const year = d.getFullYear();
// //     return `${day}-${month}-${year}`;
// //   }

// //   function getCurrentDate() {
// //     const today = new Date();
// //     const day = String(today.getDate()).padStart(2, "0");
// //     const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
// //     const year = today.getFullYear();

// //     const formattedDate = `${day}-${month}-${year}`;
// //     return formattedDate;
// //   }

// //   const renderStudentCards = (title) => (
  
// //     <div
// //       style={{
// //         border: "1px solid #ccc",
// //         padding: "10px",
// //         borderRadius: "8px",
// //         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         width:"390px",
// //         minHeight:"500px",
// //       }}
// //     >
// //       {showBackground == false && (
// //       <>
      

// //       <div
// //       style={{
// //         display: "flex",
// //         alignItems: "center",
// //         width: "100%",
// //       }}
// //     >
// //       <img
// //         src={process.env.REACT_APP_BASE_URL + `/uploads/nasheman_logo.png`}
// //         alt="Nasheman Logo"
// //         style={{
// //           width: "80px",
// //           height: "80px",
// //           objectFit: "contain",
// //           marginRight: "20px",
// //         }}
// //       />
// //       <div style={{ flex: 1 }}>
// //         <h5
// //           style={{
// //             margin: "0",
// //             fontWeight: "600",
// //             color: "#000",
// //           }}
// //         >
// //           Nasheman School & College
// //         </h5>
// //         <h6
// //           style={{
// //             margin: "2px 0 0 0",
// //             fontWeight: "400",
// //             color: "#333",
// //           }}
// //         >
// //           for Special Education & Rehabilitation Center
// //         </h6>
// //       </div>
// //     </div>
// //       <div style={{ textAlign: "center" }}>
// //         {student_image && student_image !== "-" ?  (
// //         <img
// //           src={process.env.REACT_APP_API_BASE_URL + `/uploads/${student_image}`}
// //           alt="Student"
// //           style={{
// //             width: "100px",
// //             height: "100px",
// //             objectFit: "cover",
// //             borderRadius: "5px",
// //             margin: "10px 0",
// //           }}
// //         />
// //       ) : (
// //         <p>Please Upload Image</p>
// //       )}

// //         <h4>{full_name}</h4>
// //         <table style={{ width: "370px", textAlign: "left", marginTop: "10px" }}>
// //           <tbody>
            

// //             <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-id-card" style={{marginRight: "8px"}}></i>Reg#:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {register_no !== "" ? register_no : old_register_no}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-book" style={{marginRight: "8px"}}></i>Class:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {`${class_name} (${section_name})`}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-birthday-cake" style={{marginRight: "8px"}}></i>DOB:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {convertDates(dob)}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-user" style={{marginRight: "8px"}}></i>Father:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {father_name}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-tint" style={{marginRight: "8px"}}></i>Blood.G:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {blood_group}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-map-marker" style={{marginRight: "8px"}}></i>Address:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {current_address}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-phone" style={{marginRight: "8px"}}></i>Mobile#:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {guardian_mobile_no}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-bus" style={{marginRight: "8px"}}></i>Route:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {bus_route}
// //             </td>
// //           </tr>
// //           </tbody>
// //         </table>
// //       </div>
      

// //       </>
// //       )}
// //       {showBackground && (
// //         <div style={{"position" : "relative"}}>
// //            <div
// //     style={{
// //       backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png)`,
// //       backgroundSize: "220px 220px",
// //       backgroundRepeat: "no-repeat",
// //       backgroundPosition: "center",
// //       position: "absolute",
// //       top: 0,
// //       left: 0,
// //       width: "100%",
// //       height: "100%",
// //       opacity: 0.1, // ✅ Only applies to background
// //       zIndex: 0,
// //     }}
// //   ></div>
// //         <div style={{"height"  :"500px", display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center", position : "relative", zIndex : 1}}>
// //         <h4  style={{"textAlign" : "center"}}>Terms and Conditions</h4>
// //         <ul>
// //             <li>Keep your card in your custody carefully.</li>
// //             <li>Display your card at all times while on school premises.</li>
// //             <li>This card is <strong>non-transferable</strong>.</li>
// //             <li>This is a <strong>software-generated card</strong> and does not require a signature or stamp.</li>
// //             <li><strong>Expiry Date:</strong>__________</li>
// //         </ul>
// //         <p style={{"textAlign" : "center", "color":"red"}}><strong>IF FOUND, PLEASE RETURN</strong></p>
// //         <p  style={{"textAlign" : "center"}}>Visit <a href="https://sses.org.pk/website/" target="_blank">SSEI's Website</a></p>
// //         <p  style={{"textAlign" : "center"}}>https://sses.org.pk/website</p>
// //         </div>
// //         </div>
// //       )}
      

// //     </div>

// //   );

// //   return (
// //     <div style={{ marginBottom : "20px" }}>
// //       {renderStudentCards("Student Id Card")}
// //     </div>
// //   );
// // };

// // export default StudentIdCardGenerate;

// //dont delete upper code..................it is accurate code and dont delete it



// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { useAuth } from "./AuthContext";
// import AcademicSessionContext from "./AcademicSessionContext";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import "react-toastify/dist/ReactToastify.css";
// import { useReactToPrint } from "react-to-print";
// import { QRCodeCanvas } from "qrcode.react";


// function StudentIdCardGenerate() {
//   const ITEMS_PER_PAGE = 10;
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalItem, setTotalItem] = useState(10); // State to manage items per page
//   const [searchQuery, setSearchQuery] = useState("");

//   const [lastMonth, setLastMonth] = useState("");

//   // const [searchCheck, setSearchCheck] = useState(true);

//   const [getBanks, setBanks] = useState([]);
//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);
//   const [checkedVouchers, setCheckedVouchers] = useState([]);
//   const [allChecked, setAllChecked] = useState(true);
//   const [getClasses, setClasses] = useState([]);
//   const [getSections, setSections] = useState([]);
//   const navigate = useNavigate();

//   const [showBackground, setShowBackground] = useState(false)


//   const [voucherData, setVoucherData] = useState([]);

//   const [viewVoucherId, setViewVoucherId] = useState([]);
//   const [showData, setShowData] = useState(false);

//   const componentRef = useRef();

//   function convertDates(date) {
//     const d = new Date(date);

//     // Get day, month, and year
//     const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
//     const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
//     const year = d.getFullYear();

//     // Return formatted date as dd-mm-yyyy
//     return `${day}-${month}-${year}`;
//   }

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

//   const initialState = {
//     class_id: "",
//     section_id: "",
//     shift: "",
//     search: "",
//     from_month: "",
//     to_month: "",
//     session_id: academicSession,
//     campus_id: user.user.campus_id,
//     user_id: user.user.user_id,
//     hidden_id: "",
//   };

//   const [validity, setValidity] = useState({
//     class_id: true,
//     section_id: true,
//     shift: true,
//     from_month: true,
//     to_month: true,
//   });

//   const [editFormData, setEditFormData] = useState(initialState);

//   useEffect(() => {
//     if (academicSession) {
//       setEditFormData((prevFormData) => ({
//         ...prevFormData,
//         session_id: parseInt(academicSession),
//       }));
//     }
//   }, [academicSession]);

//   useEffect(() => {
//     const getClasses = (campus_id) => {
//       axios
//         .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
//         .then((res) => {
//           setClasses(res.data.results);
//         })
//         .catch((err) => console.log(err));
//     };

//     // Ensure user.campus_id is defined before calling fetchClasses
//     if (user && user.user.campus_id) {
//       getClasses(user.user.campus_id);
//     }
//   }, [user]); // Dependency

//   useEffect(() => {
//     const sections = (campus_id) => {
//       axios
//         .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
//         .then((res) => {
//           setSections(res.data.results);
//         })
//         .catch((err) => console.log(err));
//     };

//     // Ensure user.campus_id is defined before calling fetchClasses
//     if (user && user.user.campus_id) {
//       sections(user.user.campus_id);
//     }
//   }, [user]); // Dependency

//   const validateForm = () => {
//     let isValid = true;
//     // Basic validation rules (customize as per your requirements)
//     if (!editFormData.class_id && !editFormData.class_id.trim()) {
//       setValidity((prevState) => ({ ...prevState, class_id: false }));
//       isValid = false;
//     }
//     if (!editFormData.section_id.trim()) {
//       setValidity((prevState) => ({ ...prevState, section_id: false }));
//       isValid = false;
//     }
//     if (!editFormData.shift.trim()) {
//       setValidity((prevState) => ({ ...prevState, shift: false }));
//       isValid = false;
//     }

//     return isValid;
//   };

//   const [report, getAllReports] = useState({
//     from_date: "",
//     to_date: "",
//     report_type: "",
//   });

//   const [searchCategoryReport, getSearchCategoryReport] = useState({
//     search: "",
//   });

//   function getSearchData() {
//     if (
//       editFormData.search.length > 1 ||
//       (editFormData.class_id !== "" && editFormData.shift !== "")
//     ) {
//       fetchData();
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       if (editFormData.search.length > 1) {
//         fetchData();
//       }
//     }
//   };



//   useEffect(() => {
//     if (academicSession) {
//       const initialChecked = data.map((voucher) => voucher.id);
//       setCheckedVouchers(initialChecked);
//     }
//   }, [data, academicSession, user]);

//   const handleCheckboxChange = (id) => {
//     setCheckedVouchers((prevState) =>
//       prevState.includes(id)
//         ? prevState.filter((voucherId) => voucherId !== id)
//         : [...prevState, id]
//     );
//   };

//   const handleToggleAll = () => {
//     if (allChecked) {
//       // Uncheck all
//       setCheckedVouchers([]);
//     } else {
//       // Check all
//       const allIds = data.map((voucher) => voucher.id);
//       setCheckedVouchers(allIds);
//     }
//     setAllChecked(!allChecked);
//   };

//   useEffect(() => {
//     if (editFormData.class_id !== "" && editFormData.shift !== "") {
//       fetchData();
//     }
//   }, [editFormData]);

//   const fetchData = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/student-id-card-generate", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift,
//         },
//       })
//       .then((res) => {
//         // console.log(res.data.total);
//         // console.log(res.data.results);
//         setFilteredData(res.data.results);
//         setData(res.data.results);
//         setLastMonth(res.data.last_month);
//         // setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);
//         // console.log(res.data.totalPayable);

//         // dele(res.data.totalArrears);
//         // setTotalPayable(res.data.totalPayable);
//       })
//       .catch((err) => console.log(err));
//   };

//   const displayData = filteredData;

  

//   const viewData = (id_get) => {
//     setViewVoucherId([id_get]);
//     setShowData(true);
//   };

//   const handleSubmit = (id_get) => {
//     setViewVoucherId(checkedVouchers);
//     setShowData(true);
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     if (query.trim() === "") {
//       setFilteredData(data); // Reset to original data when search is empty
//     } else {
//       // Filter the data based on the searchQuery across all fields
//       const filteredData = data.filter((item) => {
//         return Object.keys(item).some((key) => {
//           const value = item[key];
//           return (
//             value !== null &&
//             value !== undefined &&
//             value.toString().toLowerCase().includes(query)
//           );
//         });
//       });
//       setFilteredData(filteredData);
//     }
//   };

//   useEffect(() => {
//     // Fetch fee vouchers when viewVoucherId changes
//     const fetchFeeVouchers = async (
//       invoices,
//       campus_id,
//       session_id,
//       class_id,
//       section_id,
//       user_id
//     ) => {
//       try {
//         const response = await axios.post(
//           process.env.REACT_APP_API_BASE_URL+"/view-students-id-card",
//           {
//             invoices,
//             campus_id,
//             session_id,
//             class_id,
//             section_id,
//             user_id
//           }
//         );

//         let vouchers = response.data.vouchers;
//         setVoucherData(vouchers);
//       } catch (error) {
//         console.error("Error fetching fee vouchers:", error);
//         // Handle error states as needed
//       }
//     };

//     if (viewVoucherId && viewVoucherId.length > 0) {
//       fetchFeeVouchers(
//         viewVoucherId,
//         user.user.campus_id,
//         academicSession,
//         editFormData.class_id,
//         editFormData.section_id,
//         user.user.user_id,
//       );
//     }
//   }, [viewVoucherId, user.user.campus_id, academicSession]);

//   // const handlePrint = useReactToPrint({
//   //   content: () => componentRef.current,
//   //   pageStyle: `
//   //           @media print {
            
//   //               body { -webkit-print-color-adjust: exact; }
//   //               @page { size: portrait !important; margin: 1cm; }
                  
//   //    .idcard-container {
//   //       page-break-inside: avoid;
//   //       break-inside: avoid;
//   //   }
//   //   .data-grid {
//   //       display: grid;
//   //       grid-template-columns: 1fr 1fr; /* Adjust columns if needed */
//   //   }
//   //   /* Force a page break after every certain number of cards */
//   //   .data-grid > div:nth-child(6n) {
//   //       page-break-after: always;
//   //   }
//   //           }
//   //       `,
//   // });
  


//   const handlePrint = useReactToPrint({
//   content: () => componentRef.current,
//   pageStyle: `
//     @media print {
//       body {
//         -webkit-print-color-adjust: exact;
//       }

//       @page {
//         size: A4 portrait !important;
//         margin: 5cm;
//       }

//       .idcard-container {
//         display: flex;
//         flex-direction: row;
//         justify-content: space-between;
//         gap: 10px;
//         page-break-inside: avoid;
//         break-inside: avoid;
//         margin-top: 20px;
//       }


//       .back_idcard, .front_idcard{
//         min-height:435px !important;
//         width:330px !important;
//        }
      

//       table{
//         font-size:15px !important;
//        }

//       /* Force page break after every 3 cards */
//       .idcard-container:nth-of-type(3n) {
//         page-break-after: always;
//       }

//       .data-grid {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: flex-start;
//       }

//       /* Optional: card sizing consistency */
//       .idcard-front, .idcard-back {
//         width: 48%;
//       }
//     }
//   `,
// });


//   return (
//     <>
//       <div className="d-flex">
//         <div className="col-md-12 p-2">
//           <div className="card-header text-warning bg-primary p-2">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <i className="fas fa-list"></i> Students ID Card Generate
//               </div>

//               <div className="d-flex">
//                 <div className="me-2 mr-2">
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

//                 <div className="me-2 mr-2">
//                   <select
//                     name="shift"
//                     value={editFormData.shift}
//                     onChange={(e) => {
//                       setEditFormData({
//                         ...editFormData,
//                         shift: e.target.value,
//                       });
//                       setValidity({ ...validity, shift: true });
//                     }}
//                     className={
//                       validity.shift
//                         ? "form-control"
//                         : "form-control invalid-input"
//                     }
//                   >
//                     <option value="">Select Shift</option>
//                     <option>Morning</option>
//                     <option>Evening</option>
//                   </select>
//                 </div>
//               </div>

//             </div>
//           </div>

//           <div className="border p-2">
//             <div className="d-flex justify-content-between pb-1">
//               <div className="d-flex">
//                 <div>
//                   <button
//                     onClick={handleToggleAll}
//                     className="mr-2 btn btn-warning btn-sm"
//                   >
//                     {allChecked ? (
//                       <i className="far fa-check-square"></i>
//                     ) : (
//                       <i className="far fa-square"></i>
//                     )}
//                   </button>
//                 </div>
//                 <div>
//                   <button
//                     onClick={handleSubmit}
//                     className="btn btn-warning btn-sm"
//                   >
//                     {" "}
//                     <i className="fa fa-eye" aria-hidden="true"></i> View
//                     ID Cards
//                   </button>
//                 </div>
//               </div>

//               <div className="pb-0 d-flex justify-content-end">
//                 <div>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search......."
//                     onChange={handleSearch}
//                     value={searchQuery}
//                   />
//                 </div>
//               </div>
//             </div>

//             <table className="table m-0">
//               <thead>
//                 <tr>
//                   <th>Check</th>
//                   <th>Reg#</th>
//                   <th>Name</th>
//                   <th>Class</th>
//                   <th>Section</th>
//                   <th>Category</th>
//                   <th>Status</th>
//                   <th className="text-center">View ID Card</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {displayData.map((voucher, index) => (
//                   <tr key={index}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={checkedVouchers.includes(voucher.id)}
//                         onChange={() => handleCheckboxChange(voucher.id)}
//                         value={voucher.id}
//                       />
//                     </td>
//                     <td>
//                       {voucher.register_no == ""
//                         ? voucher.old_register_no
//                         : voucher.register_no}
//                     </td>
//                     <td>{voucher.full_name}</td>
//                     <td>{voucher.class}</td>
//                     <td>{voucher.section_name}</td>
//                     <td>{voucher.category}</td>
//                     <td>{voucher.status}</td>
//                     <td className="text-center">
//                       <div>
//                         <a
//                           href="#"
//                           className={`btn btn-warning btn-sm`}
//                           onClick={() => viewData(voucher.id)}
//                         >
//                           <i className="fas fa-eye"></i>
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//           </div>
//         </div>
//       </div>

//       {showData && (
//         <>
//           <div
//             style={{
//               position: "fixed", // Fix to the viewport
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)", // Center horizontally and vertically
//               zIndex: "100", // Ensure it's above other elements
//               backdropFilter: "blur(10px)", // Optional: adds blur to the background
//               width: "90%",
//               maxWidth: "1800px",
//               maxHeight: "90vh",
//               backgroundColor: "white",
//               // borderRadius: "10px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               padding: "10px", // Remove padding for header part
//               overflow: "hidden", // Prevent entire modal from scrolling
//             }}
//           >
//             {/* Header section */}
//             <div
//               style={{
//                 position: "sticky", // Sticky position to keep the title fixed
//                 top: 0, // Stick to the top of the modal
//                 zIndex: 101, // Ensure it's above other content in the modal
//                 backgroundColor: "rgb(235, 209, 151)", // Background color for header
//                 color: "black",
//                 padding: "8px 16px", // Padding for header content
//               }}
//             >
//               <h5 style={{ margin: 0 }}>View Students Id Card</h5>
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

//             {/* Scrollable content */}
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
//               <button
//                 onClick={handlePrint}
//                 className="btn btn-warning btn-sm ml-4 mt-0"
//               >
//                 <i className="fa fa-print" aria-hidden="true"></i> Print
//               </button>

//               <button
//               onClick={() => setShowBackground((prev) => !prev)} // Toggle function
//               className="btn btn-warning btn-sm ml-4 mt-0"
//             >
//               <i className="fa fa-eye" aria-hidden="true"></i> 
//               {showBackground ? " View ID Card" : " View Background"}
//             </button>


//               <div 
//                     // className="data-grid"
//                     ref={componentRef}
//                     // style={{
//                     //     display: "grid",
//                     //     gridTemplateColumns: "repeat(2, 1fr)", // 3 columns
//                     //     gridTemplateRows: "repeat(2, auto)", // 2 rows
//                     //     gap: "5px", // Space between cards
//                     //     width: "1004px", // A4 width in pixels at 96 DPI
//                     //     height: "1123px", // A4 height in pixels at 96 DPI
//                     //     padding: "20px", // Padding around the grid
//                     //     margin: "auto",
//                     // }}
//                     >
//                     {voucherData.map((voucher, index) => (
//                         <IdCard key={index} data={voucher} showBackground={showBackground} />
//                     ))}
//                     </div>

//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// const IdCard = ({ data, showBackground  }) => {
//   const {
//     register_no,
//     old_register_no,
//     full_name,
//     father_name,
//     class_name,
//     section_name,
//     category,
//     current_address,
//     guardian_mobile_no,
//     campus_name,
//     student_image,
//     blood_group,
//     bus_route,
//     dob
//   } = data;

//   function convertDates(date) {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//     const year = today.getFullYear();

//     const formattedDate = `${day}-${month}-${year}`;
//     return formattedDate;
//   }

//   const renderStudentCards = (title) => (
  
//     <div
//       style={{
//         // border: "1px solid #ccc",
//         // padding: "10px",
//         // borderRadius: "8px",
//         // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         // display: "flex",
//         // flexDirection: "column",
//         // alignItems: "center",
//         // width:"390px",
//         // minHeight:"500px",
//       }}
//     >


//       <div
//       className="idcard-container"
//   style={{
//     display: "flex",
//     gap: "15px",
//     justifyContent: "center",
//     alignItems: "flex-start",
//     flexWrap: "wrap", // allows wrapping when printing many
//      marginTop: "20px"
//   }}
// >
//   {/* ---------- FRONT SIDE ---------- */}
//   <div  className="front_idcard"
//     style={{
//       border: "1px solid #ccc",
//       padding: "6px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       // display: "flex",
//       // flexDirection: "column",
//       // alignItems: "center",
//       width: "380px",
//       minHeight: "500px",
//       background: "#fff",
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         width: "100%",
//       }}
//     >
//       <img
//         src={`${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png`}
//         alt="Nasheman Logo"
//         style={{
//           width: "80px",
//           height: "80px",
//           objectFit: "contain",
//           marginRight: "20px",
//         }}
//       />
//       <div style={{ flex: 1 }}>
//         <h6 style={{ margin: 0, fontWeight: "600", color: "#000" }}>
//           Nasheman School/College
//         </h6>
//         {/* <h6 style={{ margin: "2px 0 0 0", fontWeight: "400", color: "#333" }}>
//           for Special Education & Rehabilitation Center
//         </h6> */}
//         <h6 style={{ margin: "2px 0 0 0", fontWeight: "bolder", color: "#333" }}>
//          <i className="fas fa-mobile-alt"></i>  051-905525240
//         </h6>
//       </div>
//     </div>

//     <div style={{ textAlign: "center" }}>


//        {/* Student Photo */}
//       <div style={{ 
//         // marginTop: "3px", 
//         marginBottom: "3px",
//         display: "flex",
//         justifyContent: "center"
//       }}>
//         <div
//           // src={student_image || `${process.env.REACT_APP_BASE_URL}/uploads/${student_image}`}
//           // alt="Student Photo"
//           style={{
//             width: "90px",
//             height: "90px",
//             objectFit: "cover",
//             borderRadius: "8px",
//             border: "2px solid #333",
//           }}
//         />
//       </div>

      
//       <h5 style={{ borderBottom:"1px solid black", paddingBottom:"2px", paddingTop:"2px", fontWeight:"bolder"}}>{full_name}</h5>
//       <table style={{ width: "100%", textAlign: "left", marginTop: "10px", fontSize:"15px" }}>
//         <tbody>
//           {/* <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black", width:"100px" }}>
//               <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
//               Name#:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {full_name}
//             </td>
//           </tr> */}
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black", width:"100px" }}>
//               <i className="fas fa-id-card" style={{ marginRight: "8px" }}></i>
//               Reg#:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {register_no || old_register_no}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-book" style={{ marginRight: "8px" }}></i>
//               Class:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {`${class_name} (${section_name})`}
//             </td>
//           </tr>
//           {/* <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i
//                 className="fas fa-birthday-cake"
//                 style={{ marginRight: "8px" }}
//               ></i>
//               DOB:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {convertDates(dob)}
//             </td>
//           </tr> */}
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
//               Father:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {father_name}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-tint" style={{ marginRight: "8px" }}></i>
//               Blood.G:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {blood_group}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i
//                 className="fas fa-map-marker"
//                 style={{ marginRight: "8px" }}
//               ></i>Address:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {current_address}
//             </td>
//           </tr>
//           <tr>
//             <th style={{padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>Mobile#:
//             </th>
//             <td style={{padding: "2px", borderBottom: "1px solid black" }}>
//               {guardian_mobile_no}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-bus" style={{ marginRight: "8px" }}></i>
//               Route:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>{bus_route}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </div>

//   {/* ---------- BACK SIDE ---------- */}
//   <div className="back_idcard"
//     style={{
//       border: "1px solid #ccc",
//       padding: "10px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       width: "380px",
//       minHeight: "500px",
//       position: "relative",
//       background: "#fff",
//     }}
//   >
//     <div
//       style={{
//         backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png)`,
//         backgroundSize: "220px 220px",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         opacity: 0.1,
//         zIndex: 0,
//       }}
//     ></div>

//     <div
//       style={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         position: "relative",
//         zIndex: 1,
//       }}
//     >
//       <h4 style={{ textAlign: "center" }}>Terms and Conditions</h4>
//       <ul style={{ textAlign: "left" }}>
//         <li>Keep your card in your custody carefully.</li>
//         <li>Display your card at all times while on school premises.</li>
//         <li>This card is <strong>non-transferable</strong>.</li>
//         <li>
//           This is a <strong>software-generated card</strong> and does not require a
//           signature or stamp.
//         </li>
//         <li>
//           <strong>Expiry Date:</strong> __________
//         </li>
//       </ul>
//       <p style={{ textAlign: "center", color: "red" }}>
//         <strong>IF FOUND, PLEASE RETURN</strong>
//       </p>
//       <p style={{ textAlign: "center" }}>
//         Visit <a href="https://sses.org.pk/website/" target="_blank">SSEI's Website</a>
//       </p>
//       <p style={{ textAlign: "center" }}>https://sses.org.pk/website</p>
//     </div>
//   </div>
// </div>
// </div>

//   );

//   return (
//     <div>
//       {renderStudentCards("Student Id Card")}
//     </div>
//   );
// };

// export default StudentIdCardGenerate;





// // import React, { useEffect, useState, useContext, useRef } from "react";
// // import axios from "axios";
// // import { useAuth } from "./AuthContext";
// // import AcademicSessionContext from "./AcademicSessionContext";
// // import "react-toastify/dist/ReactToastify.css";
// // import { useNavigate } from "react-router-dom";
// // import Select from "react-select";
// // import "react-toastify/dist/ReactToastify.css";
// // import { useReactToPrint } from "react-to-print";
// // import { QRCodeCanvas } from "qrcode.react";


// // function StudentIdCardGenerate() {
// //   const ITEMS_PER_PAGE = 10;
// //   const [data, setData] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [totalItem, setTotalItem] = useState(10); // State to manage items per page
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const [lastMonth, setLastMonth] = useState("");

// //   // const [searchCheck, setSearchCheck] = useState(true);

// //   const [getBanks, setBanks] = useState([]);
// //   const { user } = useAuth();
// //   const { academicSession } = useContext(AcademicSessionContext);
// //   const [checkedVouchers, setCheckedVouchers] = useState([]);
// //   const [allChecked, setAllChecked] = useState(true);
// //   const [getClasses, setClasses] = useState([]);
// //   const [getSections, setSections] = useState([]);
// //   const navigate = useNavigate();

// //   const [showBackground, setShowBackground] = useState(false)


// //   const [voucherData, setVoucherData] = useState([]);

// //   const [viewVoucherId, setViewVoucherId] = useState([]);
// //   const [showData, setShowData] = useState(false);

// //   const componentRef = useRef();

// //   function convertDates(date) {
// //     const d = new Date(date);

// //     // Get day, month, and year
// //     const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
// //     const year = d.getFullYear();

// //     // Return formatted date as dd-mm-yyyy
// //     return `${day}-${month}-${year}`;
// //   }

// //   const findClassLabel = () => {
// //     if (!editFormData.class_id || !editFormData.section_id) {
// //       return "";
// //     }
// //     const classObj = getClasses.find(
// //       (class_get) =>
// //         class_get.id === parseInt(editFormData.class_id) &&
// //         class_get.section_id === parseInt(editFormData.section_id)
// //     );
// //     if (classObj) {
// //       return `${classObj.class} (${classObj.section_name})`;
// //     }
// //     return "";
// //   };

// //   const handleClassChange = (selectedOption) => {
// //     const [class_id, section_id] = selectedOption
// //       ? selectedOption.value.split(",")
// //       : ["", ""];
// //     setEditFormData({ ...editFormData, class_id, section_id });
// //   };

// //   const initialState = {
// //     class_id: "",
// //     section_id: "",
// //     shift: "",
// //     search: "",
// //     from_month: "",
// //     to_month: "",
// //     session_id: academicSession,
// //     campus_id: user.user.campus_id,
// //     user_id: user.user.user_id,
// //     hidden_id: "",
// //   };

// //   const [validity, setValidity] = useState({
// //     class_id: true,
// //     section_id: true,
// //     shift: true,
// //     from_month: true,
// //     to_month: true,
// //   });

// //   const [editFormData, setEditFormData] = useState(initialState);

// //   useEffect(() => {
// //     if (academicSession) {
// //       setEditFormData((prevFormData) => ({
// //         ...prevFormData,
// //         session_id: parseInt(academicSession),
// //       }));
// //     }
// //   }, [academicSession]);

// //   useEffect(() => {
// //     const getClasses = (campus_id) => {
// //       axios
// //         .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
// //         .then((res) => {
// //           setClasses(res.data.results);
// //         })
// //         .catch((err) => console.log(err));
// //     };

// //     // Ensure user.campus_id is defined before calling fetchClasses
// //     if (user && user.user.campus_id) {
// //       getClasses(user.user.campus_id);
// //     }
// //   }, [user]); // Dependency

// //   useEffect(() => {
// //     const sections = (campus_id) => {
// //       axios
// //         .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
// //         .then((res) => {
// //           setSections(res.data.results);
// //         })
// //         .catch((err) => console.log(err));
// //     };

// //     // Ensure user.campus_id is defined before calling fetchClasses
// //     if (user && user.user.campus_id) {
// //       sections(user.user.campus_id);
// //     }
// //   }, [user]); // Dependency

// //   const validateForm = () => {
// //     let isValid = true;
// //     // Basic validation rules (customize as per your requirements)
// //     if (!editFormData.class_id && !editFormData.class_id.trim()) {
// //       setValidity((prevState) => ({ ...prevState, class_id: false }));
// //       isValid = false;
// //     }
// //     if (!editFormData.section_id.trim()) {
// //       setValidity((prevState) => ({ ...prevState, section_id: false }));
// //       isValid = false;
// //     }
// //     if (!editFormData.shift.trim()) {
// //       setValidity((prevState) => ({ ...prevState, shift: false }));
// //       isValid = false;
// //     }

// //     return isValid;
// //   };

// //   const [report, getAllReports] = useState({
// //     from_date: "",
// //     to_date: "",
// //     report_type: "",
// //   });

// //   const [searchCategoryReport, getSearchCategoryReport] = useState({
// //     search: "",
// //   });

// //   function getSearchData() {
// //     if (
// //       editFormData.search.length > 1 ||
// //       (editFormData.class_id !== "" && editFormData.shift !== "")
// //     ) {
// //       fetchData();
// //     }
// //   }

// //   const handleKeyDown = (e) => {
// //     if (e.key === "Enter") {
// //       if (editFormData.search.length > 1) {
// //         fetchData();
// //       }
// //     }
// //   };



// //   useEffect(() => {
// //     if (academicSession) {
// //       const initialChecked = data.map((voucher) => voucher.id);
// //       setCheckedVouchers(initialChecked);
// //     }
// //   }, [data, academicSession, user]);

// //   const handleCheckboxChange = (id) => {
// //     setCheckedVouchers((prevState) =>
// //       prevState.includes(id)
// //         ? prevState.filter((voucherId) => voucherId !== id)
// //         : [...prevState, id]
// //     );
// //   };

// //   const handleToggleAll = () => {
// //     if (allChecked) {
// //       // Uncheck all
// //       setCheckedVouchers([]);
// //     } else {
// //       // Check all
// //       const allIds = data.map((voucher) => voucher.id);
// //       setCheckedVouchers(allIds);
// //     }
// //     setAllChecked(!allChecked);
// //   };

// //   useEffect(() => {
// //     if (editFormData.class_id !== "" && editFormData.shift !== "") {
// //       fetchData();
// //     }
// //   }, [editFormData]);

// //   const fetchData = () => {
// //     axios
// //       .get(process.env.REACT_APP_API_BASE_URL+"/student-id-card-generate", {
// //         params: {
// //           page: currentPage,
// //           limit: totalItem,
// //           search: searchCategoryReport.search,
// //           campus_id: user.user.campus_id,
// //           session_id: academicSession,
// //           class_id: editFormData.class_id,
// //           section_id: editFormData.section_id,
// //           shift: editFormData.shift,
// //         },
// //       })
// //       .then((res) => {
// //         // console.log(res.data.total);
// //         // console.log(res.data.results);
// //         setFilteredData(res.data.results);
// //         setData(res.data.results);
// //         setLastMonth(res.data.last_month);
// //         // setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);
// //         // console.log(res.data.totalPayable);

// //         // dele(res.data.totalArrears);
// //         // setTotalPayable(res.data.totalPayable);
// //       })
// //       .catch((err) => console.log(err));
// //   };

// //   const displayData = filteredData;

  

// //   const viewData = (id_get) => {
// //     setViewVoucherId([id_get]);
// //     setShowData(true);
// //   };

// //   const handleSubmit = (id_get) => {
// //     setViewVoucherId(checkedVouchers);
// //     setShowData(true);
// //   };

// //   const handleSearch = (e) => {
// //     const query = e.target.value.toLowerCase();
// //     setSearchQuery(query);

// //     if (query.trim() === "") {
// //       setFilteredData(data); // Reset to original data when search is empty
// //     } else {
// //       // Filter the data based on the searchQuery across all fields
// //       const filteredData = data.filter((item) => {
// //         return Object.keys(item).some((key) => {
// //           const value = item[key];
// //           return (
// //             value !== null &&
// //             value !== undefined &&
// //             value.toString().toLowerCase().includes(query)
// //           );
// //         });
// //       });
// //       setFilteredData(filteredData);
// //     }
// //   };

// //   useEffect(() => {
// //     // Fetch fee vouchers when viewVoucherId changes
// //     const fetchFeeVouchers = async (
// //       invoices,
// //       campus_id,
// //       session_id,
// //       class_id,
// //       section_id,
// //       user_id
// //     ) => {
// //       try {
// //         const response = await axios.post(
// //           process.env.REACT_APP_API_BASE_URL+"/view-students-id-card",
// //           {
// //             invoices,
// //             campus_id,
// //             session_id,
// //             class_id,
// //             section_id,
// //             user_id
// //           }
// //         );

// //         let vouchers = response.data.vouchers;
// //         setVoucherData(vouchers);
// //       } catch (error) {
// //         console.error("Error fetching fee vouchers:", error);
// //         // Handle error states as needed
// //       }
// //     };

// //     if (viewVoucherId && viewVoucherId.length > 0) {
// //       fetchFeeVouchers(
// //         viewVoucherId,
// //         user.user.campus_id,
// //         academicSession,
// //         editFormData.class_id,
// //         editFormData.section_id,
// //         user.user.user_id,
// //       );
// //     }
// //   }, [viewVoucherId, user.user.campus_id, academicSession]);

// //   // const handlePrint = useReactToPrint({
// //   //   content: () => componentRef.current,
// //   //   pageStyle: `
// //   //           @media print {
            
// //   //               body { -webkit-print-color-adjust: exact; }
// //   //               @page { size: portrait !important; margin: 1cm; }
                  
// //   //    .idcard-container {
// //   //       page-break-inside: avoid;
// //   //       break-inside: avoid;
// //   //   }
// //   //   .data-grid {
// //   //       display: grid;
// //   //       grid-template-columns: 1fr 1fr; /* Adjust columns if needed */
// //   //   }
// //   //   /* Force a page break after every certain number of cards */
// //   //   .data-grid > div:nth-child(6n) {
// //   //       page-break-after: always;
// //   //   }
// //   //           }
// //   //       `,
// //   // });
  


// //   const handlePrint = useReactToPrint({
// //   content: () => componentRef.current,
// //   pageStyle: `
// //     @media print {
// //       body {
// //         -webkit-print-color-adjust: exact;
// //       }

// //       @page {
// //         size: A4 portrait !important;
// //         margin: 5cm;
// //       }

// //       .idcard-container {
// //         display: flex;
// //         flex-direction: row;
// //         justify-content: space-between;
// //         gap: 10px;
// //         page-break-inside: avoid;
// //         break-inside: avoid;
// //         margin-top: 15px;
// //       }


// //       .back_idcard, .front_idcard{
// //         min-height:430px !important;
// //        }
      

// //       table{
// //         font-size:13px !important;
// //        }

// //       /* Force page break after every 3 cards */
// //       .idcard-container:nth-of-type(3n) {
// //         page-break-after: always;
// //       }

// //       .data-grid {
// //         display: flex;
// //         flex-direction: column;
// //         align-items: center;
// //         justify-content: flex-start;
// //       }

// //       /* Optional: card sizing consistency */
// //       .idcard-front, .idcard-back {
// //         width: 48%;
// //       }
// //     }
// //   `,
// // });


// //   return (
// //     <>
// //       <div className="d-flex">
// //         <div className="col-md-12 p-2">
// //           <div className="card-header text-warning bg-primary p-2">
// //             <div className="d-flex justify-content-between align-items-center">
// //               <div>
// //                 <i className="fas fa-list"></i> Students ID Card Generate
// //               </div>

// //               <div className="d-flex">
// //                 <div className="me-2 mr-2">
// //                   <Select
// //                     options={getClasses.map((class_get) => ({
// //                       value: `${class_get.id},${class_get.section_id}`,
// //                       label: `${class_get.class} (${class_get.section_name})`,
// //                     }))}
// //                     value={
// //                       editFormData.class_id && editFormData.section_id
// //                         ? {
// //                             value: `${editFormData.class_id},${editFormData.section_id}`,
// //                             label: findClassLabel(),
// //                           }
// //                         : null
// //                     }
// //                     onChange={handleClassChange}
// //                     placeholder="Select Class"
// //                   />
// //                 </div>

// //                 <div className="me-2 mr-2">
// //                   <select
// //                     name="shift"
// //                     value={editFormData.shift}
// //                     onChange={(e) => {
// //                       setEditFormData({
// //                         ...editFormData,
// //                         shift: e.target.value,
// //                       });
// //                       setValidity({ ...validity, shift: true });
// //                     }}
// //                     className={
// //                       validity.shift
// //                         ? "form-control"
// //                         : "form-control invalid-input"
// //                     }
// //                   >
// //                     <option value="">Select Shift</option>
// //                     <option>Morning</option>
// //                     <option>Evening</option>
// //                   </select>
// //                 </div>
// //               </div>

// //             </div>
// //           </div>

// //           <div className="border p-2">
// //             <div className="d-flex justify-content-between pb-1">
// //               <div className="d-flex">
// //                 <div>
// //                   <button
// //                     onClick={handleToggleAll}
// //                     className="mr-2 btn btn-warning btn-sm"
// //                   >
// //                     {allChecked ? (
// //                       <i className="far fa-check-square"></i>
// //                     ) : (
// //                       <i className="far fa-square"></i>
// //                     )}
// //                   </button>
// //                 </div>
// //                 <div>
// //                   <button
// //                     onClick={handleSubmit}
// //                     className="btn btn-warning btn-sm"
// //                   >
// //                     {" "}
// //                     <i className="fa fa-eye" aria-hidden="true"></i> View
// //                     ID Cards
// //                   </button>
// //                 </div>
// //               </div>

// //               <div className="pb-0 d-flex justify-content-end">
// //                 <div>
// //                   <input
// //                     type="text"
// //                     className="form-control"
// //                     placeholder="Search......."
// //                     onChange={handleSearch}
// //                     value={searchQuery}
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <table className="table m-0">
// //               <thead>
// //                 <tr>
// //                   <th>Check</th>
// //                   <th>Reg#</th>
// //                   <th>Name</th>
// //                   <th>Class</th>
// //                   <th>Section</th>
// //                   <th>Category</th>
// //                   <th>Status</th>
// //                   <th className="text-center">View ID Card</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {displayData.map((voucher, index) => (
// //                   <tr key={index}>
// //                     <td>
// //                       <input
// //                         type="checkbox"
// //                         checked={checkedVouchers.includes(voucher.id)}
// //                         onChange={() => handleCheckboxChange(voucher.id)}
// //                         value={voucher.id}
// //                       />
// //                     </td>
// //                     <td>
// //                       {voucher.register_no == ""
// //                         ? voucher.old_register_no
// //                         : voucher.register_no}
// //                     </td>
// //                     <td>{voucher.full_name}</td>
// //                     <td>{voucher.class}</td>
// //                     <td>{voucher.section_name}</td>
// //                     <td>{voucher.category}</td>
// //                     <td>{voucher.status}</td>
// //                     <td className="text-center">
// //                       <div>
// //                         <a
// //                           href="#"
// //                           className={`btn btn-warning btn-sm`}
// //                           onClick={() => viewData(voucher.id)}
// //                         >
// //                           <i className="fas fa-eye"></i>
// //                         </a>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>

// //           </div>
// //         </div>
// //       </div>

// //       {showData && (
// //         <>
// //           <div
// //             style={{
// //               position: "fixed", // Fix to the viewport
// //               top: "50%",
// //               left: "50%",
// //               transform: "translate(-50%, -50%)", // Center horizontally and vertically
// //               zIndex: "100", // Ensure it's above other elements
// //               backdropFilter: "blur(10px)", // Optional: adds blur to the background
// //               width: "90%",
// //               maxWidth: "1800px",
// //               maxHeight: "90vh",
// //               backgroundColor: "white",
// //               // borderRadius: "10px",
// //               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //               padding: "10px", // Remove padding for header part
// //               overflow: "hidden", // Prevent entire modal from scrolling
// //             }}
// //           >
// //             {/* Header section */}
// //             <div
// //               style={{
// //                 position: "sticky", // Sticky position to keep the title fixed
// //                 top: 0, // Stick to the top of the modal
// //                 zIndex: 101, // Ensure it's above other content in the modal
// //                 backgroundColor: "#007bff", // Background color for header
// //                 color: "#ffc107",
// //                 padding: "8px 16px", // Padding for header content
// //               }}
// //             >
// //               <h5 style={{ margin: 0 }}>View Students Id Card</h5>
// //               <button
// //                 onClick={() => setShowData(false)}
// //                 style={{
// //                   position: "absolute",
// //                   top: "5px",
// //                   right: "15px",
// //                   background: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   cursor: "pointer",
// //                   color: "#ffc107",
// //                 }}
// //               >
// //                 &times;
// //               </button>
// //             </div>

// //             {/* Scrollable content */}
// //             <div
// //               style={{
// //                 padding: "20px", // Padding for content
// //                 marginTop: "10px", // Margin between header and content
// //                 width: "100%",
// //                 overflowY: "auto", // Make content scrollable
// //                 maxHeight: "calc(90vh - 80px)", // Adjust height relative to viewport
// //                 paddingTop: "5px",
// //               }}
// //             >
// //               <button
// //                 onClick={handlePrint}
// //                 className="btn btn-warning btn-sm ml-4 mt-0"
// //               >
// //                 <i className="fa fa-print" aria-hidden="true"></i> Print
// //               </button>

// //               <button
// //               onClick={() => setShowBackground((prev) => !prev)} // Toggle function
// //               className="btn btn-warning btn-sm ml-4 mt-0"
// //             >
// //               <i className="fa fa-eye" aria-hidden="true"></i> 
// //               {showBackground ? " View ID Card" : " View Background"}
// //             </button>


// //               <div 
// //                     // className="data-grid"
// //                     ref={componentRef}
// //                     // style={{
// //                     //     display: "grid",
// //                     //     gridTemplateColumns: "repeat(2, 1fr)", // 3 columns
// //                     //     gridTemplateRows: "repeat(2, auto)", // 2 rows
// //                     //     gap: "5px", // Space between cards
// //                     //     width: "1004px", // A4 width in pixels at 96 DPI
// //                     //     height: "1123px", // A4 height in pixels at 96 DPI
// //                     //     padding: "20px", // Padding around the grid
// //                     //     margin: "auto",
// //                     // }}
// //                     >
// //                     {voucherData.map((voucher, index) => (
// //                         <IdCard key={index} data={voucher} showBackground={showBackground} />
// //                     ))}
// //                     </div>

// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </>
// //   );
// // }

// // const IdCard = ({ data, showBackground  }) => {
// //   const {
// //     register_no,
// //     old_register_no,
// //     full_name,
// //     father_name,
// //     class_name,
// //     section_name,
// //     category,
// //     current_address,
// //     guardian_mobile_no,
// //     campus_name,
// //     student_image,
// //     blood_group,
// //     bus_route,
// //     dob
// //   } = data;

// //   function convertDates(date) {
// //     const d = new Date(date);
// //     const day = d.getDate().toString().padStart(2, "0");
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0");
// //     const year = d.getFullYear();
// //     return `${day}-${month}-${year}`;
// //   }

// //   function getCurrentDate() {
// //     const today = new Date();
// //     const day = String(today.getDate()).padStart(2, "0");
// //     const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
// //     const year = today.getFullYear();

// //     const formattedDate = `${day}-${month}-${year}`;
// //     return formattedDate;
// //   }

// //   const renderStudentCards = (title) => (
  
// //     <div
// //       style={{
// //         // border: "1px solid #ccc",
// //         // padding: "10px",
// //         // borderRadius: "8px",
// //         // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //         // display: "flex",
// //         // flexDirection: "column",
// //         // alignItems: "center",
// //         // width:"390px",
// //         // minHeight:"500px",
// //       }}
// //     >


// //       <div
// //       className="idcard-container"
// //   style={{
// //     display: "flex",
// //     gap: "15px",
// //     justifyContent: "center",
// //     alignItems: "flex-start",
// //     flexWrap: "wrap", // allows wrapping when printing many
// //   }}
// // >
// //   {/* ---------- FRONT SIDE ---------- */}
// //   <div  className="front_idcard"
// //     style={{
// //       border: "1px solid #ccc",
// //       padding: "10px",
// //       borderRadius: "8px",
// //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //       // display: "flex",
// //       // flexDirection: "column",
// //       // alignItems: "center",
// //       width: "380px",
// //       minHeight: "500px",
// //       background: "#fff",
// //     }}
// //   >
// //     <div
// //       style={{
// //         display: "flex",
// //         alignItems: "center",
// //         width: "100%",
// //       }}
// //     >
// //       <img
// //         src={`${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.jpeg`}
// //         alt="Nasheman Logo"
// //         style={{
// //           width: "80px",
// //           height: "80px",
// //           objectFit: "contain",
// //           marginRight: "20px",
// //         }}
// //       />
// //       <div style={{ flex: 1 }}>
// //         <h5 style={{ margin: 0, fontWeight: "600", color: "#000" }}>
// //           Nasheman School/College
// //         </h5>
// //         <h6 style={{ margin: "2px 0 0 0", fontWeight: "400", color: "#333" }}>
// //           for Special Education & Rehabilitation Center
// //         </h6>
// //         <h6 style={{ margin: "2px 0 0 0", fontWeight: "bolder", color: "#333" }}>
// //          <i className="fas fa-mobile-alt"></i>  051-905525240
// //         </h6>
// //       </div>
// //     </div>

// //     <div style={{ textAlign: "center" }}>
      
// //       <h4 style={{ borderTop:"1px solid black", borderBottom:"1px solid black", marginTop:"10px", paddingBottom:"10px", paddingTop:"10px", fontWeight:"bolder"}}>{full_name}</h4>
// //       <table style={{ width: "360px", textAlign: "left", marginTop: "10px", fontSize:"15px" }}>
// //         <tbody>
// //           <tr>
// //             <th style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               <i className="fas fa-id-card" style={{ marginRight: "8px" }}></i>
// //               Reg#:
// //             </th>
// //             <td style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               {register_no || old_register_no}
// //             </td>
// //           </tr>
// //           <tr>
// //             <th style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               <i className="fas fa-book" style={{ marginRight: "8px" }}></i>
// //               Class:
// //             </th>
// //             <td style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               {`${class_name} (${section_name})`}
// //             </td>
// //           </tr>
// //           <tr>
// //             <th style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               <i
// //                 className="fas fa-birthday-cake"
// //                 style={{ marginRight: "8px" }}
// //               ></i>
// //               DOB:
// //             </th>
// //             <td style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               {convertDates(dob)}
// //             </td>
// //           </tr>
// //           <tr>
// //             <th style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
// //               Father:
// //             </th>
// //             <td style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               {father_name}
// //             </td>
// //           </tr>
// //           <tr>
// //             <th style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               <i className="fas fa-tint" style={{ marginRight: "8px" }}></i>
// //               Blood.G:
// //             </th>
// //             <td style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               {blood_group}
// //             </td>
// //           </tr>
// //           <tr>
// //             <th style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               <i
// //                 className="fas fa-map-marker"
// //                 style={{ marginRight: "8px" }}
// //               ></i>
// //               Address:
// //             </th>
// //             <td style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               {current_address}
// //             </td>
// //           </tr>
// //           <tr>
// //             <th style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>
// //               Mobile#:
// //             </th>
// //             <td style={{ padding: "5px", borderBottom: "1px solid black" }}>
// //               {guardian_mobile_no}
// //             </td>
// //           </tr>
// //           <tr>
// //             <th style={{ padding: "5px" }}>
// //               <i className="fas fa-bus" style={{ marginRight: "8px" }}></i>
// //               Route:
// //             </th>
// //             <td style={{ padding: "5px" }}>{bus_route}</td>
// //           </tr>
// //         </tbody>
// //       </table>
// //     </div>
// //   </div>

// //   {/* ---------- BACK SIDE ---------- */}
// //   <div className="back_idcard"
// //     style={{
// //       border: "1px solid #ccc",
// //       padding: "10px",
// //       borderRadius: "8px",
// //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //       width: "380px",
// //       minHeight: "500px",
// //       position: "relative",
// //       background: "#fff",
// //     }}
// //   >
// //     <div
// //       style={{
// //         backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png)`,
// //         backgroundSize: "220px 220px",
// //         backgroundRepeat: "no-repeat",
// //         backgroundPosition: "center",
// //         position: "absolute",
// //         top: 0,
// //         left: 0,
// //         width: "100%",
// //         height: "100%",
// //         opacity: 0.1,
// //         zIndex: 0,
// //       }}
// //     ></div>

// //     <div
// //       style={{
// //         height: "100%",
// //         display: "flex",
// //         flexDirection: "column",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         position: "relative",
// //         zIndex: 1,
// //       }}
// //     >
// //       <h4 style={{ textAlign: "center" }}>Terms and Conditions</h4>
// //       <ul style={{ textAlign: "left" }}>
// //         <li>Keep your card in your custody carefully.</li>
// //         <li>Display your card at all times while on school premises.</li>
// //         <li>This card is <strong>non-transferable</strong>.</li>
// //         <li>
// //           This is a <strong>software-generated card</strong> and does not require a
// //           signature or stamp.
// //         </li>
// //         <li>
// //           <strong>Expiry Date:</strong> __________
// //         </li>
// //       </ul>
// //       <p style={{ textAlign: "center", color: "red" }}>
// //         <strong>IF FOUND, PLEASE RETURN</strong>
// //       </p>
// //       <p style={{ textAlign: "center" }}>
// //         Visit <a href="https://sses.org.pk/website/" target="_blank">SSEI's Website</a>
// //       </p>
// //       <p style={{ textAlign: "center" }}>https://sses.org.pk/website</p>
// //     </div>
// //   </div>
// // </div>
// // </div>

// //   );

// //   return (
// //     <div style={{ marginBottom : "20px" }}>
// //       {renderStudentCards("Student Id Card")}
// //     </div>
// //   );
// // };

// // export default StudentIdCardGenerate;




// // import React, { useEffect, useState, useContext, useRef } from "react";
// // import axios from "axios";
// // import { useAuth } from "./AuthContext";
// // import AcademicSessionContext from "./AcademicSessionContext";
// // import "react-toastify/dist/ReactToastify.css";
// // import { useNavigate } from "react-router-dom";
// // import Select from "react-select";
// // import "react-toastify/dist/ReactToastify.css";
// // import { useReactToPrint } from "react-to-print";
// // import { QRCodeCanvas } from "qrcode.react";


// // function StudentIdCardGenerate() {
// //   const ITEMS_PER_PAGE = 10;
// //   const [data, setData] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [totalPages, setTotalPages] = useState(0);
// //   const [totalItem, setTotalItem] = useState(10); // State to manage items per page
// //   const [searchQuery, setSearchQuery] = useState("");

// //   const [lastMonth, setLastMonth] = useState("");

// //   // const [searchCheck, setSearchCheck] = useState(true);

// //   const [getBanks, setBanks] = useState([]);
// //   const { user } = useAuth();
// //   const { academicSession } = useContext(AcademicSessionContext);
// //   const [checkedVouchers, setCheckedVouchers] = useState([]);
// //   const [allChecked, setAllChecked] = useState(true);
// //   const [getClasses, setClasses] = useState([]);
// //   const [getSections, setSections] = useState([]);
// //   const navigate = useNavigate();

// //   const [showBackground, setShowBackground] = useState(false)


// //   const [voucherData, setVoucherData] = useState([]);

// //   const [viewVoucherId, setViewVoucherId] = useState([]);
// //   const [showData, setShowData] = useState(false);

// //   const componentRef = useRef();

// //   function convertDates(date) {
// //     const d = new Date(date);

// //     // Get day, month, and year
// //     const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
// //     const year = d.getFullYear();

// //     // Return formatted date as dd-mm-yyyy
// //     return `${day}-${month}-${year}`;
// //   }

// //   const findClassLabel = () => {
// //     if (!editFormData.class_id || !editFormData.section_id) {
// //       return "";
// //     }
// //     const classObj = getClasses.find(
// //       (class_get) =>
// //         class_get.id === parseInt(editFormData.class_id) &&
// //         class_get.section_id === parseInt(editFormData.section_id)
// //     );
// //     if (classObj) {
// //       return `${classObj.class} (${classObj.section_name})`;
// //     }
// //     return "";
// //   };

// //   const handleClassChange = (selectedOption) => {
// //     const [class_id, section_id] = selectedOption
// //       ? selectedOption.value.split(",")
// //       : ["", ""];
// //     setEditFormData({ ...editFormData, class_id, section_id });
// //   };

// //   const initialState = {
// //     class_id: "",
// //     section_id: "",
// //     shift: "",
// //     search: "",
// //     from_month: "",
// //     to_month: "",
// //     session_id: academicSession,
// //     campus_id: user.user.campus_id,
// //     user_id: user.user.user_id,
// //     hidden_id: "",
// //   };

// //   const [validity, setValidity] = useState({
// //     class_id: true,
// //     section_id: true,
// //     shift: true,
// //     from_month: true,
// //     to_month: true,
// //   });

// //   const [editFormData, setEditFormData] = useState(initialState);

// //   useEffect(() => {
// //     if (academicSession) {
// //       setEditFormData((prevFormData) => ({
// //         ...prevFormData,
// //         session_id: parseInt(academicSession),
// //       }));
// //     }
// //   }, [academicSession]);

// //   useEffect(() => {
// //     const getClasses = (campus_id) => {
// //       axios
// //         .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
// //         .then((res) => {
// //           setClasses(res.data.results);
// //         })
// //         .catch((err) => console.log(err));
// //     };

// //     // Ensure user.campus_id is defined before calling fetchClasses
// //     if (user && user.user.campus_id) {
// //       getClasses(user.user.campus_id);
// //     }
// //   }, [user]); // Dependency

// //   useEffect(() => {
// //     const sections = (campus_id) => {
// //       axios
// //         .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
// //         .then((res) => {
// //           setSections(res.data.results);
// //         })
// //         .catch((err) => console.log(err));
// //     };

// //     // Ensure user.campus_id is defined before calling fetchClasses
// //     if (user && user.user.campus_id) {
// //       sections(user.user.campus_id);
// //     }
// //   }, [user]); // Dependency

// //   const validateForm = () => {
// //     let isValid = true;
// //     // Basic validation rules (customize as per your requirements)
// //     if (!editFormData.class_id && !editFormData.class_id.trim()) {
// //       setValidity((prevState) => ({ ...prevState, class_id: false }));
// //       isValid = false;
// //     }
// //     if (!editFormData.section_id.trim()) {
// //       setValidity((prevState) => ({ ...prevState, section_id: false }));
// //       isValid = false;
// //     }
// //     if (!editFormData.shift.trim()) {
// //       setValidity((prevState) => ({ ...prevState, shift: false }));
// //       isValid = false;
// //     }

// //     return isValid;
// //   };

// //   const [report, getAllReports] = useState({
// //     from_date: "",
// //     to_date: "",
// //     report_type: "",
// //   });

// //   const [searchCategoryReport, getSearchCategoryReport] = useState({
// //     search: "",
// //   });

// //   function getSearchData() {
// //     if (
// //       editFormData.search.length > 1 ||
// //       (editFormData.class_id !== "" && editFormData.shift !== "")
// //     ) {
// //       fetchData();
// //     }
// //   }

// //   const handleKeyDown = (e) => {
// //     if (e.key === "Enter") {
// //       if (editFormData.search.length > 1) {
// //         fetchData();
// //       }
// //     }
// //   };



// //   useEffect(() => {
// //     if (academicSession) {
// //       const initialChecked = data.map((voucher) => voucher.id);
// //       setCheckedVouchers(initialChecked);
// //     }
// //   }, [data, academicSession, user]);

// //   const handleCheckboxChange = (id) => {
// //     setCheckedVouchers((prevState) =>
// //       prevState.includes(id)
// //         ? prevState.filter((voucherId) => voucherId !== id)
// //         : [...prevState, id]
// //     );
// //   };

// //   const handleToggleAll = () => {
// //     if (allChecked) {
// //       // Uncheck all
// //       setCheckedVouchers([]);
// //     } else {
// //       // Check all
// //       const allIds = data.map((voucher) => voucher.id);
// //       setCheckedVouchers(allIds);
// //     }
// //     setAllChecked(!allChecked);
// //   };

// //   useEffect(() => {
// //     if (editFormData.class_id !== "" && editFormData.shift !== "") {
// //       fetchData();
// //     }
// //   }, [editFormData]);

// //   const fetchData = () => {
// //     axios
// //       .get(process.env.REACT_APP_API_BASE_URL+"/student-id-card-generate", {
// //         params: {
// //           page: currentPage,
// //           limit: totalItem,
// //           search: searchCategoryReport.search,
// //           campus_id: user.user.campus_id,
// //           session_id: academicSession,
// //           class_id: editFormData.class_id,
// //           section_id: editFormData.section_id,
// //           shift: editFormData.shift,
// //         },
// //       })
// //       .then((res) => {
// //         // console.log(res.data.total);
// //         // console.log(res.data.results);
// //         setFilteredData(res.data.results);
// //         setData(res.data.results);
// //         setLastMonth(res.data.last_month);
// //         // setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);
// //         // console.log(res.data.totalPayable);

// //         // dele(res.data.totalArrears);
// //         // setTotalPayable(res.data.totalPayable);
// //       })
// //       .catch((err) => console.log(err));
// //   };

// //   const displayData = filteredData;

  

// //   const viewData = (id_get) => {
// //     setViewVoucherId([id_get]);
// //     setShowData(true);
// //   };

// //   const handleSubmit = (id_get) => {
// //     setViewVoucherId(checkedVouchers);
// //     setShowData(true);
// //   };

// //   const handleSearch = (e) => {
// //     const query = e.target.value.toLowerCase();
// //     setSearchQuery(query);

// //     if (query.trim() === "") {
// //       setFilteredData(data); // Reset to original data when search is empty
// //     } else {
// //       // Filter the data based on the searchQuery across all fields
// //       const filteredData = data.filter((item) => {
// //         return Object.keys(item).some((key) => {
// //           const value = item[key];
// //           return (
// //             value !== null &&
// //             value !== undefined &&
// //             value.toString().toLowerCase().includes(query)
// //           );
// //         });
// //       });
// //       setFilteredData(filteredData);
// //     }
// //   };

// //   useEffect(() => {
// //     // Fetch fee vouchers when viewVoucherId changes
// //     const fetchFeeVouchers = async (
// //       invoices,
// //       campus_id,
// //       session_id,
// //       class_id,
// //       section_id,
// //       user_id
// //     ) => {
// //       try {
// //         const response = await axios.post(
// //           process.env.REACT_APP_API_BASE_URL+"/view-students-id-card",
// //           {
// //             invoices,
// //             campus_id,
// //             session_id,
// //             class_id,
// //             section_id,
// //             user_id
// //           }
// //         );

// //         let vouchers = response.data.vouchers;
// //         setVoucherData(vouchers);
// //       } catch (error) {
// //         console.error("Error fetching fee vouchers:", error);
// //         // Handle error states as needed
// //       }
// //     };

// //     if (viewVoucherId && viewVoucherId.length > 0) {
// //       fetchFeeVouchers(
// //         viewVoucherId,
// //         user.user.campus_id,
// //         academicSession,
// //         editFormData.class_id,
// //         editFormData.section_id,
// //         user.user.user_id,
// //       );
// //     }
// //   }, [viewVoucherId, user.user.campus_id, academicSession]);

// //   const handlePrint = useReactToPrint({
// //     content: () => componentRef.current,
// //     pageStyle: `
// //             @media print {
// //                 body { -webkit-print-color-adjust: exact; }
// //                 @page { size: portrait !important; margin: 1cm; }
// //                   .data-grid {
// //         display: grid;
// //         grid-template-columns: repeat(2, 1fr); /* Number of columns */
// //         grid-gap: 10px;
// //         padding: 10px;
// //         margin: auto;
// //       }
// //      .idcard-container {
// //         page-break-inside: avoid;
// //         break-inside: avoid;
// //     }
// //     .data-grid {
// //         display: grid;
// //         grid-template-columns: 1fr 1fr; /* Adjust columns if needed */
// //     }
// //     /* Force a page break after every certain number of cards */
// //     .data-grid > div:nth-child(6n) {
// //         page-break-after: always;
// //     }
// //             }
// //         `,
// //   });

// //   return (
// //     <>
// //       <div className="d-flex">
// //         <div className="col-md-12 p-2">
// //           <div className="card-header text-warning bg-primary p-2">
// //             <div className="d-flex justify-content-between align-items-center">
// //               <div>
// //                 <i className="fas fa-list"></i> Students ID Card Generate
// //               </div>

// //               <div className="d-flex">
// //                 <div className="me-2 mr-2">
// //                   <Select
// //                     options={getClasses.map((class_get) => ({
// //                       value: `${class_get.id},${class_get.section_id}`,
// //                       label: `${class_get.class} (${class_get.section_name})`,
// //                     }))}
// //                     value={
// //                       editFormData.class_id && editFormData.section_id
// //                         ? {
// //                             value: `${editFormData.class_id},${editFormData.section_id}`,
// //                             label: findClassLabel(),
// //                           }
// //                         : null
// //                     }
// //                     onChange={handleClassChange}
// //                     placeholder="Select Class"
// //                   />
// //                 </div>

// //                 <div className="me-2 mr-2">
// //                   <select
// //                     name="shift"
// //                     value={editFormData.shift}
// //                     onChange={(e) => {
// //                       setEditFormData({
// //                         ...editFormData,
// //                         shift: e.target.value,
// //                       });
// //                       setValidity({ ...validity, shift: true });
// //                     }}
// //                     className={
// //                       validity.shift
// //                         ? "form-control"
// //                         : "form-control invalid-input"
// //                     }
// //                   >
// //                     <option value="">Select Shift</option>
// //                     <option>Morning</option>
// //                     <option>Evening</option>
// //                   </select>
// //                 </div>
// //               </div>

// //             </div>
// //           </div>

// //           <div className="border p-2">
// //             <div className="d-flex justify-content-between pb-1">
// //               <div className="d-flex">
// //                 <div>
// //                   <button
// //                     onClick={handleToggleAll}
// //                     className="mr-2 btn btn-warning btn-sm"
// //                   >
// //                     {allChecked ? (
// //                       <i className="far fa-check-square"></i>
// //                     ) : (
// //                       <i className="far fa-square"></i>
// //                     )}
// //                   </button>
// //                 </div>
// //                 <div>
// //                   <button
// //                     onClick={handleSubmit}
// //                     className="btn btn-warning btn-sm"
// //                   >
// //                     {" "}
// //                     <i className="fa fa-eye" aria-hidden="true"></i> View
// //                     ID Cards
// //                   </button>
// //                 </div>
// //               </div>

// //               <div className="pb-0 d-flex justify-content-end">
// //                 <div>
// //                   <input
// //                     type="text"
// //                     className="form-control"
// //                     placeholder="Search......."
// //                     onChange={handleSearch}
// //                     value={searchQuery}
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <table className="table m-0">
// //               <thead>
// //                 <tr>
// //                   <th>Check</th>
// //                   <th>Reg#</th>
// //                   <th>Name</th>
// //                   <th>Class</th>
// //                   <th>Section</th>
// //                   <th>Category</th>
// //                   <th>Status</th>
// //                   <th className="text-center">View ID Card</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {displayData.map((voucher, index) => (
// //                   <tr key={index}>
// //                     <td>
// //                       <input
// //                         type="checkbox"
// //                         checked={checkedVouchers.includes(voucher.id)}
// //                         onChange={() => handleCheckboxChange(voucher.id)}
// //                         value={voucher.id}
// //                       />
// //                     </td>
// //                     <td>
// //                       {voucher.register_no == ""
// //                         ? voucher.old_register_no
// //                         : voucher.register_no}
// //                     </td>
// //                     <td>{voucher.full_name}</td>
// //                     <td>{voucher.class}</td>
// //                     <td>{voucher.section_name}</td>
// //                     <td>{voucher.category}</td>
// //                     <td>{voucher.status}</td>
// //                     <td className="text-center">
// //                       <div>
// //                         <a
// //                           href="#"
// //                           className={`btn btn-warning btn-sm`}
// //                           onClick={() => viewData(voucher.id)}
// //                         >
// //                           <i className="fas fa-eye"></i>
// //                         </a>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>

// //           </div>
// //         </div>
// //       </div>

// //       {showData && (
// //         <>
// //           <div
// //             style={{
// //               position: "fixed", // Fix to the viewport
// //               top: "50%",
// //               left: "50%",
// //               transform: "translate(-50%, -50%)", // Center horizontally and vertically
// //               zIndex: "100", // Ensure it's above other elements
// //               backdropFilter: "blur(10px)", // Optional: adds blur to the background
// //               width: "90%",
// //               maxWidth: "1800px",
// //               maxHeight: "90vh",
// //               backgroundColor: "white",
// //               // borderRadius: "10px",
// //               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //               padding: "10px", // Remove padding for header part
// //               overflow: "hidden", // Prevent entire modal from scrolling
// //             }}
// //           >
// //             {/* Header section */}
// //             <div
// //               style={{
// //                 position: "sticky", // Sticky position to keep the title fixed
// //                 top: 0, // Stick to the top of the modal
// //                 zIndex: 101, // Ensure it's above other content in the modal
// //                 backgroundColor: "#007bff", // Background color for header
// //                 color: "#ffc107",
// //                 padding: "8px 16px", // Padding for header content
// //               }}
// //             >
// //               <h5 style={{ margin: 0 }}>View Students Id Card</h5>
// //               <button
// //                 onClick={() => setShowData(false)}
// //                 style={{
// //                   position: "absolute",
// //                   top: "5px",
// //                   right: "15px",
// //                   background: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   cursor: "pointer",
// //                   color: "#ffc107",
// //                 }}
// //               >
// //                 &times;
// //               </button>
// //             </div>

// //             {/* Scrollable content */}
// //             <div
// //               style={{
// //                 padding: "20px", // Padding for content
// //                 marginTop: "10px", // Margin between header and content
// //                 width: "100%",
// //                 overflowY: "auto", // Make content scrollable
// //                 maxHeight: "calc(90vh - 80px)", // Adjust height relative to viewport
// //                 paddingTop: "5px",
// //               }}
// //             >
// //               <button
// //                 onClick={handlePrint}
// //                 className="btn btn-warning btn-sm ml-4 mt-0"
// //               >
// //                 <i className="fa fa-print" aria-hidden="true"></i> Print
// //               </button>

// //               <button
// //               onClick={() => setShowBackground((prev) => !prev)} // Toggle function
// //               className="btn btn-warning btn-sm ml-4 mt-0"
// //             >
// //               <i className="fa fa-eye" aria-hidden="true"></i> 
// //               {showBackground ? " View ID Card" : " View Background"}
// //             </button>


// //               <div 
// //                     className="data-grid"
// //                     ref={componentRef}
// //                     style={{
// //                         display: "grid",
// //                         gridTemplateColumns: "repeat(2, 1fr)", // 3 columns
// //                         gridTemplateRows: "repeat(2, auto)", // 2 rows
// //                         gap: "5px", // Space between cards
// //                         width: "1004px", // A4 width in pixels at 96 DPI
// //                         height: "1123px", // A4 height in pixels at 96 DPI
// //                         padding: "20px", // Padding around the grid
// //                         margin: "auto",
// //                     }}
// //                     >
// //                     {voucherData.map((voucher, index) => (
// //                         <IdCard key={index} data={voucher} showBackground={showBackground} />
// //                     ))}
// //                     </div>

// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </>
// //   );
// // }

// // const IdCard = ({ data, showBackground  }) => {
// //   const {
// //     register_no,
// //     old_register_no,
// //     full_name,
// //     father_name,
// //     class_name,
// //     section_name,
// //     category,
// //     current_address,
// //     guardian_mobile_no,
// //     campus_name,
// //     student_image,
// //     blood_group,
// //     bus_route,
// //     dob
// //   } = data;

// //   function convertDates(date) {
// //     const d = new Date(date);
// //     const day = d.getDate().toString().padStart(2, "0");
// //     const month = (d.getMonth() + 1).toString().padStart(2, "0");
// //     const year = d.getFullYear();
// //     return `${day}-${month}-${year}`;
// //   }

// //   function getCurrentDate() {
// //     const today = new Date();
// //     const day = String(today.getDate()).padStart(2, "0");
// //     const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
// //     const year = today.getFullYear();

// //     const formattedDate = `${day}-${month}-${year}`;
// //     return formattedDate;
// //   }

// //   const renderStudentCards = (title) => (
  
// //     <div
// //       style={{
// //         border: "1px solid #ccc",
// //         padding: "10px",
// //         borderRadius: "8px",
// //         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         width:"390px",
// //         minHeight:"500px",
// //       }}
// //     >
// //       {showBackground == false && (
// //       <>
      

// //       <div
// //       style={{
// //         display: "flex",
// //         alignItems: "center",
// //         width: "100%",
// //       }}
// //     >
// //       <img
// //         src={process.env.REACT_APP_BASE_URL + `/uploads/nasheman_logo.png`}
// //         alt="Nasheman Logo"
// //         style={{
// //           width: "80px",
// //           height: "80px",
// //           objectFit: "contain",
// //           marginRight: "20px",
// //         }}
// //       />
// //       <div style={{ flex: 1 }}>
// //         <h5
// //           style={{
// //             margin: "0",
// //             fontWeight: "600",
// //             color: "#000",
// //           }}
// //         >
// //           Nasheman School & College
// //         </h5>
// //         <h6
// //           style={{
// //             margin: "2px 0 0 0",
// //             fontWeight: "400",
// //             color: "#333",
// //           }}
// //         >
// //           for Special Education & Rehabilitation Center
// //         </h6>
// //       </div>
// //     </div>
// //       <div style={{ textAlign: "center" }}>
// //         {student_image && student_image !== "-" ?  (
// //         <img
// //           src={process.env.REACT_APP_API_BASE_URL + `/uploads/${student_image}`}
// //           alt="Student"
// //           style={{
// //             width: "100px",
// //             height: "100px",
// //             objectFit: "cover",
// //             borderRadius: "5px",
// //             margin: "10px 0",
// //           }}
// //         />
// //       ) : (
// //         <p>Please Upload Image</p>
// //       )}

// //         <h4>{full_name}</h4>
// //         <table style={{ width: "370px", textAlign: "left", marginTop: "10px" }}>
// //           <tbody>
            

// //             <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-id-card" style={{marginRight: "8px"}}></i>Reg#:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {register_no !== "" ? register_no : old_register_no}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-book" style={{marginRight: "8px"}}></i>Class:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {`${class_name} (${section_name})`}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-birthday-cake" style={{marginRight: "8px"}}></i>DOB:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {convertDates(dob)}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-user" style={{marginRight: "8px"}}></i>Father:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {father_name}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-tint" style={{marginRight: "8px"}}></i>Blood.G:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {blood_group}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-map-marker" style={{marginRight: "8px"}}></i>Address:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {current_address}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-phone" style={{marginRight: "8px"}}></i>Mobile#:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {guardian_mobile_no}
// //             </td>
// //           </tr>

// //           <tr>
// //             <th style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               <i className="fas fa-bus" style={{marginRight: "8px"}}></i>Route:
// //             </th>
// //             <td style={{padding: "5px", borderBottom:"1px solid black"}}>
// //               {bus_route}
// //             </td>
// //           </tr>
// //           </tbody>
// //         </table>
// //       </div>
      

// //       </>
// //       )}
// //       {showBackground && (
// //         <div style={{"position" : "relative"}}>
// //            <div
// //     style={{
// //       backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png)`,
// //       backgroundSize: "220px 220px",
// //       backgroundRepeat: "no-repeat",
// //       backgroundPosition: "center",
// //       position: "absolute",
// //       top: 0,
// //       left: 0,
// //       width: "100%",
// //       height: "100%",
// //       opacity: 0.1, // ✅ Only applies to background
// //       zIndex: 0,
// //     }}
// //   ></div>
// //         <div style={{"height"  :"500px", display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center", position : "relative", zIndex : 1}}>
// //         <h4  style={{"textAlign" : "center"}}>Terms and Conditions</h4>
// //         <ul>
// //             <li>Keep your card in your custody carefully.</li>
// //             <li>Display your card at all times while on school premises.</li>
// //             <li>This card is <strong>non-transferable</strong>.</li>
// //             <li>This is a <strong>software-generated card</strong> and does not require a signature or stamp.</li>
// //             <li><strong>Expiry Date:</strong>__________</li>
// //         </ul>
// //         <p style={{"textAlign" : "center", "color":"red"}}><strong>IF FOUND, PLEASE RETURN</strong></p>
// //         <p  style={{"textAlign" : "center"}}>Visit <a href="https://sses.org.pk/website/" target="_blank">SSEI's Website</a></p>
// //         <p  style={{"textAlign" : "center"}}>https://sses.org.pk/website</p>
// //         </div>
// //         </div>
// //       )}
      

// //     </div>

// //   );

// //   return (
// //     <div style={{ marginBottom : "20px" }}>
// //       {renderStudentCards("Student Id Card")}
// //     </div>
// //   );
// // };

// // export default StudentIdCardGenerate;

// //dont delete upper code..................it is accurate code and dont delete it



// import React, { useEffect, useState, useContext, useRef } from "react";
// import axios from "axios";
// import { useAuth } from "./AuthContext";
// import AcademicSessionContext from "./AcademicSessionContext";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import Select from "react-select";
// import "react-toastify/dist/ReactToastify.css";
// import { useReactToPrint } from "react-to-print";
// import { QRCodeCanvas } from "qrcode.react";


// function StudentIdCardGenerate() {
//   const ITEMS_PER_PAGE = 10;
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalItem, setTotalItem] = useState(10); // State to manage items per page
//   const [searchQuery, setSearchQuery] = useState("");

//   const [lastMonth, setLastMonth] = useState("");

//   // const [searchCheck, setSearchCheck] = useState(true);

//   const [getBanks, setBanks] = useState([]);
//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);
//   const [checkedVouchers, setCheckedVouchers] = useState([]);
//   const [allChecked, setAllChecked] = useState(true);
//   const [getClasses, setClasses] = useState([]);
//   const [getSections, setSections] = useState([]);
//   const navigate = useNavigate();

//   const [showBackground, setShowBackground] = useState(false)


//   const [voucherData, setVoucherData] = useState([]);

//   const [viewVoucherId, setViewVoucherId] = useState([]);
//   const [showData, setShowData] = useState(false);

//   const componentRef = useRef();

//   function convertDates(date) {
//     const d = new Date(date);

//     // Get day, month, and year
//     const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
//     const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
//     const year = d.getFullYear();

//     // Return formatted date as dd-mm-yyyy
//     return `${day}-${month}-${year}`;
//   }

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

//   const initialState = {
//     class_id: "",
//     section_id: "",
//     shift: "",
//     search: "",
//     from_month: "",
//     to_month: "",
//     session_id: academicSession,
//     campus_id: user.user.campus_id,
//     user_id: user.user.user_id,
//     hidden_id: "",
//   };

//   const [validity, setValidity] = useState({
//     class_id: true,
//     section_id: true,
//     shift: true,
//     from_month: true,
//     to_month: true,
//   });

//   const [editFormData, setEditFormData] = useState(initialState);

//   useEffect(() => {
//     if (academicSession) {
//       setEditFormData((prevFormData) => ({
//         ...prevFormData,
//         session_id: parseInt(academicSession),
//       }));
//     }
//   }, [academicSession]);

//   useEffect(() => {
//     const getClasses = (campus_id) => {
//       axios
//         .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
//         .then((res) => {
//           setClasses(res.data.results);
//         })
//         .catch((err) => console.log(err));
//     };

//     // Ensure user.campus_id is defined before calling fetchClasses
//     if (user && user.user.campus_id) {
//       getClasses(user.user.campus_id);
//     }
//   }, [user]); // Dependency

//   useEffect(() => {
//     const sections = (campus_id) => {
//       axios
//         .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
//         .then((res) => {
//           setSections(res.data.results);
//         })
//         .catch((err) => console.log(err));
//     };

//     // Ensure user.campus_id is defined before calling fetchClasses
//     if (user && user.user.campus_id) {
//       sections(user.user.campus_id);
//     }
//   }, [user]); // Dependency

//   const validateForm = () => {
//     let isValid = true;
//     // Basic validation rules (customize as per your requirements)
//     if (!editFormData.class_id && !editFormData.class_id.trim()) {
//       setValidity((prevState) => ({ ...prevState, class_id: false }));
//       isValid = false;
//     }
//     if (!editFormData.section_id.trim()) {
//       setValidity((prevState) => ({ ...prevState, section_id: false }));
//       isValid = false;
//     }
//     if (!editFormData.shift.trim()) {
//       setValidity((prevState) => ({ ...prevState, shift: false }));
//       isValid = false;
//     }

//     return isValid;
//   };

//   const [report, getAllReports] = useState({
//     from_date: "",
//     to_date: "",
//     report_type: "",
//   });

//   const [searchCategoryReport, getSearchCategoryReport] = useState({
//     search: "",
//   });

//   function getSearchData() {
//     if (
//       editFormData.search.length > 1 ||
//       (editFormData.class_id !== "" && editFormData.shift !== "")
//     ) {
//       fetchData();
//     }
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       if (editFormData.search.length > 1) {
//         fetchData();
//       }
//     }
//   };



//   useEffect(() => {
//     if (academicSession) {
//       const initialChecked = data.map((voucher) => voucher.id);
//       setCheckedVouchers(initialChecked);
//     }
//   }, [data, academicSession, user]);

//   const handleCheckboxChange = (id) => {
//     setCheckedVouchers((prevState) =>
//       prevState.includes(id)
//         ? prevState.filter((voucherId) => voucherId !== id)
//         : [...prevState, id]
//     );
//   };

//   const handleToggleAll = () => {
//     if (allChecked) {
//       // Uncheck all
//       setCheckedVouchers([]);
//     } else {
//       // Check all
//       const allIds = data.map((voucher) => voucher.id);
//       setCheckedVouchers(allIds);
//     }
//     setAllChecked(!allChecked);
//   };

//   useEffect(() => {
//     if (editFormData.class_id !== "" && editFormData.shift !== "") {
//       fetchData();
//     }
//   }, [editFormData]);

//   const fetchData = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL+"/student-id-card-generate", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           class_id: editFormData.class_id,
//           section_id: editFormData.section_id,
//           shift: editFormData.shift,
//         },
//       })
//       .then((res) => {
//         // console.log(res.data.total);
//         // console.log(res.data.results);
//         setFilteredData(res.data.results);
//         setData(res.data.results);
//         setLastMonth(res.data.last_month);
//         // setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);
//         // console.log(res.data.totalPayable);

//         // dele(res.data.totalArrears);
//         // setTotalPayable(res.data.totalPayable);
//       })
//       .catch((err) => console.log(err));
//   };

//   const displayData = filteredData;

  

//   const viewData = (id_get) => {
//     setViewVoucherId([id_get]);
//     setShowData(true);
//   };

//   const handleSubmit = (id_get) => {
//     setViewVoucherId(checkedVouchers);
//     setShowData(true);
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     if (query.trim() === "") {
//       setFilteredData(data); // Reset to original data when search is empty
//     } else {
//       // Filter the data based on the searchQuery across all fields
//       const filteredData = data.filter((item) => {
//         return Object.keys(item).some((key) => {
//           const value = item[key];
//           return (
//             value !== null &&
//             value !== undefined &&
//             value.toString().toLowerCase().includes(query)
//           );
//         });
//       });
//       setFilteredData(filteredData);
//     }
//   };

//   useEffect(() => {
//     // Fetch fee vouchers when viewVoucherId changes
//     const fetchFeeVouchers = async (
//       invoices,
//       campus_id,
//       session_id,
//       class_id,
//       section_id,
//       user_id
//     ) => {
//       try {
//         const response = await axios.post(
//           process.env.REACT_APP_API_BASE_URL+"/view-students-id-card",
//           {
//             invoices,
//             campus_id,
//             session_id,
//             class_id,
//             section_id,
//             user_id
//           }
//         );

//         let vouchers = response.data.vouchers;
//         setVoucherData(vouchers);
//       } catch (error) {
//         console.error("Error fetching fee vouchers:", error);
//         // Handle error states as needed
//       }
//     };

//     if (viewVoucherId && viewVoucherId.length > 0) {
//       fetchFeeVouchers(
//         viewVoucherId,
//         user.user.campus_id,
//         academicSession,
//         editFormData.class_id,
//         editFormData.section_id,
//         user.user.user_id,
//       );
//     }
//   }, [viewVoucherId, user.user.campus_id, academicSession]);

//   // const handlePrint = useReactToPrint({
//   //   content: () => componentRef.current,
//   //   pageStyle: `
//   //           @media print {
            
//   //               body { -webkit-print-color-adjust: exact; }
//   //               @page { size: portrait !important; margin: 1cm; }
                  
//   //    .idcard-container {
//   //       page-break-inside: avoid;
//   //       break-inside: avoid;
//   //   }
//   //   .data-grid {
//   //       display: grid;
//   //       grid-template-columns: 1fr 1fr; /* Adjust columns if needed */
//   //   }
//   //   /* Force a page break after every certain number of cards */
//   //   .data-grid > div:nth-child(6n) {
//   //       page-break-after: always;
//   //   }
//   //           }
//   //       `,
//   // });
  


//   const handlePrint = useReactToPrint({
//   content: () => componentRef.current,
//   pageStyle: `
//     @media print {
//       body {
//         -webkit-print-color-adjust: exact;
//       }

//       @page {
//         size: A4 portrait !important;
//         margin: 5cm;
//       }

//       .idcard-container {
//         display: flex;
//         flex-direction: row;
//         justify-content: space-between;
//         gap: 10px;
//         page-break-inside: avoid;
//         break-inside: avoid;
//         margin-top: 20px;
//       }


//       .back_idcard, .front_idcard{
//         min-height:435px !important;
//         width:330px !important;
//        }
      

//       table{
//         font-size:15px !important;
//        }

//       /* Force page break after every 3 cards */
//       .idcard-container:nth-of-type(3n) {
//         page-break-after: always;
//       }

//       .data-grid {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: flex-start;
//       }

//       /* Optional: card sizing consistency */
//       .idcard-front, .idcard-back {
//         width: 48%;
//       }
//     }
//   `,
// });


//   return (
//     <>
//       <div className="d-flex">
//         <div className="col-md-12 p-2">
//           <div className="card-header text-warning bg-primary p-2">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <i className="fas fa-list"></i> Students ID Card Generate
//               </div>

//               <div className="d-flex">
//                 <div className="me-2 mr-2">
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

//                 <div className="me-2 mr-2">
//                   <select
//                     name="shift"
//                     value={editFormData.shift}
//                     onChange={(e) => {
//                       setEditFormData({
//                         ...editFormData,
//                         shift: e.target.value,
//                       });
//                       setValidity({ ...validity, shift: true });
//                     }}
//                     className={
//                       validity.shift
//                         ? "form-control"
//                         : "form-control invalid-input"
//                     }
//                   >
//                     <option value="">Select Shift</option>
//                     <option>Morning</option>
//                     <option>Evening</option>
//                   </select>
//                 </div>
//               </div>

//             </div>
//           </div>

//           <div className="border p-2">
//             <div className="d-flex justify-content-between pb-1">
//               <div className="d-flex">
//                 <div>
//                   <button
//                     onClick={handleToggleAll}
//                     className="mr-2 btn btn-warning btn-sm"
//                   >
//                     {allChecked ? (
//                       <i className="far fa-check-square"></i>
//                     ) : (
//                       <i className="far fa-square"></i>
//                     )}
//                   </button>
//                 </div>
//                 <div>
//                   <button
//                     onClick={handleSubmit}
//                     className="btn btn-warning btn-sm"
//                   >
//                     {" "}
//                     <i className="fa fa-eye" aria-hidden="true"></i> View
//                     ID Cards
//                   </button>
//                 </div>
//               </div>

//               <div className="pb-0 d-flex justify-content-end">
//                 <div>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Search......."
//                     onChange={handleSearch}
//                     value={searchQuery}
//                   />
//                 </div>
//               </div>
//             </div>

//             <table className="table m-0">
//               <thead>
//                 <tr>
//                   <th>Check</th>
//                   <th>Reg#</th>
//                   <th>Name</th>
//                   <th>Class</th>
//                   <th>Section</th>
//                   <th>Category</th>
//                   <th>Status</th>
//                   <th className="text-center">View ID Card</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {displayData.map((voucher, index) => (
//                   <tr key={index}>
//                     <td>
//                       <input
//                         type="checkbox"
//                         checked={checkedVouchers.includes(voucher.id)}
//                         onChange={() => handleCheckboxChange(voucher.id)}
//                         value={voucher.id}
//                       />
//                     </td>
//                     <td>
//                       {voucher.register_no == ""
//                         ? voucher.old_register_no
//                         : voucher.register_no}
//                     </td>
//                     <td>{voucher.full_name}</td>
//                     <td>{voucher.class}</td>
//                     <td>{voucher.section_name}</td>
//                     <td>{voucher.category}</td>
//                     <td>{voucher.status}</td>
//                     <td className="text-center">
//                       <div>
//                         <a
//                           href="#"
//                           className={`btn btn-warning btn-sm`}
//                           onClick={() => viewData(voucher.id)}
//                         >
//                           <i className="fas fa-eye"></i>
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//           </div>
//         </div>
//       </div>

//       {showData && (
//         <>
//           <div
//             style={{
//               position: "fixed", // Fix to the viewport
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)", // Center horizontally and vertically
//               zIndex: "100", // Ensure it's above other elements
//               backdropFilter: "blur(10px)", // Optional: adds blur to the background
//               width: "90%",
//               maxWidth: "1800px",
//               maxHeight: "90vh",
//               backgroundColor: "white",
//               // borderRadius: "10px",
//               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//               padding: "10px", // Remove padding for header part
//               overflow: "hidden", // Prevent entire modal from scrolling
//             }}
//           >
//             {/* Header section */}
//             <div
//               style={{
//                 position: "sticky", // Sticky position to keep the title fixed
//                 top: 0, // Stick to the top of the modal
//                 zIndex: 101, // Ensure it's above other content in the modal
//                 backgroundColor: "rgb(235, 209, 151)", // Background color for header
//                 color: "black",
//                 padding: "8px 16px", // Padding for header content
//               }}
//             >
//               <h5 style={{ margin: 0 }}>View Students Id Card</h5>
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

//             {/* Scrollable content */}
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
//               <button
//                 onClick={handlePrint}
//                 className="btn btn-warning btn-sm ml-4 mt-0"
//               >
//                 <i className="fa fa-print" aria-hidden="true"></i> Print
//               </button>

//               <button
//               onClick={() => setShowBackground((prev) => !prev)} // Toggle function
//               className="btn btn-warning btn-sm ml-4 mt-0"
//             >
//               <i className="fa fa-eye" aria-hidden="true"></i> 
//               {showBackground ? " View ID Card" : " View Background"}
//             </button>


//               <div 
//                     // className="data-grid"
//                     ref={componentRef}
//                     // style={{
//                     //     display: "grid",
//                     //     gridTemplateColumns: "repeat(2, 1fr)", // 3 columns
//                     //     gridTemplateRows: "repeat(2, auto)", // 2 rows
//                     //     gap: "5px", // Space between cards
//                     //     width: "1004px", // A4 width in pixels at 96 DPI
//                     //     height: "1123px", // A4 height in pixels at 96 DPI
//                     //     padding: "20px", // Padding around the grid
//                     //     margin: "auto",
//                     // }}
//                     >
//                     {voucherData.map((voucher, index) => (
//                         <IdCard key={index} data={voucher} showBackground={showBackground} />
//                     ))}
//                     </div>

//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// const IdCard = ({ data, showBackground  }) => {
//   const {
//     register_no,
//     old_register_no,
//     full_name,
//     father_name,
//     class_name,
//     section_name,
//     category,
//     current_address,
//     guardian_mobile_no,
//     campus_name,
//     student_image,
//     blood_group,
//     bus_route,
//     dob
//   } = data;

//   function convertDates(date) {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//     const year = today.getFullYear();

//     const formattedDate = `${day}-${month}-${year}`;
//     return formattedDate;
//   }

//   const renderStudentCards = (title) => (
  
//     <div
//       style={{
//         // border: "1px solid #ccc",
//         // padding: "10px",
//         // borderRadius: "8px",
//         // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         // display: "flex",
//         // flexDirection: "column",
//         // alignItems: "center",
//         // width:"390px",
//         // minHeight:"500px",
//       }}
//     >


//       <div
//       className="idcard-container"
//   style={{
//     display: "flex",
//     gap: "15px",
//     justifyContent: "center",
//     alignItems: "flex-start",
//     flexWrap: "wrap", // allows wrapping when printing many
//      marginTop: "20px"
//   }}
// >
//   {/* ---------- FRONT SIDE ---------- */}
//   <div  className="front_idcard"
//     style={{
//       border: "1px solid #ccc",
//       padding: "6px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       // display: "flex",
//       // flexDirection: "column",
//       // alignItems: "center",
//       width: "380px",
//       minHeight: "500px",
//       background: "#fff",
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         width: "100%",
//       }}
//     >
//       <img
//         src={`${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png`}
//         alt="Nasheman Logo"
//         style={{
//           width: "80px",
//           height: "80px",
//           objectFit: "contain",
//           marginRight: "20px",
//         }}
//       />
//       <div style={{ flex: 1 }}>
//         <h5 style={{ margin: 0, fontWeight: "600", color: "#000" }}>
//           Nasheman School/College
//         </h5>
//         <h6 style={{ margin: "2px 0 0 0", fontWeight: "400", color: "#333" }}>
//           for Special Education & Rehabilitation Center
//         </h6>
//         <h6 style={{ margin: "2px 0 0 0", fontWeight: "bolder", color: "#333" }}>
//          <i className="fas fa-mobile-alt"></i>  051-905525240
//         </h6>
//       </div>
//     </div>

//     <div style={{ textAlign: "center" }}>
      
//       <h5 style={{ borderTop:"1px solid black", borderBottom:"1px solid black", marginTop:"10px", paddingBottom:"5px", paddingTop:"5px", fontWeight:"bolder"}}>{full_name}</h5>
//       <table style={{ width: "360px", textAlign: "left", marginTop: "10px", fontSize:"15px" }}>
//         <tbody>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black", width:"100px" }}>
//               <i className="fas fa-id-card" style={{ marginRight: "8px" }}></i>
//               Reg#:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {register_no || old_register_no}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-book" style={{ marginRight: "8px" }}></i>
//               Class:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {`${class_name} (${section_name})`}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i
//                 className="fas fa-birthday-cake"
//                 style={{ marginRight: "8px" }}
//               ></i>
//               DOB:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {convertDates(dob)}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
//               Father:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {father_name}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-tint" style={{ marginRight: "8px" }}></i>
//               Blood.G:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {blood_group}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i
//                 className="fas fa-map-marker"
//                 style={{ marginRight: "8px" }}
//               ></i>Address:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {current_address}
//             </td>
//           </tr>
//           <tr>
//             <th style={{padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>Mobile#:
//             </th>
//             <td style={{padding: "2px", borderBottom: "1px solid black" }}>
//               {guardian_mobile_no}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-bus" style={{ marginRight: "8px" }}></i>
//               Route:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>{bus_route}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </div>

//   {/* ---------- BACK SIDE ---------- */}
//   <div className="back_idcard"
//     style={{
//       border: "1px solid #ccc",
//       padding: "10px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       width: "380px",
//       minHeight: "500px",
//       position: "relative",
//       background: "#fff",
//     }}
//   >
//     <div
//       style={{
//         backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png)`,
//         backgroundSize: "220px 220px",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         opacity: 0.1,
//         zIndex: 0,
//       }}
//     ></div>

//     <div
//       style={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         position: "relative",
//         zIndex: 1,
//       }}
//     >
//       <h4 style={{ textAlign: "center" }}>Terms and Conditions</h4>
//       <ul style={{ textAlign: "left" }}>
//         <li>Keep your card in your custody carefully.</li>
//         <li>Display your card at all times while on school premises.</li>
//         <li>This card is <strong>non-transferable</strong>.</li>
//         <li>
//           This is a <strong>software-generated card</strong> and does not require a
//           signature or stamp.
//         </li>
//         <li>
//           <strong>Expiry Date:</strong> __________
//         </li>
//       </ul>
//       <p style={{ textAlign: "center", color: "red" }}>
//         <strong>IF FOUND, PLEASE RETURN</strong>
//       </p>
//       <p style={{ textAlign: "center" }}>
//         Visit <a href="https://sses.org.pk/website/" target="_blank">SSEI's Website</a>
//       </p>
//       <p style={{ textAlign: "center" }}>https://sses.org.pk/website</p>
//     </div>
//   </div>
// </div>
// </div>

//   );

//   return (
//     <div>
//       {renderStudentCards("Student Id Card")}
//     </div>
//   );
// };

// export default StudentIdCardGenerate;














import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import { QRCodeCanvas } from "qrcode.react";


function StudentIdCardGenerate() {
  const ITEMS_PER_PAGE = 10;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItem, setTotalItem] = useState(10); // State to manage items per page
  const [searchQuery, setSearchQuery] = useState("");

  const [lastMonth, setLastMonth] = useState("");

  // const [searchCheck, setSearchCheck] = useState(true);

  const [getBanks, setBanks] = useState([]);
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);
  const [checkedVouchers, setCheckedVouchers] = useState([]);
  const [allChecked, setAllChecked] = useState(true);
  const [getClasses, setClasses] = useState([]);
  const [getSections, setSections] = useState([]);
  const navigate = useNavigate();

  const [showBackground, setShowBackground] = useState(false)


  const [voucherData, setVoucherData] = useState([]);

  const [viewVoucherId, setViewVoucherId] = useState([]);
  const [showData, setShowData] = useState(false);

  const componentRef = useRef();

  function convertDates(date) {
    const d = new Date(date);

    // Get day, month, and year
    const day = d.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
    const year = d.getFullYear();

    // Return formatted date as dd-mm-yyyy
    return `${day}-${month}-${year}`;
  }

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

  const initialState = {
    class_id: "",
    section_id: "",
    shift: "",
    search: "",
    from_month: "",
    to_month: "",
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.user_id,
    hidden_id: "",
  };

  const [validity, setValidity] = useState({
    class_id: true,
    section_id: true,
    shift: true,
    from_month: true,
    to_month: true,
  });

  const [editFormData, setEditFormData] = useState(initialState);

  useEffect(() => {
    if (academicSession) {
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        session_id: parseInt(academicSession),
      }));
    }
  }, [academicSession]);

  useEffect(() => {
    const getClasses = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
        .then((res) => {
          setClasses(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      getClasses(user.user.campus_id);
    }
  }, [user]); // Dependency

  useEffect(() => {
    const sections = (campus_id) => {
      axios
        .get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
        .then((res) => {
          setSections(res.data.results);
        })
        .catch((err) => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
      sections(user.user.campus_id);
    }
  }, [user]); // Dependency

  const validateForm = () => {
    let isValid = true;
    // Basic validation rules (customize as per your requirements)
    if (!editFormData.class_id && !editFormData.class_id.trim()) {
      setValidity((prevState) => ({ ...prevState, class_id: false }));
      isValid = false;
    }
    if (!editFormData.section_id.trim()) {
      setValidity((prevState) => ({ ...prevState, section_id: false }));
      isValid = false;
    }
    if (!editFormData.shift.trim()) {
      setValidity((prevState) => ({ ...prevState, shift: false }));
      isValid = false;
    }

    return isValid;
  };

  const [report, getAllReports] = useState({
    from_date: "",
    to_date: "",
    report_type: "",
  });

  const [searchCategoryReport, getSearchCategoryReport] = useState({
    search: "",
  });

  function getSearchData() {
    if (
      editFormData.search.length > 1 ||
      (editFormData.class_id !== "" && editFormData.shift !== "")
    ) {
      fetchData();
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editFormData.search.length > 1) {
        fetchData();
      }
    }
  };



  useEffect(() => {
    if (academicSession) {
      const initialChecked = data.map((voucher) => voucher.id);
      setCheckedVouchers(initialChecked);
    }
  }, [data, academicSession, user]);

  const handleCheckboxChange = (id) => {
    setCheckedVouchers((prevState) =>
      prevState.includes(id)
        ? prevState.filter((voucherId) => voucherId !== id)
        : [...prevState, id]
    );
  };

  const handleToggleAll = () => {
    if (allChecked) {
      // Uncheck all
      setCheckedVouchers([]);
    } else {
      // Check all
      const allIds = data.map((voucher) => voucher.id);
      setCheckedVouchers(allIds);
    }
    setAllChecked(!allChecked);
  };

  useEffect(() => {
    if (editFormData.class_id !== "" && editFormData.shift !== "") {
      fetchData();
    }
  }, [editFormData]);

  const fetchData = () => {
    axios
      .get(process.env.REACT_APP_API_BASE_URL+"/student-id-card-generate", {
        params: {
          page: currentPage,
          limit: totalItem,
          search: searchCategoryReport.search,
          campus_id: user.user.campus_id,
          session_id: academicSession,
          class_id: editFormData.class_id,
          section_id: editFormData.section_id,
          shift: editFormData.shift,
        },
      })
      .then((res) => {
        // console.log(res.data.total);
        // console.log(res.data.results);
        setFilteredData(res.data.results);
        setData(res.data.results);
        setLastMonth(res.data.last_month);
        // setTotalPages(Math.ceil(res.data.total) / ITEMS_PER_PAGE);
        // console.log(res.data.totalPayable);

        // dele(res.data.totalArrears);
        // setTotalPayable(res.data.totalPayable);
      })
      .catch((err) => console.log(err));
  };

  const displayData = filteredData;

  

  const viewData = (id_get) => {
    setViewVoucherId([id_get]);
    setShowData(true);
  };

  const handleSubmit = (id_get) => {
    setViewVoucherId(checkedVouchers);
    setShowData(true);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredData(data); // Reset to original data when search is empty
    } else {
      // Filter the data based on the searchQuery across all fields
      const filteredData = data.filter((item) => {
        return Object.keys(item).some((key) => {
          const value = item[key];
          return (
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(query)
          );
        });
      });
      setFilteredData(filteredData);
    }
  };

  useEffect(() => {
    // Fetch fee vouchers when viewVoucherId changes
    const fetchFeeVouchers = async (
      invoices,
      campus_id,
      session_id,
      class_id,
      section_id,
      user_id
    ) => {
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_BASE_URL+"/view-students-id-card",
          {
            invoices,
            campus_id,
            session_id,
            class_id,
            section_id,
            user_id
          }
        );

        let vouchers = response.data.vouchers;
        setVoucherData(vouchers);
      } catch (error) {
        console.error("Error fetching fee vouchers:", error);
        // Handle error states as needed
      }
    };

    if (viewVoucherId && viewVoucherId.length > 0) {
      fetchFeeVouchers(
        viewVoucherId,
        user.user.campus_id,
        academicSession,
        editFormData.class_id,
        editFormData.section_id,
        user.user.user_id,
      );
    }
  }, [viewVoucherId, user.user.campus_id, academicSession]);

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   pageStyle: `
  //           @media print {
            
  //               body { -webkit-print-color-adjust: exact; }
  //               @page { size: portrait !important; margin: 1cm; }
                  
  //    .idcard-container {
  //       page-break-inside: avoid;
  //       break-inside: avoid;
  //   }
  //   .data-grid {
  //       display: grid;
  //       grid-template-columns: 1fr 1fr; /* Adjust columns if needed */
  //   }
  //   /* Force a page break after every certain number of cards */
  //   .data-grid > div:nth-child(6n) {
  //       page-break-after: always;
  //   }
  //           }
  //       `,
  // });
  


  const handlePrint = useReactToPrint({
  content: () => componentRef.current,
  pageStyle: `
    @media print {
      body {
        -webkit-print-color-adjust: exact;
      }

      @page {
        size: A4 portrait !important;
        margin: 5cm;
      }

      .idcard-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
        page-break-inside: avoid;
        break-inside: avoid;
        margin-top: 20px;
      }


      .back_idcard, .front_idcard{
        min-height:435px !important;
        width:330px !important;
       }
      

      table{
        font-size:15px !important;
       }

      /* Force page break after every 3 cards */
      .idcard-container:nth-of-type(3n) {
        page-break-after: always;
      }

      .data-grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
      }

      /* Optional: card sizing consistency */
      .idcard-front, .idcard-back {
        width: 48%;
      }
    }
  `,
});


  return (
    <>
      <div className="id-card-page">
        <div className="id-card-page__inner">
          <div className="card-header text-warning bg-primary p-2 id-card-page__header">
            <div className="id-card-page__title">
              <i className="fas fa-list"></i> Students ID Card Generate
            </div>
          </div>

          <div className="border p-2 id-card-page__body">
            <div className="d-flex flex-wrap gap-2 align-items-center pb-2 id-card-page__action-row">
              <div className="d-flex flex-wrap gap-2 id-card-page__action-buttons">
                <button
                  onClick={handleToggleAll}
                  className="btn btn-warning btn-sm"
                  title={allChecked ? "Uncheck all" : "Check all"}
                >
                  {allChecked ? (
                    <i className="far fa-check-square"></i>
                  ) : (
                    <i className="far fa-square"></i>
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-warning btn-sm"
                >
                  <i className="fa fa-eye" aria-hidden="true"></i> View ID Cards
                </button>
              </div>

              <div className="id-card-page__action-right">
                <div className="id-card-page__filter-field">
                  <Select
                    options={getClasses.map((class_get) => ({
                      value: `${class_get.id},${class_get.section_id}`,
                      label: `${class_get.class} (${class_get.section_name})`,
                    }))}
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
                  />
                </div>

                <div className="id-card-page__filter-field">
                  <select
                    name="shift"
                    value={editFormData.shift}
                    onChange={(e) => {
                      setEditFormData({
                        ...editFormData,
                        shift: e.target.value,
                      });
                      setValidity({ ...validity, shift: true });
                    }}
                    className={
                      validity.shift
                        ? "form-control"
                        : "form-control invalid-input"
                    }
                  >
                    <option value="">Select Shift</option>
                    <option>Morning</option>
                    <option>Evening</option>
                  </select>
                </div>

                <div className="id-card-page__search">
                  <i className="fas fa-search id-card-page__search-icon" aria-hidden="true"></i>
                  <input
                    type="text"
                    className="form-control id-card-page__search-input"
                    placeholder="Search…"
                    onChange={handleSearch}
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive id-card-page__table-wrap">
            <table className="table m-0 id-card-page__table">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Reg#</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-center">View ID Card</th>
                </tr>
              </thead>

              <tbody>
                {displayData.map((voucher, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedVouchers.includes(voucher.id)}
                        onChange={() => handleCheckboxChange(voucher.id)}
                        value={voucher.id}
                      />
                    </td>
                    <td>
                      {voucher.register_no == ""
                        ? voucher.old_register_no
                        : voucher.register_no}
                    </td>
                    <td>{voucher.full_name}</td>
                    <td>{voucher.class}</td>
                    <td>{voucher.section_name}</td>
                    <td>{voucher.category}</td>
                    <td>{voucher.status}</td>
                    <td className="text-center">
                      <div>
                        <a
                          href="#"
                          className={`btn btn-warning btn-sm`}
                          onClick={() => viewData(voucher.id)}
                        >
                          <i className="fas fa-eye"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

          </div>
        </div>
      </div>

      {showData && (
        <>
          <div
            className="id-card-modal__backdrop"
            onClick={() => setShowData(false)}
          ></div>
          <div
            className="id-card-modal"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1100,
              width: "min(1400px, 96vw)",
              maxHeight: "92vh",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
              padding: "0",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header section */}
            <div className="id-card-modal__header">
              <i className="fas fa-id-card"></i>
              <h5>View Students ID Card</h5>
              <button
                className="id-card-modal__close"
                onClick={() => setShowData(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Scrollable content */}
            <div className="id-card-modal__body">
              <div className="id-card-modal__toolbar">
                <button
                  onClick={handlePrint}
                  className="btn btn-warning btn-sm"
                >
                  <i className="fa fa-print" aria-hidden="true"></i> Print
                </button>

                <button
                  onClick={() => setShowBackground((prev) => !prev)}
                  className="btn btn-warning btn-sm"
                >
                  <i className="fa fa-eye" aria-hidden="true"></i>
                  {showBackground ? " View ID Card" : " View Background"}
                </button>
              </div>

              <div
                    className="id-card-modal__cards-grid"
                    ref={componentRef}
                    // style={{
                    //     display: "grid",
                    //     gridTemplateColumns: "repeat(2, 1fr)", // 3 columns
                    //     gridTemplateRows: "repeat(2, auto)", // 2 rows
                    //     gap: "5px", // Space between cards
                    //     width: "1004px", // A4 width in pixels at 96 DPI
                    //     height: "1123px", // A4 height in pixels at 96 DPI
                    //     padding: "20px", // Padding around the grid
                    //     margin: "auto",
                    // }}
                    >
                    {voucherData.map((voucher, index) => (
                        <IdCard key={index} data={voucher} showBackground={showBackground} />
                    ))}
                    </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}

// const IdCard = ({ data, showBackground  }) => {
//   const {
//     register_no,
//     old_register_no,
//     full_name,
//     father_name,
//     class_name,
//     section_name,
//     category,
//     current_address,
//     guardian_mobile_no,
//     campus_name,
//     student_image,
//     blood_group,
//     bus_route,
//     dob
//   } = data;

//   function convertDates(date) {
//     const d = new Date(date);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = (d.getMonth() + 1).toString().padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//     const year = today.getFullYear();

//     const formattedDate = `${day}-${month}-${year}`;
//     return formattedDate;
//   }

//   const renderStudentCards = (title) => (
  
//     <div
//       style={{
//         // border: "1px solid #ccc",
//         // padding: "10px",
//         // borderRadius: "8px",
//         // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         // display: "flex",
//         // flexDirection: "column",
//         // alignItems: "center",
//         // width:"390px",
//         // minHeight:"500px",
//       }}
//     >


//       <div
//       className="idcard-container"
//   style={{
//     display: "flex",
//     gap: "15px",
//     justifyContent: "center",
//     alignItems: "flex-start",
//     flexWrap: "wrap", // allows wrapping when printing many
//      marginTop: "20px"
//   }}
// >
//   {/* ---------- FRONT SIDE ---------- */}
//   <div  className="front_idcard"
//     style={{
//       border: "1px solid #ccc",
//       padding: "6px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       // display: "flex",
//       // flexDirection: "column",
//       // alignItems: "center",
//       width: "380px",
//       minHeight: "500px",
//       background: "#fff",
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         width: "100%",
//       }}
//     >
//       <img
//         src={`${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png`}
//         alt="Nasheman Logo"
//         style={{
//           width: "80px",
//           height: "80px",
//           objectFit: "contain",
//           marginRight: "20px",
//         }}
//       />
//       <div style={{ flex: 1 }}>
//         <h6 style={{ margin: 0, fontWeight: "600", color: "#000" }}>
//           Nasheman School/College
//         </h6>
//         {/* <h6 style={{ margin: "2px 0 0 0", fontWeight: "400", color: "#333" }}>
//           for Special Education & Rehabilitation Center
//         </h6> */}
//         <h6 style={{ margin: "2px 0 0 0", fontWeight: "bolder", color: "#333" }}>
//          <i className="fas fa-mobile-alt"></i>  051-905525240
//         </h6>
//       </div>
//     </div>

//     <div style={{ textAlign: "center" }}>


//        {/* Student Photo */}
//       <div style={{ 
//         // marginTop: "3px", 
//         marginBottom: "3px",
//         display: "flex",
//         justifyContent: "center"
//       }}>
//         <div
//           // src={student_image || `${process.env.REACT_APP_BASE_URL}/uploads/${student_image}`}
//           // alt="Student Photo"
//           style={{
//             width: "118px",
//             height: "118px",
//             objectFit: "cover",
//             borderRadius: "8px",
//             border: "2px solid #333",
//           }}
//         />
//       </div>

      
//       <h5 style={{ borderBottom:"1px solid black", paddingBottom:"2px", paddingTop:"2px", fontWeight:"bolder"}}>{full_name}</h5>
//       <table style={{ width: "100%", textAlign: "left", marginTop: "10px", fontSize:"15px" }}>
//         <tbody>
//           {/* <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black", width:"100px" }}>
//               <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
//               Name#:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {full_name}
//             </td>
//           </tr> */}
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black", width:"100px" }}>
//               <i className="fas fa-id-card" style={{ marginRight: "8px" }}></i>
//               Reg#:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {register_no || old_register_no}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-book" style={{ marginRight: "8px" }}></i>
//               Class:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {`${class_name} (${section_name})`}
//             </td>
//           </tr>
//           {/* <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i
//                 className="fas fa-birthday-cake"
//                 style={{ marginRight: "8px" }}
//               ></i>
//               DOB:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {convertDates(dob)}
//             </td>
//           </tr> */}
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
//               Father:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {father_name}
//             </td>
//           </tr>
//           {/* <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-tint" style={{ marginRight: "8px" }}></i>
//               Blood.G:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {blood_group}
//             </td>
//           </tr> */}
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i
//                 className="fas fa-map-marker"
//                 style={{ marginRight: "8px" }}
//               ></i>Address:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               {current_address}
//             </td>
//           </tr>
//           <tr>
//             <th style={{padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>Mobile#:
//             </th>
//             <td style={{padding: "2px", borderBottom: "1px solid black" }}>
//               {guardian_mobile_no}
//             </td>
//           </tr>
//           <tr>
//             <th style={{ padding: "2px", borderBottom: "1px solid black" }}>
//               <i className="fas fa-bus" style={{ marginRight: "8px" }}></i>
//               Route:
//             </th>
//             <td style={{ padding: "2px", borderBottom: "1px solid black" }}>{bus_route}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </div>

//   {/* ---------- BACK SIDE ---------- */}
//   <div className="back_idcard"
//     style={{
//       border: "1px solid #ccc",
//       padding: "10px",
//       borderRadius: "8px",
//       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       width: "380px",
//       minHeight: "500px",
//       position: "relative",
//       background: "#fff",
//     }}
//   >
//     <div
//       style={{
//         backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png)`,
//         backgroundSize: "220px 220px",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         opacity: 0.1,
//         zIndex: 0,
//       }}
//     ></div>

//     <div
//       style={{
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         position: "relative",
//         zIndex: 1,
//       }}
//     >
//       <h4 style={{ textAlign: "center" }}>Terms and Conditions</h4>
//       <ul style={{ textAlign: "left" }}>
//         <li>Keep your card in your custody carefully.</li>
//         <li>Display your card at all times while on school premises.</li>
//         <li>This card is <strong>non-transferable</strong>.</li>
//         <li>
//           This is a <strong>software-generated card</strong> and does not require a
//           signature or stamp.
//         </li>
//         <li>
//           <strong>Expiry Date:</strong> __________
//         </li>
//       </ul>
//       <p style={{ textAlign: "center", color: "red" }}>
//         <strong>IF FOUND, PLEASE RETURN</strong>
//       </p>
//       <p style={{ textAlign: "center" }}>
//         Visit <a href="https://sses.org.pk/website/" target="_blank">SSEI's Website</a>
//       </p>
//       <p style={{ textAlign: "center" }}>https://sses.org.pk/website</p>
//     </div>
//   </div>
// </div>
// </div>

//   );

//   return (
//     <div>
//       {renderStudentCards("Student Id Card")}
//     </div>
//   );
// };



const IdCard = ({ data }) => {
  const {
    register_no,
    old_register_no,
    full_name,
    father_name,
    class_name,
    section_name,
    current_address,
    guardian_mobile_no,
    bus_route,
  } = data;

  // ---------- Utility Functions ----------
  function convertDates(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const renderCorners = () => {
    const baseStyle = {
      position: "absolute",
      width: "25px",
      height: "25px",
      borderColor: "#000",
      borderStyle: "solid",
    };
    const corners = {
      tl: { ...baseStyle, top: 0, left: 0, borderWidth: "4px 0 0 4px" },
      tr: { ...baseStyle, top: 0, right: 0, borderWidth: "4px 4px 0 0" },
      bl: { ...baseStyle, bottom: 0, left: 0, borderWidth: "0 0 4px 4px" },
      br: { ...baseStyle, bottom: 0, right: 0, borderWidth: "0 4px 4px 0" },
    };
    return Object.entries(corners).map(([key, style]) => (
      <div key={key} style={style}></div>
    ));
  };

  const renderStudentCards = () => (
    <div
      className="idcard-container"
      style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
        marginTop: "20px",
      }}
    >
      {/* ---------- FRONT SIDE ---------- */}
      <div
        className="front_idcard"
        style={{
          position: "relative",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "380px",
          minHeight: "450px",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {renderCorners()}
        
        <div style={{border:"10px solid black", padding:"7px"}}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src={`${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png`}
            alt="Nasheman Logo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              marginRight: "20px",
            }}
          />
          <div style={{ flex: 1 }}>
            <h6 style={{ margin: 0, fontWeight: "600", color: "#000" }}>
              Nasheman School/College
            </h6>
            <h6
              style={{
                margin: "2px 0 0 0",
                fontWeight: "bolder",
                color: "#333",
              }}
            >
              <i className="fas fa-mobile-alt"></i> 051-905525240
            </h6>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          {/* Student Photo Placeholder */}
          <div
            style={{
              marginBottom: "3px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "118px",
                height: "118px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "2px solid #333",
              }}
            ></div>
          </div>

          <h5
            style={{
              borderBottom: "1px solid black",
              paddingBottom: "2px",
              paddingTop: "2px",
              fontWeight: "bolder",
            }}
          >
            {full_name}
          </h5>

          <table
            style={{
              width: "100%",
              textAlign: "left",
              marginTop: "10px",
              fontSize: "15px",
            }}
          >
            <tbody>
              <tr>
                <th style={{ padding: "2px", borderBottom: "1px solid black", width:"110px" }}>
                  <i className="fas fa-book" style={{ marginRight: "8px" }}></i>
                  Class:
                </th>
                <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
                  {`${class_name}`}
                  {/* (${section_name}) */}
                </td>
              </tr>
              <tr>
                <th style={{ padding: "2px", borderBottom: "1px solid black", width:"110px" }}>
                  <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
                  Father:
                </th>
                <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
                  {father_name}
                </td>
              </tr>
              <tr>
                <th style={{ padding: "2px", borderBottom: "1px solid black", width:"110px" }}>
                  <i
                    className="fas fa-map-marker"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Address:
                </th>
                <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
                  {current_address}
                </td>
              </tr>
              <tr>
                <th style={{ padding: "2px", borderBottom: "1px solid black", width:"110px" }}>
                  <i className="fas fa-phone" style={{ marginRight: "8px" }}></i>Mobile#:
                </th>
                <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
                  {guardian_mobile_no}
                </td>
              </tr>
              <tr>
                <th style={{ padding: "2px", borderBottom: "1px solid black", width:"110px" }}>
                  <i className="fas fa-bus" style={{ marginRight: "8px" }}></i>
                  Route:
                </th>
                <td style={{ padding: "2px", borderBottom: "1px solid black" }}>
                  {bus_route}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
      {/* ---------- BACK SIDE ---------- */}
      <div
        className="back_idcard"
        style={{
          position: "relative",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "380px",
          minHeight: "450px",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        {/* {renderCorners()} */}

        <div
          style={{
            backgroundImage: `url(${process.env.REACT_APP_BASE_URL}/uploads/nasheman_logo.png)`,
            backgroundSize: "220px 220px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            zIndex: 0,
          }}
        ></div>

        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
           <h4
                  style={{
                    padding: "2px",
                    borderBottom: "1px solid black",
                    textAlign:"center"
                  }}
                >
                  <i className="fas fa-id-card" style={{ marginRight: "8px" }}></i>
                  Reg#:  {register_no || old_register_no}
                </h4>
          <h4 style={{ textAlign: "center" }}>Terms and Conditions</h4>
          <ul style={{ textAlign: "left" }}>
            <li>Keep your card in your custody carefully.</li>
            <li>Display your card at all times while on school premises.</li>
            <li>This card is <strong>non-transferable</strong>.</li>
            <li>
              This is a <strong>software-generated card</strong> and does not
              require a signature or stamp.
            </li>
            <li>
              <strong>Expiry Date:</strong> __________
            </li>
          </ul>
          <p style={{ textAlign: "center", color: "red" }}>
            <strong>IF FOUND, PLEASE RETURN</strong>
          </p>
          <p style={{ textAlign: "center" }}>
            Visit{" "}
            <a href="https://sses.org.pk/website/" target="_blank">
              SSEI's Website
            </a>
          </p>
          <p style={{ textAlign: "center" }}>https://sses.org.pk/website</p>
        </div>
      </div>
    </div>
  );

  return <div>{renderStudentCards()}</div>;
};


export default StudentIdCardGenerate;






