import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function FeeFine() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    // const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    // const { academicSession } = useContext(AcademicSessionContext);





    const initialState = {
        fee_fine: '',
        status: 'On',
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        head_name: true,
    });


    const [editFormData, setEditFormData] = useState(initialState);


    // useEffect(() => {
    //     if (academicSession) {
    //         setEditFormData(prevFormData => ({
    //             ...prevFormData,
    //             session_id: parseInt(academicSession)
    //         }));
    //     }
    // }, [academicSession]);



    const validateForm = () => {
        let isValid = true;
        // Basic validation rules (customize as per your requirements)

        if (!editFormData.head_name.trim()) {
            setValidity((prevState) => ({ ...prevState, head_name: false }));
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


    // useEffect(() => {
    //     const fetchCategory = () => {
    //         axios.get(process.env.REACT_APP_API_BASE_URL+"/get-banks")
    //             .then(res => {
    //                 setBanks(res.data.results);
    //             })
    //             .catch(err => console.log(err));
    //     };

    //     fetchCategory();
    // }, []); // Empty dependency array ensures this effect runs only once, on mount




    //const [itemsPerPage, setitemsPerPage] = useState(10); 

    const [totalItem, setTotalItemGet] = useState(10);

    // const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, [currentPage, totalItem]);





    const fetchData = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/heads-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search
            }
        })
            .then(res => {
                console.log(res.data.results);
                setData(res.data.results);
                // setTotalCount(0);
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






    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         try {
    //             const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-heads', editFormData, {
    //                 headers: {
    //                     'Content-Type': 'application/json', // Set content type to JSON
    //                 },
    //             });

    //             if (editFormData.hidden_id !== "") {
    //                 toast.success('Data updated successfully!');
    //                 console.log('Data Updated successfully:', response.data);
    //             } else {
    //                 toast.success('Data Inserted successfully!');
    //                 console.log('Data Inserted successfully:', response.data);
    //             }

    //             fetchData();

    //         } catch (error) {

    //         }

    //         setEditFormData(initialState); // Reset form data after successful submission
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-heads', editFormData, {
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
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(`Error: ${error.response.data.error}`);
                } else {
                    toast.error('An unexpected error occurred.');
                }
                console.error('Error inserting/updating data:', error);
            }

            setEditFormData(initialState); // Reset form data after successful submission
        }
    };



    const edit = (id_get) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/head-get/${id_get}`)
            .then(response => {
                const { id, head_name, status } = response.data.results[0];
                console.log(response.data.results[0]);
                setEditFormData({ ...editFormData,
                    head_name: head_name || '',
                    status: status || '',
                    hidden_id: id || ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    const deleteRow = (id_get, status) => {
        const confirmDelete = window.confirm('Deleted! Are you sure');
    
        if (confirmDelete) {
          axios
            .get(process.env.REACT_APP_API_BASE_URL+`/soft-delete-heads/${id_get}/${status}`)
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
                    <h5 className='text-warning bg-primary p-2 card-header border'> <i className="fas fa-check-circle"></i>Fee Fine</h5>
                    <form className='border p-3' onSubmit={handleSubmit}>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Fine *</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="text"
                                    name='head_name'
                                    value={editFormData.head_name}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, head_name: e.target.value });
                                        setValidity({ ...validity, head_name: true });
                                    }}
                                    className={validity.head_name ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Status *</label>
                            <div className="col-sm-10">
                                <input
                                    type="checkbox"
                                    name='status'
                                    checked={editFormData.status === "On"}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, status: e.target.checked ? "On" : "Off" })
                                    }}

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
                                <i className="fas fa-list"></i> Heads List
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
                                    <th>Head Name</th>
                                    {/* <th>Status</th> */}
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


                                    data.map((date_get, index) => (
                                        <tr key={index}>
                                            {/* <td>{bank_detail.id}</td> */}
                                            <td>{date_get.head_name}</td>
                                            {/* <td>{date_get.status}</td> */}
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(date_get.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td>
                                            <td className='text-center'>
                                                <div><a href="#" className={`btn btn-sm ${date_get.status == 'On' ? 'btn-success' : 'btn-danger'}`} onClick={() => deleteRow(date_get.id, date_get.status)}> <i className={`fas ${date_get.status == 'On' ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i></a></div>
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

export default FeeFine