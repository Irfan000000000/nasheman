



import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useAuth } from './AuthContext';
import AcademicSessionContext from './AcademicSessionContext';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function SchoolSalaryList() {
    const ITEMS_PER_PAGE = 10; // Items to display per page
    const [data, setData] = useState([]); // All data fetched from the server
    const [salaryReport, getSalaryReport] = useState([]); // All data fetched from the server

    const [excelSalaryReport, getExcelSalaryReport] = useState([]); // All data fetched from the server

    const [showReport, setShowReport] = useState(false);
   
    const [viewSalaryReport, getViewSalaryReport] = useState([]); // All data fetched from the server
    const [reportSearchQuery, setReportSearchQuery] = useState(''); // New search query state for modal

    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [searchQuery, setSearchQuery] = useState(''); // Search query
    const [checkedVouchers, setCheckedVouchers] = useState([]); // List of checked vouchers
    const [allChecked, setAllChecked] = useState(false); // All items selected or not
    const navigate = useNavigate();

    const { user } = useAuth(); // Authentication context
    const { academicSession } = useContext(AcademicSessionContext); // Session context

    const [editFormData, setEditFormData] = useState({
        for_the_month: '',
        campus_id: user.user.campus_id,
    });

    // Fetch all data from the server
    const fetchData = () => {
        axios
            .get(process.env.REACT_APP_API_BASE_URL+'/school-salary-list', {
                params: {
                    for_the_month: editFormData.for_the_month,
                    campus_id: editFormData.campus_id,
                },
            })
            .then((res) => {
                setData(res.data.results); // Set all data at once
                setCheckedVouchers([]); // Reset checked vouchers
                setAllChecked(false); // Uncheck the "select all" checkbox
            })
            .catch((err) => console.log(err));
    };

    // Fetch salary report data
    const viewReport = () => {
                axios
                    .get(process.env.REACT_APP_API_BASE_URL+'/get-salary-report', {
                        params: {
                            for_the_month: editFormData.for_the_month,
                            campus_id: editFormData.campus_id,
                        }
                    })
                    .then((res) => {
                        getSalaryReport(res.data.results);
                        setShowReport(true);
                    })
                    .catch((err) => console.log(err));
            };

    // Export data to Excel with calculated totals
    const exportToExcel = () => {
        // Fetch the salary report data
        axios.get(process.env.REACT_APP_API_BASE_URL+'/get-salary-report', {
            params: {
                for_the_month: editFormData.for_the_month,
                campus_id: editFormData.campus_id,
            }
        })
        .then((res) => {
            // Log and store the fetched report data
            console.log(res.data);
            const excelSalaryReport = res.data.results;
    
            // Calculate totals for each numeric field
            const totals = {
                basic_salary: 0,
                additional_increments: 0,
                house_rent: 0,
                second_shift_honorarium: 0,
                previous_increments: 0,
                current_increment: 0,
                total_increments: 0,
                previous_adhoc: 0,
                current_adhoc: 0,
                total_adhoc: 0,
                security_deduct: 0,
                total_security_deduct: 0,
                loan_deduct: 0,
                total_loan_deduct: 0,
                graduity: 0,
                others_allownce: 0,
                other_deduction: 0,
                dow: 0,
                overtime_amount: 0,
                net_salary: 0,
                income_tax: 0,
                rebate: 0,
                pessi: 0,
                eobi: 0,
                cpf: 0,
                bus_charges:0,
                medical_allownce:0,
                principal_allownce:0,
                special_allownce:0,
                remaining: 0,
              
            };
    
            // Update totals based on the report data
            excelSalaryReport.forEach(item => {
                totals.basic_salary += parseFloat(item.basic_salary || 0);
                totals.additional_increments += parseFloat(item.additional_increments || 0);
                totals.house_rent += parseFloat(item.house_rent || 0);
                totals.second_shift_honorarium += parseFloat(item.second_shift_honorarium || 0);
                totals.previous_increments += parseFloat(item.previous_increments || 0);
                totals.current_increment += parseFloat(item.current_increment || 0);
                totals.total_increments += parseFloat(item.total_increments || 0);
                totals.previous_adhoc += parseFloat(item.previous_adhoc || 0);
                totals.current_adhoc += parseFloat(item.current_adhoc || 0);
                totals.total_adhoc += parseFloat(item.total_adhoc || 0);
               
                totals.net_salary += parseFloat(item.net_salary + item.eobi + item.cpf || 0);
                totals.security_deduct += parseFloat(item.security_deduct || 0);
                totals.total_security_deduct += parseFloat(item.total_security_deduct || 0);
                totals.loan_deduct += parseFloat(item.loan_deduct || 0);
                totals.total_loan_deduct += parseFloat(item.total_loan_deduct || 0);
                totals.graduity += parseFloat(item.graduity || 0);
                totals.others_allownce += parseFloat(item.others_allownce || 0);
                totals.other_deduction += parseFloat(item.other_deduction || 0);
                totals.dow += parseFloat(item.dow || 0);
                totals.overtime_amount += parseFloat(item.overtime_amount || 0);
                totals.income_tax += parseFloat(item.income_tax || 0);
                totals.rebate += parseFloat(item.rebate || 0);
                totals.pessi += parseFloat(item.pessi || 0);
                totals.eobi += parseFloat(item.eobi || 0);
                totals.cpf += parseFloat(item.cpf || 0);
                totals.bus_charges += parseFloat(item.bus_charges || 0);

                totals.medical_allownce += parseFloat(item.medical_allownce || 0);
                totals.principal_allownce += parseFloat(item.principal_allownce || 0);
                totals.special_allownce += parseFloat(item.special_allownce || 0);

                totals.remaining += parseFloat(item.remaining || 0);
              
            });
    
            // Create a worksheet from the salary report data
            const worksheetData = excelSalaryReport.map(item => ({
                Invoice_No: item.invoice_no,
                Name: item.full_name,
                Post: item.employee_post,
                Role: item.employee_role,
                Pay_Scale: `${item.pay_scale} (${item.job_type})`,
                Month: item.for_the_month,
                Basic_Salary: item.basic_salary,
                Additional_Increments: item.additional_increments,
                House_Rent: item.house_rent,
                Second_Shift_Honorarium: item.second_shift_honorarium,
                Previous_Increments: item.previous_increments,
                Current_Increment: item.current_increment,
                Total_Increments: item.total_increments,
                Previous_Adhoc: item.previous_adhoc,
                Current_Adhoc: item.current_adhoc,
                Total_Adhoc: item.total_adhoc,
                Net_Salary: item.net_salary + item.eobi + item.cpf,
                Security_Deduct: item.security_deduct,
                Total_Security_Deduct: item.total_security_deduct,
                Loan_Deduction: item.loan_deduct,
                Total_Loan_Deduct: item.total_loan_deduct,
                Graduity: item.graduity,
                others_allownce: item.others_allownce,
                other_deduction: item.other_deduction,
                DOW: item.dow,
                overtime_amount: item.overtime_amount,
                Income_Tax: item.income_tax,
                Rebate: item.rebate,
                Pessi: item.pessi,
                EOBI: item.eobi,
                cpf: item.cpf,
                Bus: item.bus_charges,
                medical_allownce: item.medical_allownce,
                principal_allownce: item.principal_allownce,
                special_allownce: item.special_allownce,
                Remaining: item.remaining
               
            }));
    
            // Add totals row at the end of the worksheet
            worksheetData.push({
                Invoice_No: 'Totals',
                Name: '',
                Post: '',
                Role: '',
                Pay_Scale: '',
                Month: '',
                Basic_Salary: totals.basic_salary,
                Additional_Increments: totals.additional_increments,
                House_Rent: totals.house_rent,
                Second_Shift_Honorarium: totals.second_shift_honorarium,
                Previous_Increments: totals.previous_increments,
                Current_Increment: totals.current_increment,
                Total_Increments: totals.total_increments,
                Previous_Adhoc: totals.previous_adhoc,
                Current_Adhoc: totals.current_adhoc,
                Total_Adhoc: totals.total_adhoc,
               
                Net_Salary: totals.net_salary + totals.eobi + totals.cpf,
                Security_Deduct: totals.security_deduct,
                Total_Security_Deduct: totals.total_security_deduct,
                Loan_Deduction: totals.loan_deduct,
                Total_Loan_Deduct: totals.total_loan_deduct,
                Graduity: totals.graduity,
                others_allownce: totals.others_allownce,
                other_deduction: totals.other_deduction,
                DOW: totals.dow,
                overtime_amount: totals.overtime_amount,
                Income_Tax: totals.income_tax,
                Rebate: totals.rebate,
                Pessi: totals.pessi,
                EOBI: totals.eobi,
                cpf: totals.cpf,
                cpf: totals.bus_charges,
                medical_allownce: totals.medical_allownce,
                principal_allownce: totals.principal_allownce,
                special_allownce: totals.special_allownce,
                Remaining: totals.remaining
              
            });
    
            // Create a new workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Salary Report');
    
            // Export the workbook as an Excel file
            XLSX.writeFile(workbook, `Salary_Report_${editFormData.for_the_month}.xlsx`);
        })
        .catch((err) => {
            console.log(err);
            alert('Error fetching salary report data.');
        });
    };
    

    // Handle print function for selected vouchers
    const handlePrint = () => {
        navigate('/view-salary-slips', { state: { voucherIds: checkedVouchers, for_the_month: editFormData.for_the_month } });
        console.log('Sending data to server:', checkedVouchers);
    };

    // Handle page change for pagination
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Handle search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Delete function to remove record
    const deleteData = (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            axios
                .delete(process.env.REACT_APP_API_BASE_URL+`/delete-employee-salary/${id}`)
                .then((response) => {
                    console.log('Deleted successfully:', response.data);
                    setData((prevData) => prevData.filter((voucher) => voucher.id !== id));
                })
                .catch((error) => {
                    console.error('Error deleting item:', error);
                });
        }
    };

    // Handle checkbox toggle for individual rows
    const handleCheckboxChange = (id) => {
        setCheckedVouchers((prevState) =>
            prevState.includes(id) ? prevState.filter((voucherId) => voucherId !== id) : [...prevState, id]
        );
    };

    // Handle "select all" checkbox
    const handleToggleAll = () => {
        if (allChecked) {
            setCheckedVouchers([]); // Uncheck all
        } else {
            const allIds = filteredData.map((voucher) => voucher.id);
            setCheckedVouchers(allIds); // Check all
        }
        setAllChecked(!allChecked);
    };

    // Filter data based on search query
    const filteredData = data.filter((item) => {
        return (
            item.full_name.toLowerCase().includes(searchQuery) ||
            item.employee_post.toLowerCase().includes(searchQuery) ||
            item.pay_scale.toString().includes(searchQuery) ||
            item.employee_role.toLowerCase().includes(searchQuery) ||
            item.invoice_no.toString().includes(searchQuery)
        );
    });

    // Determine the data to display on the current page
    const displayData = filteredData.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );


    const filteredReportData = salaryReport.filter((item) =>
                item.full_name.toLowerCase().includes(reportSearchQuery) ||
                item.employee_post.toLowerCase().includes(reportSearchQuery) ||
                item.invoice_no.toString().includes(reportSearchQuery)
            );



            
    const calculateTotals = (reportData) => {
        const totals = {
            basic_salary: 0,
            additional_increments: 0,
            house_rent: 0,
            second_shift_honorarium: 0,
            previous_increments: 0,
            current_increment: 0,
            total_increments: 0,
            previous_adhoc: 0,
            current_adhoc: 0,
            total_adhoc: 0,
            security_deduct: 0,
            total_security_deduct: 0,
            loan_deduct: 0,
            total_loan_deduct: 0,
            graduity: 0,
            others_allownce: 0,
            other_deduction: 0,
            dow: 0,
            overtime_amount: 0,
            net_salary: 0,
            income_tax: 0,
            rebate: 0,
            pessi: 0,
            eobi: 0,
            cpf:0,
            bus_charges:0,
            medical_allownce:0,
            principal_allownce:0,
            special_allownce:0,
            remaining: 0
        };

        reportData.forEach(item => {
            totals.basic_salary += parseFloat(item.basic_salary || 0);
            totals.additional_increments += parseFloat(item.additional_increments || 0);
            totals.house_rent += parseFloat(item.house_rent || 0);
            totals.second_shift_honorarium += parseFloat(item.second_shift_honorarium || 0);
            totals.previous_increments += parseFloat(item.previous_increments || 0);
            totals.current_increment += parseFloat(item.current_increment || 0);
            totals.total_increments += parseFloat(item.total_increments || 0);
            totals.previous_adhoc += parseFloat(item.previous_adhoc || 0);
            totals.current_adhoc += parseFloat(item.current_adhoc || 0);
            totals.total_adhoc += parseFloat(item.total_adhoc || 0);
            totals.security_deduct += parseFloat(item.security_deduct || 0);
            totals.total_security_deduct += parseFloat(item.total_security_deduct || 0);
            totals.loan_deduct += parseFloat(item.loan_deduct || 0);
            totals.total_loan_deduct += parseFloat(item.total_loan_deduct || 0);
            totals.graduity += parseFloat(item.graduity || 0);
            totals.others_allownce += parseFloat(item.others_allownce || 0);
            totals.other_deduction += parseFloat(item.other_deduction || 0);
            totals.dow += parseFloat(item.dow || 0);
            totals.overtime_amount += parseFloat(item.overtime_amount || 0);
            totals.net_salary += parseFloat(item.net_salary + item.eobi + item.cpf || 0);
            totals.income_tax += parseFloat(item.income_tax || 0);
            totals.rebate += parseFloat(item.rebate || 0);
            totals.pessi += parseFloat(item.pessi || 0);
            totals.eobi += parseFloat(item.eobi || 0);
            totals.cpf += parseFloat(item.cpf || 0);
            totals.bus_charges += parseFloat(item.bus_charges || 0);
            totals.medical_allownce += parseFloat(item.medical_allownce || 0);
            totals.principal_allownce += parseFloat(item.principal_allownce || 0);
            totals.special_allownce += parseFloat(item.special_allownce || 0);
            totals.remaining += parseFloat(item.remaining || 0);
        });

        return totals;
    };



    // Grand totals for modal display
    const grandTotals = calculateTotals(salaryReport);
        

    return (
        <>
            <div className="d-flex">
                <div className="col-md-12 p-2">
                    <div className="card-header text-warning bg-primary p-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <i className="fas fa-list"></i> Salary Detail
                            </div>

                            <div className="d-flex justify-content-center" style={{ marginRight: "0px" }}>
                                <div className="me-2 mr-2">
                                    <input
                                        type="month"
                                        name="for_the_month"
                                        value={editFormData.for_the_month}
                                        onChange={(e) => setEditFormData({ ...editFormData, for_the_month: e.target.value })}
                                        className="form-control"
                                    />
                                </div>

                                <div className="me-2 mr-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                        onChange={handleSearch}
                                        value={searchQuery}
                                    />
                                </div>
                                <button className='btn btn-sm btn-warning mr-2' onClick={fetchData}>Search</button>

                                <button className='btn btn-sm btn-danger mr-2' onClick={viewReport}>View Report</button>

                                <button className='btn btn-sm btn-success mr-2' onClick={exportToExcel}>Export to Excel</button>
                            </div>
                        </div>
                    </div>

                    <div className="border p-2">
                        <div className="d-flex justify-content-between pb-1">
                            <div className="d-flex">
                                <button onClick={handleToggleAll} className="mr-2 btn btn-warning btn-sm">
                                    {allChecked ? <i className="far fa-check-square"></i> : <i className="far fa-square"></i>}
                                </button>
                                <button onClick={handlePrint} className="btn btn-warning btn-sm">
                                    <i className="fa fa-print" aria-hidden="true"></i> Print
                                </button>
                            </div>
                        </div>

                        <table className="table m-0">
                            <thead>
                                <tr>
                                    <th>Check</th> {/* Added checkbox column */}
                                    <th>Invoice#</th>
                                    <th>Name</th>
                                    <th>Post</th>
                                    <th>Scale</th>
                                    <th>Role</th>
                                    <th>Month</th>
                                    <th>Basic Salary</th>
                                    {/* <th>Net Salary</th> */}
                                    <th>Net Salary</th>
                                    <th className='text-center'>Actions</th> {/* New column for delete action */}
                                </tr>
                            </thead>
                            <tbody>
                                {displayData.map((voucher, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={checkedVouchers.includes(voucher.id)}
                                                onChange={() => handleCheckboxChange(voucher.id)}
                                            />
                                        </td>
                                        <td>{voucher.invoice_no}</td>
                                        <td>{voucher.full_name}</td>
                                        <td>{voucher.employee_post}</td>
                                        <td>{voucher.pay_scale + '(' + voucher.job_type + ')'}</td>
                                        <td>{voucher.employee_role}</td>
                                        <td>{voucher.for_the_month}</td>
                                        <td>{voucher.basic_salary}</td>
                                        {/* <td>{voucher.net_salary}</td> */}
                                        <td>{voucher.remaining}</td>
                                        <td className='text-center'>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteData(voucher.id)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={Math.ceil(filteredData.length / ITEMS_PER_PAGE)} // Calculate total pages based on filtered data
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            breakClassName={'page-item'}
                            breakLinkClassName={'page-link'}
                            activeClassName={'active'}
                        />
                    </div>


                    {showReport && (
    <>
        {/* Modal Overlay */}
        <div className="modal-overlay" onClick={() => setShowReport(false)} style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            zIndex: 999 
        }} />

        {/* Salary Report */}
        <div className="salary-report mt-4 p-3 border" 
             style={{ 
                 position: 'fixed', 
                 top: '50%', 
                 left: '50%', 
                 transform: 'translate(-50%, -50%)', 
                 width: '90%', 
                 maxWidth: '1800px', 
                 maxHeight: '90vh', 
                 overflow: 'hidden',  // Prevent the whole modal from scrolling
                 backgroundColor: '#fff', 
                 zIndex: 1000, 
                 borderRadius: '10px', 
                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                 textAlign: 'left',
                 display: 'flex',
                 flexDirection: 'column'
             }}
        >
            {/* Close Button */}
            <button 
                className="close-btn" 
                onClick={() => setShowReport(false)} 
                style={{ 
                    position: 'absolute', 
                    top: '16px', 
                    right: '20px', 
                    background: 'transparent', 
                    border: 'none', 
                    fontSize: '24px', 
                    cursor: 'pointer', 
                    color: '#ffc107' 
                }}>
                &times;
            </button>

            {/* Modal Title */}
            <h5 style={{ 
                backgroundColor: "#007bff", 
                color: "#ffc107", 
                textAlign: "left", 
                padding: "8px", 
                margin: "0", 
                width: "100%" 
            }}>
                Grand Salary Report
            </h5>
            <div
        className="sticky-header"
        style={{
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 10,
            backgroundColor: "#f8f9fa",
            padding: "10px",
        }}
    >
             <div className='d-flex justify-content-end'>
             <input
                type="text"
                className="form-control mb-3 col-md-3 mt-2"
                placeholder="Search in Report..."
                value={reportSearchQuery}
                onChange={(e) => setReportSearchQuery(e.target.value.toLowerCase())}
            />
             </div>
           </div>

            {/* Scrollable Content Area */}
            <div style={{ width: '100%', overflowY: 'auto', overflowX : 'auto', maxHeight: 'calc(90vh - 80px)', padding: '10px' }}>
                <table className="table table-striped">
                <thead style={{ position: "sticky", top: "0", zIndex: "1", backgroundColor: "#f8f9fa" }}>
                        <tr>
                            <th>Sr#</th>
                            <th>Invoice#</th>
                            <th>Name</th>
                            <th>Post</th>
                            <th>Role</th>
                            <th>Month</th>
                            <th>B.Salary</th>
                            <th>Add.Increm.</th>
                            <th>H.Rent</th>
                            <th>2nd_Shift_Honor</th>
                            <th>Prev.Increm</th>
                            <th>Curr.Increm</th>
                            <th>T.Increment</th>
                            <th>Prev.Adhoc</th>
                            <th>Curr.Adhoc</th>
                            <th>T.Adhoc</th>
                            
                            <th>G.Salary</th>

                            <th>Security.Deduct</th>
                            {/* <th>T.Secur.Deduct</th> */}
                            <th>Loan.Deduct</th>
                            {/* <th>T.Loan.Deduct</th> */}
                            <th>Graduity</th>
                            <th>Allowance</th>
                            <th>Other.Deduction</th>
                            <th>DOW</th>
                            <th>Overtime</th>

                            <th>Inc.Tax</th>
                            <th>Rebate</th>
                            <th>Pessi</th>
                            <th style={{"color":"red"}}>EOBI(Deduc)</th>
                            <th style={{"color":"red"}}>CPF(Deduc)</th>
                            <th style={{"color":"red"}}>Bus(Deduc)</th>
                            <th>Med.Allownce</th>
                            <th>principal.allownce</th>
                            <th>special.allownce</th>
                            <th>Net.Salary</th>
                          
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReportData.map((item, index) => (
                            <tr key={index}>
                                 <td>{index + 1}</td> {/* Serial Number */}
                                <td>{item.invoice_no}</td>
                                <td>{item.full_name}</td>
                                <td>{item.employee_post}</td>
                                <td>{item.employee_role}</td>
                                <td>{item.for_the_month}</td>
                                <td>{item.basic_salary}</td>
                                <td>{item.additional_increments}</td>
                                <td>{item.house_rent}</td>
                                <td>{item.second_shift_honorarium}</td>
                                <td>{item.previous_increments}</td>
                                <td>{item.current_increment}</td>
                                <td>{item.total_increments}</td>
                                <td>{item.previous_adhoc}</td>
                                <td>{item.current_adhoc}</td>
                                <td>{item.total_adhoc}</td>
                               
                                <td>{item.net_salary + item.eobi + item.cpf}</td>
                                <td>{item.security_deduct}</td>
                                {/* <td>{item.total_security_deduct}</td> */}
                                <td>{item.loan_deduct}</td>
                                {/* <td>{item.total_loan_deduct}</td> */}
                                <td>{item.graduity}</td>
                                <td>{item.others_allownce}</td>
                                <td>{item.other_deduction}</td>
                                <td>{item.dow}</td>
                                <td>{item.overtime_amount}</td>
                                <td>{item.income_tax}</td>
                                <td>{item.rebate}</td>
                                <td>{item.pessi}</td>
                                <td>{item.eobi}</td>
                                <td>{item.cpf}</td>
                                <td>{item.bus_charges}</td>
                                <td>{item.medical_allownce}</td>
                                <td>{item.principal_allownce}</td>
                                <td>{item.special_allownce}</td>
                                <td>{item.remaining}</td>
                            </tr>
                        ))}

                        {/* Grand Total Row */}
                        <tr className="font-weight-bold">
                            <td colSpan="6" className="text-right">Grand Totals</td>
                            <td>{grandTotals.basic_salary}</td>
                            <td>{grandTotals.additional_increments}</td>
                            <td>{grandTotals.house_rent}</td>
                            <td>{grandTotals.second_shift_honorarium}</td>
                            <td>{grandTotals.previous_increments}</td>
                            <td>{grandTotals.current_increment}</td>
                            <td>{grandTotals.total_increments}</td>
                            <td>{grandTotals.previous_adhoc}</td>
                            <td>{grandTotals.current_adhoc}</td>
                            <td>{grandTotals.total_adhoc}</td>
                           
                            <td>{grandTotals.net_salary + grandTotals.eobi + grandTotals.cpf}</td>
                            <td>{grandTotals.security_deduct}</td>
                            {/* <td>{grandTotals.total_security_deduct}</td> */}
                            <td>{grandTotals.loan_deduct}</td>
                            {/* <td>{grandTotals.total_loan_deduct}</td> */}
                            <td>{grandTotals.graduity}</td>
                            <td>{grandTotals.others_allownce}</td>
                            <td>{grandTotals.other_deduction}</td>
                            <td>{grandTotals.dow}</td>
                            <td>{grandTotals.overtime_amount}</td>
                            <td>{grandTotals.income_tax}</td>
                            <td>{grandTotals.rebate}</td>
                            <td>{grandTotals.pessi}</td>
                            <td>{grandTotals.eobi}</td>
                            <td>{grandTotals.cpf}</td>
                            <td>{grandTotals.bus_charges}</td>
                            <td>{grandTotals.medical_allownce}</td>
                            <td>{grandTotals.principal_allownce}</td>
                            <td>{grandTotals.special_allownce}</td>
                            <td>{grandTotals.remaining}</td>
                          
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>
)}                    
                </div>
            </div>
        </>
    );
}

export default SchoolSalaryList;

