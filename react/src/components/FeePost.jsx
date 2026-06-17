import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FeePost() {

    const ITEMS_PER_PAGE = 10;
    // const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    // const [searchCheck, setSearchCheck] = useState(true);

    const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);

    const [vouchers, setVouchers] = useState([]);
    const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const displayData = filteredData.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    function convertDates(date) {
        const d = new Date(date);

        // Get day, month, and year
        const day = d.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const year = d.getFullYear();

        // Return formatted date as dd-mm-yyyy
        return `${day}-${month}-${year}`;
    }

    const initialState = {
        bank_id: '',
        payment_date: '',
        scroll_no: '',
        voucher_no: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    }

    const [validity, setValidity] = useState({
        bank_id: true,
        payment_date: true,
        scroll_no: true,
        // voucher_no: true,
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
        if (!editFormData.bank_id && !editFormData.bank_id.trim()) {
            setValidity((prevState) => ({ ...prevState, bank_id: false }));
            isValid = false;
        }

        if (!editFormData.payment_date && !editFormData.payment_date.trim()) {
            setValidity((prevState) => ({ ...prevState, payment_date: false }));
            isValid = false;
        }

        if (!editFormData.scroll_no && !editFormData.scroll_no.trim()) {
            setValidity((prevState) => ({ ...prevState, scroll_no: false }));
            isValid = false;
        }

        return isValid;
    };

   

   

    useEffect(() => {
        const fetchBanks = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/bank-detail-campuse-wise/${campus_id}`)
                .then(res => {
                    setBanks(res.data.results);
                })
                .catch(err => console.log(err));
        };

        fetchBanks(user.user.campus_id);
    }, [user]); // Empty dependency array ensures this effect runs only once, on mount

    useEffect(() => {
        if (vouchers.length > 0) {
            setFilteredData(vouchers.reverse());
        }
    }, [vouchers]);

    const deleteData = (id) => {
        // console.log(vouchers.filter(voucher => voucher.id !== id));
        const updatedVouchers = vouchers.filter(voucher => voucher.id !== id);
    setVouchers(updatedVouchers);
    setFilteredData(updatedVouchers.reverse());
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredData(vouchers); // Reset to original vouchers data when search is empty
        } else {
            // Filter the vouchers based on the searchQuery across relevant fields
            const filteredVouchers = vouchers.filter(voucher => {
                return (
                    voucher.full_name.toLowerCase().includes(query) ||
                    voucher.class_name.toLowerCase().includes(query) ||
                    voucher.section_name.toLowerCase().includes(query) ||
                    voucher.invoice_no.toLowerCase().includes(query) ||
                    voucher.for_the_month.toLowerCase().includes(query) ||
                    convertDates(voucher.due_date).toLowerCase().includes(query) ||
                    voucher.amount.toString().toLowerCase().includes(query)
                );
            });
            setFilteredData(filteredVouchers.reverse());
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
           addVoucher();
           setEditFormData({ ...editFormData,
            voucher_no: ''
          });
        }
    };

    const addVoucher = () => {
        if (editFormData.voucher_no === '') {
            toast.error('Please provide a valid Voucher No');
            return;
        }

        if (editFormData.payment_date === '') {
            toast.error('Please Set Payment Date');
            return;
        }


        var type_set = "voucher";
        var for_the_month = 'month_not_set';

        axios.get(process.env.REACT_APP_API_BASE_URL+`/check-voucher-exist/${type_set}/${editFormData.voucher_no}/${editFormData.campus_id}/${editFormData.session_id}/${for_the_month}/${editFormData.payment_date}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.data && response.data.success) {
                    const newVoucher = response.data.get_voucher;
                    const voucherExists = vouchers.some(voucher => voucher.id === newVoucher.id && voucher.for_the_month === newVoucher.for_the_month);

                    if (voucherExists) {
                        toast.error('Voucher already exists');
                    } else {
                        setVouchers(prevVouchers => [...prevVouchers, newVoucher]);
                    }
                } else {
                    toast.error(response.data.error);
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error); // Show the error message from the server
                } else {
                    toast.error('An error occurred while checking the voucher'); // Show a generic error message
                }
            });
    };

    const handleSubmit = (e) => {
        

        e.preventDefault();
        if (validateForm()) {
        const dataToSend = {
            vouchers: displayData,
            session_id: academicSession,
            campus_id: user.user.campus_id,
            payment_date: editFormData.payment_date,
            scroll_no : editFormData.scroll_no,
            bank_id : editFormData.bank_id,
            user_id: user.user.user_id
        };

        axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-recieved-vouchers', dataToSend, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log(response.data);
            setVouchers([]);
            setFilteredData([]);


            setEditFormData({ ...editFormData,
                bank_id: '',
                payment_date: '',
                scroll_no: ''
            });
            toast.success('Fee Vouchers Posted Successfully');
           
        })
        .catch(error => {
            console.error('There was an error submitting the data!', error);
            // Handle error response
        });

    }

    };

    const totalAmount = vouchers.reduce((total, voucher) => total + voucher.amount + voucher.arrears + parseInt(voucher.first_advance_payment) , 0);

    return (
        <>
            <div className="d-flex">

                <div className='col-md-12 p-2' >

                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Fee Vouchers
                            </div>


                            {/* search category */}


                            <div className="d-flex">



                                <div className="me-2 mr-2">
                                    <select name='bank_id'

                                        value={editFormData.bank_id}
                                        onChange={(e) => {
                                            setEditFormData({ ...editFormData, bank_id: e.target.value });
                                            setValidity({ ...validity, bank_id: true });
                                        }}

                                        className={validity.bank_id ? 'form-control' : 'form-control invalid-input'}  >
                                        <option value="">Select Bank</option>
                                        {getBanks.map((bank, index) => (
                                            <option key={index} value={bank.id}>
                                                {bank.bank_name}
                                            </option>
                                        ))}
                                    </select>

                                </div>



                                <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                                    <label htmlFor="" style={{ "margin": "0px" }}>Pay_Date&nbsp;</label>
                                    <input type="date" name='payment_date'

                                        value={editFormData.payment_date}
                                        onChange={(e) => {
                                            setEditFormData({ ...editFormData, payment_date: e.target.value });
                                            setValidity({ ...validity, payment_date: true });
                                        }}
                                        className={validity.payment_date ? 'form-control' : 'form-control invalid-input'}
                                    />

                                </div>


                                <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                                    <label htmlFor="" style={{ "margin": "0px" }}>Scroll#&nbsp;</label>
                                    <input type="text" name='payment_date'

                                        value={editFormData.scroll_no}
                                        onChange={(e) => {
                                            setEditFormData({ ...editFormData, scroll_no: e.target.value });
                                            setValidity({ ...validity, scroll_no: true });
                                        }}
                                        className={validity.scroll_no ? 'form-control' : 'form-control invalid-input'}
                                    />

                                </div>


                                <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                                    <label htmlFor="" style={{ "margin": "0px" }}>Voucher#&nbsp;</label>
                                    <input type="text" name='payment_date'
                                        value={editFormData.voucher_no}
                                        onChange={(e) => {
                                            setEditFormData({ ...editFormData, voucher_no: e.target.value });
                                            
                                            if (e.key === 'Enter') {
                                                handleSubmit();
                                            }
                                        }}

                                        onKeyDown={handleKeyDown}
                                        className='form-control'
                                    />
                                </div>

                                <button className='btn btn-sm btn-warning' onClick={addVoucher}>Add Voucher</button>


                                {/* <div className="me-2 d-none">
                                    <input type="text" className="form-control" id="search_category" onKeyDown={handleKeyDown} onChange={(e) => setEditFormData({ ...editFormData, search: e.target.value })} />
                                    <button className="btn btn-sm btn-danger" onClick={getSearchData} >Search</button>
                                </div> */}

                            </div>

                        </div>
                    </div>

                    <div className='border p-2'>
                       

                    <div>
    <div className='d-flex justify-content-end p-1'>
        <input type="text" className='form-control col-md-2' placeholder='Search.......' onChange={handleSearch} value={searchQuery} />
    </div>
</div>


                        <table className='table m-0'>
                            <thead>
                                <tr>
                                    <th>Sr#</th>
                                    <th>Name</th>
                                    <th>Class(Sec)</th>
                                    <th>V#</th>
                                    <th>V_Month</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th className='text-center'>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayData.map((voucher, index) => (
                                    <tr key={index}>
                                        <td>{currentPage * ITEMS_PER_PAGE + index + 1}</td>
                                        <td>{voucher.full_name}</td>
                                        <td>{voucher.class_name} ({voucher.section_name})</td>
                                        <td>{voucher.invoice_no}</td>
                                        <td>{voucher.for_the_month}</td>
                                        <td>{convertDates(voucher.due_date)}</td>
                                        <td>{voucher.amount + voucher.arrears + parseInt(voucher.first_advance_payment) }</td>
                                        <td className='text-center'>
                                            <div>
                                                <a href="#" className='btn btn-danger btn-sm' onClick={() => deleteData(voucher.id)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="6" className='text-right'>Total Amount</td>
                                    <td>{totalAmount}</td>
                                    <td></td>
                                </tr>
                                <tr >
                                <td colSpan="7">
                                </td>
                                <td className='text-center'>
                                <button onClick={handleSubmit} className='btn btn-sm btn-warning'>Submit</button>
                                </td>
                                </tr>
                            </tfoot>
                        </table>

                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
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

export default FeePost;

