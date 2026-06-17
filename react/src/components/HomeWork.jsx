// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
//   useMemo,
// } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { useDropzone } from "react-dropzone";
// import { useAuth } from "./AuthContext";
// import AcademicSessionContext from "./AcademicSessionContext";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useLocation } from "react-router-dom";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import ReactPaginate from "react-paginate";

// function HomeWork({ admissionData = [] }) {
//   const [getClassOptions, setClassOptions] = useState([]);
//   const [filePreview, setFilePreview] = useState(null);
//   const [fileName, setFileName] = useState("");

//   const [showData, setShowData] = useState("");

//   const { user } = useAuth();
//   const { academicSession } = useContext(AcademicSessionContext);
//   const location = useLocation();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [totalPages, totalPagesGet] = useState("");
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentFileUrl, setCurrentFileUrl] = useState("");
//   const [totalItem, setTotalItemGet] = useState(10);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const initialState = {
//     hidden_id: "",
//     admission_id: "",
//     home_work_date: "",
//     description: "",
//     search_date: "",
//     assign_subject_teacher_id: "",
//     session_id: academicSession,
//     campus_id: user.user.campus_id,
//     user_id: user.user.user_id,
//     homework_file: null,
//     current_file: "", // To keep track of existing file
//     class_id:"",
//     section_id:"",
//     shift:"",
//   };

//   const [editFormData, setEditFormData] = useState(initialState);

//   // Process admission data to create class options
//   useEffect(() => {
//     console.log(admissionData);
//     if (admissionData && admissionData.length > 0) {
//       const options = admissionData.map((item) => ({
//         value: item.id,
//         label: `${item.class_name} (${item.section_name}) - ${item.subjects} (${item.shift})`,
//         shift: item.shift,
//         subjects: item.subjects,
//         class_name: item.class_name,
//         section_name: item.section_name,
//         class_id: item.class_id,
//         section_id: item.section_id,
//         shift: item.shift
//       }));
//       setClassOptions(options);
//     }
//   }, [admissionData]);

//   // Quill editor modules configuration
//   const modules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, 3, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["link"],
//         ["clean"],
//       ],
//     }),
//     []
//   );

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "list",
//     "bullet",
//     "link",
//     "image",
//   ];

//   useEffect(() => {
//     if (academicSession) {
//       setEditFormData((prevFormData) => ({
//         ...prevFormData,
//         session_id: parseInt(academicSession),
//       }));
//     }
//   }, [academicSession]);

//   useEffect(() => {
//     fetchData();
//   }, [editFormData.search_date, currentPage, totalItem]);

//   const onDrop = useCallback(
//     (acceptedFiles, rejectedFiles) => {
//       if (rejectedFiles && rejectedFiles.length > 0) {
//         toast.error("Only .docx files are allowed");
//         return;
//       }

//       const file = acceptedFiles[0];
//       setFileName(file.name);
//       setEditFormData({ ...editFormData, homework_file: file });

//       if (file.type === "text/plain") {
//         const reader = new FileReader();
//         reader.onload = () => {
//           setFilePreview(reader.result);
//         };
//         reader.readAsText(file);
//       } else {
//         setFilePreview(null);
//       }
//     },
//     [editFormData]
//   );

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//         [".docx"]
//     },
//     maxFiles: 1,
//   });

//   const [validity, setValidity] = useState({
//     home_work_date: true,
//     description: true,
//     admission_id: true,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData({ ...editFormData, [name]: value });
//     setValidity({ ...validity, [name]: true });
//   };

//   const handleClassChange = (selectedOption) => {
//     setEditFormData({
//       ...editFormData,
//       admission_id: selectedOption.value,
//       class_id: selectedOption.class_id,
//       section_id: selectedOption.section_id,
//       shift: selectedOption.shift,
//     });
//     setValidity({ ...validity, admission_id: true });
//   };

//   const handleDescriptionChange = (value) => {
//     setEditFormData({ ...editFormData, description: value });
//     setValidity({ ...validity, description: true });
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const newValidity = { ...validity };

//     if (!editFormData.home_work_date.trim()) {
//       newValidity.home_work_date = false;
//       isValid = false;
//     }

//     if (
//       !editFormData.description ||
//       editFormData.description.trim() === "<p><br></p>"
//     ) {
//       newValidity.description = false;
//       isValid = false;
//     }

//     if (!editFormData.admission_id) {
//       newValidity.admission_id = false;
//       isValid = false;
//     }

//     // File is only required when creating new homework
//     // if (!isEditMode && !editFormData.homework_file) {
//     //   newValidity.homework_file = false;
//     //   isValid = false;
//     // }

//     setValidity(newValidity);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       const formData = new FormData();

//       for (const key in editFormData) {
//         // if (key !== "current_file") {
//         formData.append(key, editFormData[key]);
//       }

//       try {
//         const url = isEditMode
//           ? process.env.REACT_APP_API_BASE_URL +
//             `/update-homework/${editFormData.hidden_id}`
//           : process.env.REACT_APP_API_BASE_URL + "/insert-homework";

//         const method = isEditMode ? "put" : "post";

