// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import { useLocation } from 'react-router-dom';
// // import Barcode from 'react-barcode';
// import { useReactToPrint } from 'react-to-print';

// function ViewSalarySlip() {
//   const { user } = useAuth();
//   const [salaryData, setSalaryData] = useState([]);
//   const location = useLocation();
//   const { voucherIds, for_the_month } = location.state || {};
//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

  
//   useEffect(() => {

//     console.log(voucherIds, for_the_month);

//     const fetchSalarySlips = (invoices, for_the_month, campus_id) => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+`/view-salary-slips`, {
//         params: {
//           invoices: invoices, // Pass the invoices as query parameters
//           for_the_month: for_the_month,
//           campus_id: campus_id
//         }
//       })
//       .then(res => {
//         const salarySlips = res.data.results;
//         setSalaryData(salarySlips);
//         console.log(salarySlips);
//       })
//       .catch(error => {
//         console.error('Error fetching salary slips:', error);
//       });
//     };
  
//     if (user && user.user.campus_id) {
//       fetchSalarySlips(voucherIds, for_the_month, user.user.campus_id);
//     }
//   }, [user]);  // Add 'for_the_month' to the dependencies if needed
  
  
  

//   return (
//     <div>
//       <button onClick={handlePrint} className='btn btn-warning btn-sm ml-4 mt-2'>
//         <i className="fa fa-print" aria-hidden="true"></i> Print
//       </button>
//       <div className='data' ref={componentRef}>
//         {/* Map through salaryData and print 4 salary slips per page */}
//         <div className="salary-page">
//           {salaryData.map((salarySlip, index) => (
//             <SingleSalarySlip key={index} data={salarySlip} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const SingleSalarySlip = ({ data }) => {
//   const {
//     invoice_no,
//     full_name,
//     employee_post,
//     pay_scale,
//     employee_role,
//     for_the_month,
//     basic_salary,
//     additional_increments,
//     house_rent,
//     second_shift_honorarium,
//     previous_increments,
//     current_increment,
//     total_increments,
//     previous_adhoc,
//     current_adhoc,
//     total_adhoc,
//     security_deduct,
//     total_security_deduct,
//     loan_deduct,
//     total_loan_deduct,
//     income_tax,
//     rebate,
//     // graduity,
//     others_allownce,
//     dow,
//     net_salary,
//     remaining,
//     pessi,
//     eobi,
//     overtime_amount
//   } = data;

//   // function convertDates(date) {
//   //   const d = new Date(date);
//   //   const day = d.getDate().toString().padStart(2, '0');
//   //   const month = (d.getMonth() + 1).toString().padStart(2, '0');
//   //   const year = d.getFullYear();
//   //   return `${day}-${month}-${year}`;
//   // }

//   function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = today.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   return (
//     <div className="salary-slip-container" style={{ pageBreakAfter: "always" }}>
//       <div className="salary-slip">
//         <div className="salary-slip-header">
//           <h5>Salary Slip</h5>
//         </div>
//         <div>
          
//         <table className="salary-slip-details">
//         <thead>
//           <tr>
//             <th>Invoice#</th>
//             <td>{invoice_no}</td>
//             <th>Month</th>
//             <td>{for_the_month}</td>
//           </tr>
//           <tr>
//             <th>Date</th>
//             <td colSpan={2}>{getCurrentDate()}</td>
//           </tr>
//           <tr>
//             <th>Name</th>
//             <td>{full_name}</td>
//             <th>Post</th>
//             <td>{employee_post}</td>
//           </tr>
//           <tr>
//             <th>Scale</th>
//             <td>{pay_scale}</td>
//             <th>Role</th>
//             <td>{employee_role}</td>
//           </tr>
//         </thead>

//         <tbody>
//           <tr>
//             <th colSpan={2}>Particulars</th>
//             <th colSpan={2} className="amount">Amount (Rs)</th>
//           </tr>
//           <tr>
//             <td colSpan={2}>Basic Salary</td>
//             <td colSpan={2} className="amount">{basic_salary}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Add.Increm</td>
//             <td colSpan={2} className="amount">{additional_increments}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>House Rent</td>
//             <td colSpan={2} className="amount">{house_rent}</td>
//           </tr>

//           <tr>
//             <td colSpan={2}>2nd_Shift.Honor</td>
//             <td colSpan={2} className="amount">{second_shift_honorarium}</td>
//           </tr>

//           <tr>
//             <td colSpan={2}>Prev.Increm.</td>
//             <td colSpan={2} className="amount">{previous_increments}</td>
//           </tr>

