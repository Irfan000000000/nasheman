import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ChartsOfAccountHead() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, totalPagesGet] = useState("");
    const [getMainHead, setMainHeads] = useState([]);
    const [getSubHead, setSubHeads] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);

    const [filteredLevels, setFilteredLevels] = useState([]); // Track filtered levels based on selected parent head

    const initialState = {
        main_head_id: '',
        code: '',
        level: '',
        name: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        main_head_id: true,
        // code:true,
        level: true,
        name: true,
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
        if (!editFormData.main_head_id) {
            setValidity((prevState) => ({ ...prevState, main_head_id: false }));
            isValid = false;
        }
        if (!editFormData.level) {
            setValidity((prevState) => ({ ...prevState, level: false }));
            isValid = false;
        }

        if (!editFormData.name) {
            setValidity((prevState) => ({ ...prevState, name: false }));
            isValid = false;
        }

        // if (!editFormData.code) {
        //     setValidity((prevState) => ({ ...prevState, code: false }));
        //     isValid = false;
        // }

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
        const fetchMainHeads = () => {
            axios.get(process.env.REACT_APP_API_BASE_URL+"/get-account-main-heads")
                .then(res => {
                    setMainHeads(res.data.results);
                })
                .catch(err => console.log(err));
        };

        fetchMainHeads();
    }, []); // Empty dependency array ensures this effect runs only once, on mount



    useEffect(() => {
        const fetchSubHeads = (main_head_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-account-sub-heads/${main_head_id}`)
                .then(res => {
                    setSubHeads(res.data.results);
                    console.log(res.data.results);
                })
                .catch(err => console.log(err));
        };
    
        if (editFormData.main_head_id) {
            fetchSubHeads(editFormData.main_head_id);
        }
    }, [editFormData.main_head_id]);
    



    //const [itemsPerPage, setitemsPerPage] = useState(10); 

    const [totalItem, setTotalItemGet] = useState(10);

    // const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, [currentPage, totalItem]);





    const fetchData = () => {
        axios.get(process.env.REACT_APP_API_BASE_URL+"/get-sub-head-charts-of-account", {
            params: {
                page: currentPage,
                limit: totalItem,
                search: searchCategoryReport.search
            }
        })
            .then(res => {
                // console.log(res.data.results);
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
                const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'/insert-charts-of-account-head', editFormData, {
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

                setEditFormData(initialState); // Reset form data after successful submission

            } catch (error) {
                console.error('There was an error!', error);
            }

           
        }
    };

    const edit = (id_get) => {
        axios.get(process.env.REACT_APP_API_BASE_URL+`/get-sub-head/${id_get}`)
            .then(response => {
                const { id, main_head_id, parent_code, level, name } = response.data.results[0];
                console.log(response.data.results[0]);
                setEditFormData({
                    main_head_id: main_head_id || '',
                    code: parent_code || '',
                    level: level || '',
                    name: name || '',
                    hidden_id: id || ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


      const levels = {
        2: 'Level 2',
        3: 'Level 3',
        4: 'Level 4'
      };




      // Handle Parent Head selection and filter levels accordingly
    const handleParentHeadChange = (e) => {
        
        const selectedCode = e.target.value;
        const selectedSubHead = getSubHead.find(subHead => subHead.code == selectedCode);


        // Set the selected code in the form data
        setEditFormData({ ...editFormData, code: selectedCode });

        // Filter levels based on the selected Parent Head's level
        if (selectedSubHead) {
            const nextLevel = parseInt(selectedSubHead.level) + 1; // Get next level after the selected level
            setFilteredLevels(Object.keys(levels).filter(level => level == nextLevel));
        }else{
            setFilteredLevels([]);
        }

        // Mark the validity of the field as true
        setValidity({ ...validity, code: true });
    };

    // Handle Level selection
    const handleLevelChange = (e) => {
        setEditFormData({ ...editFormData, level: e.target.value });
        setValidity({ ...validity, level: true });
    };


    return (
        <>
            <div className="d-flex">
                <div className='col-md-6 p-2'>
                    <h5 className='text-warning bg-primary p-2 card-header border'> <i className='fas fa-chart-line'></i> Charts of Account Head Form</h5>
                    <form className='border p-3' onSubmit={handleSubmit}>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Main Head</label>
                            <div className="col-sm-10 ">


                                <select name='main_head_id'
                                    value={editFormData.main_head_id}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, main_head_id: e.target.value });
                                        setValidity({ ...validity, main_head_id: true });
                                    }}

                                    className={validity.main_head_id ? 'form-control' : 'form-control invalid-input'}  >
                                    <option value="">Select Main Head</option>
                                    {getMainHead.map((mainHead, index) => (
                                        <option key={index} value={mainHead.id}>
                                            {mainHead.main_head_name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>


                         <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Parent Head</label>
                            <div className="col-sm-10 ">
                                <select name='code'
                                    value={editFormData.code}
                                    onChange={handleParentHeadChange}
                                    className={'form-control'}  >
                                    <option value="">Select Parent Head</option>
                                    {getSubHead.map((subHead, index) => (
                                        <option key={index} value={subHead.code}>
                                            {subHead.name + " (" + subHead.code + ") " + "(Level - " + subHead.level + ")"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Level</label>
                            <div className="col-sm-10">
                                <select
                                    name="level"
                                    value={editFormData.level}
                                    onChange={handleLevelChange}
                                    className={validity.level ? 'form-control' : 'form-control invalid-input'}
                                >
                                    <option value="">Select Level</option>
                                    {filteredLevels.length > 0 
                                        ? filteredLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {levels[level]}
                                            </option>
                                        ))
                                        : Object.keys(levels).map((level) => (
                                            <option key={level} value={level}>
                                                {levels[level]}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>




                        <div className="form-group row">
                            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Head (Name)</label>
                            <div className="col-sm-10 ">
                                <input
                                    type="text"
                                    name='name'
                                    value={editFormData.name}
                                    onChange={(e) => {
                                        setEditFormData({ ...editFormData, name: e.target.value });
                                        setValidity({ ...validity, name: true });
                                    }}
                                    className={validity.name ? 'form-control' : 'form-control invalid-input'}
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
                                <i className="fas fa-list"></i> Charts Of Account Head
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
                                    <th>S/Head</th>
                                    <th>M/Head</th>
                                    <th>Level</th>
                                    <th className='text-center'>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4">Loading...</td>
                                    </tr>
                                ) : (
                                data.map((subhead, index) => (
                                        <tr key={index}>
                                            {/* <td>{bank_detail.id}</td> */}
                                            <td>{subhead.name + " ("+ subhead.sub_head_code + ")"}</td>
                                            <td>{subhead.main_head_name}</td>
                                            <td>{"Level-" +subhead.level}</td>
                                            <td className='text-center'>
                                                <div><a href="#" className='btn btn-success btn-sm' onClick={() => edit(subhead.id)} ><i className="fas fa-edit"></i></a></div>
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

export default ChartsOfAccountHead