//         const response = await axios[method](url, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         if (response.data.error) {
//           toast.error(response.data.error);
//         } else {
//           toast.success(
//             `Homework ${isEditMode ? "updated" : "submitted"} successfully!`
//           );
//           resetForm();
//           fetchData();
//         }
//       } catch (error) {
//         console.error(
//           `Error ${isEditMode ? "updating" : "submitting"} homework:`,
//           error
//         );
//         toast.error(
//           `Failed to ${
//             isEditMode ? "update" : "submit"
//           } homework. Please try again.`
//         );
//       }
//     } else {
//       toast.error("Please fill all required fields correctly");
//     }
//   };

//   const resetForm = () => {
//     setEditFormData({
//       ...initialState,
//       session_id: academicSession,
//       campus_id: user.user.campus_id,
//       user_id: user.user.user_id,
//     });
//     setFilePreview(null);
//     setFileName("");
//     setCurrentFileUrl("");
//     setIsEditMode(false);
//   };

//   const fetchData = () => {
//     axios
//       .get(process.env.REACT_APP_API_BASE_URL + "/homework-list", {
//         params: {
//           page: currentPage,
//           limit: totalItem,
//           search: searchCategoryReport.search,
//           campus_id: user.user.campus_id,
//           session_id: academicSession,
//           search_date: editFormData.search_date,
//         },
//       })
//       .then((res) => {
//         setData(res.data.data);
//         setTotalCount(0);
//         totalPagesGet(res.data.totalPages);
//         setLoading(false);
//       })
//       .catch((err) => console.log(err));
//   };

//   const [searchCategoryReport, getSearchCategoryReport] = useState({
//     search: "",
//   });

//   const handlePageChange = ({ selected }) => {
//     setCurrentPage(selected + 1);
//   };

//   const handleTotalItemChange = (event) => {
//     const newValue = event.target.value;
//     setTotalItemGet(newValue);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       getSearchCategoryReport(searchCategoryReport);
//       fetchData();
//     }
//   };

//   function searchCategory() {
//     fetchData();
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

//   function handleDelete(id) {
//     const confirmDeletion = window.confirm("Deleted! Are you sure?");

//     if (confirmDeletion) {
//       axios
//         .delete(
//           process.env.REACT_APP_API_BASE_URL +
//             `/delete-homework/${id}/${academicSession}/${user.user.campus_id}`
//         )
//         .then((response) => {
//           setData((prevData) => prevData.filter((data) => data.id !== id));
//           toast.error("Homework deleted successfully");
//         })
//         .catch((error) => {
//           console.error("Error deleting homework:", error);
//         });
//     }
//   }

//   const editHomeWork = (id) => {
//     axios
//       .get(
//         process.env.REACT_APP_API_BASE_URL +
//           `/get-homework/${id}/${user.user.campus_id}/${academicSession}`
//       )
//       .then((response) => {
//         const homework = response.data.results[0];
//         setEditFormData({
//           hidden_id: homework.id,
//           admission_id: homework.assing_subjects_class_teacher_id,
//           home_work_date: formatDate(homework.home_work_date),
//           description: homework.description,
//           session_id: academicSession,
//           campus_id: user.user.campus_id,
//           user_id: user.user.user_id,
//           current_file: homework.homework_file,
//           class_id: homework.class_id,
//           section_id: homework.section_id,
//           shift: homework.shift,
//         });
//         setCurrentFileUrl(
//           `${process.env.REACT_APP_API_BASE_URL}/${homework.homework_file}`
//         );
//         setIsEditMode(true);
//         setFileName(homework.homework_file.split("/").pop());
//         setShowData("");
//       })
//       .catch((error) => {
//         console.error("Error fetching homework:", error);
//       });
//   };

//   const cancelEdit = () => {
//     resetForm();
//   };

//   function handleView() {
//     setShowData("view_home_work_list");
//   }

//   const handleHide = () => {
//     setShowData("");
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-center">
//         <div className="col-md-8 p-2 mx-auto">
//           <div className="d-flex justify-content-end pb-2">
//             <button className="btn btn-sm btn-warning" onClick={handleView}>
//               <i className="fas fa-eye"></i> View Home Work List
//             </button>
//           </div>
//           <h5 className="text-warning bg-primary p-2 card-header border">
//             <i className="fas fa-receipt"></i>

//             {isEditMode ? "Update Homework" : "Homework Submission"}
//           </h5>

//           <form className="border p-3" onSubmit={handleSubmit}>
//             <input
//               type="hidden"
//               name="hidden_id"
//               value={editFormData.hidden_id}
//             />
//             <input
//               type="hidden"
//               name="current_file"
//               value={editFormData.current_file}
//             />

//             <div className="form-group row mb-3">
//               <div className="col-md-6">
//                 <label className="col-form-label">Date*</label>
//                 <input
//                   type="date"
//                   className={
//                     validity.home_work_date
//                       ? "form-control"
//                       : "form-control is-invalid"
//                   }
//                   id="home_work_date"
//                   name="home_work_date"
//                   value={editFormData.home_work_date}
//                   onChange={handleChange}
//                   required
//                 />
//                 {!validity.home_work_date && (
//                   <div className="invalid-feedback">Please select a date</div>
//                 )}
//               </div>

//               <div className="col-md-6">
//                 <label className="col-form-label">Class*</label>
//                 <Select
//                   options={getClassOptions}
//                   value={
//                     editFormData.admission_id
//                       ? getClassOptions.find(
//                           (opt) => opt.value === editFormData.admission_id
//                         )
//                       : null
//                   }
//                   onChange={handleClassChange}
//                   placeholder="Select Class (Section) - Subject (Shift)"
//                   required
//                   className={!validity.admission_id ? "is-invalid" : ""}
//                 />
//                 {!validity.admission_id && (
//                   <div className="text-danger small">Please select a class</div>
//                 )}
//               </div>
//             </div>