//           <tr>
//             <td colSpan={2}>Curr.Increm</td>
//             <td colSpan={2} className="amount">{current_increment}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>T.Increments</td>
//             <td colSpan={2} className="amount">{total_increments}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Prev.Adhoc</td>
//             <td colSpan={2} className="amount">{previous_adhoc}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Curr.Adhoc</td>
//             <td colSpan={2} className="amount">{current_adhoc}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>T.Adhoc</td>
//             <td colSpan={2} className="amount">{total_adhoc}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Overtime</td>
//             <td colSpan={2} className="amount">{overtime_amount}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Security.Deduc.</td>
//             <td colSpan={2} className="amount">{security_deduct}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>T.Security.Deduc.</td>
//             <td colSpan={2} className="amount">{total_security_deduct}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Loan.Deduc.</td>
//             <td colSpan={2} className="amount">{loan_deduct}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>T.Loan.Deduct</td>
//             <td colSpan={2} className="amount">{total_loan_deduct}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Income Tax</td>
//             <td colSpan={2} className="amount">{income_tax}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Rebate</td>
//             <td colSpan={2} className="amount">{rebate}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>Others Allowance</td>
//             <td colSpan={2} className="amount">{others_allownce}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>DOW</td>
//             <td colSpan={2} className="amount">{dow}</td>
//           </tr>
          
//           <tr>
//             <td colSpan={2}>PESSI</td>
//             <td colSpan={2} className="amount">{pessi}</td>
//           </tr>
//           <tr>
//             <td colSpan={2}>EOBI</td>
//             <td colSpan={2} className="amount">{eobi}</td>
//           </tr>
//           {/* <tr>
//             <td colSpan={2}>Net Salary</td>
//             <td colSpan={2} className="amount">{net_salary}</td>
//           </tr> */}
//           <tr>
//             <td colSpan={2}>Net Salary</td>
//             <td colSpan={2} className="amount">{remaining}</td>
//           </tr>
//         </tbody>
//       </table>

//         </div>
      
//       </div>
//     </div>
//   );
// };

// export default ViewSalarySlip;


// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import { useLocation } from 'react-router-dom';
// import { useReactToPrint } from 'react-to-print';

// function ViewSalarySlip() {
//   const { user } = useAuth();
//   const [salaryData, setSalaryData] = useState([]);
//   const location = useLocation();
//   const { voucherIds, for_the_month } = location.state || {};
//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   useEffect(() => {
//     console.log(voucherIds, for_the_month);

//     const fetchSalarySlips = (invoices, for_the_month, campus_id) => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+`/view-salary-slips`, {
//         params: {
//           invoices: invoices,
//           for_the_month: for_the_month,
//           campus_id: campus_id
//         }
//       })
//       .then(res => {
//         const salarySlips = res.data.results;
//         setSalaryData(salarySlips);
//         console.log(salarySlips);
//       })
//       .catch(error => {
//         console.error('Error fetching salary slips:', error);
//       });
//     };
  
//     if (user && user.user.campus_id) {
//       fetchSalarySlips(voucherIds, for_the_month, user.user.campus_id);
//     }
//   }, [user]);

//   return (
//     <div>
//       <button onClick={handlePrint} className='btn btn-warning btn-sm ml-4 mt-2'>
//         <i className="fa fa-print" aria-hidden="true"></i> Print
//       </button>
//       <div className='data' ref={componentRef}>
//         <div className="salary-page">
//           {salaryData.map((salarySlip, index) => (
//             <SingleSalarySlip key={index} data={salarySlip} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const SingleSalarySlip = ({ data }) => {
//   const {
//     invoice_no,
//     full_name,
//     employee_post,
//     pay_scale,
//     employee_role,
//     for_the_month,
//     basic_salary,
//     additional_increments,
//     house_rent,
//     second_shift_honorarium,
//     previous_increments,
//     current_increment,
//     total_increments,
//     previous_adhoc,
//     current_adhoc,
//     total_adhoc,
//     security_deduct,
//     total_security_deduct,
//     loan_deduct,
//     total_loan_deduct,
//     income_tax,
//     rebate,
//     others_allownce,
//     dow,
//     net_salary,
//     remaining,
//     pessi,
//     eobi,
//     overtime_amount
//   } = data;

//   function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const year = today.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   // Calculate gross totals
//   const grossTotal = (
//     parseFloat(basic_salary || 0) +
//     parseFloat(additional_increments || 0) +
//     parseFloat(house_rent || 0) +
//     parseFloat(second_shift_honorarium || 0) +
//     parseFloat(others_allownce || 0) +
//     parseFloat(total_increments || 0) +
//     parseFloat(total_adhoc || 0) +
//     parseFloat(overtime_amount || 0)
//   );

//   const deductionsTotal = (
//     parseFloat(security_deduct || 0) +
//     parseFloat(total_security_deduct || 0) +
//     parseFloat(loan_deduct || 0) +
//     parseFloat(total_loan_deduct || 0) +
//     parseFloat(income_tax || 0) +
//     parseFloat(pessi || 0) +
//     parseFloat(eobi || 0)
//   );

//   const netSalaryCalculated = grossTotal - deductionsTotal;

//   return (
//     <div className="salary-slip-container" style={{ pageBreakAfter: "always" }}>
//       <div className="salary-slip">
//         <div className="salary-slip-header">
//           <h5>Salary Slip</h5>
//         </div>
        
