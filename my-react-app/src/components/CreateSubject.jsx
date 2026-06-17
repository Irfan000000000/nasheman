import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CreateSubject() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getSections, setSections] = useState([]);
    const [getGroups, setGroups] = useState([]);

    const initialState = {

        subjects: '',
        subject_type: 'Theory',
        subject_code: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        subjects: true,
        subject_type: true,
        subject_code: true
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
    }, [user]); // Dependencies array to re-run the effect when user changes



    useEffect(() => {
        const fetchGroups = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-fee-groups/${campus_id}`)
                .then(res => {
                    setGroups(res.data.results);
                })
                .catch(err => console.log(err));
        };

        // Ensure user.campus_id is defined before calling fetchClasses
        if (user && user.user.campus_id) {
            fetchGroups(user.user.campus_id);
        }
    }, [user]); // Dependencies array to re-run the effect when user changes



    const validateForm = () => {
        let isValid = true;
        // Basic validation rules (customize as per your requirements)
        if (!editFormData.subjects && !editFormData.subjects.trim()) {
            setValidity((prevState) => ({ ...prevState, subjects: false }));
            isValid = false;
        }

        if (!editFormData.subject_type && !editFormData.subject_type.trim()) {
            setValidity((prevState) => ({ ...prevState, subject_type: false }));
            isValid = false;
        }

        if (!editFormData.subject_code && !editFormData.subject_code.trim()) {
            setValidity((prevState) => ({ ...prevState, subject_code: false }));
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
        const fetchCategory = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+"/get-banks")
                .then(res => {
                    setBanks(res.data.results);
                })
                .catch(err => console.log(err));
        };

        fetchCategory();
    }, []); // Empty dependency array ensures this effect runs only once, on mount




    //const [itemsPerPage, setitemsPerPage] = useState(10); 

    const [totalItem, setTotalItemGet] = useState(10);

    // const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, [currentPage, totalItem, user]);





    const fetchData = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/subject-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search,
                campus_id: user.user.campus_id
            }
        })
            .then(res => {
                console.log(res.data.results);
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
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-subject', editFormData, {
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
    
                setEditFormData(initialState); // Reset form data after successful submission
                fetchData();
    
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error); // Show the error message from the server
                } else {
                    toast.error('An error occurred'); // Show a generic error message
                }
            }
        }
    };
    




    const edit = (id_get) => {
        // axios.get(process.env.REACT_APP_API_BASE_URL+`/get-section-data/${id_get}`)
        //     .then(response => {
              
        //         const { id, section_name } = response.data.results[0];
        //         console.log(section_name);
        //         setEditFormData({ ...editFormData, 
        //             section_name: section_name || '',
        //             hidden_id: id || ''
        //         });
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });
    }




  
    const deleteRow = (id_get) => {
        // var confirm_delete = window.confirm("Deleted! Are you sure?");
        
        // if (confirm_delete) {
        //   axios.put(process.env.REACT_APP_API_BASE_URL+`/soft-delete-section/${id_get}`)
        //     .then(response => {
        //       console.log('Status updated successfully:', response.data);
        //       // Update the state to reflect the change in status
        //       setData(prevData => prevData.filter(classes => classes.id !== id_get));
        //     })
        //     .catch(error => {
        //       console.error('Error updating status:', error);
        //     });
        // }
      };
      
      






    return (
        <>

            <div className="d-flex">
                <div className='col-md-6 p-2'>
                    <h5 className='text-warning bg-primary p-2 card-header border'> <i className="fas fa-graduation-cap"></i> Create Subject Form</h5>
                    <form className='border p-3' onSubmit={handleSubmit}>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Subject</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="text"
                                    name='subject'
                                    value={editFormData.subjects}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, subjects: e.target.value });
                                        setValidity({ ...validity, subjects: true });
                                    }}
                                    className={validity.subjects ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>


                       
                        <div className="form-group row">
                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Type</label>
                        <div className="col-sm-10 d-flex align-items-center">
                            <div className="form-check mr-3">
                                <input
                                    type="radio"
                                    name="subject_type"
                                    value="Theory"
                                    checked={editFormData.subject_type === "Theory"}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, subject_type: e.target.value });
                                        setValidity({ ...validity, subject_type: true });
                                    }}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    Theory
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    name="subject_type"
                                    value="Practical"
                                    checked={editFormData.subject_type === "Practical"}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, subject_type: e.target.value });
                                        setValidity({ ...validity, subject_type: true });
                                    }}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    Practical
                                </label>
                            </div>
                        </div>
                        </div>



                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Code</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="text"
                                    name='subject_code'
                                    value={editFormData.subject_code}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, subject_code: e.target.value });
                                        setValidity({ ...validity, subject_code: true });
                                    }}
                                    className={validity.subject_code ? 'form-control' : 'form-control invalid-input'}
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
                                <i className="fas fa-list"></i> Subject List
                            </div>
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
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Code</th>
                                    <th className='text-center'>Edit</th>
                                    {/* <th className='text-center'>Delete</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4">Loading...</td>
                                    </tr>
                                ) : (


                                    data.map((get_subject, index) => (
                                        <tr key={index}>
                                            <td>{get_subject.subjects}</td>
                                            <td>{get_subject.subject_type}</td>
                                            <td>{get_subject.subject_code}</td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(get_subject.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td>
                                            {/* <td className='text-center'>
                                                <div><a href="#" className='btn btn-danger btn-sm' onClick={() => deleteRow(get_subject.id)}><i className="fas fa-trash-alt"></i></a></div>
                                            </td> */}
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

export default CreateSubject