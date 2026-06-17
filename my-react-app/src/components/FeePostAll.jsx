// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import ReactPaginate from 'react-paginate';
// import { useAuth } from './AuthContext';
// import AcademicSessionContext from './AcademicSessionContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Select from 'react-select';

// function FeePostAll() {
//     const ITEMS_PER_PAGE = 10;
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [currentPage, setCurrentPage] = useState(0);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [getBanks, setBanks] = useState([]);
//     const { user } = useAuth();
//     const { academicSession } = useContext(AcademicSessionContext);
//     const [getClasses, setClasses] = useState([]);
//     const [vouchers, setVouchers] = useState([]);
//     const [selectedVouchers, setSelectedVouchers] = useState([]);
//     const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);


//     const [selectAll, setSelectAll] = useState(false); // State to track if all checkboxes are selected



//     const handlePageClick = ({ selected }) => {
//         setCurrentPage(selected);
//     };

//     const displayData = filteredData.slice(
//         currentPage * ITEMS_PER_PAGE,
//         (currentPage + 1) * ITEMS_PER_PAGE
//     );

//     function convertDates(date) {
//         const d = new Date(date);
//         const day = d.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
//         const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
//         const year = d.getFullYear();
//         return `${day}-${month}-${year}`;
//     }

//     const initialState = {
//         bank_id: '',
//         payment_date: '',
//         scroll_no: 0,
//         class_id: '',
//         section_id: '',
//         for_the_month: '',
//         session_id: academicSession,
//         campus_id: user.user.campus_id,
//         user_id: user.user.user_id,
//         hidden_id: ''
//     };

//     const [validity, setValidity] = useState({
//         bank_id: true,
//         payment_date: true,
//         scroll_no: true,
//         for_the_month: true
//     });

//     const [editFormData, setEditFormData] = useState(initialState);

//     useEffect(() => {
//         if (academicSession) {
//             setEditFormData(prevFormData => ({
//                 ...prevFormData,
//                 session_id: parseInt(academicSession)
//             }));
//         }
//     }, [academicSession]);

//     useEffect(() => {
//         const fetchClasses = (campus_id) => {
//             axios.get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
//                 .then(res => {
//                     setClasses(res.data.results);
//                 })
//                 .catch(err => console.log(err));
//         };

//         if (user && user.user.campus_id) {
//             fetchClasses(user.user.campus_id);
//         }
//     }, [user]);

//     const validateForm = () => {
//         let isValid = true;
//         if (!editFormData.bank_id || !editFormData.bank_id.trim()) {
//             setValidity(prevState => ({ ...prevState, bank_id: false }));
//             isValid = false;
//         }

//         if (!editFormData.payment_date || !editFormData.payment_date.trim()) {
//             setValidity(prevState => ({ ...prevState, payment_date: false }));
//             isValid = false;
//         }

//         if (!editFormData.scroll_no || !editFormData.scroll_no.trim()) {
//             setValidity(prevState => ({ ...prevState, scroll_no: false }));
//             isValid = false;
//         }

//         return isValid;
//     };

//     useEffect(() => {
//         const fetchBanks = (campus_id) => {
//             axios.get(process.env.REACT_APP_API_BASE_URL+`/bank-detail-campuse-wise/${campus_id}`)
//                 .then(res => {
//                     setBanks(res.data.results);
//                 })
//                 .catch(err => console.log(err));
//         };

//         fetchBanks(user.user.campus_id);
//     }, [user]);

//     useEffect(() => {
//         if (vouchers.length > 0) {
//             setFilteredData(vouchers.reverse());
//         }
//     }, [vouchers]);

//     const deleteData = (id) => {
//         setVouchers(vouchers.filter(voucher => voucher.id !== id));
//         setSelectedVouchers(selectedVouchers.filter(voucherId => voucherId !== id));
//     };



//     const handleSearch = (e) => {
//         const query = e.target.value.toLowerCase();
//         setSearchQuery(query);