//         <table className="salary-slip-details">
//           <thead>
//             <tr>
//               <th>Invoice#</th>
//               <td>{invoice_no}</td>
//               <th>Month</th>
//               <td>{for_the_month}</td>
//               <td colSpan={3}></td>
//             </tr>
//             <tr>
//               <th>Date</th>
//               <td colSpan={6}>{getCurrentDate()}</td>
//             </tr>
//             <tr>
//               <th>Name</th>
//               <td>{full_name}</td>
//               <th>Post</th>
//               <td>{employee_post}</td>
//               <td colSpan={3}></td>
//             </tr>
//             <tr>
//               <th>Scale</th>
//               <td>{pay_scale}</td>
//               <th>Role</th>
//               <td>{employee_role}</td>
//               <td colSpan={3}></td>
//             </tr>
//           </thead>

//           <tbody>
//             {/* Header row for particulars */}
//             <tr>
//               <th colSpan={2}>Particulars</th>
//               <th className="amount">Amount (Rs)</th>
//               <th colSpan={2}>Particulars</th>
//               <th colSpan={2} className="amount">Amount (Rs)</th>
//             </tr>

//             {/* Row 1 */}
//             <tr>
//               <td colSpan={2}>Basic Salary</td>
//               <td className="amount">{basic_salary}</td>
//               <td colSpan={2}>Security.Deduc.</td>
//               <td colSpan={2} className="amount">{security_deduct}</td>
//             </tr>

//             {/* Row 2 */}
//             <tr>
//               <td colSpan={2}>Add.Increm</td>
//               <td className="amount">{additional_increments}</td>
//               <td colSpan={2}>T.Security.Deduc.</td>
//               <td colSpan={2} className="amount">{total_security_deduct}</td>
//             </tr>

//             {/* Row 3 */}
//             <tr>
//               <td colSpan={2}>House Rent</td>
//               <td className="amount">{house_rent}</td>
//               <td colSpan={2}>Loan.Deduc.</td>
//               <td colSpan={2} className="amount">{loan_deduct}</td>
//             </tr>

//             {/* Row 4 */}
//             <tr>
//               <td colSpan={2}>2nd_Shift.Honor</td>
//               <td className="amount">{second_shift_honorarium}</td>
//               <td colSpan={2}>T.Loan.Deduct</td>
//               <td colSpan={2} className="amount">{total_loan_deduct}</td>
//             </tr>

//             {/* Row 5 - Medical Allowance (using house_rent duplicate or others) */}
//             <tr>
//               <td colSpan={2}>Medical Allownce</td>
//               <td className="amount">{house_rent}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Row 6 - Principal Allowance */}
//             <tr>
//               <td colSpan={2}>Principal Allownce</td>
//               <td className="amount">{employee_post === 'Principal' ? 10000 : 0}</td>
//               <td colSpan={2}>Income Tax</td>
//               <td colSpan={2} className="amount">{income_tax}</td>
//             </tr>

//             {/* Row 7 */}
//             <tr>
//               <td colSpan={2}>Others Allowance</td>
//               <td className="amount">{others_allownce}</td>
//               <td colSpan={2}>PESSI</td>
//               <td colSpan={2} className="amount">{pessi}</td>
//             </tr>

//             {/* Row 8 */}
//             <tr>
//               <td colSpan={2}>T.Increments</td>
//               <td className="amount">{total_increments}</td>
//               <td colSpan={2}>EOBI</td>
//               <td colSpan={2} className="amount">{eobi}</td>
//             </tr>

//             {/* Row 9 */}
//             <tr>
//               <td colSpan={2}>T.Adhoc</td>
//               <td className="amount">{total_adhoc}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Row 10 */}
//             <tr>
//               <td colSpan={2}>Overtime</td>
//               <td className="amount">{overtime_amount}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Grand Totals */}
//             <tr style={{ fontWeight: 'bold' }}>
//               <td colSpan={2}>G.Total</td>
//               <td className="amount">{grossTotal.toFixed(0)}</td>
//               <td colSpan={2}>G.Total</td>
//               <td colSpan={2} className="amount">{deductionsTotal.toFixed(0)}</td>
//             </tr>

//             {/* Net Salary */}
//             <tr style={{ fontWeight: 'bold' }}>
//               <td colSpan={4}></td>
//               <td colSpan={1}>Net Salary</td>
//               <td colSpan={2} className="amount">{remaining || netSalaryCalculated.toFixed(0)}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewSalarySlip;



// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import { useLocation } from 'react-router-dom';
// import { useReactToPrint } from 'react-to-print';

// function ViewSalarySlip() {
//   const { user } = useAuth();
//   const [salaryData, setSalaryData] = useState([]);
//   const location = useLocation();
//   const { voucherIds, for_the_month } = location.state || {};
//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   useEffect(() => {
//     console.log(voucherIds, for_the_month);

//     const fetchSalarySlips = (invoices, for_the_month, campus_id) => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+`/view-salary-slips`, {
//         params: {
//           invoices: invoices,
//           for_the_month: for_the_month,
//           campus_id: campus_id
//         }
//       })
//       .then(res => {
//         const salarySlips = res.data.results;
//         setSalaryData(salarySlips);
//         console.log(salarySlips);
//       })
//       .catch(error => {
//         console.error('Error fetching salary slips:', error);
//       });
//     };
  
//     if (user && user.user.campus_id) {
//       fetchSalarySlips(voucherIds, for_the_month, user.user.campus_id);
//     }
//   }, [user]);

