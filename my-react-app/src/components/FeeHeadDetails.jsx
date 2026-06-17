import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function FeeHeadDetails() {

    const [list, setList] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getCategories, setCategories] = useState([]);
    const [getFeeGroups, setFeeGroups] = useState([]);
    const [getFeeHeads, setFeeHeads] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
      const [expandedGroups, setExpandedGroups] = useState({});
 const [showData, setShowData] = useState(false);

    const initialState = {
        fee_head_id: '',
        category_id: '',
        fee_group_id: '',
        amount: '',
        shift: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }


    const [validity, setValidity] = useState({
        fee_head_id: true,
        category_id: true,
        fee_group_id: true,
        amount: true,
        shift: true,
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
        if (!editFormData.fee_head_id && !editFormData.fee_head_id.trim()) {
            setValidity((prevState) => ({ ...prevState, fee_head_id: false }));
            isValid = false;
        }
        if (!editFormData.category_id && !editFormData.category_id.trim()) {
            setValidity((prevState) => ({ ...prevState, category_id: false }));
            isValid = false;
        }

        if (!editFormData.fee_group_id && !editFormData.fee_group_id.trim()) {
            setValidity((prevState) => ({ ...prevState, fee_group_id: false }));
            isValid = false;
        }

        if (!editFormData.amount && !editFormData.amount.trim()) {
            setValidity((prevState) => ({ ...prevState, amount: false }));
            isValid = false;
        }

        if (!editFormData.shift && !editFormData.shift.trim()) {
            setValidity((prevState) => ({ ...prevState, shift: false }));
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
        let campus_id = user.user.campus_id;
        const fetchCategory = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-categories/${campus_id}`)
                .then(res => {
                    console.log(res.data.results);
                    setCategories(res.data.results);
                })
                .catch(err => console.log(err));
        };
        if(user){
            fetchCategory(campus_id);
        }
    }, [user]); // Empty dependency array ensures this effect runs only once, on mount



 useEffect(() => {
    const fetchFeeHeads = (campus_id) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/fee-heads/${campus_id}`)
            .then(res => {
                setFeeHeads(res.data.results);
            })
            .catch(err => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
        fetchFeeHeads(user.user.campus_id);
    }
}, [user]); // Dependenci