//         if (query.trim() === '') {
//             setFilteredData(vouchers); // Reset to original vouchers data when search is empty
//         } else {
//             const filteredVouchers = vouchers.filter(voucher => {
//                 const fullName = voucher.full_name?.toLowerCase() || '';
//                 const className = voucher.class_name?.toLowerCase() || '';
//                 const sectionName = voucher.section_name?.toLowerCase() || '';
//                 const invoiceNo = voucher.invoice_no?.toLowerCase() || '';
//                 const forTheMonth = voucher.for_the_month?.toLowerCase() || '';
//                 const dueDate = convertDates(voucher.due_date)?.toLowerCase() || '';
//                 const amount = voucher.amount?.toString().toLowerCase() || '';
//                 const arrears = voucher.arrears?.toString().toLowerCase() || '';
//                 const firstAdvancePayment = voucher.first_advance_payment?.toString().toLowerCase() || '';

//                 return (
//                     fullName.includes(query) ||
//                     className.includes(query) ||
//                     sectionName.includes(query) ||
//                     invoiceNo.includes(query) ||
//                     forTheMonth.includes(query) ||
//                     dueDate.includes(query) ||
//                     amount.includes(query) ||
//                     arrears.includes(query) ||
//                     firstAdvancePayment.includes(query)
//                 );
//             });
//             setFilteredData(filteredVouchers.reverse());
//         }
//     };


//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             addVoucher();
//         }
//     };

//     const addVoucher = () => {
//         if (editFormData.class_id === '') {
//             toast.error('Please provide a valid class');
//             return;
//         }

//         if (editFormData.payment_date === '') {
//             toast.error('Please Set Payment Date');
//             return;
//         }

//         const type_set = "class";

//         axios.get(process.env.REACT_APP_API_BASE_URL+`/check-voucher-exist/${type_set}/${editFormData.class_id}/${editFormData.campus_id}/${editFormData.session_id}/${editFormData.for_the_month}/${editFormData.payment_date}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//             .then(response => {
//                 if (response.data && response.data.success) {
//                     const newVouchers = response.data.get_vouchers;
//                     const voucherExists = newVouchers.some(newVoucher =>
//                         vouchers.some(voucher => voucher.id === newVoucher.id && voucher.for_the_month === newVoucher.for_the_month)
//                     );

//                     if (voucherExists) {
//                         toast.error('Voucher already exists');
//                     } else {
//                         setVouchers([]);
//                         setVouchers(prevVouchers => [...prevVouchers, ...newVouchers]);
//                         // setSelectedVouchers(prevSelected => [...prevSelected, ...newVouchers.map(voucher => voucher.id)]); // Add new vouchers to selected list
//                     }
//                 } else {
//                     toast.error(response.data.error);
//                 }
//             })
//             .catch(error => {
//                 console.log(error);
//                 if (error.response && error.response.data && error.response.data.error) {
//                     toast.error(error.response.data.error);
//                 } else {
//                     toast.error('An error occurred while checking the voucher');
//                 }
//             });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             const selectedVoucherDetails = vouchers.filter(voucher => selectedVouchers.includes(voucher.id));
//             const dataToSend = {
//                 vouchers: selectedVoucherDetails,
//                 session_id: academicSession,
//                 campus_id: user.user.campus_id,
//                 payment_date: editFormData.payment_date,
//                 scroll_no: editFormData.scroll_no,
//                 bank_id: editFormData.bank_id
//             };

//             axios.post(process.env.REACT_APP_API_BASE_URL+'/submit-recieved-vouchers', dataToSend, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             })
//                 .then(response => {
//                     console.log(response.data);
//                     setVouchers([]);
//                     setFilteredData([]);
//                     setSelectedVouchers([]);

//                     setEditFormData({
//                         ...editFormData,
//                         bank_id: '',
//                         payment_date: '',
//                         scroll_no: 0
//                     });

//                     toast.success('Fee Vouchers Posted Successfully');
//                 })
//                 .catch(error => {
//                     console.error('There was an error submitting the data!', error);
//                 });
//         }
//     };

//     // const handleVoucherSelect = (voucherId) => {
//     //     setSelectedVouchers(prevSelectedVouchers => {
//     //         if (prevSelectedVouchers.includes(voucherId)) {
//     //             return prevSelectedVouchers.filter(id => id !== voucherId);
//     //         } else {
//     //             return [...prevSelectedVouchers, voucherId];
//     //         }
//     //     });
//     // };