//   return (
//     <div>
//       <button onClick={handlePrint} className='btn btn-warning btn-sm ml-4 mt-2'>
//         <i className="fa fa-print" aria-hidden="true"></i> Print
//       </button>
//       <style>{`
//         .salary-slips-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 10px;
//           padding: 10px;
//         }
        
//         .salary-slip-container {
//           border: 1px solid #000;
//           padding: 8px;
//           font-size: 9px;
//         }
        
//         .salary-slip-header {
//           text-align: center;
//           border-bottom: 1px solid #000;
//           margin-bottom: 5px;
//         }
        
//         .salary-slip-header h5 {
//           margin: 0;
//           font-size: 12px;
//           font-weight: bold;
//         }
        
//         .salary-slip-details {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .salary-slip-details th,
//         .salary-slip-details td {
//           border: 1px solid #000;
//           padding: 2px 4px;
//           font-size: 8px;
//         }
        
//         .salary-slip-details th {
//           background-color: #f0f0f0;
//           font-weight: bold;
//         }
        
//         .salary-slip-details .amount {
//           text-align: right;
//         }
        
//         @media print {
//           .btn {
//             display: none !important;
//           }
          
//           .salary-slips-grid {
//             display: grid;
//             grid-template-columns: repeat(3, 1fr);
//             gap: 10px;
//             padding: 0;
//           }
          
//           .salary-slip-container {
//             page-break-inside: avoid;
//             font-size: 8px;
//           }
          
//           @page {
//             size: landscape;
//             margin: 10mm;
//           }
//         }
//       `}</style>
//       <div className='data' ref={componentRef}>
//         <div className="salary-slips-grid">
//           {salaryData.map((salarySlip, index) => (
//             <SingleSalarySlip key={index} data={salarySlip} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const SingleSalarySlip = ({ data }) => {
//   const {
//     invoice_no,
//     full_name,
//     employee_post,
//     pay_scale,
//     employee_role,
//     for_the_month,
//     basic_salary,
//     additional_increments,
//     house_rent,
//     second_shift_honorarium,
//     previous_increments,
//     current_increment,
//     total_increments,
//     previous_adhoc,
//     current_adhoc,
//     total_adhoc,
//     security_deduct,
//     total_security_deduct,
//     loan_deduct,
//     total_loan_deduct,
//     income_tax,
//     rebate,
//     others_allownce,
//     dow,
//     net_salary,
//     remaining,
//     pessi,
//     eobi,
//     overtime_amount
//   } = data;

//   function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const year = today.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   // Calculate gross totals
//   const grossTotal = (
//     parseFloat(basic_salary || 0) +
//     parseFloat(additional_increments || 0) +
//     parseFloat(house_rent || 0) +
//     parseFloat(second_shift_honorarium || 0) +
//     parseFloat(others_allownce || 0) +
//     parseFloat(total_increments || 0) +
//     parseFloat(total_adhoc || 0) +
//     parseFloat(overtime_amount || 0)
//   );

//   const deductionsTotal = (
//     parseFloat(security_deduct || 0) +
//     parseFloat(total_security_deduct || 0) +
//     parseFloat(loan_deduct || 0) +
//     parseFloat(total_loan_deduct || 0) +
//     parseFloat(income_tax || 0) +
//     parseFloat(pessi || 0) +
//     parseFloat(eobi || 0)
//   );

//   const netSalaryCalculated = grossTotal - deductionsTotal;

//   return (
//     <div className="salary-slip-container">
//       <div className="salary-slip">
//         <div className="salary-slip-header">
//           <h5>Salary Slip</h5>
//         </div>
        
//         <table className="salary-slip-details">
//           <thead>
//             <tr>
//               <th>Invoice#</th>
//               <td>{invoice_no}</td>
//               <th>Month</th>
//               <td>{for_the_month}</td>
//               <td colSpan={3}></td>
//             </tr>
//             <tr>
//               <th>Date</th>
//               <td colSpan={6}>{getCurrentDate()}</td>
//             </tr>
//             <tr>
//               <th>Name</th>
//               <td>{full_name}</td>
//               <th>Post</th>
//               <td>{employee_post}</td>
//               <td colSpan={3}></td>
//             </tr>
//             <tr>
//               <th>Scale</th>
//               <td>{pay_scale}</td>
//               <th>Role</th>
//               <td>{employee_role}</td>
//               <td colSpan={3}></td>
//             </tr>
//           </thead>

//           <tbody>
//             {/* Header row for particulars */}
//             <tr>
//               <th colSpan={2}>Particulars</th>
//               <th className="amount">Amount (Rs)</th>
//               <th colSpan={2}>Particulars</th>
//               <th colSpan={2} className="amount">Amount (Rs)</th>
//             </tr>

//             {/* Row 1 */}
//             <tr>
//               <td colSpan={2}>Basic Salary</td>
//               <td className="amount">{basic_salary}</td>
//               <td colSpan={2}>Security.Deduc.</td>
//               <td colSpan={2} className="amount">{security_deduct}</td>
//             </tr>

//             {/* Row 2 */}
//             <tr>
//               <td colSpan={2}>Add.Increm</td>
//               <td className="amount">{additional_increments}</td>
//               <td colSpan={2}>T.Security.Deduc.</td>
//               <td colSpan={2} className="amount">{total_security_deduct}</td>
//             </tr>