useEffect(() => {
    const getFeeGroups = (campus_id) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/fee-groups/${campus_id}`)
            .then(res => {
                setFeeGroups(res.data.results);
            })
            .catch(err => console.log(err));
    };

    // Ensure user.campus_id is defined before calling fetchClasses
    if (user && user.user.campus_id) {
        getFeeGroups(user.user.campus_id);
    }
}, [user]); // Dependenci
    


    const [totalItem, setTotalItemGet] = useState(10);

    // const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, [currentPage, totalItem]);





    const fetchData = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/fee-head-details-list", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search,
                campus_id: user.user.campus_id
            }
        })
            .then(res => {
                console.log(res.data.results);
                setList(res.data.results);
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
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-fee-head-details', editFormData, {
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
                setEditFormData((prevState) => ({
                    ...prevState,
                    amount: '',
                    hidden_id:''
                  }));
                  

                // setEditFormData(initialState); // Reset form data after successful submission

            } catch (error) {
                // console.error('There was an error!', error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(`Error: ${error.response.data.error}`);
                }
            }

           
        }
    };



    const fetchFeeHeadDetails = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL + `/view-fee-head-details-get/${user.user.campus_id}`)
            .then(response => {
                setData(response.data.data);
                setLoading(false);
                setShowData(true);
                
                // Initialize expanded state for all groups
                const groups = [...new Set(response.data.data.map(item => item.fee_group_name))];
                const initialExpandedState = {};
                groups.forEach(group => {
                    initialExpandedState[group] = true;
                });
                setExpandedGroups(initialExpandedState);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    };




    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    const toggleAllGroups = () => {
        const allExpanded = Object.values(expandedGroups).every(val => val);
        const newState = {};
        Object.keys(expandedGroups).forEach(key => {
            newState[key] = !allExpanded;
        });
        setExpandedGroups(newState);
    };

    if (loading) {
        return <div>Loading fee head details...</div>;
    }

   

    // Group data by fee_group_name and then by category
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.fee_group_name]) {
            acc[item.fee_group_name] = {};
        }
        if (!acc[item.fee_group_name][item.category]) {
            acc[item.fee_group_name][item.category] = [];
        }
        acc[item.fee_group_name][item.category].push(item);
        return acc;
    }, {});
 



    const edit = (fee_head_detail_id) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/fee-head-details-get/${fee_head_detail_id}`)
            .then(response => {
                const { id, shift, fee_head_id, category_id, fee_group_id, amount } = response.data.results[0];
                console.log(response.data.results[0]);
                setEditFormData({...editFormData,
                    fee_head_id: fee_head_id || '',
                    category_id: category_id || '',
                    fee_group_id: fee_group_id || '',
                    amount: amount || '',
                    shift: shift || '',
                    hidden_id: id || ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    

    const deleteRow = (id_get, status) => {
        // const confirmDelete = window.confirm('Deleted! Are you sure');
    
        // if (confirmDelete) {
          axios
            .delete(process.env.REACT_APP_API_BASE_URL+`/soft-delete-fee-head-details/${id_get}/${status}`)
            .then(response => {
              console.log('Deleted successfully:', response.data);
              fetchData();
              // Update the state to remove the deleted item
            //   setData(prevData => prevData.filter(item => item.id !== id_get));
            })
            .catch(error => {
              console.error('Error deleting item:', error);
            });
        // }
      };






    return (
        <>
            <div className="d-flex">
                <div className='col-md-6 p-2'>
                    <h5 className='text-warning bg-primary p-2 card-header border'> <i className="fas fa-university"></i>Fee Head Detail</h5>
                    <div className='d-flex justify-content-end  p-2'>
                        <button className='btn btn-sm btn-warning' onClick={fetchFeeHeadDetails}><i className='fas fa-eye'></i> View Fee Heads Detail</button>
                    </div>
                    <form className='border p-3' onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Category *</label>
                            <div className="col-sm-10 ">
                                <select name='fee_head_id'
                                    value={editFormData.category_id}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, category_id: e.target.value });
                                        setValidity({ ...validity, category_id: true });
                                    }}

                                    className={validity.category_id ? 'form-control' : 'form-control invalid-input'}  >
                                    <option value="">Select Category</option>
                                    {getCategories.map((category, index) => (
                                        <option key={index} value={category.id}>
                                            {category.category}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>




                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Groups *</label>
                            <div className="col-sm-10 ">
                                <select name='fee_group_id'
                                    value={editFormData.fee_group_id}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, fee_group_id: e.target.value });
                                        setValidity({ ...validity, fee_group_id: true });
                                    }}
                                    className={validity.fee_group_id ? 'form-control' : 'form-control invalid-input'}  >
                                    <option value="">Select Fee Group</option>
                                    {getFeeGroups.map((fee_group, index) => (
                                        <option key={index} value={fee_group.id}>
                                            {fee_group.fee_group_name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Shift *</label>
                            <div className="col-sm-10 ">
                                <select name='shift'
                                    value={editFormData.shift}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, shift: e.target.value });
                                        setValidity({ ...validity, shift: true });
                                    }}
                                    className={validity.shift ? 'form-control' : 'form-control invalid-input'}  >
                                    <option value="">Select Shift</option>
                                    <option>Morning</option>
                                    <option>Evening</option>
                                </select>

                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Heads *</label>
                            <div className="col-sm-10 ">


                                <select name='fee_head_id'

                                    value={editFormData.fee_head_id}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, fee_head_id: e.target.value });
                                        setValidity({ ...validity, fee_head_id: true });
                                    }}

                                    className={validity.fee_head_id ? 'form-control' : 'form-control invalid-input'}  >
                                    <option value="">Select Fee Head</option>
                                    {getFeeHeads.map((head, index) => (
                                        <option key={index} value={head.id}>
                                            {head.head_name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        


                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Amount *</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="number"
                                    name='amount'
                                    value={editFormData.amount}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, amount: e.target.value });
                                        setValidity({ ...validity, amount: true });
                                    }}
                                    className={validity.amount ? 'form-control' : 'form-control invalid-input'}
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
                                <i className="fas fa-list"></i> Fee Head Detail List
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
                                    <th>Category</th>
                                    <th>Groups</th>
                                    <th>Amount</th>
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


                                    list.map((fee_head_details, index) => (
                                        <tr key={index}>
                                            {/* <td>{bank_detail.id}</td> */}
                                            <td>{fee_head_details.head_name}</td>
                                            <td>{fee_head_details.category}</td>
                                            <td>{fee_head_details.fee_group_name}</td>
                                            <td>{fee_head_details.amount}</td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(fee_head_details.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td>
                                            <td className='text-center'>
                                                <div><a href="#" className={`btn btn-sm ${fee_head_details.status == 'On' ? 'btn-success' : 'btn-danger'}`} onClick={() => deleteRow(fee_head_details.id, fee_head_details.status)}> <i className={`fas ${fee_head_details.status == 'On' ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i></a></div>
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



 {showData && (
        <>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "100",
              backdropFilter: "blur(10px)",
              width: "100%",
              // maxWidth: "1800px",
              // maxHeight: "100vh",
              height:"100vh",
              backgroundColor: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 101,
                backgroundColor: "#EBD197",
                color: "black",
                padding: "8px 16px",
              }}
            >
              <i className="fas fa-university me-2"></i> Fee Head Details
              <button
                onClick={() => setShowData(false)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "15px",
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "black",
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
                maxHeight: "calc(90vh - 20px)",
                paddingTop: "5px",
              }}
            >
             
            <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    
                    <button 
                        className="btn btn-sm btn-light"
                        onClick={toggleAllGroups}
                    >
                        {Object.values(expandedGroups).every(val => val) ? 'Collapse All' : 'Expand All'}
                    </button>
                </div>
                
                <div className="card-body p-0">
                    {Object.entries(groupedData).map(([groupName, categories]) => (
                        <div key={groupName} className="mb-3 border-bottom">
                            <div 
                                className="p-3 bg-light d-flex justify-content-between align-items-center cursor-pointer"
                                onClick={() => toggleGroup(groupName)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h5 className="mb-0 text-primary">
                                    <i className={`fas fa-${expandedGroups[groupName] ? 'minus' : 'plus'}-circle me-2`}></i>
                                    {groupName}
                                </h5>
                                <span className="badge bg-secondary">
                                    {Object.keys(categories).length} Categories
                                </span>
                            </div>
                            
                            {expandedGroups[groupName] && (
                                <div className="p-2">
                                    {Object.entries(categories).map(([category, items]) => (
                                        <div key={category} className="mb-3">
                                            <div className="p-2 bg-secondary text-white d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0">{category}</h6>
                                                <span className="badge bg-light text-dark">
                                                    {items.length} Fee Heads
                                                </span>
                                            </div>
                                            
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Head Name</th>
                                                            <th>Amount</th>
                                                            <th>Shift</th>
                                                            <th>Status</th>
                                                            <th>Voucher Type</th>
                                                            <th>Checked Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.head_name}</td>
                                                                <td>{item.amount}</td>
                                                                <td>{item.shift}</td>
                                                                <td>
                                                                    <span className={`badge ${item.status === 'On' ? 'bg-success' : 'bg-danger'}`}>
                                                                        {item.status}
                                                                    </span>
                                                                </td>
                                                                <td>{item.voucher_type}</td>
                                                                <td>
                                                                    {item.checked_status === 'always_checked' ? (
                                                                        <span className="badge bg-primary">Always Checked</span>
                                                                    ) : (
                                                                        <span className="badge bg-warning text-dark">Not Checked</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr className="table-active">
                                                            <td colSpan="1" className="text-end fw-bold">Total:</td>
                                                            <td className="fw-bold">
                                                                {items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)}
                                                            </td>
                                                            <td colSpan="4"></td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            </div>
                    </div>
                     </>
      )}
        </>
    )



}

export default FeeHeadDetails