//     const calculateTotalAmount = () => {
//         return vouchers.reduce((total, voucher) => {
//             if (selectedVouchers.includes(voucher.id)) {
//                 return total + voucher.amount + voucher.arrears + parseInt(voucher.first_advance_payment);
//             }
//             return total;
//         }, 0);
//     };

//     const findClassLabel = () => {
//         if (!editFormData.class_id || !editFormData.section_id) {
//             return "";
//         }
//         const classObj = getClasses.find(class_get => class_get.id === parseInt(editFormData.class_id) && class_get.section_id === parseInt(editFormData.section_id));
//         if (classObj) {
//             return `${classObj.class} (${classObj.section_name})`;
//         }
//         return "";
//     };

//     const handleClassChange = (selectedOption) => {
//         const [class_id, section_id] = selectedOption ? selectedOption.value.split(",") : ["", ""];
//         setEditFormData({ ...editFormData, class_id, section_id });
//     };


//     useEffect(() => {
//         if (editFormData.for_the_month) {
//             const selectedMonth = new Date(editFormData.for_the_month);
//             const dueDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 2); // Set due date to the 5th of the next month
//             setEditFormData(prevFormData => ({ ...prevFormData, payment_date: dueDate.toISOString().split('T')[0] }));
//         }
//     }, [editFormData.for_the_month]);



//     const toggleSelectAll = () => {
//         // Use the current state of selectAll to determine what to do next
//         setSelectAll(prevSelectAll => {
//             const allVoucherIds = vouchers.map(voucher => voucher.id);

//             if (prevSelectAll) {
//                 // If selectAll is true, uncheck all checkboxes (clear selectedVouchers)
//                 setSelectedVouchers([]);
//             } else {
//                 // If selectAll is false, check all checkboxes (select all vouchers)
//                 setSelectedVouchers(allVoucherIds);
//             }

//             // Toggle the selectAll state
//             return !prevSelectAll;
//         });
//     };


//     // Function to handle individual checkbox selection
//     // const handleVoucherSelect = (voucherId) => {
//     //     setSelectedVouchers(prevSelectedVouchers => {
//     //         if (prevSelectedVouchers.includes(voucherId)) {
//     //             return prevSelectedVouchers.filter(id => id !== voucherId); // Uncheck the voucher
//     //         } else {
//     //             return [...prevSelectedVouchers, voucherId]; // Check the voucher
//     //         }
//     //     });
//     // };


//     const handleVoucherSelect = (voucherId) => {
//         setSelectedVouchers(prevSelectedVouchers => {
//             if (prevSelectedVouchers.includes(voucherId)) {
//                 // Uncheck this specific voucher
//                 return prevSelectedVouchers.filter(id => id !== voucherId);
//             } else {
//                 // Check this specific voucher
//                 return [...prevSelectedVouchers, voucherId];
//             }
//         });
//     };
    



