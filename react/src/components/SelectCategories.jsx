import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function SelectCategories() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getSections, setSections] = useState([]);
    const [getCategories, setCategories] = useState([]);
    const [getGroups, setGroups] = useState([]);

    const initialState = {
        category_id: [],
        session_id: academicSession,
        campus_id: user?.user?.campus_id,
        user_id: user?.user?.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        category_id: true,
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
        const fetchAllCategories = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-all-categories`)
                .then(res => {
                    setCategories(res.data.results);
                })
                .catch(err => console.log(err));
        };
        fetchAllCategories();
    }, [user]);

    useEffect(() => {
        const fetchGroups = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-fee-groups/${campus_id}`)
                .then(res => {
                    setGroups(res.data.results);
                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id) {
            fetchGroups(user.user.campus_id);
        }
    }, [user]);

    const validateForm = () => {
        let isValid = true;
        if (!editFormData.category_id || editFormData.category_id.length === 0) {
            setValidity((prevState) => ({ ...prevState, category_id: false }));
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
        if (report.report_type === "pdf") {
            // pdfReport();
        } else if (report.report_type === "excel") {
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
    }, []);

    const [totalItem, setTotalItemGet] = useState(10);

    useEffect(() => {
        if(user){
            fetchData();
        }
        
    }, [currentPage, totalItem, user]);

    const fetchData = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/selected-categories-campuswise-list", {
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
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-selected-categories', editFormData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (editFormData.hidden_id !== "") {
                    toast.success('Data updated successfully!');
                    console.log('Data Updated successfully:', response.data);
                } else {
                    toast.success('Data Inserted successfully!');
                    console.log('Data Inserted successfully:', response.data);
                }

                setEditFormData(initialState);
                fetchData();

            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('An error occurred');
                }
            }
        }
    };

    const edit = (id_get) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-selected-categories-data/${id_get}`)
            .then(response => {
                const { id, category_id } = response.data.results[0];

                setEditFormData({
                    ...editFormData,
                    category_id: [category_id] || '',
                    hidden_id: id || ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const deleteRow = (id_get) => {
        var confirm_delete = window.confirm("Deleted! Are you sure?");

        if (confirm_delete) {
            axios.put(process.env.REACT_APP_API_BASE_URL+`/soft-delete-selected-categories/${id_get}/${user.user.user_id}/${user.user.campus_id}/${academicSession}`)
                .then(response => {
                    console.log('Status updated successfully:', response.data);
                    setData(prevData => prevData.filter(categories => categories.id !== id_get));
                })
                .catch(error => {
                    console.error('Error updating status:', error);
                });
        }
    };

    const categoryOptions = getCategories.map(category => ({
        value: category.id,
        label: category.category
    }));

    const handleCategoryChange = (selectedOptions) => {
        let selectedCategories;
        if (Array.isArray(selectedOptions)) {
            selectedCategories = selectedOptions.map(option => option.value);
        } else {
            selectedCategories = selectedOptions ? [selectedOptions.value] : [];
        }
        setEditFormData({ ...editFormData, category_id: selectedCategories });
        setValidity({ ...validity, category_id: true });
    };
    
    return (
        <>
            <div className="create-page">
                <div className='create-page__col create-page__form-col'>
                    <h5 className='text-warning bg-primary p-2 card-header border create-page__header'> <i className="fas fa-info-circle"></i> Categories Form</h5>
                    <form className='border p-3 create-page__form' onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label htmlFor="categories" className="col-sm-2 col-form-label">Categories</label>
                            <div className="col-sm-10">
                                <Select
                                    id="categories"
                                    isMulti={editFormData.hidden_id === ''}
                                    value={categoryOptions.filter(option => editFormData.category_id.includes(option.value))}
                                    onChange={handleCategoryChange}
                                    options={categoryOptions}
                                    classNamePrefix={validity.category_id ? 'react-select' : 'react-select invalid-input'}
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

                <div className='create-page__col create-page__list-col'>
                    <div className="card-header text-warning bg-primary p-2 create-page__list-header">
                        <div className="d-flex flex-wrap justify-content-between align-items-center create-page__list-header-row">
                            <div className="create-page__list-title">
                                <i className="fas fa-list"></i> Categories List
                            </div>

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
                                    <th>Category</th>
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
                                    data.map((category, index) => (
                                        <tr key={index}>
                                            <td>{category.category}</td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(category.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-danger btn-sm' onClick={() => deleteRow(category.id)}><i className="fas fa-trash-alt"></i></a></div>
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
    );
}

export default SelectCategories;
