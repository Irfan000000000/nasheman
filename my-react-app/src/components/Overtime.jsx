import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Select from 'react-select';


function Overtime() {

    const [data, setData] = useState([]);

    const [getEmployees, setEmployeesData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);





    const initialState = {
        overtime_date: '',
        employee_id: '',
        overtime_hours: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        overtime_date: true,
        employee_id: true,
        overtime_hours: true,
    });


    const [editFormData, setEditFormData] = useState(initialState);


    useEffect(() => {
        if (academicSession) {
            setEditFormData(prevFormData => ({
                ...prevFormData,
                session_id: parseInt(academicSession)
            }));
        }
    }, [academicSession]);



    const validateForm = () => {
        let isValid = true;
        // Basic validation rules (customize as per your requirements)
        if (!editFormData.overtime_date && !editFormData.overtime_date.trim()) {
            setValidity((prevState) => ({ ...prevState, overtime_date: false }));
            isValid = false;
        }
        if (!editFormData.overtime_hours && !editFormData.overtime_hours.trim()) {
            setValidity((prevState) => ({ ...prevState, overtime_hours: false }));
            isValid = false;
        }

        if (!editFormData.employee_id) {
            setValidity((prevState) => ({ ...prevState, account_no: false }));
            isValid = false;
        }

        return isValid;
    };


    const [report, getAllReports] = useState({
        from_date: '',
        to_date: '',
        report_type: ''
    });


    const [searchCategoryReport, getSearchCategoryReport] = useState({
        search: '',
    });




    function searchCategory() {
        fetchData();
    }


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            getSearchCategoryReport(searchCategoryReport);
            fetchData();
        }
    };




    function getReport() {
        if (report.report_type == "pdf") {
            // pdfReport();
        } else if (report.report_type == "excel") {
            // excelReport();
        }
    }


    useEffect(() => {
        const fetchEmployees = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+"/fetch-school-employees", {
                params: {
                    campus_id: user.user.campus_id,
                    session_id: academicSession
                }
            })
                .then(res => {
                    console.log(res.data.results);
                    setEmployeesData(res.data.results);
                })
                .catch(err => console.log(err));
        };

        fetchEmployees();
    }, []); // Empty dependency array ensures this effect runs only once, on mount




    //const [itemsPerPage, setitemsPerPage] = useState(10); 

    const [totalItem, setTotalItemGet] = useState(10);

    useEffect(() => {
        fetchData();
    }, [currentPage, totalItem]);





    const fetchData = () => {

        axios.get(process.env.REACT_APP_API_BASE_URL+"/fetch-overtime", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search,
                campus_id: user.user.campus_id,
                session_id: academicSession
            }
        })
            .then(res => {
                setData(res.data.results);
                setTotalCount(0);
                totalPagesGet(res.data.totalPages);
                setLoading(false);
            })
            .catch(err => console.log(err));

    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleTotalItemChange = (event) => {

        const newValue = event.target.value;
        setTotalItemGet(newValue);

    }






    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-overtime', editFormData, {
                    headers: {
                        'Content-Type': 'application/json', // Set content type to JSON
                    },
                });

                if (editFormData.hidden_id !== "") {
                    toast.success('Data updated successfully!');
                    console.log('Data Updated successfully:', response.data);
                } else {
                    toast.success('Data Inserted successfully!');
                    console.log('Data Inserted successfully:', response.data);
                }

                fetchData();

            } catch (error) {
                console.error('There was an error!', error);
            }

            setEditFormData(initialState); // Reset form data after successful submission
        }
    };




    const edit = (id_get) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/bank-detail-get/${id_get}`)
            .then(response => {
                const { id, bank_id, account_title, account_no } = response.data.results[0];
                console.log(response.data.results[0]);
                setEditFormData({
                    bank_id: bank_id || '',
                    account_title: account_title || '',
                    account_no: account_no || '',
                    hidden_id: id || ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }




    function convertDates(date) {
        const d = new Date(date);

        // Get day, month, and year
        const day = d.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const year = d.getFullYear();

        // Return formatted date as dd-mm-yyyy
        return `${day}-${month}-${year}`;
    }



    // const deleteBankDetail = (id_get) => {
    //     var confirm_detele = window.confirm("Deleted! Are you sure");

    //     if (confirm_detele) {
    //         axios.delete(process.env.REACT_APP_API_BASE_URL+`/delete-bank-details/${id_get}`)
    //             .then(response => {
    //                 console.log('Deleted successfully:', response.data);
    //                 // Update the state to remove the deleted bank detail
    //                 setData(prevData => prevData.filter(detail => detail.id !== id_get));
    //             })
    //             .catch(error => {
    //                 console.error('Error deleting item:', error);
    //             });
    //     }
    // };



    const deleteRow = (id_get, status) => {
        const confirmDelete = window.confirm('Deleted! Are you sure');

        if (confirmDelete) {
            axios
                .delete(process.env.REACT_APP_API_BASE_URL+`/soft-delete-bank-details/${id_get}/${status}`)
                .then(response => {
                    console.log('Deleted successfully:', response.data);
                    fetchData();
                    // Update the state to remove the deleted item
                    //   setData(prevData => prevData.filter(item => item.id !== id_get));
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                });
        }
    };






    return (
        <>
            <div className="d-flex">
                <div className='col-md-6 p-2'>
                    <h5 className='text-warning bg-primary p-2 card-header border'> <i className="fas fa-university"></i>Over Time Form</h5>
                    <form className='border p-3' onSubmit={handleSubmit}>



                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Date</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="date"
                                    name='overtime_date'
                                    value={editFormData.overtime_date}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, overtime_date: e.target.value });
                                        setValidity({ ...validity, overtime_date: true });
                                    }}
                                    className={validity.overtime_date ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>




                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Employee</label>
                            <div className="col-sm-10">
                                <Select
                                    name="employee_id"
                                    value={
                                        editFormData.employee_id
                                            ? getEmployees.find((emp) => emp.id === editFormData.employee_id)
                                                ? { value: editFormData.employee_id, label: getEmployees.find((emp) => emp.id === editFormData.employee_id).full_name }
                                                : null
                                            : null
                                    } // Set the selected value as an object with value and label
                                    onChange={(selectedOption) => {
                                        setEditFormData({ ...editFormData, employee_id: selectedOption ? selectedOption.value : '' });
                                        setValidity({ ...validity, employee_id: true });
                                    }}
                                    options={getEmployees.map((employee) => ({
                                        value: employee.id,
                                        label: employee.full_name
                                    }))}
                                    className={validity.employee_id ? '' : 'invalid-input'}
                                    isClearable
                                />
                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Hours</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="number"
                                    name='hours'
                                    value={editFormData.overtime_hours}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, overtime_hours: e.target.value });
                                        setValidity({ ...validity, overtime_hours: true });
                                    }}
                                    className={validity.overtime_hours ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label"></label>
                            <div className="col-sm-10 d-flex justify-content-end">
                                <input type="submit" className='btn btn-sm btn-primary' value={"Save"} onClick={handleSubmit} />
                            </div>
                        </div>

                    </form>
                </div>

                <div className='col-md-6 p-2' >


                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Over Time Details
                            </div>


                            {/* search category */}


                            <div className="d-flex">
                                <div className="me-2 mr-2">
                                    <input type="text" className="form-control" id="search_category" onKeyDown={handleKeyDown} onChange={(e) => getSearchCategoryReport({ ...searchCategoryReport, search: e.target.value })} />
                                </div>
                                <button className="btn btn-sm btn-danger" onClick={searchCategory} >Search</button>
                            </div>




                            <div className="d-none">
                                <div className="me-2 mr-2">
                                    <input type="date" className="form-control" id="from_date" onChange={(e) => getAllReports({ ...report, from_date: e.target.value })} />
                                </div>

                                <div className="me-2 mr-2">
                                    <input type="date" className="form-control" id="to_date" onChange={(e) => getAllReports({ ...report, to_date: e.target.value })} />
                                </div>

                                <div className="me-2 mr-2">
                                    <select name="type" id="type" className="form-control" onChange={(e) => getAllReports({ ...report, report_type: e.target.value })}>
                                        <option value="">Select Type</option>

                                        <option value="excel">Excel</option>
                                        <option value="pdf">PDF</option>
                                    </select>
                                </div>

                                <button className="btn btn-sm btn-danger" onClick={getReport} >Get Report</button>
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
                                    {/* <th>ID</th> */}
                                    <th>Date</th>
                                    <th>Employee</th>
                                    <th>Overtime (hrs)</th>
                                    <th className='text-center'>Edit</th>
                                    <th className='text-center'>Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4">Loading...</td>
                                    </tr>
                                ) : (


                                    data.map((overtime, index) => (
                                        <tr key={index}>
                                            {/* <td>{bank_detail.id}</td> */}
                                            <td>{convertDates(overtime.overtime_date)}</td>
                                            <td>{overtime.full_name}</td>
                                            <td>{overtime.overtime_hours}</td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(overtime.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(overtime.id)} ><i className="fas fa-edit"></i></a></div>
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

        </>
    )



}

export default Overtime