//             <div className="form-group row mb-3">
//               <div className="col-md-12">
//                 <label className="col-form-label">Description*</label>
//                 <ReactQuill
//                   theme="snow"
//                   value={editFormData.description}
//                   onChange={handleDescriptionChange}
//                   modules={modules}
//                   formats={formats}
//                   className={!validity.description ? "ql-invalid" : ""}
//                   placeholder="Enter homework details..."
//                 />
//                 {!validity.description && (
//                   <div className="text-danger small">
//                     Please enter a description
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="form-group row mb-3">
//               <div className="col-md-12">
//                 <label className="col-form-label">
//                   {isEditMode ? "Update Homework File" : "Homework File*"}{" "}
//                   (.docx or .txt only)
//                 </label>
//                 <div
//                   {...getRootProps({ className: "dropzone" })}
//                   className={`border p-3 text-center`}
//                 >
//                   <input {...getInputProps()} />
//                   {filePreview ? (
//                     <div>
//                       <p>File selected: {fileName}</p>
//                       {filePreview && (
//                         <div className="mt-2 p-2 bg-light">
//                           <pre>{filePreview}</pre>
//                         </div>
//                       )}
//                     </div>
//                   ) : fileName ? (
//                     <div>
//                       <p>Current file: {fileName}</p>
//                     </div>
//                   ) : (
//                     <p>
//                       Drag & drop a .docx or .txt file here, or click to select
//                     </p>
//                   )}
//                 </div>
//                 {isEditMode && (
//                   <div className="text-muted small mt-1">
//                     Leave empty to keep current file
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="form-group row mt-4">
//               <div className="col-md-12 text-end">
//                 {isEditMode && (
//                   <button
//                     type="button"
//                     className="btn btn-secondary px-4 me-2 mr-2"
//                     onClick={cancelEdit}
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button type="submit" className="btn btn-primary px-4">
//                   {isEditMode ? "Update Homework" : "Submit Homework"}
//                 </button>
//               </div>
//             </div>
//           </form>
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
//             Home Work List
//           </div>

//           <div className="col-md-12 p-2 mx-auto">
//             <div className="card-header text-warning bg-primary p-2">
//               <div className="d-flex justify-content-between align-items-center">
//                 {" "}
//                 <div>
//                   <i className="fas fa-list"></i> Home Work List{" "}
//                 </div>
//                 {/* search category */}
//                 <div className="d-flex">
//                   <div className="me-2 mr-2">
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

//                   <div className="me-2 mr-2">
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
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={searchCategory}
//                   >
//                     Search
//                   </button>
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

//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Class</th>
//                     <th>Subject</th>
//                     <th>Shift</th>
//                     <th>Descrip.</th>
//                     <th>Download.File</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan="4">Loading...</td>
//                     </tr>
//                   ) : (
//                     data.map((subhead, index) => (
//                       <tr key={index}>
//                         {/* <td>{bank_detail.id}</td> */}
//                         <td>{subhead.home_work_date}</td>
//                         <td>
//                           {subhead.class_name +
//                             "(" +
//                             subhead.section_name +
//                             ")"}
//                         </td>
//                         <td>{subhead.subjects}</td>
//                         <td>{subhead.shift}</td>

//                         <td
//                           dangerouslySetInnerHTML={{
//                             __html: subhead.description,
//                           }}
//                         ></td>
//                         <td>
//                           {subhead.homework_file ? (
//                             <a
//                               href={`${process.env.REACT_APP_API_BASE_URL}/uploads/${subhead.homework_file}`}
//                               rel="noopener noreferrer"
//                               className="btn btn-sm btn-success"
//                               download
//                               title={`Download ${subhead.homework_file
//                                 .split("/")
//                                 .pop()}`}
//                             >
//                               <i className="fas fa-download"></i>{" "}
//                               {subhead.homework_file.split("/").pop()}
//                             </a>
//                           ) : (
//                             <span className="text-muted">No file</span>
//                           )}
//                         </td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-primary "
//                             onClick={() => editHomeWork(subhead.id)}
//                           >
//                             <i className="fas fa-edit"></i>
//                           </button>

//                           <button
//                             className="btn btn-sm btn-danger ml-2"
//                             onClick={() => handleDelete(subhead.id)}
//                           >
//                             <i className="fas fa-trash-alt"></i>
//                           </button>
//                         </td>
//                       </tr>
//                     ))
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
//     </div>
//   );
// }

// export default HomeWork;




import React, { useCallback, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useAuth } from "./AuthContext";
import AcademicSessionContext from "./AcademicSessionContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactPaginate from "react-paginate";