//     return (
//         <>
//             <div className="d-flex">
//                 <div className='col-md-12 p-2'>
//                     <div className="card-header text-warning bg-primary p-2">
//                         <div className="d-flex justify-content-between align-items-center">
//                             <div>
//                                 <i className="fas fa-list"></i> Fee Vouchers
//                             </div>
//                             <div className="d-flex">
//                                 <div className="me-2 mr-2">
//                                     <select name='bank_id'
//                                         value={editFormData.bank_id}
//                                         onChange={(e) => {
//                                             setEditFormData({ ...editFormData, bank_id: e.target.value });
//                                             setValidity({ ...validity, bank_id: true });
//                                         }}
//                                         className={validity.bank_id ? 'form-control' : 'form-control invalid-input'}>
//                                         <option value="">Select Bank</option>
//                                         {getBanks.map((bank, index) => (
//                                             <option key={index} value={bank.id}>
//                                                 {bank.bank_name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
//                                     <label htmlFor="" style={{ "margin": "0px" }}>Month&nbsp;</label>
//                                     <input type="month" name='for_the_month'
//                                         value={editFormData.for_the_month}
//                                         onChange={(e) => {
//                                             setEditFormData({ ...editFormData, for_the_month: e.target.value });
//                                             setValidity({ ...validity, for_the_month: true });
//                                         }}
//                                         className={validity.for_the_month ? 'form-control' : 'form-control invalid-input'}
//                                     />
//                                 </div>
//                                 <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
//                                     <label htmlFor="" style={{ "margin": "0px" }}>Pay_Date&nbsp;</label>
//                                     <input type="date" name='payment_date'
//                                         value={editFormData.payment_date}
//                                         onChange={(e) => {
//                                             setEditFormData({ ...editFormData, payment_date: e.target.value });
//                                             setValidity({ ...validity, payment_date: true });
//                                         }}
//                                         className={validity.payment_date ? 'form-control' : 'form-control invalid-input'}
//                                     />
//                                 </div>
//                                 <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
//                                     <label htmlFor="" style={{ "margin": "0px" }}>Scroll#&nbsp;</label>
//                                     <input type="number" name='scroll_no'
//                                         value={editFormData.scroll_no}
//                                         onChange={(e) => {
//                                             setEditFormData({ ...editFormData, scroll_no: e.target.value });
//                                             setValidity({ ...validity, scroll_no: true });
//                                         }}
//                                         className={validity.scroll_no ? 'form-control' : 'form-control invalid-input'}
//                                     />
//                                 </div>





//                                 <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
//                                     <Select
//                                         options={getClasses.map(class_get => ({
//                                             value: `${class_get.id},${class_get.section_id}`,
//                                             label: `${class_get.class} (${class_get.section_name})`
//                                         }))}
//                                         value={
//                                             editFormData.class_id && editFormData.section_id
//                                                 ? {
//                                                     value: `${editFormData.class_id},${editFormData.section_id}`,
//                                                     label: findClassLabel()
//                                                 }
//                                                 : null
//                                         }
//                                         onChange={handleClassChange}
//                                         placeholder="Select Class"
//                                     />
//                                 </div>
//                                 <button className='btn btn-sm btn-warning' onClick={addVoucher}>Add Voucher</button>
//                             </div>
//                         </div>
//                     </div>
//                     <div className='border p-2'>
//                         <div className="d-flex justify-content-between">
//                               <div>
//                                     <button onClick={toggleSelectAll} className='mr-2 btn btn-warning btn-sm'>
//                                         {selectAll ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>}
//                                     </button>
//                                 </div>
//                         </div>

//                         <div className='d-flex justify-content-end p-1'>
//                             <input type="text" className='form-control col-md-2' placeholder='Search.......' onChange={handleSearch} value={searchQuery} />
//                         </div>
//                         <table className='table m-0'>
//                             <thead>
//                                 <tr>
//                                     <th>Check</th>
//                                     <th>Sr#</th>
//                                     <th>Name</th>
//                                     <th>Class(Sec)</th>
//                                     <th>V#</th>
//                                     <th>V_Month</th>
//                                     <th>Due Date</th>
//                                     <th>Amount</th>
//                                     <th className='text-center'>Remove</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {displayData.map((voucher, index) => (
//                                     <tr key={index}>
//                                         <td>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedVouchers.includes(voucher.id)}
//                                                 onChange={() => handleVoucherSelect(voucher.id)}
//                                             />
//                                         </td>
//                                         <td>{currentPage * ITEMS_PER_PAGE + index + 1}</td>
//                                         <td>{voucher.full_name}</td>
//                                         <td>{voucher.class_name} ({voucher.section_name})</td>
//                                         <td>{voucher.invoice_no}</td>
//                                         <td>{voucher.for_the_month}</td>
//                                         <td>{convertDates(voucher.due_date)}</td>
//                                         <td>{voucher.amount + voucher.arrears + parseInt(voucher.first_advance_payment)}</td>
//                                         <td className='text-center'>
//                                             <div>
//                                                 <a href="#" className='btn btn-danger btn-sm' onClick={() => deleteData(voucher.id)}>
//                                                     <i className="fas fa-trash-alt"></i>
//                                                 </a>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                             <tfoot>
//                                 <tr>
//                                     <td colSpan="7" className='text-right'>Total Amount</td>
//                                     <td>{calculateTotalAmount()}</td>
//                                     <td></td>
//                                 </tr>
//                                 <tr>
//                                     <td colSpan="8" >
//                                     </td>
//                                     <td className='text-center'>
//                                         <button onClick={handleSubmit} className='btn btn-sm btn-warning'>Submit</button>
//                                     </td>
//                                 </tr>
//                             </tfoot>
//                         </table>
//                         <ReactPaginate
//                             previousLabel={'Previous'}
//                             nextLabel={'Next'}
//                             breakLabel={'...'}
//                             pageCount={pageCount}
//                             marginPagesDisplayed={2}
//                             pageRangeDisplayed={3}
//                             onPageChange={handlePageClick}
//                             containerClassName={'pagination'}
//                             pageClassName={'page-item'}
//                             activeClassName={'active'}
//                             pageLinkClassName={'page-link'}
//                             previousClassName={'page-item'}
//                             previousLinkClassName={'page-link'}
//                             nextClassName={'page-item'}
//                             nextLinkClassName={'page-link'}
//                             breakClassName={'page-item'}
//                             breakLinkClassName={'page-link'}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default FeePostAll;

