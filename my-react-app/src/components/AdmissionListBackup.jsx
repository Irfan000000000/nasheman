import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AcademicSessionContext from './AcademicSessionContext';
import { useAuth } from './AuthContext';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactToPrint } from 'react-to-print';
import AdmissionForm from "./AdmissionForm"; // Import the inline edit component


const AdmissionList = () => {


    const initialSession = {
        session_id: '',
    };

    const initialStates = {
        selectedOption: null,
        getSearchClass: null,
        getSearchSection: null,
        searchReport: {
            search: "",
        },
    };

    const initialFormData = {
        class_id: '',
        summary_report: '',
        shift:'',
        section_id: '',
        category_id: '',
        status: '',
        from_date: '',
        to_date: '',
        search: ''
    };


    const [editFormData, setEditFormData] = useState(initialFormData);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItemGet] = useState(10);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);

    const [getSession, setSession] = useState(initialSession);

    const [searchTerm, setSearchTerm] = useState('');

    const matchesSearch = (field, term) => {
    return field ? field.toString().toLowerCase().includes(term) : false;
};


    const [getCategories, setCategories] = useState([]);


    const [showEdit, setShowEdit] = useState(false);


    const [getClasses, setClasses] = useState([]);

    const [getSections, setSections] = useState([]);

    const componentRef = useRef(); // Reference for printing

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    // Reset function
    const resetStates = () => {
        setEditFormData(initialFormData);
    };

    const [admission, setAdmission] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (academicSession) {
            setSession(prevFormData => ({
                ...prevFormData,
                session_id: parseInt(academicSession)
            }));
        }
    }, [academicSession]);

    useEffect(() => {
        const fetchClasses = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
                .then(res => {
                    // console.log(res.data.results)
                    setClasses(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchClasses(user.user.campus_id);
        }
    }, []); // Dependencies array to re-run the effect when user changes

    const findClassLabel = () => {
        if (!editFormData.class_id || !editFormData.section_id) {
            return "";
        }
        const classObj = getClasses.find(class_get => class_get.id === parseInt(editFormData.class_id) && class_get.section_id === parseInt(editFormData.section_id));
        if (classObj) {
            return `${classObj.class} (${classObj.section_name})`;
        }
        return "";
    };

    const handleClassChange = (selectedOption) => {
        const [class_id, section_id] = selectedOption ? selectedOption.value.split(",") : ["", ""];
        setEditFormData({ ...editFormData, class_id, section_id });
    };

    const classOptions = [
        { value: "", label: "Select Class" },
        ...getClasses.map(class_get => ({
            value: `${class_get.id},${class_get.section_id}`,
            label: `${class_get.class} (${class_get.section_name})`
        }))
    ];



    function convertDates(date) {
        const d = new Date(date);

        // Get day, month, and year
        const day = d.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const year = d.getFullYear();

        // Return formatted date as dd-mm-yyyy
        return `${day}-${month}-${year}`;
    }


    useEffect(() => {
        const fetchSections = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-sections/${campus_id}`)
                .then(res => {

                    setSections(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchSections(user.user.campus_id);
        }
    }, []); // Dependencies array to re-run the effect when user changes




    const section_option = getSections.map(sections => ({
        value: sections.id,
        label: sections.section_name // Assuming 'category' is the property name for category name
    }));


    const classes_option = getClasses.map(classes => ({
        value: classes.id,
        label: classes.class // Assuming 'category' is the property name for category name
    }));



    const categories_option = getCategories.map(category => ({
        value: category.id,
        label: category.category // Assuming 'category' is the property name for category name
    }));


    const [report, getAllReports] = useState({
        from_date: '',
        to_date: '',
        report_type: ''
    });




    const [admissionData, setAdmissionData] = useState(null);

    const [voucherData, setVoucherData] = useState([]);

     const [activitiesData, setActivitiesData] = useState([]);

         const [disciplineData, setDisciplineData] = useState([]);

    const [getSLCdata, setSLCData] = useState(null);


    const [showData, setShowData] = useState(false);



    const [showSLCData, setSLCShow] = useState(false);



    const [showCategorySummary, setCategorySummary] = useState(false);

    const [isFetchingSummary, setIsFetchingSummary] = useState(false);

    const [categorywiseSummaryData, setCategoryWiseSummaryData] = useState([]);

    const [uniqueCategories, setUniqueCategories] = useState([]);





    const [showNewAdmissionSummary, setNewAdmissionSummary] = useState(false);

    const [isFetchingNewAdmissionSummary, setIsFetchingNewAdmissionSummary] = useState(false);

    const [newAdmissionSummaryData, setNewAdmissionSummaryData] = useState([]);




    const [showNewSlcSummary, setSlcSummary] = useState(false);

    const [isFetchingSlcSummary, setIsFetchingSlcSummary] = useState(false);

    const [slcSummaryData, setSlcSummaryData] = useState([]);



    const [showStatusWiseSummary, setStatusWiseSummary] = useState(false);

    const [isFetchingStatusWiseSummary, setIsFetchingStatusWiseSummary] = useState(false);

    const [statusWiseSummaryData, setStatuswiseSummaryData] = useState([]);



    const [showStruckOffSummary, setStruckOffSummary] = useState(false);

    const [isFetchingStruckOffSummary, setIsFetchingStruckOffSummary] = useState(false);

    const [StruckOffSummaryData, setStruckOffSummaryData] = useState([]);







    const viewAdmission = (admission_id, campus_id, session_id) => {

        axios.get(process.env.REACT_APP_API_BASE_URL+`/view-admission/${admission_id}/${campus_id}/${session_id}`)
            .then(response => {
                setAdmissionData(response.data.results[0]);
                setVoucherData(response.data.results);
                setActivitiesData(response.data.activities);
                setDisciplineData(response.data.discipline);
                setShowData(true);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };


    const handleHide = () => {
        setShowData(false);
        setSLCShow(false);
        setAdmissionData(null);

        setCategorySummary(false);
        setCategoryWiseSummaryData([]);
        setUniqueCategories([]);

        setNewAdmissionSummary(false);
        setIsFetchingNewAdmissionSummary(false);
        setNewAdmissionSummaryData([]);


        setSlcSummary(false);
        setIsFetchingSlcSummary(false);
        setSlcSummaryData([]);

        setStatusWiseSummary(false);
        setIsFetchingStatusWiseSummary(false);
        setStatuswiseSummaryData([]);


        setStruckOffSummary(false);
        setIsFetchingStruckOffSummary(false);
        setStruckOffSummaryData([]);
    };


    function getReport() {
        if (report.report_type === "pdf") {
            // pdfReport();
        } else if (report.report_type === "excel") {
            getAdmissionExcelReport();
        }
    }

    const handleTotalItemChange = (event) => {
        const newValue = event.target.value;
        setTotalItemGet(newValue);
    }

    const editAdmission = (admission_id) => {

        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-admission/${admission_id}`)
            .then(response => {

                const admissionData = response.data;
                localStorage.setItem('admission', JSON.stringify(admissionData));
                setShowEdit(true);
                // navigate('/admission-form-edit');

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };



    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         getSearchReport(searchReport);
    //         fetchData();
    //     }
    // };











  const deleteAdmission = (admission_id, full_name, class_name, section_name, father_name) => {
    const confirmDeletion = window.confirm('Deleted! Are you sure?');
    if (confirmDeletion) {
        // Construct the URL path with encoded parameters
        const urlPath = `/delete-admission/${
            admission_id
        }/${user.user.user_id}/${
            user.user.campus_id
        }/${academicSession}/${
            encodeURIComponent(full_name)
        }/${encodeURIComponent(class_name)
        }/${encodeURIComponent(section_name)
        }/${encodeURIComponent(father_name)}`;

        // Make sure the base URL doesn't have trailing slashes
        const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/+$/, '');
        
        axios.get(baseUrl + urlPath)
            .then(response => {
                console.log('Admission deleted successfully:', response.data);
                setData(prevData => prevData.filter(admission => admission.id !== admission_id));
            })
            .catch(error => {
                console.error('Error deleting Admission:', error);
            });
    }
};


    const fetchData = (shouldLoad = true) => {
         if (shouldLoad) setLoading(true);
        axios.get(process.env.REACT_APP_API_BASE_URL+"/admission-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                from_date: editFormData.from_date,
                to_date: editFormData.to_date,
                class_id: editFormData.class_id,
                section_id: editFormData.section_id,
                category_id: editFormData.category_id,
                status: editFormData.status,
                search: editFormData.search,
                shift: editFormData.shift,
                session_id: academicSession,
                campus_id: user.user.campus_id,
                user_id: user.user.user_id
            }
        })
            .then(res => {
                setData(res.data.results);
                setTotalCount(res.data.overallTotal);
                totalPagesGet(res.data.totalPages);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (academicSession) {
            fetchData(false);
        }
    }, [academicSession, currentPage, totalItem]);

    const searchData = () => {
        // setLoading(true);
        fetchData(false);
    };


    const viewData = () => {

        if (editFormData.summary_report == "student_summary_campuswise") {
            setIsFetchingSummary(true);
            axios.get(process.env.REACT_APP_API_BASE_URL+"/summary-report", {
                params: {

                    session_id: academicSession,
                    campus_id: user.user.campus_id,
                    shift: editFormData.shift,
                    from_date:editFormData.from_date,
                    to_date:editFormData.to_date
                }
            })
                .then(res => {
                    // Update state
                    setCategoryWiseSummaryData(res.data.results);
                    // Use the response data directly instead of the state
                    if (res.data.results.length > 0 && editFormData.summary_report === "student_summary_campuswise") {
                        const categories = [...new Set(res.data.results.map((item) => item.category))];
                        setUniqueCategories(categories);
                        // console.log(categories);
                        setCategorySummary(true);
                        setIsFetchingSummary(false);
                    }

                    // setLoading(false);

                })
                .catch(err => {
                    console.log(err);
                    setIsFetchingSummary(false);
                });
        } else if (editFormData.summary_report == "new_admission_summary_campuswise") {

            setIsFetchingNewAdmissionSummary(true);

            axios.get(process.env.REACT_APP_API_BASE_URL+"/summary-report-new-admission", {
                params: {
                    session_id: academicSession,
                    campus_id: user.user.campus_id,
                    shift: editFormData.shift,
                    from_date:editFormData.from_date,
                    to_date:editFormData.to_date
                }
            })
                .then(res => {
                    setNewAdmissionSummaryData(res.data.results);
                    setIsFetchingNewAdmissionSummary(false);
                    setNewAdmissionSummary(true);
                })
                .catch(err => {
                    console.log(err);
                    setIsFetchingNewAdmissionSummary(false);
                });

        } else if (editFormData.summary_report == "slc_summary_campuswise") {

            setIsFetchingSlcSummary(true);

            axios
              .get(process.env.REACT_APP_API_BASE_URL + "/summary-report-slc", {
                params: {
                  session_id: academicSession,
                  campus_id: user.user.campus_id,
                  shift: editFormData.shift,
                  from_date: editFormData.from_date,
                  to_date: editFormData.to_date,
                },
              })
              .then((res) => {
                setSlcSummaryData(res.data.results);
                setSlcSummary(true);
                setIsFetchingSlcSummary(false);
              })
              .catch((err) => {
                setIsFetchingSlcSummary(false);
              });

        } else if (editFormData.summary_report == "statuswise_summary_campuswise") {

            setIsFetchingStatusWiseSummary(true);

            axios.get(process.env.REACT_APP_API_BASE_URL+"/summary-report-all-status", {
                params: {
                    session_id: academicSession,
                    campus_id: user.user.campus_id,
                    shift: editFormData.shift,
                    from_date:editFormData.from_date,
                    to_date:editFormData.to_date
                }
            })
                .then(res => {
                    console.log(res.data.results);
                    setStatuswiseSummaryData(res.data.results);
                    setStatusWiseSummary(true);
                    setIsFetchingStatusWiseSummary(false);
                })
                .catch(err => {
                    setIsFetchingStatusWiseSummary(false);
                });
        } else if (editFormData.summary_report == "struck_off_summary") {

            setIsFetchingStatusWiseSummary(true);

            axios.get(process.env.REACT_APP_API_BASE_URL+"/summary-report-struck-off", {
                params: {
                    session_id: academicSession,
                    campus_id: user.user.campus_id,
                    shift: editFormData.shift,
                    from_date:editFormData.from_date,
                    to_date: editFormData.to_date
                }
            })
                .then(res => {
                    console.log(res.data.results);
                    setStruckOffSummaryData(res.data.results);
                    setStruckOffSummary(true);
                    setIsFetchingStruckOffSummary(false);
                })
                .catch(err => {
                    setIsFetchingStruckOffSummary(false);
                });
        } else if (editFormData.summary_report == "view_house_and_club_report") {

            // console.log(editFormData.summary_report);

            setIsFetchingStatusWiseSummary(true);

            axios.get(process.env.REACT_APP_API_BASE_URL+"/view-house-and-club-report", {
                params: {
                    session_id: academicSession,
                    campus_id: user.user.campus_id,
                    shift: editFormData.shift,
                    class_id: editFormData.class_id,
                    section_id: editFormData.section_id,
                    shift: editFormData.shift
                }
            })
                .then(res => {
                    console.log(res.data.results);
                    setStruckOffSummaryData(res.data.results);
                    setStruckOffSummary(true);
                    setIsFetchingStruckOffSummary(false);
                })
                .catch(err => {
                    setIsFetchingStruckOffSummary(false);
                });
        }
    };



    // const groupedData = categorywiseSummaryData.reduce((acc, item) => {
    //     const key = `${item.class}-${item.section_name}`;
    //     if (!acc[key]) {
    //         acc[key] = {
    //             class: item.class,
    //             section: item.section_name,
    //             categories: {},
    //             total_students: 0
    //         };
    //     }
    //     acc[key].categories[item.category] = item.total_students;
    //     acc[key].total_students += item.total_students;
    //     return acc;
    // }, {});



    const groupedData = categorywiseSummaryData.reduce((acc, item) => {
        const key = `${item.class}-${item.section_name}`;
        if (!acc[key]) {
            acc[key] = {
                class: item.class,
                section: item.section_name,
                categories: {},
                male_students: 0,
                female_students: 0,
                total_students: 0
            };
        }

        acc[key].categories[item.category] = item.total_students;
        acc[key].male_students += item.male_students;  // Add male students
        acc[key].female_students += item.female_students;  // Add female students
        acc[key].total_students += item.total_students;
        return acc;
    }, {});



    const columnsObject = {
        "register_no": "REGISTER_NO",
        "old_register_no": "OLD_REGISTER_NO",
        "shift": "SHIFT",
        "full_name": "FULL_NAME",
        "gender": "GENDER",
        "class_id": "CLASS",
        "section_id": "SECTION",
        "blood_group": "BLOOD_GROUP",
        "current_address": "CURRENT_ADDRESS",
        "permanent_address": "PERMANENT_ADDRESS",
        "mobile_no": "MOBILE_NO",
        "student_cnic": "STUDENT_CNIC",
        "category_id": "CATEGORY",
        // "house_id": "HOUSE",
        // "club_id": "CLUB",
        "guardian_name": "GUARDIAN_NAME",
        "relation": "RELATION",
        "occupation": "OCCUPATION",
        "guardian_mobile_no": "GUARDIAN_MOBILE_NO",
        "guardian_address": "GUARDIAN_ADDRESS",
        "guardian_cnic": "GUARDIAN_CNIC",
        "pl_no": "PL_NO",
        "designation": "DESIGNATION",
        "department": "DEPARTMENT",
        "student_image": "STUDENT_IMAGE",
        "session_id": "SESSION",
        "campus_id": "CAMPUS",
        "status": "STATUS",
        "father_cnic": "FATHER_CNIC",
        "father_mobile_no": "FATHER_MOBILE_NO",
        "father_name": "FATHER_NAME"
    };



    // Create options array for react-select
    const options = Object.keys(columnsObject).map(key => ({
        value: key,
        label: columnsObject[key]
    }));







    function getAdmissionExcelReport() {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/admission-excel-report", {
            params: {
                page: currentPage,
                limit: totalItem,
                from_date: editFormData.from_date,
                to_date: editFormData.to_date,
                class_id: editFormData.class_id,
                section_id: editFormData.section_id,
                category_id: editFormData.category_id,
                status: editFormData.status,
                search: editFormData.search,
                session_id: academicSession,
                campus_id: user.user.campus_id
            },
            responseType: 'blob'  // Important to handle the Excel binary data correctly
        })
            .then(res => {
                // Check if the response is a JSON object with the message 'Data not exist'
                const contentType = res.headers['content-type'];
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const responseText = reader.result;
                        const responseJson = JSON.parse(responseText);
                        if (responseJson.message === 'Data not exist') {
                            // Show toaster notification
                            toast.success('Data Not Exist!');
                            return;
                        }
                    };
                    reader.readAsText(res.data);
                } else {
                    // Create a URL for the blob object
                    const url = window.URL.createObjectURL(new Blob([res.data]));

                    // Create a link to download the file
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `report-${editFormData.from_date}-to-${editFormData.to_date}.xlsx`); // Set the file name with .xlsx extension

                    // Append the link to the body, click it, and then remove it
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Free up the created URL
                    window.URL.revokeObjectURL(url);
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        const fetchCategories = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-categories/${campus_id}`)
                .then(res => {

                    setCategories(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchCategories(user.user.campus_id);
        }
    }, [user]); // Depende



    const statusOptions = [
        { value: '', label: 'Select Status' },
        { value: 'New Admission', label: 'New Admission' },
        { value: 'Struck Off', label: 'Struck Off' },
        { value: 'SLC', label: 'SLC' },
        { value: 'Promoted', label: 'Promoted' },
    ];


    const handleStatusChange = (selectedOption) => {
        setEditFormData({ ...editFormData, status: selectedOption.value });
    };



    // function fetchSLCRecord(id){

    //     console.log(id);
    // }


    const fetchSLCRecord = (admission_id, campus_id, session_id) => {

        axios.get(process.env.REACT_APP_API_BASE_URL+`/view-SLC/${admission_id}/${campus_id}/${session_id}`)
            .then(response => {

                console.log(response.data.results[0]);
                setSLCData(response.data.results[0]);
                setSLCShow(true);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };




    const groupedDataStatusWise = statusWiseSummaryData.reduce((acc, item) => {
        const key = `${item.class}-${item.section_name}`;
        if (!acc[key]) {
            acc[key] = {
                class: item.class,
                section_name: item.section_name,
                new_admission: 0,
                slc: 0,
                struck_off: 0,
                promoted: 0,
                total_students: 0,
            };
        }
        // Summing up based on the status
        if (item.status === 'New Admission') acc[key].new_admission += item.total_students;
        if (item.status === 'SLC') acc[key].slc += item.total_students;
        if (item.status === 'Struck Off') acc[key].struck_off += item.total_students;
        if (item.status === 'Promoted') acc[key].promoted += item.total_students;

        // Total students per class
        acc[key].total_students += item.total_students;

        return acc;
    }, {});

    // Convert grouped data to an array
    const groupedArray = Object.values(groupedDataStatusWise);

    // Function to calculate totals for each status
    const calculateTotal = (statusKey) => {
        return groupedArray.reduce((sum, item) => sum + item[statusKey], 0);
    };


    return (
        <div className="container-fluid">



{showEdit && (
        // <div className="edit-voucher-container" style={{
        //   position: "absolute",
        //   top: "0%",
        //   left: "49%",
        //   transform: "translate(-50%, 0%)",
        //   zIndex: 1000,
        //   backgroundColor: "#fff",
        //   padding: "10px",
        //   border: "1px solid #ccc",
        //   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        //   width: "100%",
        //   minWidth: "800px",
        // }}>
        //   {/* A close button to hide the Edit component */}
        //   <div className="d-flex justify-content-end"><button
        //     className="btn btn-primary mr-2 mb-2"
        //     onClick={() => setShowEdit(false)}
        //   >
        //    x
        //   </button>
        //   </div>

        <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "100",
              backdropFilter: "blur(10px)",
              width: "100%",
              height: "100%",
              // maxWidth: "1800px",
              // maxHeight: "90vh",
              backgroundColor: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              // backgroundColor: "#f8f9fa",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 101,
                // backgroundColor: "#007bff",
                color: "#ffc107",
                padding: "8px 16px",
              }}
            >
              {/* <h5 style={{ margin: 0 }}>Single Fee Generate</h5> */}
              <button
               onClick={() => setShowEdit(false)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "15px",
                //   padding:"px",
                //   background: "transparent",
                  backgroundColor: "#007bff",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  borderRadius: "3px",
                  color: "#ffc107",
                }}
              >
                &times;
              </button>
            </div>

            <div
              style={{
                padding: "20px",
                marginTop: "10px",
                width: "100%",
                overflowY: "auto",
                maxHeight: "calc(90vh - 80px)",
                paddingTop: "5px",
              }}
            >
          <AdmissionForm onClose={() => setShowEdit(false)}  fetchData={fetchData} refreshData={true} />
         </div>
          </div>
      )}






            <div className="row">
                <div className="col-12 col-md-12 p-2">
                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Admissions List
                            </div>

                        </div>
                    </div>
                    <div className="border p-2">


                        <div className="row">
                            {/* Date Inputs */}
                            <div className="col-12 col-md-2 mb-2">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="from_date"
                                    value={editFormData.from_date}
                                    onChange={(e) => setEditFormData({ ...editFormData, from_date: e.target.value })}
                                />
                            </div>
                            <div className="col-12 col-md-2 mb-2">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="to_date"
                                    value={editFormData.to_date}
                                    onChange={(e) => setEditFormData({ ...editFormData, to_date: e.target.value })}
                                />
                            </div>

                            {/* <div className="col-12 col-md-2 mb-2">
    <input
        type="month"
        className="form-control"
        id="month"
        value={editFormData.from_date ? editFormData.from_date.substring(0, 7) : ""}
        onChange={(e) => {
            const selectedMonth = e.target.value;
            if (selectedMonth) {
                // Calculate first day of the month
                const firstDay = `${selectedMonth}-01`;
                
                // Calculate last day of the month
                const date = new Date(selectedMonth);
                date.setMonth(date.getMonth() + 1);
                date.setDate(0);
                const lastDay = date.toISOString().split('T')[0];
                
                setEditFormData({ 
                    ...editFormData, 
                    from_date: firstDay,
                    to_date: lastDay
                });
            } else {
                setEditFormData({ 
                    ...editFormData, 
                    from_date: "",
                    to_date: ""
                });
            }
        }}
    />
</div> */}

                             <div className="col-12 col-md-2 mb-2">
                                <Select
                                    value={statusOptions.find(option => option.value === editFormData.status)}
                                    onChange={handleStatusChange}
                                    options={statusOptions}
                                    placeholder="Select Status"
                                />
                            </div>

                            {/* Class Selector */}
                            <div className="col-12 col-md-2 mb-2">
                                <Select
                                    options={classOptions}
                                    value={
                                        editFormData.class_id && editFormData.section_id
                                            ? {
                                                value: `${editFormData.class_id},${editFormData.section_id}`,
                                                label: findClassLabel()
                                            }
                                            : { value: "", label: "Select Class" }
                                    }
                                    onChange={handleClassChange}
                                    placeholder="Select Class"
                                    isClearable
                                />
                            </div>

                            {/* Category Selector */}
                            <div className="col-12 col-md-2 mb-2">
                                <Select
                                    options={getCategories.map(category => ({ value: category.id, label: category.category }))}
                                    value={
                                        editFormData.category_id
                                            ? { value: editFormData.category_id, label: getCategories.find(category => category.id === editFormData.category_id)?.category || "" }
                                            : { value: "", label: "Select Category" }
                                    }
                                    onChange={(selectedOption) => setEditFormData({ ...editFormData, category_id: selectedOption ? selectedOption.value : "" })}
                                    placeholder="Categories"
                                    isClearable
                                />
                            </div>

                            {/* Status Selector */}
                           

                            {/* Search Input */}
                            
                            <div className="col-12 col-md-2 mb-2">
  <input
    type="text"
    placeholder="Search..."
    className="form-control"
    value={editFormData.search}
    onChange={(e) => setEditFormData({ ...editFormData, search: e.target.value })}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        fetchData(false);
      }
    }}
  />
</div>


                            {/* Reset Button */}
                            {/* <div className="col-12 col-md-2 mb-2">
                               
                            </div> */}


                            {/* Search Button */}
                          


                             <div className="col-6 col-md-2 mb-2">
                           
                                <button className="btn btn-danger ml-2" onClick={searchData}><i className='fas fa-search'></i>  Search</button>
                                <button className="btn btn-primary ml-2" onClick={resetStates}> <i className='fas fa-undo'></i>  Reset</button>
                            </div>



                            <div className="col-12 col-md-2 mb-2">
                                <select
                                    name="shift"
                                    id="shift"
                                    className={'form-control'}
                                    value={editFormData.shift} onChange={(e) => setEditFormData({ ...editFormData, shift: e.target.value })} 
                                >
                                    {/* <option value="">Select Shift</option> */}
                                    <option value={""}>Both</option>
                                    <option>Morning</option>
                                    <option>Evening</option>
                                  
                                </select>
                                </div>


                           

                            <div className="col-12 col-md-2 mb-2">
                                <select
                                    className="form-control"
                                    onChange={(e) => setEditFormData({ ...editFormData, summary_report: e.target.value })}
                                    value={editFormData.summary_report}
                                >
                                    <option value="">View Grand Reports</option>
                                    <option value="student_summary_campuswise">Students Summary</option>
                                    <option value="new_admission_summary_campuswise">New Admission Summary</option>
                                    <option value="slc_summary_campuswise">SLC Summary</option>

                                    <option value="struck_off_summary">Struck Off Summary</option>
                                    <option value="statuswise_summary_campuswise">Status Summary</option>
                                    <option value="view_house_and_club_report">View House And Club Report</option>
                                </select>
                            </div>

                           <div className="col-12 col-md-2 mb-2 m-0">
                                 <button className="btn btn-danger" onClick={viewData}> <i className='fas fa-eye'></i> View</button>
                            </div>

                            
                            {/* Report Type Selector */}
                            <div className="col-12 col-md-2 mb-2">
                                <select
                                    name="type"
                                    id="type"
                                    className="form-control"
                                    onChange={(e) => getAllReports({ ...report, report_type: e.target.value })}
                                >
                                    <option value="">Select Download Option</option>
                                    <option value="excel">Excel</option>
                                </select>
                            </div>

                            


                            {/* Summary Report Selector */}





                            {/* Get Report Button */}
                            <div className="col-12 col-md-2 mb-2">
                                <button className="btn btn-warning btn-block" onClick={getReport}> <i class="fas fa-download"></i> Download</button>
                            </div>








                        </div>




                    </div>
                    <div className='border p-2'>
                        <div className='pb-3'>
                            <select value={totalItem} onChange={handleTotalItemChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Sr#</th>
                                    <th>Register#</th>
                                    <th>Old Register#</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Category</th>
                                    <th>Father</th>
                                    {/* <th>CNIC</th> */}
                                    <th>Mobile#</th>
                                    <th>Status</th>

                                    <th className='text-center'>View</th>
                                    <th className='text-center'>Edit</th>
                                    <th className='text-center'>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8">Loading...</td>
                                    </tr>
                                ) : (
                                    data.map((admission, index) => (
                                        <tr key={index}>
                                            <td>{(currentPage - 1) * totalItem + index + 1}</td>
                                            <td>{admission.register_no}</td>
                                            <td>{admission.old_register_no}</td>
                                            <td>{admission.full_name}</td>
                                            <td>{admission.class}</td>
                                            <td>{admission.section_name}</td>
                                            <td>{admission.category}</td>
                                            <td>{admission.father_name}</td>
                                            {/* <td>{admission.father_cnic}</td> */}
                                            <td>{admission.mobile_no}</td>
                                            <td>
                                                {admission.status === "SLC" ? (
                                                    <button
                                                        className='btn btn-primary btn-sm'
                                                        onClick={() => fetchSLCRecord(admission.id, admission.campus_id, admission.session_id)}
                                                    >
                                                        SLC
                                                    </button>
                                                ) : (
                                                    admission.status
                                                )}
                                            </td>
                                        
                                            <td className='text-center'>
                                                <button className='btn btn-warning btn-sm' onClick={() => viewAdmission(admission.id, admission.campus_id, admission.session_id)}><i className="fas fa-eye icon"></i></button>
                                            </td>
                                            <td className='text-center'>
                                                <button className='btn btn-success btn-sm' onClick={() => editAdmission(admission.id)}><i className="fas fa-edit"></i></button>
                                            </td>
                                            <td className='text-center'>
                                                <button className='btn btn-danger btn-sm' onClick={() => deleteAdmission(admission.id, admission.full_name, admission.class, admission.section_name, admission.father_name)}><i className="fas fa-trash-alt"></i></button>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageChange}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            activeClassName={'active'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                        />
                    </div>

                </div>
            </div>

            {
                showData && admissionData && (
                    <div className="col-12">
                        <div
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                position: 'fixed',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: '100',
                                backdropFilter: 'blur(10px)',
                                width: '90%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <style>
                                {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }

          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          
          .admission_detail {
            border: 1px solid black;
            border-collapse: collapse;
          }

          .admission_detail th, .admission_detail td {
            border: 1px solid gray;
            padding: 10px !important;
          }
          `}
                            </style>

                            {/* Fixed Close Button */}
                            <button
                                onClick={handleHide}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    zIndex: '200', // Ensures it stays on top of other elements
                                }}
                            >
                                &times;
                            </button>

                            {/* Non-Scrollable Heading */}
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: '#EBD197 ',
                                    padding: '5px',
                                    borderBottom: '1px solid #ddd',
                                    position: 'sticky',
                                    top: '0',
                                    zIndex: '150',
                                    textAlign: 'center',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: 'color'
                                }}
                            >
                                Student Admission Details
                            </div>

                            {/* Scrollable Content */}
                            <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                                <div
                                    style={{
                                        marginBottom: '20px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            border: '2px solid #ccc',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            width: '200px',
                                            height: '200px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {admissionData.student_image && (
                                            <div>
                                                <img
                                                    src={process.env.REACT_APP_API_BASE_URL+`/uploads/${admissionData.student_image}`}
                                                    alt="Student"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <table class='admission_detail' style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan="6" style={{ background: '#ddd' }}>
                                                Student Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Session</th>
                                            <td>{admissionData.session_name}</td>
                                            <th>Reg#</th>
                                            <td>{admissionData.register_no}</td>
                                            <th>Old_Reg#</th>
                                            <td>{admissionData.old_register_no}</td>
                                        </tr>
                                        <tr>
                                            <th>Name</th>
                                            <td>{admissionData.full_name}</td>
                                            <th>Class</th>
                                            <td>{`${admissionData.class_name} (${admissionData.section_name})`}</td>
                                            <th className='text-primary'>Category</th>
                                            <td className='text-primary'>{admissionData.category_name}</td>
                                        </tr>
                                        <tr>
                                            <th>Adm Date</th>
                                            <td>{formatDate(admissionData.admission_date)}</td>
                                            <th>Shift</th>
                                            <td>{admissionData.shift}</td>
                                            <th>Gender</th>
                                            <td>{admissionData.gender}</td>
                                        </tr>
                                        <tr>
                                            <th>DOB</th>
                                            <td>{formatDate(admissionData.dob)}</td>
                                            <th>Religion</th>
                                            <td>{admissionData.religion}</td>
                                            <th>Cast</th>
                                            <td>{admissionData.cast}</td>
                                        </tr>
                                        <tr>
                                            <th>BG</th>
                                            <td>{admissionData.blood_group}</td>
                                            <th>M_Tongue</th>
                                            <td>{admissionData.mother_tongue}</td>
                                            <th>C_Address</th>
                                            <td>{admissionData.current_address}</td>
                                        </tr>
                                        <tr>
                                            <th>P_Address</th>
                                            <td>{admissionData.permanent_address}</td>
                                            <th>Mobile No</th>
                                            <td>{admissionData.mobile_no}</td>
                                            <th>Student CNIC</th>
                                            <td>{admissionData.student_cnic}</td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td>{admissionData.status}</td>
                                            <th>Father CNIC</th>
                                            <td>{admissionData.father_cnic}</td>
                                            {/* <th>Mobile#</th>
                                            <td>{admissionData.father_mobile_no}</td> */}
                                            <th>Bus Status</th>
                                            <td>{admissionData.bus_status || '-'}</td>
                                        </tr>
                                        <tr>
                                            
                                            <th>Bus Fee</th>
                                            <td>{admissionData.bus_fee || 0}</td>
                                            <th>Pendency Status</th>
                                            <td>{admissionData.status_for_pendings || '-'}</td>
                                            <th>User Name</th>
                                            <td>{admissionData.username || '-'}</td>
                                        </tr>
                                    </tbody>

                                    <thead>
                                        <tr>
                                            <th colSpan="6" style={{ background: '#ddd' }}>
                                                Guardian Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <td>{admissionData.guardian_name}</td>
                                            <th>Relation</th>
                                            <td>{admissionData.relation}</td>
                                            <th>Occupation</th>
                                            <td>{admissionData.occupation}</td>
                                        </tr>
                                        <tr>
                                            <th>Mobile No</th>
                                            <td>{admissionData.guardian_mobile_no}</td>
                                            <th>Address</th>
                                            <td>{admissionData.guardian_address}</td>
                                            <th>CNIC</th>
                                            <td>{admissionData.guardian_cnic}</td>
                                        </tr>
                                        {admissionData.pl_no && (
                                            <tr>
                                                <th>PL No</th>
                                                <td>{admissionData.pl_no}</td>
                                                <th>Designation</th>
                                                <td>{admissionData.designation}</td>
                                                <th>Department</th>
                                                <td>{admissionData.department}</td>
                                            </tr>
                                        )}
                                    </tbody>

                                    <thead>
                                        <tr>
                                            <th colSpan="6" style={{ background: '#ddd' }}>
                                                Father Job Detail (If POF)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>PL No</th>
                                            <td>{admissionData.pl_no || '-'}</td>
                                            <th>Designation</th>
                                            <td>{admissionData.designation || '-'}</td>
                                            <th>Department</th>
                                            <td>{admissionData.department || '-'}</td>
                                        </tr>

                                         <tr>
                                            <th>House</th>
                                            <td>{admissionData.house_name || '-'}</td>
                                             <th>Club</th>
                                            <td>{admissionData.club_name || '-'}</td>
                                        </tr>

                                    </tbody>
                                </table>

                                <table class='admission_detail' style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan="10" style={{ background: '#ddd' }}>
                                                Student Voucher Ledger
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Month</th>
                                            <th>Advance</th>
                                            {/* <th>Arrears</th> */}
                                            <th>T.Amount</th>
                                            <th>Due Date</th>
                                            <th>Received Payment</th>
                                            <th>Payment Date</th>
                                            <th>Status</th>
                                            <th>Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voucherData.length > 0 ? (
                                            <>
                                                {voucherData
                                                    .filter(voucher => voucher.for_the_month && voucher.for_the_month.length > 0) // Filter rows based on for_the_month
                                                    .map((voucher, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{voucher.for_the_month}</td> {/* Display for_the_month since we know it's valid */}
                                                            <td>{voucher.first_advance_payment !== null ? voucher.first_advance_payment : 0}</td>
                                                            {/* <td>{voucher.arrears !== null ? voucher.arrears : 0}</td> */}
                                                            <td>{voucher.total_amount !== null ? voucher.total_amount : 0}</td>
                                                            <td>{voucher.due_date ? convertDates(voucher.due_date) : '-'}</td>
                                                            <td>{voucher.recieved_payment !== null ? voucher.recieved_payment : 0}</td>
                                                            <td>{voucher.payment_date ? convertDates(voucher.payment_date) : '-'}</td>
                                                            <td style={{ color: voucher.fee_status === 'paid' ? 'green' : 'red' }}>
                                                                {voucher.fee_status || '-'}
                                                            </td>
                                                            <td>{voucher.fee_status === 'paid' ? 0 : voucher.total_amount}</td>
                                                        </tr>
                                                    ))}
                                                <tr>
                                                    <td colSpan="8" className="text-right"><strong>Remaining:</strong></td>
                                                    <td>
                                                        <strong>
                                                             {voucherData
                                                                .filter(voucher => voucher.for_the_month && voucher.for_the_month.length >= 0) // Apply the same filter for grand total
                                                                .reduce((total, voucher) => total + (voucher.fee_status == 'paid' ? 0 : voucher.total_amount), 0)
                                                            }
                                                        </strong>
                                                    </td>
                                                </tr>
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan="9" style={{ textAlign: 'center' }}>No vouchers exist</td>
                                            </tr>
                                        )}
                                    </tbody>


                                </table>


                                 <table class='admission_detail' style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan="10" style={{ background: '#ddd' }}>
                                                Student Activities
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Activity Type</th>
                                            <th>Position</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {activitiesData.length > 0 ? (
                                            <>
                                                {activitiesData
                                                .map((voucher, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{convertDates(voucher.activity_date)}</td> {/* Display for_the_month since we know it's valid */}
                                                            <td>{voucher.name}</td>
                                                            <td>{voucher.activity_type}</td>
                                                            <td>{voucher.position}</td>
                                                            <td>{voucher.remarks}</td>
                                                        </tr>
                                                    ))}
                                               
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center' }}>No Activity exist</td>
                                            </tr>
                                        )}

                                    </tbody>
                                    </table>


                                    <table class='admission_detail' style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan="10" style={{ background: '#ddd' }}>
                                                Student Discipline
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Date.Of.Incident</th>
                                            <th>Type.of.Incident</th>
                                            <th>Action</th>
                                            <th>Description</th>
                                            <th>Reporting.Teacher</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {disciplineData.length > 0 ? (
                                            <>
                                                {disciplineData
                                                .map((voucher, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{convertDates(voucher.date_of_incident)}</td> {/* Display for_the_month since we know it's valid */}
                                                            <td>{voucher.type_of_incident}</td>
                                                            <td>{voucher.action_taken}</td>
                                                            <td>{voucher.description}</td>
                                                            <td>{voucher.reporting_teacher}</td>
                                                        </tr>
                                                    ))}
                                               
                                            </>
                                        ) : (
                                            <tr>
                                               <td colSpan="6" style={{ textAlign: 'center' }}>No Disciplinary Action Exist</td>
                                            </tr>
                                        )}

                                    </tbody>
                                    </table>



                            </div>
                        </div>
                    </div>
                )
            }


            { showCategorySummary && (
                    <div
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '100',
                            backdropFilter: 'blur(10px)',
                            minWidth: '350px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '1500px'
                        }}
                    >
                        <style>
                            {`
                    /* Custom scrollbar styles */
                    div::-webkit-scrollbar {
                        width: 8px;
                    }

                    div::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }

                    div::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }

                    div::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }

                    table#category_summary {
                        border: 1px solid black;
                        border-collapse: collapse;
                    }

                    table#category_summary th, table#category_summary td {
                        border: 1px solid gray;
                        padding: 10px !important;
                    }
                `}
                        </style>

                        {/* Close Button */}
                        <button
                            onClick={handleHide}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                zIndex: '200', // Ensures it stays on top of other elements
                            }}
                        >
                            &times;
                        </button>

                        {/* Non-Scrollable Heading */}
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: '#007bff',
                                padding: '5px',
                                borderBottom: '1px solid #ddd',
                                position: 'sticky',
                                top: '0',
                                zIndex: '150',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#ffc107'
                            }}
                        >
                            Grand Report (Category Wise Summary Report)
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                            <table id="category_summary" style={{ "width": "100%" }} border="1" cellPadding="10">
                               
                               <thead style={{ 
                                    position: "sticky", 
                                    top: "0", 
                                    backgroundColor: "white", 
                                    // zIndex: 10,  // No quotes needed for numbers
                                    backgroundColor: 'rgb(211, 211, 211)'
                                }}>
                                    <tr>
                                        <th>Class</th>
                                        <th>Section</th>
                                        {uniqueCategories.map((category, index) => (
                                            <th key={index}>{category}</th>
                                        ))}
                                        <th style={{ backgroundColor: 'rgb(211,211,211)' }}>Male</th>
                                        <th style={{ backgroundColor: 'rgb(211,211,211)' }}>Female</th>
                                        <th>Total Students</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(groupedData).map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.class}</td>
                                            <td>{item.section}</td>
                                            {uniqueCategories.map((category) => (
                                                <td key={category}>
                                                    {item.categories[category] || 0}
                                                </td>
                                            ))}
                                            <td style={{ backgroundColor: 'rgb(211,211,211,1)' }}>{item.male_students}</td> {/* Display male students */}
                                            <td style={{ backgroundColor: 'rgb(211,211,211,1)' }}>{item.female_students}</td> {/* Display female students */}
                                            <td>{item.total_students}</td> {/* Display total students */}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                                        <td colSpan="2" style={{ fontWeight: 'bold' }}>Grand Total</td>
                                        {uniqueCategories.map((category) => {
                                            const totalForCategory = Object.values(groupedData).reduce(
                                                (sum, item) => sum + (item.categories[category] || 0),
                                                0
                                            );
                                            return (
                                                <td key={category} style={{ fontWeight: 'bold' }}>
                                                    {totalForCategory}
                                                </td>
                                            );
                                        })}
                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(211,211,211,1)' }}>
                                            {Object.values(groupedData).reduce((sum, item) => sum + item.male_students, 0)}
                                        </td>
                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(211,211,211,1)' }}>
                                            {Object.values(groupedData).reduce((sum, item) => sum + item.female_students, 0)}
                                        </td>
                                        <td style={{ fontWeight: 'bold' }}>
                                            {Object.values(groupedData).reduce((sum, item) => sum + item.total_students, 0)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                    </div>
                )
            }






            {
                showNewAdmissionSummary && (
                    <div
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '100',
                            backdropFilter: 'blur(10px)',
                            minWidth: '350px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '1000px'
                        }}
                    >
                        <style>
                            {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
              width: 8px;
          }
          div::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
              background: #555;
          }
          table#admission_Summary {
              border: 1px solid black;
              border-collapse: collapse;
          }
          table#admission_Summary th, table#admission_Summary td {
              border: 1px solid gray;
              padding: 10px !important;
          }
        `}
                        </style>

                        {/* Close Button */}
                        <button
                            onClick={handleHide}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                zIndex: '200', // Ensures it stays on top of other elements
                            }}
                        >
                            &times;
                        </button>

                        {/* Non-Scrollable Heading */}
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: '#007bff',
                                padding: '5px',
                                borderBottom: '1px solid #ddd',
                                position: 'sticky',
                                top: '0',
                                zIndex: '150',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#ffc107',
                            }}
                        >
                            Grand Report (New Admissions Summary)
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                            <table id="admission_Summary" border="1" cellPadding="10" style={{ "width": "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Class</th>
                                        <th>Strength</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newAdmissionSummaryData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.class}</td>
                                            <td>{item.total_students}</td>
                                        </tr>
                                    ))}
                                    {/* Grand Total Row */}
                                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                                        <td colSpan="2" style={{ textAlign: 'right' }}>Grand Total</td>
                                        <td>
                                            {newAdmissionSummaryData.reduce((total, item) => total + item.total_students, 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }







            {
                showStatusWiseSummary && (
                    <div
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '100',
                            backdropFilter: 'blur(10px)',
                            minWidth: '350px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '1500px'
                        }}
                    >
                        <style>
                            {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
              width: 8px;
          }
          div::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
              background: #555;
          }
          table#status_Summary {
              border: 1px solid black;
              border-collapse: collapse;
          }
          table#status_Summary th, table#status_Summary td {
              border: 1px solid gray;
              padding: 10px !important;
          }
        `}
                        </style>

                        {/* Close Button */}
                        <button
                            onClick={handleHide}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                zIndex: '200',
                            }}
                        >
                            &times;
                        </button>

                        {/* Non-Scrollable Heading */}
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: '#007bff',
                                padding: '5px',
                                borderBottom: '1px solid #ddd',
                                position: 'sticky',
                                top: '0',
                                zIndex: '150',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#ffc107',
                            }}
                        >
                            Grand Report (Status Wise Summary)
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                            <table id="status_Summary" border="1" cellPadding="10" style={{ "width": "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Sl.</th>

                                        <th>Grade</th>
                                        <th>Section</th>
                                        <th>New Admission</th>
                                        <th>SLC</th>
                                        <th>Struck Off</th>
                                        <th>Promoted</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedArray.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.class}</td>
                                            <td>{item.section_name}</td>
                                            <td>{item.new_admission}</td>
                                            <td>{item.slc}</td>
                                            <td>{item.struck_off}</td>
                                            <td>{item.promoted}</td>
                                            <td>{item.total_students}</td>
                                        </tr>
                                    ))}
                                    {/* Total row */}
                                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                                        <td colSpan="3" style={{ textAlign: 'center', fontWeight: 'bold' }}>Total</td>
                                        <td style={{ fontWeight: 'bold' }}>{calculateTotal('new_admission')}</td>
                                        <td style={{ fontWeight: 'bold' }}>{calculateTotal('slc')}</td>
                                        <td style={{ fontWeight: 'bold' }}>{calculateTotal('struck_off')}</td>
                                        <td style={{ fontWeight: 'bold' }}> {calculateTotal('promoted')}</td>
                                        <td style={{ fontWeight: 'bold' }}>{calculateTotal('total_students')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }




            {
                showNewSlcSummary && (
                    <div
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '100',
                            backdropFilter: 'blur(10px)',
                            minWidth: '350px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '1200px',
                        }}
                    >
                        <style>
                            {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          table#SLC_Summary {
            border: 1px solid black;
            border-collapse: collapse;
          }
          table#SLC_Summary th, table#SLC_Summary td {
            border: 1px solid gray;
            padding: 10px !important;
          }
        `}
                        </style>

                        {/* Close Button */}
                        <button
                            onClick={handleHide}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                zIndex: '200', // Ensures it stays on top of other elements
                            }}
                        >
                            &times;
                        </button>

                        {/* Non-Scrollable Heading */}
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: '#007bff',
                                padding: '5px',
                                borderBottom: '1px solid #ddd',
                                position: 'sticky',
                                top: '0',
                                zIndex: '150',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#ffc107',
                            }}
                        >
                            Grand Report (SLC Summary)
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                            <table id="SLC_Summary" border="1" cellPadding="10" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Class</th>
                                        <th>Strength</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slcSummaryData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.class}</td>
                                            <td>{item.total_students}</td>
                                        </tr>
                                    ))}
                                    {/* Grand Total Row */}
                                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                                        <td colSpan="2" style={{ textAlign: 'right' }}>Grand Total</td>
                                        <td>
                                            {slcSummaryData.reduce((total, item) => total + item.total_students, 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }






            {
                showStruckOffSummary && editFormData.summary_report =='struck_off_summary' && (
                    <div
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '100',
                            backdropFilter: 'blur(10px)',
                            minWidth: '350px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '1200px',
                        }}
                    >
                        <style>
                            {`
          /* Custom scrollbar styles */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          table#SruckOff_Summary {
            border: 1px solid black;
            border-collapse: collapse;
          }
          table#SruckOff_Summary th, table#SruckOff_Summary td {
            border: 1px solid gray;
            padding: 10px !important;
          }
        `}
                        </style>

                        {/* Close Button */}
                        <button
                            onClick={handleHide}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                zIndex: '200', // Ensures it stays on top of other elements
                            }}
                        >
                            &times;
                        </button>

                        {/* Non-Scrollable Heading */}
                        <div
                            style={{
                                width: '100%',
                                backgroundColor: '#007bff',
                                padding: '5px',
                                borderBottom: '1px solid #ddd',
                                position: 'sticky',
                                top: '0',
                                zIndex: '150',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#ffc107',
                            }}
                        >
                            Grand Report (Struck Off Summary)
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                            <table id="SruckOff_Summary" border="1" cellPadding="10" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>Sr#</th>
                                        <th>Class</th>
                                        <th>Strength</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {StruckOffSummaryData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.class}</td>
                                            <td>{item.total_students}</td>
                                        </tr>
                                    ))}
                                    {/* Grand Total Row */}
                                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                                        <td colSpan="2" style={{ textAlign: 'right' }}>Grand Total</td>
                                        <td>
                                            {
                                                StruckOffSummaryData.reduce((total, item) => total + item.total_students, 0)
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }






            {
    showStruckOffSummary && editFormData.summary_report == 'view_house_and_club_report' && (
        <div
            style={{
                border: '1px solid #ddd',
                padding: '10px',
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: '100',
                backdropFilter: 'blur(10px)',
                width: '80%',
                maxHeight: '80vh',
                overflowY: 'auto',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <style>
                {`
                    /* Custom scrollbar styles */
                    div::-webkit-scrollbar {
                        width: 8px;
                    }
                    div::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 10px;
                    }
                    div::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                    table#SruckOff_Summary {
                        border: 1px solid black;
                        border-collapse: collapse;
                    }
                    table#SruckOff_Summary th, table#SruckOff_Summary td {
                        border: 1px solid gray;
                        padding: 10px !important;
                    }
                `}
            </style>

            {/* Close Button */}
            <button
                onClick={handleHide}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: '200',
                }}
            >
                &times;
            </button>

            {/* Non-Scrollable Heading */}
            <div
                style={{
                    width: '100%',
                    backgroundColor: '#007bff',
                    padding: '5px',
                    borderBottom: '1px solid #ddd',
                    position: 'sticky',
                    top: '0',
                    zIndex: '150',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ffc107',
                }}
            >
                Grand Report (House And Club)
            </div>

            {/* Search Filter */}
            <div style={{
                width: '100%',
                padding: '10px 20px',
                position: 'sticky',
                top: '50px',
                backgroundColor: 'white',
                zIndex: '140',
                borderBottom: '1px solid #eee'
            }}>
                <input
                    type="text"
                    placeholder="Search by name, class, house, or club..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 15px',
                        // borderRadius: '20px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        outline: 'none',
                        // boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                />
            </div>

            {/* Scrollable Content */}
            <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                <table id="SruckOff_Summary" border="1" cellPadding="10" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Sr#</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Name</th>
                            <th>House</th>
                            <th>Club</th>
                        </tr>
                    </thead>
                    <tbody>
                      {StruckOffSummaryData
    .filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            matchesSearch(item.class_name, term) ||
            matchesSearch(item.section_name, term) ||
            matchesSearch(item.full_name, term) ||
            matchesSearch(item.house_name, term) ||
            matchesSearch(item.club_name, term)
        );
    })
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.class_name}</td>
                                    <td>{item.section_name}</td>
                                    <td>{item.full_name}</td>
                                    <td>{item.house_name}</td>
                                    <td>{item.club_name}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}





            {
                showSLCData && getSLCdata && (
                    <div className="col-12">
                        <div
                            className="slc-container"
                            ref={componentRef}
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                position: 'fixed',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: '100',
                                backdropFilter: 'blur(10px)',
                                minWidth: '350px',
                                maxHeight: '80vh',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <style>
                                {`
                        /* Custom scrollbar styles */
                        div::-webkit-scrollbar {
                            width: 8px;
                        }

                        div::-webkit-scrollbar-track {
                            background: #f1f1f1;
                            border-radius: 10px;
                        }

                        div::-webkit-scrollbar-thumb {
                            background: #888;
                            border-radius: 10px;
                        }

                        div::-webkit-scrollbar-thumb:hover {
                            background: #555;
                        }

                      
                    `}
                            </style>

                            {/* Fixed Close Button */}
                            <button
                                onClick={handleHide}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    zIndex: '200', // Ensures it stays on top of other elements
                                }}
                            >
                                &times;
                            </button>

                            {/* Non-Scrollable Heading */}


                            <div
                                style={{
                                    // border: '2px solid #ccc',
                                    // borderRadius: '10px',
                                    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    width: '170px',
                                    height: '170px',
                                    // overflow: 'hidden',
                                    // marginTop: "20px"
                                }}
                                
                            >

                                <div style={{ marginTop: '10px', zIndex:'1000' }} >
                                    <img
                                        src={process.env.REACT_APP_BASE_URL+`/uploads/logo.png`}
                                        style={{ width: '100%', height: '100%'}}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>


                            </div>


                            <header className="slc-header mt-5">


                                <h1 style={{"textDecoration": "underline"}}>Student Leaving Certificate</h1>
                            </header>



                            {/* Scrollable Content */}
                            <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                                <main className="slc-content">
                                    <section className="slc-details">
                                        <p><strong>Certificate No:</strong> {getSLCdata.slc_invoice_no}</p>
                                        <p><strong>Registration No:</strong> {getSLCdata.register_no}</p>
                                        <p><strong>Shift:</strong> {getSLCdata.shift}</p>
                                        <p><strong>School Name:</strong> Sir Syed School {getSLCdata.campus_name}</p>
                                    </section>

                                    <section className="slc-statement">
                                        <p>This is to certify that <strong>{getSLCdata.full_name}</strong>, daughter/son of <strong>{getSLCdata.father_name}</strong>,
                                            was a bonafide student of <strong>{getSLCdata.campus_name}</strong>,
                                            studying in class <strong>{getSLCdata.class_name}</strong> (<strong>{getSLCdata.section_name})</strong>.His/Her Date of Birth is <strong>{new Date(getSLCdata.dob).toLocaleDateString('en-GB')}</strong>.
                                            The student has been granted a School Leaving Certificate on <strong>{new Date(getSLCdata.status_date).toLocaleDateString('en-GB')}</strong>.All dues have been paid up to {new Date(`${getSLCdata.for_the_month}-01`).toLocaleString('en-US', { month: 'long' })}-{new Date(getSLCdata.for_the_month).getFullYear()}</p>
                                    </section>
                                </main>
                            </div>

                            <footer className="slc-footer">
                            <p><strong>Date Issued:</strong> {new Date().toLocaleDateString('en-GB')}</p>

                                <div className="slc-signatures">
                                    <div><strong>Guardian's Signature:</strong>&nbsp;________________</div>
                                    <div style={{textAlign:"right"}}><strong>Principal's Signature:</strong>&nbsp;________________</div>
                                </div>

                            </footer>

                            <button onClick={handlePrint} className="btn btn-warning btn-sm mt-2">
                                <i className="fa fa-print" aria-hidden="true"></i> Print
                            </button>
                        </div>

                    </div>
                )
            }



        </div>


    );






};

export default AdmissionList;

