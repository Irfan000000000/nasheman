import React, { useState, useEffect, useContext, useMemo  } from 'react';
import axios from 'axios';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import moment from 'moment';
// import { saveAs } from 'file-saver';

// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';





const FeeReports = () => {




    // const [vouchers, setVouchers] = useState([]);

    const [scrollVouchers, setScrollVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState(scrollVouchers);


    // const [datewisePosting, setDatewisePosting] = useState([]);
    // const [datewisePostingfilteredVouchers, setDatesisePostingFilteredVouchers] = useState(datewisePosting);


    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { academicSession } = useContext(AcademicSessionContext);
    const [getCategories, setCategories] = useState([]);
    const [getClasses, setClasses] = useState([]);
    const [showData, setShowData] = useState(false);
    const [monthlyReports, setMonthlyReports] = useState({});

    // Inline filters for the Student Wise Headwise Report results
    const [swClassFilter, setSwClassFilter] = useState('');
    const [swSectionFilter, setSwSectionFilter] = useState('');
    const [swStatusFilter, setSwStatusFilter] = useState('');

    // Joined rows for the "Pending vs Headwise Cross Match" report
    const [crossMatchData, setCrossMatchData] = useState([]);
    // const [receivableAndPayableData, setReceivableAndPayableData] = useState([]);
    // const [totalPages, setTotalPages] = useState(1);

    // const [totalAmount, setTotalAmount] = useState(0);
    // const [totalRecievedAmount, setTotalRecievedAmount] = useState(0);

    // const [getGrandTotalPayable, setGrandTotalPayable] = useState(0);
    // const [lastMonth, setLastMonth] = useState('');

    // const [previousMonthArrearFine, setPreviousMonthArrearFine] = useState(0);


    // const [getStruckOffUnpaidTotal, setStruckOffUnpaidTotal] = useState(0);


    // const navigate = useNavigate();

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
        posting_from_date: '',
        posting_to_date: '',
        page: 1,
        limit: 100,
        shift: '',
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

    // Apply the Student Wise Headwise inline filters (class / section / status) to a voucher list
    const applyStudentWiseFilters = (vouchers) => {
        return vouchers.filter((voucher) =>
            (swClassFilter === '' || voucher.class_name === swClassFilter) &&
            (swSectionFilter === '' || voucher.section_name === swSectionFilter) &&
            (swStatusFilter === '' || voucher.status === swStatusFilter)
        );
    };



    useEffect(() => {
    // your filter logic here
    if (editFormData.report_type_get == "Pendency Report") {

        const searchQuery = editFormData.search_frontend?.toLowerCase() || "";
        const selectedClass = editFormData.filter_class?.toLowerCase() || "";
        const selectedSection = editFormData.filter_section?.toLowerCase() || "";
        const selectedCategory = editFormData.filter_category?.toLowerCase() || "";

        const filtered = scrollVouchers.filter((voucher) => {
            const matchesName = voucher.full_name.toLowerCase().includes(searchQuery);
            const matchesClass = selectedClass === "" || voucher.class_name.toLowerCase() === selectedClass;
            const matchesSection = selectedSection === "" || voucher.section_name.toLowerCase() === selectedSection;
            const matchesCategory = selectedCategory === "" || voucher.category.toLowerCase() === selectedCategory;

            return matchesName && matchesClass && matchesCategory && matchesSection;
        });

        setFilteredVouchers(filtered);
    }
}, [
    editFormData.search_frontend,   // ✅ add this
    editFormData.filter_class,   
    editFormData.filter_section,    // ✅ add this
    editFormData.filter_category,    // ✅ add this
    scrollVouchers                   // ✅ keep this
]);


    useEffect(() => {
        if (editFormData.report_type_get == "Recievable & Payable") {

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

            // Received (posting) date range filter
            const fromDate = editFormData.posting_from_date
                ? new Date(editFormData.posting_from_date).setHours(0, 0, 0, 0)
                : null;
            const toDate = editFormData.posting_to_date
                ? new Date(editFormData.posting_to_date).setHours(23, 59, 59, 999)
                : null;

            const filtered = scrollVouchers.filter((voucher) => {
                const matchesSearch =
                    voucher.invoice_no.includes(searchQuery) ||
                    voucher.register_no.toLowerCase().toString().includes(searchQuery) ||
                    voucher.old_register_no.toString().includes(searchQuery) ||
                    voucher.full_name.toLowerCase().toString().includes(searchQuery) ||
                    voucher.class.toLowerCase().includes(searchQuery) ||
                    voucher.section_name.toLowerCase().includes(searchQuery) ||
                    voucher.for_the_month.includes(searchQuery);

                // Filter by received/posting date when a range is selected
                let matchesDate = true;
                if (fromDate || toDate) {
                    if (!voucher.payment_date) {
                        matchesDate = false;
                    } else {
                        const paid = new Date(voucher.payment_date).setHours(0, 0, 0, 0);
                        if (fromDate && paid < fromDate) matchesDate = false;
                        if (toDate && paid > toDate) matchesDate = false;
                    }
                }

                return matchesSearch && matchesDate;
            });
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

        } else if (editFormData.report_type_get == "Class Wise Voucher Summary Report") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.class.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);

        } else if (editFormData.report_type_get == "Bus Fee Report") {

            const searchQuery = editFormData.search_frontend.toLowerCase();
            const filtered = scrollVouchers.filter((voucher) =>
                voucher.class.toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);
        } else if (editFormData.report_type_get == "Fee Not Generated Report") {

            const searchQuery = editFormData.search_frontend?.toLowerCase() || "";
            const filtered = scrollVouchers.filter((voucher) =>
                (voucher.full_name || "").toLowerCase().includes(searchQuery) ||
                (voucher.register_no || "").toString().toLowerCase().includes(searchQuery) ||
                (voucher.class_name || "").toLowerCase().includes(searchQuery) ||
                (voucher.section_name || "").toLowerCase().includes(searchQuery)
            );
            setFilteredVouchers(filtered);
        }



    }, [editFormData.search_frontend, editFormData.posting_from_date, editFormData.posting_to_date, scrollVouchers]);



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

        const { from_month, to_month, from_date, to_date, posting_from_date, posting_to_date, class_id, section_id, category_id, report_type_get, page, limit, search, shift } = editFormData;

        let url = '';
        let params = {
            from_month,
            to_month,
            from_date,
            to_date,
            posting_from_date,
            posting_to_date,
            class_id,
            section_id,
            category_id,
            session_id: academicSession,
            campus_id: user.user.campus_id,
            search,
            shift,
            page,
            limit
        };

        // Cross-match reports: fetch both the Student Wise Headwise (selected month) and the
        // Pendency data, then join per student and keep only the differences.
        //  - "Pending vs Headwise Cross Match"      -> month-scoped pending (classwise)
        //  - "Pendency vs Generated Difference"     -> all-unpaid-months pending (all-voucher)
        if (report_type_get === 'Pending vs Headwise Cross Match' ||
            report_type_get === 'Pendency vs Generated Difference') {
            if (from_month === '') {
                window.alert("!Please Select Month");
                setLoading(false);
                return false;
            }

            const allMonthsPending = report_type_get === 'Pendency vs Generated Difference';
            const headwiseUrl = process.env.REACT_APP_API_BASE_URL + '/student-wise-headwise-report';
            const pendingUrl = process.env.REACT_APP_API_BASE_URL +
                (allMonthsPending ? '/all-voucher-pending-report' : '/vouchers-pending-report-classwise');

            Promise.all([
                axios.get(headwiseUrl, { params }),
                axios.get(pendingUrl, { params })
            ])
                .then(([headwiseRes, pendingRes]) => {
                    const headwiseVouchers = headwiseRes.data.feeVouchers || [];
                    const pendingRows = pendingRes.data.feeVouchers || [];

                    // Sum the unpaid "Total Fee Generated" per student from the headwise data
                    const headwiseByStudent = headwiseVouchers.reduce((acc, v) => {
                        if (v.status === 'unpaid') {
                            const generated =
                                (Number(v.payable_amount) || 0) +
                                (Number(v.advance_payment) || 0) +
                                (Number(v.calculated_fine) || 0) +
                                (Number(v.arrears) || 0);
                            if (!acc[v.student_id]) {
                                acc[v.student_id] = {
                                    student_id: v.student_id,
                                    register_no: v.register_no,
                                    full_name: v.full_name,
                                    class_name: v.class_name,
                                    section_name: v.section_name,
                                    category: v.category,
                                    mobile_no: v.mobile_no,
                                    headwise_total: 0
                                };
                            }
                            acc[v.student_id].headwise_total += generated;
                        }
                        return acc;
                    }, {});

                    // Index the pending amounts per student
                    const pendingByStudent = pendingRows.reduce((acc, p) => {
                        acc[p.student_id] = p;
                        return acc;
                    }, {});

                    // Union of every student present in either source
                    const allStudentIds = new Set([
                        ...Object.keys(headwiseByStudent),
                        ...Object.keys(pendingByStudent)
                    ]);

                    const rows = [];
                    allStudentIds.forEach(id => {
                        const h = headwiseByStudent[id];
                        const p = pendingByStudent[id];

                        const headwiseTotal = Math.round(h ? h.headwise_total : 0);
                        const pendingTotal = Math.round(p ? (Number(p.payable_amount_after_due_date) || 0) : 0);
                        const difference = pendingTotal - headwiseTotal;

                        // Keep only mismatches
                        if (difference !== 0) {
                            rows.push({
                                student_id: id,
                                register_no: (h && h.register_no) || (p && p.register_no) || '',
                                full_name: (h && h.full_name) || (p && p.full_name) || '',
                                class_name: (h && h.class_name) || (p && p.class_name) || '',
                                section_name: (h && h.section_name) || (p && p.section_name) || '',
                                category: (h && h.category) || (p && p.category) || '',
                                mobile_no: (h && h.mobile_no) || (p && p.father_mobile_no) || '',
                                unpaid_months: (p && Number(p.unpaid_vouchers_count)) || 0,
                                pending_total: pendingTotal,
                                headwise_total: headwiseTotal,
                                difference
                            });
                        }
                    });

                    rows.sort((a, b) =>
                        (a.class_name || '').localeCompare(b.class_name || '') ||
                        (a.section_name || '').localeCompare(b.section_name || '') ||
                        (a.full_name || '').localeCompare(b.full_name || '')
                    );

                    setCrossMatchData(rows);
                    setLoading(false);
                    setShowData(true);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });

            return;
        }

        if (report_type_get === 'Headwise Report') {
            if(editFormData.from_month !== '' || editFormData.to_month !== '' ){
                url = process.env.REACT_APP_API_BASE_URL+'/fee-vouchers-report';
            }else{
                window.alert("!Please Select Month");
                return false;
            }
            
        }  if (report_type_get === 'Student Wise Headwise Report') {
            if(editFormData.from_month !== '' || editFormData.to_month !== '' ){
            url = process.env.REACT_APP_API_BASE_URL+'/student-wise-headwise-report';
        }else{
            window.alert("!Please Select Month");
            return false;
        }
        } else if (report_type_get === 'Pendency Report') {

            if(editFormData.from_month !== ''){
                url = process.env.REACT_APP_API_BASE_URL+'/vouchers-pending-report-classwise';
            }else{
                url = process.env.REACT_APP_API_BASE_URL+'/all-voucher-pending-report';
            }

        } else if (report_type_get === 'Fee Not Generated Report') {

            if(editFormData.from_month !== ''){
                url = process.env.REACT_APP_API_BASE_URL+'/fee-not-generated-report';
            }else{
                window.alert("!Please Select Month");
                setLoading(false);
                return false;
            }

        } else if (report_type_get === 'Recievable & Payable') {
            url = process.env.REACT_APP_API_BASE_URL+'/recievable-and-payable-report';
        } else if (report_type_get === 'Scroll Wise Report') {
            if(editFormData.from_date !== '' || editFormData.to_date !== '' ){
            url = process.env.REACT_APP_API_BASE_URL+'/vouchers-scrollwise-report';
        }else{
            window.alert("!Please Select Date");
            return false;
        }
        } else if (report_type_get === 'Datewise Posting Report') {
            if((editFormData.posting_from_date !== '' & editFormData.posting_to_date !== '') || editFormData.from_month !== ''){
            url = process.env.REACT_APP_API_BASE_URL+'/datewise-posting-report';
        }else{
            window.alert("!Please Select Date");
            return false;
        }
        } else if (report_type_get === 'Bank Wise Summary Report') {
            if(editFormData.from_date !== '' || editFormData.to_date !== '' ){
            url = process.env.REACT_APP_API_BASE_URL+'/bankwise-summary-report';
        }else{
            window.alert("!Please Select Date");
            return false;
        }
        } else if (report_type_get === 'Total Fee Allocate') {
            if(editFormData.from_date !== '' || editFormData.to_date !== '' ){
            url = process.env.REACT_APP_API_BASE_URL+'/total-fee-allocate';
        }else{
            window.alert("!Please Select Date");
            return false;
        }
        } else if (report_type_get === 'Total Fee Campus Wise') {
            if(editFormData.from_month !== '' || editFormData.to_month !== '' ){
            url = process.env.REACT_APP_API_BASE_URL+'/total-fee-campus-wise';
        }else{
            window.alert("!Please Select Month");
            return false;
        }
        } else if (report_type_get === 'Class Wise Voucher Summary Report') {
            if(editFormData.from_month !== ''){
            url = process.env.REACT_APP_API_BASE_URL+'/classwise-voucher-summary-report';
        }else{
            window.alert("!Please Select Month");
            return false;
        }
        } else if (report_type_get === 'Bus Fee Report') {
               if(editFormData.from_month !== '' || editFormData.to_month !== '' ){
            url = process.env.REACT_APP_API_BASE_URL+'/bus-fee-report';
        }  else{
            window.alert("!Please Select Date");
            return false;
        }
        }else if (report_type_get === 'Bad Debits Report') {
            
            if(editFormData.from_month !== ''){
                url = process.env.REACT_APP_API_BASE_URL+'/bad-debits-report';
            }else{
                url = process.env.REACT_APP_API_BASE_URL+'/bad-debits-report';
            }
            
        }

        if(editFormData.report_type_get == ""){
            return false;
        }

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

                    setMonthlyReports(monthlyReports);
                    console.log(monthlyReports);

                }else if (report_type_get === 'Student Wise Headwise Report') {
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

                    setMonthlyReports(monthlyReports);
                    console.log(monthlyReports);
                }
                
                else if (report_type_get === 'Pendency Report') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);
                    setFilteredVouchers(res.data.feeVouchers)
                } else if (report_type_get === 'Fee Not Generated Report') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);
                    setFilteredVouchers(res.data.feeVouchers)
                } else if (report_type_get === 'Bad Debits Report') {
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);
                    setFilteredVouchers(res.data.feeVouchers)
                }  else if (report_type_get === 'Recievable & Payable') {
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
                } else if (report_type_get === 'Class Wise Voucher Summary Report') {
                    console.log(res.data.feeVouchers);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.feeVouchers);  // Set filteredVouchers to the initial data
                } else if (report_type_get === 'Bus Fee Report') {
                    console.log(res.data.feeVouchers);
                    setScrollVouchers([]);
                    setFilteredVouchers([]);
                    setScrollVouchers(res.data.feeVouchers);  // Initialize scrollVouchers
                    setFilteredVouchers(res.data.feeVouchers);  // Set filteredVouchers to the initial data
                }

                if (report_type_get !== 'Pendency Report') {
                // setTotalPages(res.data.totalPages);
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


    // function searchPendency() {
    //     fetchData();
    // }


    // const edit = (id_get) => {
    //     localStorage.setItem('voucher_id', JSON.stringify(id_get));
    //     navigate('/edit-fee-voucher');
    // }

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


    // const groupVouchersByCategoryAndClass = (vouchers) => {
    //     return vouchers.reduce((acc, voucher) => {
    //         const category = acc[voucher.category] || {};
    //         const className = category[voucher.class_name] || [];
    //         className.push(voucher);
    //         category[voucher.class_name] = className;
    //         acc[voucher.category] = category;
    //         return acc;
    //     }, {});
    // };


    // const groupVouchersByCategoryClassAndSection = (vouchers) => {
    //     return vouchers.reduce((acc, voucher) => {
    //         const { category, class_name, section_name } = voucher;
    
    //         // Initialize category if not already present
    //         if (!acc[category]) {
    //             acc[category] = {};
    //         }
    
    //         // Initialize class_name within category if not already present
    //         if (!acc[category][class_name]) {
    //             acc[category][class_name] = {};
    //         }
    
    //         // Initialize section_name within class_name if not already present
    //         if (!acc[category][class_name][section_name]) {
    //             acc[category][class_name][section_name] = [];
    //         }
    
    //         // Push the voucher to the corresponding section
    //         acc[category][class_name][section_name].push(voucher);
    
    //         return acc;
    //     }, {});
    // };



    // const groupVouchersByClassAndSection = (vouchers) => {
    //     return vouchers.reduce((acc, voucher) => {
    //         const className = voucher.class_name;
    //         const sectionName = voucher.section_name;
            
    //         if (!acc[className]) {
    //             acc[className] = {};
    //         }
    
    //         if (!acc[className][sectionName]) {
    //             acc[className][sectionName] = [];
    //         }
    
    //         acc[className][sectionName].push(voucher);
    //         return acc;
    //     }, {});
    // };



    const groupVouchersByClassAndSection = (vouchers) => {
        return vouchers.reduce((acc, voucher) => {
            const { class_id, class_name, section_name } = voucher;
    
            if (!acc[class_id]) {
                acc[class_id] = { class_name, sections: {} };
            }
    
            if (!acc[class_id].sections[section_name]) {
                acc[class_id].sections[section_name] = [];
            }
    
            acc[class_id].sections[section_name].push(voucher);
    
            return acc;
        }, {});
    };
    
    
    // const calculateSubtotal = (vouchers, field) => {
    //     return vouchers.reduce((sum, voucher) => sum + (voucher[field] ? parseInt(voucher[field]) : 0), 0);
    // };

    // const calculateSubtotalForHead = (vouchers, head) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
    //         return sum + (feeHead ? feeHead.amount : 0);
    //     }, 0);
    // };

    // const calculateGrandTotal = (vouchers, field) => {
    //     return vouchers.reduce((sum, voucher) => sum + (voucher[field] ? parseInt(voucher[field]) : 0), 0);
    // };

    // const calculateGrandTotalForHead = (vouchers, head) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
    //         return sum + (feeHead ? feeHead.amount : 0);
    //     }, 0);
    // };

    const resetStates = () => {
        setEditFormData(initialFormData);
        setSwClassFilter('');
        setSwSectionFilter('');
        setSwStatusFilter('');
        setCrossMatchData([]);
    };

    // const calculateGrandTotalPending = (vouchers) => {
    //     return vouchers.reduce((total, voucher) => total + parseFloat(voucher.payable_amount_after_due_date), 0);
    // };




    // const calculateSubtotal = (vouchers, field) => {
    //     return vouchers.reduce((sum, voucher) => sum + (voucher[field] ? parseInt(voucher[field]) : 0), 0);
    // };
    
    // Calculate subtotals for a specific fee head
    // const calculateSubtotalForHead = (vouchers, head) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
    //         return sum + (feeHead ? feeHead.amount : 0);
    //     }, 0);
    // };


    // const calculateSubtotalForHead = (vouchers, head, feeStatus) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
    //         if (feeHead && voucher.fee_status === feeStatus) {
    //             return sum + feeHead.amount;
    //         }
    //         return sum;
    //     }, 0);
    // };
    
    // Calculate grand total for a specific field
    const calculateGrandTotal = (vouchers, field) => {
        return vouchers.reduce((sum, voucher) => sum + (voucher[field] ? parseInt(voucher[field]) : 0), 0);
    };
    
    // Calculate grand total for a specific fee head
    // const calculateGrandTotalForHead = (vouchers, head) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
    //         return sum + (feeHead ? feeHead.amount : 0);
    //     }, 0);
    // };
    
    // Calculate the correct pending amount
    // const calculateGrandTotalPending = (vouchers) => {
    //     const payableAmount = calculateGrandTotal(vouchers, 'payable_amount');
    //     const advancePayment = calculateGrandTotal(vouchers, 'advance_payment');
    //     const arrears = calculateGrandTotal(vouchers, 'arrears');
    //     const fine = calculateGrandTotal(vouchers, 'calculated_fine');
    //     const receivedPayment = calculateGrandTotal(vouchers, 'recieved_payment');
    
    //     return (payableAmount + advancePayment + arrears + fine) - receivedPayment;
    // };



    // const calculateSubtotalForField = (vouchers, field, feeStatus) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         if (voucher.fee_status === feeStatus) {
    //             return sum + (voucher[field] ? parseInt(voucher[field]) : 0);
    //         }
    //         return sum;
    //     }, 0);
    // };

    const calculateSubtotalForField = (vouchers, field, feeStatus = null) => {
        return vouchers.reduce((sum, voucher) => {
            const status = voucher.fee_status || 'null'; // Default status to 'null' if not provided
            if (feeStatus === null || status === feeStatus) { 
                return sum + (voucher[field] ? parseInt(voucher[field]) : 0);
            }
            return sum;
        }, 0);
    };
    
    
    // Function to calculate subtotal for a specific fee head with fee_status (paid/unpaid)
    // const calculateSubtotalForHead = (vouchers, head, feeStatus) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
    //         if (feeHead && voucher.fee_status === feeStatus) {
    //             return sum + feeHead.amount;
    //         }
    //         return sum;
    //     }, 0);
    // };
    
    const calculateSubtotalForHead = (vouchers, head, feeStatus = null) => {
        return vouchers.reduce((sum, voucher) => {
            const status = voucher.fee_status || 'null'; // Default status to 'null'
            const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
            if (feeHead && (feeStatus === null || status === feeStatus)) {
                return sum + feeHead.amount;
            }
            return sum;
        }, 0);
    };
    
   

    // const grandTotal = calculateGrandTotalPending(vouchers);


    const getReportTitle = () => {
        switch (editFormData.report_type_get) {
            case 'Headwise Report':
                return 'Head Wise Fee Report' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            case 'Student Wise Headwise Report':
                    return 'Student Wise Headwise Report' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            case 'Pending vs Headwise Cross Match':
                    return 'Pending vs Headwise Cross Match (Mismatches)' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            case 'Pendency vs Generated Difference':
                    return 'Pendency vs Generated Difference' + (editFormData.from_month ? ' (Generated: ' + editFormData.from_month + ' vs Total Pending)' : '');
            case 'Fee Not Generated Report':
                    return 'Fee Not Generated Report' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            case 'Pendency Report':
                return 'Pendency Report' + (editFormData.from_month ? ' (' + editFormData.from_month + ' to ' + editFormData.to_month + ')' : '');
            // case 'Recievable & Payable':
            //     return 'Recievable & Payable' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            case 'Scroll Wise Report':
                return 'Scroll Wise Report' + (editFormData.from_date ? ' (' + editFormData.from_date + ' to ' + editFormData.to_date + ')' : '');
            case 'Datewise Posting Report':
                return 'Fee Posting Report'
                    + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '')
                    + (editFormData.posting_from_date ? ' [Received ' + editFormData.posting_from_date + (editFormData.posting_to_date ? ' to ' + editFormData.posting_to_date : '') + ']' : '');
            case 'Bank Wise Summary Report':
                return 'Bank Wise Summary Report' + (editFormData.from_date ? ' (' + editFormData.from_date + ' to ' + editFormData.to_date + ')' : '');
            case 'Total Fee Allocate':
                return 'Total Fee Allocate' + (editFormData.from_date ? ' (' + editFormData.from_date + ' to ' + editFormData.to_date + ')' : '');
            case 'Total Fee Campus Wise':
                return 'Total Fee Campus Wise' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            case 'Class Wise Voucher Summary Report':
                return 'Class Wise Voucher Summary Report' + (editFormData.from_date ? ' (' + editFormData.from_date + ' to ' + editFormData.to_date + ')' : '');
            case 'Bus Fee Report':
                return 'Bus Fee Report' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            case 'Bad Debits Report':
                return 'Bad Debits Report' + (editFormData.from_month ? ' (' + editFormData.from_month + ')' : '');
            default:
                return 'Fee Report';
        }
    };

    


    const options = [
        { value: '', label: 'Select Report Type' },
        { value: 'Headwise Report', label: 'Headwise Report' },
        { value: 'Student Wise Headwise Report', label: 'Student Wise Headwise Report' },
        { value: 'Pending vs Headwise Cross Match', label: 'Pending vs Headwise Cross Match' },
        { value: 'Pendency vs Generated Difference', label: 'Pendency vs Generated Difference' },
        { value: 'Fee Not Generated Report', label: 'Fee Not Generated Report' },
        { value: 'Pendency Report', label: 'Pendency Report' },
        { value: 'Bad Debits Report', label: 'Bad Debits Report' },
        // { value: 'Recievable & Payable', label: 'Recievable And Payable' },
        { value: 'Scroll Wise Report', label: 'Scroll Wise Report' },
        { value: 'Datewise Posting Report', label: 'Fee Posting Report' },
        { value: 'Bank Wise Summary Report', label: 'Bank Wise Summary Report' },
        { value: 'Total Fee Allocate', label: 'Total Fee Allocate' },
        { value: 'Total Fee Campus Wise', label: 'Total Fee Campus Wise' },
        { value: 'Class Wise Voucher Summary Report', label: 'Class Wise Voucher Summary Report' },
        { value: 'Bus Fee Report', label: 'Bus Fee Report' }
      
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
        // Universal front-end export: download exactly what is rendered in the
        // report modal as an Excel file using the `xlsx` package (no backend call).
        const container = document.querySelector('.fee-report-modal-body');
        const tables = container ? Array.from(container.querySelectorAll('table')) : [];

        if (!tables.length) {
            toast.error('No report data to export.');
            return;
        }

        const workbook = XLSX.utils.book_new();
        const usedNames = {};
        tables.forEach((table, idx) => {
            const worksheet = XLSX.utils.table_to_sheet(table);
            let name = (table.getAttribute('data-sheet-name') ||
                (tables.length > 1 ? `Report ${idx + 1}` : 'Report'))
                .replace(/[\\/?*\[\]:]/g, ' ')   // strip characters Excel disallows in sheet names
                .trim()
                .substring(0, 31) || `Report ${idx + 1}`;
            // Excel requires unique sheet names
            if (usedNames[name]) {
                const suffix = ` (${++usedNames[name]})`;
                name = name.substring(0, 31 - suffix.length) + suffix;
            } else {
                usedNames[name] = 1;
            }
            XLSX.utils.book_append_sheet(workbook, worksheet, name);
        });

        const fileName = (editFormData.report_type_get || 'report')
            .replace(/[^a-z0-9]+/gi, '_')
            .replace(/^_+|_+$/g, '')
            .toLowerCase();
        XLSX.writeFile(workbook, `${fileName || 'report'}.xlsx`);
        return;

        // ---- Legacy per-report export logic kept below for reference (unreachable) ----
        // eslint-disable-next-line no-unreachable
        if(editFormData.report_type_get == "Headwise Report")
        {
         
            const workbook = XLSX.utils.book_new();

    // Process each month's data into individual sheets
    Object.entries(monthlyReports).forEach(([month, { vouchers, feeHeadDetails }]) => {
        const feeHeadNames = [...new Set(feeHeadDetails.map(head => head.head_name))];
        const rows = [];

        // Add header row
        const headers = [
            "Class",
            "Section",
            ...feeHeadNames.flatMap(head => [`${head} Payable`, `${head} Received`]),
            "Bus Fee Payable",
            "Bus Fee Received",
            "Advance Payment Payable",
            "Advance Payment Received",
            "Arrears Payable",
            "Arrears Received",
            "Arrears Fine Payable",
            "Arrears Fine Received",
            "Absent Fine Payable",
            "Absent Fine Received",
            "Fine Received",
            "Total Payable Amount",
            "Total Received Amount",
        ];
        rows.push(headers);

        // Group data by class and section
        const groupedData = groupVouchersByClassAndSection(vouchers);

        Object.entries(groupedData).forEach(([classId, { class_name, sections }]) => {
            Object.entries(sections).forEach(([sectionName, vouchers]) => {
                const row = [
                    class_name,
                    sectionName,
                    ...feeHeadNames.flatMap(head => [
                        calculateSubtotalForHead(vouchers, head), // Payable
                        calculateSubtotalForHead(vouchers, head, "paid"), // Received
                    ]),
                    calculateSubtotalForField(vouchers, "bus_fee", null),
                    calculateSubtotalForField(vouchers, "bus_fee", "paid"),
                    calculateSubtotalForField(vouchers, "advance_payment", null),
                    calculateSubtotalForField(vouchers, "advance_payment", "paid"),
                    calculateSubtotalForField(vouchers, "arrears", null) -
                        calculateSubtotalForField(vouchers, "arrears_fine", null),
                    calculateSubtotalForField(vouchers, "arrears", "paid") -
                        calculateSubtotalForField(vouchers, "arrears_fine", "paid"),
                    calculateSubtotalForField(vouchers, "arrears_fine", null),
                    calculateSubtotalForField(vouchers, "arrears_fine", "paid"),
                    calculateSubtotalForField(vouchers, "attendance_amount", null),
                    calculateSubtotalForField(vouchers, "attendance_amount", "paid"),
                    calculateSubtotalForField(vouchers, "calculated_fine", null),
                    calculateSubtotalForField(vouchers, "payable_amount", null) +
                        calculateSubtotalForField(vouchers, "advance_payment", null) +
                        calculateSubtotalForField(vouchers, "calculated_fine", null) +
                        calculateSubtotalForField(vouchers, "arrears", null),
                    calculateSubtotalForField(vouchers, "recieved_payment", "paid"),
                ];
                rows.push(row);
            });
        });

        // Add Grand Total Row
        const grandTotalRow = [
            "Grand Total",
            "",
            ...feeHeadNames.flatMap(head => [
                calculateGrandTotalForHead(vouchers, head, null),
                calculateGrandTotalForHead(vouchers, head, "paid"),
            ]),
            calculateGrandTotalForField(vouchers, "bus_fee", null),
            calculateGrandTotalForField(vouchers, "bus_fee", "paid"),
            calculateGrandTotalForField(vouchers, "advance_payment", null),
            calculateGrandTotalForField(vouchers, "advance_payment", "paid"),
            calculateGrandTotalForField(vouchers, "arrears", null) -
                calculateGrandTotalForField(vouchers, "arrears_fine", null),
            calculateGrandTotalForField(vouchers, "arrears", "paid") -
                calculateGrandTotalForField(vouchers, "arrears_fine", "paid"),
            calculateGrandTotalForField(vouchers, "arrears_fine", null),
            calculateGrandTotalForField(vouchers, "arrears_fine", "paid"),
            calculateGrandTotalForField(vouchers, "attendance_amount", null),
            calculateGrandTotalForField(vouchers, "attendance_amount", "paid"),
            calculateGrandTotalForField(vouchers, "calculated_fine", null),
            calculateGrandTotalForField(vouchers, "payable_amount", null) +
                calculateGrandTotalForField(vouchers, "advance_payment", null) +
                calculateGrandTotalForField(vouchers, "calculated_fine", null) +
                calculateGrandTotalForField(vouchers, "arrears", null),
            calculateGrandTotalForField(vouchers, "recieved_payment", "paid"),
        ];
        rows.push(grandTotalRow);

        // Create a worksheet and add it to the workbook
        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(workbook, worksheet, month);
    });

    // Export the workbook
    XLSX.writeFile(workbook, "MonthlyReportsHeadwise.xlsx");

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
    

        } else if(editFormData.report_type_get == "Bad Debits Report"){

            axios.get(process.env.REACT_APP_API_BASE_URL+"/bad-debits-report", {
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
                       link.setAttribute('download', `bad debits report.xlsx`); // Set the file name with .xlsx extension
   
                       // Append the link to the body, click it, and then remove it
                       document.body.appendChild(link);
                       link.click();
                       document.body.removeChild(link);
   
                       // Free up the created URL
                       window.URL.revokeObjectURL(url);
                   }
               })
               .catch(err => console.error(err));
       
   
           } else if(editFormData.report_type_get == "Recievable & Payable"){


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


        }else if(editFormData.report_type_get == "Student Wise Headwise Report"){


            // Create a new workbook
const workbook = XLSX.utils.book_new();

Object.entries(monthlyReports).forEach(([month, { vouchers: rawVouchers, feeHeadDetails }]) => {
  // Apply the same inline class / section / status filters as the on-screen report
  const vouchers = applyStudentWiseFilters(rawVouchers);

  // Extract unique fee head names
  const feeHeadNames = [...new Set(feeHeadDetails.map(head => head.head_name))];

  // Build the header row, including the new "Created" column after "Arr.Months"
  const headers = [
    "Sr#",
    "Reg#",
    "Name",
    "Class",
    "Section",
    "Father",
    "Category",
    "Phone No",
    ...feeHeadNames.flatMap(head => [`${head} Generated`, `${head} Received`]),
    "Bus Fee Generated",
    "Bus Fee Received",
    "Advance Payment Generated",
    "Advance Payment Received",
    "Arrears Generated",
    "Arrears Received",
    "Arrears Fine Generated",
    "Arrears Fine Received",
    "Absent Fine Generated",
    "Absent Fine Received",
    "Fine Received",
    "Status",
    "Post Date",
    "Total Fee Generated",
    "Total Received Amount",
    "Arr.Months",
    "Created"
  ];

  let sr_no = 1;
  const rows = [];

  // Group vouchers by class_id
  const groupedByClass = vouchers.reduce((acc, voucher) => {
    if (!acc[voucher.class_id]) {
      acc[voucher.class_id] = { class_name: voucher.class_name, students: [] };
    }
    acc[voucher.class_id].students.push(voucher);
    return acc;
  }, {});

  // Sort classes by class_id (ascending) and sort students by section name within each class
  Object.entries(groupedByClass)
    .sort(([classIdA], [classIdB]) => parseInt(classIdA) - parseInt(classIdB))
    .forEach(([class_id, { class_name, students }]) => {
      students
        .sort((a, b) => a.section_name.localeCompare(b.section_name))
        .forEach(voucher => {
          // Build the row for each voucher
          const row = [
            sr_no++,
            voucher.register_no,
            voucher.full_name,
            class_name,
            voucher.section_name,
            voucher.father_name,
            voucher.category,
            voucher.mobile_no,
          ];

          // Process dynamic fee head columns
          feeHeadNames.forEach(head => {
            const feeHeadData = voucher.fee_head.find(fh => fh.head_name === head);
            row.push(feeHeadData?.amount || 0); // Generated amount
            row.push(voucher.status === "paid" ? feeHeadData?.amount || 0 : 0); // Received amount
          });

          // Append additional fields
          row.push(
            voucher.bus_fee || 0,
            voucher.status === "paid" ? voucher.bus_fee || 0 : 0,
            voucher.advance_payment || 0,
            voucher.status === "paid" ? voucher.advance_payment || 0 : 0,
            voucher.arrears || 0,
            voucher.status === "paid" ? voucher.arrears || 0 : 0,
            voucher.arrears_fine || 0,
            voucher.status === "paid" ? voucher.arrears_fine || 0 : 0,
            voucher.attendance_amount || 0,
            voucher.status === "paid" ? voucher.attendance_amount || 0 : 0,
            voucher.calculated_fine || 0,
            voucher.status === "paid" ? "Paid" : "Unpaid",
            voucher.payment_date || "-",
            (voucher.payable_amount || 0) +
              (voucher.advance_payment || 0) +
              (voucher.calculated_fine || 0) +
              (voucher.arrears || 0),
            voucher.recieved_payment || 0,
            (JSON.parse(voucher.arrears_not_cleared)).length || "-",
            convertDates(voucher.created_at) || 0
          );
          rows.push(row);
        });
    });

  // Build the Grand Total row
  const grandTotalRow = [
    "Grand Total", // Sr# column replaced by label
    "", "", "", "", "", "", ""
  ];

  // For each dynamic fee head column, calculate totals
  feeHeadNames.forEach(head => {
    const payableTotal = vouchers.reduce(
      (sum, voucher) => sum + (voucher.fee_head.find(fh => fh.head_name === head)?.amount || 0),
      0
    );
    const receivedTotal = vouchers.reduce(
      (sum, voucher) =>
        sum + (voucher.status === "paid" ? (voucher.fee_head.find(fh => fh.head_name === head)?.amount || 0) : 0),
      0
    );
    grandTotalRow.push(payableTotal, receivedTotal);
  });

  // Calculate totals for the remaining fixed columns
  grandTotalRow.push(
    vouchers.reduce((sum, voucher) => sum + (voucher.bus_fee || 0), 0),
    vouchers.reduce((sum, voucher) => voucher.status === "paid" ? sum + (voucher.bus_fee || 0) : sum, 0),
    vouchers.reduce((sum, voucher) => sum + (voucher.advance_payment || 0), 0),
    vouchers.reduce((sum, voucher) => voucher.status === "paid" ? sum + (voucher.advance_payment || 0) : sum, 0),
    vouchers.reduce((sum, voucher) => sum + (voucher.arrears || 0), 0),
    vouchers.reduce((sum, voucher) => voucher.status === "paid" ? sum + (voucher.arrears || 0) : sum, 0),
    vouchers.reduce((sum, voucher) => sum + (voucher.arrears_fine || 0), 0),
    vouchers.reduce((sum, voucher) => voucher.status === "paid" ? sum + (voucher.arrears_fine || 0) : sum, 0),
    vouchers.reduce((sum, voucher) => sum + (voucher.attendance_amount || 0), 0),
    vouchers.reduce((sum, voucher) => voucher.status === "paid" ? sum + (voucher.attendance_amount || 0) : sum, 0),
    vouchers.reduce((sum, voucher) => sum + (voucher.calculated_fine || 0), 0),
    "-", // Status column not applicable in totals
    "-", // Post Date column not applicable in totals
    vouchers.reduce(
      (sum, voucher) =>
        sum + ((voucher.payable_amount || 0) +
          (voucher.advance_payment || 0) +
          (voucher.calculated_fine || 0) +
          (voucher.arrears || 0)),
      0
    ),
    vouchers.reduce((sum, voucher) => sum + (voucher.recieved_payment || 0), 0),
    "", // Arr.Months total left blank
    ""  // Created column total left blank
  );
  rows.push(grandTotalRow);

  // Append a final row for the report print date
  const printDate = convertDates(new Date());
  const printDateRow = new Array(headers.length).fill("");
  printDateRow[0] = "Report Print Date:";
  printDateRow[1] = printDate;
  rows.push(printDateRow);

  // Create worksheet from the array of arrays and append it to the workbook
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  XLSX.utils.book_append_sheet(workbook, worksheet, month);
});

// Write the workbook to a file
XLSX.writeFile(workbook, "MonthlyReportsStudentWiseHeadwise.xlsx");





        } else {
            // Generic front-end export: convert the rendered report table(s) to Excel.
            // Covers Scroll Wise, Datewise Posting, Bank Wise Summary, Total Fee Allocate,
            // Total Fee Campus Wise, Class Wise Voucher Summary and Bus Fee reports.
            const container = document.querySelector('.fee-report-modal-body');
            const tables = container ? container.querySelectorAll('table') : [];

            if (!tables.length) {
                toast.error('No report data to export.');
                return;
            }

            const workbook = XLSX.utils.book_new();
            tables.forEach((table, idx) => {
                const worksheet = XLSX.utils.table_to_sheet(table);
                const sheetName = (tables.length > 1 ? `Report ${idx + 1}` : 'Report').substring(0, 31);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            });

            const safeName = (editFormData.report_type_get || 'report')
                .replace(/[^a-z0-9]+/gi, '_')
                .replace(/^_+|_+$/g, '')
                .toLowerCase();
            XLSX.writeFile(workbook, `${safeName || 'report'}.xlsx`);
        }
      };
      
    //   const calculateGrandTotalForField = (vouchers, field, feeStatus) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         if (voucher.fee_status === feeStatus) {
    //             return sum + (voucher[field] ? parseInt(voucher[field]) : 0);
    //         }
    //         return sum;
    //     }, 0);
    // };
    
    const calculateGrandTotalForField = (vouchers, field, feeStatus = null) => {
        return vouchers.reduce((sum, voucher) => {
            const status = voucher.fee_status || 'null'; // Default to 'null'
            if (feeStatus === null || status === feeStatus) {
                return sum + (voucher[field] ? parseInt(voucher[field]) : 0);
            }
            return sum;
        }, 0);
    };


    const calculateGrandTotalBadDebits = (vouchers) => {
        return vouchers.reduce((sum, voucher) => {
            if (
                voucher.fee_status === 'unpaid' &&  voucher.is_arrear !== 'arrears' &&
                ["Struck Off", "SLC"].includes(voucher.student_status)
            ) {
                console.log("hit");
                
                // Safely parse and add values, defaulting to 0 if invalid
                const payableAmount = parseInt(voucher["payable_amount"], 10) || 0;
                const arrears = parseInt(voucher["arrears"], 10) || 0;
                const firstAdvancePayment = parseInt(voucher["advance_payment"], 10) || 0;

                console.log(payableAmount, arrears, firstAdvancePayment, "test struck off");
    
                return sum + payableAmount + arrears + firstAdvancePayment;
            }
            return sum;
        }, 0);
    };
       
    // Grand Total Helper for Fee Heads
    // const calculateGrandTotalForHead = (vouchers, head, feeStatus) => {
    //     return vouchers.reduce((sum, voucher) => {
    //         const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
    //         if (feeHead && voucher.fee_status === feeStatus) {
    //             return sum + feeHead.amount;
    //         }
    //         return sum;
    //     }, 0);
    // };



    
    const calculateGrandTotalForHead = (vouchers, head, feeStatus = null) => {
        return vouchers.reduce((sum, voucher) => {
            const status = voucher.fee_status || 'null';
            const feeHead = voucher.fee_head.find(fh => fh.head_name === head);
            if (feeHead && (feeStatus === null || status === feeStatus)) {
                return sum + feeHead.amount;
            }
            return sum;
        }, 0);
    };



    const handleFromDateChange = (e) => {
        const newFromDate = e.target.value;
        setEditFormData((prevData) => ({
          ...prevData,
          from_date: newFromDate,
          to_date: ''
        }));
      };



      const handleToDateChange = (e) => {
        setEditFormData((prevData) => ({
          ...prevData,
          to_date: e.target.value,
        }));
      };

    

      const getMaxToDate = () => {
        if (!editFormData.from_date) return '';
        const fromDate = new Date(editFormData.from_date);
        fromDate.setMonth(fromDate.getMonth() + 1);

        console.log("this is max date" + fromDate.toISOString().split('T')[0]);

        return fromDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      };


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-md-12 p-2">
                    <div style={{
                        background: '#EBD197',
                        color: 'linear-gradient(90deg, #1f2329 0%, #2c313a 100%)',
                        padding: '12px 18px',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        borderBottom: '3px solid #EBD197'
                    }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div style={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.3px' }}>
                                <i className="fas fa-file-invoice-dollar mr-2"></i> {getReportTitle()}
                            </div>
                        </div>
                    </div>
                    <div style={{
                        border: '1px solid #e3e6eb',
                        borderTop: 'none',
                        background: '#fafbfc',
                        padding: '14px',
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px'
                    }}>
                        <div className="fee-report-filters">

                            <div className="col-2 pl-1 pr-1">
                                <label className="frf-label">Report Type</label>
                                <Select
                                    name="report_type_get"
                                    value={selectedOption}
                                    onChange={handleReportTypeChange}
                                    options={options}
                                    isClearable
                                />
                            </div>

                            {(editFormData.report_type_get === "Scroll Wise Report" ||  editFormData.report_type_get === "Bank Wise Summary Report" || editFormData.report_type_get === "Total Fee Allocate") && (
                                <>

                                <div className="col-2 pl-1 pr-1">
                                        <label className="frf-label">From Date</label>
                                        <input
                                        type="date"
                                        className="form-control"
                                        id="from_date"
                                        value={editFormData.from_date}
                                        onChange={handleFromDateChange}
                                        />
                                    </div>

                                    <div className="col-2 pl-1 pr-1">
                                        <label className="frf-label">To Date</label>
                                        <input
                                        type="date"
                                        className="form-control"
                                        id="to_date"
                                        value={editFormData.to_date}
                                        min={editFormData.from_date}
                                        max={getMaxToDate()}
                                        onChange={handleToDateChange}
                                        />
                                    </div>

                                    {/* <div className="col-2 pl-1 pr-1">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="from_date"
                                            value={editFormData.from_date}
                                            onChange={(e) => setEditFormData({ ...editFormData, from_date: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-2 pl-1 pr-1">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="to_date"
                                            value={editFormData.to_date}
                                            onChange={(e) => setEditFormData({ ...editFormData, to_date: e.target.value })}
                                        />
                                    </div> */}
                                </>
                            )}



                            {editFormData.report_type_get !== "Scroll Wise Report" &&  editFormData.report_type_get !== "Total Fee Allocate" && editFormData.report_type_get !== "Bank Wise Summary Report" && (
                                <>
                                {editFormData.report_type_get !== "Recievable & Payable" && (
                                    <>
                                    <div className="col-2 pl-1 pr-1">
                                        <label className="frf-label">Month</label>
                                        <input type="month" className="form-control" id="from_month" value={editFormData.from_month} onChange={(e) => setEditFormData({ ...editFormData, from_month: e.target.value })} />
                                    </div>
                                    </>
                                )}
                                  
                                    
                                  { editFormData.report_type_get !== "Class Wise Voucher Summary Report" && (
                                    <>
                                    <div className="col-2 pl-1 pr-1">
                                        <label className="frf-label">Class</label>
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
                                    </div>
                                 
                                    <div className="col-2 pl-1 pr-1">
                                        <label className="frf-label">Category</label>
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
                                    </div>
                                    </>
                                     )}
                                </>
                            )}

                            {editFormData.report_type_get === "Datewise Posting Report" && (
                                <>
                                    <div className="col-2 pl-1 pr-1">
                                        <label className="frf-label">Received From</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="posting_from_date"
                                            title="Received Date From"
                                            value={editFormData.posting_from_date}
                                            onChange={(e) => setEditFormData({ ...editFormData, posting_from_date: e.target.value, posting_to_date: '' })}
                                        />
                                    </div>
                                    <div className="col-2 pl-1 pr-1">
                                        <label className="frf-label">Received To</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="posting_to_date"
                                            title="Received Date To"
                                            value={editFormData.posting_to_date}
                                            min={editFormData.posting_from_date}
                                            onChange={(e) => setEditFormData({ ...editFormData, posting_to_date: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="col-2 pl-1 pr-1">
                                <label className="frf-label">Shift</label>
                                <select
                                    name="shift"
                                    id="shift"
                                    className={'form-control'}
                                    value={editFormData.shift} onChange={(e) => setEditFormData({ ...editFormData, shift: e.target.value })}
                                >
                                    {/* <option value="">Select Shift</option> */}
                                    <option value={""}>Both</option>
                                    <option>Morning</option>
                                    <option>Evening</option>
                                  
                                </select>
                                </div>

                            <div className="mr-2 d-none">
                                <input type="text" placeholder='Search.........' className="form-control" value={editFormData.search} onChange={(e) => setEditFormData({ ...editFormData, search: e.target.value })} />
                            </div>

                            <div className="frf-actions">
                                <button className="btn btn-sm" style={{ background: 'linear-gradient(90deg, #1f2329 0%, #2c313a 100%)', color: '#EBD197', fontWeight: 600, border: '1px solid #EBD197' }} onClick={handleSearch}>
                                    <i className="fas fa-search mr-1"></i> Search
                                </button>
                                <button className="btn btn-sm btn-outline-secondary" style={{ fontWeight: 600 }} onClick={resetStates}>
                                    <i className="fas fa-redo mr-1"></i> Reset
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        {showData && (
                            <>
                            <div
                                onClick={() => setShowData(false)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    backgroundColor: 'rgba(31, 35, 41, 0.55)',
                                    backdropFilter: 'blur(3px)',
                                    zIndex: 9998
                                }}
                            />
                            <div style={{
                                position: 'fixed',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 9999,
                                width: '92%',
                                maxWidth: '1800px',
                                maxHeight: '92vh',
                                overflow: 'hidden',  // Prevent the whole modal from scrolling
                                backgroundColor: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
                                border: '1px solid #e3e6eb',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    backgroundColor: '#EBD197',
                                    color: '#000000',
                                    width: '100%',
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderTopLeftRadius: '10px',
                                    borderTopRightRadius: '10px'
                                }}>
                                    <h5 style={{
                                        margin: 0,
                                        fontWeight: 600,
                                        letterSpacing: '0.3px',
                                        color: '#000000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <i className="fas fa-file-invoice-dollar"></i>
                                        {getReportTitle()}
                                    </h5>
                                    <button
                                        onClick={() => setShowData(false)}
                                        title="Close"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.08)',
                                            border: '1px solid rgba(0, 0, 0, 0.35)',
                                            color: '#000000',
                                            fontSize: '18px',
                                            lineHeight: 1,
                                            cursor: 'pointer',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className='px-3 py-2 d-flex justify-content-end align-items-center w-100' style={{ borderBottom: '1px solid #eef0f3', backgroundColor: '#fafbfc' }}>
                                    <button onClick={exportReportToExcel} className="btn btn-sm" style={{ backgroundColor: '#1e7e45', color: '#fff', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="fas fa-file-excel"></i> Export to Excel
                                    </button>
                                </div>
                                <div className="fee-report-modal-body" style={{ width: '100%', overflowY: 'auto', overflowX: 'auto', maxHeight: 'calc(92vh - 110px)', padding: '0 14px 14px' }}>  {/* Make the content area scrollable */}
                                
                                <div className='d-flex justify-content-end'>
                               
                                </div>

                                    {editFormData.report_type_get === "Headwise Report" ? (
                                        <div className=''>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : (
                                                Object.entries(monthlyReports).map(([month, { vouchers, feeHeadDetails }]) => {
                                                    const groupedData = groupVouchersByClassAndSection(vouchers);
                                                    const feeHeadNames = [...new Set(feeHeadDetails.map(head => head.head_name))];
                                                    return (
                                                        <div key={month} className="mb-4">
                                                            {/* <h5 className="text-center" style={{ backgroundColor: "rgb(206, 206, 206)", padding: "5px" }}>
                                                                {month}
                                                            </h5> */}
                                                            <table border="1" data-sheet-name={month} className="p-0 table table-hover" style={{ borderTop: "0px" }}>
                                                            <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#f8f9fa" }}>
                                                            
                                                                    <tr>
                                                                        {/* <th>Class</th>
                                                                        <th>Section</th> */}
                                                                           <th className="sticky-col-1">Class</th>       {/* ✅ sticky */}
                <th className="sticky-col-2">Section</th>     {/* ✅ sticky */}
                                                                        {feeHeadNames.map(head => (
                                                                            <React.Fragment key={head}>
                                                                                <th>{head} Payable</th>
                                                                                <th>{head} Received</th>
                                                                            </React.Fragment>
                                                                        ))}

                                                                        <th>Bus Fee Payable</th>
                                                                        <th>Bus Fee Received</th>
                                                                        <th>Advance Payment Payable</th>
                                                                        <th>Advance Payment Received</th>
                                                                        <th>Arrears Payable</th>
                                                                        <th>Arrears Received</th>
                                                                        <th>Arrears Fine Payable</th>
                                                                        <th>Arrears Fine Received</th>
                                                                        <th>Absent Fine Payable</th>
                                                                        <th>Absent Fine Received</th>
                                                                        <th>Fine Received</th>
                                                                        <th>Total Payable Amount</th>
                                                                        <th>Total Received Amount</th>
                                                                         <th>Balance</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {Object.entries(groupedData)
    .sort(([classIdA], [classIdB]) => parseInt(classIdA) - parseInt(classIdB)) // Sort by class_id
    .map(([classId, { class_name, sections }]) => (
        <React.Fragment key={classId}>
            {Object.entries(sections)
                .sort(([sectionA], [sectionB]) => sectionA.localeCompare(sectionB)) // Sort sections alphabetically
                .map(([sectionName, vouchers]) => (
                    <tr key={`${classId}-${sectionName}`}>
                        {/* <td>{class_name}</td>
                        <td>{sectionName}</td> */}
                        <td className="sticky-col-1">{class_name}</td>    {/* ✅ sticky */}
            <td className="sticky-col-2">{sectionName}</td>   {/* ✅ sticky */}
                        {feeHeadNames.map(head => (
                            <React.Fragment key={head}>
                                <td>{calculateSubtotalForHead(vouchers, head)}</td>
                                <td>{calculateSubtotalForHead(vouchers, head, 'paid')}</td>
                            </React.Fragment>
                        ))}
                        <td>{calculateSubtotalForField(vouchers, 'bus_fee', null)}</td>
                        <td>{calculateSubtotalForField(vouchers, 'bus_fee', 'paid')}</td>
                        <td>{calculateSubtotalForField(vouchers, 'advance_payment', null)}</td>
                        <td>{calculateSubtotalForField(vouchers, 'advance_payment', 'paid')}</td>
                        <td>{calculateSubtotalForField(vouchers, 'arrears', null) - calculateSubtotalForField(vouchers, 'arrears_fine', null)}</td>
                        <td>{calculateSubtotalForField(vouchers, 'arrears', 'paid') - calculateSubtotalForField(vouchers, 'arrears_fine', 'paid')}</td>
                        <td>{calculateSubtotalForField(vouchers, 'arrears_fine', null)}</td>
                        <td>{calculateSubtotalForField(vouchers, 'arrears_fine', 'paid')}</td>
                        <td>{calculateSubtotalForField(vouchers, 'attendance_amount', null)}</td>
                        <td>{calculateSubtotalForField(vouchers, 'attendance_amount', 'paid')}</td>
                        <td>{calculateSubtotalForField(vouchers, 'calculated_fine', null)}</td>
                        <td>
                            {calculateSubtotalForField(vouchers, 'payable_amount', null) +
                                calculateSubtotalForField(vouchers, 'advance_payment', null) +
                                calculateSubtotalForField(vouchers, 'calculated_fine', null) +
                                calculateSubtotalForField(vouchers, 'arrears', null)}
                        </td>
                        <td>{calculateSubtotalForField(vouchers, 'recieved_payment', 'paid')}</td>
                        <td>{(calculateSubtotalForField(vouchers, 'payable_amount', null) +
                                calculateSubtotalForField(vouchers, 'advance_payment', null) +
                                calculateSubtotalForField(vouchers, 'calculated_fine', null) +
                                calculateSubtotalForField(vouchers, 'arrears', null)) - calculateSubtotalForField(vouchers, 'recieved_payment', 'paid')}</td>
                    </tr>
                ))}
        </React.Fragment>
    ))}

                                                                    {/* Grand Total */}
                                                                    <tr>
                                                                        <td colSpan="2" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>Grand Total</td>
                                                                        {feeHeadNames.map(head => (
                                                                            <React.Fragment key={`grand-${head}`}>
                                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                                    {calculateGrandTotalForHead(vouchers, head, null)}
                                                                                </td>
                                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                                    {calculateGrandTotalForHead(vouchers, head, 'paid')}
                                                                                </td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'bus_fee', null)}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'bus_fee', 'paid')}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'advance_payment', null)}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'advance_payment', 'paid')}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'arrears', null) - calculateGrandTotalForField(vouchers, 'arrears_fine', null)}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'arrears', 'paid') - calculateGrandTotalForField(vouchers, 'arrears_fine', 'paid')}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'arrears_fine', null)}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'arrears_fine', 'paid')}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'attendance_amount', null)}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'attendance_amount', 'paid')}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'calculated_fine', null)}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'payable_amount', null) + calculateGrandTotalForField(vouchers, 'calculated_fine', null) + calculateGrandTotalForField(vouchers, 'advance_payment', null) + calculateGrandTotalForField(vouchers, 'arrears', null)}</td>
                                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>{calculateGrandTotalForField(vouchers, 'recieved_payment', 'paid')}</td>
                                                                    </tr>
                                                                    <tr style={{ color: "rgb(0, 123, 255)" }}>
    <th>Total_Pending</th>
    <th>
        {
            (
                calculateGrandTotalForField(vouchers, 'payable_amount', null) +
                calculateGrandTotalForField(vouchers, 'calculated_fine', null) +
                calculateGrandTotalForField(vouchers, 'advance_payment', null) +
                calculateGrandTotalForField(vouchers, 'arrears', null)
            ) - calculateGrandTotalForField(vouchers, 'recieved_payment', 'paid')
        }
    </th>
    <th>B.Debits</th>
    <th>{calculateGrandTotalBadDebits(vouchers)}</th>
    <th>Pendency_Total</th>
    <th>
        {
            (
                (
                    calculateGrandTotalForField(vouchers, 'payable_amount', null) +
                    calculateGrandTotalForField(vouchers, 'calculated_fine', null) +
                    calculateGrandTotalForField(vouchers, 'advance_payment', null) +
                    calculateGrandTotalForField(vouchers, 'arrears', null)
                ) - calculateGrandTotalForField(vouchers, 'recieved_payment', 'paid')
            ) - calculateGrandTotalBadDebits(vouchers)
        }
    </th>
