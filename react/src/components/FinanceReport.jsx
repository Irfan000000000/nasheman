
import React, { useState, useEffect, useContext  } from 'react';
import axios from 'axios';
import Select from 'react-select';
// import * as XLSX from 'xlsx';
import moment from 'moment';
// import { saveAs } from 'file-saver';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';





const FinanceReport = () => {


    // const [vouchers, setVouchers] = useState([]);

    const [scrollVouchers, setScrollVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState(scrollVouchers);

    // const [datewisePosting, setDatewisePosting] = useState([]);
    // const [datewisePostingfilteredVouchers, setDatesisePostingFilteredVouchers] = useState(datewisePosting);

    // const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    // const [getCategories, setCategories] = useState([]);
    const [getClasses, setClasses] = useState([]);
    const [showData, setShowData] = useState(false);
    // const [monthlyReports, setMonthlyReports] = useState({});
    // const [receivableAndPayableData, setReceivableAndPayableData] = useState([]);
    // const [totalPages, setTotalPages] = useState(1);

    // const [totalAmount, setTotalAmount] = useState(0);
    // const [totalRecievedAmount, setTotalRecievedAmount] = useState(0);

    // const [getGrandTotalPayable, setGrandTotalPayable] = useState(0);
    // const [lastMonth, setLastMonth] = useState('');

    // const [previousMonthArrearFine, setPreviousMonthArrearFine] = useState(0);


    // const [getStruckOffUnpaidTotal, setStruckOffUnpaidTotal] = useState(0);


    const navigate = useNavigate();

    const initialFormData = {
        class_id: '',
        report_type_get: '',
        section_id: '',
        category_id: '',
        status: '',
        from_month: '',
        to_month: '',
        search: '',
        search_frontend: '',
        from_date: '',
        to_date: '',
        page: 1,
        limit: 100,
        campus_id: user.user.campus_id,
        session_id: academicSession
    };

    const [editFormData, setEditFormData] = useState(initialFormData);


    function convertDates(date) {
        const d = new Date(date);

        // Get day, month, and year
        const day = d.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
        const year = d.getFullYear();

        // Return formatted date as dd-mm-yyyy
        return `${day}-${month}-${year}`;
    }


    useEffect(() => {
        if (editFormData.report_type_get == "Recievable & Payable") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.full_name.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        }else if(editFormData.report_type_get == "Pendency Report") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.full_name.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        }else if (editFormData.report_type_get == "Scroll Wise Report") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.payment_date.toLowerCase().includes(searchQuery) ||
                voucher.scroll_no.toString().includes(searchQuery) ||
                voucher.total_recieved_payment.toString().includes(searchQuery) ||
                voucher.bank_name.toLowerCase().includes(searchQuery) ||
                voucher.account_title.toLowerCase().includes(searchQuery) ||
                voucher.account_no.toString().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Datewise Posting Report") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.invoice_no.includes(searchQuery) ||
                voucher.register_no.toLowerCase().toString().includes(searchQuery) ||
                voucher.old_register_no.toString().includes(searchQuery) ||
                voucher.full_name.toLowerCase().toString().includes(searchQuery) ||
                voucher.class.toLowerCase().includes(searchQuery) ||
                voucher.section_name.toLowerCase().includes(searchQuery) ||
                voucher.for_the_month.includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Bank Wise Summary Report") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.bank_name.toLowerCase().includes(searchQuery) ||
                voucher.account_title.toLowerCase().includes(searchQuery) ||
                voucher.account_no.toString().includes(searchQuery) ||
                voucher.payment_date.toLowerCase().includes(searchQuery) ||
                voucher.total_recieved_payment.toString().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Total Fee Allocate") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.class.toLowerCase().includes(searchQuery) ||
                voucher.section_name.toLowerCase().includes(searchQuery) ||
                voucher.created_at.includes(searchQuery) ||
                voucher.due_date.includes(searchQuery) ||
                voucher.total_amount.toString().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Total Fee Campus Wise") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.class.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Income Tax Report") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.full_name.toLowerCase().includes(searchQuery) ||  voucher.employee_post.toLowerCase().includes(searchQuery)
               ||  voucher.pay_scale.toLowerCase().includes(searchQuery)  ||  voucher.job_type.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Over Time Report") {
            
            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.full_name.toLowerCase().includes(searchQuery) ||  voucher.employee_post.toLowerCase().includes(searchQuery)
               ||  voucher.pay_scale.toLowerCase().includes(searchQuery)  ||  voucher.job_type.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "2nd Shift Honorarium Report") {
            
            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.full_name.toLowerCase().includes(searchQuery) ||  voucher.employee_post.toLowerCase().includes(searchQuery)
               ||  voucher.pay_scale.toLowerCase().includes(searchQuery)  ||  voucher.job_type.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Security Deduction Report") {
            
            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.full_name.toLowerCase().includes(searchQuery) ||  voucher.employee_post.toLowerCase().includes(searchQuery)
               ||  voucher.pay_scale.toLowerCase().includes(searchQuery)  ||  voucher.job_type.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "CPF Deduction Report") {
            
            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.full_name.toLowerCase().includes(searchQuery) ||  voucher.employee_post.toLowerCase().includes(searchQuery)
               ||  voucher.pay_scale.toLowerCase().includes(searchQuery)  ||  voucher.job_type.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "General Ledger" || editFormData.report_type_get == "Profit And Loss Report" || editFormData.report_type == "Trial Balance" || editFormData.report_type == "Balance Sheet" ){
            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.main_head_name.toLowerCase().includes(searchQuery) ||  voucher.name.toLowerCase().includes(searchQuery)
               ||  voucher.voucher_date.toLowerCase().includes(searchQuery)  ||  voucher.description.toLowerCase().includes(searchQuery)
               ||  voucher.voucher_invoice_no.toString().includes(searchQuery)
            );
            setFilteredVouchers(filtered);
        }

    }, [editFormData.search_frontend, scrollVouchers]);



    // useEffect(() => {
    //     const fetchCategories = (campus_id) => {
    //         axios.get(process.env.REACT_APP_API_BASE_URL+`/get-categories/${campus_id}`)
    //             .then(res => {
    //                 setCategories(res.data.results);
    //             })
    //             .catch(err => console.log(err));
    //     };

    //     if (user && user.user.campus_id) {
    //         fetchCategories(user.user.campus_id);
    //     }
    // }, [user]);

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

    useEffect(() => {

        fetchData();
    }, [editFormData.page]);




    useEffect(() => {
        if (editFormData.search == '') {
            fetchData();
        }

    }, [editFormData.search]);





    const handleSearch = () => {
        fetchData();
    };



    const exportReportToExcel = () => {
        
    }


    const fetchData = () => {


        if (!editFormData.report_type_get) {
            return; // Stop function execution
        }

        // console.log("hit");
        // setLoading(true);

       

        const { from_month, to_month, from_date, to_date, class_id, section_id, category_id, report_type_get, page, limit, search } = editFormData;

        let url = '';
        let params = {
            from_month,
            to_month,
            from_date,
            to_date,
            class_id,
            section_id,
            category_id,
            session_id: academicSession,
            campus_id: user.user.campus_id,
            search,
            page,
            limit
        };

        if (report_type_get === 'Headwise Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/fee-vouchers-report';
        } else if (report_type_get === 'Pendency Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/vouchers-pending-report-classwise';
        } else if (report_type_get === 'Recievable & Payable') {
            url = process.env.REACT_APP_API_BASE_URL+'/recievable-and-payable-report';
        } else if (report_type_get === 'Scroll Wise Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/vouchers-scrollwise-report';
        } else if (report_type_get === 'Datewise Posting Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/datewise-posting-report';
        } else if (report_type_get === 'Bank Wise Summary Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/bankwise-summary-report';
        } else if (report_type_get === 'Total Fee Allocate') {
            url = process.env.REACT_APP_API_BASE_URL+'/total-fee-allocate';
        } else if (report_type_get === 'Total Fee Campus Wise') {
            url = process.env.REACT_APP_API_BASE_URL+'/total-fee-campus-wise';
        } else if (report_type_get === 'Income Tax Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/income-tax-report';
        } else if (report_type_get === 'Over Time Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/over-time-report';
        } else if (report_type_get === '2nd Shift Honorarium Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/second-shift-honorarium-report';
        } else if (report_type_get === 'Security Deduction Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/security-deduction-report';
        } else if (report_type_get === 'CPF Loan Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/cpf-loan-report';
        } else if (report_type_get === 'CPF Deduction Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/cpf-deduction-report';
        }else if (report_type_get === 'General Ledger'  || report_type_get == 'Trial Balance' || report_type_get == 'Balance Sheet' || report_type_get == 'Profit And Loss Report') {
            url = process.env.REACT_APP_API_BASE_URL+'/general-ledger-report';
        }

        // console.log("yes hit", url);

        axios.get(url, { params })
            .then(res => {
                if (report_type_get === 'Headwise Report') {
                    const vouchers = res.data.feeVouchers;
                    const feeHeadDetails = res.data.feeHeadDetails;

                    // const grandTotalFineLastMonth = res.data.grandTotalFineLastMonth;

                    // setPreviousMonthArrearFine(grandTotalFineLastMonth);
                    // setStruckOffUnpaidTotal(res.data.unpaidTotal);

                    const monthlyReports = vouchers.reduce((acc, voucher) => {
                        const monthStr = voucher.for_the_month.substring(0, 7);  // Assuming the backend returns 'for_the_month' as a date string
                        if (!acc[monthStr]) {
                            acc[monthStr] = { vouchers: [], feeHeadDetails: feeHeadDetails };
                        }
                        const feeHeads = JSON.parse(voucher.fee_head);
                        const updatedFeeHeads = feeHeads.map(feeHead => {
                            const matchingHead = feeHeadDetails.find(head => head.id === feeHead.id);
                            return { ...feeHead, head_name: matchingHead ? matchingHead.head_name : '' };
                        });
                        acc[monthStr].vouchers.push({ ...voucher, fee_head: updatedFeeHeads });
                        return acc;
                    }, {});

                    // setMonthlyReports(monthlyReports);
                } else if (report_type_get === 'Pendency Report') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);
                    setFilteredVouchers(res.data.feeVouchers)
                } else if (report_type_get === 'Recievable & Payable') {

                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.feeVouchers);  // Set filteredVouchers to the initial data

                } else if (report_type_get === 'Scroll Wise Report') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.feeVouchers);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'Datewise Posting Report') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.results);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.results);  // Set filteredVouchers to the initial data
                    // setLastMonth(res.data.last_month);
                } else if (report_type_get === 'Bank Wise Summary Report') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.feeVouchers);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'Total Fee Allocate') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.feeVouchers);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'Total Fee Campus Wise') {
                    console.log(res.data.feeVouchers);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.feeVouchers);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'Income Tax Report') {
                    console.log(res.data.salaryResults);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.salaryResults);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.salaryResults);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'Over Time Report') {
                    console.log(res.data.salaryResults);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.salaryResults);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.salaryResults);  // Set filteredVouchers to the initial data
                }  else if (report_type_get === '2nd Shift Honorarium Report') {
                    console.log(res.data.salaryResults);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.salaryResults);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.salaryResults);  // Set filteredVouchers to the initial data
                }  else if (report_type_get === 'Security Deduction Report') {
                    console.log(res.data.salaryResults);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.salaryResults);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.salaryResults);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'CPF Loan Report') {
                    console.log(res.data.salaryResults);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.salaryResults);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.salaryResults);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'CPF Deduction Report') {
                    // console.log(res.data.salaryResults);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.salaryResults);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.salaryResults);  // Set filteredVouchers to the initial data
                }else if (report_type_get == 'General Ledger' || report_type_get == 'Trial Balance' || report_type_get == 'Balance Sheet' || report_type_get == 'Profit And Loss Report') {
                    // console.log("results", res.data.results);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.results);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.results);  // Set filteredVouchers to the initial data
                }
                // if (report_type_get !== 'Pendency Report') {
                // setTotalPages(res.data.totalPages);
                // }

                //upper logic is okay but we need to check the below logic
                if (report_type_get == 'Pendency Report') {
                    // setTotalPages(res.data.totalPages);
                }
                // setLoading(false);
                setShowData(true);
            })
            .catch(err => {
                console.log(err);
                // setLoading(false);
            });
    };

    const formatMonths = (months) => {
        if (!months) return '';
        return months.split(',').map(month => moment(month, 'YYYY-MM').format('MMM-YYYY')).join(', ');
    };


    function searchPendency() {
        fetchData();
    }


    const edit = (id_get) => {
        localStorage.setItem('voucher_id', JSON.stringify(id_get));
        navigate('/edit-fee-voucher');
    }

    // const unpostData = (id_get, full_name) => {
    //     console.log(id_get);
    //     var confirm_unpost = window.confirm("Unpost fee voucher of "+full_name+" ! Are you sure ");

    //     if (confirm_unpost) {
    //     axios.get(process.env.REACT_APP_API_BASE_URL+`/unpost-fee-voucher/${id_get}/${editFormData.campus_id}/${editFormData.session_id}`)
    //         .then(response => {
    //             setScrollVouchers(prevData => prevData.filter(voucher => voucher.id !== id_get));
    //             setFilteredVouchers(prevData => prevData.filter(voucher => voucher.id !== id_get));
    //             toast.success('Fee Vouchers Unposted Successfully');
    //         })
    //         .catch(error => {
    //             console.error('Error unposting....', error);
    //         });
    //     }
    // };



    const unpostData = (id_get, full_name) => {
        const confirm_unpost = window.confirm(`Unpost fee voucher of ${full_name}! Are you sure?`);

        if (confirm_unpost) {
            // Send the unpost request to the server
            axios.get(process.env.REACT_APP_API_BASE_URL+`/unpost-fee-voucher/${id_get}/${editFormData.campus_id}/${editFormData.session_id}`)
                .then(response => {
                    // console.log('Unposting voucher with id:', id_get);
                    setScrollVouchers(prevData => {
                        // console.log('Filtering scrollVouchers:');
                        return prevData.filter(voucher => {
                            // console.log(`Comparing voucher.id (${voucher.id}) with id_get (${id_get})`);
                            return String(voucher.id) !== String(id_get);  // Convert both to strings for comparison
                        });
                    });

                    setFilteredVouchers(prevData => {
                        // console.log('Filtering filteredVouchers:');
                        return prevData.filter(voucher => {
                            // console.log(`Comparing voucher.id (${voucher.id}) with id_get (${id_get})`);
                            return String(voucher.id) !== String(id_get);  // Convert both to strings for comparison
                        });
                    });

                    // Show a success message
                    toast.success('Fee Voucher Unposted Successfully');
                })
                .catch(error => {
                    console.error('Error unposting fee voucher:', error);
                });
        }
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
        setEditFormData({ ...editFormData, class_id, section_id });
    };


    const groupVouchersByCategoryAndClass = (vouchers) => {
        return vouchers.reduce((acc, voucher) => {
            const category = acc[voucher.category] || {};
            const className = category[voucher.class_name] || [];
            className.push(voucher);
            category[voucher.class_name] = className;
            acc[voucher.category] = category;
            return acc;
        }, {});
    };

    
    const calculateSubtotal = (vouchers, field) => {
        return vouchers.reduce((sum, voucher) => sum + (voucher[field] ? parseInt(voucher[field]) : 0), 0);
    };

    const calculateSubtotalForHead = (vouchers, head) => {
        return vouchers.reduce((sum, voucher) => {
            const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
            return sum + (feeHead ? feeHead.amount : 0);
        }, 0);
    };

    const calculateGrandTotal = (vouchers, field) => {
        return vouchers.reduce((sum, voucher) => sum + (voucher[field] ? parseInt(voucher[field]) : 0), 0);
    };

    const calculateGrandTotalForHead = (vouchers, head) => {
        return vouchers.reduce((sum, voucher) => {
            const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
            return sum + (feeHead ? feeHead.amount : 0);
        }, 0);
    };

    const resetStates = () => {
        setEditFormData(initialFormData);
    };

    const calculateGrandTotalPending = (vouchers) => {
        return vouchers.reduce((total, voucher) => total + parseFloat(voucher.payable_amount_after_due_date), 0);
    };

   

    // const grandTotal = calculateGrandTotalPending(vouchers);


    const getReportTitle = () => {
        switch (editFormData.report_type_get) {
            case 'General Ledger':
                return 'General Ledger'  + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'Balance Sheet':
                return 'Balance Sheet' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'Trial Balance':
                 return 'Trial Balance' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'Security Deduction Report':
                 return 'Security Deduction Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'CPF Loan Report':
                 return 'CPF Loan Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'CPF Deduction Report':
                 return 'CPF Deduction Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            default:
                return 'Finance Report';
        }
    };

    


    const options = [
        { value: 'General Ledger', label: 'General Ledger' },
        { value: 'Trial Balance', label: 'Trial Balance' },
        { value: 'Balance Sheet', label: 'Balance Sheet' },
        { value: 'Profit And Loss Report', label: 'Profit And Loss Report' },
       
    ];

    const handleReportTypeChange = (selectedOption) => {
        setEditFormData({ ...editFormData, report_type_get: selectedOption ? selectedOption.value : '' });
    };

    const selectedOption = options.find(option => option.value === editFormData.report_type_get);

    const [hoveredVoucher, setHoveredVoucher] = useState(null); // Track the hovered voucher
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 }); // Track position of hover

    const handleMouseEnter = (event, voucher) => {
        const rect = event.target.getBoundingClientRect(); // Get the position of the hovered element
        setHoverPosition({ x: rect.left, y: rect.top });
        setHoveredVoucher(voucher); // Set the hovered voucher to display months
    };

    const handleMouseLeave = () => {
        setHoveredVoucher(null); // Reset the hover state when mouse leaves
    };





      const groupedData = filteredVouchers.reduce((acc, salary) => {
        const key = `${salary.main_head_name}-${salary.voucher_date}`; // Group by main_head_name and date
        if (!acc[key]) {
          acc[key] = {
            main_head_name: salary.main_head_name,
            voucher_date: salary.voucher_date,
            totalDebit: 0,
            totalCredit: 0,
            totalBalance: 0,
            rows: [],
          };
        }
      
        // Add the current salary data to the group
        acc[key].rows.push(salary);
      
        // Calculate totals
        acc[key].totalDebit += salary.debit;
        acc[key].totalCredit += salary.credit;
        acc[key].totalBalance += salary.debit - salary.credit;
      
        return acc;
      }, {});
      
      let grandTotalDebit = 0;
      let grandTotalCredit = 0;
      let grandTotalBalance = 0;
      


      const renderTable = () => {
        const result = [];
      
        Object.values(groupedData).forEach((group, index) => {
          // Render group rows
          group.rows.forEach((salary, rowIndex) => {
            result.push(
              <tr key={`${index}-${rowIndex}`}>
                {/* {rowIndex === 0 && (
                  <>
                    <td rowSpan={group.rows.length}>{index + 1}</td>
                    <td rowSpan={group.rows.length}>{formatDate(group.voucher_date)}</td>
                    <td rowSpan={group.rows.length}>{group.main_head_name}</td>
                  </>
                )} */}
                <td>{index + 1}</td>
                <td>{formatDate(group.voucher_date)}</td>
                <td>{group.main_head_name}</td>
                <td>{salary.code}</td>
                <td>{salary.name}</td>
                <td>{salary.voucher_invoice_no}</td>
                <td>{salary.description}</td>
                <td></td>
                <td onClick={() => trialList(salary.code, editFormData.from_month, editFormData.to_month)} className='custom-link-for-all'>{salary.debit}</td>
                <td onClick={() => trialList(salary.code, editFormData.from_month, editFormData.to_month)} className='custom-link-for-all'>{salary.credit}</td>
                <td>{salary.debit - salary.credit}</td>
              </tr>
            );
          });
      
          // Add to grand totals
          grandTotalDebit += group.totalDebit;
          grandTotalCredit += group.totalCredit;
          grandTotalBalance += group.totalBalance;
      
          // Render subtotal row for the group
          result.push(
            <tr key={`${index}-subtotal`}>
              <td colSpan={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>Subtotal for {group.main_head_name}</td>
              <td>{group.totalDebit}</td>
              <td>{group.totalCredit}</td>
              <td>{group.totalBalance}</td>
            </tr>
          );
        });
      
        // Render grand total row
        result.push(
          <tr key="grand-total">
            <td colSpan={8} style={{ textAlign: 'right', fontWeight: 'bold' }}></td>
            <td>{grandTotalDebit}</td>
            <td>{grandTotalCredit}</td>
            <td>{grandTotalBalance}</td>
          </tr>
        );
      
        return result;
      };



      function trialList(code, from, to) {
       axios.get(process.env.REACT_APP_API_BASE_URL+`/get-trial-list/${code}/${from}/${to}/${editFormData.campus_id}/${editFormData.session_id}`)
                .then(response => {
                   console.log(response);
                })
                .catch(error => {
                    console.error('Error unposting fee voucher:', error);
                });
      }


    //   const trialBalanceData = filteredVouchers.reduce((acc, entry) => {
    //     if (!acc[entry.name]) {
    //       acc[entry.name] = {
    //         code: entry.code, 
    //         name: entry.name, 
    //         totalDebit: 0, 
    //         totalCredit: 0 
    //       };
    //     }
      
    //     // Summing debits and credits
    //     acc[entry.name].totalDebit += entry.debit;
    //     acc[entry.name].totalCredit += entry.credit;
      
    //     return acc;
    //   }, {});
      
    //   // Convert object to array
    //   const trialBalanceArray = Object.values(trialBalanceData);
      
    //   // Calculate grand totals
    //   const totalDebits = trialBalanceArray.reduce((sum, acc) => sum + acc.totalDebit, 0);
    //   const totalCredits = trialBalanceArray.reduce((sum, acc) => sum + acc.totalCredit, 0);
      
    //   // Render Trial Balance
    //   const renderTrialBalance = () => (
    //     <table border="1" className="p-0 table table-hover" style={{ borderTop: '0px' }}>
    //       <thead>
    //         <tr>
    //           <th>Code</th>
    //           <th>Account Name</th>
    //           <th>Debit (PKR)</th>
    //           <th>Credit (PKR)</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {trialBalanceArray.map((account, index) => (
    //           <tr key={index}>
    //             <td>{account.code}</td>
    //             <td>{account.name}</td>
    //             <td>{account.totalDebit}</td>
    //             <td>{account.totalCredit}</td>
    //           </tr>
    //         ))}
    //         <tr>
    //           <td style={{ fontWeight: "bold", textAlign: "right" }}>Total:</td>
    //           <td style={{ fontWeight: "bold" }}>{totalDebits}</td>
    //           <td style={{ fontWeight: "bold" }}>{totalCredits}</td>
    //         </tr>
    //       </tbody>
    //     </table>
    //   );
      


    const trialBalanceData = filteredVouchers.reduce((acc, entry) => {
        if (!acc[entry.main_head_name]) {
          acc[entry.main_head_name] = {
            main_head_name: entry.main_head_name,
            accounts: {},
          };
        }
      
        if (!acc[entry.main_head_name].accounts[entry.name]) {
          acc[entry.main_head_name].accounts[entry.name] = {
            code: entry.code,
            name: entry.name,
            totalDebit: 0,
            totalCredit: 0,
          };
        }
      
        // Summing debits and credits
        acc[entry.main_head_name].accounts[entry.name].totalDebit += entry.debit;
        acc[entry.main_head_name].accounts[entry.name].totalCredit += entry.credit;
      
        return acc;
      }, {});
      
      // Convert object to array
      const groupedTrialBalance = Object.values(trialBalanceData);
      
      // Calculate grand totals
      let totalDebits = 0;
      let totalCredits = 0;
      
      // Render Trial Balance
      const renderTrialBalance = () => (
        <table border="1" className="p-0 table table-hover" style={{ borderTop: '0px' }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Account Name</th>
              <th>Debit (PKR)</th>
              <th>Credit (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {groupedTrialBalance.map((group, groupIndex) => {
              const accountsArray = Object.values(group.accounts);
              const groupTotalDebit = accountsArray.reduce((sum, acc) => sum + acc.totalDebit, 0);
              const groupTotalCredit = accountsArray.reduce((sum, acc) => sum + acc.totalCredit, 0);
      
              totalDebits += groupTotalDebit;
              totalCredits += groupTotalCredit;
      
              return (
                <>
                  {/* Row for Main Head Name */}
                  <tr key={`group-${groupIndex}`} style={{ fontWeight: "bold", background: "#f8f9fa" }}>
                    <td colSpan="4">{group.main_head_name}</td>
                  </tr>
      
                  {/* Rows for individual accounts under this main head */}
                  {accountsArray.map((account, index) => (
                    <tr key={`account-${groupIndex}-${index}`}>
                      <td>{account.code}</td>
                      <td>{account.name}</td>
                      <td>{account.totalDebit}</td>
                      <td>{account.totalCredit}</td>
                    </tr>
                  ))}
      
                  {/* Subtotal Row for this group */}
                  <tr key={`subtotal-${groupIndex}`} style={{ fontWeight: "bold" }}>
                    <td colSpan="2" style={{ textAlign: "right" }}></td>
                    <td>{groupTotalDebit}</td>
                    <td>{groupTotalCredit}</td>
                  </tr>
                </>
              );
            })}
      
            {/* Grand Total Row */}
            <tr style={{ fontWeight: "bold", background: "#e9ecef" }}>
              <td colSpan="2" style={{ textAlign: "right" }}></td>
              <td>{totalDebits}</td>
              <td>{totalCredits}</td>
            </tr>
          </tbody>
        </table>
      );
      



      // const balanceSheetData = filteredVouchers.reduce((acc, entry) => {
      //   // Define the balance sheet categories
      //   const categoryMap = {
      //     "Assets": "Assets",
      //     "Liabilities": "Liabilities",
      //     "Income": "Equity",  // Income contributes to Equity in Balance Sheet
      //     "Expense": "Liabilities", // Expenses reduce profits, categorized under Liabilities
      //   };
      
      //   const category = categoryMap[entry.main_head_name] || "Others";
      
      //   if (!acc[category]) {
      //     acc[category] = {};
      //   }
      
      //   if (!acc[category][entry.main_head_name]) {
      //     acc[category][entry.main_head_name] = [];
      //   }
      
      //   acc[category][entry.main_head_name].push({
      //     code: entry.code,
      //     name: entry.name,
      //     balance: entry.debit - entry.credit,
      //   });
      
      //   return acc;
      // }, {});
      
      // // Function to calculate totals per category
      // const calculateCategoryTotal = (category) =>
      //   Object.values(balanceSheetData[category] || {}).flat().reduce(
      //     (total, item) => total + item.balance,
      //     0
      //   );
      
      // // Calculate totals for assets, liabilities, and equity
      // const totalAssets = calculateCategoryTotal("Assets");
      // const totalLiabilities = calculateCategoryTotal("Liabilities");
      // const totalEquity = calculateCategoryTotal("Equity");
      
      // // Ensure the balance sheet equation holds
      // const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
      
      // // Render Balance Sheet
      // const renderBalanceSheet = () => (
      //   <table border="1" className="p-0 table table-hover" style={{ borderTop: '0px' }}>
      //     <thead>
      //       <tr>
      //         <th>Code</th>
      //         <th>Account Name</th>
      //         <th>Balance (PKR)</th>
      //       </tr>
      //     </thead>
      //     <tbody>

      //       {["Assets", "Liabilities", "Equity"].map((category) => (
      //         balanceSheetData[category] && (
      //           <>
      //             {/* Row for Main Category (Assets, Liabilities, Equity) */}
      //             <tr key={category} style={{ fontWeight: "bold", background: "#f8f9fa" }}>
      //               <td colSpan="3">{category}</td>
      //             </tr>
      
      //             {/* Grouping by Main Head Name */}
      //             {Object.entries(balanceSheetData[category]).map(([mainHead, accounts], index) => (
      //               <>
      //                 {/* Row for Main Head Name */}
      //                 <tr key={`mainhead-${category}-${index}`} style={{ fontWeight: "bold" }}>
      //                   <td colSpan="3">{mainHead}</td>
      //                 </tr>
      
      //                 {/* Rows for individual accounts under this main head */}
      //                 {accounts.map((account, accIndex) => (
      //                   <tr key={`account-${category}-${index}-${accIndex}`}>
      //                     <td>{account.code}</td>
      //                     <td>{account.name}</td>
      //                     <td>{account.balance}</td>
      //                   </tr>
      //                 ))}
      
      //                 {/* Subtotal Row for each Main Head */}
      //                 <tr key={`subtotal-${category}-${index}`} style={{ fontWeight: "bold" }}>
      //                   <td colSpan="2" style={{ textAlign: "right" }}>Balance:</td>
      //                   <td>{accounts.reduce((sum, acc) => sum + acc.balance, 0)}</td>
      //                 </tr>
      //               </>
      //             ))}
      
      //             {/* Total Row for each Category */}
      //             <tr key={`total-${category}`} style={{ fontWeight: "bold", background: "#e9ecef" }}>
      //               <td colSpan="2" style={{ textAlign: "right" }}>Total {category}:</td>
      //               <td>{calculateCategoryTotal(category)}</td>
      //             </tr>
      //           </>
      //         )
      //       ))}
      
      //       {/* Grand Total Row to ensure balance */}
      //       <tr style={{ fontWeight: "bold", background: "#d4edda" }}>
      //         <td colSpan="2" style={{ textAlign: "right" }}>Total Liabilities & Equity:</td>
      //         <td>{totalLiabilitiesAndEquity}</td>
      //       </tr>
      //     </tbody>
      //   </table>
      // );
      


      const balanceSheetData = filteredVouchers.reduce((acc, entry) => {
  // Define the balance sheet categories
  const categoryMap = {
    "Assets": "Assets",
    "Liabilities": "Liabilities",
    "Income": "Income",  // Track income separately
    "Expense": "Expense" // Track expenses separately
  };

  const category = categoryMap[entry.main_head_name] || "Others";

  if (!acc[category]) {
    acc[category] = {};
  }

  if (!acc[category][entry.main_head_name]) {
    acc[category][entry.main_head_name] = [];
  }

  // Calculate balance correctly based on account type
  let balance = 0;
  if (category === "Assets") {
    balance = entry.debit - entry.credit; // Assets are debit accounts
  } else if (category === "Liabilities") {
    balance = entry.credit - entry.debit; // Liabilities are credit accounts
  } else if (category === "Income") {
    balance = entry.credit - entry.debit; // Income increases equity (credit)
  } else if (category === "Expense") {
    balance = entry.debit - entry.credit; // Expenses decrease equity (debit)
  }

  acc[category][entry.main_head_name].push({
    code: entry.code,
    name: entry.name,
    balance: balance
  });

  return acc;
}, {});

// Calculate net profit (Income - Expenses)
const totalIncomeBalanceSheet = Object.values(balanceSheetData["Income"] || {}).flat()
  .reduce((total, item) => total + item.balance, 0);

const totalExpensesBalanceSheet = Object.values(balanceSheetData["Expense"] || {}).flat()
  .reduce((total, item) => total + item.balance, 0);

const netProfitBalanceSheet = totalIncomeBalanceSheet - totalExpensesBalanceSheet;

// Now create the final balance sheet structure
const finalBalanceSheet = {
  Assets: balanceSheetData["Assets"] || {},
  Liabilities: balanceSheetData["Liabilities"] || {},
  Equity: {
    "Retained Earnings": [{
      code: "5101",
      name: "Net Profit",
      balance: netProfitBalanceSheet
    }]
  }
};

// Calculate totals
const totalAssets = Object.values(finalBalanceSheet.Assets).flat()
  .reduce((total, item) => total + item.balance, 0);

const totalLiabilities = Object.values(finalBalanceSheet.Liabilities).flat()
  .reduce((total, item) => total + item.balance, 0);

const totalEquity = netProfitBalanceSheet;

// Render Balance Sheet
const renderBalanceSheet = () => (
  <table border="1" className="p-0 table table-hover" style={{ borderTop: '0px' }}>
    <thead>
      <tr>
        <th>Code</th>
        <th>Account Name</th>
        <th>Balance (PKR)</th>
      </tr>
    </thead>
    <tbody>
      {["Assets", "Liabilities", "Equity"].map((category) => (
        finalBalanceSheet[category] && (
          <>
            <tr key={category} style={{ fontWeight: "bold", background: "#f8f9fa" }}>
              <td colSpan="3">{category}</td>
            </tr>

            {Object.entries(finalBalanceSheet[category]).map(([mainHead, accounts], index) => (
              <>
                <tr key={`mainhead-${category}-${index}`} style={{ fontWeight: "bold" }}>
                  <td colSpan="3">{mainHead}</td>
                </tr>

                {accounts.map((account, accIndex) => (
                  <tr key={`account-${category}-${index}-${accIndex}`}>
                    <td>{account.code}</td>
                    <td>{account.name}</td>
                    <td>{account.balance}</td>
                  </tr>
                ))}

                <tr key={`subtotal-${category}-${index}`} style={{ fontWeight: "bold" }}>
                  <td colSpan="2" style={{ textAlign: "right" }}>Balance:</td>
                  <td>{accounts.reduce((sum, acc) => sum + acc.balance, 0)}</td>
                </tr>
              </>
            ))}

            <tr key={`total-${category}`} style={{ fontWeight: "bold", background: "#e9ecef" }}>
              <td colSpan="2" style={{ textAlign: "right" }}>Total {category}:</td>
              <td>{
                category === "Assets" ? totalAssets :
                category === "Liabilities" ? totalLiabilities :
                totalEquity
              }</td>
            </tr>
          </>
        )
      ))}

      {/* <tr style={{ fontWeight: "bold", background: "#d4edda" }}>
        <td colSpan="2" style={{ textAlign: "right" }}>Total Liabilities & Equity:</td>
        <td>{totalLiabilities + totalEquity}</td>
      </tr> */}
    </tbody>
  </table>
);
  


      const profitLossData = filteredVouchers.reduce((acc, entry) => {
        // Define categories
        const categoryMap = {
          "Income": "Income",
          "Expense": "Expenses",
        };
      
        const category = categoryMap[entry.main_head_name];
        if (!category) return acc; // Skip non-relevant categories
      
        if (!acc[category]) {
          acc[category] = {};
        }
      
        if (!acc[category][entry.main_head_name]) {
          acc[category][entry.main_head_name] = [];
        }
      
        acc[category][entry.main_head_name].push({
          code: entry.code,
          name: entry.name,
          amount: Math.abs(entry.debit - entry.credit)
        });
      
        return acc;
      }, {});
      

      // Function to calculate totals
      const calculateCategoryPLTotal = (category) =>
        Object.values(profitLossData[category] || {}).flat().reduce(
          (total, item) => total + item.amount,
          0
        );
      
      // Calculate total income and expenses
      const totalIncome = calculateCategoryPLTotal("Income");
      const totalExpenses = calculateCategoryPLTotal("Expenses");
      
      // Calculate net profit/loss
      const netProfit = Math.abs(totalIncome) - Math.abs(totalExpenses);

      // console.log("this is net")
      
      // Render Profit & Loss Report
      const renderProfitLoss = () => (
        <table border="1" className="p-0 table table-hover" style={{ borderTop: '0px' }}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Account Name</th>
              <th>Amount(PKR)</th>
            </tr>
          </thead>
          <tbody>
            {["Income", "Expenses"].map((category) => (
              profitLossData[category] && (
                <>
                  {/* Category Header */}
                  <tr key={category} style={{ fontWeight: "bold", background: "#f8f9fa" }}>
                    <td colSpan="3">{category}</td>
                  </tr>
      
                  {/* Grouping by Main Head Name */}
                  {Object.entries(profitLossData[category]).map(([mainHead, accounts], index) => (
                    <>
                      {/* Row for Main Head Name */}
                      <tr key={`mainhead-${category}-${index}`} style={{ fontWeight: "bold" }}>
                        <td colSpan="3">{mainHead}</td>
                      </tr>

                      {/* Rows for individual accounts under this main head */}
                      {accounts.map((account, accIndex) => (
                        // console.log("this is account", account.amount),
                        <tr key={`account-${category}-${index}-${accIndex}`}>
                          <td>{account.code}</td>
                          <td>{account.name}</td>
                          <td>{account.amount}</td>
                        </tr>
                      ))}
      
                      {/* Subtotal Row for each Main Head */}
                      {/* <tr key={`subtotal-${category}-${index}`} style={{ fontWeight: "bold" }}>
                        <td colSpan="2" style={{ textAlign: "right" }}>Subtotal:</td>
                        <td>{accounts.reduce((sum, acc) => sum + acc.amount, 0)}</td>
                      </tr> */}
                    </>
                  ))}
      
                  {/* Total Row for each Category */}
                  <tr key={`total-${category}`} style={{ fontWeight: "bold", background: "#e9ecef" }}>
                    <td colSpan="2" style={{ textAlign: "right" }}>Total {category}:</td>
                    <td>{calculateCategoryPLTotal(category)}</td>
                  </tr>
                </>
              )
            ))}

            {/* Net Profit or Loss Row */}
            <tr style={{ fontWeight: "bold", background: netProfit >= 0 ? "#d4edda" : "#f8d7da" }}>
              <td colSpan="2" style={{ textAlign: "right" }}>{netProfit >= 0 ? "Net Profit" : "Net Loss"}:</td>
              <td>{netProfit}</td>
            </tr>
          </tbody>
        </table>
      );
      


      function formatDate(inputDate) {
        const date = new Date(inputDate);
        
        // Subtract the specified number of days
        date.setDate(date.getDate());
      
        // Format the date to the desired format (e.g., February 24, 2025)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
     
      
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-12 p-2">
                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> {getReportTitle()}
                            </div>
                        </div>
                    </div>
                    <div className="border p-2">
                        <div className="d-flex justify-content-center">

                            <div className="col-2 pl-1 pr-1 ">
                                <Select
                                    name="report_type_get"
                                    value={selectedOption}
                                    onChange={handleReportTypeChange}
                                    options={options}
                                    isClearable
                                />
                            </div>
                            { editFormData.report_type_get !== "Class Wise Voucher Summary Report" && editFormData.report_type_get !== "Scroll Wise Report" &&  editFormData.report_type_get !== "Total Fee Allocate" && editFormData.report_type_get !== "Bank Wise Summary Report" && editFormData.report_type_get !== "Datewise Posting Report" && (
                                <>
                                
                                    <div className="col-2 pl-1 pr-1">
                                        <input type="month" className="form-control" id="from_month" value={editFormData.from_month} onChange={(e) => setEditFormData({ ...editFormData, from_month: e.target.value })} />
                                    </div>
                                    <div className="col-2 pl-1 pr-1">
                                        <input
                                            type="month"
                                            className="form-control"
                                            id="to_month"
                                            value={editFormData.to_month}
                                            onChange={(e) => setEditFormData({ ...editFormData, to_month: e.target.value })}
                                        />
                                    </div>
                                  
                                </>
                            )}



                           
                            <div className="mr-2 d-none">
                                <input type="text" placeholder='Search.........' className="form-control" value={editFormData.search} onChange={(e) => setEditFormData({ ...editFormData, search: e.target.value })} />
                            </div>

                            <button className="btn btn-sm btn-danger ml-2" onClick={handleSearch}>Search</button>
                            <button className="btn btn-sm btn-secondary ml-2" onClick={resetStates}>Reset</button>
                        </div>
                    </div>
                    <div className="col-12">
                        {showData && (
                            <div style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                position: 'fixed',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: '100',
                                backdropFilter: 'blur(10px)',
                                width: '90%',
                                maxWidth: '1800px',
                                maxHeight: '90vh',
                                overflow: 'hidden',  // Prevent the whole modal from scrolling
                                backgroundColor: 'white',
                                // borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <h5 style={{
                                    backgroundColor: "#EBD197 ",
                                    color: "black",
                                    textAlign: "left",
                                    padding: "8px",
                                    width: "100%",
                                    marginBottom: "0"
                                }}>{getReportTitle()}</h5>
                                <button
                                    onClick={() => setShowData(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        color: "black"
                                    }}
                                >
                                    &times;
                                </button>
                                <div className='p-2 d-flex justify-content-end w-100'>
                                    {/* <button className="btn btn-sm btn-warning" onClick={generateExcel}>Download Excel</button> */}
                                </div>
                                <div style={{ width: '100%', overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>  {/* Make the content area scrollable */}
                                <div className='d-flex justify-content-end'>
                                <button onClick={exportReportToExcel} className="btn btn-success m-2">
                                    Export to Excel
                                </button>
                                </div>

                                {editFormData.report_type_get === "General Ledger" ? (
                                      <div className=''>
                                      <div className='d-flex justify-content-end'>

                                        <input
                                            type="text"
                                            className='form-control col-md-3 mb-1'
                                            value={editFormData.search_frontend}
                                            onChange={(e) => setEditFormData({ ...editFormData, search_frontend: e.target.value })}
                                            placeholder='Search............'
                                        />

                                    </div>
                                    <table border="1" className="p-0 table table-hover" style={{ borderTop: '0px' }}>
                                        <thead style={{ borderBottom: '0px' }}>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Date</th>
                                            <th>Account Of</th>
                                            <th>Category Code</th>
                                            <th>Category Name</th>
                                            <th>Voucher ID</th>
                                            <th>Description</th>
                                            <th>Folio#</th>
                                            <th>Debit</th>
                                            <th>Credit</th>
                                            <th>Balance</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {renderTable()}
                                        </tbody>
                                    </table>
                                    </div>
                                    ) : editFormData.report_type_get === "Trial Balance" ? (
                                        <>
                                        {renderTrialBalance()}
                                        </>
                                    ) : editFormData.report_type_get === "Balance Sheet" ? (
                                        <>
                                        {renderBalanceSheet()}
                                        </>
                                    ) : editFormData.report_type_get === "Profit And Loss Report" ? (
                                        <>
                                        {renderProfitLoss()}
                                        </>
                                    ) : null
                                }

                              {editFormData.report_type_get === "Trial Balance" ? (
                                        <>
                                       
                                        </>
                                    ) : null
                                }


                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div >
    );
};

export default FinanceReport;
