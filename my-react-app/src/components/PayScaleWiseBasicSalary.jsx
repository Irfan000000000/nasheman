import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';


function BanksDetail() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getPayScale, setPayScale] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);





    const initialState = {
        pay_scale_id: '',
        basic_salary: '',
        house_rent: '',
        annual_increment: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        pay_scale_id: true,
        basic_salary: true,
        annual_increment: true,
        house_rent: true
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
        if (!editFormData.pay_scale_id && !editFormData.pay_scale_id.trim()) {
            setValidity((prevState) => ({ ...prevState, pay_scale_id: false }));
            isValid = false;
        }
        if (!editFormData.basic_salary && !editFormData.basic_salary.trim()) {
            setValidity((prevState) => ({ ...prevState, basic_salary: false }));
            isValid = false;
        }


        if (!editFormData.house_rent && !editFormData.house_rent.trim()) {
            setValidity((prevState) => ({ ...prevState, house_rent: false }));
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
        axios.get(process.env.REACT_APP_API_BASE_URL+"/get-pay-scale")
            .then(res => {
                setPayScale(res.data.results);
            })
            .catch(err => console.log(err));
    }, []); // Empty dependency array ensures this effect runs only once, on mount




    //const [itemsPerPage, setitemsPerPage] = useState(10); 

    const [totalItem, setTotalItemGet] = useState(10);

    // const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, [currentPage, totalItem]);





    const fetchData = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/get-basic-salary-scale-wise", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search
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
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-pay_scale_wise_basic_salary', editFormData, {
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
        axios.get(process.env.REACT_APP_API_BASE_URL+`/edit-pay_scale_wise_basic_salary/${id_get}`)
            .then(response => {
                const { id, pay_scale_id, basic_salary, annual_increment, house_rent } = response.data.results[0];
                console.log(response.data.results[0]);
                setEditFormData({
                    pay_scale_id: pay_scale_id || '',
                    basic_salary: basic_salary || '',
                    annual_increment: annual_increment || '',
                    house_rent : house_rent || '',
                    hidden_id: id || '',
                    user_id: user.user.user_id,
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                    <h5 className='text-warning bg-primary p-2 card-header border'> <i className="fas fa-university"></i>Pay Scale Wise (Basic Salary)</h5>
                    <form className='border p-3' onSubmit={handleSubmit}>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Scale</label>
                            <div className="col-sm-10 ">

                                <Select
                                    options={getPayScale.map(payScale => ({
                                        value: payScale.id,
                                        label: `${payScale.pay_scale} (${payScale.job_type})` // Include job_type in the label
                                    }))}
                                    value={
                                        editFormData.pay_scale_id
                                            ? {
                                                value: editFormData.pay_scale_id,
                                                label: getPayScale.find(payScale => payScale.id === editFormData.pay_scale_id)
                                                    ? `${getPayScale.find(payScale => payScale.id === editFormData.pay_scale_id).pay_scale} (${getPayScale.find(payScale => payScale.id === editFormData.pay_scale_id).job_type})`
                                                    : ""
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        setEditFormData({
                                            ...editFormData,
                                            pay_scale_id: selectedOption ? selectedOption.value : ""
                                        })
                                    }
                                    placeholder="Select Pay Scale"
                                    isClearable
                                />

                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">B_Salary</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="number"
                                    name='basic_salary'
                                    value={editFormData.basic_salary}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, basic_salary: e.target.value });
                                        setValidity({ ...validity, basic_salary: true });
                                    }}
                                    className={validity.basic_salary ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Annu.Increment</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="number"
                                    name='annual_increment'
                                    value={editFormData.annual_increment}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, annual_increment: e.target.value });
                                        setValidity({ ...validity, annual_increment: true });
                                    }}
                                    className={validity.annual_increment ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>
                        </div>



                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">House Rent</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="number"
                                    name='house_rent'
                                    value={editFormData.house_rent}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, house_rent: e.target.value });
                                        setValidity({ ...validity, house_rent: true });
                                    }}
                                    className={validity.house_rent ? 'form-control' : 'form-control invalid-input'}
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
                                <i className="fas fa-list"></i> Basic Salary Detail
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
                                    <th>Pay Scale</th>
                                    <th>Basic Salary</th>
                                    <th>Annu.Increments</th>
                                    <th>House Rent</th>
                                    {/* <th className='text-center'>Edit</th> */}
                                    {/* <th className='text-center'>Status</th> */}

                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4">Loading...</td>
                                    </tr>
                                ) : (


                                    data.map((basic_salary, index) => (
                                        <tr key={index}>
                                           
                                            <td>{basic_salary.pay_scale+" (" +basic_salary.job_type+")"}</td>
                                            <td>{basic_salary.basic_salary}</td>
                                            <td>{basic_salary.annual_increment}</td>
                                            <td>{basic_salary.house_rent}</td>
                                            {/* <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(basic_salary.id)} ><i className="fas fa-edit"></i></a></div>
                                            </td> */}
                                            {/* <td className='text-center'>
                                                <div><a href="#" className={`btn btn-sm btn-danger`} onClick={() => deleteRow(basic_salary.id)}><i className="fas fa-trash-alt"></i></a></div>
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

export default BanksDetail