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
        increment_date: '',
        pay_scale_id: '',
        head : '',
        amount : '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        increment_date: true,
        pay_scale_id: true,
        head: true,
        amount: true

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



    // const validateForm = () => {
    //     let isValid = true;
    //     // Basic validation rules (customize as per your requirements)
    //     if (!editFormData.pay_scale_id && !editFormData.pay_scale_id.trim()) {
    //         setValidity((prevState) => ({ ...prevState, pay_scale_id: false }));
    //         isValid = false;
    //     }
    //     if (!editFormData.add && !editFormData.basic_salary.trim()) {
    //         setValidity((prevState) => ({ ...prevState, basic_salary: false }));
    //         isValid = false;
    //     }

    //     if (!editFormData.head && !editFormData.head.trim()) {
    //         setValidity((prevState) => ({ ...prevState, head: false }));
    //         isValid = false;
    //     }


    //     return isValid;
    // };


    const validateForm = () => {
        let isValid = true;
    
        // Basic validation rules (customize as per your requirements)
        if (!editFormData.pay_scale_id || (typeof editFormData.pay_scale_id === 'string' && !editFormData.pay_scale_id.trim())) {
            setValidity((prevState) => ({ ...prevState, pay_scale_id: false }));
            isValid = false;
        }
    
        if (!editFormData.increment_date || (typeof editFormData.increment_date === 'string' && !editFormData.increment_date.trim())) {
            setValidity((prevState) => ({ ...prevState, increment_date: false }));
            isValid = false;
        }
    
        if (!editFormData.head || (typeof editFormData.head === 'string' && !editFormData.head.trim())) {
            setValidity((prevState) => ({ ...prevState, head: false }));
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
                const { id, pay_scale_id, basic_salary } = response.data.results[0];
                console.log(response.data.results[0]);
                setEditFormData({
                    pay_scale_id: pay_scale_id || '',
                    basic_salary: basic_salary || '',
                    hidden_id: id || '',
                    user_id: user.user.user_id,
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    return (
        <>
          

        </>
    )



}

export default BanksDetail