function HomeWork({ admissionData = [] }) {
  const [getClassOptions, setClassOptions] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showData, setShowData] = useState("");
  const { user } = useAuth();
  const { academicSession } = useContext(AcademicSessionContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [totalItem, setTotalItem] = useState(10);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    },
    mainCard: {
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #111418 0%, #1a1f25 100%)',
      color: '#EBD197',
      padding: '14px 18px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #EBD197'
    },
    headerTitle: {
      margin: 0,
      fontSize: '16px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      letterSpacing: '0.2px'
    },
    button: {
      backgroundColor: '#EBD197',
      color: '#1f2329',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    buttonDanger: {
      backgroundColor: '#dc3545',
      color: '#fff'
    },
    buttonSuccess: {
      backgroundColor: '#28a745',
      color: '#fff'
    },
    buttonPrimary: {
      backgroundColor: '#007bff',
      color: '#fff'
    },
    buttonSecondary: {
      backgroundColor: '#6c757d',
      color: '#fff'
    },
    formContainer: {
      padding: '20px'
    },
    formRow: {
      // display: 'flex',
      // gap: '15px',
      // marginBottom: '20px'
    },
    formGroup: {
      flex: 1,
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#333',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    inputInvalid: {
      borderColor: '#dc3545'
    },
    errorText: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px'
    },
    dropzone: {
      border: '2px dashed #ddd',
      borderRadius: '4px',
      padding: '30px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#fafafa'
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
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      width: '95%',
      maxWidth: '1400px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column'
    },
    modalHeader: {
      backgroundColor: '#2c3e50',
      color: '#ffc107',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
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
      padding: '0',
      width: '30px',
      height: '30px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      marginTop: '20px'
    },
    th: {
      backgroundColor: '#2c3e50',
      color: '#ffc107',
      padding: '12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '14px',
      borderRight: '1px solid #444'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      verticalAlign: 'top'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    searchContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '20px'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    iconButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const initialState = {
    hidden_id: "",
    admission_id: "",
    home_work_date: "",
    description: "",
    search_date: "",
    assign_subject_teacher_id: "",
    session_id: academicSession,
    campus_id: user.user.campus_id,
    user_id: user.user.student_unique_id,
    homework_file: null,
    current_file: "",
    class_id: "",
    section_id: "",
    shift: "",
  };

  const [editFormData, setEditFormData] = useState(initialState);
  const [searchCategoryReport, setSearchCategoryReport] = useState({ search: "" });

  const [validity, setValidity] = useState({
    home_work_date: true,
    description: true,
    admission_id: true,
  });

  // useEffect(() => {
  //   if (admissionData && admissionData.length > 0) {
  //     const options = admissionData.map((item) => ({
  //       value: item.subject_id,
  //       id: item.id,  // ✅ Keep it as 'id' to match the API response
  //       label: `${item.class_name} (${item.section_name}) - ${item.subjects} (${item.shift})`,
  //       shift: item.shift,
  //       subjects: item.subjects,
  //       class_name: item.class_name,
  //       section_name: item.section_name,
  //       class_id: item.class_id,
  //       section_id: item.section_id,
  //     }));
  //     setClassOptions(options);
  //   }
  // }, [admissionData]);


  useEffect(() => {
  if (admissionData && admissionData.length > 0) {
    const options = admissionData.map((item) => ({
      value: `${item.subject_id}-${item.class_id}-${item.section_id}-${item.shift}`, // ✅ Composite unique value
      id: item.id,
      subject_id: item.subject_id,
      class_id: item.class_id,
      section_id: item.section_id,
      shift: item.shift,
      subjects: item.subjects,
      class_name: item.class_name,
      section_name: item.section_name,
      label: `${item.class_name} (${item.section_name}) - ${item.subjects} (${item.shift})`,
    }));
    setClassOptions(options);
  }
}, [admissionData]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  useEffect(() => {
    if (academicSession) {
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        session_id: parseInt(academicSession),
      }));
    }
  }, [academicSession]);

  useEffect(() => {
    fetchData();
  }, [editFormData.search_date, currentPage, totalItem]);

  // const onDrop = useCallback(
  //   (acceptedFiles, rejectedFiles) => {
  //     if (rejectedFiles && rejectedFiles.length > 0) {
  //       toast.error("Only .docx files are allowed");
  //       return;
  //     }

  //     const file = acceptedFiles[0];
  //     setFileName(file.name);
  //     setEditFormData({ ...editFormData, homework_file: file });

  //     if (file.type === "text/plain") {
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         setFilePreview(reader.result);
  //       };
  //       reader.readAsText(file);
  //     } else {
  //       setFilePreview(null);
  //     }
  //   },
  //   [editFormData]
  // );


  const onDrop = useCallback(
  (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast.error("File size must be less than 10MB");
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        toast.error("Invalid file type. Allowed: Images, PDF, Word, Excel, PowerPoint");
      } else {
        toast.error("File upload failed");
      }
      return;
    }

    const file = acceptedFiles[0];
    
    // Double-check file size (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }



    

    setFileName(file.name);
    setEditFormData({ ...editFormData, homework_file: file });

    // Preview for text files
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsText(file);
    } 
    // Preview for images
    else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } 
    else {
      setFilePreview(null);
    }
  },
  [editFormData]
);


  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
  //   },
  //   maxFiles: 1,
  // });


  const { getRootProps, getInputProps } = useDropzone({
  onDrop,
  accept: {
    // Images
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
    'image/bmp': ['.bmp'],
    // Documents
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    // Excel
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    // PowerPoint (optional, but commonly needed)
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    // Text
    'text/plain': ['.txt']
  },
  maxFiles: 1,
  maxSize: 10 * 1024 * 1024, // 10MB in bytes
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
    setValidity({ ...validity, [name]: true });
  };

  // const handleClassChange = (selectedOption) => {
  //   setEditFormData({
  //     ...editFormData,
  //      admission_id: selectedOption.value,
  //   assign_subject_teacher_id: selectedOption.id,  // ✅ This will now work
  //     class_id: selectedOption.class_id,
  //     section_id: selectedOption.section_id,
  //     shift: selectedOption.shift,
  //   });
  //   setValidity({ ...validity, admission_id: true });
  // };

  const handleClassChange = (selectedOption) => {
  setEditFormData({
    ...editFormData,
    admission_id: selectedOption.subject_id,
    assign_subject_teacher_id: selectedOption.id,
    class_id: selectedOption.class_id,
    section_id: selectedOption.section_id,
    shift: selectedOption.shift
  });
  setValidity({ ...validity, admission_id: true });
};
  const handleDescriptionChange = (value) => {
    setEditFormData({ ...editFormData, description: value });
    setValidity({ ...validity, description: true });
  };

  const validateForm = () => {
    let isValid = true;
    const newValidity = { ...validity };

    if (!editFormData.home_work_date.trim()) {
      newValidity.home_work_date = false;
      isValid = false;
    }

    if (!editFormData.description || editFormData.description.trim() === "<p><br></p>") {
      newValidity.description = false;
      isValid = false;
    }

    if (!editFormData.admission_id) {
      newValidity.admission_id = false;
      isValid = false;
    }

    setValidity(newValidity);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();

      for (const key in editFormData) {
        formData.append(key, editFormData[key]);
      }

      try {
        const url = isEditMode
          ? process.env.REACT_APP_API_BASE_URL + `/update-homework/${editFormData.hidden_id}`
          : process.env.REACT_APP_API_BASE_URL + "/insert-homework";

        const method = isEditMode ? "put" : "post";

        const response = await axios[method](url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.success(`Homework ${isEditMode ? "updated" : "submitted"} successfully!`);
          resetForm();
          fetchData();
        }
      } catch (error) {
        console.error(`Error ${isEditMode ? "updating" : "submitting"} homework:`, error);
        toast.error(`Failed to ${isEditMode ? "update" : "submit"} homework. Please try again.`);
      }
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const resetForm = () => {
    setEditFormData({
      ...initialState,
      session_id: academicSession,
      campus_id: user.user.campus_id,
      user_id: user.user.student_unique_id,
    });
    setFilePreview(null);
    setFileName("");
    setCurrentFileUrl("");
    setIsEditMode(false);
  };

  // const fetchData = () => {
  //   axios
  //     .get(process.env.REACT_APP_API_BASE_URL + "/homework-list", {
  //       params: {
  //         page: currentPage,
  //         limit: totalItem,
  //         search: searchCategoryReport.search,
  //         campus_id: user.user.campus_id,
  //         session_id: academicSession,
  //         search_date: editFormData.search_date,
  //       },
  //     })
  //     .then((res) => {
  //       setData(res.data.data);
  //       setTotalPages(res.data.totalPages);
  //       setLoading(false);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const fetchData = () => {
  // If teacher has no assignments, don't fetch
  if (!admissionData || admissionData.length === 0) {
    setData([]);
    setTotalPages(0);
    setLoading(false);
    return;
  }

  axios
    .get(process.env.REACT_APP_API_BASE_URL + "/homework-list", {
      params: {
        page: currentPage,
        limit: totalItem,
        search: searchCategoryReport.search,
        campus_id: user.user.campus_id,
        session_id: academicSession,
        search_date: editFormData.search_date,
        teacher_assignments: JSON.stringify(admissionData), // ✅ Send entire array as JSON
      },
    })
    .then((res) => {
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
};

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const handleTotalItemChange = (event) => {
    setTotalItem(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  function searchCategory() {
    fetchData();
  }

  function handleDelete(id) {
    const confirmDeletion = window.confirm("Deleted! Are you sure?");

    if (confirmDeletion) {
      axios
        .delete(
          process.env.REACT_APP_API_BASE_URL +
            `/delete-homework/${id}/${academicSession}/${user.user.campus_id}`
        )
        .then(() => {
          setData((prevData) => prevData.filter((data) => data.id !== id));
          toast.error("Homework deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting homework:", error);
        });
    }
  }

  // const editHomeWork = (id) => {
  //   axios
  //     .get(
  //       process.env.REACT_APP_API_BASE_URL +
  //         `/get-homework/${id}/${user.user.campus_id}/${academicSession}`
  //     )
  //     .then((response) => {
  //       const homework = response.data.results[0];
  //       setEditFormData({
  //         hidden_id: homework.id,
  //         admission_id: homework.assing_subjects_class_teacher_id,
  //         subject_id: homework.assign_subject_id,
  //         home_work_date: formatDate(homework.home_work_date),
  //         description: homework.description,
  //         session_id: academicSession,
  //         campus_id: user.user.campus_id,
  //         user_id: user.user.user_id,
  //         current_file: homework.homework_file,
  //         class_id: homework.class_id,
  //         section_id: homework.section_id,
  //         shift: homework.shift,
  //       });
  //       setCurrentFileUrl(
  //         `${process.env.REACT_APP_API_BASE_URL}/${homework.homework_file}`
  //       );
  //       setIsEditMode(true);
  //       setFileName(homework.homework_file.split("/").pop());
  //       setShowData("");
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching homework:", error);
  //     });
  // };

//   const editHomeWork = (id) => {
//   axios
//     .get(
//       process.env.REACT_APP_API_BASE_URL +
//         `/get-homework/${id}/${user.user.campus_id}/${academicSession}`
//     )
//     .then((response) => {
//       const homework = response.data.results[0];
//       setEditFormData({
//         hidden_id: homework.id,
//         admission_id: homework.assign_subject_id, // ✅ CORRECT - This matches the 'value' in Select options
//         assign_subject_teacher_id: homework.assing_subjects_class_teacher_id, // ✅ Store this separately
//         home_work_date: formatDate(homework.home_work_date),
//         description: homework.description,
//         session_id: academicSession,
//         campus_id: user.user.campus_id,
//         user_id: user.user.user_id,
//         current_file: homework.homework_file,
//         class_id: homework.class_id,
//         section_id: homework.section_id,
//         shift: homework.shift,
//       });
//       setCurrentFileUrl(
//         `${process.env.REACT_APP_API_BASE_URL}/${homework.homework_file}`
//       );
//       setIsEditMode(true);
//       setFileName(homework.homework_file.split("/").pop());
//       setShowData("");
//     })
//     .catch((error) => {
//       console.error("Error fetching homework:", error);
//     });
// };


const editHomeWork = (id) => {
  axios
    .get(
      process.env.REACT_APP_API_BASE_URL +
        `/get-homework/${id}/${user.user.campus_id}/${academicSession}`
    )
    .then((response) => {
      const homework = response.data.results[0];
      setEditFormData({
        hidden_id: homework.id,
        admission_id: homework.assign_subject_id, // ✅ Now correctly gets subject_id
        assign_subject_teacher_id: homework.assing_subjects_class_teacher_id,
        home_work_date: formatDate(homework.home_work_date),
        description: homework.description,
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.student_unique_id,
        current_file: homework.homework_file,
        class_id: homework.class_id,
        section_id: homework.section_id,
        shift: homework.shift,
      });
      setCurrentFileUrl(
        `${process.env.REACT_APP_API_BASE_URL}/${homework.homework_file}`
      );
      setIsEditMode(true);
      setFileName(homework.homework_file.split("/").pop());
      setShowData("");
    })
    .catch((error) => {
      console.error("Error fetching homework:", error);
    });
};

  const cancelEdit = () => {
    resetForm();
  };

  // Mobile tab state — desktop shows both panes side-by-side, mobile toggles
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'list'

  function handleView() {
    setMobileTab('list');
  }

  const handleHide = () => {
    setShowData("");
  };
const handleDownload = async (fileName) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/uploads/${fileName}`);
    
    if (!response.ok) {
      throw new Error('File not found');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('File downloaded successfully');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Failed to download file');
  }
};
  // Wrapper that scrolls to form on mobile after edit click
  const handleEditFromList = (id) => {
    editHomeWork(id);
    setMobileTab('form');
  };

  return (
    <div className="hw-shell">
      <style>{`
        .hw-shell {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 100%;
          background: #f4f6fa;
          font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        }
        .hw-tabs {
          display: flex;
          background: #fff;
          border-bottom: 1px solid #e6e8eb;
          position: sticky;
          top: 0;
          z-index: 5;
        }
        .hw-tab {
          flex: 1;
          padding: 14px 12px;
          background: transparent;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #6c757d;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .hw-tab.is-active {
          color: #111418;
          border-bottom-color: #EBD197;
          background: #fffaf0;
        }
        .hw-tab .hw-badge {
          background: #EBD197;
          color: #1f2329;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          min-width: 22px;
        }
        .hw-body {
          flex: 1;
          display: flex;
          flex-direction: row;
          overflow: hidden;
          min-height: 0;
        }
        .hw-pane {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 14px;
          box-sizing: border-box;
        }
        .hw-pane--form { background: #f4f6fa; }
        .hw-pane--list {
          background: #fff;
          border-left: 1px solid #e6e8eb;
          max-width: 420px;
          min-width: 320px;
        }
        .hw-pane--list h3 {
          margin: 0 0 12px 0;
          font-size: 15px;
          font-weight: 700;
          color: #111418;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 10px;
          border-bottom: 2px solid #EBD197;
        }
        .hw-search {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .hw-search input {
          flex: 1;
          min-width: 120px;
          padding: 9px 12px;
          border: 1px solid #d0d7e2;
          border-radius: 8px;
          font-size: 13px;
          background: #fff;
        }
        .hw-search input:focus { outline: none; border-color: #EBD197; box-shadow: 0 0 0 3px rgba(235,209,151,0.25); }
        .hw-search button {
          padding: 9px 14px;
          background: #111418;
          color: #EBD197;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .hw-card {
          background: #fff;
          border: 1px solid #e6e8eb;
          border-left: 4px solid #EBD197;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: box-shadow 0.15s ease, transform 0.1s ease;
        }
        .hw-card:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.08); }
        .hw-card__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 8px;
        }
        .hw-card__date {
          font-size: 12px;
          font-weight: 700;
          color: #111418;
          background: #fff8e6;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .hw-card__shift {
          font-size: 11px;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .hw-card__title {
          font-size: 14px;
          font-weight: 700;
          color: #1f2329;
          margin-bottom: 4px;
        }
        .hw-card__subject {
          display: inline-block;
          background: #111418;
          color: #EBD197;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .hw-card__desc {
          font-size: 12px;
          color: #495057;
          line-height: 1.45;
          max-height: 60px;
          overflow: hidden;
          margin-bottom: 8px;
          position: relative;
        }
        .hw-card__desc p { margin: 0; }
        .hw-card__actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #e6e8eb;
        }
        .hw-card__btn {
          flex: 1;
          min-width: 60px;
          padding: 7px 10px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: opacity 0.15s ease;
        }
        .hw-card__btn:active { opacity: 0.8; }
        .hw-card__btn--download { background: #d4edda; color: #155724; }
        .hw-card__btn--edit { background: #cfe2ff; color: #084298; }
        .hw-card__btn--delete { background: #f8d7da; color: #842029; }
        .hw-empty {
          text-align: center;
          padding: 30px 16px;
          color: #6c757d;
          font-size: 13px;
        }
        .hw-empty i { font-size: 28px; color: #d0d7e2; display: block; margin-bottom: 8px; }
        .hw-pagination-wrap { margin-top: 12px; display: flex; justify-content: center; }
        .hw-pagination-wrap .pagination {
          display: inline-flex;
          gap: 4px;
          padding-left: 0;
          margin: 0;
          list-style: none;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hw-pagination-wrap .page-item .page-link {
          padding: 6px 10px;
          font-size: 12px;
          border: 1px solid #d0d7e2;
          color: #1f2329;
          background: #fff;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          display: inline-block;
        }
        .hw-pagination-wrap .page-item.active .page-link {
          background: #111418;
          color: #EBD197;
          border-color: #111418;
        }

        /* Mobile: hide one pane based on tab */
        @media (max-width: 991px) {
          .hw-pane--form { display: ${mobileTab === 'form' ? 'block' : 'none'}; }
          .hw-pane--list { display: ${mobileTab === 'list' ? 'block' : 'none'}; max-width: none; min-width: 0; border-left: none; }
        }
        /* Desktop: hide tabs, show both panes */
        @media (min-width: 992px) {
          .hw-tabs { display: none; }
          .hw-pane--form { display: block; }
          .hw-pane--list { display: block; }
        }
      `}</style>

      {/* Mobile tabs */}
      <div className="hw-tabs">
        <button
          type="button"
          className={`hw-tab ${mobileTab === 'form' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('form')}
        >
          <i className={`fas ${isEditMode ? 'fa-edit' : 'fa-plus-circle'}`}></i>
          {isEditMode ? 'Update Homework' : 'Submit Homework'}
        </button>
        <button
          type="button"
          className={`hw-tab ${mobileTab === 'list' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('list')}
        >
          <i className="fas fa-list"></i>
          Homework List
          {data && data.length > 0 && <span className="hw-badge">{data.length}</span>}
        </button>
      </div>

      <div className="hw-body">
        {/* FORM PANE */}
        <div className="hw-pane hw-pane--form">
          <div style={styles.mainCard}>
            <div style={styles.header}>
              <h5 style={styles.headerTitle}>
                <i className="fas fa-book"></i>
                {isEditMode ? 'Update Homework' : 'Submit Homework'}
              </h5>
              {isEditMode && (
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                  onClick={cancelEdit}
                >
                  <i className="fas fa-times"></i> Cancel Edit
                </button>
              )}
            </div>

        <form style={styles.formContainer} onSubmit={handleSubmit}>
          <input type="hidden" name="hidden_id" value={editFormData.hidden_id} />
          <input type="hidden" name="current_file" value={editFormData.current_file} />

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date*</label>
              <input
                type="date"
                style={{
                  ...styles.input,
                  ...(validity.home_work_date ? {} : styles.inputInvalid)
                }}
                name="home_work_date"
                value={editFormData.home_work_date}
                onChange={handleChange}
              />
              {!validity.home_work_date && (
                <div style={styles.errorText}>Please select a date</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Class*</label>
              
              <Select
                options={getClassOptions}
               value={
  editFormData.admission_id && editFormData.class_id && editFormData.section_id
    ? getClassOptions.find((opt) => 
        opt.subject_id == editFormData.admission_id &&
        opt.class_id == editFormData.class_id &&
        opt.section_id == editFormData.section_id &&
        opt.shift == editFormData.shift
      )
    : null
}
                onChange={handleClassChange}
                placeholder="Select Class (Section) - Subject (Shift)"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: validity.admission_id ? '#ddd' : '#dc3545'
                  })
                }}
              />
              {!validity.admission_id && (
                <div style={styles.errorText}>Please select a class</div>
              )}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description*</label>
            <ReactQuill
              theme="snow"
              value={editFormData.description}
              onChange={handleDescriptionChange}
              modules={modules}
              formats={formats}
              placeholder="Enter homework details..."
            />
            {!validity.description && (
              <div style={styles.errorText}>Please enter a description</div>
            )}
          </div>

          {/* <div style={styles.formGroup}>
            <label style={styles.label}>
              {isEditMode ? "Update Homework File" : "Homework File"} (.docx only)
            </label>
            <div
              {...getRootProps()}
              style={styles.dropzone}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#007bff'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = '#ddd'}
            >
              <input {...getInputProps()} />
              {filePreview ? (
                <div>
                  <p style={{ margin: 0, color: '#28a745', fontWeight: '500' }}>
                    <i className="fas fa-file-alt"></i> File selected: {fileName}
                  </p>
                </div>
              ) : fileName ? (
                <div>
                  <p style={{ margin: 0, color: '#007bff', fontWeight: '500' }}>
                    <i className="fas fa-file"></i> Current file: {fileName}
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, color: '#666' }}>
                  <i className="fas fa-cloud-upload-alt"></i> Drag & drop a .docx file here, or click to select
                </p>
              )}
            </div>
            {isEditMode && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Leave empty to keep current file
              </div>
            )}
          </div> */}


          <div style={styles.formGroup}>
  <label style={styles.label}>
    {isEditMode ? "Update Homework File" : "Homework File"} (Max 10MB)
  </label>
  <div
    {...getRootProps()}
    style={styles.dropzone}
    onMouseOver={(e) => e.currentTarget.style.borderColor = '#007bff'}
    onMouseOut={(e) => e.currentTarget.style.borderColor = '#ddd'}
  >
    <input {...getInputProps()} />
    {filePreview && editFormData.homework_file?.type.startsWith('image/') ? (
      <div>
        <img 
          src={filePreview} 
          alt="Preview" 
          style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '10px' }}
        />
        <p style={{ margin: 0, color: '#28a745', fontWeight: '500' }}>
          <i className="fas fa-file-image"></i> File selected: {fileName}
        </p>
      </div>
    ) : filePreview ? (
      <div>
        <p style={{ margin: 0, color: '#28a745', fontWeight: '500' }}>
          <i className="fas fa-file-alt"></i> File selected: {fileName}
        </p>
      </div>
    ) : fileName ? (
      <div>
        <p style={{ margin: 0, color: '#007bff', fontWeight: '500' }}>
          <i className="fas fa-file"></i> Current file: {fileName}
        </p>
      </div>
    ) : (
      <div>
        <p style={{ margin: 0, color: '#666', marginBottom: '8px' }}>
          <i className="fas fa-cloud-upload-alt"></i> Drag & drop a file here, or click to select
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
          Allowed: Images (JPG, PNG, GIF), PDF, Word, Excel, PowerPoint (Max 10MB)
        </p>
      </div>
    )}
  </div>
  {isEditMode && (
    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
      Leave empty to keep current file
    </div>
  )}
</div>

          <div style={styles.buttonGroup}>
            {isEditMode && (
              <button
                type="button"
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={cancelEdit}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              style={{ ...styles.button, ...styles.buttonPrimary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              {isEditMode ? "Update Homework" : "Submit Homework"}
            </button>
          </div>
        </form>
          </div>
        </div>

        {/* LIST PANE — persistent sidebar on desktop, tab content on mobile */}
        <div className="hw-pane hw-pane--list">
          <h3>
            <i className="fas fa-list" style={{ color: '#EBD197' }}></i>
            Homework List
            {data && data.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#6c757d', fontWeight: 600 }}>
                {data.length} {data.length === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </h3>

          <div className="hw-search">
            <input
              type="date"
              onKeyDown={handleKeyDown}
              onChange={(e) =>
                setEditFormData({ ...editFormData, search_date: e.target.value })
              }
              aria-label="Filter by date"
            />
            <input
              type="text"
              placeholder="Search…"
              onKeyDown={handleKeyDown}
              onChange={(e) =>
                setSearchCategoryReport({ ...searchCategoryReport, search: e.target.value })
              }
              aria-label="Search homework"
            />
            <button type="button" onClick={searchCategory}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#6c757d', fontWeight: 600 }}>Show:</label>
            <select
              value={totalItem}
              onChange={handleTotalItemChange}
              style={{
                padding: '6px 10px',
                border: '1px solid #d0d7e2',
                borderRadius: '6px',
                fontSize: '12px',
                background: '#fff',
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>

          {loading ? (
            <div className="hw-empty">
              <i className="fas fa-spinner fa-spin"></i>
              Loading homework…
            </div>
          ) : !data || data.length === 0 ? (
            <div className="hw-empty">
              <i className="fas fa-inbox"></i>
              No homework yet. Submit your first one from the form.
            </div>
          ) : (
            data.map((homework, index) => (
              <div key={index} className="hw-card">
                <div className="hw-card__top">
                  <span className="hw-card__date">
                    <i className="far fa-calendar-alt"></i> {homework.home_work_date}
                  </span>
                  <span className="hw-card__shift">{homework.shift}</span>
                </div>
                <div className="hw-card__title">
                  {homework.class_name} ({homework.section_name})
                </div>
                <div className="hw-card__subject">{homework.subjects}</div>
                <div
                  className="hw-card__desc"
                  dangerouslySetInnerHTML={{ __html: homework.description }}
                ></div>
                <div className="hw-card__actions">
                  {homework.homework_file ? (
                    <button
                      type="button"
                      className="hw-card__btn hw-card__btn--download"
                      onClick={() => handleDownload(homework.homework_file)}
                      title={homework.homework_file}
                    >
                      <i className="fas fa-download"></i> File
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="hw-card__btn"
                      style={{ background: '#f1f3f6', color: '#999', cursor: 'not-allowed' }}
                      disabled
                    >
                      <i className="fas fa-ban"></i> No file
                    </button>
                  )}
                  <button
                    type="button"
                    className="hw-card__btn hw-card__btn--edit"
                    onClick={() => handleEditFromList(homework.id)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    type="button"
                    className="hw-card__btn hw-card__btn--delete"
                    onClick={() => handleDelete(homework.id)}
                  >
                    <i className="fas fa-trash-alt"></i> Del
                  </button>
                </div>
              </div>
            ))
          )}

          {totalPages > 1 && (
            <div className="hw-pagination-wrap">
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
  );
}

export default HomeWork;