</tr>


                                                                    
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    );
                                                })
                                           
                                            )}
                                        </div>
                                    ) : editFormData.report_type_get === "Student Wise Headwise Report" ? (
                                    
                                    <div>
                                        {(() => {
                                            const allVouchers = Object.values(monthlyReports).flatMap(m => m.vouchers || []);
                                            const classOptions = [...new Set(allVouchers.map(v => v.class_name).filter(Boolean))].sort();
                                            const sectionOptions = [...new Set(allVouchers.map(v => v.section_name).filter(Boolean))].sort();
                                            const statusOptions = [...new Set(allVouchers.map(v => v.status).filter(Boolean))].sort();
                                            return (
                                                <div className="d-flex flex-wrap align-items-end mb-2" style={{ gap: '10px' }}>
                                                    <div>
                                                        <label className="frf-label">Class</label>
                                                        <select className="form-control form-control-sm" value={swClassFilter} onChange={(e) => setSwClassFilter(e.target.value)}>
                                                            <option value="">All Classes</option>
                                                            {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="frf-label">Section</label>
                                                        <select className="form-control form-control-sm" value={swSectionFilter} onChange={(e) => setSwSectionFilter(e.target.value)}>
                                                            <option value="">All Sections</option>
                                                            {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="frf-label">Status</label>
                                                        <select className="form-control form-control-sm" value={swStatusFilter} onChange={(e) => setSwStatusFilter(e.target.value)}>
                                                            <option value="">All Status</option>
                                                            {statusOptions.map(st => <option key={st} value={st} style={{ textTransform: 'capitalize' }}>{st}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        {loading ? (
                                            <p>Loading...</p>
                                        ) : (
                                     Object.entries(monthlyReports).map(([month, { vouchers: rawVouchers, feeHeadDetails }]) => {
                                    // Extract unique fee head names
                                    const feeHeadNames = [...new Set(feeHeadDetails.map(head => head.head_name))];

                                        // Apply inline class / section / status filters (used for rows and grand totals)
                                        const vouchers = applyStudentWiseFilters(rawVouchers);

                                        // Group vouchers by class_id
                                        const groupedByClass = vouchers.reduce((acc, voucher) => {
                                            if (!acc[voucher.class_id]) acc[voucher.class_id] = { class_name: voucher.class_name, students: [] };
                                            acc[voucher.class_id].students.push(voucher);
                                            return acc;
                                        }, {});

                                        let sr_no = 1;

                                        return (
                                            <div key={month} className="mb-4">
                                                <table border="1" data-sheet-name={month} className="p-0 table table-hover" style={{ borderTop: "0px" }}>
                                                <thead style={{ position: "sticky", top: "0", backgroundColor: "#f8f9fa", zIndex: "6" }}>

                                                        <tr>
                                                            <th className="frz sw-1">Sr#</th>
                                                            <th className="frz sw-2">Reg#</th>
                                                            <th className="frz sw-3">Name</th>
                                                            <th className="frz sw-4">Class</th>
                                                            <th className="frz sw-5">Section</th>
                                                            <th className="frz sw-6">Father</th>
                                                            <th className="frz sw-7">Category</th>
                                                            <th className="frz sw-8 frz-last">Phone No</th>
                                                            {feeHeadNames.map(head => (
                                                                <React.Fragment key={head}>
                                                                    <th>{head} Generated</th>
                                                                    <th>{head} Received</th>
                                                                </React.Fragment>
                                                            ))}
                                                            <th>Bus Fee Generated</th>
                                                            <th>Bus Fee Received</th>
                                                            <th>Advance Payment Generated</th>
                                                            <th>Advance Payment Received</th>
                                                            <th>Arrears Generated</th>
                                                            <th>Arrears Received</th>
                                                            <th>Arrears Fine Generated</th>
                                                            <th>Arrears Fine Received</th>
                                                            <th>Absent Fine Generated</th>
                                                            <th>Absent Fine Received</th>
                                                            <th>Fine Received</th>
                                                            <th>Status</th>
                                                            <th>Post Date</th>
                                                            <th>Total Fee Generated</th>
                                                            <th>Total Received Amount</th>
                                                            <th style={{"textAlign" : "center"}}>Arr.Months</th>
                                                            <th>Created</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(groupedByClass)
                                                            .sort(([classIdA], [classIdB]) => parseInt(classIdA) - parseInt(classIdB)) // Sort by class_id in ascending order
                                                            .map(([class_id, { class_name, students }]) => (
                                                                <React.Fragment key={class_id}>
                                                                    {students
                                                                        .sort((a, b) => a.section_name.localeCompare(b.section_name)) // Sort students by section name
                                                                        .map(voucher => (
                                                <tr key={voucher.student_id}>
                                                    <td className="frz sw-1">{sr_no++}</td>
                                                    <td className="frz sw-2">{voucher.register_no}</td>
                                                     <td className="frz sw-3" title={voucher.full_name}>{voucher.full_name}</td>
                                                    <td className="frz sw-4">{class_name}</td>
                                                    <td className="frz sw-5">{voucher.section_name}</td>
                                                    <td className="frz sw-6" title={voucher.father_name}>{voucher.father_name}</td>
                                                    <td className="frz sw-7">{voucher.category}</td>
                                                    <td className="frz sw-8 frz-last">{voucher.mobile_no}</td>

                                                    {feeHeadNames.map(head => {
                                                        const feeHeadData = voucher.fee_head.find(fh => fh.head_name === head);
                                                        return (
                                                            <React.Fragment key={`${voucher.student_id}-${head}`}>
                                                                <td>{feeHeadData?.amount || 0}</td>
                                                                {/* <td>{feeHeadData?.amount || 0}</td> */}
                                                                <td>{voucher.status === "paid" ? feeHeadData?.amount || 0 : 0}</td>

                                                            </React.Fragment>
                                                        );
                                                    })}
                                                    <td>{voucher.bus_fee || 0}</td>
                                                    <td>{voucher.status == "paid" ? voucher.bus_fee || 0 : 0}</td>
                                                    <td>{voucher.advance_payment || 0}</td>
                                                    <td>{voucher.status == "paid" ? (voucher.advance_payment) || 0 : 0}</td>
                                                    <td>{voucher.arrears - voucher.arrears_fine || 0}</td>
                                                    <td>{voucher.status == "paid" ? (voucher.arrears - voucher.arrears_fine) || 0 : 0}</td>
                                                    <td>{voucher.arrears_fine || 0}</td>
                                                    <td>{voucher.status == "paid" ? voucher.arrears_fine || 0 : 0}</td>
                                                    <td>{voucher.attendance_amount || 0}</td>
                                                    <td>{voucher.status == "paid" ? voucher.attendance_amount || 0 : 0}</td>
                                                    <td>{voucher.calculated_fine || 0}</td>
                                                    
                                                    <td>
                                                    {voucher.status === "paid" ? (
                                                        <b style={{ textTransform: "uppercase", color: "green" }}>
                                                            {voucher.status}
                                                        </b>
                                                    ) : (
                                                        <b style={{ textTransform: "uppercase", color: "red" }}>
                                                            {voucher.status}
                                                        </b>
                                                    )}
                                                   </td>
                                                    
                                                    <td>{voucher.payment_date || "-"}</td>
                                                    <td>
                                                        {(voucher.payable_amount || 0) +
                                                            (voucher.advance_payment || 0) +
                                                            (voucher.calculated_fine || 0) +
                                                            (voucher.arrears || 0)}
                                                    </td>
                                                    <td>{voucher.recieved_payment || 0}</td>
                                                    <td style={{"textAlign" : "center"}}>{(JSON.parse(voucher.arrears_not_cleared)).length || "-"}</td>
                                                    <td>{convertDates(voucher.created_at) || "-"}</td>
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                ))}

                            {/* Grand Total */}
                            <tr>
                                <td colSpan="8" className="frz frz-last" style={{ left: 0, zIndex: 4, fontWeight: 'bold', backgroundColor: '#f1f1f1', textAlign : "right" }}>Grand Total</td>
                                {feeHeadNames.map(head => (
                                    <React.Fragment key={`grand-${head}`}>
                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                            {vouchers.reduce(
                                                (sum, voucher) =>
                                                    sum +
                                                    (voucher.fee_head.find(fh => fh.head_name === head)?.amount || 0),
                                                0
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                            {vouchers.reduce((sum, voucher) => {
                                                // Only include the voucher if its status is "paid"
                                                if (voucher.status === 'paid') {
                                                    const fee = voucher.fee_head.find(fh => fh.head_name === head);
                                                    return sum + (fee ? fee.amount : 0);
                                                }
                                                return sum;
                                            }, 0)}
                                        </td>
                                    </React.Fragment>
                                ))}
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => sum + (voucher.bus_fee || 0), 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => {
                                    // Only include the voucher if its status is "paid"
                                    if (voucher.status === 'paid') {
                                        return sum + (voucher.bus_fee || 0);
                                    }
                                    return sum;
                                }, 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => sum + (voucher.advance_payment || 0), 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => {
                                    // Only include the voucher if its status is "paid"
                                    if (voucher.status === 'paid') {
                                        return sum + (voucher.advance_payment || 0);
                                    }
                                    return sum;
                                }, 0)}
                                </td>
                                {/* <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => sum + (voucher.arrears || 0), 0) - vouchers.reduce((sum, voucher) => sum + (voucher.arrears_fine || 0), 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => {
                                    // Only include the voucher if its status is "paid"
                                    if (voucher.status === 'paid') {
                                        return sum + (voucher.arrears || 0);
                                    }
                                    return sum;
                                }, 0)}
                                </td> */}
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                {vouchers.reduce((sum, voucher) => sum + (voucher.arrears || 0) - (voucher.arrears_fine || 0), 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                {vouchers.reduce((sum, voucher) => {
                                    // Only include the voucher if its status is "paid"
                                    if (voucher.status === 'paid') {
                                    return sum + ((voucher.arrears || 0) - (voucher.arrears_fine || 0));
                                    }
                                    return sum;
                                }, 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => sum + (voucher.arrears_fine || 0), 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => {
                                    // Only include the voucher if its status is "paid"
                                    if (voucher.status === 'paid') {
                                        return sum + (voucher.arrears_fine || 0);
                                    }
                                    return sum;
                                }, 0)}
                                </td>

                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => sum + (voucher.attendance_amount || 0), 0)}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => {
                                    // Only include the voucher if its status is "paid"
                                    if (voucher.status === 'paid') {
                                        return sum + (voucher.attendance_amount || 0);
                                    }
                                    return sum;
                                }, 0)}
                                </td>

                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => sum + (voucher.calculated_fine || 0), 0)}
                                </td>
                                <td>-</td>
                                <td>-</td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce(
                                        (sum, voucher) =>
                                            sum +
                                            (voucher.payable_amount || 0) +
                                            (voucher.advance_payment || 0) +
                                            (voucher.calculated_fine || 0) +
                                            (voucher.arrears || 0),
                                        0
                                    )}
                                </td>
                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                    {vouchers.reduce((sum, voucher) => sum + (voucher.recieved_payment || 0), 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        })
    )}
</div>

                                    
                                    ) : editFormData.report_type_get === "Pending vs Headwise Cross Match" ? (
                                        <div className=''>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : crossMatchData.length === 0 ? (
                                                <p className="text-success p-2" style={{ fontWeight: 600 }}>
                                                    No mismatches found — Pending Amounts match the unpaid Total Fee Generated.
                                                </p>
                                            ) : (
                                                <>
                                                    <table border="1" data-sheet-name="Cross Match" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                        <thead style={{ position: "sticky", top: "0", backgroundColor: "#f8f9fa", zIndex: "6" }}>
                                                            <tr>
                                                                <th>Sr#</th>
                                                                <th>Register#</th>
                                                                <th>Student Name</th>
                                                                <th>Class</th>
                                                                <th>Section</th>
                                                                <th>Category</th>
                                                                <th>Phone#</th>
                                                                <th>Pending Amount</th>
                                                                <th>Headwise Unpaid Total Generated</th>
                                                                <th>Difference</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {crossMatchData.map((row, idx) => (
                                                                <tr key={row.student_id}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{row.register_no}</td>
                                                                    <td title={row.full_name}>{row.full_name}</td>
                                                                    <td>{row.class_name}</td>
                                                                    <td>{row.section_name}</td>
                                                                    <td>{row.category}</td>
                                                                    <td>{row.mobile_no}</td>
                                                                    <td>{row.pending_total}</td>
                                                                    <td>{row.headwise_total}</td>
                                                                    <td style={{ fontWeight: 600, color: row.difference < 0 ? '#b00020' : '#1e7e45' }}>
                                                                        {row.difference}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="7" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', textAlign: 'right' }}>Grand Total</td>
                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                    {crossMatchData.reduce((sum, row) => sum + row.pending_total, 0)}
                                                                </td>
                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                    {crossMatchData.reduce((sum, row) => sum + row.headwise_total, 0)}
                                                                </td>
                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                    {crossMatchData.reduce((sum, row) => sum + row.difference, 0)}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                    <div className='pt-2 pb-2' style={{ fontSize: '13px', color: '#6c757d' }}>
                                                        Showing {crossMatchData.length} student(s) where Pending Amount differs from the unpaid Total Fee Generated for the selected month.
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    ) : editFormData.report_type_get === "Pendency vs Generated Difference" ? (
                                        <div className=''>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : crossMatchData.length === 0 ? (
                                                <p className="text-success p-2" style={{ fontWeight: 600 }}>
                                                    No differences found — total Pending Amount equals the selected month's Total Fee Generated for every student.
                                                </p>
                                            ) : (
                                                <>
                                                    <table border="1" data-sheet-name="Pendency vs Generated" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                        <thead style={{ position: "sticky", top: "0", backgroundColor: "#f8f9fa", zIndex: "6" }}>
                                                            <tr>
                                                                <th>Sr#</th>
                                                                <th>Register#</th>
                                                                <th>Student Name</th>
                                                                <th>Class</th>
                                                                <th>Section</th>
                                                                <th>Category</th>
                                                                <th>Phone#</th>
                                                                <th>Unpaid Months</th>
                                                                <th>Total Pending Amount</th>
                                                                <th>Generated ({editFormData.from_month})</th>
                                                                <th>Difference</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {crossMatchData.map((row, idx) => (
                                                                <tr key={row.student_id}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{row.register_no}</td>
                                                                    <td title={row.full_name}>{row.full_name}</td>
                                                                    <td>{row.class_name}</td>
                                                                    <td>{row.section_name}</td>
                                                                    <td>{row.category}</td>
                                                                    <td>{row.mobile_no}</td>
                                                                    <td style={{ textAlign: 'center' }}>{row.unpaid_months || '-'}</td>
                                                                    <td>{row.pending_total}</td>
                                                                    <td>{row.headwise_total}</td>
                                                                    <td style={{ fontWeight: 600, color: row.difference < 0 ? '#b00020' : '#1e7e45' }}>
                                                                        {row.difference}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr>
                                                                <td colSpan="8" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', textAlign: 'right' }}>Grand Total</td>
                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                    {crossMatchData.reduce((sum, row) => sum + row.pending_total, 0)}
                                                                </td>
                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                    {crossMatchData.reduce((sum, row) => sum + row.headwise_total, 0)}
                                                                </td>
                                                                <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(206, 206, 206)' }}>
                                                                    {crossMatchData.reduce((sum, row) => sum + row.difference, 0)}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                    <div className='pt-2 pb-2' style={{ fontSize: '13px', color: '#6c757d' }}>
                                                        Showing {crossMatchData.length} student(s) where the total Pending Amount (all unpaid months) differs from the Total Fee Generated for {editFormData.from_month}. A positive difference usually means prior unpaid months were not fully carried forward as arrears into the selected month's voucher.
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    ) : editFormData.report_type_get === "Fee Not Generated Report" ? (
                                        <div className=''>
                                            <div className='d-flex justify-content-end mb-1'>
                                                <input
                                                    type="text"
                                                    className='form-control col-md-3'
                                                    value={editFormData.search_frontend}
                                                    onChange={(e) => setEditFormData({ ...editFormData, search_frontend: e.target.value })}
                                                    placeholder='Search by name / reg# / class............'
                                                />
                                            </div>
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : filteredVouchers.length === 0 ? (
                                                <p className="text-success p-2" style={{ fontWeight: 600 }}>
                                                    No students found — fee is generated for every active student in the selected month.
                                                </p>
                                            ) : (
                                                <>
                                                    <table border="1" data-sheet-name="Fee Not Generated" className='p-0 table table-hover' style={{ borderTop: "0px" }}>
                                                        <thead style={{ position: "sticky", top: "0", backgroundColor: "#f8f9fa", zIndex: "6" }}>
                                                            <tr>
                                                                <th>Sr#</th>
                                                                <th>Register#</th>
                                                                <th>Student Name</th>
                                                                <th>Class</th>
                                                                <th>Section</th>
                                                                <th>Category</th>
                                                                <th>Father</th>
                                                                <th>Phone#</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredVouchers.map((student, idx) => (
                                                                <tr key={student.student_id}>
                                                                    <td>{idx + 1}</td>
                                                                    <td>{student.register_no}</td>
                                                                    <td title={student.full_name}>{student.full_name}</td>
                                                                    <td>{student.class_name}</td>
                                                                    <td>{student.section_name}</td>
                                                                    <td>{student.category}</td>
                                                                    <td title={student.father_name}>{student.father_name}</td>
                                                                    <td>{student.father_mobile_no || student.mobile_no}</td>
                                                                    <td>{student.status}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className='pt-2 pb-2' style={{ fontSize: '13px', color: '#6c757d' }}>
                                                        Showing {filteredVouchers.length} active student(s) with no fee voucher generated for the selected month.
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    ) : editFormData.report_type_get === "Pendency Report" ? (
                                        <div className=''>
                                            {/* <div className='d-flex justify-content-end'>
                                            <input
                                                    type="text"
                                                    className='form-control col-md-3 mb-1'
                                                    value={editFormData.search_frontend}
                                                    onChange={(e) => setEditFormData({ ...editFormData, search_frontend: e.target.value })}
                                                    placeholder='Search............'
                                                />
                                            </div> */}

                                            <div className='d-flex justify-content-end gap-2 mb-1'>

    {/* Class Filter */}
    {/* <select
        className='form-control col-md-2 mr-2'
        value={editFormData.filter_class || ""}
        onChange={(e) => setEditFormData({ ...editFormData, filter_class: e.target.value })}
    >
        <option value="">All Classes</option>
        {[...new Set(scrollVouchers.map(v => v.class_name))].map(cls => (
            <option key={cls} value={cls}>{cls}</option>
        ))}
    </select> */}


    <select
        className='form-control col-md-2 mr-2'
        value={editFormData.filter_section || ""}
        onChange={(e) => setEditFormData({ ...editFormData, filter_section: e.target.value })}
    >
        <option value="">All Classes</option>
        {[...new Set(scrollVouchers.map(v => v.section_name))].map(sec => (
            <option key={sec} value={sec}>{sec}</option>
        ))}
    </select>

    {/* Category Filter */}
    <select
        className='form-control col-md-2 mr-2'
        value={editFormData.filter_category || ""}
        onChange={(e) => setEditFormData({ ...editFormData, filter_category: e.target.value })}
    >
        <option value="">All Categories</option>
        {[...new Set(scrollVouchers.map(v => v.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
        ))}
    </select>

    {/* Name Search */}
    <input
        type="text"
        className='form-control col-md-3 mr-2'
        value={editFormData.search_frontend}
        onChange={(e) => setEditFormData({ ...editFormData, search_frontend: e.target.value })}
        placeholder='Search by name............'
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
                                                    {hoveredVoucher.months}
                                                </div>
                                            )}


                                            <div className='pt-3 pb-3' style={{ "fontSize": "15px" }}>
                                                <b className='p-2 text-danger' style={{ "border": "1px solid black" }} ><label htmlFor="" >Grand Total: </label> {filteredVouchers.reduce((total, voucher) => total + voucher.payable_amount_after_due_date, 0)}</b>
                                            </div>

                                        </div>


                                    ) : editFormData.report_type_get === "Bad Debits Report" ? (
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
                                                    {hoveredVoucher.months}
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
                                                <thead style={{ position: "sticky", top: "0", zIndex: 6 }}>
                                                    <tr>
                                                        <th className="frz dw-1">Sr.No</th>
                                                        <th className="frz dw-2">Invoice#</th>
                                                        <th className="frz dw-3">Rg#</th>
                                                        <th className="frz dw-4">Name</th>
                                                        <th className="frz dw-5">Class</th>
                                                        <th className="frz dw-6 frz-last">Section</th>
                                                        <th>Month</th>
                                                        <th>Due.Date</th>
                                                        <th>Post.Date</th>

                                                        <th style={{ 'backgroundColor': '#e8e8e8' }}>Reciev.Amount</th>
                                                        <th>Status</th>
                                                        {/* <th className='text-center'>View</th> */}

                                                        <th className='text-center'>Unpost</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {(
                                                        filteredVouchers
                                                        .filter(voucher => voucher.recieved_payment !== null)
                                                        .map((voucher, index) => (
                                                            <tr key={index}>
                                                            <td className="frz dw-1">{index + 1}</td>
                                                            <td className="frz dw-2">{voucher.invoice_no}</td>
                                                            <td className="frz dw-3">{voucher.register_no === "" ? voucher.old_register_no : voucher.register_no}</td>
                                                            <td className="frz dw-4" title={voucher.full_name}>{voucher.full_name}</td>
                                                            <td className="frz dw-5">{voucher.class}</td>
                                                            <td className="frz dw-6 frz-last">{voucher.section_name}</td>
                                                            <td>{voucher.for_the_month}</td>
                                                            <td>{convertDates(voucher.due_date)}</td>
                                                            <td>{convertDates(voucher.payment_date)}</td>
                                                            <td style={{ backgroundColor: "#e8e8e8" }}>
                                                                <span style={{ color: voucher.recieved_payment === 0 ? "red" : "black" }}>
                                                                {voucher.recieved_payment === 0 ? "Arrears" : voucher.recieved_payment}
                                                                </span>
                                                            </td>
                                                            <td style={{ color: voucher.status === "unpaid" ? "red" : "green" }}>
                                                                {voucher.status.toUpperCase()}
                                                            </td>
                                                            <td className="text-center">
                                                                <div>
                                                                <a
                                                                    href="#"
                                                                    className="btn btn-warning btn-sm"
                                                                    onClick={() => {
                                                                    const arrears =
                                                                        typeof voucher.arrears_not_cleared === "string"
                                                                        ? JSON.parse(voucher.arrears_not_cleared)
                                                                        : voucher.arrears_not_cleared;
                                                                    unpostData(
                                                                        voucher.id + (arrears?.length ? "," + arrears.join(",") : ""),
                                                                        voucher.full_name
                                                                    );
                                                                    }}
                                                                >
                                                                    <i className="fas fa-undo"></i>
                                                                </a>
                                                                </div>
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
                                                    {/* <th>Due Date</th> */}
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
                                                                {/* <td>{convertDates(voucher.due_date)}</td> */}
                                                                <td>{voucher.total_amount}</td>
                                                            </tr>
                                                        ))}
                                                        <tr>
                                                            <td colSpan="5" className="text-right"><strong>Subtotal:</strong></td>
                                                            <td>
                                                                <strong>{subtotal}</strong>
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                                <tr>
                                                    <td colSpan="5" className="text-right"><strong>Grand Total:</strong></td>
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
                                                            <td>{voucher.class + " (" + voucher.section_name +")"}</td>
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

                                    ) : editFormData.report_type_get === "Class Wise Voucher Summary Report" ? (
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
                                                        <th>T.Student</th>
                                                        <th>Total Generated Voucher</th>
                                                        <th>Total Paid Voucher</th>
                                                        <th>Total Unpaid Voucher</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((voucher, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{voucher.class}</td>
                                                            <td>{voucher.total_students}</td>
                                                            <td>{voucher.total_generated_voucher}</td>
                                                            <td>{voucher.total_paid_voucher}</td>
                                                            <td>{voucher.total_unpaid_voucher}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="2" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_students, 0)}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_generated_voucher, 0)}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_paid_voucher, 0)}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.total_unpaid_voucher, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) :  editFormData.report_type_get === "Bus Fee Report" ? (
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
                                                        <th>Category</th>
                                                        <th>Bus.Fee</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredVouchers.map((voucher, index) => (
                                                        <tr key={index}>
                                                              <td>{index+1}</td>
                                                            <td>{voucher.class}</td>
                                                            <td>{voucher.category}</td>
                                                            <td>{voucher.sum_of_bus_fee}</td>
                                                        </tr>
                                                    ))}
                                                    <tr>
                                                        <td colSpan="3" className="text-right"><strong>Grand Total:</strong></td>
                                                        <td>
                                                            <strong>
                                                                {filteredVouchers.reduce((total, voucher) => total + voucher.sum_of_bus_fee, 0)}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    ) : null}
                                </div>
                            </div>
                            </>
                        )}
                    </div>
                   <style>{`
    .table-wrapper {
        overflow-x: auto;
        max-height: 75vh;
        overflow-y: auto;
        border: 1px solid #dee2e6;
    }

    .sticky-col-1 {
        position: sticky;
        left: 0;
        z-index: 2;
        background-color: #f8f9fa;
        min-width: 120px;
    }

    .sticky-col-2 {
        position: sticky;
        left: 120px;
        z-index: 2;
        background-color: #f8f9fa;
        min-width: 100px;
    }

    thead .sticky-col-1,
    thead .sticky-col-2 {
        z-index: 4;
    }

    /* ---- Professional fee-report table theme ---- */
    .fee-report-modal-body table.table {
        font-size: 0.82rem;
        margin-bottom: 1.25rem;
        border-color: #e3e6eb;
    }

    .fee-report-modal-body table.table thead th {
        background: #EBD197 !important;
        color: #1f2329 !important;
        font-weight: 600;
        text-transform: capitalize;
        white-space: nowrap;
        vertical-align: middle;
        border-color: #2c313a !important;
        padding: 8px 10px;
    }

    .fee-report-modal-body table.table tbody td {
        vertical-align: middle;
        padding: 6px 10px;
        border-color: #eef0f3;
    }

    .fee-report-modal-body table.table tbody tr:nth-of-type(odd) {
        background-color: #fafbfc;
    }

    .fee-report-modal-body table.table tbody tr:hover {
        background-color: #fbf4e3;
    }

    /* Grand total / summary rows */
    .fee-report-modal-body table.table tbody tr:last-child td {
        background-color: #f1f3f5;
        border-top: 2px solid #EBD197;
        font-weight: 600;
    }

    .fee-report-modal-body table.table .sticky-col-1,
    .fee-report-modal-body table.table .sticky-col-2 {
        background-color: #ffffff;
    }

    .fee-report-modal-body table.table thead .sticky-col-1,
    .fee-report-modal-body table.table thead .sticky-col-2 {
        background:  #EBD197 !important;
        color: #1f2329 !important;
    }

    /* ---- Left-frozen identity columns ---- */
    .fee-report-modal-body table.table th.frz,
    .fee-report-modal-body table.table td.frz {
        position: sticky;
        z-index: 3;
        background-color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    /* keep zebra/hover/total backgrounds on frozen body cells */
    .fee-report-modal-body table.table tbody tr:nth-of-type(odd) td.frz {
        background-color: #fafbfc;
    }
    .fee-report-modal-body table.table tbody tr:hover td.frz {
        background-color: #fbf4e3;
    }
    .fee-report-modal-body table.table tbody tr:last-child td.frz {
        background-color: #f1f3f5;
    }
    /* frozen header cells sit above everything */
    .fee-report-modal-body table.table thead th.frz {
        background: #EBD197 !important;
        color: #1f2329 !important;
        z-index: 7;
    }
    /* shadow on the last frozen column to separate it from scrolling content */
    .fee-report-modal-body table.table .frz-last {
        box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.18);
    }

    /* Student Wise Headwise Report: Sr#, Reg#, Name, Class, Section, Father, Category, Phone No */
    .fee-report-modal-body table.table .sw-1 { left: 0;     min-width: 50px;  max-width: 50px;  }
    .fee-report-modal-body table.table .sw-2 { left: 50px;  min-width: 75px;  max-width: 75px;  }
    .fee-report-modal-body table.table .sw-3 { left: 125px; min-width: 150px; max-width: 150px; }
    .fee-report-modal-body table.table .sw-4 { left: 275px; min-width: 75px;  max-width: 75px;  }
    .fee-report-modal-body table.table .sw-5 { left: 350px; min-width: 85px;  max-width: 85px;  }
    .fee-report-modal-body table.table .sw-6 { left: 435px; min-width: 140px; max-width: 140px; }
    .fee-report-modal-body table.table .sw-7 { left: 575px; min-width: 95px;  max-width: 95px;  }
    .fee-report-modal-body table.table .sw-8 { left: 670px; min-width: 110px; max-width: 110px; }

    /* ---- Professional filter bar ---- */
    .fee-report-filters {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 12px 14px;
    }
    .fee-report-filters > div[class*="col-"] {
        flex: 0 0 210px;
        max-width: 210px;
        width: 210px;
        margin: 0;
        padding: 0;
    }
    .fee-report-filters .frf-label {
        display: block;
        margin-bottom: 4px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        color: #6c757d;
    }
    .fee-report-filters .form-control {
        height: 38px;
        border-color: #d9dde3;
    }
    .fee-report-filters .form-control:focus {
        border-color: #EBD197;
        box-shadow: 0 0 0 0.15rem rgba(235, 209, 151, 0.45);
    }
    /* align react-select height with native controls */
    .fee-report-filters [class*="-control"] {
        min-height: 38px;
        border-color: #d9dde3;
    }
    /* action buttons grouped to the right, aligned to input baseline */
    .fee-report-filters .frf-actions {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        margin-left: auto;
    }
    .fee-report-filters .frf-actions .btn {
        height: 38px;
        display: inline-flex;
        align-items: center;
    }
    @media (max-width: 768px) {
        .fee-report-filters > div[class*="col-"] {
            flex: 1 1 100%;
            max-width: 100%;
            width: 100%;
        }
        .fee-report-filters .frf-actions {
            margin-left: 0;
            width: 100%;
        }
        .fee-report-filters .frf-actions .btn {
            flex: 1 1 auto;
            justify-content: center;
        }
    }

    /* Datewise Posting Report: Sr.No, Invoice#, Rg#, Name, Class, Section */
    .fee-report-modal-body table.table .dw-1 { left: 0;     min-width: 55px;  max-width: 55px;  }
    .fee-report-modal-body table.table .dw-2 { left: 55px;  min-width: 90px;  max-width: 90px;  }
    .fee-report-modal-body table.table .dw-3 { left: 145px; min-width: 80px;  max-width: 80px;  }
    .fee-report-modal-body table.table .dw-4 { left: 225px; min-width: 150px; max-width: 150px; }
    .fee-report-modal-body table.table .dw-5 { left: 375px; min-width: 80px;  max-width: 80px;  }
    .fee-report-modal-body table.table .dw-6 { left: 455px; min-width: 90px;  max-width: 90px;  }
`}</style>

                </div>
            </div>
        </div >
    );
};

export default FeeReports;