//upper code is 100% okay dont delete it



import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

function FeePostAll() {
    const ITEMS_PER_PAGE = 10;
    // const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [getBanks, setBanks] = useState([]);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getClasses, setClasses] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [selectedVouchers, setSelectedVouchers] = useState([]);
    const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const [isClassSelected, setIsClassSelected] = useState(false); // Track if class has been selected before


    const [selectAll, setSelectAll] = useState(false); // State to track if all checkboxes are selected



    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const displayData = filteredData.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    function convertDates(date) {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const initialState = {
        bank_id: '',
        payment_date: '',
        scroll_no: 0,
        class_id: '',
        section_id: '',
        for_the_month: '',
        session_id: academicSession,
        campus_id: user.user.campus_id,
        user_id: user.user.user_id,
        hidden_id: ''
    };

    const [validity, setValidity] = useState({
        bank_id: true,
        payment_date: true,
        scroll_no: true,
        for_the_month: true
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
        const fetchClasses = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-classes/${campus_id}`)
                .then(res => {
                    setClasses(res.data.results);
                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id) {
            fetchClasses(user.user.campus_id);
        }
    }, [user]);

    const validateForm = () => {
        let isValid = true;
        if (!editFormData.bank_id || !editFormData.bank_id.trim()) {
            setValidity(prevState => ({ ...prevState, bank_id: false }));
            isValid = false;
        }

        if (!editFormData.payment_date || !editFormData.payment_date.trim()) {
            setValidity(prevState => ({ ...prevState, payment_date: false }));
            isValid = false;
        }

        if (!editFormData.scroll_no || !editFormData.scroll_no.trim()) {
            setValidity(prevState => ({ ...prevState, scroll_no: false }));
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
    }, [user]);

    useEffect(() => {
        if (vouchers.length > 0) {
            setFilteredData(vouchers.reverse());
        }
    }, [vouchers]);

    const deleteData = (id) => {
        setVouchers(vouchers.filter(voucher => voucher.id !== id));
        setSelectedVouchers(selectedVouchers.filter(voucherId => voucherId !== id));
    };



    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredData(vouchers); // Reset to original vouchers data when search is empty
        } else {
            const filteredVouchers = vouchers.filter(voucher => {
                const fullName = voucher.full_name?.toLowerCase() || '';
                const className = voucher.class_name?.toLowerCase() || '';
                const sectionName = voucher.section_name?.toLowerCase() || '';
                const invoiceNo = voucher.invoice_no?.toLowerCase() || '';
                const forTheMonth = voucher.for_the_month?.toLowerCase() || '';
                const dueDate = convertDates(voucher.due_date)?.toLowerCase() || '';
                const amount = voucher.amount?.toString().toLowerCase() || '';
                const arrears = voucher.arrears?.toString().toLowerCase() || '';
                const firstAdvancePayment = voucher.first_advance_payment?.toString().toLowerCase() || '';

                return (
                    fullName.includes(query) ||
                    className.includes(query) ||
                    sectionName.includes(query) ||
                    invoiceNo.includes(query) ||
                    forTheMonth.includes(query) ||
                    dueDate.includes(query) ||
                    amount.includes(query) ||
                    arrears.includes(query) ||
                    firstAdvancePayment.includes(query)
                );
            });
            setFilteredData(filteredVouchers.reverse());
        }
    };


    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         addVoucher();
    //     }
    // };

    const addVoucher = () => {
        if (editFormData.class_id === '') {
            toast.error('Please provide a valid class');
            return;
        }

        if (editFormData.payment_date === '') {
            toast.error('Please Set Payment Date');
            return;
        }

        const type_set = "class";

        axios.get(process.env.REACT_APP_API_BASE_URL+`/check-voucher-exist/${type_set}/${editFormData.class_id}/${editFormData.campus_id}/${editFormData.session_id}/${editFormData.for_the_month}/${editFormData.payment_date}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.data && response.data.success) {
                    const newVouchers = response.data.get_vouchers;
                    const voucherExists = newVouchers.some(newVoucher =>
                        vouchers.some(voucher => voucher.id === newVoucher.id && voucher.for_the_month === newVoucher.for_the_month)
                    );

                    if (voucherExists) {
                        toast.error('Voucher already exists');
                    } else {
                        setVouchers([]);
                        setVouchers(prevVouchers => [...prevVouchers, ...newVouchers]);
                        // setSelectedVouchers(prevSelected => [...prevSelected, ...newVouchers.map(voucher => voucher.id)]); // Add new vouchers to selected list
                    }
                } else {
                    toast.error(response.data.error);
                }
            })
            .catch(error => {
                console.log(error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error('An error occurred while checking the voucher');
                }
            });
    };



    // useEffect(() => {

    //     if(vouchers.length > 0) {
    //         let confirm_again_posting = window.confirm('Are you sure!Change Fee Posting Option');
    //         if(confirm_again_posting){
    //             setVouchers([]);
    //             setFilteredData([]);
    //             setSelectedVouchers([]);
    //             addVoucher();
    //         }else{
    //             setEditFormData(prevState => {
    //             console.log("Before update:", prevState);
    //             const newState = {
    //                 ...prevState,
    //                 class_id: prevState.class_id // Reverting back to the original
    //             };
    //             console.log("After update:", newState);
    //             return newState;
    //            });

    //         }
    //     }
       
        
    // }, [editFormData.class_id]);

    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const selectedVoucherDetails = vouchers.filter(voucher => selectedVouchers.includes(voucher.id));
            const dataToSend = {
                vouchers: selectedVoucherDetails,
                session_id: academicSession,
                campus_id: user.user.campus_id,
                payment_date: editFormData.payment_date,
                scroll_no: editFormData.scroll_no,
                bank_id: editFormData.bank_id,
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
                    setSelectedVouchers([]);

                    // setEditFormData({
                    //     ...editFormData,
                    //     bank_id: '',
                    //     payment_date: '',
                    //     scroll_no: 0
                    // });

                    toast.success('Fee Vouchers Posted Successfully');
                })
                .catch(error => {
                    console.error('There was an error submitting the data!', error);
                });
        }
    };

    // const handleVoucherSelect = (voucherId) => {
    //     setSelectedVouchers(prevSelectedVouchers => {
    //         if (prevSelectedVouchers.includes(voucherId)) {
    //             return prevSelectedVouchers.filter(id => id !== voucherId);
    //         } else {
    //             return [...prevSelectedVouchers, voucherId];
    //         }
    //     });
    // };

    const calculateTotalAmount = () => {
        return vouchers.reduce((total, voucher) => {
            if (selectedVouchers.includes(voucher.id)) {
                return total + voucher.amount + voucher.arrears + parseInt(voucher.first_advance_payment);
            }
            return total;
        }, 0);
    };

    const findClassLabel = () => {
        if (!editFormData.class_id || !editFormData.section_id) {
            return "";
        }
        const classObj = getClasses.find(class_get => class_get.id === parseInt(editFormData.class_id) && class_get.section_id === parseInt(editFormData.section_id));
        if (classObj) {
            return `${classObj.class} (${classObj.section_name})`;
        }
        return "";
    };

  