//             {/* Row 3 */}
//             <tr>
//               <td colSpan={2}>House Rent</td>
//               <td className="amount">{house_rent}</td>
//               <td colSpan={2}>Loan.Deduc.</td>
//               <td colSpan={2} className="amount">{loan_deduct}</td>
//             </tr>

//             {/* Row 4 */}
//             <tr>
//               <td colSpan={2}>2nd_Shift.Honor</td>
//               <td className="amount">{second_shift_honorarium}</td>
//               <td colSpan={2}>T.Loan.Deduct</td>
//               <td colSpan={2} className="amount">{total_loan_deduct}</td>
//             </tr>

//             {/* Row 5 - Medical Allowance (using house_rent duplicate or others) */}
//             <tr>
//               <td colSpan={2}>Medical Allownce</td>
//               <td className="amount">{house_rent}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Row 6 - Principal Allowance */}
//             <tr>
//               <td colSpan={2}>Principal Allownce</td>
//               <td className="amount">{employee_post === 'Principal' ? 10000 : 0}</td>
//               <td colSpan={2}>Income Tax</td>
//               <td colSpan={2} className="amount">{income_tax}</td>
//             </tr>

//             {/* Row 7 */}
//             <tr>
//               <td colSpan={2}>Others Allowance</td>
//               <td className="amount">{others_allownce}</td>
//               <td colSpan={2}>PESSI</td>
//               <td colSpan={2} className="amount">{pessi}</td>
//             </tr>

//             {/* Row 8 */}
//             <tr>
//               <td colSpan={2}>T.Increments</td>
//               <td className="amount">{total_increments}</td>
//               <td colSpan={2}>EOBI</td>
//               <td colSpan={2} className="amount">{eobi}</td>
//             </tr>

//             {/* Row 9 */}
//             <tr>
//               <td colSpan={2}>T.Adhoc</td>
//               <td className="amount">{total_adhoc}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Row 10 */}
//             <tr>
//               <td colSpan={2}>Overtime</td>
//               <td className="amount">{overtime_amount}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Grand Totals */}
//             <tr style={{ fontWeight: 'bold' }}>
//               <td colSpan={2}>G.Total</td>
//               <td className="amount">{grossTotal.toFixed(0)}</td>
//               <td colSpan={2}>G.Total</td>
//               <td colSpan={2} className="amount">{deductionsTotal.toFixed(0)}</td>
//             </tr>

//             {/* Net Salary */}
//             <tr style={{ fontWeight: 'bold' }}>
//               <td colSpan={4}></td>
//               <td colSpan={1}>Net Salary</td>
//               <td colSpan={2} className="amount">{remaining || netSalaryCalculated.toFixed(0)}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewSalarySlip;



// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext';
// import { useLocation } from 'react-router-dom';
// import { useReactToPrint } from 'react-to-print';

// function ViewSalarySlip() {
//   const { user } = useAuth();
//   const [salaryData, setSalaryData] = useState([]);
//   const location = useLocation();
//   const { voucherIds, for_the_month } = location.state || {};
//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   useEffect(() => {
//     console.log(voucherIds, for_the_month);

//     const fetchSalarySlips = (invoices, for_the_month, campus_id) => {
//       axios.get(process.env.REACT_APP_API_BASE_URL+`/view-salary-slips`, {
//         params: {
//           invoices: invoices,
//           for_the_month: for_the_month,
//           campus_id: campus_id
//         }
//       })
//       .then(res => {
//         const salarySlips = res.data.results;
//         setSalaryData(salarySlips);
//         console.log(salarySlips);
//       })
//       .catch(error => {
//         console.error('Error fetching salary slips:', error);
//       });
//     };
  
//     if (user && user.user.campus_id) {
//       fetchSalarySlips(voucherIds, for_the_month, user.user.campus_id);
//     }
//   }, [user]);

//   return (
//     <div>
//       <button onClick={handlePrint} className='btn btn-warning btn-sm ml-4 mt-2'>
//         <i className="fa fa-print" aria-hidden="true"></i> Print
//       </button>
//       <style>{`
//         .salary-slips-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 15px;
//           padding: 15px;
//         }
        
//         .salary-slip-container {
//           border: 1px solid #000;
//           padding: 10px;
//           font-size: 10px;
//         }
        
//         .salary-slip-header {
//           text-align: center;
//           border-bottom: 1px solid #000;
//           margin-bottom: 5px;
//         }
        
//         .salary-slip-header h5 {
//           margin: 0;
//           font-size: 12px;
//           font-weight: bold;
//         }
        
//         .salary-slip-details {
//           width: 100%;
//           border-collapse: collapse;
//         }
        
//         .salary-slip-details th,
//         .salary-slip-details td {
//           border: 1px solid #000;
//           padding: 3px 5px;
//           font-size: 9px;
//         }
        
//         .salary-slip-details th {
//           background-color: #f0f0f0;
//           font-weight: bold;
//         }
        
//         .salary-slip-details .amount {
//           text-align: right;
//         }
        
//         @media print {
//           .btn {
//             display: none !important;
//           }
          
