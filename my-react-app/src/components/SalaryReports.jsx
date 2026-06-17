
import React, { useState, useEffect, useContext, useMemo  } from 'react';
import axios from 'axios';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { saveAs } from 'file-saver';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';





const SalaryReports = () => {




    const [vouchers, setVouchers] = useState([]);

    const [scrollVouchers, setScrollVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState(scrollVouchers);

    const [datewisePosting, setDatewisePosting] = useState([]);
    const [datewisePostingfilteredVouchers, setDatesisePostingFilteredVouchers] = useState(datewisePosting);

    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getCategories, setCategories] = useState([]);
    const [getClasses, setClasses] = useState([]);
    const [showData, setShowData] = useState(false);
    const [monthlyReports, setMonthlyReports] = useState({});
    const [receivableAndPayableData, setReceivableAndPayableData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalRecievedAmount, setTotalRecievedAmount] = useState(0);

    const [getGrandTotalPayable, setGrandTotalPayable] = useState(0);
    const [lastMonth, setLastMonth] = useState('');

    const [previousMonthArrearFine, setPreviousMonthArrearFine] = useState(0);


    const [getStruckOffUnpaidTotal, setStruckOffUnpaidTotal] = useState(0);


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

        }

    }, [editFormData.search_frontend, scrollVouchers]);



    useEffect(() => {
        const fetchCategories = (campus_id) => {
            axios.get(process.env.REACT_APP_API_BASE_URL+`/get-categories/${campus_id}`)
                .then(res => {
                    setCategories(res.data.results);
                })
                .catch(err => console.log(err));
        };

        if (user && user.user.campus_id) {
            fetchCategories(user.user.campus_id);
        }
    }, [user]);

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




    const fetchData = () => {

        if (!editFormData.report_type_get) {
            return; // Stop function execution
        }
        
        setLoading(true);

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

        }

        axios.get(url, { params })
            .then(res => {
                if (report_type_get === 'Headwise Report') {
                    const vouchers = res.data.feeVouchers;
                    const feeHeadDetails = res.data.feeHeadDetails;

                    const grandTotalFineLastMonth = res.data.grandTotalFineLastMonth;

                    setPreviousMonthArrearFine(grandTotalFineLastMonth);
                    setStruckOffUnpaidTotal(res.data.unpaidTotal);

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

                    setMonthlyReports(monthlyReports);
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
                    setLastMonth(res.data.last_month);
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
                }

                if (report_type_get !== 'Pendency Report') {
                setTotalPages(res.data.totalPages);
                }
                setLoading(false);
                setShowData(true);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
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

   

    const grandTotal = calculateGrandTotalPending(vouchers);


    const getReportTitle = () => {
        switch (editFormData.report_type_get) {
            case 'Income Tax Report':
                return 'Income Tax Report'  + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'Over Time Report':
                return 'Over Time Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case '2nd Shift Honorarium Report':
                 return '2nd Shift Honorarium Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'Security Deduction Report':
                 return 'Security Deduction Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'CPF Loan Report':
                 return 'CPF Loan Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            case 'CPF Deduction Report':
                 return 'CPF Deduction Report' + (editFormData.from_month ? ` (${editFormData.from_month}${editFormData.to_month ? ' - ' + editFormData.to_month : ''})` : '');
            default:
                return 'Salary Reports';
        }
    };

    


    const options = [
        { value: 'Income Tax Report', label: 'Income Tax Report' },
        { value: 'Over Time Report', label: 'Over Time Report' },
        { value: '2nd Shift Honorarium Report', label: '2nd Shift Honorarium Report' },
        { value: 'Security Deduction Report', label: 'Security Deduction Report' },
        { value: 'CPF Loan Report', label: 'CPF Loan Report' },
        { value: 'CPF Deduction Report', label: 'CPF Deduction Report' },

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




    //this is for total fee allocate
    const groupedData = useMemo(() => {
        const data = {
            groupedVouchers: {},
            grandTotal: 0,
        };

        filteredVouchers.forEach(voucher => {
            // Group by class
            if (!data.groupedVouchers[voucher.class]) {
                data.groupedVouchers[voucher.class] = { vouchers: [], subtotal: 0 };
            }
            
            // Add voucher to respective class group
            data.groupedVouchers[voucher.class].vouchers.push(voucher);
            
            // Update subtotal for the class
            data.groupedVouchers[voucher.class].subtotal += voucher.total_amount;
            
            // Update grand total
            data.grandTotal += voucher.total_amount;
        });

        return data;
    }, [filteredVouchers]);




    const exportReportToExcel = () => {

        if(editFormData.report_type_get == "Headwise Report")
        {
            const workbook = XLSX.utils.book_new();
      
            Object.entries(monthlyReports).forEach(([month, { vouchers, feeHeadDetails }]) => {
              const feeHeadNames = [...new Set(feeHeadDetails.map(head => head.head_name))];
          
              // Define headers matching the table structure
              const headers = [
                "Category", 
                "Class", 
                ...feeHeadNames, 
                "Bus Fee", 
                "Advance Payment", 
                "Arrears", 
                "T.Payable.Amount", 
                "Fine", 
                "T.Received.Amount"
              ];
          
              const rows = [];
              const groupedData = groupVouchersByCategoryAndClass(vouchers);
          
              Object.entries(groupedData).forEach(([category, classes]) => {
                let categorySubtotalRow = new Array(headers.length).fill(0); // Initialize subtotal row for the category
                let isFirstRowForCategory = true; // Flag to indicate the first row for the category
          
                Object.entries(classes).forEach(([className, classVouchers]) => {
                  const row = [isFirstRowForCategory ? category : "", className];
                  isFirstRowForCategory = false; // Only set the category name for the first row
          
                  const classSubtotals = feeHeadNames.reduce((acc, head) => {
                    acc[head] = calculateSubtotalForHead(classVouchers, head);
                    return acc;
                  }, {});
          
                  // Populate each fee head amount
                  feeHeadNames.forEach(head => {
                    row.push(classSubtotals[head] || 0);
                    categorySubtotalRow[2 + feeHeadNames.indexOf(head)] += classSubtotals[head] || 0;
                  });
          
                  // Additional columns
                  const totalBusFee = calculateSubtotal(classVouchers, 'bus_fee');
                  const totalAdvancePayment = calculateSubtotal(classVouchers, 'advance_payment');
                  const arrears = calculateSubtotal(classVouchers, 'arrears');
                  const totalFine = calculateSubtotal(classVouchers, 'calculated_fine');
                  const totalReceivedAmount = calculateSubtotal(classVouchers, 'recieved_payment');
                  const totalPayableAmount = calculateSubtotal(classVouchers, 'payable_amount') + totalAdvancePayment;
          
                  row.push(totalBusFee, totalAdvancePayment, arrears, totalPayableAmount, totalFine, totalReceivedAmount);
          
                  // Update category subtotal row
                  categorySubtotalRow[2 + feeHeadNames.length] += totalBusFee;
                  categorySubtotalRow[3 + feeHeadNames.length] += totalAdvancePayment;
                  categorySubtotalRow[4 + feeHeadNames.length] += arrears;
                  categorySubtotalRow[5 + feeHeadNames.length] += totalPayableAmount;
                  categorySubtotalRow[6 + feeHeadNames.length] += totalFine;
                  categorySubtotalRow[7 + feeHeadNames.length] += totalReceivedAmount;
          
                  rows.push(row);
                });
          
                // Add subtotal row for each category
                rows.push(["Subtotal", "", ...categorySubtotalRow.slice(2)]);
              });
          
              // Calculate Grand Total row
              const grandTotalRow = ["Grand Total", ""];
              feeHeadNames.forEach(head => {
                grandTotalRow.push(calculateGrandTotalForHead(vouchers, head));
              });
              grandTotalRow.push(
                calculateGrandTotal(vouchers, 'bus_fee'),
                calculateGrandTotal(vouchers, 'advance_payment'),
                calculateGrandTotal(vouchers, 'arrears'),
                calculateGrandTotal(vouchers, 'payable_amount') + calculateGrandTotal(vouchers, 'advance_payment'),
                calculateGrandTotal(vouchers, 'calculated_fine'),
                calculateGrandTotal(vouchers, 'recieved_payment')
              );
          
              rows.push(grandTotalRow);
          
              // Convert the rows array to a worksheet
              const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
          
              // Add the worksheet to the workbook
              XLSX.utils.book_append_sheet(workbook, worksheet, month);
            });
          
            // Generate and download the Excel file
            XLSX.writeFile(workbook, "Headwise_Report.xlsx");

        }else if(editFormData.report_type_get == "Pendency Report"){

         axios.get(process.env.REACT_APP_API_BASE_URL+"/pendency-excel-report", {
            params: {
                from_month: editFormData.from_month,
                to_month: editFormData.to_month == '' ? editFormData.from_date :  editFormData.to_month,
                class_id: editFormData.class_id,
                section_id: editFormData.section_id,
                session_id: academicSession,
                campus_id: user.user.campus_id
            },
            responseType: 'blob'  // Important to handle the Excel binary data correctly
        })
            .then(res => {
                // Check if the response is a JSON object with the message 'Data not exist'
                const contentType = res.headers['content-type'];
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const responseText = reader.result;
                        const responseJson = JSON.parse(responseText);
                        if (responseJson.message === 'Data not exist') {
                            // Show toaster notification
                            toast.success('Data Not Exist!');
                            return;
                        }
                    };
                    reader.readAsText(res.data);
                } else {
                    // Create a URL for the blob object
                    const url = window.URL.createObjectURL(new Blob([res.data]));

                    // Create a link to download the file
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `pendency report.xlsx`); // Set the file name with .xlsx extension

                    // Append the link to the body, click it, and then remove it
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Free up the created URL
                    window.URL.revokeObjectURL(url);
                }
            })
            .catch(err => console.error(err));
    

        }else if(editFormData.report_type_get == "Recievable & Payable"){


            axios.get(process.env.REACT_APP_API_BASE_URL+"/recievable-and-payable-excel-report", {
                params: {
                    class_id: editFormData.class_id,
                    section_id: editFormData.section_id,
                    session_id: academicSession,
                    campus_id: user.user.campus_id
                },
                responseType: 'blob'  // Important to handle the Excel binary data correctly
            })
                .then(res => {
                    // Check if the response is a JSON object with the message 'Data not exist'
                    const contentType = res.headers['content-type'];
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const responseText = reader.result;
                            const responseJson = JSON.parse(responseText);
                            if (responseJson.message === 'Data not exist') {
                                // Show toaster notification
                                toast.success('Data Not Exist!');
                                return;
                            }
                        };
                        reader.readAsText(res.data);
                    } else {
                        // Create a URL for the blob object
                        const url = window.URL.createObjectURL(new Blob([res.data]));
    
                        // Create a link to download the file
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `recievable and payable report.xlsx`); // Set the file name with .xlsx extension
    
                        // Append the link to the body, click it, and then remove it
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
    
                        // Free up the created URL
                        window.URL.revokeObjectURL(url);
                    }
                })
                .catch(err => console.error(err));


        }
      };
      
      

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

                            <div className="col-2 pl-1 pr-1">
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
                                  
                                  
                                    {/* <div className="col-2 pl-1 pr-1">
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
                                            isClearable
                                        />
                                    </div> */}