const handleClassChange = (selectedOption) => {
    const [class_id, section_id] = selectedOption ? selectedOption.value.split(",") : ["", ""];

    if (!isClassSelected) {
        // First selection is free
        setEditFormData(prev => ({ ...prev, class_id, section_id }));
        setIsClassSelected(true); // Mark that a selection has been made
        return;
    }

    if (vouchers.length > 0) {
        const confirm_again_posting = window.confirm('Are you sure you want to change the Class/Section?');

        if (confirm_again_posting) {
            setEditFormData(prev => ({ ...prev, class_id, section_id }));
            setVouchers([]);
            setFilteredData([]);
            setSelectedVouchers([]);
            addVoucher();
        } else {
            // Do nothing (keep the previous class_id)
            return;
        }
    } else {
        // If no vouchers exist, allow change freely
        setEditFormData(prev => ({ ...prev, class_id, section_id }));
    }
};



    useEffect(() => {
        if (editFormData.for_the_month) {
            const selectedMonth = new Date(editFormData.for_the_month);
            const dueDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 2); // Set due date to the 5th of the next month
            setEditFormData(prevFormData => ({ ...prevFormData, payment_date: dueDate.toISOString().split('T')[0] }));
        }
    }, [editFormData.for_the_month]);



    const toggleSelectAll = () => {
        // Use the current state of selectAll to determine what to do next
        setSelectAll(prevSelectAll => {
            const allVoucherIds = vouchers.map(voucher => voucher.id);

            if (prevSelectAll) {
                // If selectAll is true, uncheck all checkboxes (clear selectedVouchers)
                setSelectedVouchers([]);
            } else {
                // If selectAll is false, check all checkboxes (select all vouchers)
                setSelectedVouchers(allVoucherIds);
            }

            // Toggle the selectAll state
            return !prevSelectAll;
        });
    };


    // Function to handle individual checkbox selection
    // const handleVoucherSelect = (voucherId) => {
    //     setSelectedVouchers(prevSelectedVouchers => {
    //         if (prevSelectedVouchers.includes(voucherId)) {
    //             return prevSelectedVouchers.filter(id => id !== voucherId); // Uncheck the voucher
    //         } else {
    //             return [...prevSelectedVouchers, voucherId]; // Check the voucher
    //         }
    //     });
    // };


    const handleVoucherSelect = (voucherId) => {
        setSelectedVouchers(prevSelectedVouchers => {
            if (prevSelectedVouchers.includes(voucherId)) {
                // Uncheck this specific voucher
                return prevSelectedVouchers.filter(id => id !== voucherId);
            } else {
                // Check this specific voucher
                return [...prevSelectedVouchers, voucherId];
            }
        });
    };
    


    const handleFieldChange = (field, value) => {
        if (!editFormData[field]) {
            // If it's the first time selecting, allow change freely
            setEditFormData(prev => ({ ...prev, [field]: value }));
            setValidity(prev => ({ ...prev, [field]: true }));
        } else {
            // If value was already set, ask for confirmation before changing
            let confirmChange = window.confirm(`Are you sure you want to change ${field.replace('_', ' ')}?`);
            
            if (confirmChange) {
                setEditFormData(prev => ({ ...prev, [field]: value }));
                setValidity(prev => ({ ...prev, [field]: true }));
                setVouchers([]);
                setFilteredData([]);
                setSelectedVouchers([]);
                addVoucher();
            } else {
                // Revert to previous state if canceled
                setEditFormData(prev => ({ ...prev, [field]: prev[field] }));
            }
        }
    };
    


    return (
        <>
            <div className="d-flex">
                <div className='col-md-12 p-2'>
                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Fee Vouchers
                            </div>
                            <div className="d-flex">
                               

                            <div className="me-2 mr-2">
                            <select 
                                value={editFormData.bank_id}
                                onChange={(e) => {
                                setEditFormData({ ...editFormData, bank_id: e.target.value });
                                setValidity({ ...validity, bank_id: true });
                                }}
                                className={validity.bank_id ? 'form-control' : 'form-control invalid-input'}>
                                <option value="">Select Bank</option>
                                {getBanks.map((bank, index) => (
                                    <option key={index} value={bank.id}>
                                        {bank.bank_name}
                                    </option>
                                ))}
                            </select>
                            </div>

                            <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                                <label htmlFor="" style={{ margin: "0px" }}>Month&nbsp;</label>
                                <input 
                                    type="month" 
                                    name='for_the_month'
                                    value={editFormData.for_the_month}
                                    onChange={(e) => handleFieldChange('for_the_month', e.target.value)}
                                    className={validity.for_the_month ? 'form-control' : 'form-control invalid-input'}
                                />
                            </div>

                            <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                                <label htmlFor="" style={{ margin: "0px" }}>Pay_Date&nbsp;</label>
                                <input type="date" name='payment_date'
                                value={editFormData.payment_date}
                                onChange={(e) => {
                                setEditFormData({ ...editFormData, payment_date: e.target.value });
                                setValidity({ ...validity, payment_date: true });
                                }}
                                className={validity.payment_date ? 'form-control' : 'form-control invalid-input'}/>
                            </div>

                            <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                                <label htmlFor="" style={{ margin: "0px" }}>Scroll#&nbsp;</label>
                                <input type="number" name='scroll_no'
                                value={editFormData.scroll_no}
                                onChange={(e) => {
                                setEditFormData({ ...editFormData, scroll_no: e.target.value });
                                setValidity({ ...validity, scroll_no: true });
                                }}
                                className={validity.scroll_no ? 'form-control' : 'form-control invalid-input'}/>
                            </div>






                                <div className="me-2 mr-2 d-flex justify-content-center align-items-center">
                                    <Select
                                        options={getClasses.map(class_get => ({
                                            value: `${class_get.id},${class_get.section_id}`,
                                            label: `${class_get.class} (${class_get.section_name})`
                                        }))}
                                        value={
                                            editFormData.class_id && editFormData.section_id
                                                ? {
                                                    value: `${editFormData.class_id},${editFormData.section_id}`,
                                                    label: findClassLabel()
                                                }
                                                : null
                                        }
                                        onChange={handleClassChange}
                                        placeholder="Select Class"
                                    />
                                </div>
                                <button className='btn btn-sm btn-warning' onClick={addVoucher}>Add Voucher</button>
                            </div>
                        </div>
                    </div>
                    <div className='border p-2'>
                        <div className="d-flex justify-content-between">
                              <div>
                                    <button onClick={toggleSelectAll} className='mr-2 btn btn-warning btn-sm'>
                                        {selectAll ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>}
                                    </button>
                                </div>
                        </div>

                        <div className='d-flex justify-content-end p-1'>
                            <input type="text" className='form-control col-md-2' placeholder='Search.......' onChange={handleSearch} value={searchQuery} />
                        </div>
                        <table className='table m-0'>
                            <thead>
                                <tr>
                                    <th>Check</th>
                                    <th>Sr#</th>
                                    <th>Name</th>
                                    <th>Class(Sec)</th>
                                    <th>V#</th>
                                    <th>V_Month</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th className='text-center'>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayData.map((voucher, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedVouchers.includes(voucher.id)}
                                                onChange={() => handleVoucherSelect(voucher.id)}
                                            />
                                        </td>
                                        <td>{currentPage * ITEMS_PER_PAGE + index + 1}</td>
                                        <td>{voucher.full_name}</td>
                                        <td>{voucher.class_name} ({voucher.section_name})</td>
                                        <td>{voucher.invoice_no}</td>
                                        <td>{voucher.for_the_month}</td>
                                        <td>{convertDates(voucher.due_date)}</td>
                                        <td>{voucher.amount + voucher.arrears + parseInt(voucher.first_advance_payment)}</td>
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
                                    <td colSpan="7" className='text-right'>Total Amount</td>
                                    <td>{calculateTotalAmount()}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan="8" >
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
    );
}

export default FeePostAll;