//           .salary-slips-grid {
//             display: grid;
//             grid-template-columns: repeat(2, 1fr);
//             gap: 15px;
//             padding: 0;
//           }
          
//           .salary-slip-container {
//             page-break-inside: avoid;
//             font-size: 9px;
//           }
          
//           @page {
//             size: landscape;
//             margin: 10mm;
//           }
//         }
//       `}</style>
//       <div className='data' ref={componentRef}>
//         <div className="salary-slips-grid">
//           {salaryData.map((salarySlip, index) => (
//             <SingleSalarySlip key={index} data={salarySlip} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// const SingleSalarySlip = ({ data }) => {
//   const {
//     invoice_no,
//     full_name,
//     employee_post,
//     pay_scale,
//     employee_role,
//     for_the_month,
//     basic_salary,
//     additional_increments,
//     house_rent,
//     second_shift_honorarium,
//     previous_increments,
//     current_increment,
//     total_increments,
//     previous_adhoc,
//     current_adhoc,
//     total_adhoc,
//     security_deduct,
//     total_security_deduct,
//     loan_deduct,
//     total_loan_deduct,
//     income_tax,
//     rebate,
//     others_allownce,
//     dow,
//     net_salary,
//     remaining,
//     pessi,
//     eobi,
//     overtime_amount
//   } = data;

//   function getCurrentDate() {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const year = today.getFullYear();
//     return `${day}-${month}-${year}`;
//   }

//   // Calculate gross totals
//   const grossTotal = (
//     parseFloat(basic_salary || 0) +
//     parseFloat(additional_increments || 0) +
//     parseFloat(house_rent || 0) +
//     parseFloat(second_shift_honorarium || 0) +
//     parseFloat(others_allownce || 0) +
//     parseFloat(total_increments || 0) +
//     parseFloat(total_adhoc || 0) +
//     parseFloat(overtime_amount || 0)
//   );

//   const deductionsTotal = (
//     parseFloat(security_deduct || 0) +
//     parseFloat(total_security_deduct || 0) +
//     parseFloat(loan_deduct || 0) +
//     parseFloat(total_loan_deduct || 0) +
//     parseFloat(income_tax || 0) +
//     parseFloat(pessi || 0) +
//     parseFloat(eobi || 0)
//   );

//   const netSalaryCalculated = grossTotal - deductionsTotal;

//   return (
//     <div className="salary-slip-container">
//       <div className="salary-slip">
//         <div className="salary-slip-header">
//           <h5>Salary Slip</h5>
//         </div>
        
//         <table className="salary-slip-details">
//           <thead>
//             <tr>
//               <th>Invoice#</th>
//               <td>{invoice_no}</td>
//               <th>Month</th>
//               <td>{for_the_month}</td>
//               <td colSpan={3}></td>
//             </tr>
//             <tr>
//               <th>Date</th>
//               <td colSpan={6}>{getCurrentDate()}</td>
//             </tr>
//             <tr>
//               <th>Name</th>
//               <td>{full_name}</td>
//               <th>Post</th>
//               <td>{employee_post}</td>
//               <td colSpan={3}></td>
//             </tr>
//             <tr>
//               <th>Scale</th>
//               <td>{pay_scale}</td>
//               <th>Role</th>
//               <td>{employee_role}</td>
//               <td colSpan={3}></td>
//             </tr>
//           </thead>

//           <tbody>
//             {/* Header row for particulars */}
//             <tr>
//               <th colSpan={2}>Particulars</th>
//               <th className="amount">Amount (Rs)</th>
//               <th colSpan={2}>Particulars</th>
//               <th colSpan={2} className="amount">Amount (Rs)</th>
//             </tr>

//             {/* Row 1 */}
//             <tr>
//               <td colSpan={2}>Basic Salary</td>
//               <td className="amount">{basic_salary}</td>
//               <td colSpan={2}>Security.Deduc.</td>
//               <td colSpan={2} className="amount">{security_deduct}</td>
//             </tr>

//             {/* Row 2 */}
//             <tr>
//               <td colSpan={2}>Add.Increm</td>
//               <td className="amount">{additional_increments}</td>
//               <td colSpan={2}>T.Security.Deduc.</td>
//               <td colSpan={2} className="amount">{total_security_deduct}</td>
//             </tr>

//             {/* Row 3 */}
//             <tr>
//               <td colSpan={2}>House Rent</td>
//               <td className="amount">{house_rent}</td>
//               <td colSpan={2}>Loan.Deduc.</td>
//               <td colSpan={2} className="amount">{loan_deduct}</td>
//             </tr>

//             {/* Row 4 */}
//             <tr>
//               <td colSpan={2}>2nd_Shift.Honor</td>
//               <td className="amount">{second_shift_honorarium}</td>
//               <td colSpan={2}>T.Loan.Deduct</td>
//               <td colSpan={2} className="amount">{total_loan_deduct}</td>
//             </tr>

