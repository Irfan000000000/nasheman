import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import AcademicSessionContext from './AcademicSessionContext';
import { useAuth } from './AuthContext';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactToPrint } from 'react-to-print';

const EmployeeList = () => {


    // const initialSession = {
    //     session_id: '',
    // };



    const initialFormData = {
        employee_role_id: '',
        employee_post_id: '',
        pay_scale_id: '',
        status: '',
        from_date: '',
        to_date: '',
        search: ''
    };



      const convertDates = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };


    const [editFormData, setEditFormData] = useState(initialFormData);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItemGet] = useState(10);
    const [data, setData] = useState([]);
    // const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);

               const [disciplineData, setDisciplineData] = useState([]);

    const [getEmployeeRoles, setEmployeeRoles] = useState([]);

    const [getEmployeePost, setEmployeePost] = useState([]);

    const [getEmployeeScale, setEmployeeScale] = useState([]);


    // const [getSession, setSession] = useState(initialSession);

    // const [getCategories, setCategories] = useState([]);


    // const [getClasses, setClasses] = useState([]);

    // const [getSections, setSections] = useState([]);


    // const [getCategoryData, setCategoryData] = useState([]);


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



    // const [admission, setAdmission] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (academicSession) {
    //         setSession(prevFormData => ({
    //             ...prevFormData,
    //             session_id: parseInt(academicSession)
    //         }));
    //     }
    // }, [academicSession]);



    useEffect(() => {
        const fetchEmployeeRoles = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/employee-roles`)
                .then(res => {

                    setEmployeeRoles(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchEmployeeRoles(user.user.campus_id);
        }
    }, [user]); // Depende



    const [report, getAllReports] = useState({
        from_date: '',
        to_date: '',
        report_type: ''
    });




    const [employeeData, setEmployeeData] = useState(null);
    const [employeeServiceBookData, setEmployeeServiceBookData] = useState(null);

    const [getSLCdata, setSLCData] = useState(null);


    const [showData, setShowData] = useState(false);

    const [showSLCData, setSLCShow] = useState(false);

    const view = (employee_id, campus_id, session_id) => {

        axios.get(process.env.REACT_APP_API_BASE_URL+`/view-employee/${employee_id}/${campus_id}`)
            .then(response => {
              
                setEmployeeData(response.data.employeeData);
                setEmployeeServiceBookData(response.data.employeeData.serviceBook);
                setDisciplineData(response.data.employeeData.disciplineRecords)
                setShowData(true);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };


    const handleHide = () => {
        setShowData(false);
        setSLCShow(false);
        setEmployeeData(null);
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

    const edit = (employee_id) => {

        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-employee/${employee_id}`)
            .then(response => {

                const employeeData = response.data;
                console.log(employeeData);
                localStorage.setItem('employee', JSON.stringify(employeeData));
                navigate('/employee-form/edit');

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











    const deleteData = employee_id => {
        const confirmDeletion = window.confirm('Deleted! Are you sure?');
        if (confirmDeletion) {
            axios
                .delete(process.env.REACT_APP_API_BASE_URL+`/delete-employee/${employee_id}`)
                .then(response => {
                    console.log('Admission deleted successfully:', response.data);
                    // Update the state to remove the deleted admission
                    setData(prevData => prevData.filter(employees => employees.id !== employee_id));
                })
                .catch(error => {
                    console.error('Error deleting Admission:', error);
                });
        }
    };



    const fetchData = () => {
        setLoading(true);
        axios.get(process.env.REACT_APP_API_BASE_URL+"/employee-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                from_date: editFormData.from_date,
                to_date: editFormData.to_date,
                role_id: editFormData.employee_role_id,
                post_id: editFormData.employee_post_id,
                pay_scale_id: editFormData.pay_scale_id,
                status: editFormData.status,
                search: editFormData.search,
                session_id: academicSession,
                campus_id: user.user.campus_id
            }
        })
            .then(res => {
                console.log(res.data.results);
                setData(res.data.results);
                // setTotalCount(res.data.overallTotal);
                totalPagesGet(res.data.totalPages);
                // setCategoryData(res.data.categoryCounts);

                console.log(res.data.categoryCounts);

                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (academicSession) {
            fetchData();
        }
    }, [academicSession, currentPage, totalItem]);

    const searchData = () => {
        setLoading(true);
        fetchData();
    };


    function getAdmissionExcelReport() {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/employee-excel-report", {
            params: {
                page: currentPage,
                limit: totalItem,
                from_date: editFormData.from_date,
                to_date: editFormData.to_date,
                role_id: editFormData.role_id,
                post_id: editFormData.post_id,
                pay_scale_id: editFormData.pay_scale_id,
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
        const fetchEmployeePost = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/employee-post`)
                .then(res => {

                    setEmployeePost(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchEmployeePost(user.user.campus_id);
        }
    }, []); // Dependencies array to re-run the effect when user changes




    useEffect(() => {
        const getEmployeeScale = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/employee-scale`)
                .then(res => {
                    // console.log(res.data.results)
                    setEmployeeScale(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user) {
            getEmployeeScale();
        }
    }, []); // Dependencies array to re-run the effect when user changes





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

    return (
        <div className="employee-list">
            <div className="employee-list__inner">
                <div className="employee-list__header">
                    <div className="employee-list__header-title">
                        <i className="fas fa-users"></i> Employee List
                    </div>
                </div>

                <div className="employee-list__filters">
                    <div className="row employee-list__filter-grid">
        {/* Date Inputs */}
        {/* <div className="col-12 col-md-2 mb-2">
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
        </div> */}

        {/* Employee Role Selector */}
        <div className="col-12 col-md-2 mb-2">
            <Select
                options={getEmployeeRoles.map(role => ({ value: role.id, label: role.employee_role }))}
                value={
                    editFormData.employee_role_id
                        ? { value: editFormData.employee_role_id, label: getEmployeeRoles.find(role => role.id === editFormData.employee_role_id)?.employee_role || "" }
                        : null
                }
                onChange={(selectedOption) => setEditFormData({ ...editFormData, employee_role_id: selectedOption ? selectedOption.value : "" })}
                placeholder="Select Role"
            />
        </div>

        {/* Employee Post Selector */}
        <div className="col-12 col-md-2 mb-2">
            <Select
                options={getEmployeePost.map(post => ({ value: post.id, label: post.employee_post }))}
                value={
                    editFormData.employee_post_id
                        ? { value: editFormData.employee_post_id, label: getEmployeePost.find(post => post.id === editFormData.employee_post_id)?.employee_post || "" }
                        : null
                }
                onChange={(selectedOption) => setEditFormData({ ...editFormData, employee_post_id: selectedOption ? selectedOption.value : "" })}
                placeholder="Select Post"
            />
        </div>

        {/* Pay Scale Selector */}
        <div className="col-12 col-md-2 mb-2">
            <Select
                options={getEmployeeScale.map(scale => ({ value: scale.id, label: scale.pay_scale + " (" + scale.job_type+")" }))}
                // value={
                //     editFormData.pay_scale_id
                //         ? { value: editFormData.pay_scale_id, label: getEmployeeScale.find(scale => scale.id === editFormData.pay_scale_id)?.pay_scale || "" }
                //         : null
                // }
                value={
                    editFormData.pay_scale_id
                        ? {
                            value: editFormData.pay_scale_id,
                            label: getEmployeeScale.find(scale => scale.id === editFormData.pay_scale_id)
                                ? `${getEmployeeScale.find(scale => scale.id === editFormData.pay_scale_id).pay_scale} (${getEmployeeScale.find(scale => scale.id === editFormData.pay_scale_id).job_type})`
                                : ""
                        }
                        : null
                }
                onChange={(selectedOption) => setEditFormData({ ...editFormData, pay_scale_id: selectedOption ? selectedOption.value : "" })}
                placeholder="Select Scale"
            />
        </div>

        {/* Status Selector */}
        <div className="col-12 col-md-2 mb-2">
            <select
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                className="form-control"
                id="status"
                name="status"
                value={editFormData.status}
            >
                <option value="">Select Status</option>
                <option value="On">On</option>
                <option value="Retire">Retire</option>
                <option value="Resign">Resign</option>
                <option value="Terminate">Terminate</option>
            </select>
        </div>

        {/* Search Input */}
        {/* <div className="col-12 col-md-2 mb-2">
            <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={editFormData.search}
                onChange={(e) => setEditFormData({ ...editFormData, search: e.target.value })}
            />
        </div> */}


        <div className="col-12 col-md-2 mb-2">
  <input
    type="text"
    placeholder="Search..."
    className="form-control"
    value={editFormData.search || ''}
    onChange={(e) => setEditFormData({ ...editFormData, search: e.target.value })}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        fetchData(); // Call your fetch function when Enter is pressed
      }
    }}
  />
</div>

        {/* Report Type Selector */}
        <div className="col-12 col-md-2 mb-2">
            <select
                name="type"
                id="type"
                className="form-control"
                onChange={(e) => getAllReports({ ...report, report_type: e.target.value })}
            >
                <option value="">Select Report</option>
                <option value="excel">Excel</option>
            </select>
        </div>

      

        {/* Action Buttons */}
        <div className="col-12 col-md-2 mb-2">
            <button className="btn btn-warning btn-block" onClick={getReport}>Get Report</button>
        </div>
        <div className="col-12 col-md-2 mb-2">
            <button className="btn btn-secondary btn-block" onClick={resetStates}>Reset</button>
        </div>
        <div className="col-12 col-md-2 mb-2">
            <button className="btn btn-danger btn-block" onClick={searchData}>Search</button>
        </div>
    </div>
</div>


                    {/* <div className="border p-2">

                        <div className="d-flex justify-content-center">
                            {/* <div className="me-2 mr-2">
                                <input type="date" className="form-control" id="from_date" value={editFormData.from_date} onChange={(e) => setEditFormData({ ...editFormData, from_date: e.target.value })} />
                            </div>
                            <div className="me-2 mr-2">
                                <input type="date" className="form-control" id="to_date" value={editFormData.to_date} onChange={(e) => setEditFormData({ ...editFormData, to_date: e.target.value })} />
                            </div> 


                            <div className="col-md-2 p-1" >

                                <Select
                                    options={getEmployeeRoles.map(role => ({ value: role.id, label: role.employee_role }))}
                                    value={
                                        editFormData.employee_role_id
                                            ? { value: editFormData.employee_role_id, label: getEmployeeRoles.find(role => role.id === editFormData.employee_role_id)?.employee_role || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => setEditFormData({ ...editFormData, employee_role_id: selectedOption ? selectedOption.value : "" })}
                                    placeholder="Select Role"
                                />
                            </div>



                            <div className="col-md-2 p-1">

                                <Select
                                    options={getEmployeePost.map(post => ({ value: post.id, label: post.employee_post }))}
                                    value={
                                        editFormData.employee_post_id
                                            ? { value: editFormData.employee_post_id, label: getEmployeePost.find(post => post.id === editFormData.employee_post_id)?.employee_post || "" }
                                            : null
                                    }
                                    onChange={(selectedOption) => setEditFormData({ ...editFormData, employee_post_id: selectedOption ? selectedOption.value : "" })}
                                    placeholder="Select Post"
                                />
                            </div>


                            <div  className="col-md-2 p-1">

                                <Select
                                    options={getEmployeeScale.map(scale => ({
                                        value: scale.id,
                                        label: scale.pay_scale
                                    }))}
                                    value={
                                        editFormData.pay_scale_id
                                            ? {
                                                value: editFormData.pay_scale_id,
                                                label: getEmployeeScale.find(scale => scale.id === editFormData.pay_scale_id)?.pay_scale || ""
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setEditFormData({ ...editFormData, pay_scale_id: selectedOption ? selectedOption.value : "" })
                                    }
                                    placeholder="Select Scale"
                                />
                            </div>


                            <div className="col-md-2 p-1">

                                <select
                                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                    className={'form-control'}
                                    id="status"
                                    name="status"
                                    value={editFormData.status}>
                                    <option value="">Select Status</option> {/* Default option 
                                    <option value="On">On</option>
                                    <option value="Retire">Retire</option>
                                    <option value="Resign">Resign</option>
                                    <option value="Terminate">Terminate</option>
                                </select>
                            </div>




                            <div  className="col-md-2 p-1">
                                <input type="text" placeholder='Search.........' className="form-control" value={editFormData.search} // Make sure input value is controlled
                                    onChange={(e) => setEditFormData({ ...editFormData, search: e.target.value })} />
                            </div>




                            <button className="btn btn-sm btn-danger" onClick={searchData} >Search</button>


                            <div className="ml-2">
                                <select name="type" id="type" className="form-control" onChange={(e) => getAllReports({ ...report, report_type: e.target.value })}>
                                    <option value="">Select Report</option>
                                    <option value="excel">Excel</option>
                                    {/* <option value="pdf">PDF</option> 
                                </select>
                            </div>

                            <button className="btn btn-sm btn-warning ml-2" onClick={getReport}>Get Report</button>


                            <button className="btn btn-sm btn-secondary ml-2" onClick={resetStates}>Reset</button>

                        </div>
                    </div> */}


                    <div className='employee-list__table-section'>
                        <div className='employee-list__pagesize'>
                            <label className='employee-list__pagesize-label'>Show</label>
                            <select value={totalItem} onChange={handleTotalItemChange} className='employee-list__pagesize-select'>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                            <span className='employee-list__pagesize-suffix'>per page</span>
                        </div>
                        <div className='table-responsive employee-list__table-wrap'>
                        <table className='table employee-list__table'>
                            <thead>
                                <tr>
                                    <th>Sr#</th>
                                    <th>Reg#</th>
                                    <th>Appoint. Date</th>
                                    <th>Name</th>
                                    <th>Post</th>
                                    <th>Role</th>
                                    <th>Scale</th>
                                    <th>Job Type</th>
                                    <th>Mobile#</th>
                                    <th>Gender</th>
                                    <th className='text-center'>View</th>
                                    <th className='text-center'>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="12" className='text-center'>Loading…</td>
                                    </tr>
                                ) : (
                                    data.map((employee, index) => (
                                        <tr key={index}>
                                            <td data-label="Sr#">{index+1}</td>
                                            <td data-label="Reg#">{employee.register_no}</td>
                                            <td data-label="Appoint. Date">{formatDate(employee.appointment_date)}</td>
                                            <td data-label="Name">{employee.full_name}</td>
                                            <td data-label="Post">{employee.employee_post}</td>
                                            <td data-label="Role">{employee.employee_role}</td>
                                            <td data-label="Scale">{employee.pay_scale}</td>
                                            <td data-label="Job Type">{employee.job_type}</td>
                                            <td data-label="Mobile#">{employee.mobile_no}</td>
                                            <td data-label="Gender">{employee.gender}</td>

                                            <td className='text-center' data-label="View">
                                                <button className='btn btn-warning btn-sm' onClick={() => view(employee.id, employee.campus_id)}><i className="fas fa-eye"></i></button>
                                            </td>
                                            <td className='text-center' data-label="Edit">
                                                <button className='btn btn-success btn-sm' onClick={() => edit(employee.id)}><i className="fas fa-edit"></i></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </div>
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

                    {/* <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            {getCategoryData && getCategoryData.map((item, index) => (
                                <td key={index} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    <strong>{item.category}</strong>: {item.category_count}
                                </td>
                            ))}
                        </tr>
                    </table> */}
                </div>

            {
    showData && employeeData && (
        <div className="employee-list__view-wrap">
            <div className="employee-view__backdrop" onClick={handleHide}></div>
            <div
                className="employee-view-modal"
                style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1100,
                    backdropFilter: 'blur(10px)',
                    minWidth: '350px',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 18px 50px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width:'min(1800px, 96vw)'
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
                        width: 100%;
                        table-layout: fixed; /* Ensures both tables take up equal space */
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
                    className="employee-view__close"
                    aria-label="Close"
                >
                    &times;
                </button>

                {/* Non-Scrollable Heading */}
                <div className="employee-view__header">
                    <i className="fas fa-user-tie"></i> Employee Detail
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
                            {employeeData.profile_image && (
                                <div style={{ marginTop: '10px' }}>
                                    <img
                                        src={process.env.REACT_APP_API_BASE_URL+`/uploads/${employeeData.profile_image}`}
                                        alt="Student"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '5px'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <table class="admission_detail">
                        <thead>
                            <tr>
                                <th colSpan={6} style={{ background: '#ddd' }}>
                                    Employee Details
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Reg#</th>
                                <td>{employeeData.register_no}</td>
                                <th>Appointment</th>
                                <td>{formatDate(employeeData.appointment_date)}</td>
                                <th>Name</th>
                                <td>{employeeData.full_name}</td>
                            </tr>
                            <tr>
                                <th>Role</th>
                                <td>{employeeData.employee_role}</td>
                                <th>Post</th>
                                <td>{employeeData.employee_post}</td>
                                <th>Pay Scale</th>
                                <td>{employeeData.pay_scale} ({employeeData.job_type})</td>
                            </tr>
                            <tr>
                                <th>Father</th>
                                <td>{employeeData.father_name}</td>
                                <th>Mother</th> {/* Fixed typo */}
                                <td>{employeeData.mother_name}</td> {/* Fixed typo */}
                                <th>Mobile#</th>
                                <td>{employeeData.mobile_no}</td>
                            </tr>
                            <tr>
                                <th>CNIC</th>
                                <td>{employeeData.cnic}</td>
                                <th>DOB</th>
                                <td>{formatDate(employeeData.dob)}</td>
                            </tr>
                            <tr>
                                <th>Marital Status</th>
                                <td>{employeeData.marital_status}</td>
                                <th>Current Address</th>
                                <td>{employeeData.current_address}</td>
                                <th>Permanent Address</th>
                                <td>{employeeData.permanent_address}</td>
                            </tr>
                            <tr>
                                <th>Qualification</th>
                                <td>{employeeData.qualification}</td>
                                <th>Experience</th>
                                <td>{employeeData.experience}</td>
                                <th>Work Shift</th>
                                <td>{employeeData.work_shift}</td>
                            </tr>
                            <tr>
                                <th style={{ backgroundColor: "rgb(221, 221, 221)" }} colSpan={6}>
                                    Salary Detail
                                </th>
                            </tr>
                            <tr>
                                <th>2nd Shift Honorarium</th>
                                <td>{employeeData.second_shift_honorarium}</td>
                                <th>Bus Status</th>
                                <td>{employeeData.bus_status}</td>
                                <th>Bus Charges</th>
                                <td>{employeeData.bus_charges}</td>
                            </tr>
                            <tr>
                                <th>Security Deduction</th>
                                <td>{employeeData.security_deduction}</td>
                                <th>Installment</th>
                                <td>{employeeData.security_no_of_installment}</td>
                                <th>Total Deduction</th>
                                <td>{employeeData.total_security_deduction}</td>
                            </tr>
                            <tr>
                                <th>Basic Salary</th>
                                <td>{employeeData.basic_salary}</td>
                                <th>House Rent</th>
                                <td>{employeeData.house_rent}</td>
                                <th>Account#</th>
                                <td>{employeeData.account_no}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>{employeeData.status}</td>
                            </tr>
                            <tr>
                                <td colSpan={6}></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Service Book Table */}
                    <table class="admission_detail" style={{ marginTop: '20px', width: '100%' }}>
                        <thead>
                            <tr>
                                <th colSpan={22} style={{ background: '#ddd' }}>
                                    Service Book Details
                                </th>
                            </tr>
                            <tr>
                                <th>Job.Type</th>
                                <th>B.Salary</th>
                                <th>H.Rent</th>
                                <th>2nd Shift</th>
                                <th>Add. Increm.</th>
                                <th>Pessi</th>
                                <th style={{"color": "red"}}>EOBI deduc</th>
                                <th style={{"color": "red"}}>CPF deduc</th>
                                <th style={{"color": "red"}}>Bus Fee deduc</th>
                                <th>Old. Adhoc</th>
                                <th>Curr. Adhoc</th>
                                <th>Adhoc (%)</th>
                                <th>T.Adhoc</th>
                                <th>Prev.T. Increm.</th>
                                <th>Curr. Increm.</th>
                                <th>Increment. Date</th>
                                <th>T. Increm.</th>
                                <th>Med. Allownce</th>
                                <th>Spec. Allownce</th>
                                <th>Principal. Allownce</th>
                                <th>T.Net. Salary</th>
                                <th>G.Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.serviceBook && employeeData.serviceBook.length > 0 ? (
                                employeeData.serviceBook.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.job_type}</td>
                                        <td>{entry.basic_salary}</td>
                                        <td>{entry.house_rent}</td>
                                        <td>{entry.second_shift_honorarium}</td>
                                        <td>{entry.additional_increment}</td>
                                        <td>{entry.pessi}</td>
                                        <td>{entry.eobi}</td>
                                        <td>{entry.cpf}</td>
                                        <td>{employeeData.bus_status !== "Off" ? employeeData.bus_charges : 0}</td>
                                        <td>{entry.old_adhoc}</td>
                                        <td>{entry.current_adhoc}</td>
                                        <td>{entry.adhoc_percentage}</td>
                                        <td>{entry.total_adhoc}</td>
                                        <td>{entry.previous_total_increments}</td>
                                        <td>{entry.current_increment}</td>
                                        <td>{entry.increment_date}</td>
                                        <td>{entry.total_increment}</td>
                                        <td>{entry.medical_allownce}</td>
                                        <td>{entry.special_allownce}</td>
                                        <td>{entry.principal_allownce}</td>
                                        <td>{entry.total_net_salary - (employeeData.bus_status !== "Off" ? employeeData.bus_charges : 0)}</td>
                                        <td>{entry.total_net_salary + (entry.eobi + entry.cpf)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={19}>No Service Book Data Available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                     <table class='admission_detail' style={{marginTop: '20px' }}>
                                    <thead>
                                        <tr>
                                            <th colSpan="5" style={{ background: '#ddd' }}>
                                                Employee Discipline Record
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Date.Of.Incident</th>
                                            <th>Type.of.Incident</th>
                                            <th>Action</th>
                                            <th>Description</th>
                                            
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
                                                           
                                                        </tr>
                                                    ))}
                                               
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center' }}>No Disciplinary Action Exist</td>
                                            </tr>
                                        )}

                                    </tbody>
                                    </table>

                </div>
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
                            className="employee-slc-modal"
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                position: 'fixed',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1100,
                                backdropFilter: 'blur(10px)',
                                minWidth: '350px',
                                maxHeight: '92vh',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                boxShadow: '0 18px 50px rgba(0, 0, 0, 0.3)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 'min(720px, 94vw)'
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
                                    border: '2px solid #ccc',
                                    borderRadius: '10px',
                                    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    width: '170px',
                                    height: '170px',
                                    overflow: 'hidden',
                                    marginTop: "20px"
                                }}
                            >

                                <div style={{ marginTop: '10px' }}>
                                    <img
                                        src={process.env.REACT_APP_API_BASE_URL+`/uploads/logo.jpg`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>


                            </div>


                            <header className="slc-header pt-4">


                                <h2>Student Leave Certificate</h2>
                            </header>



                            {/* Scrollable Content */}
                            <div style={{ width: '100%', padding: '20px', overflowY: 'auto' }}>
                                <main className="slc-content">
                                    <section className="slc-details">
                                        <p><strong>Certificate No:</strong> {getSLCdata.slc_invoice_no}</p>
                                        <p><strong>Registration No:</strong> {getSLCdata.register_no}</p>
                                        <p><strong>Shift:</strong> {getSLCdata.shift}</p>
                                        <p><strong>School Name:</strong> {getSLCdata.campus_name}</p>
                                    </section>

                                    <section className="slc-statement">
                                        <p>This is to certify that <strong>{getSLCdata.full_name}</strong>, daughter/son of <strong>{getSLCdata.father_name}</strong>,
                                            was a bonafide student of <strong>{getSLCdata.campus_name}</strong>,
                                            studying in class <strong>{getSLCdata.class_name}</strong>, section <strong>{getSLCdata.section_name}</strong>.
                                            The student has been granted a School Leaving Certificate on <strong>{new Date(getSLCdata.status_date).toLocaleDateString()}</strong>.</p>
                                    </section>
                                </main>
                            </div>

                            <footer className="slc-footer">
                                <p><strong>Date Issued:</strong> {new Date(getSLCdata.status_date).toLocaleDateString()}</p>


                                <div className="slc-signatures">
                                    <div><strong>Guardian's Signature:</strong> ______________________</div>
                                    <div><strong>Principal's Signature:</strong> ______________________</div>
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

export default EmployeeList;

