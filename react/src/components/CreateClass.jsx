import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CreateClass() {

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

    const [parentClass, setParentClass] = useState([]);

    const initialState = {
        parent_class_id:'',
        class_name: '',
        section_id: '',
        fee_group_id: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        class_name: true,
        parent_class_id:true,
        section_id: true,
        fee_group_id: true
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



    useEffect(() => {
        const fetchParentClasses = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-parent-classes`)
                .then(res => {
                    setParentClass(res.data.results);
                })
                .catch(err => console.log(err));
        };

        fetchParentClasses();
        
    }, []); // Dependencies array to re-run the effect when user changes



    const validateForm = () => {
        let isValid = true;
        // Basic validation rules (customize as per your requirements)
        if (!editFormData.class_name && !editFormData.class_name.trim()) {
            setValidity((prevState) => ({ ...prevState, class_name: false }));
            isValid = false;
        }
        if (!editFormData.section_id && !editFormData.section_id.trim()) {
            setValidity((prevState) => ({ ...prevState, section_id: false }));
            isValid = false;
        }

        if (!editFormData.fee_group_id && !editFormData.fee_group_id.trim()) {
            setValidity((prevState) => ({ ...prevState, fee_group_id: false }));
            isValid = false;
        }

        if (!editFormData.parent_class_id && !editFormData.parent_class_id.trim()) {
            setValidity((prevState) => ({ ...prevState, parent_class_id: false }));
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
        axios.get(process.env.REACT_APP_API_BASE_URL+"/classes-list", {
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

        const selectedSection = getSections.find(section => section.id === parseInt(editFormData.section_id));
            const selectedFeeGroup = getGroups.find(group => group.id === parseInt(editFormData.fee_group_id));

              const formData = {
                ...editFormData,
                section_name: selectedSection ? selectedSection.section_name : '',
                fee_group_name: selectedFeeGroup ? selectedFeeGroup.fee_group_name : ''
            };
        if (validateForm()) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-class', formData, {
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
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-class-data/${id_get}`)
            .then(response => {
                const { id, class_name, section_id, fee_group_id, parent_class_id } = response.data.results[0];
                console.log(response.data.results[0]);
                setEditFormData({ ...editFormData, 
                    parent_class_id:parent_class_id || '',
                    class_name: class_name || '',
                    section_id: section_id || '',
                    fee_group_id: fee_group_id || '',
                    hidden_id: id || ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }




  
   const deleteBankDetail = (id_get, class_name, section_name, fee_group_name) => {
    var confirm_delete = window.confirm("Deleted! Are you sure?");
    
    if (confirm_delete) {
        // Encode the parameters
        const encodedClassName = encodeURIComponent(class_name);
        const encodedSectionName = encodeURIComponent(section_name);
        const encodedFeeGroupName = encodeURIComponent(fee_group_name);
        
        axios.put(process.env.REACT_APP_API_BASE_URL+
            `/soft-delete-class/${id_get}/${academicSession}/${user.user.campus_id}/${
            user.user.user_id}/${encodedClassName}/${encodedSectionName}/${encodedFeeGroupName}`)
        .then(response => {
            console.log('Status updated successfully:', response.data);
            // Update the state to reflect the change in status
            setData(prevData => prevData.filter(classes => classes.id !== id_get));
        })
        .catch(error => {
            console.error('Error updating status:', error);
        });
    }
};
      






    return (
        <>
            <div className="create-page">
                <div className='create-page__col create-page__form-col'>
                    <h5 className='text-warning bg-primary p-2 card-header border create-page__header'> <i className="fas fa-graduation-cap"></i> Create Class Form</h5>
                    <form className='border p-3 create-page__form' onSubmit={handleSubmit}>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="text"
                                    name='class_name'
                                    value={editFormData.class_name}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, class_name: e.target.value });
                                        setValidity({ ...validity, class_name: true });
                                    }}
                                    className={validity.class_name ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Sections</label>
                            <div className="col-sm-10 ">
                                <select id="section"


                                    value={editFormData.section_id}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, section_id: e.target.value });
                                        setValidity({ ...validity, section_id: true });
                                    }}
                                    className={validity.section_id ? 'form-control' : 'form-control invalid-input'}>

                                    <option value="">Select Section</option>
                                    {getSections.map(section => (
                                        <option key={section.id} value={section.id}>
                                            {section.section_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Fee_Groups*</label>
                            <div className="col-sm-10 ">
                                <select id="section"


                                    value={editFormData.fee_group_id}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, fee_group_id: e.target.value });
                                        setValidity({ ...validity, fee_group_id: true });
                                    }}
                                    className={validity.fee_group_id ? 'form-control' : 'form-control invalid-input'}>

                                    <option value="">Select Fee Group</option>
                                    {getGroups.map(fee_group => (
                                        <option key={fee_group.id} value={fee_group.id}>
                                            {fee_group.fee_group_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>



                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Parent Class*</label>
                            <div className="col-sm-10 ">
                                <select id="section"


                                    value={editFormData.parent_class_id}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, parent_class_id: e.target.value });
                                        setValidity({ ...validity, parent_class_id: true });
                                    }}
                                    className={validity.parent_class_id ? 'form-control' : 'form-control invalid-input'}>

                                    <option value="">Select Parent Class</option>
                                    {parentClass.map(parent_class => (
                                        <option key={parent_class.id} value={parent_class.id}>
                                            {parent_class.parent_class}
                                        </option>
                                    ))}
                                </select>
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

                <div className='create-page__col create-page__list-col' >


                    <div className="card-header text-warning bg-primary p-2 create-page__list-header">
                        <div className="d-flex flex-wrap justify-content-between align-items-center create-page__list-header-row">
                            <div className="create-page__list-title">
                                <i className="fas fa-list"></i> Class List
                            </div>


                            {/* search category */}


                            <div className="create-page__list-search">
                                <i className="fas fa-search create-page__list-search-icon" aria-hidden="true"></i>
                                <input type="text" className="form-control create-page__list-search-input" id="search_category" placeholder="Search…" onKeyDown={handleKeyDown} onChange={(e) => getSearchCategoryReport({ ...searchCategoryReport, search: e.target.value })} />
                                <button className="btn btn-sm btn-danger create-page__list-search-btn" onClick={searchCategory} >
                                  <i className="fas fa-search"></i><span className="create-page__list-search-btn-text"> Search</span>
                                </button>
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

                    <div className='border p-2 create-page__list-body'>
                        <div className='pb-3 create-page__pagesize'>
                            <select value={totalItem} onChange={handleTotalItemChange} className="create-page__pagesize-select">
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                        </div>


                        <div className="table-responsive create-page__table-wrap">
                        <table className='table create-page__table'>
                            <thead>
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th>Class</th>
                                    <th className='text-center'>Section</th>
                                    <th className='text-center'>Fee Group</th>
                                    <th className='text-center'>P.Class</th>
                                    <th className='text-center'>Edit</th>
                                    <th className='text-center'>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4">Loading...</td>
                                    </tr>
                                ) : (


                                    data.map((class_get, index) => (
                                        <tr key={index}>
                                            {/* <td>{bank_detail.id}</td> */}
                                            <td>{class_get.class}</td>
                                            <td className='text-center'>{class_get.section_name}</td>
                                            <td className='text-center'>{class_get.fee_group_name}</td>
                                            <td className='text-center'>{class_get.parent_class}</td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(class_get.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-danger btn-sm' onClick={() => deleteBankDetail(class_get.id, class_get.class,class_get.section_name, class_get.fee_group_name)}><i className="fas fa-trash-alt"></i></a></div>
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

                </div>
            </div>

        </>
    )



}

export default CreateClass