//             {/* Row 5 - Medical Allowance (using house_rent duplicate or others) */}
//             <tr>
//               <td colSpan={2}>Medical Allownce</td>
//               <td className="amount">{house_rent}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Row 6 - Principal Allowance */}
//             <tr>
//               <td colSpan={2}>Principal Allownce</td>
//               <td className="amount">{employee_post === 'Principal' ? 10000 : 0}</td>
//               <td colSpan={2}>Income Tax</td>
//               <td colSpan={2} className="amount">{income_tax}</td>
//             </tr>

//             {/* Row 7 */}
//             <tr>
//               <td colSpan={2}>Others Allowance</td>
//               <td className="amount">{others_allownce}</td>
//               <td colSpan={2}>PESSI</td>
//               <td colSpan={2} className="amount">{pessi}</td>
//             </tr>

//             {/* Row 8 */}
//             <tr>
//               <td colSpan={2}>T.Increments</td>
//               <td className="amount">{total_increments}</td>
//               <td colSpan={2}>EOBI</td>
//               <td colSpan={2} className="amount">{eobi}</td>
//             </tr>

//             {/* Row 9 */}
//             <tr>
//               <td colSpan={2}>T.Adhoc</td>
//               <td className="amount">{total_adhoc}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Row 10 */}
//             <tr>
//               <td colSpan={2}>Overtime</td>
//               <td className="amount">{overtime_amount}</td>
//               <td colSpan={2}></td>
//               <td colSpan={2} className="amount"></td>
//             </tr>

//             {/* Grand Totals */}
//             <tr style={{ fontWeight: 'bold' }}>
//               <td colSpan={2}>G.Total</td>
//               <td className="amount">{grossTotal.toFixed(0)}</td>
//               <td colSpan={2}>G.Total</td>
//               <td colSpan={2} className="amount">{deductionsTotal.toFixed(0)}</td>
//             </tr>

//             {/* Net Salary */}
//             <tr style={{ fontWeight: 'bold' }}>
//               <td colSpan={4}></td>
//               <td colSpan={1}>Net Salary</td>
//               <td colSpan={2} className="amount">{remaining || netSalaryCalculated.toFixed(0)}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewSalarySlip;


import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

function ViewSalarySlip() {
  const { user } = useAuth();
  const [salaryData, setSalaryData] = useState([]);
  const location = useLocation();
  const { voucherIds, for_the_month } = location.state || {};
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    console.log(voucherIds, for_the_month);

    const fetchSalarySlips = (invoices, for_the_month, campus_id) => {
      axios.get(process.env.REACT_APP_API_BASE_URL+`/view-salary-slips`, {
        params: {
          invoices: invoices,
          for_the_month: for_the_month,
          campus_id: campus_id
        }
      })
      .then(res => {
        const salarySlips = res.data.results;
        setSalaryData(salarySlips);
        console.log(salarySlips);
      })
      .catch(error => {
        console.error('Error fetching salary slips:', error);
      });
    };
  
    if (user && user.user.campus_id) {
      fetchSalarySlips(voucherIds, for_the_month, user.user.campus_id);
    }
  }, [user]);

  return (
    <div>
      <button onClick={handlePrint} className='btn btn-warning btn-sm ml-4 mt-2'>
        <i className="fa fa-print" aria-hidden="true"></i> Print
      </button>
      <style>{`
        .salary-slips-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          padding: 15px;
        }
        
        .salary-slip-container {
          border: 1px solid #000;
          padding: 12px;
          font-size: 13px;
        }
        
        .salary-slip-header {
          text-align: center;
          border-bottom: 1px solid #000;
          margin-bottom: 8px;
        }
        
        .salary-slip-header h5 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }
        
        .salary-slip-details {
          width: 100%;
          border-collapse: collapse;
        }
        
        .salary-slip-details th,
        .salary-slip-details td {
          border: 1px solid #000;
          padding: 4px 6px;
          font-size: 16px;
        }
        
        .salary-slip-details th {
          background-color: #f0f0f0;
          font-weight: bold;
        }
        
        .salary-slip-details .amount {
          text-align: right;
        }
        
        @media print {
          .btn {
            display: none !important;
          }
          
          .salary-slips-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            padding: 0;
          }
          
          .salary-slip-container {
            page-break-inside: avoid;
            font-size: 12px;
            padding:20px !important;
          }
          
          @page {
            size: landscape;
            margin: 10mm;
          }
        }
      `}</style>
      <div className='data' ref={componentRef}>
        <div className="salary-slips-grid">
          {salaryData.map((salarySlip, index) => (
            <SingleSalarySlip key={index} data={salarySlip} />
          ))}
        </div>
      </div>
    </div>
  );
}