{/* 
                                    <div className="col-2 pl-1 pr-1">
                                        <Select
                                            options={getCategories.map(category => ({ value: category.id, label: category.category }))}
                                            value={
                                                editFormData.category_id
                                                    ? { value: editFormData.category_id, label: getCategories.find(category => category.id === editFormData.category_id)?.category || "" }
                                                    : null
                                            }
                                            onChange={(selectedOption) => setEditFormData({ ...editFormData, category_id: selectedOption ? selectedOption.value : "" })}
                                            placeholder="Select Category"
                                            isClearable
                                        />
                                    </div> */}
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
                                    backgroundColor: "#007bff",
                                    color: "#ffc107",
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
                                        color: "#ffc107"
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

                                    {editFormData.report_type_get === "Headwise Report" ? (
                                        <div className=''>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : (
                                                Object.entries(monthlyReports).map(([month, { vouchers, feeHeadDetails }]) => {
                                                    const groupedData = groupVouchersByCategoryAndClass(vouchers);
                                                    const feeHeadNames = [...new Set(feeHeadDetails.map(head => head.head_name))];
                                                    return (
                                                        <div key={month} className="mb-4">
                                                            <h5 className="text-center" style={{ "backgroundColor": "rgb(206, 206, 206)", "padding": "5px" }}>{month}</h5>
                                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                                <thead style={{ borderBottom: "0px" }}>
                                                                    <tr>
                                                                        <th>Category</th>
                                                                        <th>Class</th>
                                                                        {feeHeadNames.map((head, index) => (
                                                                            <th key={index}>{head}</th>
                                                                        ))}
                                                                        <th>Bus Fee</th>
                                                                        <th>Advance Payment</th>
                                                                        <th>Arrears</th>
                                                                        <th>T.Payable.Amount</th>
                                                                        <th>Fine</th>  {/* New column for Fine */}
                                                                        <th>T.Received.Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.entries(groupedData).map(([category, classes], categoryIndex) => (
                                                                        <React.Fragment key={categoryIndex}>
                                                                            <tr>
                                                                                <td rowSpan={Object.keys(classes).length + 1}>{category}</td>
                                                                            </tr>
                                                                            {Object.entries(classes)
                                                                                .sort(([classNameA], [classNameB]) => classNameA.localeCompare(classNameB))
                                                                                .map(([className, vouchers], classIndex) => {
                                                                                    const totalPayableAmount = calculateSubtotal(vouchers, 'payable_amount') + calculateSubtotal(vouchers, 'advance_payment');
                                                                                    const totalReceivedAmount = calculateSubtotal(vouchers, 'recieved_payment');
                                                                                    const totalBusFee = calculateSubtotal(vouchers, 'bus_fee');
                                                                                    const totalAdvancePayment = calculateSubtotal(vouchers, 'advance_payment');
                                                                                    const arrears = calculateSubtotal(vouchers, 'arrears');
                                                                                    const totalFine = calculateSubtotal(vouchers, 'calculated_fine');  // Calculate total fine for this class
                                                                                    const total_unpaid_fine = calculateSubtotal(vouchers, 'total_unpaid_fine');
                                                                                    const classSubtotals = feeHeadNames.reduce((acc, head) => {
                                                                                        acc[head] = calculateSubtotalForHead(vouchers, head);
                                                                                        return acc;
                                                                                    }, {});
                                                                                    return (
                                                                                        <React.Fragment key={`${categoryIndex}-${className}`}>
                                                                                            <tr>
                                                                                                <td>{className}</td>
                                                                                                {feeHeadNames.map((head, headIndex) => (
                                                                                                    <td key={`${categoryIndex}-${className}-${headIndex}`}>{classSubtotals[head]}</td>
                                                                                                ))}
                                                                                                <td>{totalBusFee}</td>
                                                                                                <td>{totalAdvancePayment}</td>
                                                                                                <td>{arrears}</td>
                                                                                                <td>{totalPayableAmount + arrears}</td>
                                                                                                <td>{totalFine}</td>  {/* Display the fine */}
                                                                                                <td>{totalReceivedAmount}</td>
                                                                                            </tr>
                                                                                        </React.Fragment>
                                                                                    );
                                                                                })}
                                                                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>
                                                                                <td colSpan="2" style={{ fontWeight: 'bold' }}>Subtotal</td>
                                                                                {feeHeadNames.map((head, headIndex) => {
                                                                                    const totalAmount = Object.values(classes).flat().reduce((sum, voucher) => {
                                                                                        const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
                                                                                        return sum + (feeHead ? feeHead.amount : 0);
                                                                                    }, 0);
                                                                                    return <td key={`subtotal-${categoryIndex}-${headIndex}`} style={{ fontWeight: 'bold' }}>{totalAmount}</td>;
                                                                                })}
                                                                                <td style={{ fontWeight: 'bold' }}>
                                                                                    {calculateSubtotal(Object.values(classes).flat(), 'bus_fee')}
                                                                                </td>
                                                                                <td style={{ fontWeight: 'bold' }}>
                                                                                    {calculateSubtotal(Object.values(classes).flat(), 'advance_payment')}
                                                                                </td>
                                                                                <td style={{ fontWeight: 'bold' }}>
                                                                                    {calculateSubtotal(Object.values(classes).flat(), 'arrears')}
                                                                                </td>
                                                                                <td style={{ fontWeight: 'bold' }}>
                                                                                    {calculateSubtotal(Object.values(classes).flat(), 'payable_amount') + calculateSubtotal(Object.values(classes).flat(), 'advance_payment')}
                                                                                </td>
                                                                                <td style={{ fontWeight: 'bold' }}>
                                                                                    {calculateSubtotal(Object.values(classes).flat(), 'calculated_fine')}  {/* Subtotal for Fine */}
                                                                                </td>
                                                                                <td style={{ fontWeight: 'bold' }}>
                                                                                    {calculateSubtotal(Object.values(classes).flat(), 'recieved_payment')}
                                                                                </td>
                                                                            </tr>
                                                                        </React.Fragment>
                                                                    ))}
                                                                    <tr>
                                                                        <td colSpan='8'></td>
                                                                    </tr>

                                                                    {/* <tr> */}

                                                                    <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)', textAlign:'right', color: 'red' }} colSpan={"9"}>
                                                                    Previous Month Arrear Fine Generated (For Dashboard Calculation)
                                                                        </td>

                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)', color: 'red' }}  colSpan={"8"}>
                                                                           {previousMonthArrearFine}
                                                                        </td>

                                                                        {/* <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)', color: 'red' }} > */}
                                                                            {/* {(calculateGrandTotal(vouchers, 'payable_amount') + calculateGrandTotal(vouchers, 'advance_payment')) - calculateGrandTotal(vouchers, 'recieved_payment')} */}
                                                                        {/* </td> */}
                                                                        
                                                                        {/* <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)', color:"red" }} colSpan={"2"}> */}
                                                                        {/* {(calculateGrandTotal(vouchers, 'payable_amount') + calculateGrandTotal(vouchers, 'advance_payment') + previousMonthArrearFine)} */}
                                                                        {/* </td> */}
                                                                       
                                                                    {/* </tr> */}

                                                                    <tr>
                                                                        <td colSpan="2" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>Grand Total</td>
                                                                        {feeHeadNames.map((head, headIndex) => (
                                                                            <td key={`grandtotal-${headIndex}`} style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)' }}>
                                                                                {calculateGrandTotalForHead(vouchers, head)}
                                                                            </td>
                                                                        ))}
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)' }}>
                                                                            {calculateGrandTotal(vouchers, 'bus_fee')}
                                                                        </td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)' }}>
                                                                            {calculateGrandTotal(vouchers, 'advance_payment')}
                                                                        </td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                            {calculateGrandTotal(vouchers, 'arrears')}
                                                                        </td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)' }}>
                                                                            {/* {(calculateGrandTotal(vouchers, 'payable_amount') + calculateGrandTotal(vouchers, 'advance_payment') + calculateGrandTotal(vouchers, 'arrears'))} */}
                                                                            {(calculateGrandTotal(vouchers, 'payable_amount') + calculateGrandTotal(vouchers, 'advance_payment'))}
                                                                        </td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)' }}>
                                                                            {calculateGrandTotal(vouchers, 'calculated_fine')}  {/* Grand Total for Fine */}
                                                                        </td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206 206 206)' }}>
                                                                            {calculateGrandTotal(vouchers, 'recieved_payment')}
                                                                        </td>
                                                                    </tr>

                                                                   


                                                                    <tr>
                                                                        <td colSpan="2" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', color: 'red' }}>Total Pending Amount</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', color: 'red' }}>{(calculateGrandTotal(vouchers, 'payable_amount') + calculateGrandTotal(vouchers, 'advance_payment') + calculateGrandTotal(vouchers, 'arrears') + calculateGrandTotal(vouchers, 'calculated_fine')) - (calculateGrandTotal(vouchers, 'recieved_payment'))}</td>
                                                                        {/* <td style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', color: 'red' }}>{getStruckOffUnpaidTotal} <label style={{"fontSize":"10px"}}>(Struck Off Pendency)</label> </td> */}
                                                                        {/* <td colSpan="5" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', color: 'red' }}> */}
                                                                            {/* {(calculateGrandTotal(vouchers, 'payable_amount') + calculateGrandTotal(vouchers, 'advance_payment') + calculateGrandTotal(vouchers, 'arrears') + calculateGrandTotal(vouchers, 'calculated_fine')) - (calculateGrandTotal(vouchers, 'recieved_payment') +  getStruckOffUnpaidTotal)}
                                                                        </td> */}
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    ) : editFormData.report_type_get === "Pendency Report" ? (
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
                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>

                                                        <th>Register#</th>
                                                        <th>Student Name</th>
                                                        <th>Class</th>
                                                        <th>Category</th>
                                                        <th>Phone#</th>
                                                        <th>No.of.Months</th>
                                                        <th>Pending Amounts</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    
                                                    {filteredVouchers.map(voucher => (
                                                        <tr key={voucher.student_id} style={{ color: voucher.unpaid_vouchers_count >= 3 ? 'red' : '' }}>
                                                            <td>{voucher.register_no}</td>
                                                            <td>{voucher.full_name}</td>
                                                            <td>{voucher.class_name + " (" + voucher.section_name + ")"}</td>
                                                            <td>{voucher.category}</td>
                                                            <td>{voucher.father_mobile_no}</td>
                                                            <td
                                                                onMouseEnter={(event) => handleMouseEnter(event, voucher)}
                                                                onMouseLeave={handleMouseLeave}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {voucher.unpaid_vouchers_count}
                                                            </td>
                                                            <td>{voucher.payable_amount_after_due_date}</td>
                                                            <td>{voucher.status}</td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>


                                            {hoveredVoucher && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: `${hoverPosition.y + 20}px`, // Adjust the position based on the hover location
                                                        left: `${hoverPosition.x}px`,
                                                        backgroundColor: '#f9f9f9',
                                                        border: '1px solid #ccc',
                                                        padding: '10px',
                                                        zIndex: 1000,
                                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {formatMonths(hoveredVoucher.months)}
                                                </div>
                                            )}


                                            <div className='pt-3 pb-3' style={{ "fontSize": "15px" }}>
                                                <b className='p-2 text-danger' style={{ "border": "1px solid black" }} ><label htmlFor="" >Grand Total: </label> {filteredVouchers.reduce((total, voucher) => total + voucher.payable_amount_after_due_date, 0)}</b>
                                            </div>

                                        </div>


                                    ) : editFormData.report_type_get === "Recievable & Payable" ? (
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
                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>

                                                        <th>Register#</th>
                                                        <th>Student Name</th>
                                                        <th>Class</th>
                                                        <th>Category</th>
                                                        <th>Phone#</th>
                                                        <th>No.of.Months</th>
                                                        <th>T.Payable.Amount</th>
                                                        <th>Recieved.Amount</th>
                                                        <th>Remaining.Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    
                                                    {filteredVouchers.map(voucher => (
                                                        <tr key={voucher.student_id}>
                                                            <td>{voucher.register_no}</td>
                                                            <td>{voucher.full_name}</td>
                                                            <td>{voucher.class_name + " (" + voucher.section_name + ")"}</td>
                                                            <td>{voucher.category}</td>
                                                            <td>{voucher.father_mobile_no}</td>
                                                            <td
                                                                onMouseEnter={(event) => handleMouseEnter(event, voucher)}
                                                                onMouseLeave={handleMouseLeave}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                {voucher.total_vouchers_count}
                                                            </td>
                                                            <td>{voucher.payable_amount}</td>
                                                            <td>{voucher.received_amount}</td>
                                                            <td>{voucher.payable_amount - voucher.received_amount}</td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>

                                            {hoveredVoucher && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: `${hoverPosition.y + 20}px`, // Adjust the position based on the hover location
                                                        left: `${hoverPosition.x}px`,
                                                        backgroundColor: '#f9f9f9',
                                                        border: '1px solid #ccc',
                                                        padding: '10px',
                                                        zIndex: 1000,
                                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {formatMonths(hoveredVoucher.months)}
                                                </div>
                                            )}
                                        </div>
                                    ) : editFormData.report_type_get === "Scroll Wise Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Payment Date</th>
                                                        <th>Scroll No</th>
                                                        <th>Total Received Payment</th>
                                                        <th>Bank Name</th>
                                                        <th>account_title</th>
                                                        <th>account_no</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((voucher, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{voucher.payment_date}</td>
                                                            <td>{voucher.scroll_no}</td>
                                                            <td>{voucher.total_recieved_payment}</td>
                                                            <td>{voucher.bank_name}</td>
                                                            <td>{voucher.account_title}</td>
                                                            <td>{voucher.account_no}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="2" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td colSpan="2">
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_recieved_payment, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "Datewise Posting Report" ? (
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

                                            <table className='table m-0'>
                                                <thead>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Invoice#</th>
                                                        <th>Rg#</th>
                                                        <th>Name</th>
                                                        <th>Class</th>
                                                        <th>Section</th>
                                                        <th>Month</th>
                                                        <th>Due.Date</th>
                                                        <th>Pay.Date</th>

                                                        <th style={{ 'backgroundColor': '#e8e8e8' }}>Reciev.Amount</th>
                                                        <th>Status</th>
                                                        {/* <th className='text-center'>View</th> */}

                                                        <th className='text-center'>Unpost</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {(
                                                        filteredVouchers.map((voucher, index) => (
                                                            <tr key={index}>
                                                                 <td>{index+1}</td>
                                                                <td>{voucher.invoice_no}</td>
                                                                <td>{voucher.register_no == "" ? voucher.old_register_no : voucher.register_no}</td>
                                                                <td>{voucher.full_name}</td>
                                                                <td>{voucher.class}</td>
                                                                <td>{voucher.section_name}</td>
                                                                <td>{voucher.for_the_month}</td>
                                                                <td>{convertDates(voucher.due_date)}</td>
                                                                <td>{convertDates(voucher.payment_date)}</td>

                                                                <td style={{ 'backgroundColor': '#e8e8e8' }}>{voucher.recieved_payment}</td>
                                                                <td style={{ color: voucher.status === 'unpaid' ? 'red' : 'green' }}>{voucher.status.toUpperCase()}</td>
                                                                {/* <td className='text-center'>
                                                                    <div><a href="#" className={`btn btn-success btn-sm ${voucher.status === 'paid' || voucher.for_the_month < lastMonth ? 'disabled' : ''}`} onClick={() => edit(voucher.id)} ><i className="fas fa-edit"></i></a></div>
                                                                </td> */}

                                                                {/* className={`btn btn-danger btn-sm ${voucher.for_the_month < lastMonth ? 'disabled' : ''}`} */}
                                                                <td className='text-center'>
                                                                    <div><a href="#" className={`btn btn-warning btn-sm`} onClick={() => {
                                                                        const arrears = typeof voucher.arrears_not_cleared === 'string' ? JSON.parse(voucher.arrears_not_cleared) : voucher.arrears_not_cleared;
                                                                        unpostData(voucher.id + (arrears?.length ? ',' + arrears.join(',') : ''), voucher.full_name)
                                                                    }}><i class="fas fa-undo"></i></a></div>
                                                                </td>
                                                            </tr>

                                                        ))
                                                    )}
                                                    <tr>
                                                        <td colSpan="9" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td colSpan="4">
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.recieved_payment, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "Bank Wise Summary Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Bank Name</th>
                                                        <th>account_title</th>
                                                        <th>account_no</th>
                                                        <th>Payment Date</th>
                                                        <th>Total Received Payment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((voucher, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{voucher.bank_name}</td>
                                                            <td>{voucher.account_title}</td>
                                                            <td>{voucher.account_no}</td>
                                                            <td>{voucher.payment_date}</td>
                                                            <td>{voucher.total_recieved_payment}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="4" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_recieved_payment, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "Total Fee Allocate" ? (
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
                            
                                        <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                            <thead style={{ borderBottom: "0px" }}>
                                                <tr>
                                                    <th>Sr.No</th>
                                                    <th>Class</th>
                                                    <th>Section</th>
                                                    <th>Month</th>
                                                    <th>Allocated.At</th>
                                                    <th>Due Date</th>
                                                    <th>Total.Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(groupedData.groupedVouchers).map(([className, { vouchers, subtotal }], classIndex) => (
                                                    <React.Fragment key={classIndex}>
                                                        {vouchers.map((voucher, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{voucher.class}</td>
                                                                <td>{voucher.section_name}</td>
                                                                <td>{voucher.for_the_month}</td>
                                                                <td>{convertDates(voucher.created_at)}</td>
                                                                <td>{convertDates(voucher.due_date)}</td>
                                                                <td>{voucher.total_amount}</td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td colSpan="6" className="text-right"><strong>Subtotal:</strong></td>
                                                            <td>
                                                                <strong>{subtotal}</strong>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                                <tr>
                                                    <td colSpan="6" className="text-right"><strong>Grand Total:</strong></td>
                                                    <td>
                                                        <strong>{groupedData.grandTotal}</strong>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    ) : editFormData.report_type_get === "Total Fee Campus Wise" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Class</th>
                                                        <th>Total Recievable</th>
                                                        <th>Total Received</th>
                                                        <th>Total Pending</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((voucher, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{voucher.class}</td>
                                                            <td>{voucher.total_recievable}</td>
                                                            <td>{voucher.total_received}</td>
                                                            <td>{voucher.total_recievable - voucher.total_received}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="2" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_recievable, 0)}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_received, 0)}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + (voucher.total_recievable - voucher.total_received), 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "Income Tax Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Name</th>
                                                        <th>Post</th>
                                                        <th>Job.Type</th>
                                                        <th>Income.Tax</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((salary, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{salary.full_name}</td>
                                                            <td>{salary.employee_post + " (" + salary.pay_scale + ")"}</td>
                                                            <td>{salary.job_type}</td>
                                                            <td>{salary.total_income_tax}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="4" className="text-right"><strong>Grand Total:</strong></td>
                                                        
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_income_tax, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) :  editFormData.report_type_get === "Security Deduction Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Name</th>
                                                        <th>Post</th>
                                                        <th>Job.Type</th>
                                                        <th>Security.Deduct</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((salary, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{salary.full_name}</td>
                                                            <td>{salary.employee_post + " (" + salary.pay_scale + ")"}</td>
                                                            <td>{salary.job_type}</td>
                                                            <td>{salary.total_security_deduct}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="4" className="text-right"><strong>Grand Total:</strong></td>
                                                        
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_security_deduct, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "CPF Deduction Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Name</th>
                                                        <th>Post</th>
                                                        <th>Job.Type</th>
                                                        <th>CPF</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((salary, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{salary.full_name}</td>
                                                            <td>{salary.employee_post + " (" + salary.pay_scale + ")"}</td>
                                                            <td>{salary.job_type}</td>
                                                            <td>{salary.total_cpf}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="4" className="text-right"><strong>Grand Total:</strong></td>
                                                        
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_cpf, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "Over Time Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Name</th>
                                                        <th>Post</th>
                                                        <th>Job.Type</th>
                                                        {/* <th>Month</th> */}
                                                        <th>Total.Hours</th>
                                                        <th>Over.Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((salary, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{salary.full_name}</td>
                                                            <td>{salary.employee_post + " (" + salary.pay_scale + ")"}</td>
                                                            <td>{salary.job_type}</td>
                                                            <td>{salary.total_hours == null ? 0 : salary.total_hours}</td>
                                                            <td>{salary.total_overtime_amount}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="4" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_hours, 0)}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_overtime_amount, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "CPF Loan Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Name</th>
                                                        <th>Post</th>
                                                        <th>Job.Type</th>
                                                        <th>CPF Loan</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((salary, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{salary.full_name}</td>
                                                            <td>{salary.employee_post + " (" + salary.pay_scale + ")"}</td>
                                                            <td>{salary.job_type}</td>
                                                            <td>{salary.total_loan_deduct}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="3" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_loan_deduct, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : editFormData.report_type_get === "2nd Shift Honorarium Report" ? (
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

                                            <table border="1" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                <thead style={{ borderBottom: "0px" }}>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Name</th>
                                                        <th>Post</th>
                                                        <th>Job.Type</th>
                                                        <th>2nd.Shift.Honor.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((salary, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{salary.full_name}</td>
                                                            <td>{salary.employee_post + " (" + salary.pay_scale + ")"}</td>
                                                            <td>{salary.job_type}</td>
                                                            <td>{salary.total_second_shift_honorarium}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="4" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_second_shift_honorarium, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div >
    );
};

export default SalaryReports;