const SingleSalarySlip = ({ data }) => {
  const {
    invoice_no,
    full_name,
    employee_post,
    pay_scale,
    employee_role,
    for_the_month,
    basic_salary,
    additional_increments,
    house_rent,
    second_shift_honorarium,
    previous_increments,
    current_increment,
    total_increments,
    previous_adhoc,
    current_adhoc,
    total_adhoc,
    security_deduct,
    total_security_deduct,
    loan_deduct,
    total_loan_deduct,
    income_tax,
    rebate,
    others_allownce,
    dow,
    net_salary,
    remaining,
    pessi,
    eobi,
    overtime_amount
  } = data;

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Calculate gross totals
  const grossTotal = (
    parseFloat(basic_salary || 0) +
    parseFloat(additional_increments || 0) +
    parseFloat(house_rent || 0) +
    parseFloat(second_shift_honorarium || 0) +
    parseFloat(others_allownce || 0) +
    parseFloat(total_increments || 0) +
    parseFloat(total_adhoc || 0) +
    parseFloat(overtime_amount || 0)
  );

  const deductionsTotal = (
    parseFloat(security_deduct || 0) +
    parseFloat(total_security_deduct || 0) +
    parseFloat(loan_deduct || 0) +
    parseFloat(total_loan_deduct || 0) +
    parseFloat(income_tax || 0) +
    parseFloat(pessi || 0) +
    parseFloat(eobi || 0)
  );

  const netSalaryCalculated = grossTotal - deductionsTotal;

  return (
    <div className="salary-slip-container">
      <div className="salary-slip">
        <div className="salary-slip-header">
          <h5>Salary Slip</h5>
        </div>
        
        <table className="salary-slip-details">
          <thead>
            <tr>
              <th>Invoice#</th>
              <td>{invoice_no}</td>
              <th>Month</th>
              <td>{for_the_month}</td>
              <td colSpan={3}></td>
            </tr>
            <tr>
              <th>Date</th>
              <td colSpan={6}>{getCurrentDate()}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{full_name}</td>
              <th>Post</th>
              <td>{employee_post}</td>
              <td colSpan={3}></td>
            </tr>
            <tr>
              <th>Scale</th>
              <td>{pay_scale}</td>
              <th>Role</th>
              <td>{employee_role}</td>
              <td colSpan={3}></td>
            </tr>
          </thead>

          <tbody>
            {/* Header row for particulars */}
            <tr>
              <th colSpan={2}>Particulars</th>
              <th className="amount">Amount (Rs)</th>
              <th colSpan={2}>Particulars</th>
              <th colSpan={2} className="amount">Amount (Rs)</th>
            </tr>

            {/* Row 1 */}
            <tr>
              <td colSpan={2}>Basic Salary</td>
              <td className="amount">{basic_salary}</td>
              <td colSpan={2}>Security.Deduc.</td>
              <td colSpan={2} className="amount">{security_deduct}</td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td colSpan={2}>Add.Increm</td>
              <td className="amount">{additional_increments}</td>
              <td colSpan={2}>T.Security.Deduc.</td>
              <td colSpan={2} className="amount">{total_security_deduct}</td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td colSpan={2}>House Rent</td>
              <td className="amount">{house_rent}</td>
              <td colSpan={2}>Loan.Deduc.</td>
              <td colSpan={2} className="amount">{loan_deduct}</td>
            </tr>

            {/* Row 4 */}
            <tr>
              <td colSpan={2}>2nd_Shift.Honor</td>
              <td className="amount">{second_shift_honorarium}</td>
              <td colSpan={2}>T.Loan.Deduct</td>
              <td colSpan={2} className="amount">{total_loan_deduct}</td>
            </tr>

            {/* Row 5 - Medical Allowance (using house_rent duplicate or others) */}
            <tr>
              <td colSpan={2}>Medical Allownce</td>
              <td className="amount">{house_rent}</td>
              <td colSpan={2}></td>
              <td colSpan={2} className="amount"></td>
            </tr>

            {/* Row 6 - Principal Allowance */}
            <tr>
              <td colSpan={2}>Principal Allownce</td>
              <td className="amount">{employee_post === 'Principal' ? 10000 : 0}</td>
              <td colSpan={2}>Income Tax</td>
              <td colSpan={2} className="amount">{income_tax}</td>
            </tr>

            {/* Row 7 */}
            <tr>
              <td colSpan={2}>Others Allowance</td>
              <td className="amount">{others_allownce}</td>
              <td colSpan={2}>PESSI</td>
              <td colSpan={2} className="amount">{pessi}</td>
            </tr>

            {/* Row 8 */}
            <tr>
              <td colSpan={2}>T.Increments</td>
              <td className="amount">{total_increments}</td>
              <td colSpan={2}>EOBI</td>
              <td colSpan={2} className="amount">{eobi}</td>
            </tr>

            {/* Row 9 */}
            <tr>
              <td colSpan={2}>T.Adhoc</td>
              <td className="amount">{total_adhoc}</td>
              <td colSpan={2}></td>
              <td colSpan={2} className="amount"></td>
            </tr>

            {/* Row 10 */}
            <tr>
              <td colSpan={2}>Overtime</td>
              <td className="amount">{overtime_amount}</td>
              <td colSpan={2}></td>
              <td colSpan={2} className="amount"></td>
            </tr>

            {/* Grand Totals */}
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan={2}>G.Total</td>
              <td className="amount">{grossTotal.toFixed(0)}</td>
              <td colSpan={2}>G.Total</td>
              <td colSpan={2} className="amount">{deductionsTotal.toFixed(0)}</td>
            </tr>

            {/* Net Salary */}
            <tr style={{ fontWeight: 'bold' }}>
              <td colSpan={4}></td>
              <td colSpan={1}>Net Salary</td>
              <td colSpan={2} className="amount">{remaining || netSalaryCalculated.toFixed(0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSalarySlip;